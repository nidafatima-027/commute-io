import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Bell, Sun, Info, HelpCircle, ArrowLeft, Calendar, MapPin, Shield, Lock } from 'lucide-react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen(){
  
    const handleBack = () => {
        router.back();
    };
    
    const handleAbout = () => {
      router.push('/setting_screens/about')
    }

    const handleDisplay = () => {
      router.push('/setting_screens/display')
    }

    const handleHelp = () => {
      router.push('/setting_screens/help')
    }

    const handleNotification = () => {
      router.push('/(tabs)/setting_screens/notification')
    }

    const handlePrivacy = () => {
      router.push('/(tabs)/setting_screens/privacy')
    }

    const handleSecurity = () => {
      router.push('/(tabs)/setting_screens/security')
    }

    return (
        <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ArrowLeft size={24} color="#2d3748" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Settings</Text>
            <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
            {/* App Preferences */}
            <Text style={styles.sectionTitle}>App Preferences</Text>

            <TouchableOpacity style={styles.item} onPress={handleNotification}>
            <View style={styles.iconContainer}>
                <Bell size={24} color="#2d3748" />
            </View>
            <View>
                <Text style={styles.itemTitle}>Notifications</Text>
                <Text style={styles.itemSubtitle}>Manage notifications</Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={handleDisplay}>
            <View style={styles.iconContainer}>
                <Sun size={24} color="#2d3748" />
            </View>
            <View>
                <Text style={styles.itemTitle}>Display Settings</Text>
                <Text style={styles.itemSubtitle}>Customize display settings</Text>
            </View>
            </TouchableOpacity>

            {/* Privacy & Security */}
            <Text style={styles.sectionTitle}>Privacy & Security</Text>

            <TouchableOpacity style={styles.item} onPress={handlePrivacy}>
            <View style={styles.iconContainer}>
                <Shield size={24} color="#2d3748" />
            </View>
            <View>
                <Text style={styles.itemTitle}>Privacy Settings</Text>
                <Text style={styles.itemSubtitle}>Control your privacy</Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={handleSecurity}>
            <View style={styles.iconContainer}>
                <Lock size={24} color="#2d3748" />
            </View>
            <View>
                <Text style={styles.itemTitle}>Security Settings</Text>
                <Text style={styles.itemSubtitle}>Manage account security</Text>
            </View>
            </TouchableOpacity>

            {/* Personal Preferences */}
            <Text style={styles.sectionTitle}>Personal Preferences</Text>

            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push('/auth/DailySchedule')}
            >
              <View style={styles.iconContainer}>
                 <Calendar size={24} color="#2d3748" /> 
              </View>
              <View>
                <Text style={styles.itemTitle}>Daily Schedule</Text>
                <Text style={styles.itemSubtitle}>Set your routine timings</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.item}
              onPress={() => router.push('/auth/PreferredpickupLocation')}
            >
              <View style={styles.iconContainer}>
                <MapPin size={24} color="#2d3748" /> 
              </View>
              <View>
                <Text style={styles.itemTitle}>Preferred Pickup Locations</Text>
                <Text style={styles.itemSubtitle}>Manage saved pickup points</Text>
              </View>
            </TouchableOpacity>


            {/* Other */}
            <Text style={styles.sectionTitle}>Other</Text>

            <TouchableOpacity style={styles.item} onPress={handleAbout}>
            <View style={styles.iconContainer}>
                <Info size={24} color="#2d3748" />
            </View>
            <View>
                <Text style={styles.itemTitle}>About</Text>
                <Text style={styles.itemSubtitle}>Learn more about the app</Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={handleHelp}>
            <View style={styles.iconContainer}>
                <HelpCircle size={24} color="#2d3748" />
            </View>
            <View>
                <Text style={styles.itemTitle}>Help</Text>
                <Text style={styles.itemSubtitle}>Learn more about the app</Text>
            </View>
            </TouchableOpacity>
        </ScrollView>
        </SafeAreaView>
    );
};

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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
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
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 16,
    marginTop: 24,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
  },
  itemSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
});

