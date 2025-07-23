import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Checkbox from 'expo-checkbox';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import { usersAPI, carsAPI } from '../../../services/api';


type FormField = 
  | 'name'
  | 'email'
  | 'bio'
  | 'phone'
  | 'gender'
  | 'isRider'
  | 'isDriver'
  | 'vehicleMake'
  | 'vehicleModel'
  | 'numberPlate'
  | 'numberOfSeats'
  | 'vehicleYear'
  | 'vehicleColor'
  | 'acAvailable';

export default function EditProfileScreen() {
  const params = useLocalSearchParams();
  const [formData, setFormData] = React.useState({
    name: Array.isArray(params.name) ? params.name[0] : params.name || '',
    email: Array.isArray(params.email) ? params.email[0] : params.email || '',
    bio: Array.isArray(params.bio) ? params.bio[0] : params.bio || '',
    phone: Array.isArray(params.phone) ? params.phone[0] : params.phone || '',
    gender: Array.isArray(params.gender) ? params.gender[0] : params.gender || '',
    isRider: params.is_rider === 'true',
    isDriver: params.is_driver === 'true',
    vehicleMake: Array.isArray(params.vehicleMake) ? params.vehicleMake[0] : params.vehicleMake || '',
    vehicleModel: Array.isArray(params.vehicleModel) ? params.vehicleModel[0] : params.vehicleModel || '',
    numberPlate: Array.isArray(params.numberPlate) ? params.numberPlate[0] : params.numberPlate || '',
    numberOfSeats: Array.isArray(params.numberOfSeats) ? params.numberOfSeats[0] : params.numberOfSeats || '',
    vehicleYear: Array.isArray(params.vehicleYear) ? params.vehicleYear[0] : params.vehicleYear || '',
    vehicleColor: Array.isArray(params.vehicleColor) ? params.vehicleColor[0] : params.vehicleColor || '',
    acAvailable: params.acAvailable === 'true',
    preferences: params.preferences
      ? JSON.parse(Array.isArray(params.preferences) ? params.preferences[0] : params.preferences)
      : {
          gender_preference: "No preference",
          music_preference: "User can choose",
          conversation_preference: "No preference",
          smoking_preference: "Not required"
        },
  });
  // const [name, setName] = React.useState(
  //   Array.isArray(params.name) ? params.name[0] : params.name || ''
  // );
  // const [email, setEmail] = React.useState(
  //   Array.isArray(params.email) ? params.email[0] : params.email || ''
  // );
  // const [bio, setBio] = React.useState(
  //   Array.isArray(params.bio) ? params.bio[0] : params.bio || ''
  // );
  // const [phone, setPhone] = React.useState('(+92)3082611469');
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});
  const [loading, setLoading] = React.useState(false);
  const [photoUrl, setPhotoUrl] = React.useState(
    Array.isArray(params.photo_url) ? params.photo_url[0] : params.photo_url || ''
  );
  const [openGenderPref, setOpenGenderPref] = React.useState(false);
  const [openMusicPref, setOpenMusicPref] = React.useState(false);
  const [openConversationPref, setOpenConversationPref] = React.useState(false);
  const [openSmokingPref, setOpenSmokingPref] = React.useState(false);
  const [openGender, setOpenGender] = React.useState(false);
  const [genderItems, setGenderItems] = React.useState([
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ]);

  const handleBack = () => {
    router.push('/(tabs)/profile');
  };

const handleInputChange = (field: FormField, value: string | boolean) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Clear error when user starts typing
    if (typeof value === 'string' && errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };

  const handlePreferenceChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        [field]: value
      }
    });
  };

  const handleUploadPhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'We need access to your photos to upload a profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setPhotoUrl(base64Image);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Enter a valid email.';
    }

    const phoneRegex = /^[\+92\d{10}]+$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Enter a valid phone number.';
    }

    if (formData.isDriver) {
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

      if (!formData.vehicleYear.trim()) {
        newErrors.vehicleYear = 'Vehicle year is required.';
      } else if (!/^\d{4}$/.test(formData.vehicleYear)) {
        newErrors.vehicleYear = 'Vehicle year must be a 4-digit number.';
      } else {
        const year = parseInt(formData.vehicleYear);
        const currentYear = new Date().getFullYear();
        if (year < 1980 || year > currentYear + 1) {
          newErrors.vehicleYear = `Year must be between 1980 and ${currentYear + 1}.`;
        }
      }

      if (formData.vehicleColor.trim() && formData.vehicleColor.length > 20) {
        newErrors.vehicleColor = 'Color must be 20 characters or fewer.';
      }
    }

    return newErrors;
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
          
          const userData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            bio: formData.bio,
            gender: formData.gender,
            is_driver: formData.isDriver,
            is_rider: formData.isRider,
            preferences: formData.preferences,
            photo_url: photoUrl || 'data:image/png;base64,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', // Handle photo upload separately if needed
          };
          //console.log(userData);
          await usersAPI.updateProfile(userData);
          if (formData.isDriver) {
            const carData = {
              make: formData.vehicleMake,
              model: formData.vehicleModel,
              license_plate: formData.numberPlate,
              seats: parseInt(formData.numberOfSeats),
              ac_available: formData.acAvailable,
              color: formData.vehicleColor, // Add if you have this field
              year: parseInt(formData.vehicleYear), // Convert to number
            };
            const car = await carsAPI.getCars();
            if(car.length > 0) {
            await carsAPI.updateCar(car[0].id, carData);
            }
            else{
              await carsAPI.createCar(carData);
            }
          }
          router.push('/(tabs)/profile');
        } catch (error) {
          Alert.alert("Error", error instanceof Error ? error.message : "Failed to update profile");
        } finally {
          setLoading(false);
        }
    // Here, you would usually save to server or state
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#2d3748" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
           <TouchableOpacity style={styles.avatarContainer} onPress={handleUploadPhoto}>
            <Image
              source={{ uri: photoUrl }}
              style={styles.avatar}
            />
            <View style={styles.uploadOverlay}>
              <Text style={styles.uploadText}>Change Photo</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{formData.name}</Text>
          <Text style={styles.memberSince}>Member since 2021</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Full Name"
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
              placeholder="Email Address"
              keyboardType="email-address"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              placeholderTextColor="#9CA3AF"
            />
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={styles.input}
              value={formData.bio}
              onChangeText={(value) => handleInputChange('bio', value)}
              placeholder="Your Bio"
              placeholderTextColor="#9CA3AF"
            />
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

          {/* Role Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>I am a:</Text>
            <View style={styles.checkboxContainer}>
              <View style={styles.checkboxRow}>
                <Checkbox
                  value={formData.isRider}
                  onValueChange={(value) => handleInputChange('isRider', value)}
                  color={formData.isRider ? '#4ECDC4' : undefined}
                />
                <Text style={styles.checkboxLabel}>Rider</Text>
              </View>
              <View style={styles.checkboxRow}>
                <Checkbox
                  value={formData.isDriver}
                  onValueChange={(value) => {
                    handleInputChange('isDriver', value);
                    // If unchecking driver, clear vehicle errors
                    if (!value) {
                      setErrors({
                        ...errors,
                        vehicleMake: '',
                        vehicleModel: '',
                        numberPlate: '',
                        numberOfSeats: '',
                        vehicleYear: '',
                        vehicleColor: '',
                      });
                    }
                  }}
                  color={formData.isDriver ? '#4ECDC4' : undefined}
                />
                <Text style={styles.checkboxLabel}>Driver</Text>
              </View>
            </View>
          </View>

{/* Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ride Preferences</Text>

            {/* Gender Preference */}
            <View style={[styles.inputGroup, { zIndex: 1000 }]}>
              <Text style={styles.label}>Gender Preference</Text>
              <DropDownPicker
                open={openGenderPref}
                value={formData.preferences.gender_preference}
                items={[
                  { label: 'No preference', value: 'No preference' },
                  { label: 'Male only', value: 'Male only' },
                  { label: 'Female only', value: 'Female only' },
                ]}
                setOpen={setOpenGenderPref}
                setValue={(callback) => {
                  const newValue = callback(formData.preferences.gender_preference);
                  handlePreferenceChange('gender_preference', newValue ?? 'No preference');
                }}
                setItems={() => {}}
                placeholder="Select gender preference"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                placeholderStyle={styles.placeholderText}
                textStyle={styles.dropdownText}
                listMode="SCROLLVIEW"
              />
            </View>

            {/* Music Preference */}
            <View style={[styles.inputGroup, { zIndex: 900 }]}>
              <Text style={styles.label}>Music Preference</Text>
              <DropDownPicker
                open={openMusicPref}
                value={formData.preferences.music_preference}
                items={[
                  { label: 'No music', value: 'No music' },
                  { label: 'Light music', value: 'Light music' },
                  { label: 'Loud music', value: 'Loud music' },
                  { label: 'User can choose', value: 'User can choose' },
                ]}
                setOpen={setOpenMusicPref}
                setValue={(callback) => {
                  const newValue = callback(formData.preferences.music_preference);
                  handlePreferenceChange('music_preference', newValue ?? 'User can choose');
                }}
                setItems={() => {}}
                placeholder="Select music preference"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                placeholderStyle={styles.placeholderText}
                textStyle={styles.dropdownText}
                listMode="SCROLLVIEW"
              />
            </View>

            {/* Conversation Preference */}
            <View style={[styles.inputGroup, { zIndex: 800 }]}>
              <Text style={styles.label}>Conversation Preference</Text>
              <DropDownPicker
                open={openConversationPref}
                value={formData.preferences.conversation_preference}
                items={[
                  { label: 'Silent ride', value: 'Silent ride' },
                  { label: 'Talkative ride', value: 'Talkative ride' },
                  { label: 'No preference', value: 'No preference' },
                ]}
                setOpen={setOpenConversationPref}
                setValue={(callback) => {
                  const newValue = callback(formData.preferences.conversation_preference);
                  handlePreferenceChange('conversation_preference', newValue ?? 'No preference');
                }}
                setItems={() => {}}
                placeholder="Select conversation preference"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                placeholderStyle={styles.placeholderText}
                textStyle={styles.dropdownText}
                listMode="SCROLLVIEW"
              />
            </View>

            {/* Smoking Preference */}
            <View style={[styles.inputGroup, { zIndex: 700 }]}>
              <Text style={styles.label}>Smoking Preference</Text>
              <DropDownPicker
                open={openSmokingPref}
                value={formData.preferences.smoking_preference}
                items={[
                  { label: 'Required', value: 'Required' },
                  { label: 'Preferred', value: 'Preferred' },
                  { label: 'Not required', value: 'Not required' },
                ]}
                setOpen={setOpenSmokingPref}
                setValue={(callback) => {
                  const newValue = callback(formData.preferences.smoking_preference);
                  handlePreferenceChange('smoking_preference', newValue ?? 'Not required');
                }}
                setItems={() => {}}
                placeholder="Select smoking preference"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownContainer}
                placeholderStyle={styles.placeholderText}
                textStyle={styles.dropdownText}
                listMode="SCROLLVIEW"
              />
            </View>
          </View>

          {/* Vehicle Details (shown only if driver is selected) */}
          {formData.isDriver && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vehicle Details</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Make</Text>
                <TextInput
                  style={styles.input}
                  value={formData.vehicleMake}
                  onChangeText={(value) => handleInputChange('vehicleMake', value)}
                  placeholder="Make"
                  placeholderTextColor="#9CA3AF"
                />
                {errors.vehicleMake && (
                  <Text style={styles.errorText}>{errors.vehicleMake}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Model</Text>
                <TextInput
                  style={styles.input}
                  value={formData.vehicleModel}
                  onChangeText={(value) => handleInputChange('vehicleModel', value)}
                  placeholder="Model"
                  placeholderTextColor="#9CA3AF"
                />
                {errors.vehicleModel && (
                  <Text style={styles.errorText}>{errors.vehicleModel}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Number Plate</Text>
                <TextInput
                  style={styles.input}
                  value={formData.numberPlate}
                  onChangeText={(value) => handleInputChange('numberPlate', value)}
                  placeholder="Number Plate"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="characters"
                />
                {errors.numberPlate && (
                  <Text style={styles.errorText}>{errors.numberPlate}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Number of Seats</Text>
                <TextInput
                  style={styles.input}
                  value={formData.numberOfSeats}
                  onChangeText={(value) => handleInputChange('numberOfSeats', value)}
                  placeholder="Number of Seats"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
                {errors.numberOfSeats && (
                  <Text style={styles.errorText}>{errors.numberOfSeats}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Year</Text>
                <TextInput
                  style={styles.input}
                  value={formData.vehicleYear}
                  onChangeText={(value) => handleInputChange('vehicleYear', value)}
                  placeholder="Year"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
                {errors.vehicleYear && (
                  <Text style={styles.errorText}>{errors.vehicleYear}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Color</Text>
                <TextInput
                  style={styles.input}
                  value={formData.vehicleColor}
                  onChangeText={(value) => handleInputChange('vehicleColor', value)}
                  placeholder="Color"
                  placeholderTextColor="#9CA3AF"
                />
                {errors.vehicleColor && (
                  <Text style={styles.errorText}>{errors.vehicleColor}</Text>
                )}
              </View>

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

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
  },
  placeholder: {
    width: 40,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3C4A6',
  },
  uploadOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: 'center',
  },
  uploadText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2d3748',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  errorText: {
    marginTop: 4,
    color: '#EF4444',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  saveButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
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
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2d3748',
  },
  section: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
    marginBottom: 16,
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dropdown: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    height: 48,
  },
  dropdownContainer: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
  },
  dropdownText: {
    color: '#2d3748',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  placeholderText: {
    color: '#9CA3AF',
    fontFamily: 'Inter-Regular',
  },
});
