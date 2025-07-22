import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CreditCard as Edit, Clock, Settings, ChevronRight, PenIcon, Car } from 'lucide-react-native';
import { router } from 'expo-router';
import { usersAPI, carsAPI } from '../../services/api';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bio: string;
  is_driver: boolean;
  is_rider: boolean;
  gender: string;
  rider_rating: number;
  driver_rating: number;
  rides_taken: number;
  rides_offered: number;
  photo_url?: string;
  preferences?: {
    gender_preference: string;
    music_preference: string;
    conversation_preference: string;
    smoking_preference: string;
  };
}

interface CarDetails {
  id: number;
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  seats: number;
  ac_available: boolean;
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [cars, setCars] = useState<CarDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, carsData] = await Promise.all([
          usersAPI.getProfile(),
          carsAPI.getMyCars()
        ]);
        setProfile(profileData);
        setCars(carsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  const handleSettings = () => {
    router.push('/(tabs)/setting');
  };

  const handleBack = () => {
    router.back();
  };
  
  const handleEdit = () => {
    if (!profile) return; // Ensure profile exists
  router.push({
    pathname: '/(tabs)/profile_screens/edit',
    params: {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      gender: profile.gender,
      is_driver: profile.is_driver ? 'true' : 'false',
      is_rider: profile.is_rider ? 'true' : 'false',
      bio: profile.bio,
      photo_url: profile.photo_url || '',
      vehicleMake: cars.length > 0 ? cars[0].make : '',
      vehicleModel: cars.length > 0 ? cars[0].model : '',
      numberPlate: cars.length > 0 ? cars[0].license_plate : '',
      vehicleYear: cars.length > 0 ? cars[0].year.toString() : '',
      vehicleColor: cars.length > 0 ? cars[0].color : '',
      numberOfSeats: cars.length > 0 ? cars[0].seats.toString() : '',
      acAvailable: cars.length > 0 ? (cars[0].ac_available ? 'true' : 'false') : 'false',
      preferences: profile.preferences ? JSON.stringify(profile.preferences) : '{}',
    },
  });
  }

  const handleHistory = () => {
    router.push('/(tabs)/profile_screens/ride_history')
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No profile data available</Text>
      </SafeAreaView>
    );
  }

  const activityStats = [
    { label: 'Rider Rating' },
    { label: 'Rides Taken' },
    { label: 'Driver Rating' },
  ];

  // Preference display mapping
  const preferenceLabels = {
    gender_preference: {
      'No preference': 'No gender preference',
      'Male only': 'Prefers male passengers/drivers',
      'Female only': 'Prefers female passengers/drivers'
    },
    music_preference: {
      'No music': 'Prefers no music',
      'Light music': 'Prefers light music',
      'Loud music': 'Prefers loud music',
      'User can choose': 'Open to music preferences'
    },
    conversation_preference: {
      'Silent ride': 'Prefers silent rides',
      'Talkative ride': 'Prefers conversation',
      'No preference': 'No conversation preference'
    },
    smoking_preference: {
      'Required': 'Smoking allowed',
      'Preferred': 'Prefers smoking',
      'Not required': 'No smoking preference'
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#2d3748" />
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <PenIcon size={24} color="#2d3748" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: profile.photo_url }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.email}>{profile.email}</Text>
          <Text style={styles.email}>{profile.phone}</Text>
          <Text style={styles.email}>{profile.gender}</Text>
        </View>

{/* Preferences Section */}
        {profile.preferences && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ride Preferences</Text>
            <View style={styles.preferencesContainer}>
              <View style={styles.preferenceItem}>
                <Text style={styles.preferenceLabel}>Gender:</Text>
                <Text style={styles.preferenceValue}>
                  {preferenceLabels.gender_preference[profile.preferences.gender_preference as keyof typeof preferenceLabels.gender_preference] || 
                   profile.preferences.gender_preference}
                </Text>
              </View>
              <View style={styles.preferenceItem}>
                <Text style={styles.preferenceLabel}>Music:</Text>
                <Text style={styles.preferenceValue}>
                  {preferenceLabels.music_preference[profile.preferences.music_preference as keyof typeof preferenceLabels.music_preference] || 
                   profile.preferences.music_preference}
                </Text>
              </View>
              <View style={styles.preferenceItem}>
                <Text style={styles.preferenceLabel}>Conversation:</Text>
                <Text style={styles.preferenceValue}>
                  {preferenceLabels.conversation_preference[profile.preferences.conversation_preference as keyof typeof preferenceLabels.conversation_preference] || 
                   profile.preferences.conversation_preference}
                </Text>
              </View>
              <View style={styles.preferenceItem}>
                <Text style={styles.preferenceLabel}>Smoking:</Text>
                <Text style={styles.preferenceValue}>
                  {preferenceLabels.smoking_preference[profile.preferences.smoking_preference as keyof typeof preferenceLabels.smoking_preference] || 
                   profile.preferences.smoking_preference}
                </Text>
              </View>
            </View>
          </View>
        )}

{/* Car Section (only shown if user is a driver and has cars) */}
        {profile.is_driver && cars.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Car</Text>
            {cars.map((car) => (
              <View key={car.id} style={styles.carCard}>
                <View style={styles.carIcon}>
                  <Car size={24} color="#4ECDC4" />
                </View>
                <View style={styles.carDetails}>
                  <Text style={styles.carMakeModel}>{car.make} {car.model} ({car.year})</Text>
                  <Text style={styles.carPlate}>Plate: {car.license_plate}</Text>
                  <Text style={styles.carInfo}>
                    {car.color} • {car.seats} seats • AC: {car.ac_available ? 'Yes' : 'No'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Activity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{profile.is_rider ? '0.0': 'N/A'}</Text>
                <Text style={styles.statLabel}>{activityStats[0].label}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{profile.is_rider ?profile.rides_taken:'N/A'}</Text>
                <Text style={styles.statLabel}>{activityStats[1].label}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{profile.is_driver ? '0.0': 'N/A'}</Text>
                <Text style={styles.statLabel}>{activityStats[2].label}</Text>
              </View>
            </View>
            
            <View style={styles.statCardFull}>
               <Text style={styles.statValue}>
                {profile.is_driver ? profile.rides_offered: 'N/A'}
              </Text>
              <Text style={styles.statLabel}>Rides Offered</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.actionButton} onPress={handleHistory}>
            <Clock size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Ride History</Text>
            <ChevronRight size={20} color="#ffffff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleSettings}>
            <Settings size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Settings</Text>
            <ChevronRight size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            {profile.bio || "No bio available"}
          </Text>
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
  editButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3C4A6',
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
    marginBottom: 16,
  },
  preferencesContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  preferenceItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  preferenceLabel: {
    width: 120,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#4B5563',
  },
  preferenceValue: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#2d3748',
  },
  carCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  carIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  carDetails: {
    flex: 1,
  },
  carMakeModel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 4,
  },
  carPlate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  carInfo: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  statsGrid: {
    gap: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statCardFull: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statValue: {
    fontSize: 23,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  aboutText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2d3748',
    lineHeight: 24,
  },
});