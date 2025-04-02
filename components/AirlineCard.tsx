import React from 'react';
import { StyleSheet, Text, View, Pressable, Linking } from 'react-native';
import { Image } from 'expo-image';
import { Airline } from '@/types/travel';
import { Star, ExternalLink, Globe } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useTravelStore } from '@/store/travel-store';

interface AirlineCardProps {
  airline: Airline;
}

export default function AirlineCard({ airline }: AirlineCardProps) {
  const { getCountryById } = useTravelStore();
  
  const handleWebsitePress = () => {
    if (airline.website) {
      Linking.openURL(airline.website);
    }
  };

  // Get country names from IDs
  const countryNames = airline.servesCountries
    .map(id => {
      const country = getCountryById(id);
      return country ? country.nameHe : '';
    })
    .filter(name => name !== '');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: airline.logo }}
            style={styles.logo}
            contentFit="cover"
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{airline.nameHe}</Text>
          <View style={styles.ratingContainer}>
            <Star size={16} color={colors.secondary} fill={colors.secondary} />
            <Text style={styles.rating}>{airline.rating.toFixed(1)}</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.description}>{airline.description}</Text>
      
      {airline.alliance && (
        <View style={styles.allianceContainer}>
          <Text style={styles.allianceLabel}>ברית תעופה:</Text>
          <Text style={styles.allianceValue}>{airline.alliance}</Text>
        </View>
      )}
      
      <View style={styles.countriesContainer}>
        <Text style={styles.countriesLabel}>משרתת את המדינות:</Text>
        <Text style={styles.countriesValue}>
          {countryNames.length > 0 ? countryNames.join(', ') : 'לא זמין'}
        </Text>
      </View>
      
      <Pressable style={styles.websiteButton} onPress={handleWebsitePress}>
        <Text style={styles.websiteButtonText}>בקר באתר</Text>
        <ExternalLink size={16} color="white" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginLeft: 12,
    backgroundColor: colors.highlight,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'right',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    textAlign: 'right',
    lineHeight: 20,
  },
  allianceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  allianceLabel: {
    fontSize: 14,
    color: colors.muted,
    marginLeft: 4,
  },
  allianceValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  countriesContainer: {
    marginBottom: 16,
  },
  countriesLabel: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 4,
    textAlign: 'right',
  },
  countriesValue: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'right',
  },
  websiteButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  websiteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8,
  }
});