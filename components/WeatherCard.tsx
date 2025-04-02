import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { WeatherInfo, WeatherRecommendation } from '@/types/travel';
import { Cloud, CloudRain, CloudSnow, CloudSun, Sun, Wind, Umbrella } from 'lucide-react-native';
import colors from '@/constants/colors';

interface WeatherCardProps {
  weather: WeatherInfo;
  recommendation?: WeatherRecommendation;
  onPress?: () => void;
}

export default function WeatherCard({ weather, recommendation, onPress }: WeatherCardProps) {
  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) {
      return <View><Sun size={24} color={colors.secondary} /></View>;
    } else if (lowerCondition.includes('partly cloudy') || lowerCondition.includes('cloudy')) {
      return <View><CloudSun size={24} color={colors.secondary} /></View>;
    } else if (lowerCondition.includes('overcast')) {
      return <View><Cloud size={24} color={colors.muted} /></View>;
    } else if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
      return <View><CloudRain size={24} color={colors.primary} /></View>;
    } else if (lowerCondition.includes('snow')) {
      return <View><CloudSnow size={24} color={colors.primary} /></View>;
    } else if (lowerCondition.includes('wind') || lowerCondition.includes('gust')) {
      return <View><Wind size={24} color={colors.muted} /></View>;
    } else {
      return <View><Umbrella size={24} color={colors.muted} /></View>;
    }
  };

  return (
    <Pressable 
      style={styles.container}
      onPress={onPress}
      android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
    >
      <View style={styles.header}>
        <View style={styles.weatherInfo}>
          <Text style={styles.temperature}>{weather.current.temperature}°C</Text>
          <Text style={styles.condition}>{weather.current.condition}</Text>
        </View>
        {getWeatherIcon(weather.current.condition)}
      </View>
      
      {recommendation && (
        <View style={styles.recommendationContainer}>
          <Text style={styles.recommendationText}>{recommendation.recommendation}</Text>
        </View>
      )}
      
      <View style={styles.forecastContainer}>
        {weather.forecast.slice(0, 3).map((day, index) => (
          <View key={index} style={styles.forecastDay}>
            <Text style={styles.forecastDate}>
              {new Date(day.date).toLocaleDateString('he-IL', { weekday: 'short' })}
            </Text>
            {getWeatherIcon(day.condition)}
            <Text style={styles.forecastTemp}>{day.minTemp}° - {day.maxTemp}°</Text>
          </View>
        ))}
      </View>
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
  weatherInfo: {
    flex: 1,
  },
  temperature: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'right',
  },
  condition: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'right',
  },
  recommendationContainer: {
    backgroundColor: colors.highlight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'right',
  },
  forecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastDay: {
    alignItems: 'center',
    flex: 1,
  },
  forecastDate: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  forecastTemp: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
  }
});