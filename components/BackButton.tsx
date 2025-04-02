import React from 'react';
import { StyleSheet, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import colors from '@/constants/colors';

interface BackButtonProps {
  onPress?: () => void;
  label?: string;
  color?: string;
}

export default function BackButton({ 
  onPress, 
  label = "חזור", 
  color = colors.primary 
}: BackButtonProps) {
  const router = useRouter();
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <Pressable style={styles.button} onPress={handlePress}>
      {label && <Text style={[styles.label, { color }]}>{label}</Text>}
      <ArrowRight size={20} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  label: {
    marginRight: 4,
    fontSize: 16,
    fontWeight: '500',
  }
});