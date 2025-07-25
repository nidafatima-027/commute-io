import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image, ActivityIndicator  } from "react-native";
import { ArrowLeft, Search } from "lucide-react-native"; // example icons; install lucide-react-native or use react-native-vector-icons
import { router} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ridesAPI, usersAPI  } from '../../services/api'; // Adjust the import path as needed
import webSocketService from '../../services/websocket';


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
  driver: {
    id: number;
    name: string;
    photo_url: string;
    rating: number;
    rides_count: number;
  };
  car: {
    id: number;
    make: string;
    model: string;
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
    if (!pickupLocation && !destinationLocation) {
      setRides(allRides);
      return;
    }

    const filteredRides = allRides.filter(ride => {
      const matchesPickup = !pickupLocation || 
        ride.start_location.toLowerCase().includes(pickupLocation.toLowerCase());
      const matchesDestination = !destinationLocation || 
        ride.end_location.toLowerCase().includes(destinationLocation.toLowerCase());
      
      return matchesPickup && matchesDestination;
    });

    setRides(filteredRides);
  };

  useEffect(() => {
    filterRides();
  }, [pickupLocation, destinationLocation, allRides]);

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
  };

    const handleRidePress = (ride: Ride) => {
      router.push({
      pathname: '/(tabs)/ride-details',
      params: {
        ride: ride.id, // Pass the ride ID to the details screen
        driverName: ride.driver.name,
    driverRating: ride.driver?.rating || 0,
        driverRides: ride.driver.rides_count || 0,
        driverImage: ride.driver.photo_url,
        fromLocation: ride.start_location,
        fromAddress: ride.start_location + 'Stop',
        toLocation: ride.end_location,
        toAddress: ride.end_location + 'Stop',
        departureTime: ride.start_time,
        vehicle: ride.car.make,
        seatsAvailable: ride.seats_available.toString(),
        price: ride.total_fare,
      }
    });
  };

  const formatRideData = (ride: Ride) => {
  if (!ride.start_time || typeof ride.start_time !== 'string') {
    console.error('Invalid start_time:', ride.start_time);
    return {
      // ... other fields
      details: `Time not available · $${ride.total_fare?.toFixed(2) || '0.00'}/seat`,
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
      details: `Time not available · $${ride.total_fare?.toFixed(2) || '0.00'}/seat`,
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
      details: `${ride.start_location} · $${ride.total_fare.toFixed(2)}/seat . ${Math.abs(durationMinutes)} min`,
      avatar: ride.driver.photo_url,
      driverName: ride.driver.name,
      rating: ride.driver.rating,
      ridesCount: ride.driver.rides_count,
      fromLocation: "Campus", // Adjust as needed
      fromAddress: ride.start_location,
      toLocation: "Downtown", // Adjust as needed
      toAddress: ride.end_location,
      departureTime: new Date(ride.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      vehicle: `${ride.car.make} ${ride.car.model}`,
      seatsAvailable: ride.seats_available,
      price: `$${ride.total_fare.toFixed(2)}`,
    };
  };

  const handleEditProfile = () => {
    router.push('/(tabs)/profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#2d3748" />
        </TouchableOpacity>
        <Text style={styles.title}>Find a Ride</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Pickup location"
            placeholderTextColor="#9CA3AF"
            value={pickupLocation}
            onChangeText={setPickupLocation}
          />
        </View>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Destination"
            placeholderTextColor="#9CA3AF"
            value={destinationLocation}
            onChangeText={setDestinationLocation}
          />
                  </View>
          {(pickupLocation || destinationLocation) && (
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          )}
        </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
            {/* Section Header */}
            <Text style={styles.sectionTitle}>Suggested Rides</Text>
            
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
                <Text style={styles.emptyStateText}>No rides available at the moment</Text>
              </View>
            )}
            
            {/* Rides List */}
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
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </ScrollView>

      {/* Chat Button */}
      <View style={styles.chatContainer}>
        <TouchableOpacity style={styles.chatButton} onPress={handleChatPress}>
          <Text style={styles.chatButtonText}>Chat with us</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
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
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#2d3748",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
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
});