import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Home, Briefcase, GraduationCap } from 'lucide-react-native';
import { router } from 'expo-router';

export default function PreferedPickupLocations() {
    const handleClose = () => {
    router.push('/auth/profile-setup');
    };

     const handleAddNewLocation = () => {
    // TODO: Implement add location functionality
    console.log('Add new location pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#2d3748" />
          </TouchableOpacity>
          <Text style={styles.title}>Preferred Pickup Locations</Text>
          <View style={styles.placeholder} />
        </View>
      <View style={styles.content}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search for a location"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Saved Locations */}
          {[
            { title: 'Home', subtitle: '123 Elm Street, Anytown', Icon: Home, },
            { title: 'Office', subtitle: '456 Oak Avenue, Anytown',Icon: Briefcase, },
            { title: 'University', subtitle: '789 Pine Road, Anytown',Icon: GraduationCap, },
          ].map((location, index) => (
            <View key={index} style={styles.locationCard}>
                
              <View style={styles.iconBox}>
                <location.Icon size={24} color="#2d3748" />
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationTitle}>{location.title}</Text>
                <Text style={styles.locationSubtitle}>{location.subtitle}</Text>
              </View>
            </View>
          ))}

          {/* Add New Location Button */}
          <TouchableOpacity style={styles.addButton} onPress={handleAddNewLocation}>
            <Text style={styles.addButtonText}>Add New Location</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
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
  searchContainer: {
    marginBottom: 24,
  },
  searchInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2d3748',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    marginRight: 16,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 4,
  },
   iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  locationSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#718096',
  },
  addButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 16,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});