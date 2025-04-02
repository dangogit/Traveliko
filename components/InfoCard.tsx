import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '@/constants/colors';

interface InfoCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
}

export default function InfoCard({ title, value, icon }: InfoCardProps) {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  iconContainer: {
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'right',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginTop: 4,
    textAlign: 'right',
  }
});