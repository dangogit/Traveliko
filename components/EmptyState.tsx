import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import colors from '@/constants/colors';
import { Search } from 'lucide-react-native';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  small?: boolean;
}

export default function EmptyState({ 
  title, 
  message, 
  icon, 
  actionLabel, 
  onAction,
  small = false
}: EmptyStateProps) {
  return (
    <View style={[styles.container, small && styles.smallContainer]}>
      {icon && (
        <View style={[styles.iconContainer, small && styles.smallIconContainer]}>
          {icon}
        </View>
      )}
      <Text style={[styles.title, small && styles.smallTitle]}>{title}</Text>
      <Text style={[styles.message, small && styles.smallMessage]}>{message}</Text>
      
      {actionLabel && onAction && (
        <Pressable style={styles.actionButton} onPress={onAction}>
          <Text style={styles.actionButtonText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  smallContainer: {
    flex: 0,
    padding: 16,
    paddingVertical: 32,
  },
  iconContainer: {
    marginBottom: 16,
  },
  smallIconContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  smallTitle: {
    fontSize: 16,
  },
  message: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  smallMessage: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});