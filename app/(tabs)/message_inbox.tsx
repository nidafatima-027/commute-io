import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Phone } from 'lucide-react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function MessagesChatScreen() {
  const { name, image } = useLocalSearchParams();

  const handleBack = () => {
    router.push('/(tabs)/messages');
  };

  // Example conversation data based on your design screenshot:
  const messages = [
    { id: 1, sender: 'them', text: "Hey, I'm at the usual spot. Ready to go?", avatar: image },
    { id: 2, sender: 'me', text: "Almost there! Just grabbing my bag.", avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: 3, sender: 'them', text: "No rush. Drive safe.", avatar: image },
    { id: 4, sender: 'me', text: "Will do. See you in a bit.", avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>{name}</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Phone size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView style={styles.messagesContainer} contentContainerStyle={{ paddingVertical: 16 }}>
        {messages.map((msg) => (
          <View key={msg.id} style={[styles.messageContainer, msg.sender === 'me' ? styles.messageRight : styles.messageLeft]}>
            {msg.sender === 'them' && <Image source={{ uri: msg.avatar }} style={styles.avatar} />}
            <View style={[styles.bubble, msg.sender === 'me' ? styles.bubbleMe : styles.bubbleThem]}>
              <Text style={[styles.messageText, msg.sender === 'me' ? styles.textMe : styles.textThem]}>{msg.text}</Text>
            </View>
            {msg.sender === 'me' && <Image source={{ uri: msg.avatar }} style={styles.avatar} />}
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput placeholder="Message..." style={styles.input} placeholderTextColor="#9CA3AF" />
        <TouchableOpacity>
          <Image source={require('../../assets/images/user.png')} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  iconButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, fontFamily: 'Inter-SemiBold', color: '#1F2937' },

  messagesContainer: { flex: 1, paddingHorizontal: 16 },
  messageContainer: { flexDirection: 'row', alignItems: 'flex-end', marginVertical: 8 },
  messageLeft: { justifyContent: 'flex-start' },
  messageRight: { justifyContent: 'flex-end', alignSelf: 'flex-end' },

  avatar: { width: 32, height: 32, borderRadius: 16, marginHorizontal: 8 },
  bubble: { maxWidth: '70%', padding: 12, borderRadius: 16 },
  bubbleThem: { backgroundColor: '#F1F5F9', borderTopLeftRadius: 0 },
  bubbleMe: { backgroundColor: '#14B8A6', borderTopRightRadius: 0 },
  messageText: { fontSize: 16 },
  textThem: { color: '#1F2937' },
  textMe: { color: '#FFFFFF' },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  input: { flex: 1, fontSize: 16, color: '#1F2937', paddingVertical: 8 },
});
