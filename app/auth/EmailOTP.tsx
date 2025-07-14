import React, { useRef, useState } from "react";
import { router, useLocalSearchParams } from 'expo-router';
import { Alert } from "react-native";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { authAPI } from "../../services/api";

const EmailVerificationScreen = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const { email } = useLocalSearchParams();
  // Refs for auto-focusing next inputs
  const inputs = useRef<Array<TextInput | null>>([]);

  // Check if all digits are entered
  const isCodeComplete = code.every((digit) => digit.length === 1);

  const handleChange = (text: string, index: number) => {
    if (/^[0-9]?$/.test(text)) {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);

      // Move to next input if filled
      if (text && index < 5) {
        inputs.current[index + 1]?.focus();
      }

      // If deleting, move back
      if (!text && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const enteredCode = code.join('');
    if (!enteredCode || enteredCode.length !== 6) {
      Alert.alert("Validation Error", "Please enter the complete 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.verifyOTP(email as string, enteredCode);
      
      // Check if user is new or existing
      if (response.user?.is_new_user) {
        router.push('/auth/profile-setup');
      } else {
        router.push('/(tabs)'); // Or your index/home route
      }
      
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/auth/EmailPage');
  };

  const handleResendOTP = async () => {
  // Clear all code inputs
  setCode(Array(6).fill(''));
  // Focus the first input field
  inputs.current[0]?.focus();
  
  setLoading(true);
  const timeout = setTimeout(() => {
    setLoading(false);
    Alert.alert("Timeout", "Request took too long");
  }, 15000);

  try {
    await authAPI.sendOTP(email as string);
    Alert.alert("Success", "New OTP code has been sent");
  } catch (error) {
    Alert.alert("Error", error instanceof Error ? error.message : "Failed to resend OTP");
  } finally {
    clearTimeout(timeout);
    setLoading(false);
  }
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
          <Text style={styles.headerTitle}>One Time Password (OTP)</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Enter the code</Text>
          <Text style={styles.subtitle}>
            We sent a verification code to {email || 'your email'} {/* change */}
          </Text>

          {/* Code Inputs */}
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
ref={(ref) => {
  inputs.current[index] = ref;
}}
                style={styles.codeInput}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
              />
            ))}
          </View>

          {/* Resend */}
          <TouchableOpacity 
            onPress={handleResendOTP}
            disabled={loading}
          >
            <Text style={[styles.resendText, loading && { opacity: 0.5 }]}>
              Resend code
            </Text>
          </TouchableOpacity>

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              (!isCodeComplete || loading) && { opacity: 0.5 },
            ]}
            onPress={handleVerify}
            disabled={!isCodeComplete || loading}
          >
            <Text style={styles.verifyButtonText}>
              {loading ? "Verifying..." : "Verify"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmailVerificationScreen;

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
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#4A5568',
    marginBottom: 24,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  codeInput: {
    width: 48,
    height: 56,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
  },
  resendText: {
    textAlign: 'center',
    color: '#718096',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 32,
  },
  verifyButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  verifyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});
