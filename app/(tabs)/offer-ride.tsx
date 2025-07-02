import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Calendar, Clock, Users, DollarSign, Chrome as Home } from 'lucide-react-native';
import { router } from 'expo-router';

export default function OfferRideScreen() {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [seats, setSeats] = useState('');
  const [baseFare, setBaseFare] = useState('');
  const [farePerPassenger, setFarePerPassenger] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleOfferRide = () => {
    // Handle ride creation logic here
    router.push('/(tabs)');
  };

  const totalDistance = 380; // miles - this would come from a mapping service
  const suggestedFare = 150;
  const farePerSeat = 75;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#2d3748" />
          </TouchableOpacity>
          <Text style={styles.title}>Offer a Ride</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* Route Section */}
          <View style={styles.section}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>From</Text>
              <View style={styles.inputContainer}>
                <MapPin size={20} color="#9CA3AF" />
                <TextInput
                  style={styles.input}
                  value={fromLocation}
                  onChangeText={setFromLocation}
                  placeholder="Enter pickup location"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>To</Text>
              <View style={styles.inputContainer}>
                <MapPin size={20} color="#9CA3AF" />
                <TextInput
                  style={styles.input}
                  value={toLocation}
                  onChangeText={setToLocation}
                  placeholder="Enter destination"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>

          {/* Date & Time Section */}
          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.halfInputGroup}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity style={styles.inputContainer}>
                  <Calendar size={20} color="#9CA3AF" />
                  <Text style={[styles.input, styles.inputText]}>
                    {date || 'Select date'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.halfInputGroup}>
                <Text style={styles.label}>Time</Text>
                <TouchableOpacity style={styles.inputContainer}>
                  <Clock size={20} color="#9CA3AF" />
                  <Text style={[styles.input, styles.inputText]}>
                    {time || 'Select time'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Seats Section */}
          <View style={styles.section}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Seats</Text>
              <View style={styles.inputContainer}>
                <Users size={20} color="#9CA3AF" />
                <TextInput
                  style={styles.input}
                  value={seats}
                  onChangeText={setSeats}
                  placeholder="Number of available seats"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Fare Suggestion Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fare Suggestion</Text>
            <Text style={styles.distanceText}>Total Distance: {totalDistance} miles</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Base Fare</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color="#9CA3AF" />
                <TextInput
                  style={styles.input}
                  value={baseFare}
                  onChangeText={setBaseFare}
                  placeholder="Enter base fare or cost per mile (optional)"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Text style={styles.suggestedText}>
              Suggested Fare: ${suggestedFare} total, ${farePerSeat} per passenger
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fare per passenger</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color="#9CA3AF" />
                <TextInput
                  style={styles.input}
                  value={farePerPassenger}
                  onChangeText={setFarePerPassenger}
                  placeholder="Enter fare per passenger"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Ride Summary Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ride Summary</Text>
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Fare per seat</Text>
                  <Text style={styles.summaryValue}>${farePerPassenger || farePerSeat}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Total estimated fare</Text>
                  <Text style={styles.summaryValue}>${farePerPassenger ? (parseInt(farePerPassenger) * parseInt(seats || '2')).toString() : suggestedFare}</Text>
                </View>
              </View>
              
              <View style={styles.summaryItemFull}>
                <Text style={styles.summaryLabel}>Seats available</Text>
                <Text style={styles.summaryValue}>{seats || '2'}</Text>
              </View>
            </View>
          </View>

          {/* Offer Ride Button */}
          <TouchableOpacity style={styles.offerButton} onPress={handleOfferRide}>
            <Text style={styles.offerButtonText}>Offer Ride</Text>
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
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  halfInputGroup: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2d3748',
  },
  inputText: {
    color: '#9CA3AF',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  distanceText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#718096',
    marginBottom: 16,
  },
  suggestedText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4ECDC4',
    marginBottom: 16,
    marginTop: 8,
  },
  summaryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryItemFull: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#718096',
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
  },
  offerButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  offerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});