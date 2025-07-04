import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native'; 
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const formatTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const adjustedHours = hours % 12 || 12;
  const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${adjustedHours}:${paddedMinutes} ${suffix}`;
};

const DailySchedule = () => {
  const navigation = useNavigation();

  const [schedule, setSchedule] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = { startTime: '', endTime: '' };
      return acc;
    }, {})
  );

  const [picker, setPicker] = useState<{
    day: string;
    field: 'startTime' | 'endTime';
    show: boolean;
  } | null>(null);

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (picker && selectedDate) {
      setSchedule((prev) => ({
        ...prev,
        [picker.day]: {
          ...prev[picker.day],
          [picker.field]: formatTime(selectedDate)
        }
      }));
    }
    setPicker(null);
  };

  const handleSave = () => {
    console.log('Saved schedule:', schedule);
    // Add backend save logic here
    router.push('/auth/profile-setup');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ padding: 10 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Set Daily Schedule</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {daysOfWeek.map((day) => (
          <View key={day} style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 6 }}>{day}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                onPress={() => setPicker({ day, field: 'startTime', show: true })}
              >
                <Text style={{ color: schedule[day].startTime ? '#000' : '#999' }}>
                  {schedule[day].startTime || 'Select Start Time'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.input, { flex: 1, marginLeft: 8 }]}
                onPress={() => setPicker({ day, field: 'endTime', show: true })}
              >
                <Text style={{ color: schedule[day].endTime ? '#000' : '#999' }}>
                  {schedule[day].endTime || 'Select End Time'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Schedule</Text>
        </TouchableOpacity>
      </ScrollView>

      {picker?.show && (
        <DateTimePicker
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          value={new Date()}
          onChange={handleTimeChange}
        />
      )}
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
    padding: 12,
    justifyContent: 'center',
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
