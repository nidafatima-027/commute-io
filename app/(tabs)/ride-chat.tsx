import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

export default function RideChatScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ArrowLeft size={24} color="black" />
          <Text style={styles.title}>Ride Chat</Text>
        </View>

        {/* Chat Content */}
        <View style={styles.content}>
          {/* Message 1 */}
          <View style={styles.messageRow}>
            <Image
              source={require('../../assets/images/ailogo.png')}
              style={styles.avatar}
            />
            <View style={styles.botBubble}>
              <Text style={styles.messageText}>Hi there! How can I assist you today?</Text>
            </View>
          </View>

          {/* User Message */}
          <View style={[styles.messageRow, styles.userMessageRow]}>
            <View style={styles.userBubble}>
              <Text style={styles.userMessageText}>
                Book a ride from Home to Office at 9 AM
              </Text>
            </View>
            <Image
              source={require('../../assets/images/userlogo.jpeg')}
              style={styles.avatar}
            />
          </View>

          {/* Message 2 */}
          <View style={styles.messageRow}>
            <Image
              source={require('../../assets/images/ailogo.png')}
              style={styles.avatar}
            />
            <View style={styles.botBubble}>
              <Text style={styles.messageText}>
                Okay, I'm searching for rides from your home to the office for 9 AM. Please wait a moment.
              </Text>
            </View>
          </View>

          {/* Message 3 */}
          <View style={styles.messageRow}>
            <Image
              source={require('../../assets/images/ailogo.png')}
              style={styles.avatar}
            />
            <View style={styles.botBubble}>
              <Text style={styles.messageText}>I found a few options for you:</Text>
            </View>
          </View>

          {/* Options */}
          {[
            {
              name: 'Ethan',
              time: '15 minutes',
              cost: '$12',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
            },
            {
              name: 'Noah',
              time: '20 minutes',
              cost: '$10',
      image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
            },
            {
              name: 'Oliver',
              time: '25 minutes',
              cost: '$8',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
            },
          ].map((option, index) => (
            <View key={index} style={styles.optionContainer}>
              <Text style={styles.optionTitle}>Option {index + 1}</Text>
              <View style={styles.optionRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.driverName}>Driver: {option.name}</Text>
                  <Text style={styles.driverDetail}>
                    Estimated Time: {option.time} | Cost: {option.cost}
                  </Text>
                </View>
                <Image source={{ uri: option.image }} style={styles.driverAvatar} />
              </View>
            </View>
          ))}

          {/* Final Bot Message */}
          <View style={styles.messageRow}>
            <Image
              source={require('../../assets/images/ailogo.png')}
              style={styles.avatar}
            />
            <View style={styles.botBubble}>
              <Text style={styles.messageText}>Which option would you like to choose?</Text>
            </View>
          </View>

          {/* Input Field */}
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Type your request..."
              style={styles.input}
              placeholderTextColor="#aaa"
            />
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1828/1828925.png' }}
              style={styles.sendIcon}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 12,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  driverAvatar: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginLeft: 10,
  },
  botBubble: {
    backgroundColor: '#F1F1F1',
    padding: 12,
    borderRadius: 15,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#37BEB0',
    padding: 12,
    borderRadius: 15,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 15,
    color: '#333',
  },
  userMessageText: {
    fontSize: 15,
    color: '#fff',
  },
  optionContainer: {
    marginTop: 10,
    marginBottom: 12,
  },
  optionTitle: {
    color: '#888',
    marginBottom: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 12,
  },
  driverName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  driverDetail: {
    fontSize: 14,
    color: '#555',
  },
  inputWrapper: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  sendIcon: {
    width: 24,
    height: 24,
    tintColor: '#bbb',
    marginLeft: 10,
  },
});
