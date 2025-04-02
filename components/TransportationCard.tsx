import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Transportation } from '@/types/travel';
import { useTravelStore } from '@/store/travel-store';
import { Plane, Train, Bus, Ship, ExternalLink } from 'lucide-react-native';
import colors from '@/constants/colors';
import { Linking } from 'react-native';

interface TransportationCardProps {
  transportation: Transportation;
}

export default function TransportationCard({ transportation }: TransportationCardProps) {
  const { getCountryById } = useTravelStore();
  
  const fromCountry = getCountryById(transportation.fromCountryId);
  const toCountry = getCountryById(transportation.toCountryId);
  
  const getTransportIcon = () => {
    switch (transportation.type) {
      case 'flight':
        return <Plane size={24} color={colors.primary} />;
      case 'train':
        return <Train size={24} color={colors.primary} />;
      case 'bus':
        return <Bus size={24} color={colors.primary} />;
      case 'ferry':
        return <Ship size={24} color={colors.primary} />;
      default:
        return <Plane size={24} color={colors.primary} />;
    }
  };
  
  const handleWebsitePress = () => {
    if (transportation.website) {
      Linking.openURL(transportation.website);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{transportation.nameHe}</Text>
          <Text style={styles.route}>
            {fromCountry?.nameHe || ''} → {toCountry?.nameHe || ''}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          {getTransportIcon()}
        </View>
      </View>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>משך זמן:</Text>
          <Text style={styles.detailValue}>{transportation.duration}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>מחיר:</Text>
          <Text style={styles.detailValue}>{transportation.priceRange}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>תדירות:</Text>
          <Text style={styles.detailValue}>{transportation.frequency}</Text>
        </View>
      </View>
      
      <Text style={styles.description}>{transportation.description}</Text>
      
      {transportation.tips && (
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsLabel}>טיפים:</Text>
          <Text style={styles.tipsText}>{transportation.tips}</Text>
        </View>
      )}
      
      {transportation.website && (
        <Pressable style={styles.websiteButton} onPress={handleWebsitePress}>
          <Text style={styles.websiteButtonText}>בקר באתר</Text>
          <ExternalLink size={16} color="white" />
        </Pressable>
      )}
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
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
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
  route: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'right',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    textAlign: 'right',
    lineHeight: 20,
  },
  tipsContainer: {
    backgroundColor: colors.highlight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  tipsLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'right',
  },
  tipsText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'right',
    lineHeight: 20,
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