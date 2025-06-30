import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { ArrowLeft, Bell, MessageCircle, Sun } from 'lucide-react-native';
import { router } from 'expo-router';

export default function DisplaySettingsScreen() {
  const [rideNotif, setRideNotif] = useState(false);
  const [msgNotif, setMsgNotif] = useState(false);

  const handleSettings = () => {
    router.push('/(tabs)/setting');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSettings}>
          <ArrowLeft size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Notifcations</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.item}>
        <View style={styles.iconContainer}>
          <Bell size={24} color="black" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>Ride Requests</Text>
          <Text style={styles.itemSubtitle}>Manage push notifications for ride requests</Text>
        </View>
        <Switch value={rideNotif} onValueChange={setRideNotif} />
      </View>

      <View style={styles.item}>
        <View style={styles.iconContainer}>
          <MessageCircle size={24} color="black" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.itemTitle}>Messages</Text>
          <Text style={styles.itemSubtitle}>Manage push notifications for messages</Text>
        </View>
        <Switch value={msgNotif} onValueChange={setMsgNotif} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerText: { fontSize: 20, fontWeight: 'bold' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#F1F4F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 10,
  },
  textContainer: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: '500' },
  itemSubtitle: { fontSize: 14, color: 'gray' },
});
