import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Search, Phone, Mail, Home, Car, MessageCircle, User, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

export default function HelpScreen () {
  const helpTopics = [
    { title: 'Requesting a ride', description: 'Learn how to request a ride' },
    { title: 'Driving with us', description: 'Learn how to drive with us' },
    { title: 'Cancelling a ride', description: 'Learn how to cancel a ride' },
    { title: 'Rating a ride', description: 'Learn how to rate a ride' },
  ];

  const contactOptions = [
    { title: 'Call us', icon: Phone },
    { title: 'Email us', icon: Mail },
  ];

    const handleSettings = () => {
      router.push('/(tabs)/setting');
    };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSettings}>
          <ArrowLeft size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Help</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Popular topics</Text>
        
        {helpTopics.map((topic, index) => (
          <TouchableOpacity key={index} style={styles.topicItem}>
            <Text style={styles.topicTitle}>{topic.title}</Text>
            <Text style={styles.topicDescription}>{topic.description}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Contact us</Text>
        
        {contactOptions.map((option, index) => {
          const Icon = option.icon;
          return (
            <TouchableOpacity key={index} style={styles.contactItem}>
              <Icon size={24} color="#333" />
              <Text style={styles.contactText}>{option.title}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchText: {
    marginLeft: 8,
    color: '#888',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#555',
  },
  topicItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  topicDescription: {
    fontSize: 14,
    color: '#666',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  contactText: {
    fontSize: 16,
    marginLeft: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
  },
});
