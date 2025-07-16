import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Linking, Alert } from 'react-native';
import { Search, Phone, Mail, MessageCircle, ArrowLeft, ChevronDown, ChevronRight, ExternalLink, AlertCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HelpScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const handleBack = () => {
    router.push('/(tabs)/setting');
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open link');
    });
  };

  const sendEmail = () => {
    Linking.openURL('mailto:support@commute.io?subject=Help Request').catch(() => {
      Alert.alert('Error', 'Unable to open email client');
    });
  };

  const callSupport = () => {
    Linking.openURL('tel:+1-800-COMMUTE').catch(() => {
      Alert.alert('Error', 'Unable to make phone call');
    });
  };

  const startLiveChat = () => {
    Alert.alert('Live Chat', 'Live chat feature coming soon!');
  };

  const helpTopics = [
    {
      title: 'Getting Started',
      articles: [
        'How to create an account',
        'Setting up your profile',
        'Verifying your identity',
        'Adding payment methods',
        'Understanding the app interface'
      ]
    },
    {
      title: 'Requesting a Ride',
      articles: [
        'How to find available rides',
        'Booking a ride',
        'Communicating with drivers',
        'Canceling a ride request',
        'Payment and receipts'
      ]
    },
    {
      title: 'Offering Rides',
      articles: [
        'Creating a ride offer',
        'Managing ride requests',
        'Setting pickup locations',
        'Handling cancellations',
        'Driver safety tips'
      ]
    },
    {
      title: 'Safety & Security',
      articles: [
        'Safety guidelines',
        'Reporting issues',
        'Emergency procedures',
        'Privacy settings',
        'Trust and verification'
      ]
    },
    {
      title: 'Account & Settings',
      articles: [
        'Managing your profile',
        'Notification settings',
        'Privacy controls',
        'Account deletion',
        'Data export'
      ]
    },
    {
      title: 'Payments & Billing',
      articles: [
        'Payment methods',
        'Pricing and fees',
        'Refunds and disputes',
        'Receipt management',
        'Tax information'
      ]
    }
  ];

  const faqs = [
    {
      question: 'How do I request a ride?',
      answer: 'To request a ride, go to the home screen, enter your destination, browse available rides, and tap "Request Ride" on your preferred option.'
    },
    {
      question: 'Is it safe to share rides with strangers?',
      answer: 'Yes! We have multiple safety features including user verification, ratings system, in-app messaging, and emergency contacts. Always trust your instincts.'
    },
    {
      question: 'How are ride prices calculated?',
      answer: 'Prices are set by drivers based on distance, fuel costs, and demand. The app shows the total cost upfront with no hidden fees.'
    },
    {
      question: 'Can I cancel a ride?',
      answer: 'Yes, you can cancel rides through the app. Cancellation policies vary depending on timing and may include fees for last-minute cancellations.'
    },
    {
      question: 'What if my driver is late?',
      answer: 'You can message your driver through the app. If they\'re significantly late, you can cancel without penalty and find another ride.'
    },
    {
      question: 'How do I become a driver?',
      answer: 'Switch to driver mode in your profile, add your vehicle information, complete verification, and start offering rides to other users.'
    }
  ];

  const contactOptions = [
    {
      title: 'Email Support',
      subtitle: 'Get help via email',
      icon: Mail,
      action: sendEmail
    },
    {
      title: 'Phone Support',
      subtitle: '1-800-COMMUTE',
      icon: Phone,
      action: callSupport
    },
    {
      title: 'Live Chat',
      subtitle: 'Chat with our team',
      icon: MessageCircle,
      action: startLiveChat
    }
  ];

  const filteredTopics = helpTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.articles.some(article => 
      article.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#2d3748" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Help & Support</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* Search */}
          <View style={styles.searchContainer}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search help topics..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Contact Options */}
          <Text style={styles.sectionTitle}>Contact Support</Text>
          
          <View style={styles.contactGrid}>
            {contactOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <TouchableOpacity key={index} style={styles.contactCard} onPress={option.action}>
                  <View style={styles.contactIconContainer}>
                    <Icon size={24} color="#4ECDC4" />
                  </View>
                  <Text style={styles.contactTitle}>{option.title}</Text>
                  <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Help Topics */}
          <Text style={styles.sectionTitle}>Help Topics</Text>
          
          {filteredTopics.map((topic, index) => (
            <View key={index} style={styles.topicContainer}>
              <Text style={styles.topicTitle}>{topic.title}</Text>
              {topic.articles.map((article, articleIndex) => (
                <TouchableOpacity key={articleIndex} style={styles.articleItem}>
                  <Text style={styles.articleText}>{article}</Text>
                  <ChevronRight size={16} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* FAQ Section */}
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqContainer}>
              <TouchableOpacity 
                style={styles.faqQuestion}
                onPress={() => toggleFAQ(index)}
              >
                <Text style={styles.faqQuestionText}>{faq.question}</Text>
                {expandedFAQ === index ? (
                  <ChevronDown size={20} color="#4ECDC4" />
                ) : (
                  <ChevronRight size={20} color="#9CA3AF" />
                )}
              </TouchableOpacity>
              
              {expandedFAQ === index && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}

          {/* Additional Resources */}
          <Text style={styles.sectionTitle}>Additional Resources</Text>
          
          <TouchableOpacity 
            style={styles.resourceItem}
            onPress={() => openLink('https://community.commute.io')}
          >
            <Text style={styles.resourceTitle}>Community Forum</Text>
            <Text style={styles.resourceSubtitle}>Connect with other users</Text>
            <ExternalLink size={16} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resourceItem}
            onPress={() => openLink('https://blog.commute.io')}
          >
            <Text style={styles.resourceTitle}>Blog & Updates</Text>
            <Text style={styles.resourceSubtitle}>Latest news and tips</Text>
            <ExternalLink size={16} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Emergency */}
          <View style={styles.emergencyContainer}>
            <View style={styles.emergencyHeader}>
              <AlertCircle size={20} color="#EF4444" />
              <Text style={styles.emergencyTitle}>Emergency</Text>
            </View>
            <Text style={styles.emergencyText}>
              In case of emergency during a ride, contact local emergency services immediately.
            </Text>
            <TouchableOpacity 
              style={styles.emergencyButton}
              onPress={() => Linking.openURL('tel:911')}
            >
              <Text style={styles.emergencyButtonText}>Call 911</Text>
            </TouchableOpacity>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2d3748',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 16,
    marginTop: 24,
  },
  contactGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  contactCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#F0FDFA',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 4,
    textAlign: 'center',
  },
  contactSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  topicContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  topicTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    marginBottom: 12,
  },
  articleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  articleText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4A5568',
    flex: 1,
  },
  faqContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQuestionText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  faqAnswerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4A5568',
    lineHeight: 20,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  resourceTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2d3748',
    flex: 1,
  },
  resourceSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginRight: 12,
  },
  emergencyContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  emergencyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
  },
  emergencyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7F1D1D',
    lineHeight: 20,
    marginBottom: 16,
  },
  emergencyButton: {
    backgroundColor: '#DC2626',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  emergencyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});