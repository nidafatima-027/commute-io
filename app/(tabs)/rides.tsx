import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, MapPin, Clock, User, MessageCircle, Star } from 'lucide-react-native';

export default function RidesScreen() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingRides = [
    {
      id: 1,
      type: 'passenger',
      driver: 'Sarah Johnson',
      from: 'Home',
      to: 'Office',
      date: 'Today',
      time: '8:30 AM',
      price: 12,
      status: 'confirmed',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 4.9,
    },
    {
      id: 2,
      type: 'driver',
      passengers: ['Mike Chen', 'Anna Lopez'],
      from: 'Downtown',
      to: 'Airport',
      date: 'Tomorrow',
      time: '2:00 PM',
      price: 25,
      status: 'pending',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
  ];

  const pastRides = [
    {
      id: 3,
      type: 'passenger',
      driver: 'David Wilson',
      from: 'University',
      to: 'Mall',
      date: 'Yesterday',
      time: '4:15 PM',
      price: 8,
      status: 'completed',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 4.7,
    },
    {
      id: 4,
      type: 'driver',
      passengers: ['Emma Davis'],
      from: 'City Center',
      to: 'Suburbs',
      date: '3 days ago',
      time: '6:30 PM',
      price: 18,
      status: 'completed',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
  ];

  const renderRideCard = (ride) => {
    const isDriver = ride.type === 'driver';
    const statusColor = {
      confirmed: '#10B981',
      pending: '#F59E0B',
      completed: '#6B7280',
    }[ride.status];

    return (
      <View key={ride.id} style={styles.rideCard}>
        <View style={styles.rideHeader}>
          <View style={styles.rideTypeIndicator}>
            <View style={[styles.typeIcon, { backgroundColor: isDriver ? '#44A08D' : '#4ECDC4' }]}>
              {isDriver ? <User size={16} color="#ffffff" /> : <MapPin size={16} color="#ffffff" />}
            </View>
            <Text style={styles.rideType}>{isDriver ? 'Driver' : 'Passenger'}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{ride.status}</Text>
          </View>
        </View>

        <View style={styles.personInfo}>
          <Image 
            source={{ uri: ride.image }} 
            style={styles.personImage} 
          />
          <View style={styles.personDetails}>
            {isDriver ? (
              <Text style={styles.personName}>
                {ride.passengers.length} passenger{ride.passengers.length > 1 ? 's' : ''}
              </Text>
            ) : (
              <View style={styles.driverInfo}>
                <Text style={styles.personName}>{ride.driver}</Text>
                {ride.rating && (
                  <View style={styles.ratingContainer}>
                    <Star size={14} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.rating}>{ride.rating}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.routeInfo}>
            <MapPin size={16} color="#718096" />
            <Text style={styles.location}>{ride.from} → {ride.to}</Text>
          </View>
          <View style={styles.timeInfo}>
            <Calendar size={16} color="#718096" />
            <Text style={styles.dateTime}>{ride.date}</Text>
            <Clock size={16} color="#718096" />
            <Text style={styles.dateTime}>{ride.time}</Text>
          </View>
        </View>

        <View style={styles.rideFooter}>
          <Text style={styles.price}>${ride.price}</Text>
          <View style={styles.actionButtons}>
            {ride.status === 'confirmed' && (
              <TouchableOpacity style={styles.messageButton}>
                <MessageCircle size={18} color="#4ECDC4" />
              </TouchableOpacity>
            )}
            {ride.status === 'pending' && (
              <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Rides</Text>
      </View>

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
            Past Rides
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'upcoming' ? (
          <>
            {upcomingRides.length > 0 ? (
              upcomingRides.map(renderRideCard)
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No upcoming rides</Text>
                <Text style={styles.emptyStateSubtext}>Book a ride or offer one to get started!</Text>
              </View>
            )}
          </>
        ) : (
          <>
            {pastRides.length > 0 ? (
              pastRides.map(renderRideCard)
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No past rides</Text>
                <Text style={styles.emptyStateSubtext}>Your ride history will appear here.</Text>
              </View>
            )}
          </>
        )}
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
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4ECDC4',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#718096',
  },
  activeTabText: {
    color: '#4ECDC4',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
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
    alignItems: 'center',
    marginBottom: 16,
  },
  rideTypeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rideType: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#718096',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    textTransform: 'capitalize',
  },
  personInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  personImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  personDetails: {
    flex: 1,
  },
  personName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  routeContainer: {
    marginBottom: 16,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#2d3748',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#718096',
    marginRight: 8,
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#4ECDC4',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#DC2626',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#718096',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
});