import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChatMessage as ChatMessageType } from '@/types/travel';
import colors from '@/constants/colors';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.isUser;
  
  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.botContainer
    ]}>
      <Text style={[
        styles.text,
        isUser ? styles.userText : styles.botText
      ]}>
        {message.text}
      </Text>
      <Text style={styles.time}>
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  userContainer: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  botContainer: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: 'white',
    textAlign: 'right',
  },
  botText: {
    color: colors.text,
    textAlign: 'right',
  },
  time: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    textAlign: 'left',
  }
});