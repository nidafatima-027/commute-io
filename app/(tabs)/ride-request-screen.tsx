import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, MessageCircle, Phone, User, MapPin } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {ridesAPI,usersAPI} from '../../services/api'

export default function RideRequestScreen() {
  const [selectedAction, setSelectedAction] = useState<'accept' | 'reject' | null>(null);
  const params = useLocalSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);


  const handleBack = () => {
    router.push({
      pathname: '/(tabs)/join-requests',
      params: { rideId: params.rideId, refresh: Date.now().toString() }
    })
  };

  const handleAccept = async () => {
    try {
      setIsProcessing(true);
      setSelectedAction('accept');
      
      // Update the request status to 'accepted'
      await ridesAPI.updateRideRequest(parseInt(params.requestId as string), 'accepted');
      
      // Decrement available seats by 1
      await ridesAPI.updateRide(parseInt(params.rideId as string), {
        seats_available: parseInt(params.seats_available as string) - 1
      });
      await ridesAPI.createRideHistory(
        parseInt(params.rider_id as string), // Assuming userId is passed in params
      parseInt(params.rideId as string),
      'rider'  // Since this is a passenger joining the ride
    );


      // Navigate to ride in progress page with driver details
      router.push({
      pathname: '/(tabs)/join-requests',
      params: { rideId: params.rideId, refresh: Date.now().toString() }
    })
    } catch (error) {
      console.error('Error accepting ride request:', error);
      Alert.alert('Error', 'Failed to accept ride request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject =async () => {
    try {
      setIsProcessing(true);
      setSelectedAction('reject');
      
      // Update the request status to 'rejected'
      await ridesAPI.updateRideRequest(parseInt(params.requestId as string), 'rejected');
      
      // Navigate back to join requests
      router.push({
      pathname: '/(tabs)/join-requests',
      params: { rideId: params.rideId, refresh: Date.now().toString() }
    })
    } catch (error) {
      console.error('Error rejecting ride request:', error);
      Alert.alert('Error', 'Failed to reject ride request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMessage = () => {
    router.push({
          pathname: '/(tabs)/message_inbox',
          params: {
            userId: requestDetails.passenger.id,
            name: requestDetails.passenger.name,
            image: requestDetails.passenger.image,
            rideId: params.rideId,
            rideRoute: `${requestDetails.ride.pickup} to ${requestDetails.ride.dropoff}`,
          },
        });
  };

  const handleCall = () => {
    // Handle phone call functionality
    console.log('Calling passenger...');
  };

  // Use params if available, otherwise use default data
  const requestDetails = {
    passenger: {
      id: params.rider_id as string || '1',
      name: params.name as string || 'Ethan Carter',
      rating: params.rating as string,
      rides: params.rides_taken as string,
      image: params.photo_url as string || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: params.bio as string || 'Friendly and reliable driver with 3+ years of carpooling experience. I enjoy good conversations and always keep my car clean and comfortable. Non-smoker and punctual.',
    },
    ride: {
      route: params.route as string || 'Campus to Downtown',
      time: params.time as string || '10:00 AM',
      seats: parseInt(params.seats as string) || 1,
      price: params.price,
      seats_available: parseInt(params.seats_available as string) || 1,
      pickup: params.pickup_location as string || 'Main Campus Entrance',
      dropoff: params.dropoff_location as string || 'Downtown Square',
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#2d3748" />
          </TouchableOpacity>
          <Text style={styles.title}>Ride Request</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* Passenger Info */}
          <View style={styles.passengerCard}>
            <Image 
              source={{ uri: requestDetails.passenger.image }} 
              style={styles.passengerImage} 
            />
            <View style={styles.passengerDetails}>
              <Text style={styles.passengerName}>{requestDetails.passenger.name}</Text>
              <View style={styles.ratingContainer}>
                <Star size={16} color="#FFD700" fill="#FFD700" />
                <Text style={styles.ratingText}>{requestDetails.passenger.rating}</Text>
                <Text style={styles.ridesText}>• {requestDetails.passenger.rides} rides</Text>
              </View>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
                <MessageCircle size={20} color="#4ECDC4" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.callButton} onPress={handleCall}>
                <Phone size={20} color="#4ECDC4" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Driver Bio */}
          <View style={styles.bioCard}>
            <View style={styles.bioHeader}>
              <User size={20} color="#4ECDC4" />
              <Text style={styles.bioTitle}>About {requestDetails.passenger.name}</Text>
            </View>
            <Text style={styles.bioText}>{requestDetails.passenger.bio}</Text>
          </View>

          {/* Ride Details */}
          <View style={styles.rideDetailsCard}>
            <Text style={styles.sectionTitle}>Ride Details</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Route</Text>
              <Text style={styles.detailValue}>{requestDetails.ride.route}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{requestDetails.ride.time}</Text>
            </View>

            <View style={styles.locationRow}>
              <MapPin size={16} color="#4ECDC4" />
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationLabel}>Pickup Location</Text>
                <Text style={styles.locationValue}>{requestDetails.ride.pickup}</Text>
              </View>
            </View>

            <View style={styles.locationRow}>
              <MapPin size={16} color="#EF4444" />
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationLabel}>Dropoff Location</Text>
                <Text style={styles.locationValue}>{requestDetails.ride.dropoff}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Seats Requested</Text>
              <Text style={styles.detailValue}>{requestDetails.ride.seats} seat</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Price per seat</Text>
              <Text style={styles.priceValue}>PKR {requestDetails.ride.price}</Text>
            </View>
          </View>

          {/* Action Buttons */}
           <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={[styles.rejectButton, selectedAction === 'reject' && styles.selectedReject]} 
              onPress={handleReject}
              disabled={isProcessing}
            >
              <Text style={styles.rejectButtonText}>
                {isProcessing && selectedAction === 'reject' ? 'Processing...' : 'Reject'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.acceptButton, selectedAction === 'accept' && styles.selectedAccept]} 
              onPress={handleAccept}
              disabled={isProcessing}
            >
              <Text style={styles.acceptButtonText}>
                {isProcessing && selectedAction === 'accept' ? 'Processing...' : 'Accept'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Additional Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Pickup Instructions</Text>
            <Text style={styles.infoText}>
              Please wait at the stop. I'll be waitng there.
            </Text>
          </View>
        </View>
      </ScrollView>
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
  passengerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  passengerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  passengerDetails: {
    flex: 1,
  },
  passengerName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#4ECDC4',
  },
  ridesText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#4ECDC4',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  messageButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bioCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  bioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  bioTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
  },
  bioText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#718096',
    lineHeight: 20,
  },
  rideDetailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#718096',
  },
  locationValue: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2d3748',
    marginTop: 2,
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#718096',
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
  },
  priceValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#4ECDC4',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EF4444',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedReject: {
    backgroundColor: '#FEF2F2',
  },
  rejectButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  acceptButton: {
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
  selectedAccept: {
    backgroundColor: '#44A08D',
  },
  acceptButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  infoCard: {
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#B2F5EA',
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#718096',
    lineHeight: 20,
  },
});