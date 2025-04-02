import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Pressable, Keyboard } from 'react-native';
import { Send } from 'lucide-react-native';
import colors from '@/constants/colors';

interface ChatInputProps {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="הקלד הודעה..."
        placeholderTextColor={colors.muted}
        multiline
        maxLength={500}
        textAlign="right"
      />
      <Pressable 
        onPress={handleSend} 
        style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
        disabled={!message.trim()}
      >
        <Send size={20} color={message.trim() ? 'white' : colors.muted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    marginRight: 8,
    color: colors.text,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  }
});