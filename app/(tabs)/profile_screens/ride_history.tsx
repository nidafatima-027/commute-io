import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { ArrowLeft, X, Clock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ridesAPI } from '../../../services/api';

interface RideHistoryItem {
  id: number;
  user_id: number;
  ride_id: number;
  role: 'driver' | 'rider';
  joined_at: string;
  completed_at: string | null;
  rating_given: number | null;
  rating_received: number | null;
  ride?: {
    id: number;
    driver_id: number;
    start_time: string;
    status: string;
    driver: {
      id: number;
      name: string;
      photo_url: string;
    };
    car: {
      id: number;
      make: string;
      model: string;
      photo_url: string;
    };
    start_location: {
      id: number;
      name: string;
      address: string;
    };
    end_location: {
      id: number;
      name: string;
      address: string;
    };
  };
}

export default function RideHistoryScreen() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('past');
  const [rideHistory, setRideHistory] = useState<RideHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchRideHistory();
  }, []);

  const fetchRideHistory = async () => {
    try {
      setLoading(true);
      const response = await ridesAPI.getRideHistory();
      setRideHistory(response);
      setError(null);
    } catch (err) {
      console.error('Error fetching ride history:', err);
      setError('Failed to load ride history');
    } finally {
      setLoading(false);
    }
  };
  
  const handleBack = () => {
    router.push('/(tabs)/profile');
  };

  const handleReschedule = () => {
    router.push('/(tabs)/create-recurring-ride');
  };

  const handleRidePress = (ride: RideHistoryItem) => {
    // Navigate to ride summary screen with ride details
    if (ride.ride) {
      router.push({
        pathname: '/(tabs)/ride-summary',
        params: {
          driverName: ride.ride.driver.name || 'Driver',
          distance: '12.5 mi',
          duration: '25 min',
          cost: '$15.00',
        }
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const formatRoute = (ride: RideHistoryItem) => {
    if (!ride.ride) return 'Unknown Route';
    return `${ride.ride.start_location.name} to ${ride.ride.end_location.name}`;
  };

  const getDriverDetails = (ride: RideHistoryItem) => {
    if (!ride.ride) return 'Unknown Driver';
    if (ride.role === 'driver') {
      return 'You were driving';
    }
    return `Driver: ${ride.ride.driver.name}`;
  };

  const getRideImage = (ride: RideHistoryItem) => {
    if (ride.ride?.car?.photo_url) {
      return ride.ride.car.photo_url;
    }
    return 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=400';
  };

  // Filter rides based on completion status
  const completedRides = rideHistory.filter(ride => ride.completed_at !== null);
  const upcomingRides = rideHistory.filter(ride => ride.completed_at === null);

  // Separate by role
  const driverRides = (activeTab === 'past' ? completedRides : upcomingRides).filter(ride => ride.role === 'driver');
  const riderRides = (activeTab === 'past' ? completedRides : upcomingRides).filter(ride => ride.role === 'rider');

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

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'past' && styles.activeTab]}
            onPress={() => setActiveTab('past')}
          >
            <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
              Past
            </Text>
          </TouchableOpacity>
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
              <TouchableOpacity style={styles.retryButton} onPress={fetchRideHistory}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Driver Section */}
              <Text style={styles.sectionTitle}>As a Driver</Text>
              {driverRides.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {activeTab === 'past' ? 'No past rides as a driver' : 'No upcoming rides as a driver'}
                  </Text>
                </View>
              ) : (
                driverRides.map((ride) => (
                  <View key={ride.id} style={styles.rideCard}>
                    <TouchableOpacity 
                      style={styles.rideContent}
                      onPress={() => handleRidePress(ride)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.rideDetails}>
                        <Text style={styles.rideDate}>
                          {activeTab === 'past' 
                            ? formatDate(ride.completed_at || ride.joined_at)
                            : formatDate(ride.ride?.start_time || ride.joined_at)
                          }
                        </Text>
                        <Text style={styles.rideRoute}>{formatRoute(ride)}</Text>
                        <Text style={styles.rideInfo}>{getDriverDetails(ride)}</Text>
                        {ride.rating_received && (
                          <Text style={styles.ratingText}>
                            Rating received: {ride.rating_received}/5 ⭐
                          </Text>
                        )}
                      </View>
                      <Image source={{ uri: getRideImage(ride) }} style={styles.rideImage} />
                    </TouchableOpacity>
                    {activeTab === 'upcoming' && (
                      <View style={styles.actionContainer}>
                        <TouchableOpacity style={styles.cancelButton}>
                          <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rescheduleButton} onPress={handleReschedule}>
                          <Text style={styles.rescheduleText}>Reschedule</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ))
              )}

              {/* Rider Section */}
              <Text style={[styles.sectionTitle, { marginTop: 32 }]}>As a Rider</Text>
              {riderRides.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {activeTab === 'past' ? 'No past rides as a rider' : 'No upcoming rides as a rider'}
                  </Text>
                </View>
              ) : (
                riderRides.map((ride) => (
                  <View key={ride.id} style={styles.rideCard}>
                    <TouchableOpacity 
                      style={styles.rideContent}
                      onPress={() => handleRidePress(ride)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.rideDetails}>
                        <Text style={styles.rideDate}>
                          {activeTab === 'past' 
                            ? formatDate(ride.completed_at || ride.joined_at)
                            : formatDate(ride.ride?.start_time || ride.joined_at)
                          }
                        </Text>
                        <Text style={styles.rideRoute}>{formatRoute(ride)}</Text>
                        <Text style={styles.rideInfo}>{getDriverDetails(ride)}</Text>
                        {ride.rating_received && (
                          <Text style={styles.ratingText}>
                            Rating received: {ride.rating_received}/5 ⭐
                          </Text>
                        )}
                      </View>
                      <Image source={{ uri: getRideImage(ride) }} style={styles.rideImage} />
                    </TouchableOpacity>
                    {activeTab === 'upcoming' && (
                      <View style={styles.actionContainer}>
                        <TouchableOpacity style={styles.cancelButton}>
                          <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rescheduleButton} onPress={handleReschedule}>
                          <Text style={styles.rescheduleText}>Reschedule</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ))
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4ECDC4',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  activeTabText: {
    color: '#2d3748',
    fontFamily: 'Inter-SemiBold',
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
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  rescheduleButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
    alignItems: 'center',
  },
  rescheduleText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
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