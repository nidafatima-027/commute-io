import React, { useRef, useState } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";

const PhoneVerificationScreen = () => {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);

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

      // If deleting, move to previous
      if (!text && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerify = () => {
    const enteredCode = code.join("");
    console.log("Entered code:", enteredCode);
    router.push("/auth/profile-setup");
  };

  const handleBack = () => {
    router.push("/auth/PhoneNumberPage");
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
          We sent a verification code to +1-XXX-XXX-XXXX
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
        <TouchableOpacity>
          <Text style={styles.resendText}>Resend code</Text>
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
