import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Settings, Menu, MessageCircle, Car, Plus, Navigation } from 'lucide-react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [selectedMode, setSelectedMode] = useState('Driver');
  const [searchText, setSearchText] = useState('');

  const handleSettings = () => {
    router.push('/(tabs)/setting');
  };

   const handleOfferRide = () => {
    router.push('/(tabs)/offer-ride');
  };

  const suggestedRides = [
    {
      id: 1,
      destination: 'To Downtown',
      time: '10:00 AM',
      image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 2,
      destination: 'To Airport',
      time: '11:30 AM',
      image: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: 3,
      destination: 'To University',
      time: '1:00 PM',
      image: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const upcomingRides = [
    {
      id: 1,
      destination: 'To Downtown',
      time: '10:00 AM',
    },
    {
      id: 2,
      destination: 'To Airport',
      time: '11:30 AM',
    },
  ];

  const driverStats = [
    {
      title: 'Rides Given',
      value: '5',
    },
    {
      title: 'Total Distance',
      value: '120 km',
    },
    {
      title: 'Avg. Rating',
      value: '4.8',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton}>
            <Menu size={24} color="#2d3748" />
          </TouchableOpacity>
          <Text style={styles.appTitle}>Carpool</Text>
          <TouchableOpacity style={styles.settingsButton}
            onPress={handleSettings}
          >
            <Settings size={24} color="#2d3748" />
          </TouchableOpacity>
        </View>

        {/* Mode Toggle */}
        <View style={styles.modeToggleContainer}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              selectedMode === 'Rider' && styles.activeModeButton
            ]}
            onPress={() => setSelectedMode('Rider')}
          >
            <Text style={[
              styles.modeButtonText,
              selectedMode === 'Rider' && styles.activeModeButtonText
            ]}>
              Rider
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              selectedMode === 'Driver' && styles.activeModeButton
            ]}
            onPress={() => setSelectedMode('Driver')}
          >
            <Text style={[
              styles.modeButtonText,
              selectedMode === 'Driver' && styles.activeModeButtonText
            ]}>
              Driver
            </Text>
          </TouchableOpacity>
        </View>

        {/* Driver Mode Content */}
        {selectedMode === 'Driver' ? (
          <>
            {/* Offer a Ride Button */}
            <View style={styles.offerRideContainer}>
              <TouchableOpacity style={styles.offerRideButton} onPress={handleOfferRide}>
                <Text style={styles.offerRideButtonText}>Offer a Ride</Text>
              </TouchableOpacity>
            </View>

            {/* Upcoming Rides */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Upcoming Rides</Text>
              {upcomingRides.map((ride) => (
                <View key={ride.id} style={styles.upcomingRideCard}>
                  <View style={styles.upcomingRideIcon}>
                    <Car size={20} color="#4ECDC4" />
                  </View>
                  <View style={styles.upcomingRideInfo}>
                    <Text style={styles.upcomingRideDestination}>{ride.destination}</Text>
                    <Text style={styles.upcomingRideTime}>{ride.time}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Recent Activity */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <View style={styles.statsContainer}>
                <View style={styles.statsRow}>
                  <View style={styles.statCard}>
                    <Text style={styles.statTitle}>{driverStats[0].title}</Text>
                    <Text style={styles.statValue}>{driverStats[0].value}</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={styles.statTitle}>{driverStats[1].title}</Text>
                    <Text style={styles.statValue}>{driverStats[1].value}</Text>
                  </View>
                </View>
                <View style={styles.statCardFull}>
                  <Text style={styles.statTitle}>{driverStats[2].title}</Text>
                  <Text style={styles.statValue}>{driverStats[2].value}</Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          <>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Search size={20} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                placeholder="Where to?"
                value={searchText}
                onChangeText={setSearchText}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Suggested Rides */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Suggested Rides</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestedRidesScroll}>
                {suggestedRides.map((ride) => (
                  <TouchableOpacity key={ride.id} style={styles.suggestedRideCard}>
                    <Image source={{ uri: ride.image }} style={styles.suggestedRideImage} />
                    <View style={styles.suggestedRideInfo}>
                      <Text style={styles.suggestedRideDestination}>{ride.destination}</Text>
                      <Text style={styles.suggestedRideTime}>{ride.time}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Upcoming Rides */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Upcoming Rides</Text>
              {upcomingRides.map((ride) => (
                <View key={ride.id} style={styles.upcomingRideCard}>
                  <View style={styles.upcomingRideIcon}>
                    <Car size={20} color="#4ECDC4" />
                  </View>
                  <View style={styles.upcomingRideInfo}>
                    <Text style={styles.upcomingRideDestination}>{ride.destination}</Text>
                    <Text style={styles.upcomingRideTime}>{ride.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* Floating Chat Button */}
      <TouchableOpacity style={styles.floatingChatButton}>
        <MessageCircle size={24} color="#ffffff" />
      </TouchableOpacity>
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
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeToggleContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: '#F3F4F6',
    borderRadius: 25,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 21,
  },
  activeModeButton: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeModeButtonText: {
    color: '#2d3748',
  },
  offerRideContainer: {
    paddingHorizontal: 24,
    marginBottom: 32,
    alignItems: 'center',
  },
  offerRideButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  offerRideButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2d3748',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
    marginBottom: 16,
  },
  suggestedRidesScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  suggestedRideCard: {
    width: 200,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  suggestedRideImage: {
    width: '100%',
    height: 120,
  },
  suggestedRideInfo: {
    padding: 16,
  },
  suggestedRideDestination: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 4,
  },
  suggestedRideTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  upcomingRideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  upcomingRideIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  upcomingRideInfo: {
    flex: 1,
  },
  upcomingRideDestination: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 4,
  },
  upcomingRideTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  statsContainer: {
    gap: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statCardFull: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
  },
  floatingChatButton: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});