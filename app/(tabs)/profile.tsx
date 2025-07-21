import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CreditCard as Edit, Clock, Settings, ChevronRight, PenIcon } from 'lucide-react-native';
import { router } from 'expo-router';
import { usersAPI } from '../../services/api';

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  is_driver: boolean;
  rider_rating: number;
  driver_rating: number;
  rides_taken: number;
  rides_offered: number;
  photo_url?: string;
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await usersAPI.getProfile();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
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
      bio: profile.bio,
      photo_url: profile.photo_url || '',
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
    { label: 'Rides\nTaken' },
    { label: 'Driver Rating' },
  ];

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
        </View>

        {/* Activity Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{0}</Text>
                <Text style={styles.statLabel}>{activityStats[0].label}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{profile.rides_taken}</Text>
                <Text style={styles.statLabel}>{activityStats[1].label}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{0}</Text>
                <Text style={styles.statLabel}>{activityStats[2].label}</Text>
              </View>
            </View>
            
            <View style={styles.statCardFull}>
               <Text style={styles.statValue}>
                {profile.is_driver ? profile.rides_offered: 'NOT APPLICABLE'}
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