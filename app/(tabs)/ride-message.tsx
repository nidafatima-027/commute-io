import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Send } from 'lucide-react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { messagesAPI, usersAPI } from '../../services/api';

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  sent_at: string;
  ride_id?: number;
}

export default function RideMessageScreen() {
  const { userId, name, image, rideId, rideRoute } = useLocalSearchParams();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    initializeUser();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      loadMessages();
    }
  }, [currentUserId]);

  const initializeUser = async () => {
    try {
      const profile = await usersAPI.getProfile();
      setCurrentUserId(profile.id);
    } catch (error) {
      console.error('Error getting user profile:', error);
      // Fallback to user ID 1 for development
      setCurrentUserId(1);
    }
  };

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await messagesAPI.getConversationWithUser(Number(userId));
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
      Alert.alert('Error', 'Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || !currentUserId) return;

    try {
      setSending(true);
      
      // Optimistically add message to UI
      const tempMessage: Message = {
        id: Date.now(),
        sender_id: currentUserId,
        receiver_id: Number(userId),
        content: trimmedInput,
        sent_at: new Date().toISOString(),
        ride_id: Number(rideId),
      };
      
      setMessages(prev => [...prev, tempMessage]);
      setInput('');

      // Send to backend
      await messagesAPI.sendMessage(
        Number(userId), 
        trimmedInput, 
        Number(rideId)
      );

      // Reload messages to get the actual message from server
      loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
      // Remove the optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== Date.now()));
    } finally {
      setSending(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isMyMessage = (message: Message) => {
    return currentUserId && message.sender_id === currentUserId;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: 'height' })}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#2d3748" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Image 
              source={{ uri: Array.isArray(image) ? image[0] : image }} 
              style={styles.headerAvatar} 
            />
            <View style={styles.headerText}>
              <Text style={styles.headerName}>{name}</Text>
              <Text style={styles.headerRoute} numberOfLines={1}>
                {rideRoute}
              </Text>
            </View>
          </View>
          <View style={styles.headerPlaceholder} />
        </View>

        {/* Messages */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4ECDC4" />
            <Text style={styles.loadingText}>Loading conversation...</Text>
          </View>
        ) : (
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {messages.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  Start the conversation about your ride!
                </Text>
              </View>
            ) : (
              messages.map((message, index) => (
                <View
                  key={message.id || index}
                  style={[
                    styles.messageContainer,
                    isMyMessage(message) ? styles.myMessage : styles.theirMessage,
                  ]}
                >
                  <View
                    style={[
                      styles.messageBubble,
                      isMyMessage(message) ? styles.myBubble : styles.theirBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        isMyMessage(message) ? styles.myMessageText : styles.theirMessageText,
                      ]}
                    >
                      {message.content}
                    </Text>
                    <Text
                      style={[
                        styles.messageTime,
                        isMyMessage(message) ? styles.myMessageTime : styles.theirMessageTime,
                      ]}
                    >
                      {formatTime(message.sent_at)}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Type a message about the ride..."
            style={styles.input}
            placeholderTextColor="#9CA3AF"
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            editable={!sending}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!input.trim() || sending) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!input.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Send size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F9FAFB' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: { 
    width: 40, 
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 16,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerName: { 
    fontSize: 18, 
    fontFamily: 'Inter-SemiBold', 
    color: '#2d3748' 
  },
  headerRoute: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4ECDC4',
    marginTop: 2,
  },
  headerPlaceholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  messagesContainer: { 
    flex: 1 
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  messageContainer: { 
    marginVertical: 4 
  },
  myMessage: { 
    alignItems: 'flex-end' 
  },
  theirMessage: { 
    alignItems: 'flex-start' 
  },
  messageBubble: { 
    maxWidth: '80%', 
    padding: 12, 
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  myBubble: { 
    backgroundColor: '#4ECDC4',
    borderBottomRightRadius: 4,
  },
  theirBubble: { 
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: { 
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  myMessageText: { 
    color: '#FFFFFF' 
  },
  theirMessageText: { 
    color: '#2d3748' 
  },
  messageTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },
  theirMessageTime: {
    color: '#9CA3AF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  input: { 
    flex: 1, 
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#2d3748',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9FAFB',
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
    elevation: 0,
    shadowOpacity: 0,
  },
});