import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Car, Star } from 'lucide-react-native';
import { router } from 'expo-router';

export default function JoinRequestsScreen() {
  const handleBack = () => {
    router.push('/(tabs)/create-recurring-ride');
  };

  const handleViewRequest = (request: any) => {
    // Navigate to ride request screen with driver details
    router.push({
      pathname: '/(tabs)/ride-request-screen',
      params: {
        driverId: request.id,
        driverName: request.name,
        driverRating: request.rating,
        driverRides: request.rides,
        driverImage: request.image,
        driverBio: request.bio,
        route: rideInfo.route,
        time: rideInfo.time,
        seats: rideInfo.seats,
      }
    });
  };

  const rideInfo = {
    route: 'Campus to Downtown',
    time: '10:00 AM',
    seats: 2,
  };

  const pendingRequests = [
    {
      id: 1,
      name: 'Ethan Carter',
      rating: 4.8,
      rides: 12,
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Friendly and reliable driver with 3+ years of carpooling experience. I enjoy good conversations and always keep my car clean and comfortable. Non-smoker and punctual.',
    },
    {
      id: 2,
      name: 'Olivia Bennett',
      rating: 4.9,
      rides: 25,
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Professional commuter who values safety and comfort. I drive a spacious SUV with AC and prefer quiet rides. Always on time and happy to help with luggage.',
    },
    {
      id: 3,
      name: 'Noah Thompson',
      rating: 4.7,
      rides: 8,
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Student driver offering affordable rides to fellow students. I drive a compact car, perfect for city commutes. Love music and good company during rides.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#2d3748" />
          </TouchableOpacity>
          <Text style={styles.title}>Join Requests</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* Ride Info */}
          <View style={styles.rideInfoCard}>
            <View style={styles.rideIcon}>
              <Car size={24} color="#4ECDC4" />
            </View>
            <View style={styles.rideDetails}>
              <Text style={styles.routeText}>{rideInfo.route}</Text>
              <Text style={styles.rideTimeText}>
                {rideInfo.time} • {rideInfo.seats} seats
              </Text>
            </View>
          </View>

          {/* Pending Requests Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Requests</Text>
            
            {pendingRequests.map((request) => (
              <View key={request.id} style={styles.requestCard}>
                <View style={styles.requestInfo}>
                  <Image source={{ uri: request.image }} style={styles.avatar} />
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{request.name}</Text>
                    <View style={styles.userStats}>
                      <View style={styles.ratingContainer}>
                        <Star size={14} color="#FFD700" fill="#FFD700" />
                        <Text style={styles.ratingText}>{request.rating}</Text>
                      </View>
                      <Text style={styles.ridesText}>• {request.rides} rides</Text>
                    </View>
                    <Text style={styles.bioPreview} numberOfLines={2}>
                      {request.bio}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.viewButton}
                  onPress={() => handleViewRequest(request)}
                >
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            ))}
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
  rideInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rideIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rideDetails: {
    flex: 1,
  },
  routeText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 4,
  },
  rideTimeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4ECDC4',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 20,
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  requestInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 4,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4ECDC4',
  },
  ridesText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4ECDC4',
    marginLeft: 4,
  },
  bioPreview: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#718096',
    lineHeight: 16,
  },
  viewButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  viewButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
  },
});