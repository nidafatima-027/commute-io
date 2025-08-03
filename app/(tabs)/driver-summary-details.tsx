import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { ArrowLeft, Star, Clock, MapPin, User, Calendar } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ridesAPI, usersAPI } from '../../services/api';

interface PassengerDetails {
  id: number;
  user_id: number;
  name: string;
  photo_url: string;
  joined_at: string;
  completed_at: string | null;
  rating_given: number | null;
  rating_received: number | null;
}

interface RideDetails {
  id: number;
  start_time: string;
  status: string;
  start_location: string;
  end_location: string;
  total_fare?: number;
  car: {
    id: number;
    make: string;
    model: string;
    photo_url: string;
  };
  passengers: PassengerDetails[];
}

export default function DriverSummaryDetails() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rideDetails, setRideDetails] = useState<RideDetails | null>(null);
  const params = useLocalSearchParams();

  const rideId = params.rideId ? Number(params.rideId) : null;

  useEffect(() => {
    const fetchRideDetails = async () => {
      if (!rideId) {
        setError('Missing ride information');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('rideId: ',rideId)
        const response = await ridesAPI.getRideDetails(rideId);
        const passengersResponse = await ridesAPI.getRideHistoryByRideId(rideId);
        
        // Fetch user details for each passenger
        const passengersWithDetails = await Promise.all(
          passengersResponse.map(async (passenger: any) => {
            try {
              const userDetails = await usersAPI.getUserProfileById(passenger.user_id);
              return {
                ...passenger,
                name: userDetails.name,
                photo_url: userDetails.photo_url
              };
            } catch (err) {
              console.error(`Error fetching user details for passenger ${passenger.user_id}:`, err);
              return {
                ...passenger,
                name: 'Unknown Passenger',
                photo_url: 'https://i.imgur.com/1qY33zD.png'
              };
            }
          })
        );

        setRideDetails({ 
          ...response, 
          passengers: passengersWithDetails 
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching ride details:', err);
        setError('Failed to load ride details');
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [rideId]);

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
          <Text style={styles.title}>Ride Summary</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* Passengers Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <User size={20} color="#4ECDC4" />
              <Text style={styles.sectionTitle}>Passengers ({rideDetails.passengers.length})</Text>
            </View>
            {rideDetails.passengers.length > 0 ? (
              rideDetails.passengers.map((passenger) => (
                <View key={`passenger-${passenger.id}`} style={styles.passengerContainer}>
                  <Image 
                    source={{ uri: passenger.photo_url || 'https://i.imgur.com/1qY33zD.png' }} 
                    style={styles.passengerImage} 
                  />
                  <View style={styles.passengerDetails}>
                    <Text style={styles.passengerName}>{passenger.name}</Text>
                    <View style={styles.passengerTimeline}>
                      <Text style={styles.timelineLabel}>Joined:</Text>
                      <Text style={styles.timelineValue}>{formatDate(passenger.joined_at)}</Text>
                    </View>
                    {passenger.completed_at && (
                      <View style={styles.passengerTimeline}>
                        <Text style={styles.timelineLabel}>Completed:</Text>
                        <Text style={styles.timelineValue}>{formatDate(passenger.completed_at)}</Text>
                      </View>
                    )}
                    <View style={styles.ratingContainer}>
                      <Text style={styles.ratingLabel}>Rating given:</Text>
                      {renderStars(passenger.rating_given)}
                    </View>
                    <View style={styles.ratingContainer}>
                      <Text style={styles.ratingLabel}>Rating received:</Text>
                      {renderStars(passenger.rating_received)}
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>No passengers for this ride</Text>
            )}
          </View>

          {/* Ride Route */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MapPin size={20} color="#4ECDC4" />
              <Text style={styles.sectionTitle}>Route</Text>
            </View>
            <View>
              <View style={styles.routeItem}>
                <Text style={styles.routeLabel}>From:</Text>
                <Text style={styles.routeValue}>{formatLocation(rideDetails.start_location)}</Text>
              </View>
              <View style={styles.routeItem}>
                <Text style={styles.routeLabel}>To:</Text>
                <Text style={styles.routeValue}>{formatLocation(rideDetails.end_location)}</Text>
              </View>
              {rideDetails.total_fare && (
                <View style={styles.routeItem}>
                  <Text style={styles.routeLabel}>Total Fare: </Text>
                  <Text style={styles.routeValue}>PKR {rideDetails.total_fare}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Car Information */}
          {rideDetails.car && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Calendar size={20} color="#4ECDC4" />
                <Text style={styles.sectionTitle}>Car Information</Text>
              </View>
              <View style={styles.carContainer}>
                <Image 
                  source={{ uri: rideDetails.car.photo_url || 'https://i.imgur.com/JZw5FzU.png' }} 
                  style={styles.carImage} 
                />
                <View style={styles.carDetails}>
                  <Text style={styles.carModel}>{rideDetails.car.make} {rideDetails.car.model}</Text>
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
  passengerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  passengerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  passengerDetails: {
    flex: 1,
  },
  passengerName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 8,
  },
  passengerTimeline: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  timelineLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#718096',
    width: 80,
  },
  timelineValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#2d3748',
    flex: 1,
  },
  ratingLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#718096',
    width: 120,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  noRatingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#718096',
  },
  routeItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  routeLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#718096',
    width: 80,
  },
  routeValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    flex: 1,
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