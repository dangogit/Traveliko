import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { TravelerType } from '@/types/travel';
import { User, Users, Heart, Briefcase, Baby } from 'lucide-react-native';
import colors from '@/constants/colors';

interface ProfileTypeSelectorProps {
  selectedType: TravelerType;
  onSelect: (type: TravelerType) => void;
}

export default function ProfileTypeSelector({ selectedType, onSelect }: ProfileTypeSelectorProps) {
  const travelerTypes: { type: TravelerType; label: string; icon: React.ReactNode }[] = [
    {
      type: 'solo',
      label: 'לבד',
      icon: <User size={24} color={selectedType === 'solo' ? 'white' : colors.primary} />
    },
    {
      type: 'couple',
      label: 'זוג',
      icon: <Heart size={24} color={selectedType === 'couple' ? 'white' : colors.primary} />
    },
    {
      type: 'family',
      label: 'משפחה',
      icon: <Baby size={24} color={selectedType === 'family' ? 'white' : colors.primary} />
    },
    {
      type: 'friends',
      label: 'חברים',
      icon: <Users size={24} color={selectedType === 'friends' ? 'white' : colors.primary} />
    },
    {
      type: 'business',
      label: 'עסקים',
      icon: <Briefcase size={24} color={selectedType === 'business' ? 'white' : colors.primary} />
    }
  ];

  return (
    <View style={styles.container}>
      {travelerTypes.map((item) => (
        <Pressable
          key={item.type}
          style={[
            styles.typeButton,
            selectedType === item.type && styles.selectedTypeButton
          ]}
          onPress={() => onSelect(item.type)}
        >
          <View style={styles.iconContainer}>{item.icon}</View>
          <Text
            style={[
              styles.typeLabel,
              selectedType === item.type && styles.selectedTypeLabel
            ]}
          >
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  typeButton: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedTypeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  iconContainer: {
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  selectedTypeLabel: {
    color: 'white',
  }
});