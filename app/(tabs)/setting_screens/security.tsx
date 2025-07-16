import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { ArrowLeft, Shield, Lock, Smartphone, Eye, EyeOff, Key, AlertTriangle } from 'lucide-react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SecuritySettingsScreen() {
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [autoLock, setAutoLock] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleBack = () => {
    router.push('/(tabs)/setting');
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    Alert.alert(
      'Change Password',
      'Are you sure you want to change your password?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change',
          onPress: () => {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            Alert.alert('Success', 'Password changed successfully');
          },
        },
      ]
    );
  };

  const handleSetupTwoFactor = () => {
    if (twoFactorAuth) {
      Alert.alert(
        'Disable Two-Factor Authentication',
        'Are you sure you want to disable 2FA? This will make your account less secure.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Disable', style: 'destructive', onPress: () => setTwoFactorAuth(false) },
        ]
      );
    } else {
      Alert.alert(
        'Setup Two-Factor Authentication',
        'We will send you a verification code to set up 2FA.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Setup', onPress: () => setTwoFactorAuth(true) },
        ]
      );
    }
  };

  const viewLoginHistory = () => {
    Alert.alert('Login History', 'Login history feature coming soon!');
  };

  const viewActiveDevices = () => {
    Alert.alert('Active Devices', 'Device management feature coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#2d3748" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Security Settings</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* Authentication */}
          <Text style={styles.sectionTitle}>Authentication</Text>

          <TouchableOpacity style={styles.item} onPress={handleSetupTwoFactor}>
            <View style={styles.iconContainer}>
              <Shield size={24} color="#2d3748" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Two-Factor Authentication</Text>
              <Text style={styles.itemSubtitle}>
                {twoFactorAuth ? 'Enabled' : 'Add extra security to your account'}
              </Text>
            </View>
            <Switch 
              value={twoFactorAuth} 
              onValueChange={handleSetupTwoFactor}
              trackColor={{ false: '#E5E7EB', true: '#4ECDC4' }}
              thumbColor="#ffffff"
            />
          </TouchableOpacity>

          <View style={styles.item}>
            <View style={styles.iconContainer}>
              <Smartphone size={24} color="#2d3748" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Biometric Authentication</Text>
              <Text style={styles.itemSubtitle}>Use fingerprint or face ID</Text>
            </View>
            <Switch 
              value={biometricAuth} 
              onValueChange={setBiometricAuth}
              trackColor={{ false: '#E5E7EB', true: '#4ECDC4' }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={styles.item}>
            <View style={styles.iconContainer}>
              <Lock size={24} color="#2d3748" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Auto-Lock</Text>
              <Text style={styles.itemSubtitle}>Lock app when inactive</Text>
            </View>
            <Switch 
              value={autoLock} 
              onValueChange={setAutoLock}
              trackColor={{ false: '#E5E7EB', true: '#4ECDC4' }}
              thumbColor="#ffffff"
            />
          </View>

          {/* Password Management */}
          <Text style={styles.sectionTitle}>Password Management</Text>

          <View style={styles.passwordContainer}>
            <Text style={styles.passwordTitle}>Change Password</Text>
            
            <View style={styles.passwordInputGroup}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  secureTextEntry={!showCurrentPassword}
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff size={20} color="#9CA3AF" />
                  ) : (
                    <Eye size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.passwordInputGroup}>
              <Text style={styles.inputLabel}>New Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  secureTextEntry={!showNewPassword}
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff size={20} color="#9CA3AF" />
                  ) : (
                    <Eye size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.passwordInputGroup}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  secureTextEntry={!showConfirmPassword}
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#9CA3AF" />
                  ) : (
                    <Eye size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.changePasswordButton} onPress={handleChangePassword}>
              <Text style={styles.changePasswordButtonText}>Change Password</Text>
            </TouchableOpacity>
          </View>

          {/* Security Monitoring */}
          <Text style={styles.sectionTitle}>Security Monitoring</Text>

          <View style={styles.item}>
            <View style={styles.iconContainer}>
              <AlertTriangle size={24} color="#2d3748" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Login Alerts</Text>
              <Text style={styles.itemSubtitle}>Get notified of new logins</Text>
            </View>
            <Switch 
              value={loginAlerts} 
              onValueChange={setLoginAlerts}
              trackColor={{ false: '#E5E7EB', true: '#4ECDC4' }}
              thumbColor="#ffffff"
            />
          </View>

          <TouchableOpacity style={styles.actionButton} onPress={viewLoginHistory}>
            <View style={styles.actionIconContainer}>
              <Key size={24} color="#4ECDC4" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.actionTitle}>Login History</Text>
              <Text style={styles.actionSubtitle}>View recent login activity</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={viewActiveDevices}>
            <View style={styles.actionIconContainer}>
              <Smartphone size={24} color="#4ECDC4" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.actionTitle}>Active Devices</Text>
              <Text style={styles.actionSubtitle}>Manage logged-in devices</Text>
            </View>
          </TouchableOpacity>

          {/* Security Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Security Tips</Text>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>Use a strong, unique password</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>Enable two-factor authentication</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>Keep your app updated</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>Don't share your login credentials</Text>
            </View>
          </View>
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
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 16,
    marginTop: 24,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
  },
  itemSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  passwordContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  passwordTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 16,
  },
  passwordInputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2d3748',
  },
  eyeButton: {
    padding: 12,
  },
  changePasswordButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  changePasswordButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
  },
  actionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  tipsContainer: {
    backgroundColor: '#F0FDFA',
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#B2F5EA',
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 16,
    color: '#4ECDC4',
    marginRight: 8,
    fontFamily: 'Inter-Bold',
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4A5568',
    flex: 1,
    lineHeight: 20,
  },
});