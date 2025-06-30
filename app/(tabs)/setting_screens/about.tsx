import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, Info, Users, FileText, ShieldCheck, Mail } from 'lucide-react-native';
import { router } from 'expo-router';


export default function AboutScreen() {
  
    const handleSettings = () => {
    router.push('/(tabs)/setting');
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSettings}>
          <ArrowLeft size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>About</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* App Info */}
        <Text style={styles.sectionTitle}>App Information</Text>

        <View style={styles.item}>
          <View style={styles.iconContainer}>
            <Info size={24} color="black" />
          </View>
          <View>
            <Text style={styles.itemTitle}>App Version</Text>
            <Text style={styles.itemSubtitle}>Version 1.2.3</Text>
          </View>
        </View>

        <View style={styles.item}>
          <View style={styles.iconContainer}>
            <Users size={24} color="black" />
          </View>
          <View>
            <Text style={styles.itemTitle}>About Us</Text>
            <Text style={styles.itemSubtitle}>Learn about our mission</Text>
          </View>
        </View>

        {/* Legal */}
        <Text style={styles.sectionTitle}>Legal</Text>

        <View style={styles.item}>
          <View style={styles.iconContainer}>
            <FileText size={24} color="black" />
          </View>
          <View>
            <Text style={styles.itemTitle}>Terms of Service</Text>
            <Text style={styles.itemSubtitle}>Read our terms of service</Text>
          </View>
        </View>

        <View style={styles.item}>
          <View style={styles.iconContainer}>
            <ShieldCheck size={24} color="black" />
          </View>
          <View>
            <Text style={styles.itemTitle}>Privacy Policy</Text>
            <Text style={styles.itemSubtitle}>View our privacy policy</Text>
          </View>
        </View>

        {/* Contact */}
        <Text style={styles.sectionTitle}>Contact</Text>

        <View style={styles.item}>
          <View style={styles.iconContainer}>
            <Mail size={24} color="black" />
          </View>
          <View>
            <Text style={styles.itemTitle}>Contact Us</Text>
            <Text style={styles.itemSubtitle}>Get in touch with us</Text>
          </View>
        </View>

        <Text style={styles.footer}>© 2024 RideShare Inc. All rights reserved.</Text>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemSubtitle: {
    fontSize: 14,
    color: 'gray',
  },
  footer: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
    verticalAlign: 'bottom',
    justifyContent: 'flex-end',
    marginTop: 140,
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
