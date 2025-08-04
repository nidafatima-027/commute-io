import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Star } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ridesAPI } from '../../services/api';

interface RideRatingDetails {
  id: number;
  ride_id: number;
  driver_id: number;
  driver_name: string;
  driver_photo: string | null;
  start_location: string;
  end_location: string;
  completed_at: string | null;
}

export default function RiderRateScreen() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [saveAsFavorite, setSaveAsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [rideDetails, setRideDetails] = useState<RideRatingDetails | null>(null);
  const params = useLocalSearchParams();

  const rideId = params.rideId ? Number(params.rideId) : null;
  const ratingId = params.rideRatingId ? Number(params.rideRatingId) : null;
  const driverId = params.driverId ? Number(params.driverId) : null;

  useEffect(() => {
    const fetchRideDetails = async () => {
      if (!rideId) {
        setFetching(false);
        return;
      }

      try {
        setFetching(true);
        const response = await ridesAPI.getRideDetails(rideId);
        setRideDetails({
          id: response.id,
          ride_id: response.id,
          driver_id: response.driver.id,
          driver_name: response.driver.name,
          driver_photo: response.driver.photo_url,
          start_location: response.start_location,
          end_location: response.end_location,
          completed_at: new Date().toISOString(), // Adjust based on your API
        });
      } catch (error) {
        console.error('Error fetching ride details:', error);
        Alert.alert('Error', 'Failed to load ride details');
      } finally {
        setFetching(false);
      }
    };

    fetchRideDetails();
  }, [rideId]);

  const handleClose = () => {
    router.back();
  };

  const handleSubmit = async () => {
    if (!ratingId || !rideId || !driverId) {
      Alert.alert('Error', 'Missing required information');
      return;
    }

    try {
      setLoading(true);
      
      // Update ride rating
      await ridesAPI.updateRideHistoryByUser(ratingId, {
        rating_given: rating,
        review_given: review,
      });

      // Handle save as favorite if needed
      if (saveAsFavorite) {
        // You would call your favorite API here
        console.log('Saved driver as favorite');
      }

      // Navigate back with refresh
      router.push({
        pathname: '/(tabs)',
        params: { refresh: Date.now().toString() }
      });
    } catch (error) {
      console.error('Error submitting rating:', error);
      Alert.alert('Error', 'Failed to submit rating. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStarPress = (starRating: number) => {
    setRating(starRating);
  };

  const renderStars = (currentRating: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isFilled = starNumber <= currentRating;
      
      return (
        <TouchableOpacity
          key={`star-${interactive ? 'interactive' : 'display'}-${index}`}
          onPress={interactive ? () => handleStarPress(starNumber) : undefined}
          disabled={!interactive}
          style={styles.starButton}
        >
          <Star
            size={interactive ? 32 : 20}
            color="#4ECDC4"
            fill={isFilled ? "#4ECDC4" : "transparent"}
          />
        </TouchableOpacity>
      );
    });
  };

  if (fetching) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ECDC4" />
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ECDC4" />
          <Text style={styles.loadingText}>Submitting your rating...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={24} color="#2d3748" />
          </TouchableOpacity>
          <Text style={styles.title}>Rate Your Ride</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* Main Title */}
          <Text style={styles.mainTitle}>How was your ride with {rideDetails?.driver_name || 'your driver'}?</Text>
          <Text style={styles.subtitle}>
            Share your experience to help improve our community
          </Text>

          {/* Ride Route */}
          {rideDetails && (
            <View style={styles.routeContainer}>
              <Text style={styles.routeText}>
                {rideDetails.start_location} → {rideDetails.end_location}
              </Text>
            </View>
          )}

          {/* Rating Section */}
          <View style={styles.ratingSection}>
            <Text style={styles.ratingPrompt}>Tap to rate:</Text>
            <View style={styles.interactiveStars}>
              {renderStars(rating, true)}
            </View>
            <Text style={styles.ratingDescription}>
              {rating === 0 ? 'Select a rating' : 
               rating === 1 ? 'Poor' :
               rating === 2 ? 'Fair' :
               rating === 3 ? 'Good' :
               rating === 4 ? 'Very Good' : 'Excellent'}
            </Text>
          </View>

          {/* Review Text Area */}
          <View style={styles.reviewSection}>
            <Text style={styles.reviewLabel}>Leave a review (optional)</Text>
            <TextInput
              style={styles.reviewInput}
              value={review}
              onChangeText={setReview}
              placeholder="What made this ride great or how could it improve?"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Save as Favorite */}
          <View style={styles.favoriteSection}>
            <View style={styles.favoriteContainer}>
              <Text style={styles.favoriteLabel}>Save driver as favorite</Text>
              <Switch
                value={saveAsFavorite}
                onValueChange={setSaveAsFavorite}
                trackColor={{ false: '#E5E7EB', true: '#4ECDC4' }}
                thumbColor={saveAsFavorite ? '#ffffff' : '#ffffff'}
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitButton, rating === 0 && styles.disabledButton]} 
            onPress={handleSubmit}
            disabled={rating === 0}
          >
            <Text style={styles.submitButtonText}>Submit Rating</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
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
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  mainTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#718096',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  routeContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  routeText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2d3748',
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  ratingPrompt: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 12,
  },
  interactiveStars: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  ratingDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#4ECDC4',
  },
  starButton: {
    padding: 4,
  },
  reviewSection: {
    marginBottom: 24,
  },
  reviewLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 12,
  },
  reviewInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2d3748',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 120,
  },
  favoriteSection: {
    marginBottom: 32,
  },
  favoriteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  favoriteLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
  },
  submitButton: {
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
  disabledButton: {
    backgroundColor: '#E5E7EB',
    shadowColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#718096',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});