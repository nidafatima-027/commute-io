import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image } from "react-native";
import { ArrowLeft, Search } from "lucide-react-native"; // example icons; install lucide-react-native or use react-native-vector-icons
import { router} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function FindRideScreen() {
   const rides = [
    {
      id: "1",
      destination: "123 Main St",
      details: "12 miles · $15/seat · 25 min",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
      driverName: "Ethan Carter",
      rating: 4.8,
      ridesCount: 12,
      fromLocation: "Campus",
      fromAddress: "123 University Ave",
      toLocation: "Downtown",
      toAddress: "123 Main St",
      departureTime: "10:00 AM",
      vehicle: "Toyota Camry",
      seatsAvailable: 3,
      price: "$15",
    },
    {
      id: "2",
      destination: "456 Oak Ave",
      details: "15 miles · $18/seat · 30 min",
      avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150",
      driverName: "Noah Thompson",
      rating: 4.7,
      ridesCount: 8,
      fromLocation: "Campus",
      fromAddress: "123 University Ave",
      toLocation: "Oak Avenue",
      toAddress: "456 Oak Ave",
      departureTime: "11:30 AM",
      vehicle: "Honda Civic",
      seatsAvailable: 2,
      price: "$18",
    },
    {
      id: "3",
      destination: "789 Pine Ln",
      details: "10 miles · $12/seat · 20 min",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
      driverName: "Olivia Bennett",
      rating: 4.9,
      ridesCount: 25,
      fromLocation: "Campus",
      fromAddress: "123 University Ave",
      toLocation: "Pine Lane",
      toAddress: "789 Pine Ln",
      departureTime: "2:00 PM",
      vehicle: "BMW 3 Series",
      seatsAvailable: 1,
      price: "$12",
    },
    {
      id: "4",
      destination: "101 Elm St",
      details: "18 miles · $20/seat · 35 min",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
      driverName: "Emma Wilson",
      rating: 4.9,
      ridesCount: 15,
      fromLocation: "Campus",
      fromAddress: "123 University Ave",
      toLocation: "Elm Street",
      toAddress: "101 Elm St",
      departureTime: "4:30 PM",
      vehicle: "Tesla Model 3",
      seatsAvailable: 4,
      price: "$20",
    },
  ];
    const handleBack = () => {
      router.back();
    };

const handleChatPress = () => {
    router.push('/(tabs)/ride-chat');
  };

    const handleRidePress = (ride: any) => {
    router.push({
      pathname: '/(tabs)/ride-details',
      params: {
        driverName: ride.driverName,
        driverRating: ride.rating.toString(),
        driverRides: ride.ridesCount.toString(),
        driverImage: ride.avatar,
        fromLocation: ride.fromLocation,
        fromAddress: ride.fromAddress,
        toLocation: ride.toLocation,
        toAddress: ride.toAddress,
        departureTime: ride.departureTime,
        vehicle: ride.vehicle,
        seatsAvailable: ride.seatsAvailable.toString(),
        price: ride.price,
      }
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#2d3748" />
        </TouchableOpacity>
        <Text style={styles.title}>Find a Ride</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Where to?"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Section Header */}
        <Text style={styles.sectionTitle}>Suggested Rides</Text>

        {/* Rides List */}
        {rides.map((ride) => (
          <TouchableOpacity 
            key={ride.id} 
            style={styles.rideCard}
            onPress={() => handleRidePress(ride)}
            activeOpacity={0.7}
          >
            <Image source={{ uri: ride.avatar }} style={styles.avatarImage} />
            <View style={styles.rideInfo}>
              <Text style={styles.destination}>To: {ride.destination}</Text>
              <Text style={styles.details}>{ride.details}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Chat Button */}
      <View style={styles.chatContainer}>
        <TouchableOpacity style={styles.chatButton} onPress={handleChatPress}>
          <Text style={styles.chatButtonText}>Chat with us</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    color: "#2d3748",
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#2d3748",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    color: "#2d3748",
    marginBottom: 20,
    marginTop: 8,
  },
  rideCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB",
  },
  avatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  rideInfo: {
    flex: 1,
  },
  destination: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    color: "#2d3748",
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#9CA3AF",
  },
  chatContainer: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  chatButton: {
    backgroundColor: "#4ECDC4",
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#4ECDC4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  chatButtonText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#ffffff",
  },
});