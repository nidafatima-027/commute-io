import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch, KeyboardTypeOptions } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Upload, ChevronRight } from 'lucide-react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export default function ProfileSetupScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    phoneNumber: '',
    selectedMode: 'Rider',
    vehicleMake: '',
    vehicleModel: '',
    numberPlate: '',
    numberOfSeats: '',
    acAvailable: false,
    preferences: '',
    
    
    
  });
const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({});

  type FormField = keyof typeof formData;

  const [openGender, setOpenGender] = useState(false);
  const [genderItems, setGenderItems] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ]);
const validateForm = (): boolean => {
  const newErrors: Partial<Record<FormField, string>> = {};

  // Name validation
  if (!formData.name.trim()) {
    newErrors.name = 'Name is required.';
  } else if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
    newErrors.name = 'Name must contain only letters.';
  } else if (formData.name.trim().length > 50) {
    newErrors.name = 'Name must be 50 characters or fewer.';
  }

  // Email validation
  if (!formData.email.trim()) {
    newErrors.email = 'Email is required.';
  } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    newErrors.email = 'Invalid email format.';
  }

  // Gender validation
  if (!formData.gender) {
    newErrors.gender = 'Gender is required.';
  }

  // Phone Number validation
  if (!formData.phoneNumber.trim()) {
    newErrors.phoneNumber = 'Phone number is required.';
  } else if (!/^\d{10,15}$/.test(formData.phoneNumber)) {
    newErrors.phoneNumber = 'Invalid phone number.';
  }

  // Vehicle details validation
  if (formData.selectedMode === 'Driver' || formData.selectedMode === 'Both') {
    if (!formData.vehicleMake.trim()) {
      newErrors.vehicleMake = 'Vehicle make is required.';
    } else if (formData.vehicleMake.trim().length > 30) {
      newErrors.vehicleMake = 'Vehicle make must be 30 characters or fewer.';
    }

    if (!formData.vehicleModel.trim()) {
      newErrors.vehicleModel = 'Vehicle model is required.';
    } else if (formData.vehicleModel.trim().length > 30) {
      newErrors.vehicleModel = 'Vehicle model must be 30 characters or fewer.';
    }

    if (!formData.numberPlate.trim()) {
      newErrors.numberPlate = 'Number plate is required.';
    } else if (formData.numberPlate.trim().length > 15) {
      newErrors.numberPlate = 'Number plate must be 15 characters or fewer.';
    }

    if (!formData.numberOfSeats.trim()) {
      newErrors.numberOfSeats = 'Number of seats is required.';
    } else if (!/^\d+$/.test(formData.numberOfSeats)) {
      newErrors.numberOfSeats = 'Number of seats must be a number.';
    } else if (parseInt(formData.numberOfSeats) <= 0 || parseInt(formData.numberOfSeats) > 20) {
      newErrors.numberOfSeats = 'Number of seats must be between 1 and 20.';
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleInputChange = (field: FormField, value: string | boolean) => {
  setFormData(prev => ({ ...prev, [field]: value }));
  setErrors(prev => ({ ...prev, [field]: undefined }));
};


  const handleModeSelect = (mode: string) => {
    setFormData(prev => ({ ...prev, selectedMode: mode }));
  };

const handleSave = () => {
  if (validateForm()) {
    router.replace('/(tabs)');
  }
};


  const handleBack = () => {
    router.back();
  };

  const showVehicleDetails = formData.selectedMode === 'Driver' || formData.selectedMode === 'Both';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#2d3748" />
          </TouchableOpacity>
          <Text style={styles.title}>Profile Setup</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* Basic Information */}
          <View style={styles.section}>
          <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Enter your name"
                placeholderTextColor="#9CA3AF"
              />
              {errors.name && (
    <Text style={styles.errorText}>{errors.name}</Text>
  )}
              
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && (
  <Text style={styles.errorText}>{errors.email}</Text>
)}

            </View>

            <View style={[styles.inputGroup, { zIndex: 1000 }]}>
              <Text style={styles.label}>Gender</Text>
              <DropDownPicker
  open={openGender}
  value={formData.gender}
  items={genderItems}
  setOpen={setOpenGender}
  setValue={(callback) => {
    const newValue = callback(formData.gender);
    handleInputChange('gender', newValue ?? '');
  }}
  setItems={setGenderItems}
  placeholder="Select gender"
  style={styles.dropdown}
  dropDownContainerStyle={styles.dropdownContainer}
  placeholderStyle={styles.placeholderText}
  textStyle={styles.dropdownText}
  listMode="SCROLLVIEW"
/>




            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Preferences</Text>
              <TextInput
                style={styles.input}
                value={formData.preferences}
                onChangeText={(value) => handleInputChange('preferences', value)}
                placeholder="Preferences for Upcoming Rides"
                placeholderTextColor="#9CA3AF"
              />
              {errors.preferences && (
  <Text style={styles.errorText}>{errors.preferences}</Text>
)}

            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={formData.phoneNumber}
                onChangeText={(value) => handleInputChange('phoneNumber', value)}
                placeholder="Enter phone number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
              {errors.phoneNumber && (
  <Text style={styles.errorText}>{errors.phoneNumber}</Text>
)}

            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Profile Picture</Text>
              <TouchableOpacity style={styles.uploadButton}>
                <Upload size={20} color="#4ECDC4" />
                <Text style={styles.uploadText}>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Select Mode */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Mode</Text>
            <View style={styles.modeContainer}>
              {['Rider', 'Driver', 'Both'].map((mode) => (
                <TouchableOpacity
                  key={mode}
                  style={[
                    styles.modeButton,
                    formData.selectedMode === mode && styles.modeButtonActive
                  ]}
                  onPress={() => handleModeSelect(mode)}
                >
                  <Text style={[
                    styles.modeButtonText,
                    formData.selectedMode === mode && styles.modeButtonTextActive
                  ]}>
                    {mode}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Vehicle Details */}
          {showVehicleDetails && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vehicle Details</Text>

              {[
                { label: 'Make', field: 'vehicleMake', placeholder: 'Make' },
                { label: 'Model', field: 'vehicleModel', placeholder: 'Model' },
                { label: 'Number Plate', field: 'numberPlate', placeholder: 'Number Plate' },
                { label: 'Number of Seats', field: 'numberOfSeats', placeholder: 'Number of Seats', keyboardType: 'numeric' as KeyboardTypeOptions },
              ].map(({ label, field, placeholder, keyboardType }) => (
                <View style={styles.inputGroup} key={field}>
                  <Text style={styles.label}>{label}</Text>
                  <TextInput
                    style={styles.input}
                    value={formData[field as FormField] as string}
                    onChangeText={(value) => handleInputChange(field as FormField, value)}
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    keyboardType={keyboardType}
                    autoCapitalize={field === 'numberPlate' ? 'characters' : 'none'}
                  />
                   {errors[field as FormField] && (
          <Text style={styles.errorText}>{errors[field as FormField]}</Text>
        )}
                </View>
              ))}

              <View style={styles.switchGroup}>
                <Text style={styles.label}>AC Available</Text>
                <Switch
                  value={formData.acAvailable}
                  onValueChange={(value) => handleInputChange('acAvailable', value)}
                  trackColor={{ false: '#E5E7EB', true: '#4ECDC4' }}
                  thumbColor="#ffffff"
                />
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Optional</Text>
            <View style={styles.section}>
  <TouchableOpacity
    style={styles.optionItem}
    onPress={() => router.push('/auth/DailySchedule')}>
    <Text style={styles.optionText}>Set Daily Schedule</Text>
    <ChevronRight size={20} color="#9CA3AF" />
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.optionItem}
    onPress={() => router.push('/auth/PreferredpickupLocation')}>
    <Text style={styles.optionText}>Preferred Pickup Locations</Text>
    <ChevronRight size={20} color="#9CA3AF" />
  </TouchableOpacity>
</View>

          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.linkText}>Terms of Service</Text> and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}




// Styles remain unchanged (same as in your provided code)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fffe',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
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
  errorText: {
  color: '#E53E3E',
  fontSize: 12,
  marginTop: 4,
  fontFamily: 'Inter-Regular',
},

  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
  },
  placeholder: {
    width: 40,
  },
   placeholderText: {
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 16,
  },
dropdown: {
  backgroundColor: '#ffffff',
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#E5E7EB',
  paddingHorizontal: 12,
  height: 48,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 1,
},
dropdownContainer: {
  backgroundColor: '#ffffff',
  borderWidth: 1,
  borderColor: '#E5E7EB',
  borderRadius: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 2,
  zIndex: 1000,
},

dropdownText: {
  color: '#2d3748',
  fontFamily: 'Inter-Regular',
  fontSize: 16,
},

  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2d3748',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  pickerStyledWrapper: {
  backgroundColor: '#ffffff',
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#E5E7EB',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 1,
  overflow: 'hidden',
},
pickerStyled: {
  height: 48,
  color: '#2d3748',
  paddingHorizontal: 12,
  fontSize: 16,
  fontFamily: 'Inter-Regular',
},

  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  uploadText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#4ECDC4',
  },
  modeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  modeButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  modeButtonActive: {
    backgroundColor: '#4ECDC4',
    borderColor: '#4ECDC4',
  },
  modeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#718096',
  },
  modeButtonTextActive: {
    color: '#ffffff',
  },
  switchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#2d3748',
  },
  saveButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#4ECDC4',
    fontFamily: 'Inter-Medium',
  },
});