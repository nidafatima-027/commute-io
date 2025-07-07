import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Clock, Car, Users, MessageCircle } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import RideRequestModal from '@/components/RideRequestModal';

export default function RideDetailsScreen() {
  const params = useLocalSearchParams();
  const [showModal, setShowModal] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleRequestRide = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    // Navigate back to search or home after successful request
    router.push('/(tabs)');
  };

  const handleMessage = () => {
    // Navigate to messages with this driver
    router.push({
      pathname: '/(tabs)/message_inbox',
      params: {
        name: rideDetails.driverName,
        image: rideDetails.driverImage,
      },
    });
  };

  // Use params if available, otherwise use default data
  const rideDetails = {
    driverName: params.driverName as string || 'Ethan Carter',
    driverRating: parseFloat(params.driverRating as string) || 4.8,
    driverRides: parseInt(params.driverRides as string) || 12,
    driverImage: params.driverImage as string || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    fromLocation: params.fromLocation as string || 'Campus',
    fromAddress: params.fromAddress as string || '123 University Ave',
    toLocation: params.toLocation as string || 'Home',
    toAddress: params.toAddress as string || '456 Main St',
    departureTime: params.departureTime as string || '10:00 AM',
    vehicle: params.vehicle as string || 'Toyota Camry',
    seatsAvailable: parseInt(params.seatsAvailable as string) || 4,
    price: params.price as string || '$15',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#2d3748" />
          </TouchableOpacity>
          <Text style={styles.title}>Ride Details</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* Driver Info */}
          <View style={styles.driverSection}>
            <View style={styles.driverImageContainer}>
              <Image 
                source={{ uri: rideDetails.driverImage }} 
                style={styles.driverImage} 
              />
            </View>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{rideDetails.driverName}</Text>
              <Text style={styles.driverRole}>Driver</Text>
              <Text style={styles.driverStats}>
                {rideDetails.driverRating} • {rideDetails.driverRides} rides
              </Text>
            </View>
          </View>

          {/* Route Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Route</Text>
            
            <View style={styles.routeItem}>
              <View style={styles.routeIcon}>
                <MapPin size={20} color="#4ECDC4" />
              </View>
              <View style={styles.routeInfo}>
                <Text style={styles.routeLocation}>{rideDetails.fromLocation}</Text>
                <Text style={styles.routeAddress}>{rideDetails.fromAddress}</Text>
              </View>
            </View>

            <View style={styles.routeItem}>
              <View style={styles.routeIcon}>
                <MapPin size={20} color="#4ECDC4" />
              </View>
              <View style={styles.routeInfo}>
                <Text style={styles.routeLocation}>{rideDetails.toLocation}</Text>
                <Text style={styles.routeAddress}>{rideDetails.toAddress}</Text>
              </View>
            </View>

            {/* Map Preview */}
            <View style={styles.mapContainer}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=600' }}
                style={styles.mapImage}
                resizeMode="cover"
              />
              <View style={styles.mapOverlay}>
                <View style={styles.mapMarker} />
              </View>
            </View>
          </View>

          {/* Ride Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ride Information</Text>
            
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Clock size={20} color="#4ECDC4" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Departure Time</Text>
                  <Text style={styles.infoValue}>{rideDetails.departureTime}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Car size={20} color="#4ECDC4" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Vehicle</Text>
                  <Text style={styles.infoValue}>{rideDetails.vehicle}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Users size={20} color="#4ECDC4" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Seats Available</Text>
                  <Text style={styles.infoValue}>{rideDetails.seatsAvailable}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.requestButton} onPress={handleRequestRide}>
              <Text style={styles.requestButtonText}>Request Ride</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
              <MessageCircle size={20} color="#4ECDC4" />
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price per seat</Text>
            <Text style={styles.priceValue}>{rideDetails.price}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Ride Request Modal */}
      <RideRequestModal 
        visible={showModal} 
        onClose={handleModalClose} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fffe',
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
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  driverSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  driverImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  driverImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  driverInfo: {
    alignItems: 'center',
  },
  driverName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  driverRole: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#4ECDC4',
    marginBottom: 4,
  },
  driverStats: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#718096',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 16,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  routeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  routeInfo: {
    flex: 1,
  },
  routeLocation: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 4,
  },
  routeAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#718096',
  },
  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
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
  mapMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4ECDC4',
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#718096',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  requestButton: {
    flex: 1,
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
  requestButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    padding: 18,
    borderWidth: 2,
    borderColor: '#4ECDC4',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  messageButtonText: {
    color: '#4ECDC4',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  priceContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#718096',
    marginBottom: 8,
  },
  priceValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#4ECDC4',
  },
});