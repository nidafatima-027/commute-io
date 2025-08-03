import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { usersAPI, ridesAPI } from '../../../services/api';

interface User {
  id: number;
  name: string;
  photo_url: string;
  auth_methods: string[];
  bio: string;
  created_at: string;
  email: string;
  gender: string;
  is_driver: boolean;
  is_rider: boolean;
  phone: string;
  preferences: {
    conversation_preference: string;
    gender_preference: string;
    music_preference: string;
    smoking_preference: string;
  };
  trust_score: number;
}

interface Car {
  id: number;
  ac_available: boolean;
  color: string;
  license_plate: string;
  make: string;
  model: string;
  photo_url: string | null;
  seats: number;
  user_id: number;
  year: number;
}

interface Ride {
  id: number;
  driver_id: number;
  car_id: number;
  start_time: string;
  status: string;
  start_location: string;
  end_location: string;
  seats_available: number;
  total_fare: number;
  driver: User;
  car: Car;
}

interface RideHistoryItem {
  id: number;
  user_id: number;
  ride_id: number;
  role: 'driver' | 'rider';
  joined_at: string;
  completed_at: string | null;
  rating_given: number | null;
  rating_received: number | null;
  ride?: Ride;
}

type UserProfile = {
    is_driver: boolean;
    is_rider: boolean;
    // add other properties as needed
  };

export default function RideHistoryScreen() {
  const [rideHistory, setRideHistory] = useState<RideHistoryItem[]>([]);
  const [driverRides, setDriverRides] = useState<RideHistoryItem[]>([]);
  const [passengerCounts, setPassengerCounts] = useState<{[key: number]: number}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profileData = await usersAPI.getProfile();
        setUserProfile(profileData);
      } catch (error) {
        console.error('Failed to load user profile:', error);
      }
    };
    loadUserProfile();
  }, []); // load profile only once
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if(userProfile?.is_driver) {
        // Fetch driver rides
        const driverResponse = await ridesAPI.getMyCompletedRides();
        const formattedDriverRides = driverResponse.map((ride: any) => ({
          id: ride.id,
          user_id: ride.driver_id,
          ride_id: ride.id,
          role: 'driver' as const,
          joined_at: ride.start_time,
          completed_at: ride.status === 'end' ? ride.start_time : null,
          rating_given: null,
          rating_received: null,
          ride: {
            id: ride.id,
            driver_id: ride.driver_id,
            car_id: ride.car_id,
            start_time: ride.start_time,
            status: ride.status,
            start_location: ride.start_location,
            end_location: ride.end_location,
            seats_available: ride.seats_available,
            total_fare: ride.total_fare,
            driver: ride.driver,
            car: ride.car
          }
        }));
        setDriverRides(formattedDriverRides);
        
        // Fetch passenger counts for each ride
        const counts: {[key: number]: number} = {};
        for (const ride of formattedDriverRides) {
          console.log('ride id : ',ride.ride_id)
          const passengers = await fetchPassengerDetails(ride.ride_id);
          counts[ride.ride_id] = passengers.length;
        }
        setPassengerCounts(counts);
      }
        // Fetch rider history
       if (userProfile?.is_rider) {
          const riderResponse = await ridesAPI.getRideHistory();
          setRideHistory(riderResponse);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching ride history:', err);
        setError('Failed to load ride history');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userProfile]);

  const fetchPassengerDetails = async (rideId: number) => {
    try {
      const response = await ridesAPI.getRideHistoryByRideId(rideId);
      return response.filter((item: RideHistoryItem) => item.role === 'rider');
    } catch (error) {
      console.error('Error fetching passenger details:', error);
      return [];
    }
  };
  
  const handleBack = () => {
    router.push('/(tabs)/profile');
  };

  const handleRidePress = (ride: RideHistoryItem) => {
    // Navigate to ride summary screen with ride details
    if (ride.ride) {
      router.push({
      pathname: '/(tabs)/rider-summary-details',
      params: {
        rideId: ride.ride_id.toString(),
        userId: ride.user_id.toString()
      }
    });
    }
  };
  const handleDriverRidePress = (ride: RideHistoryItem) => {
    console.log('driver', ride.ride_id)
    // Navigate to ride summary screen with ride details
    if (ride.ride) {
      router.push({
      pathname: '/(tabs)/driver-summary-details',
      params: {
        rideId: ride.ride_id.toString(),
        userId: ride.user_id.toString()
      }
    });
    }
  };

  const formatRideTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatRoute = (ride: RideHistoryItem) => {
    if (!ride.ride) return 'Unknown Route';
    // Extract location names from the string format "Name - Address"
    const startLocation = ride.ride.start_location.split(' - ')[0] || ride.ride.start_location;
    const endLocation = ride.ride.end_location.split(' - ')[0] || ride.ride.end_location;
    return `${startLocation} to ${endLocation}`;
  };

  const getPassengerInfo = (rideId: number) => {
    const count = passengerCounts[rideId] || 0;
    return `${count} passenger${count !== 1 ? 's' : ''}`;
  };

  const getDriverName = (ride: RideHistoryItem) => {
    if (!ride.ride) return 'Unknown Driver';
    return ride.ride.driver.name;
  };

  const getRideImage = (ride: RideHistoryItem) => {
    if (ride.ride?.car?.photo_url) {
      return ride.ride.car.photo_url;
    }
    return 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=400';
  };

  // Filter rides based on completion status
  const riderRides = rideHistory.filter(ride => ride.role === 'rider');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#2d3748" />
          </TouchableOpacity>
          <Text style={styles.title}>Rides History</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4ECDC4" />
              <Text style={styles.loadingText}>Loading ride history...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => {
                setLoading(true);
                setError(null);
                useEffect(() => {}, []);
              }}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
            {              userProfile?.is_driver && (
              <>
              {/* Driver Section */}
                <Text style={styles.sectionTitle}>As a Driver</Text>
              {driverRides.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No past rides as a driver</Text>
                </View>
              ) : (
                driverRides.map((ride) => (
                  <TouchableOpacity 
                    key={`driver-${ride.id}`} 
                    style={styles.rideCard}
                    onPress={() => handleDriverRidePress(ride)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.rideContent}>
                      <View style={styles.rideDetails}>
                        <Text style={styles.rideDate}>
                          {formatRideTime(ride.ride?.start_time || ride.joined_at)}
                        </Text>
                        <Text style={styles.rideRoute}>{formatRoute(ride)}</Text>
                        <View style={styles.rideInfoContainer}>
                          <Text style={styles.rideInfo}>
                            {getPassengerInfo(ride.ride_id)}
                          </Text>
                          {ride.ride?.total_fare && (
                            <Text style={styles.fareText}>PKR {ride.ride.total_fare}</Text>
                          )}
                        </View>
                        <View style={styles.carInfoContainer}>
                          <Text style={styles.carInfo}>
                            {ride.ride?.car.make} {ride.ride?.car.model}
                          </Text>
                        </View>
                        {ride.rating_received && (
                          <Text style={styles.ratingText}>
                            Rating received: {ride.rating_received}/5 ⭐
                          </Text>
                        )}
                      </View>
                      <Image source={{ uri: getRideImage(ride) }} style={styles.rideImage} />
                    </View>
                  </TouchableOpacity>
                ))
              )}
              </>
            )}

              {userProfile?.is_rider && (
                <>
              {/* Rider Section */}
               <Text style={[styles.sectionTitle, { marginTop: 32 }]}>As a Rider</Text>
              {riderRides.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No past rides as a rider</Text>
                </View>
              ) : (
                riderRides.map((ride) => (
                  <TouchableOpacity 
                    key={`rider-${ride.id}`} 
                    style={styles.rideCard}
                    onPress={() => handleRidePress(ride)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.rideContent}>
                      <View style={styles.rideDetails}>
                        <Text style={styles.rideDate}>
                          {formatRideTime(ride.completed_at || ride.joined_at)}
                        </Text>
                        <Text style={styles.rideRoute}>{formatRoute(ride)}</Text>
                        <View style={styles.rideInfoContainer}>
                          <View>
                            <Text style={styles.rideInfo}>
                              Driver: {getDriverName(ride)}
                            </Text>
                            {ride.ride?.total_fare && (
                              <Text style={styles.fareText}>PKR {ride.ride.total_fare/ride.ride.car.seats}</Text>
                            )}
                          </View>
                        </View>
                        {ride.rating_received && (
                          <Text style={styles.ratingText}>
                            Rating received: {ride.rating_received}/5 ⭐
                          </Text>
                        )}
                      </View>
                      <Image source={{ uri: getRideImage(ride) }} style={styles.rideImage} />
                    </View>
                  </TouchableOpacity>
                ))
              )}
                </>
              )}
               {/* Show message if user is neither driver nor rider */}
              {!userProfile?.is_driver && !userProfile?.is_rider && (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>You haven't taken or given any rides yet</Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
  },
  placeholder: {
    width: 40,
  },
  content: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
    marginBottom: 20,
  },
  rideCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  rideContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rideImage: {
    width: 120,
    height: 100,
    resizeMode: 'cover',
  },
  rideDetails: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  rideDate: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4ECDC4',
    marginBottom: 8,
  },
  rideRoute: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
    marginBottom: 6,
  },
  rideInfo: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4ECDC4',
  },
  rideInfoContainer: {
    marginTop: 4,
  },
  fareText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginTop: 4, // Add some spacing between the driver name and fare

  },
  carInfoContainer: {
    marginTop: 4,
  },
  carInfo: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#718096',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#4ECDC4',
    marginTop: 4,
  },
});