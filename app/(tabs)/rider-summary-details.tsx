// app/(tabs)/ride-summary-details.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { ArrowLeft, Star, Clock, MapPin, User, Calendar } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ridesAPI } from '../../services/api';

interface RideDetails {
  id: number;
  driver_id: number;
  start_time: string;
  status: string;
  start_location: string;
  end_location: string;
  total_fare?: number;
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
    seats: number;
  };
}

interface RideHistoryDetails {
  id: number;
  user_id: number;
  ride_id: number;
  role: 'driver' | 'rider';
  joined_at: string;
  completed_at: string | null;
  rating_given: number | null;
  rating_received: number | null;
  ride?: RideDetails;
}

export default function RiderSummaryDetails() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rideDetails, setRideDetails] = useState<RideHistoryDetails | null>(null);
  const params = useLocalSearchParams();

  const rideId = params.rideId ? Number(params.rideId) : null;
  const userId = params.userId ? Number(params.userId) : null;

  useEffect(() => {
    const fetchRideDetails = async () => {
      if (!userId || !rideId) {
        setError('Missing ride information');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await ridesAPI.getRiderRideHistory(userId, rideId);
        setRideDetails(response);
        setError(null);
      } catch (err) {
        console.error('Error fetching ride details:', err);
        setError('Failed to load ride details');
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [userId, rideId]);

  const handleBack = () => {
    router.push('/(tabs)/profile_screens/ride_history');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatLocation = (location: string) => {
    return location.split(' - ')[0] || location;
  };

  const renderStars = (rating: number | null) => {
    if (rating === null) return <Text style={styles.noRatingText}>No rating given</Text>;
    
    return (
      <View style={styles.starsContainer}>
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={`star-${index}`}
            size={20}
            color="#4ECDC4"
            fill={index < rating ? "#4ECDC4" : "transparent"}
          />
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ECDC4" />
          <Text style={styles.loadingText}>Loading ride details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
            <Text style={styles.retryText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!rideDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No ride details available</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
            <Text style={styles.retryText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#2d3748" />
          </TouchableOpacity>
          <Text style={styles.title}>Ride Summary Details</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* Driver Info */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <User size={20} color="#4ECDC4" />
              <Text style={styles.sectionTitle}>Driver Information</Text>
            </View>
            {rideDetails.ride?.driver ? (
              <View style={styles.driverContainer}>
                <Image 
                  source={{ uri: rideDetails.ride.driver.photo_url || 'https://i.imgur.com/1qY33zD.png' }} 
                  style={styles.driverImage} 
                />
                <View style={styles.driverDetails}>
                  <Text style={styles.driverName}>{rideDetails.ride.driver.name}</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.noDataText}>No driver information available</Text>
            )}
          </View>

          {/* Ride Timeline */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={20} color="#4ECDC4" />
              <Text style={styles.sectionTitle}>Ride Timeline</Text>
            </View>
            <View style={styles.timelineItem}>
              <Text style={styles.timelineLabel}>Joined at:</Text>
              <Text style={styles.timelineValue}>{formatDate(rideDetails.joined_at)}</Text>
            </View>
            {rideDetails.completed_at && (
              <View style={styles.timelineItem}>
                <Text style={styles.timelineLabel}>Completed at:</Text>
                <Text style={styles.timelineValue}>{formatDate(rideDetails.completed_at)}</Text>
              </View>
            )}
          </View>

          {/* Ride Route */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin size={20} color="#4ECDC4" />
              <Text style={styles.sectionTitle}>Route</Text>
            </View>
            {rideDetails.ride ? (
              <View>
                <View style={styles.routeItem}>
                  <Text style={styles.routeLabel}>From:</Text>
                  <Text style={styles.routeValue}>{formatLocation(rideDetails.ride.start_location)}</Text>
                </View>
                <View style={styles.routeItem}>
                  <Text style={styles.routeLabel}>To:</Text>
                  <Text style={styles.routeValue}>{formatLocation(rideDetails.ride.end_location)}</Text>
                </View>
                {rideDetails.ride.total_fare && (
                  <View style={styles.routeItem}>
                    <Text style={styles.routeLabel}>Fare:</Text>
                    <Text style={styles.routeValue}>PKR {rideDetails.ride.total_fare/rideDetails.ride.car.seats}</Text>
                  </View>
                )}
              </View>
            ) : (
              <Text style={styles.noDataText}>No route information available</Text>
            )}
          </View>

          {/* Ratings */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Star size={20} color="#4ECDC4" />
              <Text style={styles.sectionTitle}>Ratings</Text>
            </View>
            <View style={styles.ratingItem}>
              <Text style={styles.ratingLabel}>Rating given:</Text>
              {renderStars(rideDetails.rating_given)}
            </View>
            <View style={styles.ratingItem}>
              <Text style={styles.ratingLabel}>Rating received:</Text>
              {renderStars(rideDetails.rating_received)}
            </View>
          </View>

          {/* Car Information */}
          {rideDetails.ride?.car && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Calendar size={20} color="#4ECDC4" />
                <Text style={styles.sectionTitle}>Car Information</Text>
              </View>
              <View style={styles.carContainer}>
                <Image 
                  source={{ uri: rideDetails.ride.car.photo_url || 'https://i.imgur.com/JZw5FzU.png' }} 
                  style={styles.carImage} 
                />
                <View style={styles.carDetails}>
                  <Text style={styles.carModel}>{rideDetails.ride.car.make} {rideDetails.ride.car.model}</Text>
                </View>
              </View>
            </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
    paddingVertical: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
  },
  driverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  driverImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 4,
  },
  driverRole: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#718096',
  },
  timelineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timelineLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#718096',
  },
  timelineValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
  },
  routeItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  routeLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#718096',
    width: 60,
  },
  routeValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    flex: 1,
  },
  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#718096',
    width: 120,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  noRatingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#718096',
  },
  carContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  carImage: {
    width: 100,
    height: 60,
    borderRadius: 8,
  },
  carDetails: {
    flex: 1,
  },
  carModel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
  },
  noDataText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#718096',
    fontStyle: 'italic',
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
});