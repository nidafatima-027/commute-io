import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { ChevronDown, X, Clock, ArrowLeft} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function RidesHistoryScreen () {
   const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    
  const handleBack = () => {
    router.push('/(tabs)/profile');
    };


  // Sample ride data
  const driverRides = [
    {
      id: 1,
      type: 'driver',
      date: 'Today, 8:00 AM',
      route: 'Campus to Downtown',
      details: '2 seats available',
      action: 'Cancel',
      secondaryAction: 'Reschedule',
      image: require('../../../assets/images/ride.png'), // Replace with your image
    }];
    const riderRides =[
    {
      id: 2,
      type: 'rider',
      date: 'Tomorrow, 10:00 AM',
      route: 'Campus to Airport',
      details: 'Driver: Omar',
      action: 'Cancel',
      secondaryAction: 'Reschedule',
      image: require('../../../assets/images/ride.png'), // Replace with your image
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
          <View style={styles.editButtonPlaceholder} />
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'past' && styles.activeTab]}
            onPress={() => setActiveTab('past')}
          >
            <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>Past</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Driver Section */}
          <Text style={styles.sectionTitle}>As a Driver</Text>
          {driverRides.map((ride) => (
            <View key={ride.id} style={styles.rideCard}>
              <View style={styles.rideDetails}>
                <Text style={styles.rideDate}>{ride.date}</Text>
                <Text style={styles.rideRoute}>{ride.route}</Text>
                <Text style={styles.rideInfo}>{ride.details}</Text>
                <View style={styles.actionContainer}>
                  <TouchableOpacity style={styles.cancelButton}>
                    <X size={16} color="#ff4444" />
                    <Text style={styles.cancelText}>{ride.action}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rescheduleButton}>
                    <Clock size={16} color="#3b82f6" />
                    <Text style={styles.rescheduleText}>{ride.secondaryAction}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Image source={ride.image} style={styles.rideImage} />
            </View>
          ))}

          {/* Rider Section */}
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>As a Rider</Text>
          {riderRides.map((ride) => (
            <View key={ride.id} style={styles.rideCard}>
              <View style={styles.rideDetails}>
                <Text style={styles.rideDate}>{ride.date}</Text>
                <Text style={styles.rideRoute}>{ride.route}</Text>
                <Text style={styles.rideInfo}>{ride.details}</Text>
                <View style={styles.actionContainer}>
                  <TouchableOpacity style={styles.cancelButton}>
                    <X size={16} color="#ff4444" />
                    <Text style={styles.cancelText}>{ride.action}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rescheduleButton}>
                    <Clock size={16} color="#3b82f6" />
                    <Text style={styles.rescheduleText}>{ride.secondaryAction}</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Image source={ride.image} style={styles.rideImage} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
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
  editButtonPlaceholder: {
    width: 40,
    height: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  activeTabText: {
    color: '#3b82f6',
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 16,
  },
  rideCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  rideImage: {
    width: 100,
    height: 120,
    resizeMode: 'cover',
  },
  rideDetails: {
    flex: 1,
    padding: 16,
  },
  rideDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  rideRoute: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 4,
  },
  rideInfo: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  cancelText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#ff4444',
    marginLeft: 4,
  },
  rescheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rescheduleText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3b82f6',
    marginLeft: 4,
  },
});
