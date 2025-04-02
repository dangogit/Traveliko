import React from 'react';
import { StyleSheet, TextInput, View, Pressable } from 'react-native';
import { Search, X } from 'lucide-react-native';
import colors from '@/constants/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChangeText, placeholder = "חיפוש..." }: SearchBarProps) {
  const handleClear = () => {
    onChangeText('');
  };

  return (
    <View style={styles.container}>
      <Search size={20} color={colors.muted} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        textAlign="right"
      />
      {value.length > 0 && (
        <Pressable onPress={handleClear} style={styles.clearButton}>
          <X size={18} color={colors.muted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
    color: colors.text,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  }
});