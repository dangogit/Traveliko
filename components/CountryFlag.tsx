import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface CountryFlagProps {
  countryCode: string;
  size?: number;
  style?: any;
}

/**
 * Component that displays a country flag based on country code
 */
export default function CountryFlag({ countryCode, size = 24, style }: CountryFlagProps) {
  // Generate flag URL based on country code
  const getFlagUrl = (code: string): string => {
    return `https://flagcdn.com/w80/${code.toLowerCase()}.png`;
  };

  return (
    <View style={[styles.container, style]}>
      <Image
        source={{ uri: getFlagUrl(countryCode) }}
        style={[
          styles.flagImage,
          { width: size * 1.5, height: size }
        ]}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 4,
  },
  flagImage: {
    width: 36,
    height: 24,
  }
}); 