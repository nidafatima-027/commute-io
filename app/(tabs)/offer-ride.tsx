import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Calendar, Clock, Users, DollarSign } from 'lucide-react-native';
import { router } from 'expo-router';
import { ridesAPI, carsAPI } from '../../services/api';

export default function OfferRideScreen() {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<Date | undefined>();
  const [seats, setSeats] = useState('');
  const [costPerMile, setCostPerMile] = useState('0.5'); // default cost per mile
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!fromLocation.trim()) errors.fromLocation = 'Pickup location is required.';
    if (!toLocation.trim()) errors.toLocation = 'Destination is required.';
    if (!date) errors.date = 'Date is required.';
    if (!time) errors.time = 'Time is required.';
    if (!seats.trim() || isNaN(Number(seats)) || Number(seats) <= 0)
      errors.seats = 'Valid number of seats is required.';
    if (!costPerMile.trim() || isNaN(Number(costPerMile)) || Number(costPerMile) <= 0)
      errors.costPerMile = 'Cost per mile must be a positive number.';

    return errors;
  };

  const handleOfferRide = async () =>  {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});  
    try {
    // 1. Get user's default car
    const carsResponse = await carsAPI.getMyCars();
    if (!carsResponse.length) {
      Alert.alert("Error", "You need to register a car first");
      return;
    }
    if (!date || !time) {
      Alert.alert("Error", "Date and time are required");
      return;
    }

    // 2. Combine date and time
    const combinedDateTime = new Date(
      date!.getFullYear(),
      date!.getMonth(),
      date!.getDate(),
      time!.getHours(),
      time!.getMinutes()
    );

    // 3. Prepare ride data (using component state variables)
    const rideData = {
      car_id: carsResponse[0].id,
      start_location: fromLocation,
      end_location: toLocation,
      start_time: combinedDateTime.toISOString(),
      seats_available: parseInt(seats),
      total_fare: parseInt(totalFare), // Example fare calculation
    };

    // 4. Create ride
    const response = await ridesAPI.createRide(rideData);
    
    // 5. Navigate to join requests
    router.push({
      pathname: '/(tabs)/join-requests',
      params: { rideId: response.id }
    });
  } catch (error) {
    console.error('Ride creation failed:', error);
    Alert.alert(
      "Error", 
      error instanceof Error ? error.message : "Failed to create ride"
    );
  }
  };

  // Simulated distance
  const totalDistance = 10; // For example purposes (miles)

  const numericSeats = parseInt(seats) || 1;
  const numericCostPerMile = parseFloat(costPerMile) || 0.5;

  const farePerSeat = (totalDistance * numericCostPerMile).toFixed(2);
  const totalFare = (numericSeats * totalDistance * numericCostPerMile).toFixed(2);

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
          {/* Route */}
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
              {formErrors.fromLocation && (
                <Text style={styles.errorText}>{formErrors.fromLocation}</Text>
              )}
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
              {formErrors.toLocation && (
                <Text style={styles.errorText}>{formErrors.toLocation}</Text>
              )}
            </View>
          </View>

          {/* Date & Time */}
          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.halfInputGroup}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Calendar size={20} color="#9CA3AF" />
                  <Text style={[styles.input, styles.inputText]}>
                    {date ? date.toDateString() : 'Select date'}
                  </Text>
                </TouchableOpacity>
                {formErrors.date && (
                  <Text style={styles.errorText}>{formErrors.date}</Text>
                )}
              </View>

              <View style={styles.halfInputGroup}>
                <Text style={styles.label}>Time</Text>
                <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Clock size={20} color="#9CA3AF" />
                  <Text style={[styles.input, styles.inputText]}>
                    {time
                      ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : 'Select time'}
                  </Text>
                </TouchableOpacity>
                {formErrors.time && (
                  <Text style={styles.errorText}>{formErrors.time}</Text>
                )}
              </View>
            </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              mode="date"
              value={date || new Date()}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selected) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selected) setDate(selected);
              }}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              mode="time"
              value={time || new Date()}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selected) => {
                setShowTimePicker(Platform.OS === 'ios');
                if (selected) setTime(selected);
              }}
            />
          )}

          {/* Seats */}
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
              {formErrors.seats && (
                <Text style={styles.errorText}>{formErrors.seats}</Text>
              )}
            </View>
          </View>

          {/* Cost per Mile */}
          <View style={styles.section}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cost per Mile (PKR)</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color="#9CA3AF" />
                <TextInput
                  style={styles.input}
                  value={costPerMile}
                  onChangeText={setCostPerMile}
                  placeholder="e.g., 0.5"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>
              {formErrors.costPerMile && (
                <Text style={styles.errorText}>{formErrors.costPerMile}</Text>
              )}
            </View>
          </View>

          {/* Ride Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Fare per seat</Text>
                <Text style={styles.summaryValue}>PKR {farePerSeat}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Total estimated fare</Text>
                <Text style={styles.summaryValue}>PKR {totalFare}</Text>
              </View>
            </View>

            <View style={styles.summaryItemFull}>
              <Text style={styles.summaryLabel}>Seats available</Text>
              <Text style={styles.summaryValue}>{seats || '1'}</Text>
            </View>
          </View>

          {/* Offer Ride */}
          <TouchableOpacity style={styles.offerButton} onPress={handleOfferRide}>
            <Text style={styles.offerButtonText}>Offer Ride</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Reuse your existing styles


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fffe',
  },
    errorText: { color: 'red', fontSize: 12, marginTop: 4 },

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
    paddingVertical:34,
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