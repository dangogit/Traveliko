import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Trip } from '@/types/travel';
import { useTravelStore } from '@/store/travel-store';
import { Calendar, MapPin } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useRouter } from 'expo-router';

interface TripCardProps {
  trip: Trip;
}

export default function TripCard({ trip }: TripCardProps) {
  const router = useRouter();
  const { getCountryById } = useTravelStore();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  const getDuration = () => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const getCountriesText = () => {
    return trip.countries
      .map(countryId => {
        const country = getCountryById(countryId);
        return country ? country.nameHe : '';
      })
      .filter(name => name)
      .join(', ');
  };
  
  const getTripStatus = () => {
    const now = new Date();
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    
    if (now < start) {
      return { label: 'עתידי', color: colors.primary };
    } else if (now > end) {
      return { label: 'הסתיים', color: colors.muted };
    } else {
      return { label: 'פעיל', color: colors.success };
    }
  };
  
  const status = getTripStatus();
  
  const handlePress = () => {
    router.push(`/trip/${trip.id}`);
  };

  return (
    <Pressable 
      style={styles.container} 
      onPress={handlePress}
      android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{trip.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
          <Text style={styles.statusText}>{status.label}</Text>
        </View>
      </View>
      
      <View style={styles.dateContainer}>
        <Calendar size={16} color={colors.primary} />
        <Text style={styles.dateText}>
          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
        </Text>
      </View>
      
      <View style={styles.durationContainer}>
        <Text style={styles.durationText}>{getDuration()} ימים</Text>
      </View>
      
      <View style={styles.countriesContainer}>
        <MapPin size={16} color={colors.primary} />
        <Text style={styles.countriesText}>{getCountriesText()}</Text>
      </View>
      
      {trip.description && (
        <Text style={styles.description}>{trip.description}</Text>
      )}
    </Pressable>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    textAlign: 'right',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  durationContainer: {
    marginBottom: 8,
  },
  durationText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  countriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  countriesText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'right',
  }
});