import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image } from "react-native";
import { ArrowLeft, Search } from "lucide-react-native"; // example icons; install lucide-react-native or use react-native-vector-icons
import { FontAwesome } from '@expo/vector-icons';

export default function FindRideScreen() {
  const rides = [
    {
      id: "1",
      destination: "123 Main St",
      details: "12 miles · $15/seat · 25 min",
      avatar: "", // image url if you have
    },
    {
      id: "2",
      destination: "456 Oak Ave",
      details: "15 miles · $18/seat · 30 min",
      avatar: "",
    },
    {
      id: "3",
      destination: "789 Pine Ln",
      details: "10 miles · $12/seat · 20 min",
      avatar: "",
    },
    {
      id: "4",
      destination: "101 Elm St",
      details: "18 miles · $20/seat · 35 min",
      avatar: "",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <ArrowLeft color="#121717" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Find a Ride</Text>
        <View style={{ width: 24 }} /> 
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <View style={styles.searchIcon}>
            <Search color="#6B8080" size={20} />
          </View>
          <Text style={styles.searchPlaceholder}>Where to?</Text>
        </View>
      </View>

      {/* Suggested Rides */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Suggested Rides</Text>
      </View>

   <ScrollView>
  {rides.map((ride) => (
    <View key={ride.id} style={styles.rideCard}>
      <FontAwesome name="user-circle" size={56} color="#6B8080" />
      <View style={styles.rideInfo}>
        <Text style={styles.destination}>To: {ride.destination}</Text>
        <Text style={styles.details}>{ride.details}</Text>
      </View>
    </View>
  ))}
</ScrollView>
      <View style={styles.chatContainer}>
  <TouchableOpacity style={styles.chatButton}>
    <Text style={styles.chatButtonText}>Chat with us</Text>
  </TouchableOpacity>
</View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", 
    justifyContent:"center"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#121717",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    height: 48,
  },
  searchIcon: {
    paddingHorizontal: 16,
  },
  searchPlaceholder: {
    color: "#6B8080",
    fontSize: 16,
  },
  avatarImage: {
  width: 56,
  height: 56,
  borderRadius: 28,
},
chatContainer: {
  width: '100%',
  paddingHorizontal: 16,
  paddingVertical: 12,
  position: 'absolute',
  bottom: 20, // assuming you want it at the bottom
  justifyContent: 'center',
  alignItems: 'center',
},
chatButton: {
  height: 40,
  minWidth: 84,
  maxWidth: 480,
  paddingHorizontal: 16,
  backgroundColor: '#38ABA6',
  borderRadius: 20,
  justifyContent: 'center',
  alignItems: 'center',
},
chatButtonText: {
  textAlign: 'center',
  color: '#121717',
  fontSize: 14,
  fontWeight: '700',
  lineHeight: 21,
},
avatarIcon: {
  marginRight: 16,
  
}
,


  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#121717",
  },
  rideCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#F2F2F2",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  placeholderAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#D1D5DB",
  },
  rideInfo: {
    flex: 1,
  },
  destination: {
    fontSize: 16,
    fontWeight: "500",
    color: "#121717",
  },
  details: {
    fontSize: 14,
    color: "#6B8080",
    marginTop: 4,
  },
});
