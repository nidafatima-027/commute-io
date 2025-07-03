import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function RideInProgressScreen() {
    const params = useLocalSearchParams();
  const handleBack = () => {
    router.push('/(tabs)/ride-request-screen');
  };

  const handleEndRide = () => {
    // Navigate to ride summary screen with ride details
    router.push({
      pathname: '/(tabs)/ride-summary',
      params: {
        driverName: 'Alex',
        distance: '12.5 mi',
        duration: '25 min',
        cost: '$15.00',
      }
    });
  };
   const driverDetails = {
    name: params.driverName as string || 'Ethan Carter',
    rating: parseFloat(params.driverRating as string) || 4.8,
    rides: parseInt(params.driverRides as string) || 12,
    image: params.driverImage as string || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    route: params.route as string || 'Campus to Downtown',
    time: params.time as string || '10:00 AM',
    price: params.price as string || '500',
  };

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
        <Image
          source={{ uri: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800' }}
          style={styles.mapImage}
          resizeMode="cover"
        />
        
        {/* Map Overlay with Location Marker */}
        <View style={styles.mapOverlay}>
          <View style={styles.locationMarker}>
            <View style={styles.markerDot} />
            <Text style={styles.locationText}>KARACHI</Text>
          </View>
        </View>

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.zoomButton}>
            <Text style={styles.zoomText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton}>
            <Text style={styles.zoomText}>−</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar} />
        </View>

        {/* Time and Distance */}
        <View style={styles.timeContainer}>
          <Text style={styles.timeLeft}>24 Mins Left</Text>
          <Text style={styles.distance}>10 km</Text>
        </View>

        {/* Ride Details */}
        <View style={styles.rideDetails}>
          <Text style={styles.rideId}>Ride XXX-MJS</Text>
          <Text style={styles.location}>Gulshan e Jamal Block J</Text>
        </View>

        {/* Driver Info */}
        <View style={styles.driverInfo}>
          <Image
            source={{ uri: driverDetails.image }}
            style={styles.driverAvatar}
          />
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{driverDetails.name}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>{driverDetails.rating}</Text>
              <Text style={styles.rideCount}>• {driverDetails.rides} rides</Text>
            </View>
          </View>
        </View>

        {/* Price Info */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price: <Text style={styles.price}>500</Text></Text>
          <Text style={styles.paymentMethod}>Payment option: Cash</Text>
        </View>

        {/* End Ride Button */}
        <TouchableOpacity style={styles.endRideButton} onPress={handleEndRide}>
          <Text style={styles.endRideButtonText}>End Ride</Text>
        </TouchableOpacity>
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
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationMarker: {
    alignItems: 'center',
    position: 'absolute',
    bottom: '30%',
    left: '20%',
  },
  markerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff4444',
    marginBottom: 4,
  },
  locationText: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -40 }],
  },
  zoomButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  zoomText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
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
});