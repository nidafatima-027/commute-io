import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Phone } from 'lucide-react-native';

export default function SignupScreen() {
  const handleEmailSignup = () => {
    router.push('/auth/EmailPage');
  };

  const handlePhoneSignup = () => {
    router.push('/auth/PhoneNumberPage');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appName}>Commute_io</Text>
          <Text style={styles.title}>Get started</Text>
        </View>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.illustration}
            resizeMode="cover"
          />
          <View style={styles.overlay} />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleEmailSignup}>
            <LinearGradient
              colors={['#4ECDC4', '#44A08D']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Mail size={20} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Continue with email</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handlePhoneSignup}>
            <Phone size={20} color="#2d3748" />
            <Text style={styles.secondaryButtonText}>Continue with phone</Text>
          </TouchableOpacity>
        </View>

        {/* Terms */}
        <Text style={styles.termsText}>
          By continuing, you agree to our{' '}
          <Text style={styles.linkText}>Terms of Service</Text> and{' '}
          <Text style={styles.linkText}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fffe',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#2d3748',
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 40,
    position: 'relative',
  },
  illustration: {
    width: '100%',
    height: 250,
    borderRadius: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderRadius: 20,
  },
  actionContainer: {
    gap: 16,
    marginBottom: 24,
  },
  primaryButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  secondaryButtonText: {
    color: '#2d3748',
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