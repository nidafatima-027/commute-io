import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Chrome as Home, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';

export default function CreateRecurringRideScreen() {
  const [selectedSchedule, setSelectedSchedule] = useState('Every weekday');
  const [selectedTime, setSelectedTime] = useState('8:00 AM');
  const [selectedPassengers, setSelectedPassengers] = useState('1 passenger');

  const handleBack = () => {
    router.push('/(tabs)/profile_screens/ride_history');
  };

  const handleCreateRide = () => {
    // Handle ride creation logic here
    router.push('/(tabs)/join-requests');
  };

  const handleSchedulePress = () => {
    // Handle schedule selection
  };

  const handleTimePress = () => {
    // Handle time selection
  };

  const handlePassengerPress = () => {
    // Handle passenger selection
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#2d3748" />
          </TouchableOpacity>
          <Text style={styles.title}>Create a recurring ride</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* Based on your trip section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Based on your trip</Text>
            
            <View style={styles.locationCard}>
              <View style={styles.locationIcon}>
                <MapPin size={20} color="#4ECDC4" />
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>Stanford University</Text>
                <Text style={styles.locationAddress}>123 University Ave, Palo Alto</Text>
              </View>
            </View>

            <View style={styles.locationCard}>
              <View style={styles.locationIcon}>
                <Home size={20} color="#4ECDC4" />
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>Home</Text>
                <Text style={styles.locationAddress}>123 Main St, San Francisco</Text>
              </View>
            </View>
          </View>

          {/* Schedule section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Schedule</Text>
            
            <TouchableOpacity style={styles.scheduleItem} onPress={handleSchedulePress}>
              <Text style={styles.scheduleText}>{selectedSchedule}</Text>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.scheduleItem} onPress={handleTimePress}>
              <Text style={styles.scheduleText}>{selectedTime}</Text>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.scheduleItem} onPress={handlePassengerPress}>
              <Text style={styles.scheduleText}>{selectedPassengers}</Text>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Create ride button */}
          <TouchableOpacity style={styles.createButton} onPress={handleCreateRide}>
            <Text style={styles.createButtonText}>Create ride</Text>
          </TouchableOpacity>
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
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
    marginBottom: 24,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  locationIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  scheduleText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#2d3748',
  },
  createButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    marginTop: 40,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});