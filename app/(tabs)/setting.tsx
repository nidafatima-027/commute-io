import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Bell, Sun, Info, HelpCircle, ArrowLeft, Calendar , MapPin} from 'lucide-react-native';
import { router } from 'expo-router';

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
      router.push('/setting_screens/notification')
    }

    return (
        <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
            <ArrowLeft size={28} color="black" onPress={handleBack}/>
            <Text style={styles.headerText}>Settings</Text>
            <View style={{ width: 28 }} /> 
        </View>

        <ScrollView contentContainerStyle={styles.content}>
            {/* App Preferences */}
            <Text style={styles.sectionTitle}>App Preferences</Text>

            <TouchableOpacity style={styles.item} onPress={handleNotification}>
            <View style={styles.iconContainer}>
                <Bell size={24} color="black" />
            </View>
            <View>
                <Text style={styles.itemTitle}>Notifications</Text>
                <Text style={styles.itemSubtitle}>Manage notifications</Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={handleDisplay}>
            <View style={styles.iconContainer}>
                <Sun size={24} color="black" />
            </View>
            <View>
                <Text style={styles.itemTitle}>Display Settings</Text>
                <Text style={styles.itemSubtitle}>Customize display settings</Text>
            </View>
            </TouchableOpacity>
            <View style={styles.section}>
  <Text style={styles.sectionTitle}>Personal Preferences</Text>

  <TouchableOpacity
    style={styles.item}
    onPress={() => router.push('/auth/DailySchedule')}
  >
    <View style={styles.iconContainer}>
       <Calendar size={24} color="black" /> 
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
      <MapPin size={24} color="black" /> 
    </View>
    <View>
      <Text style={styles.itemTitle}>Preferred Pickup Locations</Text>
      <Text style={styles.itemSubtitle}>Manage saved pickup points</Text>
    </View>
  </TouchableOpacity>
</View>


            {/* Other */}
            <Text style={styles.sectionTitle}>Other</Text>

            <TouchableOpacity style={styles.item} onPress={handleAbout}>
            <View style={styles.iconContainer}>
                <Info size={24} color="black" />
            </View>
            <View>
                <Text style={styles.itemTitle}>About</Text>
                <Text style={styles.itemSubtitle}>Learn more about the app</Text>
            </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={handleHelp}>
            <View style={styles.iconContainer}>
                <HelpCircle size={24} color="black" />
            </View>
            <View>
                <Text style={styles.itemTitle}>Help</Text>
                <Text style={styles.itemSubtitle}>Learn more about the app</Text>
            </View>
            </TouchableOpacity>
        </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2d3748',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  navLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#78858F',
  },
});

