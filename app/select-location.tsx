import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView, 
  Pressable,
  TextInput
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useTripStore } from '@/store/trip-store';
import { useTravelStore } from '@/store/travel-store';
import colors from '@/constants/colors';
import { Search, MapPin, Check } from 'lucide-react-native';
import { Location } from '@/types/travel';

export default function SelectLocationScreen() {
  const { countryId, tripId, date } = useLocalSearchParams<{ 
    countryId: string, 
    tripId: string,
    date: string
  }>();
  const router = useRouter();
  const { createTripDay } = useTripStore();
  const { getLocationsByCountry, getCountryById } = useTravelStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  
  const country = countryId ? getCountryById(countryId) : null;
  const locations = countryId ? getLocationsByCountry(countryId) : [];
  
  // Filter locations based on search query
  const filteredLocations = locations.filter(location => 
    location.nameHe.includes(searchQuery) || 
    location.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.description.includes(searchQuery)
  );
  
  const handleAddLocation = () => {
    if (!selectedLocationId || !tripId || !date) return;
    
    const dayId = createTripDay({
      tripId,
      date,
      locationId: selectedLocationId,
    });
    
    router.replace(`/trip-day/${dayId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: "בחר מיקום",
        headerRight: () => (
          selectedLocationId ? (
            <Pressable onPress={handleAddLocation} style={styles.addButton}>
              <Check size={24} color={colors.primary} />
            </Pressable>
          ) : null
        )
      }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {country && (
          <View style={styles.countryHeader}>
            <Text style={styles.countryName}>{country.nameHe}</Text>
            <Text style={styles.countryDescription}>בחר מיקום מתוך {locations.length} מיקומים זמינים</Text>
          </View>
        )}
        
        <View style={styles.searchContainer}>
          <Search size={20} color={colors.muted} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="חפש מיקום..."
            placeholderTextColor={colors.muted}
            textAlign="right"
          />
        </View>
        
        <View style={styles.locationsContainer}>
          {filteredLocations.map((location: Location) => (
            <Pressable
              key={location.id}
              style={[
                styles.locationItem,
                selectedLocationId === location.id && styles.selectedLocationItem
              ]}
              onPress={() => setSelectedLocationId(location.id)}
            >
              <View style={styles.locationInfo}>
                <Text style={styles.locationName}>{location.nameHe}</Text>
                <Text style={styles.locationDuration}>
                  משך שהייה מומלץ: {location.recommendedDuration} ימים
                </Text>
              </View>
              <View style={styles.locationIconContainer}>
                <MapPin size={20} color={colors.primary} />
                {selectedLocationId === location.id && (
                  <View style={styles.checkIndicator}>
                    <Check size={16} color="white" />
                  </View>
                )}
              </View>
            </Pressable>
          ))}
          
          {filteredLocations.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                לא נמצאו מיקומים התואמים לחיפוש
              </Text>
            </View>
          )}
        </View>
        
        {selectedLocationId && (
          <Pressable style={styles.addLocationButton} onPress={handleAddLocation}>
            <Text style={styles.addLocationButtonText}>הוסף מיקום לטיול</Text>
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
  countryHeader: {
    marginBottom: 20,
  },
  countryName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'right',
  },
  countryDescription: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'right',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  locationsContainer: {
    marginBottom: 20,
  },
  locationItem: {
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
  selectedLocationItem: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'right',
  },
  locationDuration: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'right',
    marginTop: 4,
  },
  locationIconContainer: {
    position: 'relative',
  },
  checkIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
  },
  addLocationButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  addLocationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});