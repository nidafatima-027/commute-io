import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ArrowLeft, Shield, Eye, MapPin, Users, Bell, Trash2, Download, RotateCcw } from 'lucide-react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacySettingsScreen() {
  const [profileVisibility, setProfileVisibility] = useState('Public');
  const [locationSharing, setLocationSharing] = useState(true);
  const [rideHistory, setRideHistory] = useState(true);
  const [contactSharing, setContactSharing] = useState(false);
  const [dataCollection, setDataCollection] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  const handleBack = () => {
    router.push('/(tabs)/setting');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deletion', 'Your account deletion request has been submitted.');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'We will prepare your data export and send it to your email address within 24 hours.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => Alert.alert('Success', 'Data export request submitted.') },
      ]
    );
  };

  const resetPrivacySettings = () => {
    Alert.alert(
      'Reset Privacy Settings',
      'Reset all privacy settings to default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: () => {
            setProfileVisibility('Public');
            setLocationSharing(true);
            setRideHistory(true);
            setContactSharing(false);
            setDataCollection(true);
            setMarketingEmails(false);
            setAnalytics(true);
          },
        },
      ]
    );
  };

  const visibilityOptions = ['Public', 'Friends Only', 'Private'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#2d3748" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Privacy Settings</Text>
          <TouchableOpacity onPress={resetPrivacySettings}>
            <RotateCcw size={24} color="#4ECDC4" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Profile Privacy */}
          <Text style={styles.sectionTitle}>Profile Privacy</Text>

          <View style={styles.item}>
            <View style={styles.iconContainer}>
              <Eye size={24} color="#2d3748" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Profile Visibility</Text>
              <Text style={styles.itemSubtitle}>Who can see your profile</Text>
            </View>
            <Text style={styles.currentValue}>{profileVisibility}</Text>
          </View>

          <View style={styles.optionsContainer}>
            {visibilityOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  profileVisibility === option && styles.selectedOption
                ]}
                onPress={() => setProfileVisibility(option)}
              >
                <Text style={[
                  styles.optionText,
                  profileVisibility === option && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Location & Sharing */}
          <Text style={styles.sectionTitle}>Location & Sharing</Text>

          <View style={styles.item}>
            <View style={styles.iconContainer}>
              <MapPin size={24} color="#2d3748" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Location Sharing</Text>
              <Text style={styles.itemSubtitle}>Share location during rides</Text>
            </View>
            <Switch 
              value={locationSharing} 
              onValueChange={setLocationSharing}
              trackColor={{ false: '#E5E7EB', true: '#4ECDC4' }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={styles.item}>
            <View style={styles.iconContainer}>
              <Users size={24} color="#2d3748" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Contact Sharing</Text>
              <Text style={styles.itemSubtitle}>Allow others to find you by phone/email</Text>
            </View>
            <Switch 
              value={contactSharing} 
              onValueChange={setContactSharing}
              trackColor={{ false: '#E5E7EB', true: '#4ECDC4' }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={styles.item}>
            <View style={styles.iconContainer}>
              <Shield size={24} color="#2d3748" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Ride History Visibility</Text>
              <Text style={styles.itemSubtitle}>Show ride history to other users</Text>
            </View>
            <Switch 
              value={rideHistory} 
              onValueChange={setRideHistory}
              trackColor={{ false: '#E5E7EB', true: '#4ECDC4' }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Data & Analytics */}
          <Text style={styles.sectionTitle}>Data & Analytics</Text>

          <View style={styles.item}>
            <View style={styles.iconContainer}>
              <Shield size={24} color="#2d3748" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Data Collection</Text>
              <Text style={styles.itemSubtitle}>Allow app usage analytics</Text>
            </View>
            <Switch 
              value={analytics} 
              onValueChange={setAnalytics}
              trackColor={{ false: '#E5E7EB', true: '#4ECDC4' }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={styles.item}>
            <View style={styles.iconContainer}>
              <Bell size={24} color="#2d3748" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Marketing Communications</Text>
              <Text style={styles.itemSubtitle}>Receive promotional emails</Text>
            </View>
            <Switch 
              value={marketingEmails} 
              onValueChange={setMarketingEmails}
              trackColor={{ false: '#E5E7EB', true: '#4ECDC4' }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Data Management */}
          <Text style={styles.sectionTitle}>Data Management</Text>

          <TouchableOpacity style={styles.actionButton} onPress={handleExportData}>
            <View style={styles.actionIconContainer}>
              <Download size={24} color="#4ECDC4" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.actionTitle}>Export My Data</Text>
              <Text style={styles.actionSubtitle}>Download a copy of your data</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dangerButton} onPress={handleDeleteAccount}>
            <View style={styles.dangerIconContainer}>
              <Trash2 size={24} color="#EF4444" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.dangerTitle}>Delete Account</Text>
              <Text style={styles.dangerSubtitle}>Permanently delete your account</Text>
            </View>
          </TouchableOpacity>

          {/* Privacy Notice */}
          <View style={styles.noticeContainer}>
            <Text style={styles.noticeTitle}>Privacy Notice</Text>
            <Text style={styles.noticeText}>
              We are committed to protecting your privacy. Your data is encrypted and stored securely. 
              We never sell your personal information to third parties. For more details, please read our Privacy Policy.
            </Text>
          </View>
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
  textContainer: {
    flex: 1,
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
  currentValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4ECDC4',
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2d3748',
  },
  selectedOptionText: {
    color: '#ffffff',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
  },
  actionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  dangerIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 12,
  },
  dangerTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
  },
  dangerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7F1D1D',
    marginTop: 2,
  },
  noticeContainer: {
    backgroundColor: '#F0FDFA',
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#B2F5EA',
  },
  noticeTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 12,
  },
  noticeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4A5568',
    lineHeight: 20,
  },
});