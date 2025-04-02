import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import colors from '@/constants/colors';
import { Check } from 'lucide-react-native';

interface Option {
  value: string;
  label: string;
}

interface OptionSelectorProps {
  options: Option[];
  selectedOptions: string[];
  onToggle: (option: string) => void;
}

export default function OptionSelector({ options, selectedOptions, onToggle }: OptionSelectorProps) {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <Pressable
          key={option.value}
          style={[
            styles.optionButton,
            selectedOptions.includes(option.value) && styles.selectedOptionButton
          ]}
          onPress={() => onToggle(option.value)}
        >
          <Text
            style={[
              styles.optionLabel,
              selectedOptions.includes(option.value) && styles.selectedOptionLabel
            ]}
          >
            {option.label}
          </Text>
          {selectedOptions.includes(option.value) && (
            <Check size={16} color="white" />
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    margin: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedOptionButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionLabel: {
    fontSize: 14,
    color: colors.text,
    marginRight: 4,
  },
  selectedOptionLabel: {
    color: 'white',
  }
});