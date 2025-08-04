import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image, 
  ActivityIndicator, Dimensions, KeyboardAvoidingView, Platform  } from "react-native";
import { ArrowLeft, Search, MapPin, Map, X } from "lucide-react-native"; // example icons; install lucide-react-native or use react-native-vector-icons
import { router} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ridesAPI, usersAPI  } from '../../services/api'; // Adjust the import path as needed
import webSocketService from '../../services/websocket-mock';
import MapView, { Marker, Polyline } from 'react-native-maps';
import LocationPicker from '../../components/LocationPicker';
import { LocationResult } from '../../services/mapService';

interface Ride {
  id: string;
  driver_id: number;
  car_id: number;
  start_location: string;
  end_location: string;
  start_time: string;
  seats_available: number;
  total_fare: number;
  status: string;
  start_latitude: number;
  start_longitude: number;
  end_latitude: number;
  end_longitude: number;
  main_stops?: string[];
  driver: {
    id: number;
    name: string;
    photo_url: string;
    driver_rating: number;
    ride_offered: number;
  };
  car: {
    id: number;
    make: string;
    model: string;
    seats: number;
  };
}
type UserProfile = {
  is_driver: boolean;
  is_rider: boolean;
};
export default function FindRideScreen() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [allRides, setAllRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [pickupLocation, setPickupLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 24.8607, // Default to Karachi coordinates
    longitude: 67.0011,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [showFromLocationPicker, setShowFromLocationPicker] = useState(false);
  const [showToLocationPicker, setShowToLocationPicker] = useState(false);
  const [fromLocationData, setFromLocationData] = useState<LocationResult | null>(null);
  const [toLocationData, setToLocationData] = useState<LocationResult | null>(null);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in meters
  };

  const getRandomColor = (index: number) => {
    const colors = [
      '#FF6B6B', // Red
      '#4ECDC4', // Teal
      '#45B7D1', // Blue
      '#A78BFA', // Purple
      '#FBBF24', // Amber
      '#34D399', // Emerald
      '#F472B6', // Pink
      '#60A5FA', // Light Blue
      '#F59E0B', // Orange
      '#10B981', // Green
    ];
    return colors[index % colors.length];
  };

  const isLocationInStops = (locationName: string, stops: string[]): boolean => {
    if (!stops || !Array.isArray(stops)) return false;
    
    const normalizedLocation = locationName.toLowerCase().trim();
    return stops.some(stop => 
      stop.toLowerCase().includes(normalizedLocation) || 
      normalizedLocation.includes(stop.toLowerCase())
    );
  };

  const findLocationIndexInStops = (locationName: string, stops: string[]): number => {
    if (!stops || !Array.isArray(stops)) return -1;
    
    const normalizedLocation = locationName.toLowerCase().trim();
    return stops.findIndex(stop => 
      stop.toLowerCase().includes(normalizedLocation) || 
      normalizedLocation.includes(stop.toLowerCase())
    );
  };

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profileData = await usersAPI.getProfile();
        setUserProfile(profileData);
      } catch (error) {
        console.error('Failed to load user profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };
    
    loadUserProfile();
  }, []);

  useEffect(() => {
    const fetchRides = async () => {
      // Don't fetch rides if user is not a rider
      if (userProfile && !userProfile.is_rider) return;

      try {
        setLoading(true);
        const data = await ridesAPI.searchRides();
        setAllRides(data);
        setRides(data);
        setError(null);
        if (data.length > 0) {
          const firstRide = data[0];
          setMapRegion({
            latitude: (firstRide.start_latitude + firstRide.end_latitude) / 2,
            longitude: (firstRide.start_longitude + firstRide.end_longitude) / 2,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          });
        }
      } catch (err: any) {
        console.error('Failed to fetch rides:', err);
        setError(err.message || 'Failed to load rides. Please try again.');
        setAllRides([]);
        setRides([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [userProfile]);

  useEffect(() => {
    // Set up WebSocket listeners for real-time ride updates
    const handleNewRide = (data: any) => {
      console.log('New ride available:', data);
      // Refresh the rides list
      if (userProfile?.is_rider) {
        const loadNewRides = async () => {
          try {
            const data = await ridesAPI.searchRides();
            setAllRides(data);
            // Apply current filters
            filterRides();
          } catch (error) {
            console.error('Error refreshing rides:', error);
          }
        };
        loadNewRides();
      }
    };

    webSocketService.onNewRideAvailable(handleNewRide);

    // Cleanup on unmount
    return () => {
      webSocketService.off('new_ride_available', handleNewRide);
    };
  }, [userProfile, pickupLocation, destinationLocation]);

  const filterRides = () => {
    if (!pickupLocation && !destinationLocation && !fromLocationData && !toLocationData) {
      setRides(allRides);
      return;
    }

    const filteredRides = allRides.filter(ride => {
      let matchesPickup = true;
      let matchesDestination = true;

      if (pickupLocation || fromLocationData) {
        matchesPickup = false;

        // If user selected location from map (priority - 500m radius)
        if (fromLocationData) {
          // Check if pickup is within 500m radius of start location
          const distanceToStart = calculateDistance(
            fromLocationData.coordinates.latitude,
            fromLocationData.coordinates.longitude,
            ride.start_latitude,
            ride.start_longitude
          );

          // Check if pickup location name is in the stops list
          const isInStops = ride.main_stops ? isLocationInStops(fromLocationData.address, ride.main_stops) : false;

          matchesPickup = distanceToStart <= 500 || isInStops;
        } 
        // If user entered pickup location name
        else if (pickupLocation) {
          // Check if pickup location name matches start location
          const matchesStartLocation = ride.start_location.toLowerCase().includes(pickupLocation.toLowerCase());
          
          // Check if pickup location is in the stops list
          const isInStops = ride.main_stops ? isLocationInStops(pickupLocation, ride.main_stops) : false;
          
          matchesPickup = matchesStartLocation || isInStops;
        }
      }

      if (destinationLocation || toLocationData) {
        matchesDestination = false;

        // If user selected destination from map (priority - 500m radius)
        if (toLocationData) {
          // Check if destination is within 500m radius of end location
          const distanceToEnd = calculateDistance(
            toLocationData.coordinates.latitude,
            toLocationData.coordinates.longitude,
            ride.end_latitude,
            ride.end_longitude
          );

          // Check if destination location name is in the stops list
          const isInStops = ride.main_stops ? isLocationInStops(toLocationData.address, ride.main_stops) : false;

          matchesDestination = distanceToEnd <= 500 || isInStops;
        }
        // If user entered destination location name
        else if (destinationLocation) {
          // Check if destination location name matches end location
          const matchesEndLocation = ride.end_location.toLowerCase().includes(destinationLocation.toLowerCase());
          
          // Check if destination location is in the stops list
          const isInStops = ride.main_stops ? isLocationInStops(destinationLocation, ride.main_stops) : false;
          
          matchesDestination = matchesEndLocation || isInStops;
        }
      }
      if (matchesPickup && matchesDestination && (pickupLocation || fromLocationData) && (destinationLocation || toLocationData)) {
        if (ride.main_stops && Array.isArray(ride.main_stops)) {
          const pickupLocationName = fromLocationData ? fromLocationData.address : pickupLocation;
          const destinationLocationName = toLocationData ? toLocationData.address : destinationLocation;
          
          const pickupIndex = findLocationIndexInStops(pickupLocationName, ride.main_stops);
          const destinationIndex = findLocationIndexInStops(destinationLocationName, ride.main_stops);
          
          // If both are found in stops, pickup should come before destination
          if (pickupIndex !== -1 && destinationIndex !== -1) {
            return pickupIndex < destinationIndex;
          }
          
          // If pickup is start location and destination is in stops, it's valid
          if (pickupIndex === -1 && destinationIndex !== -1) {
            const matchesStartLocation = pickupLocationName.toLowerCase().includes(ride.start_location.toLowerCase()) ||
                                       ride.start_location.toLowerCase().includes(pickupLocationName.toLowerCase());
            return matchesStartLocation;
          }
          
          // If destination is end location and pickup is in stops, it's valid
          if (pickupIndex !== -1 && destinationIndex === -1) {
            const matchesEndLocation = destinationLocationName.toLowerCase().includes(ride.end_location.toLowerCase()) ||
                                     ride.end_location.toLowerCase().includes(destinationLocationName.toLowerCase());
            return matchesEndLocation;
          }
        }
      }
      return matchesPickup && matchesDestination;
    });

    setRides(filteredRides);
  };

  useEffect(() => {
    filterRides();
  }, [pickupLocation, destinationLocation, fromLocationData, toLocationData, allRides]);


    const handleBack = () => {
      router.back();
    };

const handleChatPress = () => {
    router.push('/(tabs)/ride-chat');
  };

  const handleEditProfile = () => {
    router.push('/(tabs)/profile');
  };

  const clearFilters = () => {
    setPickupLocation('');
    setDestinationLocation('');
    setFromLocationData(null);
    setToLocationData(null);
  };

    const handleRidePress = (ride: Ride) => {
       const stops = ride.main_stops 
    ? Array.isArray(ride.main_stops) 
      ? ride.main_stops 
      : [ride.main_stops]
    : [];
      console.log(ride.end_latitude, ride.end_longitude);
      router.push({
      pathname: '/(tabs)/ride-details',
      params: {
        ride: ride.id,
         // Pass the ride ID to the details screen
        driverId: ride.driver.id,
         driverName: ride.driver.name,
        driverRating: ride.driver?.driver_rating || 0,
        driverRides: ride.driver.ride_offered || 0,
        driverImage: ride.driver.photo_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
        fromLocation: ride.start_location,
        fromAddress: ride.start_location + ' Stop',
        toLocation: ride.end_location,
        toAddress: ride.end_location + ' Stop',
        departureTime: ride.start_time,
        vehicle: ride.car.make,
        seatsAvailable: ride.seats_available.toString(),
        price: ride.total_fare/ride.car.seats,
        rideStops: JSON.stringify([ ...stops]),
        start_Latitude: ride.start_latitude,
        start_Longitude: ride.start_longitude,
        end_Latitude: ride.end_latitude,
        end_Longitude: ride.end_longitude,
      }
    });
  };

  const handleFromLocationSelect = (location: LocationResult) => {
    setFromLocationData(location);
    setPickupLocation(prev => prev || location.address);
    setShowFromLocationPicker(false);
    
    // Update map to show selected location
    if (toLocationData) {
      setMapRegion({
        latitude: (location.coordinates.latitude + toLocationData.coordinates.latitude) / 2,
        longitude: (location.coordinates.longitude + toLocationData.coordinates.longitude) / 2,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      });
    } else {
      setMapRegion({
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  const handleToLocationSelect = (location: LocationResult) => {
    setToLocationData(location);
    setDestinationLocation(prev => prev || location.address);
    setShowToLocationPicker(false);
    
    // Update map to show selected location
    if (fromLocationData) {
      setMapRegion({
        latitude: (location.coordinates.latitude + fromLocationData.coordinates.latitude) / 2,
        longitude: (location.coordinates.longitude + fromLocationData.coordinates.longitude) / 2,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      });
    } else {
      setMapRegion({
        latitude: location.coordinates.latitude,
        longitude: location.coordinates.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  const formatRideData = (ride: Ride) => {
  if (!ride.start_time || typeof ride.start_time !== 'string') {
    console.error('Invalid start_time:', ride.start_time);
    return {
      // ... other fields
      details: `Time not available · PKR${(ride.total_fare/ride.car.seats) || '0.00'}/seat`,
      durationMinutes: 0
    };
  }

  // 2. Parse as local Karachi time (UTC+5)
  let departureTime: Date;
  try {
    // Handle both "YYYY-MM-DD HH:MM:SS" and "YYYY-MM-DDTHH:MM:SS" formats
    const timeStr = ride.start_time.includes('T') 
      ? ride.start_time 
      : ride.start_time.replace(' ', 'T');
    
    departureTime = new Date(timeStr);
     console.log('ride start time:', ride.start_time.toString());

    // Validate the date
    if (isNaN(departureTime.getTime())) {
      throw new Error('Invalid date format');
    }
  } catch (error) {
    console.error('Error parsing departure time:', error);
    return {
      // ... other fields
      details: `Time not available · $${(ride.total_fare/ride.car.seats)?.toFixed(2) || '0.00'}/seat`,
      durationMinutes: 0
    };
  }

  // 3. Get current local time (Karachi)
  const now = new Date();
  // 4. Calculate minutes remaining
  const durationMinutes = Math.round((departureTime.getTime() - now.getTime()) / (1000 * 60));  // Calculate arrival time (departure time + duration)
    return {
      id: ride.id.toString(),
      destination: ride.end_location,

      details: `${ride.start_location} · PKR ${(ride.total_fare/ride.car.seats)}/seat . ${Math.abs(durationMinutes)} min`,
      avatar: ride.driver.photo_url,
      driverName: ride.driver.name,
      rating: ride.driver.driver_rating,
      ridesCount: ride.driver.ride_offered,
      fromLocation: "Campus", // Adjust as needed
      fromAddress: ride.start_location,
      toLocation: "Downtown", // Adjust as needed
      toAddress: ride.end_location,
      departureTime: new Date(ride.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      vehicle: `${ride.car.make} ${ride.car.model}`,
      seatsAvailable: ride.seats_available,
      price: `$${ride.total_fare.toFixed(2)}`,
      startLatitude: ride.start_latitude,
      startLongitude: ride.start_longitude,
      endLatitude: ride.end_latitude,
      endLongitude: ride.end_longitude,
    };
  };

  const toggleMapView = () => {
    setShowMap(!showMap);
  };

  return (
  <SafeAreaView style={styles.container}>
    {/* Header (fixed outside scroll) */}
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <ArrowLeft size={24} color="#2d3748" />
      </TouchableOpacity>
      <Text style={styles.title}>Find a Ride</Text>
      <View style={styles.placeholder} />
    </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
           {/* Main scrollable content */}
    <ScrollView 
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Search/Location Section */}
      <View style={styles.searchContainer}>
        {/* Pickup Location Section */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pickup Location Name</Text>
          
          <View style={styles.inputContainer}>
            <MapPin size={20} color="#9CA3AF" />
            <TextInput
              style={styles.input}
              value={pickupLocation}
              onChangeText={setPickupLocation}
              placeholder="Enter location name"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <TouchableOpacity 
            style={styles.mapSelectionButton}
            onPress={() => setShowFromLocationPicker(true)}
          >
            <Map size={20} color="#4ECDC4" />
            <Text style={styles.mapSelectionText}>
              {fromLocationData ? 'Change pickup on map (500m radius)' : 'Select pickup on map (500m radius)'}
            </Text>
          </TouchableOpacity>
          
          {fromLocationData && (
            <View style={styles.selectedAddressContainer}>
              <Text style={styles.selectedAddressText}>
                {fromLocationData.address}
              </Text>
            </View>
          )}
        </View>
        
        {/* Drop-off Location Section */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Drop-off Location Name</Text>
          
          <View style={styles.inputContainer}>
            <MapPin size={20} color="#9CA3AF" />
            <TextInput
              style={styles.input}
              value={destinationLocation}
              onChangeText={setDestinationLocation}
              placeholder="Enter location name"
              placeholderTextColor="#9CA3AF"
            />
          </View>
          
          <TouchableOpacity 
            style={styles.mapSelectionButton}
            onPress={() => setShowToLocationPicker(true)}
          >
            <Map size={20} color="#4ECDC4" />
            <Text style={styles.mapSelectionText}>
              {toLocationData ? 'Change drop-off on map (500m radius)' : 'Select drop-off on map (500m radius)'}
            </Text>
          </TouchableOpacity>
          
          {toLocationData && (
            <View style={styles.selectedAddressContainer}>
              <Text style={styles.selectedAddressText}>
                {toLocationData.address}
              </Text>
            </View>
          )}
        </View>

        {(pickupLocation || destinationLocation || fromLocationData || toLocationData) && (
          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <Text style={styles.clearButtonText}>Clear Filters</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.mapToggleButton} onPress={toggleMapView}>
          <Text style={styles.mapToggleButtonText}>
            {showMap ? 'Show List' : 'Show Map'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content - Either Map or List */}
      {showMap ? (
        <View style={styles.mapContainer}>
          <MapView style={styles.map} region={mapRegion}>
            {/* Render polylines and markers for each ride */}
            {rides.map((ride, index) => {
              const formattedRide = formatRideData(ride);
              const color = getRandomColor(index);
              
              return (
                <React.Fragment key={ride.id}>
                  {/* Polyline connecting start and end locations */}
                  <Polyline
                    coordinates={[
                      {
                        latitude: formattedRide.startLatitude!,
                        longitude: formattedRide.startLongitude!
                      },
                      {
                        latitude: formattedRide.endLatitude!,
                        longitude: formattedRide.endLongitude!
                      }
                    ]}
                    strokeColor={color}
                    strokeWidth={3}
                    lineDashPattern={[5, 5]} // Optional: makes the line dashed
                  />
                  
                  {/* Start location marker */}
                  <Marker
                    coordinate={{
                      latitude: formattedRide.startLatitude!,
                      longitude: formattedRide.startLongitude!
                    }}
                    title={`Pickup: ${formattedRide.fromAddress}`}
                    description={`Driver: ${formattedRide.driverName}`}
                  >
                    <View style={[styles.markerStart, { backgroundColor: color }]}>
                      <Text style={styles.markerText}>S</Text>
                    </View>
                  </Marker>
                  
                  {/* End location marker */}
                  <Marker
                    coordinate={{
                      latitude: formattedRide.endLatitude!,
                      longitude: formattedRide.endLongitude!
                    }}
                    title={`Destination: ${formattedRide.toAddress}`}
                    description={`Driver: ${formattedRide.driverName}`}
                  >
                    <View style={[styles.markerEnd, { backgroundColor: color }]}>
                      <Text style={styles.markerText}>E</Text>
                    </View>
                  </Marker>
                </React.Fragment>
              );
            })}
            
            {/* Markers for selected locations */}
            {fromLocationData && (
              <Marker
                coordinate={{
                  latitude: fromLocationData.coordinates.latitude,
                  longitude: fromLocationData.coordinates.longitude
                }}
                title="Your Pickup"
              >
                <View style={styles.userMarkerStart}>
                  <Text style={styles.markerText}>You</Text>
                </View>
              </Marker>
            )}
            
            {toLocationData && (
              <Marker
                coordinate={{
                  latitude: toLocationData.coordinates.latitude,
                  longitude: toLocationData.coordinates.longitude
                }}
                title="Your Destination"
              >
                <View style={styles.userMarkerEnd}>
                  <Text style={styles.markerText}>Dest</Text>
                </View>
              </Marker>
            )}
          </MapView>
          
          {/* Ride list overlay for quick access */}
          <ScrollView 
            horizontal 
            style={styles.ridesListOverlay}
            contentContainerStyle={styles.ridesListContent}
            showsHorizontalScrollIndicator={false}
          >
            {rides.map((ride, index) => {
              const formattedRide = formatRideData(ride);
              const color = getRandomColor(index);
              
              return (
                <TouchableOpacity 
                  key={ride.id} 
                  style={[styles.rideMapCard, { borderColor: color }]}
                  onPress={() => {
                    // Center map on this ride
                    setMapRegion({
                      latitude: (formattedRide.startLatitude! + formattedRide.endLatitude!) / 2,
                      longitude: (formattedRide.startLongitude! + formattedRide.endLongitude!) / 2,
                      latitudeDelta: 0.1,
                      longitudeDelta: 0.1,
                    });
                  }}
                >
                  <Text style={styles.rideMapCardTitle} numberOfLines={1}>
                    {formattedRide.driverName}
                  </Text>
                  <Text style={styles.rideMapCardText} numberOfLines={1}>
                    From: {formattedRide.fromAddress}
                  </Text>
                  <Text style={styles.rideMapCardText} numberOfLines={1}>
                    To: {formattedRide.toAddress}
                  </Text>
                  <View style={[styles.rideMapCardColorIndicator, { backgroundColor: color }]} />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.listContainer}>
          {profileLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4ECDC4" />
            </View>
          ) : userProfile && !userProfile.is_rider ? (
            <View style={styles.roleWarningContainer}>
              <Text style={styles.roleWarningText}>
                You're not registered as a rider yet.
              </Text>
              <Text style={styles.roleWarningSubtext}>
                Update your profile to access rider features.
              </Text>
              <TouchableOpacity 
                style={styles.updateProfileButton}
                onPress={handleEditProfile}
              >
                <Text style={styles.updateProfileButtonText}>
                  Update Profile
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.sectionTitle}>
                Suggested Rides {rides.length !== allRides.length && `(${rides.length} filtered)`}
              </Text>
              
              {loading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#4ECDC4" />
                </View>
              )}
              
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                  <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={() => {
                      setError(null);
                      setLoading(true);
                      ridesAPI.searchRides().then(setRides).catch(setError).finally(() => setLoading(false));
                    }}
                  >
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              )}

              {!loading && !error && rides.length === 0 && (
                    <View style={styles.emptyState}>
                      <Text style={styles.emptyStateText}>
                        {allRides.length === 0 
                          ? "No rides available at the moment" 
                          : "No rides match your search criteria"
                        }
                      </Text>
                      {allRides.length > 0 && (
                        <TouchableOpacity 
                          style={styles.clearFiltersButton}
                          onPress={clearFilters}
                        >
                          <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
              
              {!loading && !error && rides.map((ride) => {
                const formattedRide = formatRideData(ride);
                return (
                  <TouchableOpacity 
                    key={ride.id} 
                    style={styles.rideCard}
                    onPress={() => handleRidePress(ride)}
                    activeOpacity={0.7}
                  >
                    <Image source={{ uri: formattedRide.avatar }} style={styles.avatarImage} />
                    <View style={styles.rideInfo}>
                          <Text style={styles.destination}>To: {formattedRide.destination}</Text>
                          <Text style={styles.details}>{formattedRide.details}</Text>
                          {ride.main_stops && ride.main_stops.length > 0 && (
                            <Text style={styles.stopsText}>
                              Stops: {ride.main_stops.join(' → ')}
                            </Text>
                          )}
                        </View>
                  </TouchableOpacity>
                );
              })}
            </>
          )}
        </View>
      )}
    </ScrollView>
</KeyboardAvoidingView>

    {/* Chat Button (fixed at bottom) */}
    <View style={styles.chatContainer}>
      <TouchableOpacity style={styles.chatButton} onPress={handleChatPress}>
        <Text style={styles.chatButtonText}>Chat with us</Text>
      </TouchableOpacity>
    </View>

    {/* Location Pickers (modal) */}
    <LocationPicker
      visible={showFromLocationPicker}
      onClose={() => setShowFromLocationPicker(false)}
      onLocationSelect={handleFromLocationSelect}
      title="Select Pickup Location"
      initialLocation={fromLocationData}
    />

    <LocationPicker
      visible={showToLocationPicker}
      onClose={() => setShowToLocationPicker(false)}
      onLocationSelect={handleToLocationSelect}
      title="Select Destination"
      initialLocation={toLocationData}
    />
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40, // Space for chat button
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#FFF6F6',
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
  },
  errorText: {
    color: '#DC2626',
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  clearFiltersButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearFiltersButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#2d3748",
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    gap: 12,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#2d3748",
    marginBottom: 20,
    marginTop: 8,
  },
  rideCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB",
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  rideInfo: {
    flex: 1,
  },
  destination: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    color: "#2d3748",
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#9CA3AF",
  },
  stopsText: {
    fontSize: 12,
    fontFamily: "Inter-Regular",
    color: "#6B7280",
    marginTop: 4,
    fontStyle: "italic",
  },
  chatContainer: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  chatButton: {
    backgroundColor: "#4ECDC4",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#4ECDC4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  chatButtonText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
  },
  roleWarningContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  roleWarningText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 8,
    textAlign: 'center',
  },
  roleWarningSubtext: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  updateProfileButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  updateProfileButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  clearButton: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginTop: 8,
  },
  clearButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  mapContainer: {
    height: 300, // or whatever height works for your design
  margin: 16,
  borderRadius: 12,
  overflow: 'hidden',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mapToggleButton: {
    backgroundColor: '#4ECDC4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  mapToggleButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2d3748',
  },
  mapSelectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mapSelectionText: {
    marginLeft: 8,
    color: '#4ECDC4',
    fontFamily: 'Inter-Medium',
  },
  selectedAddressContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  selectedAddressText: {
    color: '#4B5563',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  markerStart: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  markerEnd: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    transform: [{ rotate: '45deg' }], // Different shape for end marker
  },
  userMarkerStart: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4ECDC4',
    borderWidth: 2,
    borderColor: 'white',
  },
  userMarkerEnd: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    borderWidth: 2,
    borderColor: 'white',
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  ridesListOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    maxHeight: 120,
  },
  ridesListContent: {
    paddingHorizontal: 8,
  },
  rideMapCard: {
    width: 160,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginRight: 8,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rideMapCardTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  rideMapCardText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  rideMapCardColorIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});