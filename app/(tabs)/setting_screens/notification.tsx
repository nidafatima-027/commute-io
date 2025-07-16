import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ArrowLeft, Bell, MessageCircle, Car, User, Mail, Moon, Volume2, Vibrate, RotateCcw } from 'lucide-react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationSettingsScreen() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [rideRequests, setRideRequests] = useState(true);
  const [rideUpdates, setRideUpdates] = useState(true);
  const [rideReminders, setRideReminders] = useState(true);
  const [messages, setMessages] = useState(true);
  const [profileActivity, setProfileActivity] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [quietHours, setQuietHours] = useState(false);
  const [quietStart, setQuietStart] = useState('22:00');
  const [quietEnd, setQuietEnd] = useState('08:00');

  const handleBack = () => {
    router.push('/(tabs)/setting');
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Reset Notification Settings',
      'Are you sure you want to reset all notification settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setPushNotifications(true);
            setRideRequests(true);
            setRideUpdates(true);
            setRideReminders(true);
            setMessages(true);
            setProfileActivity(false);
            setEmailNotifications(false);
            setSoundEnabled(true);
            setVibrationEnabled(true);
            setQuietHours(false);
          },
        },
      ]
    );
  };

  const testNotification = () => {
    Alert.alert('Test Notification', 'This is how notifications will appear!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#2d3748" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Notifications</Text>
          <TouchableOpacity onPress={resetToDefaults}>
            <RotateCcw size={24} color="#4ECDC4" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* General Settings */}
          <Text style={styles.sectionTitle}>General</Text>

          <View style={styles.item}>
            <View style={styles.iconContainer}>
              <Bell size={24} color="#2d3748" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Push Notifications</Text>
              <Text style={styles.itemSubtitle}>Enable all push notifications</Text>
            </View>
            <Switch 
              value={pushNotifications} 
              onValueChange={setPushNotifications}
              trackColor={{ false: '#E5E7EB', true: '#4ECDC4' }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Ride Notifications */}
          <Text style={styles.sectionTitle}>Ride Notifications</Text>

          <View style={[styles.item, !pushNotifications && styles.disabledItem]}>
            <View style={styles.iconContainer}>
              <Car size={24} color={pushNotifications ? "#2d3748" : "#9CA3AF"} />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.itemTitle, !pushNotifications && styles.disabledText]}>
                Ride Requests
              </Text>
              <Text style={[styles.itemSubtitle, !pushNotifications && styles.disabledText]}>
                New ride requests and responses
              </Text>
            </View>
            <Switch 
              value={rideRequests && pushNotifications} 
              onValueChange={setRideRequests}
              disabled={!pushNotifications}
              trackColor={{ false: '#E5E7EB', true: '#4ECDC4' }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={[styles.item, !pushNotifications && styles.disabledItem]}>
            <View style={styles.iconContainer}>
              <Bell size={24} color={pushNotifications ? "#2d3748" : "#9CA3AF"} />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.itemTitle, !pushNotifications && styles.disabledText]}>
                Ride Updates
              </Text>
              <Text style={[styles.itemSubtitle, !pushNotifications && styles.disabledText]}>
                Changes to your rides
              </Text>
            </View>
            <Switch 
              value={rideUpdates && pushNotifications} 
              onValueChange={setRideUpdates}
              disabled={!pushNotifications}
              trackColor={{ false: '#E5E7EB', true: '#4ECDC4' }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={[styles.item, !pushNotifications && styles.disabledItem]}>
            <View style={styles.iconContainer}>
              <Bell size={24} color={pushNotifications ? "#2d3748" : "#9CA3AF"} />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.itemTitle, !pushNotifications && styles.disabledText]}>
                Ride Reminders
              </Text>
              <Text style={[styles.itemSubtitle, !pushNotifications && styles.disabledText]}>
                Upcoming ride reminders
              </Text>
            </View>
            <Switch 
              value={rideReminders && pushNotifications} 
              onValueChange={setRideReminders}
              disabled={!pushNotifications}
              trackColor={{ false: '#E5E7EB', true: '#4ECDC4' }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Communication */}
          <Text style={styles.sectionTitle}>Communication</Text>

          <View style={[styles.item, !pushNotifications && styles.disabledItem]}>
            <View style={styles.iconContainer}>
              <MessageCircle size={24} color={pushNotifications ? "#2d3748" : "#9CA3AF"} />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.itemTitle, !pushNotifications && styles.disabledText]}>
                Messages
              </Text>
              <Text style={[styles.itemSubtitle, !pushNotifications && styles.disabledText]}>
                New messages from other users
              </Text>
            </View>
            <Switch 
              value={messages && pushNotifications} 
              onValueChange={setMessages}
              disabled={!pushNotifications}
              trackColor={{ false: '#E5E7EB', true: '#4ECDC4' }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={[styles.item, !pushNotifications && styles.disabledItem]}>
            <View style={styles.iconContainer}>
              <User size={24} color={pushNotifications ? "#2d3748" : "#9CA3AF"} />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.itemTitle, !pushNotifications && styles.disabledText]}>
                Profile Activity
              </Text>
              <Text style={[styles.itemSubtitle, !pushNotifications && styles.disabledText]}>
                Ratings and profile updates
              </Text>
            </View>
            <Switch 
              value={profileActivity && pushNotifications} 
              onValueChange={setProfileActivity}
              disabled={!pushNotifications}
              trackColor={{ false: '#E5E7EB', true: '#4ECDC4' }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Email Notifications */}
          <Text style={styles.sectionTitle}>Email Notifications</Text>

          <View style={styles.item}>
            <View style={styles.iconContainer}>
              <Mail size={24} color="#2d3748" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Email Alerts</Text>
              <Text style={styles.itemSubtitle}>Receive notifications via email</Text>
            </View>
            <Switch 
              value={emailNotifications} 
              onValueChange={setEmailNotifications}
              trackColor={{ false: '#E5E7EB', true: '#4ECDC4' }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Notification Style */}
          <Text style={styles.sectionTitle}>Notification Style</Text>

          <View style={[styles.item, !pushNotifications && styles.disabledItem]}>
            <View style={styles.iconContainer}>
              <Volume2 size={24} color={pushNotifications ? "#2d3748" : "#9CA3AF"} />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.itemTitle, !pushNotifications && styles.disabledText]}>
                Sound
              </Text>
              <Text style={[styles.itemSubtitle, !pushNotifications && styles.disabledText]}>
                Play sound for notifications
              </Text>
            </View>
            <Switch 
              value={soundEnabled && pushNotifications} 
              onValueChange={setSoundEnabled}
              disabled={!pushNotifications}
              trackColor={{ false: '#E5E7EB', true: '#4ECDC4' }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={[styles.item, !pushNotifications && styles.disabledItem]}>
            <View style={styles.iconContainer}>
              <Vibrate size={24} color={pushNotifications ? "#2d3748" : "#9CA3AF"} />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.itemTitle, !pushNotifications && styles.disabledText]}>
                Vibration
              </Text>
              <Text style={[styles.itemSubtitle, !pushNotifications && styles.disabledText]}>
                Vibrate for notifications
              </Text>
            </View>
            <Switch 
              value={vibrationEnabled && pushNotifications} 
              onValueChange={setVibrationEnabled}
              disabled={!pushNotifications}
              trackColor={{ false: '#E5E7EB', true: '#4ECDC4' }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Quiet Hours */}
          <Text style={styles.sectionTitle}>Quiet Hours</Text>

          <View style={[styles.item, !pushNotifications && styles.disabledItem]}>
            <View style={styles.iconContainer}>
              <Moon size={24} color={pushNotifications ? "#2d3748" : "#9CA3AF"} />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.itemTitle, !pushNotifications && styles.disabledText]}>
                Do Not Disturb
              </Text>
              <Text style={[styles.itemSubtitle, !pushNotifications && styles.disabledText]}>
                {quietHours ? `${quietStart} - ${quietEnd}` : 'Disabled'}
              </Text>
            </View>
            <Switch 
              value={quietHours && pushNotifications} 
              onValueChange={setQuietHours}
              disabled={!pushNotifications}
              trackColor={{ false: '#E5E7EB', true: '#4ECDC4' }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Test Notification */}
          <TouchableOpacity 
            style={[styles.testButton, !pushNotifications && styles.disabledButton]} 
            onPress={testNotification}
            disabled={!pushNotifications}
          >
            <Bell size={20} color={pushNotifications ? "#ffffff" : "#9CA3AF"} />
            <Text style={[styles.testButtonText, !pushNotifications && styles.disabledButtonText]}>
              Test Notification
            </Text>
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
  disabledItem: {
    opacity: 0.5,
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
  disabledText: {
    color: '#9CA3AF',
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
  },
  testButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
});