import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { usersAPI } from '../../services/api';

// Days of the week
const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday',
  'Thursday', 'Friday', 'Saturday', 'Sunday'
];

// Format time to AM/PM
const formatTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Declare proper Schedule type
type Schedule = {
  [key: string]: {
    startTime: string;
    endTime: string;
  };
};

const DailySchedule = () => {
  const navigation = useNavigation();

  // Typed schedule state
  const [schedule, setSchedule] = useState<Schedule>(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = { startTime: '', endTime: '' };
      return acc;
    }, {} as Schedule)
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [picker, setPicker] = useState<{
    day: string;
    field: 'startTime' | 'endTime';
    show: boolean;
  } | null>(null);

  useEffect(() => {
    setLoading(true);
    usersAPI.getSchedule()
      .then((data) => {
        if (Array.isArray(data)) {
          setSchedule((prev) => {
            const updated = { ...prev };
            data.forEach((item) => {
              const day = daysOfWeek[item.day_of_week];
              if (day) {
                updated[day] = {
                  startTime: item.start_time ? item.start_time : '',
                  endTime: item.end_time ? item.end_time : '',
                };
              }
            });
            return updated;
          });
        }
      })
      .catch(() => setError('Failed to load schedule.'))
      .finally(() => setLoading(false));
  }, []);

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (picker && selectedDate) {
      setSchedule((prev) => ({
        ...prev,
        [picker.day]: {
          ...prev[picker.day],
          [picker.field]: formatTime(selectedDate),
        },
      }));
    }
    setPicker(null);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      // Save each day's schedule
      for (let i = 0; i < daysOfWeek.length; i++) {
        const day = daysOfWeek[i];
        const { startTime, endTime } = schedule[day];
        if (startTime && endTime) {
          await usersAPI.createSchedule({
            day_of_week: i,
            start_time: startTime,
            end_time: endTime,
          });
        }
      }
      router.back();
    } catch (err) {
      setError('Failed to save schedule. Please try again.');
    } finally {
      setLoading(false);
    }
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

      {/* Form */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {daysOfWeek.map((day) => (
          <View key={day} style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 6 }}>{day}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {/* Start Time */}
              <TouchableOpacity
                style={[styles.input, { flex: 1, marginRight: 8 }]}
                onPress={() => setPicker({ day, field: 'startTime', show: true })}
              >
                <Text style={{ color: schedule[day].startTime ? '#000' : '#999' }}>
                  {schedule[day].startTime || 'Select Start Time'}
                </Text>
              </TouchableOpacity>

              {/* End Time */}
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

        {error && <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save Schedule'}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Time Picker */}
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
