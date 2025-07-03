import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, MessageCircle, Phone, User } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function RideRequestScreen() {
  const [selectedAction, setSelectedAction] = useState<'accept' | 'reject' | null>(null);
  const params = useLocalSearchParams();

  const handleBack = () => {
    router.push('/(tabs)/join-requests');
  };

  const handleAccept = () => {
    setSelectedAction('accept');
    // Navigate to ride in progress page with driver details
    router.push({
      pathname: '/(tabs)/ride-in-progress',
      params: {
        driverName: requestDetails.passenger.name,
        driverRating: requestDetails.passenger.rating.toString(),
        driverRides: requestDetails.passenger.rides.toString(),
        driverImage: requestDetails.passenger.image,
        route: requestDetails.ride.route,
        time: requestDetails.ride.time,
        price: requestDetails.ride.price.toString(),
      }
    });
  };

  const handleReject = () => {
    setSelectedAction('reject');
    // Navigate back to join requests
    router.push('/(tabs)/join-requests');
  };

  const handleMessage = () => {
    router.push('/(tabs)/messages');
  };

  const handleCall = () => {
    // Handle phone call functionality
    console.log('Calling passenger...');
  };

  // Use params if available, otherwise use default data
  const requestDetails = {
    passenger: {
      name: params.driverName as string || 'Ethan Carter',
      rating: parseFloat(params.driverRating as string) || 4.8,
      rides: parseInt(params.driverRides as string) || 12,
      image: params.driverImage as string || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: params.driverBio as string || 'Friendly and reliable driver with 3+ years of carpooling experience. I enjoy good conversations and always keep my car clean and comfortable. Non-smoker and punctual.',
    },
    ride: {
      route: params.route as string || 'Campus to Downtown',
      time: params.time as string || '10:00 AM',
      seats: parseInt(params.seats as string) || 1,
      price: 15,
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

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Seats Requested</Text>
              <Text style={styles.detailValue}>{requestDetails.ride.seats} seat</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Price per seat</Text>
              <Text style={styles.priceValue}>${requestDetails.ride.price}</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={[styles.rejectButton, selectedAction === 'reject' && styles.selectedReject]} 
              onPress={handleReject}
            >
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.acceptButton, selectedAction === 'accept' && styles.selectedAccept]} 
              onPress={handleAccept}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>

          {/* Additional Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Pickup Instructions</Text>
            <Text style={styles.infoText}>
              Please wait at the main entrance of the campus. I'll be driving a blue Honda Civic.
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