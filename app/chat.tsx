import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, FlatList, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import colors from '@/constants/colors';
import { getChatbotResponse } from '@/mocks/chatbot-responses';

export default function ChatScreen() {
  const [messages, setMessages] = useState<any[]>([
    {
      id: '1',
      text: 'שלום! אני העוזר הווירטואלי שלך לתכנון טיולים. איך אוכל לעזור לך היום?',
      isUser: false,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: getChatbotResponse(text),
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => <ChatMessage message={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
        />
        
        <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 16,
  },
});