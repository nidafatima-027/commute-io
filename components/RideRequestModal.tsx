import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Check, X, Clock } from 'lucide-react-native';

interface RideRequestModalProps {
  visible: boolean;
  onClose: () => void;
  status: 'idle' | 'loading' | 'success' | 'error' | 'already_requested';
  errorMessage?: string;
  additionalInfo?: {
    requestedAt?: string;
  };
}

export default function RideRequestModal({ 
  visible, 
  onClose, 
  status = 'idle',
  errorMessage ,
  additionalInfo
}: RideRequestModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {status === 'loading' && (
            <>
              <ActivityIndicator size="large" color="#4ECDC4" />
              <Text style={styles.title}>Sending Request...</Text>
            </>
          )}
          {status === 'success' && (
            <>
              <View style={styles.iconContainer}>
                <Check size={48} color="#ffffff" strokeWidth={3} />
              </View>
              <Text style={styles.title}>Ride Request Sent Successfully</Text>
              <Text style={styles.subtitle}>Driver will contact you soon</Text>
            </>
          )}
          {/* Already requested state */}
          {status === 'already_requested' && (
            <>
              <View style={[styles.iconContainer, { backgroundColor: '#F59E0B' }]}>
                <Clock size={48} color="#ffffff" strokeWidth={3} />
              </View>
              <Text style={styles.title}>Request Already Submitted</Text>
              <Text style={styles.subtitle}>{errorMessage}</Text>
              {additionalInfo?.requestedAt && (
                <Text style={styles.infoText}>
                  Requested on: {additionalInfo.requestedAt}
                </Text>
              )}
            </>
          )}
          {status === 'error' && (
            <>
              <View style={[styles.iconContainer, { backgroundColor: '#EF4444' }]}>
                <X size={48} color="#ffffff" strokeWidth={3} />
              </View>
              <Text style={styles.title}>Request Failed</Text>
              <Text style={styles.subtitle}>{errorMessage || 'Please try again later'}</Text>
            </>
          )}
          <TouchableOpacity 
            style={[
              styles.okButton,
              status === 'error' && { backgroundColor: '#EF4444' }
            ]} 
            onPress={onClose}
            disabled={status === 'loading'}
          >
            <Text style={styles.okButtonText}>
              {status === 'loading' ? 'Processing...' : 'OK'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 40,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#718096',
    textAlign: 'center',
    marginBottom: 32,
  },
  okButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 12,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  okButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280', // A slightly lighter gray than your subtitle
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
});