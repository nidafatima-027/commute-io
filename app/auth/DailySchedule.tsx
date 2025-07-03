import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native'; 
import { router } from 'expo-router';

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const DailySchedule = () => {
  const navigation = useNavigation();

  const [schedule, setSchedule] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = { startTime: '', endTime: '' };
      return acc;
    }, {})
  );

  const handleTimeChange = (day, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const handleSave = () => {
    console.log('Saved schedule:', schedule);
    // Add backend save logic here
    router.push('/auth/profile-setup');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      {/* Header with back arrow and title */}
      <View style={styles.header}>
        <TouchableOpacity
        onPress={() => router.push('/auth/profile-setup')}
        style={{padding:10}}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
          <ArrowLeft size={24} color="black" />
      </TouchableOpacity>
        <Text style={styles.headerTitle}>Set Daily Schedule</Text>
        <View style={{ width: 24 }} /> {/* Spacer to center title */}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {daysOfWeek.map((day) => (
          <View key={day} style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 6 }}>{day}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={{ fontSize: 12, marginBottom: 4 }}>Start Time</Text>
                <TextInput
                  style={styles.input}
                  value={schedule[day].startTime}
                  placeholder="e.g. 8:00 AM"
                  onChangeText={(text) => handleTimeChange(day, 'startTime', text)}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={{ fontSize: 12, marginBottom: 4 }}>End Time</Text>
                <TextInput
                  style={styles.input}
                  value={schedule[day].endTime}
                  placeholder="e.g. 9:00 AM"
                  onChangeText={(text) => handleTimeChange(day, 'endTime', text)}
                />
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Schedule</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderColor: '#eee',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#3cc4b2',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DailySchedule;
