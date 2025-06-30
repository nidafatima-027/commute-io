import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Calendar, Users, Filter, Star, Clock } from 'lucide-react-native';

export default function SearchScreen() {
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [passengers, setPassengers] = useState('1');

  const availableRides = [
    {
      id: 1,
      driver: 'Emma Wilson',
      rating: 4.9,
      from: 'Downtown Mall',
      to: 'International Airport',
      departureTime: '2:30 PM',
      arrivalTime: '3:15 PM',
      price: 18,
      availableSeats: 3,
      carModel: 'Honda Civic',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
      id: 2,
      driver: 'David Kim',
      rating: 4.8,
      from: 'University Campus',
      to: 'City Center',
      departureTime: '4:15 PM',
      arrivalTime: '4:45 PM',
      price: 12,
      availableSeats: 2,
      carModel: 'Toyota Camry',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
      id: 3,
      driver: 'Lisa Chen',
      rating: 5.0,
      from: 'Business District',
      to: 'Residential Area',
      departureTime: '6:00 PM',
      arrivalTime: '6:30 PM',
      price: 15,
      availableSeats: 1,
      carModel: 'BMW 3 Series',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Find a Ride</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#4ECDC4" />
          </TouchableOpacity>
        </View>

        {/* Search Form */}
        <View style={styles.searchForm}>
          <View style={styles.inputContainer}>
            <MapPin size={20} color="#718096" />
            <TextInput
              style={styles.input}
              placeholder="From where?"
              value={fromLocation}
              onChangeText={setFromLocation}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputContainer}>
            <MapPin size={20} color="#718096" />
            <TextInput
              style={styles.input}
              placeholder="Where to?"
              value={toLocation}
              onChangeText={setToLocation}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfInput]}>
              <Calendar size={20} color="#718096" />
              <Text style={styles.inputText}>{selectedDate}</Text>
            </View>

            <View style={[styles.inputContainer, styles.halfInput]}>
              <Users size={20} color="#718096" />
              <Text style={styles.inputText}>{passengers} passenger</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search Rides</Text>
          </TouchableOpacity>
        </View>

        {/* Available Rides */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Rides</Text>
          
          {availableRides.map((ride) => (
            <View key={ride.id} style={styles.rideCard}>
              <View style={styles.rideHeader}>
                <View style={styles.driverInfo}>
                  <Image source={{ uri: ride.image }} style={styles.driverImage} />
                  <View style={styles.driverDetails}>
                    <Text style={styles.driverName}>{ride.driver}</Text>
                    <View style={styles.ratingContainer}>
                      <Star size={14} color="#FFD700" fill="#FFD700" />
                      <Text style={styles.rating}>{ride.rating}</Text>
                      <Text style={styles.carModel}>• {ride.carModel}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>${ride.price}</Text>
                  <Text style={styles.perPerson}>per person</Text>
                </View>
              </View>

              <View style={styles.routeInfo}>
                <View style={styles.timeSlot}>
                  <Clock size={16} color="#718096" />
                  <Text style={styles.time}>{ride.departureTime}</Text>
                </View>
                <View style={styles.routeLine}>
                  <View style={styles.dot} />
                  <View style={styles.line} />
                  <View style={styles.dot} />
                </View>
                <View style={styles.timeSlot}>
                  <Clock size={16} color="#718096" />
                  <Text style={styles.time}>{ride.arrivalTime}</Text>
                </View>
              </View>

              <View style={styles.locationInfo}>
                <Text style={styles.location}>{ride.from}</Text>
                <Text style={styles.location}>{ride.to}</Text>
              </View>

              <View style={styles.rideFooter}>
                <Text style={styles.seatsInfo}>
                  {ride.availableSeats} seat{ride.availableSeats > 1 ? 's' : ''} available
                </Text>
                <TouchableOpacity style={styles.bookButton}>
                  <Text style={styles.bookButtonText}>Book Now</Text>
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
    backgroundColor: '#f8fffe',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchForm: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2d3748',
  },
  inputText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2d3748',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },
  searchButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  section: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 16,
  },
  rideCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  driverInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  driverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#718096',
  },
  carModel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#4ECDC4',
  },
  perPerson: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  time: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#718096',
  },
  routeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ECDC4',
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  location: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#2d3748',
    flex: 1,
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seatsInfo: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#718096',
  },
  bookButton: {
    backgroundColor: '#44A08D',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});