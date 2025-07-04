import React, { useState } from 'react';
import { View, Text, TextInput, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const AddLocationScreen = () => {
  const [label, setLabel] = useState('');
  const [address, setAddress] = useState('');
  const [search, setSearch] = useState('');

  const handleBack = () => {
    router.back();
  };
    const handleSave = () => {
    router.push('/auth/PreferredpickupLocation');
  };
  return (
     <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#2d3748" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Add New Location</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Search Field */}
          <TextInput
            style={styles.input}
            placeholder="Search for a location"
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />

          {/* Map Preview */}
          <Image
            source={require('@/assets/images/map-preview.png')}
            style={styles.mapImage}
            resizeMode="cover"
          />

          {/* Label Input */}
          <TextInput
            style={styles.input}
            placeholder="e.g. Home, Office, Gym"
            placeholderTextColor="#9CA3AF"
            value={label}
            onChangeText={setLabel}
          />

          {/* Address Input */}
          <TextInput
            style={styles.input}
            placeholder="123 Main St, Anytown"
            placeholderTextColor="#9CA3AF"
            value={address}
            onChangeText={setAddress}
          />

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Location</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By saving, you agree to provide accurate location details for better ride matching.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>

  );
};

export default AddLocationScreen;

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
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2d3748',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  mapImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 10,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 21,
  },
});