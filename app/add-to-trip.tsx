import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView, 
  Pressable,
  Alert,
  TextInput
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useTripStore } from '@/store/trip-store';
import { useTravelStore } from '@/store/travel-store';
import colors from '@/constants/colors';
import { Calendar, MapPin, Check } from 'lucide-react-native';
import EmptyState from '@/components/EmptyState';
import BackButton from '@/components/BackButton';

export default function AddToTripScreen() {
  const { locationId, countryId } = useLocalSearchParams<{ locationId?: string, countryId?: string }>();
  const router = useRouter();
  const { 
    trips, 
    getUpcomingTrips, 
    getCurrentTrip,
    createTripDay
  } = useTripStore();
  const { getLocationById, getCountryById, getLocationsByCountry } = useTravelStore();
  
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  
  const location = locationId ? getLocationById(locationId) : null;
  const country = countryId ? getCountryById(countryId) : null;
  
  // Get available trips (current and upcoming)
  const availableTrips = [...(getCurrentTrip() ? [getCurrentTrip()!] : []), ...getUpcomingTrips()];
  
  // If we have a country but no location, get all locations in that country
  const countryLocations = countryId ? getLocationsByCountry(countryId) : [];
  
  useEffect(() => {
    // If there's only one trip, select it by default
    if (availableTrips.length === 1) {
      setSelectedTripId(availableTrips[0].id);
    }
    
    // Set default date to today
    const today = new Date();
    setSelectedDate(today.toISOString().split('T')[0]);
  }, []);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };
  
  const handleAddToTrip = () => {
    if (!selectedTripId) {
      Alert.alert('שגיאה', 'יש לבחור טיול');
      return;
    }
    
    if (!selectedDate) {
      Alert.alert('שגיאה', 'יש לבחור תאריך');
      return;
    }
    
    if (!locationId && !countryId) {
      Alert.alert('שגיאה', 'לא נבחר מיקום או מדינה');
      return;
    }
    
    if (locationId) {
      // Add a single location to the trip
      const dayId = createTripDay({
        tripId: selectedTripId,
        date: selectedDate,
        locationId,
      });
      
      Alert.alert(
        'נוסף בהצלחה',
        `${location?.nameHe || 'המיקום'} נוסף לטיול בהצלחה`,
        [
          { 
            text: 'הוסף פעילויות', 
            onPress: () => router.push(`/trip-day/${dayId}`)
          },
          { 
            text: 'חזור לטיול', 
            onPress: () => router.push(`/trip/${selectedTripId}`)
          }
        ]
      );
    } else if (countryId && countryLocations.length > 0) {
      // Show options for adding multiple locations from the country
      Alert.alert(
        'הוסף מיקומים',
        `האם ברצונך להוסיף את כל המיקומים ב${country?.nameHe || 'מדינה'} לטיול?`,
        [
          { text: 'ביטול', style: 'cancel' },
          { 
            text: 'הוסף הכל', 
            onPress: () => {
              // Add all locations with consecutive dates
              let currentDate = new Date(selectedDate);
              
              countryLocations.forEach((location, index) => {
                const dateString = new Date(
                  currentDate.getTime() + (index * 24 * 60 * 60 * 1000)
                ).toISOString().split('T')[0];
                
                createTripDay({
                  tripId: selectedTripId,
                  date: dateString,
                  locationId: location.id,
                });
              });
              
              Alert.alert(
                'נוסף בהצלחה',
                `${countryLocations.length} מיקומים נוספו לטיול בהצלחה`,
                [
                  { 
                    text: 'חזור לטיול', 
                    onPress: () => router.push(`/trip/${selectedTripId}`)
                  }
                ]
              );
            }
          },
          {
            text: 'בחר מיקום',
            onPress: () => {
              router.push({
                pathname: '/select-location',
                params: { 
                  countryId,
                  tripId: selectedTripId,
                  date: selectedDate
                }
              });
            }
          }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: "הוסף לטיול",
        headerLeft: () => <BackButton />,
      }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>בחר טיול</Text>
          
          {availableTrips.length === 0 ? (
            <EmptyState 
              title="אין טיולים זמינים"
              message="צור טיול חדש כדי להוסיף אליו מיקומים"
              icon={<Calendar size={36} color={colors.muted} />}
            />
          ) : (
            availableTrips.map(trip => (
              <Pressable
                key={trip.id}
                style={[
                  styles.tripItem,
                  selectedTripId === trip.id && styles.selectedTripItem
                ]}
                onPress={() => setSelectedTripId(trip.id)}
              >
                <View style={styles.tripInfo}>
                  <Text style={styles.tripName}>{trip.name}</Text>
                  <Text style={styles.tripDate}>
                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                  </Text>
                </View>
                {selectedTripId === trip.id && (
                  <Check size={20} color={colors.primary} />
                )}
              </Pressable>
            ))
          )}
        </View>
        
        {selectedTripId && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>בחר תאריך</Text>
            <View style={styles.dateInputContainer}>
              <Calendar size={20} color={colors.primary} />
              <TextInput
                style={styles.dateInput}
                value={selectedDate}
                onChangeText={handleDateChange}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.muted}
                textAlign="right"
              />
            </View>
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>מיקום</Text>
          
          {locationId && location ? (
            <View style={styles.locationItem}>
              <MapPin size={20} color={colors.primary} />
              <Text style={styles.locationName}>{location.nameHe}</Text>
            </View>
          ) : countryId && country ? (
            <View>
              <View style={styles.locationItem}>
                <MapPin size={20} color={colors.primary} />
                <Text style={styles.locationName}>{country.nameHe}</Text>
              </View>
              <Text style={styles.helperText}>
                {countryLocations.length} מיקומים זמינים במדינה זו
              </Text>
            </View>
          ) : (
            <EmptyState 
              title="לא נבחר מיקום"
              message="חזור ובחר מיקום או מדינה להוספה לטיול"
              icon={<MapPin size={36} color={colors.muted} />}
            />
          )}
        </View>
        
        {selectedTripId && (locationId || countryId) && (
          <Pressable style={styles.submitButton} onPress={handleAddToTrip}>
            <Text style={styles.submitButtonText}>הוסף לטיול</Text>
          </Pressable>
        )}
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
  addButton: {
    padding: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'right',
  },
  tripItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedTripItem: {
    borderColor: colors.primary,
  },
  tripInfo: {
    flex: 1,
  },
  tripName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'right',
  },
  tripDate: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
    textAlign: 'right',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  locationName: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  helperText: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 8,
    textAlign: 'right',
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});