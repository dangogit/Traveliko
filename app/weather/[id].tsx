import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useWeatherStore } from '@/store/weather-store';
import { useTravelStore } from '@/store/travel-store';
import colors from '@/constants/colors';
import WeatherCard from '@/components/WeatherCard';
import WeatherActivitiesList from '@/components/WeatherActivitiesList';
import { WeatherInfo } from '@/types/travel';
import { Cloud, CloudOff } from 'lucide-react-native';
import EmptyState from '@/components/EmptyState';

// Mock weather data for demo purposes
const mockWeatherData = (locationId: string): WeatherInfo => ({
  locationId,
  current: {
    temperature: Math.floor(Math.random() * 15) + 15, // 15-30°C
    condition: ['Sunny', 'Partly cloudy', 'Cloudy', 'Light rain', 'Clear'][Math.floor(Math.random() * 5)],
    icon: 'sun',
    humidity: Math.floor(Math.random() * 30) + 50, // 50-80%
    windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
  },
  forecast: [
    {
      date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
      minTemp: Math.floor(Math.random() * 5) + 15, // 15-20°C
      maxTemp: Math.floor(Math.random() * 10) + 20, // 20-30°C
      condition: ['Sunny', 'Partly cloudy', 'Cloudy', 'Light rain', 'Clear'][Math.floor(Math.random() * 5)],
      icon: 'sun',
    },
    {
      date: new Date(Date.now() + 172800000).toISOString(), // day after tomorrow
      minTemp: Math.floor(Math.random() * 5) + 15, // 15-20°C
      maxTemp: Math.floor(Math.random() * 10) + 20, // 20-30°C
      condition: ['Sunny', 'Partly cloudy', 'Cloudy', 'Light rain', 'Clear'][Math.floor(Math.random() * 5)],
      icon: 'cloud',
    },
    {
      date: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
      minTemp: Math.floor(Math.random() * 5) + 15, // 15-20°C
      maxTemp: Math.floor(Math.random() * 10) + 20, // 20-30°C
      condition: ['Sunny', 'Partly cloudy', 'Cloudy', 'Light rain', 'Clear'][Math.floor(Math.random() * 5)],
      icon: 'cloud-rain',
    },
    {
      date: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
      minTemp: Math.floor(Math.random() * 5) + 15, // 15-20°C
      maxTemp: Math.floor(Math.random() * 10) + 20, // 20-30°C
      condition: ['Sunny', 'Partly cloudy', 'Cloudy', 'Light rain', 'Clear'][Math.floor(Math.random() * 5)],
      icon: 'sun',
    },
    {
      date: new Date(Date.now() + 432000000).toISOString(), // 5 days from now
      minTemp: Math.floor(Math.random() * 5) + 15, // 15-20°C
      maxTemp: Math.floor(Math.random() * 10) + 20, // 20-30°C
      condition: ['Sunny', 'Partly cloudy', 'Cloudy', 'Light rain', 'Clear'][Math.floor(Math.random() * 5)],
      icon: 'cloud',
    },
  ],
  lastUpdated: Date.now(),
});

export default function WeatherScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  
  const { 
    getWeatherForLocation, 
    setWeatherData, 
    getRecommendationForWeather 
  } = useWeatherStore();
  
  const { getLocationById, getCountryById } = useTravelStore();
  
  const location = getLocationById(id);
  const country = location ? getCountryById(location.countryId) : null;
  
  useEffect(() => {
    // Simulate API call to get weather data
    const fetchWeather = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch from a weather API
        // For demo, we'll use mock data
        setTimeout(() => {
          const weatherData = mockWeatherData(id);
          setWeatherData(id, {
            current: weatherData.current,
            forecast: weatherData.forecast,
            lastUpdated: Date.now()
          });
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setLoading(false);
      }
    };

    fetchWeather();
  }, [id]);

  const weatherData = getWeatherForLocation(id);
  const weatherRecommendation = weatherData 
    ? getRecommendationForWeather(weatherData.current.condition)
    : undefined;

  if (!location) {
    return (
      <EmptyState 
        title="מיקום לא נמצא"
        message="המיקום המבוקש לא נמצא"
        icon={<CloudOff size={48} color={colors.muted} />}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: `מזג אוויר ב${location.nameHe}`,
      }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{location.nameHe}</Text>
          {country && (
            <Text style={styles.subtitle}>{country.nameHe}</Text>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>טוען נתוני מזג אוויר...</Text>
          </View>
        ) : weatherData ? (
          <>
            <WeatherCard 
              weather={weatherData} 
              recommendation={weatherRecommendation}
            />
            
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>לחות</Text>
                <Text style={styles.infoValue}>{weatherData.current.humidity}%</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>רוח</Text>
                <Text style={styles.infoValue}>{weatherData.current.windSpeed} קמ"ש</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>עדכון אחרון</Text>
                <Text style={styles.infoValue}>
                  {new Date(weatherData.lastUpdated).toLocaleTimeString('he-IL', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
              </View>
            </View>
            
            {weatherRecommendation && (
              <WeatherActivitiesList recommendation={weatherRecommendation} />
            )}
            
            <View style={styles.forecastContainer}>
              <Text style={styles.forecastTitle}>תחזית 5 ימים</Text>
              {weatherData.forecast.map((day, index) => (
                <View key={index} style={styles.forecastDay}>
                  <Text style={styles.forecastDate}>
                    {new Date(day.date).toLocaleDateString('he-IL', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </Text>
                  <View style={styles.forecastDetails}>
                    <Text style={styles.forecastCondition}>{day.condition}</Text>
                    <Text style={styles.forecastTemp}>{day.minTemp}° - {day.maxTemp}°</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : (
          <EmptyState 
            title="אין נתוני מזג אוויר"
            message="לא ניתן לטעון את נתוני מזג האוויר כרגע. נסה שוב מאוחר יותר."
            icon={<Cloud size={48} color={colors.muted} />}
          />
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
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'right',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.muted,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  forecastContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  forecastTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'right',
  },
  forecastDay: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 12,
  },
  forecastDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'right',
  },
  forecastDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastCondition: {
    fontSize: 14,
    color: colors.muted,
  },
  forecastTemp: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  }
});