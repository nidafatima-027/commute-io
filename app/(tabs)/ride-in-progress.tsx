import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star } from 'lucide-react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import {ridesAPI,usersAPI} from '../../services/api'
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

interface DriverDetails {
    name : string;
    rating: number;
    rides: number;
    image: string;
}
interface Rider {
  id: number;
  rider_id: number;
  name: string;
  rating: number;
  rides: number;
  image: string;
  pickup: string;
  dropoff: string;
  price: string;
  completed: boolean;
  request_id: number;
}

interface RideDetails {
  start_location: string;
  end_location: string;
  start_time: string;
  start_latitude: number;
  start_longitude: number;
  end_latitude: number;
  end_longitude: number;
}
 
export default function RideInProgressScreen() {
    const params = useLocalSearchParams();
  const rideId = params.rideId as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [driverDetails, setDriverDetails] = useState<DriverDetails | null>(null);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [rideDetails, setRideDetails] = useState<RideDetails | null>(null);
  const [driverLocation, setDriverLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
    

const fetchData = async () => {
  try{
    setLoading(true);
    const rideResponse = await ridesAPI.getRideDetails(Number(rideId));
      setRideDetails({
        start_location: rideResponse.start_location,
        end_location: rideResponse.end_location,
        start_time: rideResponse.start_time,
        start_latitude: rideResponse.start_latitude,
        start_longitude: rideResponse.start_longitude,
        end_latitude: rideResponse.end_latitude,
        end_longitude: rideResponse.end_longitude,
      });
      setRegion({
        latitude: (rideResponse.start_latitude + rideResponse.end_latitude) / 2,
        longitude: (rideResponse.start_longitude + rideResponse.end_longitude) / 2,
        latitudeDelta: Math.abs(rideResponse.start_latitude - rideResponse.end_latitude) * 1.5,
        longitudeDelta: Math.abs(rideResponse.start_longitude - rideResponse.end_longitude) * 1.5,
      });
    const driver = rideResponse.driver;
      const driverProfile = await usersAPI.getUserProfileById(driver.id);
      setDriverDetails({
        name: driver.name,
        rating: driverProfile.driver_rating || 0.0,
        rides: driverProfile.rides_offered || 0,
        image: driver.photo_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      });

    const requestsResponse = await ridesAPI.getAcceptedRideRequests(Number(rideId));
      const ridersData = await Promise.all(
        requestsResponse.map(async (req: any) => {
          const riderProfile = await usersAPI.getUserProfileById(req.rider_id);
          const rideHistory = await ridesAPI.getRiderRideHistory(req.rider_id, Number(rideId));
        const isCompleted = rideHistory.completed_at !== null;
          return {
            id: req.rider_id,
            rider_id: req.rider_id,
            name: riderProfile.name,
            rating: riderProfile.rider_rating || 0.0,
            rides: riderProfile.rides_taken || 0,
            image: riderProfile.photo_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
            pickup: rideResponse.start_location,
            dropoff: rideResponse.end_location,
            price: (rideResponse.total_fare / rideResponse.car.seats).toFixed(2),
            completed: isCompleted,
            request_id: req.id,
          };
        })
      );
      setRiders(ridersData);

   } catch (err) {
      console.error('Error fetching ride data:', err);
      setError('Failed to load ride data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }

      // For demo purposes, we'll simulate the driver moving from start to end location
      // In a real app, you would use Location.watchPositionAsync or get the location from your backend
      if (rideDetails) {
        // Start at the pickup location
        setDriverLocation({
          latitude: rideDetails.start_latitude,
          longitude: rideDetails.start_longitude
        });

        // Simulate movement towards destination
        const interval = setInterval(() => {
          setDriverLocation(prev => {
            if (!prev || !rideDetails) return null;
            
            const progress = 0.005; // Adjust this value to change speed
            const newLat = prev.latitude + (rideDetails.end_latitude - rideDetails.start_latitude) * progress;
            const newLng = prev.longitude + (rideDetails.end_longitude - rideDetails.start_longitude) * progress;
            
            // Stop when close to destination
            if (Math.abs(newLat - rideDetails.end_latitude) < 0.0001 && 
                Math.abs(newLng - rideDetails.end_longitude) < 0.0001) {
              clearInterval(interval);
              return { latitude: rideDetails.end_latitude, longitude: rideDetails.end_longitude };
            }
            
            return { latitude: newLat, longitude: newLng };
          });
        }, 1000);

        return () => clearInterval(interval);
      }
    })();
  }, [rideDetails]);


  const handleBack = () => {
    router.push('/(tabs)/ride-request-screen');
  };

const isAtDestination = () => {
    if (!driverLocation || !rideDetails) return false;
    
    // Check if driver is within 100 meters of the destination
    const distance = getDistance(
      driverLocation.latitude,
      driverLocation.longitude,
      rideDetails.end_latitude,
      rideDetails.end_longitude
    );
    
    return distance < 100; // 100 meters threshold
  };

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

const handleCompleteRide = (riderId: number) => {
      // Find the rider to complete
      const rider = riders.find(r => r.id === riderId);
      if (!rider) return;
if (!isAtDestination()) {
      Alert.alert(
        "Confirm Completion",
        "You haven't reached the end location. Do you still want to end the ride?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { 
            text: "Yes", 
            onPress: () => proceedToCompleteRide(rider) 
          }
        ]
      );
    } else {
      proceedToCompleteRide(rider);
    }
  };

 const proceedToCompleteRide = (rider: Rider) => {
    try {
      // In a real app, you would call an API here to mark the ride as completed
      // await ridesAPI.completeRideRequest(rider.request_id);
      
      // Update local state to mark as completed
      setRiders(prev => prev.map(r => 
        r.id === rider.id ? { ...r, completed: true } : r
      ));

      // Navigate to ride summary screen for this rider
      router.push({
        pathname: '/(tabs)/ride-summary',
        params: {
          driverName: rider.name,
          riderName: rider.name,
          userId: rider.id,
          rideId: rideId,
          distance: '12.5 mi',
          duration: '25 min',
          cost: `$${rider.price}`,
        }
      });
    } catch (err) {
      console.error('Error completing ride:', err);
      setError('Failed to complete ride. Please try again.');
    }
  };

  const handleEndAllRides = async () => {
    // Handle ending all rides
    try {
      // In a real app, you would call an API here to end all rides
      // await ridesAPI.endAllRides(Number(rideId));
      const hasPendingRides = riders.some(rider => !rider.completed);
    
    if (hasPendingRides) {
      setError('Please complete all rides before ending');
      return;
    }
      await ridesAPI.updateRide(parseInt(params.rideId as string), {
              status: "end"
            });
      // Navigate to ride summary screen
      router.push({
        pathname: '/(tabs)',
      });
    } catch (err) {
      console.error('Error ending all rides:', err);
      setError('Failed to end all rides. Please try again.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [rideId]);

  useFocusEffect(
  React.useCallback(() => {
    fetchData();
  }, [rideId,params.refresh])
);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ECDC4" />
        </View>
      </SafeAreaView>
    );
  }
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              fetchData();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

   if (!rideDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Ride not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#2d3748" />
        </TouchableOpacity>
        <Text style={styles.title}>Ride in progress</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {/* Start Marker */}
          <Marker
            coordinate={{
              latitude: rideDetails.start_latitude,
              longitude: rideDetails.start_longitude
            }}
            title="Pickup Location"
            description={rideDetails.start_location}
          >
            <View style={styles.marker}>
              <View style={styles.markerDotStart} />
            </View>
          </Marker>
          {/* End Marker */}
          <Marker
            coordinate={{
              latitude: rideDetails.end_latitude,
              longitude: rideDetails.end_longitude
            }}
            title="Drop-off Location"
            description={rideDetails.end_location}
          >
            <View style={styles.marker}>
              <View style={styles.markerDotEnd} />
            </View>
          </Marker>
          {/* Driver Marker */}
          {driverLocation && (
            <Marker
              coordinate={driverLocation}
              title="Your Location"
              description="Driver"
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={styles.driverMarker}>
                <View style={styles.carIcon} />
              </View>
            </Marker>
          )}
          {/* Route Polyline */}
          {driverLocation && (
            <Polyline
              coordinates={[
                { latitude: rideDetails.start_latitude, longitude: rideDetails.start_longitude },
                driverLocation,
                { latitude: rideDetails.end_latitude, longitude: rideDetails.end_longitude }
              ]}
              strokeColor="#3B82F6"
              strokeWidth={4}
              lineDashPattern={[5, 5]}
            />
          )}
        </MapView>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar} />
          </View>

          {/* Time and Distance */}
          <View style={styles.timeContainer}>
            <Text style={styles.timeLeft}>24 Mins Left</Text>
            <Text style={styles.distance}>
              {driverLocation && rideDetails ? 
                `${getDistance(
                  driverLocation.latitude,
                  driverLocation.longitude,
                  rideDetails.end_latitude,
                  rideDetails.end_longitude
                ).toFixed(0)} meters remaining` : 'Calculating distance...'}
            </Text>
          </View>

          {/* Ride Details */}
          <View style={styles.rideDetails}>
            <Text style={styles.rideId}>Ride {rideId}</Text>
            <Text style={styles.location}>{rideDetails.start_location} → {rideDetails.end_location}</Text>
          </View>

          {/* Driver Info */}
          {driverDetails && (
            <View style={styles.driverInfo}>
              <Image
                source={{ uri: driverDetails.image }}
                style={styles.driverAvatar}
              />
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>{driverDetails.name}</Text>
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#FFD700" fill="#FFD700" />
                  <Text style={styles.rating}>{driverDetails.rating}</Text>
                  <Text style={styles.rideCount}>• {driverDetails.rides} rides</Text>
                </View>
              </View>
            </View>
          )}

          {/* Riders List */}
          <View style={styles.ridersContainer}>
            <Text style={styles.ridersTitle}>Passengers ({riders.length})</Text>
            
            {riders.length > 0 ? (
              riders.map((rider) => (
                <View key={rider.id} style={[
                  styles.riderCard,
                  rider.completed && styles.completedRiderCard
                ]}>
                  <View style={styles.riderInfo}>
                    <Image
                      source={{ uri: rider.image }}
                      style={styles.riderAvatar}
                    />
                    <View style={styles.riderDetails}>
                      <Text style={styles.riderName}>{rider.name}</Text>
                      <View style={styles.ratingContainer}>
                        <Star size={14} color="#FFD700" fill="#FFD700" />
                        <Text style={styles.riderRating}>{rider.rating}</Text>
                        <Text style={styles.riderRideCount}>• {rider.rides} rides</Text>
                      </View>
                      <Text style={styles.riderRoute}>{rider.pickup} → {rider.dropoff}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.riderActions}>
                    <Text style={styles.riderPrice}>Rs {rider.price}</Text>
                    {!rider.completed && (
                      <TouchableOpacity 
                        style={styles.completeButton}
                        onPress={() => handleCompleteRide(rider.id)}
                      >
                        <Text style={styles.completeButtonText}>Complete</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No passengers in this ride</Text>
              </View>
            )}
          </View>

          {/* End All Rides Button */}
{riders.length > 0 && (
  <>
    {error && (
      <View style={styles.errorMessageContainer}>
        <Text style={styles.errorMessageText}>{error}</Text>
      </View>
    )}
    <TouchableOpacity 
      style={[
        styles.endAllButton,
        riders.some(r => !r.completed) && styles.disabledButton
      ]} 
      onPress={handleEndAllRides}
      disabled={riders.some(r => !r.completed)}
    >
      <Text style={styles.endAllButtonText}>
        {riders.some(r => !r.completed) ? 'Complete All Rides First' : 'End Ride'}
      </Text>
    </TouchableOpacity>
  </>
)}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
  },
  placeholder: {
    width: 40,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  marker: {
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  markerDotStart: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4ECDC4',
  },
  markerDotEnd: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
  },
  driverMarker: {
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  carIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  bottomSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    maxHeight: '50%',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  progressBar: {
    width: 40,
    height: 4,
    backgroundColor: '#2d3748',
    borderRadius: 2,
  },
  timeContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  timeLeft: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  distance: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  rideDetails: {
    marginBottom: 24,
  },
  rideId: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#4ECDC4',
  },
  rideCount: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#4ECDC4',
  },
  priceContainer: {
    marginBottom: 32,
  },
  priceLabel: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
  },
  paymentMethod: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  endRideButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  endRideButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  ridersContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  ridersTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 16,
  },
  riderCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  riderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  riderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  riderDetails: {
    flex: 1,
  },
  riderName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 2,
  },
  riderRating: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4ECDC4',
    marginLeft: 4,
  },
  riderRideCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4ECDC4',
  },
  riderRoute: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 4,
  },
  riderActions: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  riderPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
    marginBottom: 8,
  },
  completeButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  endAllButton: {
    backgroundColor: '#2d3748',
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  endAllButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#718096',
  },
  completedRiderCard: {
    opacity: 0.6,
    backgroundColor: '#E5E7EB',
  },
  errorMessageContainer: {
  backgroundColor: '#FFF0F0',
  padding: 12,
  borderRadius: 8,
  marginBottom: 8,
},
errorMessageText: {
  color: '#EF4444',
  textAlign: 'center',
  fontFamily: 'Inter-Regular',
},
disabledButton: {
  backgroundColor: '#9CA3AF',
},
});