import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Star } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function RideSummaryScreen() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [saveAsFavorite, setSaveAsFavorite] = useState(false);
  const params = useLocalSearchParams();

  const handleClose = () => {
    router.push('/(tabs)');
  };

  const handleSubmit = () => {
    // Handle submission logic here
    console.log('Rating:', rating);
    console.log('Review:', review);
    console.log('Save as favorite:', saveAsFavorite);
    router.push('/(tabs)/profile_screens/ride_history');
  };

  const handleStarPress = (starRating: number) => {
    setRating(starRating);
  };

  // Use params if available, otherwise use default data
  const rideData = {
    driverName: params.driverName as string || 'Alex',
    distance: params.distance as string || '12.5 mi',
    duration: params.duration as string || '25 min',
    cost: params.cost as string || '$15.00',
  };

  const ratingDistribution = [
    { stars: 5, percentage: 40 },
    { stars: 4, percentage: 30 },
    { stars: 3, percentage: 15 },
    { stars: 2, percentage: 10 },
    { stars: 1, percentage: 5 },
  ];

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

  const renderRatingBar = (stars: number, percentage: number) => {
    return (
      <View key={stars} style={styles.ratingBarContainer}>
        <Text style={styles.ratingNumber}>{stars}</Text>
        <View style={styles.ratingBarBackground}>
          <View style={[styles.ratingBarFill, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.ratingPercentage}>{percentage}%</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <X size={24} color="#2d3748" />
          </TouchableOpacity>
          <Text style={styles.title}>Ride Summary</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* Main Title */}
          <Text style={styles.mainTitle}>Your ride with {rideData.driverName}</Text>
          <Text style={styles.subtitle}>
            Here's a summary of your ride with {rideData.driverName}. You can rate your experience, leave a review, and save this ride as a favorite for future trips.
          </Text>

          {/* Ride Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Distance</Text>
                <Text style={styles.statValue}>{rideData.distance}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>Duration</Text>
                <Text style={styles.statValue}>{rideData.duration}</Text>
              </View>
            </View>
            <View style={styles.statCardFull}>
              <Text style={styles.statLabel}>Cost</Text>
              <Text style={styles.statValueLarge}>{rideData.cost}</Text>
            </View>
          </View>

          {/* Rate Your Ride */}
          <View style={styles.ratingSection}>
            <Text style={styles.sectionTitle}>Rate your ride</Text>
            
            <View style={styles.ratingContainer}>
              <View style={styles.currentRatingContainer}>
                <Text style={styles.currentRating}>4.5</Text>
                <View style={styles.starsContainer}>
                  {renderStars(4)}
                </View>
                <Text style={styles.reviewCount}>2 reviews</Text>
              </View>

              <View style={styles.ratingBarsContainer}>
                {ratingDistribution.map(item => renderRatingBar(item.stars, item.percentage))}
              </View>
            </View>

            {/* Interactive Rating */}
            <View style={styles.interactiveRatingContainer}>
              <Text style={styles.rateLabel}>Your rating:</Text>
              <View style={styles.interactiveStars}>
                {renderStars(rating, true)}
              </View>
            </View>
          </View>

          {/* Review Text Area */}
          <View style={styles.reviewSection}>
            <Text style={styles.reviewLabel}>Leave a review (optional)</Text>
            <TextInput
              style={styles.reviewInput}
              value={review}
              onChangeText={setReview}
              placeholder="Share your experience with other riders..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Save as Favorite */}
          <View style={styles.favoriteSection}>
            <View style={styles.favoriteContainer}>
              <Text style={styles.favoriteLabel}>Save as favorite ride</Text>
              <Switch
                value={saveAsFavorite}
                onValueChange={setSaveAsFavorite}
                trackColor={{ false: '#E5E7EB', true: '#4ECDC4' }}
                thumbColor={saveAsFavorite ? '#ffffff' : '#ffffff'}
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
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
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#718096',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  statsContainer: {
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  statCardFull: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#718096',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
  },
  statValueLarge: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
  },
  ratingSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
  },
  currentRatingContainer: {
    alignItems: 'center',
    flex: 1,
  },
  currentRating: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  reviewCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#718096',
  },
  ratingBarsContainer: {
    flex: 1,
    gap: 8,
  },
  ratingBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingNumber: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2d3748',
    width: 12,
  },
  ratingBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 4,
  },
  ratingPercentage: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#718096',
    width: 32,
    textAlign: 'right',
  },
  interactiveRatingContainer: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
  },
  rateLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 12,
  },
  interactiveStars: {
    flexDirection: 'row',
    gap: 8,
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
    minHeight: 100,
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
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});