import React, { useRef, useState } from "react";
import { Alert } from "react-native";
import { authAPI } from "../../services/api";

import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { storeToken, storeAuthMethod } from '../../services/auth';
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

const formatPhone = (num: string): string => {
  const digits = num.replace(/\D/g, "");
  if (digits.startsWith("92") && digits.length === 12) {
    return `+92${digits.slice(2, 5)}${digits.slice(5)}`;
  }
  return num;
};
const PhoneVerificationScreen = () => {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
  

  // Refs for auto-focusing next inputs
  const inputs = useRef<Array<TextInput | null>>([]);

  const params = useLocalSearchParams();
  const rawPhone = Array.isArray(params.formattedPhone) ? params.formattedPhone[0] : params.formattedPhone ?? "";
  const formattedPhone = formatPhone(rawPhone);

  // Check if all digits are entered
  const isCodeComplete = code.every((digit) => digit.length === 1);

  const handleChange = (text: string, index: number) => {
    if (/^[0-9]?$/.test(text)) {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);
      if (text && index < 5) {
        inputs.current[index + 1]?.focus();
      }

      // If deleting, move to previous
      if (!text && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    console.log(params.formattedPhone)
    console.log(formattedPhone)
    const enteredCode = code.join("");
     if (!enteredCode || enteredCode.length !== 6) {
          Alert.alert("Validation Error", "Please enter the complete 6-digit code.");
          return;
        }
    setLoading(true);
        try {
          const response = await authAPI.verifyMobileOTP(formattedPhone as string, enteredCode);
          const { access_token, is_new_user, auth_method } = response;
          console.log(auth_method)
    await storeToken(access_token);
    await storeAuthMethod(auth_method);
          // Check if user is new or existing
          if (is_new_user) {
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
    router.push("/auth/PhoneNumberPage");
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
    console.log("Resending OTP to:", formattedPhone);
    await authAPI.sendMobileOTP(formattedPhone as string);
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
            We sent a verification code to {formattedPhone}
          </Text>

        {/* Code Inputs */}
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={`phone-otp-${index}`}
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
            !isCodeComplete && { opacity: 0.5 },
          ]}
          onPress={handleVerify}
          disabled={!isCodeComplete}
        >
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </SafeAreaView>
);
}

export default PhoneVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fffe",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    color: "#2d3748",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    color: "#2d3748",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  codeInput: {
    width: 48,
    height: 56,
    marginHorizontal: 4,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Inter-Medium",
    color: "#2d3748",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  resendText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#4ECDC4",
    marginBottom: 24,
  },
  verifyButton: {
    backgroundColor: "#4ECDC4",
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 64,
    alignItems: "center",
  },
  verifyButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
  },
});
