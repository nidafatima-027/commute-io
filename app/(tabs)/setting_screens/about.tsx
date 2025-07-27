import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { ArrowLeft, Info, Users, FileText, ShieldCheck, Mail, ExternalLink, Star, Globe, Code } from 'lucide-react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutScreen() {
  const handleBack = () => {
    router.push('/(tabs)/setting');
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open link');
    });
  };

  const sendEmail = () => {
    Linking.openURL('mailto:support@commute.io').catch(() => {
      Alert.alert('Error', 'Unable to open email client');
    });
  };

  const rateApp = () => {
    // Replace with actual app store URLs
    const appStoreUrl = 'https://apps.apple.com/app/commute-io';
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.commute.io';
    
    Alert.alert(
      'Rate Our App',
      'Would you like to rate Commute.io?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Rate on App Store', onPress: () => openLink(appStoreUrl) },
        { text: 'Rate on Play Store', onPress: () => openLink(playStoreUrl) },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#2d3748" />
          </TouchableOpacity>
          <Text style={styles.headerText}>About</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* App Information */}
          <Text style={styles.sectionTitle}>App Information</Text>

          <View style={styles.item}>
            <View style={styles.iconContainer}>
              <Info size={24} color="#4ECDC4" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Version</Text>
              <Text style={styles.itemSubtitle}>1.2.3 (Build 456)</Text>
            </View>
          </View>

          <View style={styles.item}>
            <View style={styles.iconContainer}>
              <Users size={24} color="#4ECDC4" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Our Mission</Text>
              <Text style={styles.itemSubtitle}>Connecting commuters for sustainable travel</Text>
            </View>
          </View>

          {/* Mission Statement */}
          <View style={styles.missionContainer}>
            <Text style={styles.missionTitle}>About Commute.io</Text>
            <Text style={styles.missionText}>
              Commute.io is dedicated to making transportation more sustainable, affordable, and social. 
              We connect drivers and riders to share journeys, reduce traffic congestion, and build 
              stronger communities through shared mobility.
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Key Features</Text>
            {[
              'Real-time ride matching',
              'Secure in-app messaging',
              'Rating and review system',
              'Flexible scheduling',
              'Safe payment processing',
              'Community-driven platform'
            ].map((feature, index) => (
              <View key={`feature-${feature.replace(/\s+/g, '-')}-${index}`} style={styles.featureItem}>
                <Text style={styles.featureBullet}>•</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>

          {/* Legal */}
          <Text style={styles.sectionTitle}>Legal</Text>

          <TouchableOpacity 
            style={styles.item}
            onPress={() => openLink('https://commute.io/terms')}
          >
            <View style={styles.iconContainer}>
              <FileText size={24} color="#4ECDC4" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Terms of Service</Text>
              <Text style={styles.itemSubtitle}>Read our terms and conditions</Text>
            </View>
            <ExternalLink size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.item}
            onPress={() => openLink('https://commute.io/privacy')}
          >
            <View style={styles.iconContainer}>
              <ShieldCheck size={24} color="#4ECDC4" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Privacy Policy</Text>
              <Text style={styles.itemSubtitle}>How we protect your data</Text>
            </View>
            <ExternalLink size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.item}
            onPress={() => openLink('https://commute.io/licenses')}
          >
            <View style={styles.iconContainer}>
              <Code size={24} color="#4ECDC4" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Open Source Licenses</Text>
              <Text style={styles.itemSubtitle}>Third-party software licenses</Text>
            </View>
            <ExternalLink size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Contact & Support */}
          <Text style={styles.sectionTitle}>Contact & Support</Text>

          <TouchableOpacity style={styles.item} onPress={sendEmail}>
            <View style={styles.iconContainer}>
              <Mail size={24} color="#4ECDC4" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Contact Us</Text>
              <Text style={styles.itemSubtitle}>support@commute.io</Text>
            </View>
            <ExternalLink size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.item}
            onPress={() => openLink('https://commute.io')}
          >
            <View style={styles.iconContainer}>
              <Globe size={24} color="#4ECDC4" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Website</Text>
              <Text style={styles.itemSubtitle}>www.commute.io</Text>
            </View>
            <ExternalLink size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.item} onPress={rateApp}>
            <View style={styles.iconContainer}>
              <Star size={24} color="#4ECDC4" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle}>Rate Our App</Text>
              <Text style={styles.itemSubtitle}>Help us improve with your feedback</Text>
            </View>
            <ExternalLink size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Development Team */}
          <Text style={styles.sectionTitle}>Development Team</Text>

          <View style={styles.teamContainer}>
            <Text style={styles.teamText}>
              Commute.io is developed by a passionate team of engineers and designers 
              committed to sustainable transportation solutions.
            </Text>
            <Text style={styles.teamCredits}>
              Special thanks to our beta testers and the open-source community.
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © 2024 Commute.io Inc. All rights reserved.
            </Text>
            <Text style={styles.footerSubtext}>
              Made with ❤️ for sustainable commuting
            </Text>
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
  missionContainer: {
    backgroundColor: '#F0FDFA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#B2F5EA',
  },
  missionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 12,
  },
  missionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4A5568',
    lineHeight: 20,
  },
  featuresContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  featuresTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureBullet: {
    fontSize: 16,
    color: '#4ECDC4',
    marginRight: 8,
    fontFamily: 'Inter-Bold',
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4A5568',
  },
  teamContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  teamText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4A5568',
    lineHeight: 20,
    marginBottom: 12,
  },
  teamCredits: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    fontStyle: 'italic',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 16,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
});