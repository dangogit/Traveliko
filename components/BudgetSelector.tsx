import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import colors from '@/constants/colors';
import { DollarSign } from 'lucide-react-native';

interface BudgetSelectorProps {
  selectedBudget: 'low' | 'medium' | 'high';
  onSelect: (budget: 'low' | 'medium' | 'high') => void;
}

export default function BudgetSelector({ selectedBudget, onSelect }: BudgetSelectorProps) {
  const budgetOptions = [
    { value: 'low', label: 'חסכוני', icon: 1 },
    { value: 'medium', label: 'בינוני', icon: 2 },
    { value: 'high', label: 'גבוה', icon: 3 }
  ] as const;

  return (
    <View style={styles.container}>
      {budgetOptions.map((option) => (
        <Pressable
          key={option.value}
          style={[
            styles.budgetButton,
            selectedBudget === option.value && styles.selectedBudgetButton
          ]}
          onPress={() => onSelect(option.value)}
        >
          <View style={styles.iconContainer}>
            {[...Array(option.icon)].map((_, i) => (
              <DollarSign 
                key={i} 
                size={16} 
                color={selectedBudget === option.value ? 'white' : colors.primary} 
              />
            ))}
          </View>
          <Text
            style={[
              styles.budgetLabel,
              selectedBudget === option.value && styles.selectedBudgetLabel
            ]}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  budgetButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedBudgetButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  iconContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  budgetLabel: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  selectedBudgetLabel: {
    color: 'white',
  }
});