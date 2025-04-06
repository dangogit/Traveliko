import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView, 
  Pressable,
  Alert
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useTripStore } from '@/store/trip-store';
import { useTravelStore } from '@/store/travel-store';
import colors from '@/constants/colors';
import { 
  Calendar, 
  DollarSign, 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2,
  ChevronLeft
} from 'lucide-react-native';
import TripDayCard from '@/components/TripDayCard';
import EmptyState from '@/components/EmptyState';
import BackButton from '@/components/BackButton';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { 
    getTripById, 
    getTripDaysByTripId, 
    getTripActivitiesByDayId,
    deleteTrip
  } = useTripStore();
  const { getCountryById } = useTravelStore();
  
  const trip = getTripById(id);
  const tripDays = getTripDaysByTripId(id);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  const getDuration = () => {
    if (!trip) return 0;
    
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const getCountriesText = () => {
    if (!trip) return '';
    
    return trip.countries
      .map(countryId => {
        const country = getCountryById(countryId);
        return country ? country.nameHe : '';
      })
      .filter(name => name)
      .join(', ');
  };
  
  const getTripStatus = () => {
    if (!trip) return { label: '', color: '' };
    
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
  
  const handleAddDay = () => {
    router.push({
      pathname: '/add-trip-day',
      params: { tripId: id }
    });
  };
  
  const handleEditTrip = () => {
    router.push({
      pathname: '/edit-trip',
      params: { tripId: id }
    });
  };
  
  const handleDeleteTrip = () => {
    Alert.alert(
      "מחיקת טיול",
      "האם אתה בטוח שברצונך למחוק את הטיול? פעולה זו אינה הפיכה.",
      [
        { text: "ביטול", style: "cancel" },
        { 
          text: "מחק", 
          style: "destructive",
          onPress: () => {
            deleteTrip(id);
            router.replace('/trips');
          }
        }
      ]
    );
  };
  
  if (!trip) {
    return (
      <EmptyState 
        title="טיול לא נמצא"
        message="הטיול המבוקש לא נמצא"
        icon={<Calendar size={48} color={colors.muted} />}
      />
    );
  }
  
  const status = getTripStatus();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: trip.name,
        headerLeft: () => <BackButton />,
      }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
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
          
          {trip.budget && (
            <View style={styles.budgetContainer}>
              <DollarSign size={16} color={colors.primary} />
              <Text style={styles.budgetText}>תקציב: {trip.budget}</Text>
            </View>
          )}
          
          {trip.description && (
            <Text style={styles.description}>{trip.description}</Text>
          )}
        </View>
        
        <View style={styles.daysSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>לוח זמנים</Text>
            <Pressable style={styles.addButton} onPress={handleAddDay}>
              <Text style={styles.addButtonText}>הוסף יום</Text>
              <Plus size={16} color={colors.primary} />
            </Pressable>
          </View>
          
          {tripDays.length === 0 ? (
            <EmptyState 
              title="אין ימים מתוכננים"
              message="לחץ על 'הוסף יום' כדי להתחיל לתכנן את הטיול שלך"
              icon={<Calendar size={36} color={colors.muted} />}
            />
          ) : (
            tripDays.map(day => (
              <TripDayCard 
                key={day.id} 
                day={day} 
                activities={getTripActivitiesByDayId(day.id)} 
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  header: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
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
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  description: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'right',
  },
  daysSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  addButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    marginRight: 4,
  }
});