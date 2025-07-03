import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { ArrowLeft, X, Clock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function RideHistoryScreen() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  
  const handleBack = () => {
    router.push('/(tabs)/profile');
  };

  const handleReschedule = () => {
    router.push('/(tabs)/create-recurring-ride');
  };

  const handleRidePress = (ride: any) => {
    // Navigate to ride summary screen with ride details
    router.push({
      pathname: '/(tabs)/ride-summary',
      params: {
        driverName: ride.driverName || 'Driver',
        distance: '12.5 mi',
        duration: '25 min',
        cost: '$15.00',
      }
    });
  };

  // Sample ride data matching the design
  const driverRides = [
    {
      id: 1,
      type: 'driver',
      date: 'Today, 8:00 AM',
      route: 'Campus to Downtown',
      details: '2 seats available',
      action: 'Cancel',
      secondaryAction: 'Reschedule',
      image: 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=400',
      driverName: 'You',
    }
  ];

  const riderRides = [
    {
      id: 2,
      type: 'rider',
      date: 'Tomorrow, 10:00 AM',
      route: 'Campus to Airport',
      details: 'Driver: Omar',
      action: 'Cancel',
      secondaryAction: 'Reschedule',
      image: 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=400',
      driverName: 'Omar',
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
          {/* Driver Section */}
          <Text style={styles.sectionTitle}>As a Driver</Text>
          {driverRides.map((ride) => (
            <View key={ride.id} style={styles.rideCard}>
              <TouchableOpacity 
                style={styles.rideContent}
                onPress={() => handleRidePress(ride)}
                activeOpacity={0.7}
              >
                <View style={styles.rideDetails}>
                  <Text style={styles.rideDate}>{ride.date}</Text>
                  <Text style={styles.rideRoute}>{ride.route}</Text>
                  <Text style={styles.rideInfo}>{ride.details}</Text>
                </View>
                <Image source={{ uri: ride.image }} style={styles.rideImage} />
              </TouchableOpacity>
              <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.cancelButton}>
                  <Text style={styles.cancelText}>{ride.action}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rescheduleButton} onPress={handleReschedule}>
                  <Text style={styles.rescheduleText}>{ride.secondaryAction}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {/* Rider Section */}
          <Text style={[styles.sectionTitle, { marginTop: 32 }]}>As a Rider</Text>
          {riderRides.map((ride) => (
            <View key={ride.id} style={styles.rideCard}>
              <TouchableOpacity 
                style={styles.rideContent}
                onPress={() => handleRidePress(ride)}
                activeOpacity={0.7}
              >
                <View style={styles.rideDetails}>
                  <Text style={styles.rideDate}>{ride.date}</Text>
                  <Text style={styles.rideRoute}>{ride.route}</Text>
                  <Text style={styles.rideInfo}>{ride.details}</Text>
                </View>
                <Image source={{ uri: ride.image }} style={styles.rideImage} />
              </TouchableOpacity>
              <View style={styles.actionContainer}>
                <TouchableOpacity style={styles.cancelButton}>
                  <Text style={styles.cancelText}>{ride.action}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rescheduleButton} onPress={handleReschedule}>
                  <Text style={styles.rescheduleText}>{ride.secondaryAction}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
});