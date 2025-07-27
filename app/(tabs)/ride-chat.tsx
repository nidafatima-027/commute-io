import React, { useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { sendGenAIChat } from '../../services/api';

export default function RideChatScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hi there! How can I assist you today?' },
  ]);
  const [sending, setSending] = useState(false);

  const handleBack = () => {
    router.push('/(tabs)');
  };

  const sendMessage = async (text) => {
    const newMessages = [
      ...messages,
      { id: messages.length + 1, sender: 'user', text },
    ];
    setMessages(newMessages);
    setSending(true);
    const aiReply = await sendGenAIChat(text);
    const aiResponse = {
      id: newMessages.length + 1,
      sender: 'bot',
      text: aiReply,
    };
    setMessages([...newMessages, aiResponse]);
    setSending(false);
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) {
      Alert.alert('Validation Error', 'Please enter a valid message.');
      return;
    }
    if (trimmed.length > 1000) {
      Alert.alert('Validation Error', 'Message cannot exceed 1000 characters.');
      return;
    }
    await sendMessage(trimmed);
    setInput('');
  };

  const isRideOptionsMessage = (text) => {
    return text.includes('I found these rides from') &&
           text.includes('Please click on the block of the ride you want to book');
  };

  const extractRideOptions = (text) => {
    const optionRegex = /^\d+\.\s+Driver:.*$/gm;
    return text.match(optionRegex) || [];
  };

  const getReplyInstruction = (text) => {
    const match = text.match(/Please.*book\./i);
    return match ? match[0] : '';
  };

  const handleSendOption = async (optionNumber) => {
    await sendMessage(String(optionNumber));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ padding: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ArrowLeft size={24} color="#2d3748" />
            </TouchableOpacity>
            <Text style={styles.title}>Ride Chat</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Messages */}
          {messages.map((msg, index) => (
            <View
              key={`chat-msg-${index}-${msg.sender}-${msg.timestamp}`}
              style={[
                styles.messageRow,
                msg.sender === 'user' ? styles.userMessageRow : {},
              ]}
            >
              {msg.sender === 'bot' && (
                <Image
                  source={require('../../assets/images/ailogo.png')}
                  style={styles.avatar}
                />
              )}
              <View
                style={msg.sender === 'user' ? styles.userBubble : styles.botBubble}
              >
                {msg.sender === 'bot' && isRideOptionsMessage(msg.text) ? (
                  <View>
                    {extractRideOptions(msg.text).map((option, i) => (
                      <TouchableOpacity
                        key={`ride-option-${i}-${option.substring(0, 10)}`}
                        style={styles.rideOptionCard}
                        onPress={() => handleSendOption(i + 1)}
                      >
                        <Text style={styles.rideOptionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                    <Text style={styles.messageText}>
                      {getReplyInstruction(msg.text)}
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={
                      msg.sender === 'user'
                        ? styles.userMessageText
                        : styles.messageText
                    }
                  >
                    {msg.text}
                  </Text>
                )}
              </View>
              {msg.sender === 'user' && (
                <Image
                  source={require('../../assets/images/userlogo.jpeg')}
                  style={styles.avatar}
                />
              )}
            </View>
          ))}
        </ScrollView>

        {/* Input Field */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Type your request..."
            value={input}
            onChangeText={setInput}
            style={styles.input}
            placeholderTextColor="#aaa"
            editable={!sending}
            maxLength={1000}
          />
          <TouchableOpacity
            onPress={handleSend}
            style={[
              styles.sendButton,
              { backgroundColor: sending ? '#ccc' : '#14B8A6' },
            ]}
            disabled={sending}
          >
            <Text style={styles.sendButtonText}>
              {sending ? 'Sending...' : 'Send'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2d3748',
    marginTop: 2,
  },
  placeholder: {
    width: 40,
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
    marginLeft: 4,
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
  rideOptionCard: {
    backgroundColor: '#E0F7FA',
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
  },
  rideOptionText: {
    color: '#00796B',
    fontSize: 15,
    fontWeight: '500',
  },
  messageText: {
    fontSize: 15,
    color: '#333',
  },
  userMessageText: {
    fontSize: 15,
    color: '#fff',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderTopWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    color: '#000',
  },
  sendButton: {
    marginLeft: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
