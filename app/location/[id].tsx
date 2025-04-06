import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { useLocalSearchParams, Stack, useRouter, useNavigation } from 'expo-router';
import { useTravelStore } from '@/store/travel-store';
import { useProfileStore } from '@/store/profile-store';
import { useWeatherStore } from '@/store/weather-store';
import RecommendationCard from '@/components/RecommendationCard';
import FilterTabs from '@/components/FilterTabs';
import colors from '@/constants/colors';
import { Image } from 'expo-image';
import EmptyState from '@/components/EmptyState';
import { MapPin, Cloud, CloudSun, CloudRain, CloudSnow, Sun } from 'lucide-react-native';
import { Season } from '@/types/travel';
import { useTripStore } from '@/store/trip-store';
import BackButton from '@/components/BackButton';

export default function LocationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('all');
  const { getLocationById, getRecommendationsByLocation, getCountryById } = useTravelStore();
  const { profile } = useProfileStore();
  const { getWeatherForLocation } = useWeatherStore();

  const location = getLocationById(id);
  const country = location ? getCountryById(location.countryId) : null;
  const weatherData = getWeatherForLocation(id);
  
  // Determine current season based on month
  const getCurrentSeason = (): Season => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  };
  
  const currentSeason = getCurrentSeason();
  
  const allRecommendations = location ? 
    getRecommendationsByLocation(
      id, 
      activeTab === 'all' ? undefined : activeTab as any,
      profile.isProfileComplete ? profile.travelerType : undefined,
      currentSeason
    ) : [];

  const tabs = [
    { id: 'all', label: 'הכל' },
    { id: 'hotel', label: 'מלונות' },
    { id: 'hostel', label: 'הוסטלים' },
    { id: 'restaurant', label: 'מסעדות' },
    { id: 'activity', label: 'פעילויות' }
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleWeatherPress = () => {
    if (location) {
      router.push(`/weather/${location.id}`);
    }
  };

  const handleAddToTrip = () => {
    router.push({
      pathname: '/add-to-trip',
      params: { locationId: id }
    });
  };

  useEffect(() => {
    if (location) {
      navigation.setOptions({
        title: location.name,
      });
    }
  }, [navigation, location]);

  if (!location) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ 
          title: "מיקום לא נמצא",
          headerLeft: () => <BackButton />,
        }} />
        <EmptyState 
          title="מיקום לא נמצא"
          message="המיקום שחיפשת לא נמצא במערכת"
          icon={<MapPin size={48} color={colors.muted} />}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: location.nameHe,
        headerLeft: () => <BackButton />,
      }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image 
          source={{ uri: location.image }}
          style={styles.coverImage}
          contentFit="cover"
        />
        
        <View style={styles.locationHeader}>
          <View style={styles.locationInfo}>
            <Text style={styles.locationName}>{location.nameHe}</Text>
            <View style={styles.locationMeta}>
              <MapPin size={16} color={colors.primary} />
              <Text style={styles.locationCountry}>{country?.nameHe}</Text>
            </View>
          </View>
          
          <Pressable style={styles.addButton} onPress={handleAddToTrip}>
            <Text style={styles.addButtonText}>הוסף לטיול</Text>
          </Pressable>
        </View>
        
        <Text style={styles.description}>{location.description}</Text>
        
        <Pressable style={styles.weatherCard} onPress={handleWeatherPress}>
          <View style={styles.weatherHeader}>
            <Text style={styles.weatherTitle}>מזג אוויר</Text>
            <Text style={styles.weatherMore}>לפרטים נוספים</Text>
          </View>
          
          <View style={styles.weatherContent}>
            {weatherData ? (
              <>
                <View style={styles.weatherMain}>
                  {weatherData.current.condition === 'sunny' && <Sun size={32} color={colors.text} />}
                  {weatherData.current.condition === 'cloudy' && <Cloud size={32} color={colors.text} />}
                  {weatherData.current.condition === 'partly-cloudy' && <CloudSun size={32} color={colors.text} />}
                  {weatherData.current.condition === 'rainy' && <CloudRain size={32} color={colors.text} />}
                  {weatherData.current.condition === 'snowy' && <CloudSnow size={32} color={colors.text} />}
                  <Text style={styles.temperature}>{weatherData.current.temperature}°</Text>
                </View>
                
                <View style={styles.weatherDetails}>
                  <View style={styles.weatherDetail}>
                    <Text style={styles.weatherLabel}>לחות</Text>
                    <Text style={styles.weatherValue}>{weatherData.current.humidity}%</Text>
                  </View>
                  <View style={styles.weatherDetail}>
                    <Text style={styles.weatherLabel}>רוח</Text>
                    <Text style={styles.weatherValue}>{weatherData.current.windSpeed} קמ"ש</Text>
                  </View>
                  <View style={styles.weatherDetail}>
                    <Text style={styles.weatherLabel}>עונה</Text>
                    <Text style={styles.weatherValue}>{
                      currentSeason === 'winter' ? 'חורף' :
                      currentSeason === 'spring' ? 'אביב' :
                      currentSeason === 'summer' ? 'קיץ' : 'סתיו'
                    }</Text>
                  </View>
                </View>
              </>
            ) : (
              <Text style={styles.noWeatherData}>אין נתוני מזג אוויר זמינים</Text>
            )}
          </View>
        </Pressable>
        
        <View style={styles.recommendationsSection}>
          <Text style={styles.sectionTitle}>המלצות</Text>
          
          <FilterTabs 
            tabs={tabs} 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
          />
          
          {allRecommendations.length > 0 ? (
            <View style={styles.recommendationsList}>
              {allRecommendations.map(recommendation => (
                <RecommendationCard 
                  key={recommendation.id} 
                  recommendation={recommendation} 
                />
              ))}
            </View>
          ) : (
            <EmptyState 
              title="אין המלצות"
              message="לא נמצאו המלצות עבור הקטגוריה הזו"
              icon={<MapPin size={32} color={colors.muted} />}
            />
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
    paddingBottom: 24,
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  locationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationCountry: {
    fontSize: 16,
    color: colors.muted,
    marginLeft: 4,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  weatherCard: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weatherTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  weatherMore: {
    fontSize: 14,
    color: colors.primary,
  },
  weatherContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  temperature: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  weatherDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weatherDetail: {
    alignItems: 'center',
  },
  weatherLabel: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 4,
  },
  weatherValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  noWeatherData: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'center',
    flex: 1,
    padding: 16,
  },
  recommendationsSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  recommendationsList: {
    marginTop: 16,
    gap: 16,
  },
});