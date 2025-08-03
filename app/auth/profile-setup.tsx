import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Switch, KeyboardTypeOptions, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Upload, ChevronRight } from 'lucide-react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import { usersAPI } from '../../services/api';
import { getAuthMethod} from '../../services/auth';

export default function ProfileSetupScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    bio: '',
    phoneNumber: '',
    selectedMode: 'Rider',
    vehicleMake: '',
    vehicleModel: '',
    numberPlate: '',
    numberOfSeats: '',
    acAvailable: false,
    preferences: {
      gender_preference: "No preference",
      music_preference: "User can choose",
      conversation_preference: "No preference",
      smoking_preference: "Not required"
    },
    vehicleYear: '',
    vehicleColor: '',
    photo_url: '',
    carPhoto_url: '',
  });
  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({});
  const [loading, setLoading] = useState(false);

  type FormField = keyof typeof formData;
  const [authMethod, setAuthMethod] = useState<'email' | 'phone' | null>(null);

  const [openGender, setOpenGender] = useState(false);
  const [genderItems, setGenderItems] = useState([
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ]);

  const [openGenderPref, setOpenGenderPref] = useState(false);
  const [openMusicPref, setOpenMusicPref] = useState(false);
  const [openConversationPref, setOpenConversationPref] = useState(false);
  const [openSmokingPref, setOpenSmokingPref] = useState(false);

  useEffect(() => {
    const loadAuthMethod = async () => {
      const method = await getAuthMethod();
      if (method) {
        setAuthMethod(method as 'email' | 'phone');
      }
    };
    loadAuthMethod();
  }, []);
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

    // Bio validation
    if (formData.bio.length > 200) {
      newErrors.bio = 'Bio must be 200 characters or fewer.';
    }

    // Phone Number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required.';
    } else if (!/^\+92\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid Pakistani phone number. Format: +92XXXXXXXXXX';
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

      if (!formData.vehicleYear?.trim()) {
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

      // ✅ Vehicle Color Validation (optional, but if filled validate length)
      if (formData.vehicleColor?.trim()) {
        if (formData.vehicleColor.length > 20) {
          newErrors.vehicleColor = 'Color must be 20 characters or fewer.';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUploadCarPhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'We need access to your photos to upload a car picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        handleInputChange('carPhoto_url', base64Image);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload car image. Please try again.');
    }
  };

  const handleInputChange = (field: FormField, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handlePreferenceChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  const handleModeSelect = (mode: string) => {
    setFormData(prev => ({ ...prev, selectedMode: mode }));
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
        handleInputChange('photo_url', base64Image);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phoneNumber,
        bio: formData.bio,
        gender: formData.gender,
        is_driver: formData.selectedMode === 'Driver' || formData.selectedMode === 'Both',
        is_rider: formData.selectedMode === 'Rider' || formData.selectedMode === 'Both',
        preferences: formData.preferences,
        photo_url: formData.photo_url || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAP1BMVEX///+ZmZmVlZX8/PySkpL4+Pijo6Pp6emJiYmgoKDy8vLv7++cnJy0tLTj4+PCwsLd3d3U1NTKysqtra27u7tpcLS/AAAHuElEQVR4nO1dDY+sKgxVQFwVv9D//1ufOLN3dh0/OFBw9oWTTeYmN1EPLaWUtmRZQkJCQkJCQkJCQkJCQkJCQkLCx4MXdVOWXdcNC5afsmzqgt/9VTh4Uw6jnttJqpwxsYAxpuTUznocurq4+/ts8Bj2Zhj7Viq2Msh/wvBiedX249Dc/Kk24KWep4qJDYsNpYXQNOvys1Wu0a3Mt+LYgTKMctnqj5UPH9oqv+TxorMQWjRuMOLh/LOEVGhpS+S3zlW6MGzu/v4fqHsmvscbhWB9fff3P2GGtO6F+Kc7LnTEXPPsE4TD6/FBxQdC6E+QTj1K4SySn3TkeDcd3rXXhtgOjLXdrZpWO5qwfYjqLl0zg9hNhFRyI5xpyG4yBLqi5ZKvq84tVAqy2fKbThubyKIJJb1YnmyqMramDe5L5DUiTxy9bLWCcWEs5sThOhiRJ3Q076boA02XF1hfxGETgcuDTQTwGFwWd6CPoWlxuBg24W1a7+3uW7PRYdnwbIwkFwM2BqSSrWsluFiq1z8UvDQN4UTDFx8G/Zx8DfstNNZfFItnE4xMMQl0cOXc1evo8nqYJUpGTME2OHxmmI7JfjOyZf/gY/0U1gfRs+WhIzas096+sdYT8AjF8kBGoES2yExtpfI9JE2vACeVySDTppiBFUbI4VA/+CCRJ80h/BpkhRHT6QarnJCVd6SfNg1glQ2X0/AxwoZVxBZt+S5Aydh0qefI/GMzLZks6wAuqrN4HmDjBbUNAMIXq0t1qefIFKxouYxf9uNoZ36K2Z7NF+liw+1HMZcWSmbQAcJWlAZtBGaMrQMC7FiVIBRNAdgeW8EsokGeSrdyAk4Za20Fk/EWsAFkkbTC3jdUStvvpzTgok1Us2YAFn9kO4Vs9dRItOkEjGgOjSCwG2AzDRfI9YdcD2CUmL1hOQHPtP32Q2ETFQlZ0wTT6xYJ+A/IoweETEvhPA/Qth8gwyEyeQWN08ErNTBjVA5pdoeQodCzGlnagpIh0DNk47GQCTZnlof72zPAxzRkII8Qi135e5sFFPVXeY88vMfIeJ8/1WASBnSKj8QDzbrpmwRZYlwY4qsXYOzZOxYwQGdLysxSaycKW8H8Jw3HDsqUYrM9mRnjsh5z+nAp0LwlNlkrdoM/288CFPBhl7JeqPHMCOVHpoGPY61FAwtm0TM/cwYEMv9BW2m2S8qKAKzLDqD1/wHLExVoy/dNxs+cuZz6W3iEPCtahycLIFqyA2T7/2JzbUJNBBDP8fI8D3DLKL3eeiCbpB/PnbzIOOYurnkvR+JZ/kM75qz4HQe4vTPPv04jQ639mcIGPly4c9aPkEd1S7xBzmc3T/UpTXEns0DXb2/mCxVtXTD0SWTENJYb/6MoR3exmEf6+DNeZHImZD++6hjrbuylQzbQZ5AxfHLZzlqPo9Z9K3M/KneTWesY2evHE75kwuViO0B47c6iJWTaQfhwyRxUQ5k/louvIwiRuzhmBsyLDO7OmK9kIp/6odyrMOd1OehJOVoCP3fGxdFUU99dTdSunxxk4+loIlHzh1RkfxUS5t98JOoLsNZrP4O6txNSet3oCbPXizMebdssJFRFblIcNeTdeG6bkcysfHY4c+iQSKBnQMM+1MTk6LA886wY7S2mX6iJ17Y2h02uR0HcvtrTMwhoG54ForLvaFrLRdQvPMstA+fW6T8Hr7FaAZRn4NzuSEMJ70JRK9l4nwPaHDZ5LswrJgs2zPewqbaIolaFfwlScW3T/I8Brw9omSLJ1C3VFRv/A9prH4CqmOoyN5ggUfMqqUEQJYJl/CqnnSCp4SLdhLAk5OKQgySt6dxxZlQ1FDzj5xotKBLOTjM0vVb+Lc4PBilStBY9Oxkw2lLKMxtAkzx3dipMKpgL0dBkNncnWSHEXQiOz6BoEk6zk0wKsjd84zijnioV+NgEeDrL7zh2nyuqyuCD9HlltIyYzdH89M00+Qd+mLFHrWWmqObgVVRWkx8mhlEN1wtHNRSEJSdHC0CA5j3t7osIi4G4KdPa8zcDtIfZnzSKtGfgfgEdhYPxC/tJ6KRVWgZ7E5NmV/Yb5Z4GVMRGs9xx0KjrdA3qnVEjLzrdKweuAjQe4O9k6MuBs+Y94hCHDKuIe7qar343zzIEmbclLUjDlvf63UBkfpuAMM0N3vfoMcgEajvxXlQRRTKhugJtq5FliJf8JkO2jXnH5oAjPBnWBuzZtql5rVQA/HpBuPZGGVpY5Qb1+iV3/n4iZkswxQK3BOMxm7XFaEAZiw2DytdcwKM1OAzUP2sLrEDQmUukKypiNAXV0a7bKIK2azXXOdjV4BAB7NsGImoj3cysnq6piedQpttc0LVyD2UVyAwEc/oPwU1b8DBcorcFf+B/1LA9W1vpk9Jh7oleBKhJhcPk2qzytmsbzPUTNExUfvf1E/x5MQgBPuBiEEOo1sz/yhb2EVe2ZIZO73cDjRD9e0nXXeBZPbtLZ73m6GO4rOCLYUNtwVoEUcVzkAHwsQV7U5urwQI0YyXC89I2Gx4/L237VD7P6/TOK8yYYH/gOr0V/HXR4bbm53HRofwrFx0+sbmCcv37dwVl+ex6fvdHQvi+HHT445eDPvF3vzwhISEhISEhISEhISEhISEhAcZ/Tadim3IoIU4AAAAASUVORK5CYII=', // Handle photo upload separately if needed
      };
      //console.log(userData);
      await usersAPI.updateProfile(userData);
      if (formData.selectedMode === 'Driver' || formData.selectedMode === 'Both') {
        const carData = {
          make: formData.vehicleMake,
          model: formData.vehicleModel,
          license_plate: formData.numberPlate,
          seats: parseInt(formData.numberOfSeats),
          ac_available: formData.acAvailable,
          color: formData.vehicleColor, // Add if you have this field
          year: formData.vehicleYear, // Add if you have this field
          photo_url: formData.carPhoto_url || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAP1BMVEX///+ZmZmVlZX8/PySkpL4+Pijo6Pp6emJiYmgoKDy8vLv7++cnJy0tLTj4+PCwsLd3d3U1NTKysqtra27u7tpcLS/AAAHuElEQVR4nO1dDY+sKgxVQFwVv9D//1ufOLN3dh0/OFBw9oWTTeYmN1EPLaWUtmRZQkJCQkJCQkJCQkJCQkJCQkLCx4MXdVOWXdcNC5afsmzqgt/9VTh4Uw6jnttJqpwxsYAxpuTUznocurq4+/ts8Bj2Zhj7Viq2Msh/wvBiedX249Dc/Kk24KWep4qJDYsNpYXQNOvys1Wu0a3Mt+LYgTKMctnqj5UPH9oqv+TxorMQWjRuMOLh/LOEVGhpS+S3zlW6MGzu/v4fqHsmvscbhWB9fff3P2GGtO6F+Kc7LnTEXPPsE4TD6/FBxQdC6E+QTj1K4SySn3TkeDcd3rXXhtgOjLXdrZpWO5qwfYjqLl0zg9hNhFRyI5xpyG4yBLqi5ZKvq84tVAqy2fKbThubyKIJJb1YnmyqMramDe5L5DUiTxy9bLWCcWEs5sThOhiRJ3Q076boA02XF1hfxGETgcuDTQTwGFwWd6CPoWlxuBg24W1a7+3uW7PRYdnwbIwkFwM2BqSSrWsluFiq1z8UvDQN4UTDFx8G/Zx8DfstNNZfFItnE4xMMQl0cOXc'
        };
      
        await usersAPI.createCar(carData);
      }
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Failed to save profile");
    } finally {
      setLoading(false);
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, { height: 100 }]}
                value={formData.bio}
                onChangeText={(value) => handleInputChange('bio', value)}
                placeholder="Tell us about yourself"
                placeholderTextColor="#9CA3AF"
                multiline
              />
              {errors.bio && 
                <Text style={styles.errorText}>{errors.bio}</Text>
              }
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

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ride Preferences</Text>

              {/* Gender Preference */}
              <View style={[styles.inputGroup, { zIndex: 900 }]}>
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
              <View style={[styles.inputGroup, { zIndex: 800 }]}>
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
              <View style={[styles.inputGroup, { zIndex: 700 }]}>
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
              <View style={[styles.inputGroup, { zIndex: 600 }]}>
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={formData.phoneNumber}
                onChangeText={(value) => handleInputChange('phoneNumber', value)}
                placeholder="Enter phone number (+92)"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
              {errors.phoneNumber && (
                <Text style={styles.errorText}>{errors.phoneNumber}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Profile Picture</Text>
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={handleUploadPhoto}
              >
                {formData.photo_url ? (
                  <Image 
                    source={{ uri: formData.photo_url }} 
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                  />
                ) : (
                  <>
                    <Upload size={20} color="#4ECDC4" />
                    <Text style={styles.uploadText}>Upload</Text>
                  </>
                )}
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
                { label: 'Year', field: 'vehicleYear', placeholder: 'Year', keyboardType: 'numeric' as KeyboardTypeOptions }, // New field
                { label: 'Color', field: 'vehicleColor', placeholder: 'Color' }, // New field
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

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Car Photo</Text>
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={handleUploadCarPhoto}
                >
                  {formData.carPhoto_url ? (
                    <Image 
                      source={{ uri: formData.carPhoto_url }} 
                      style={{ width: 60, height: 60, borderRadius: 8 }}
                    />
                  ) : (
                    <>
                      <Upload size={20} color="#4ECDC4" />
                      <Text style={styles.uploadText}>Upload Car Photo</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Optional</Text>

            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => router.push('/auth/DailySchedule')}>
              <Text style={styles.optionText}>Daily Schedule</Text>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => router.push('/auth/PreferredpickupLocation')}>
              <Text style={styles.optionText}>Preferred Pickup Locations</Text>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.saveButton, loading && { opacity: 0.5 }]} 
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? "Saving..." : "Save"}
            </Text>
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