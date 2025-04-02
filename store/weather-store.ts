import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherInfo, WeatherRecommendation } from '@/types/travel';
import { weatherRecommendations } from '@/mocks/weather-recommendations';

interface WeatherState {
  // Weather data
  weatherData: WeatherInfo[];
  
  // Actions
  setWeatherData: (locationId: string, data: Omit<WeatherInfo, 'locationId'>) => void;
  getWeatherForLocation: (locationId: string) => WeatherInfo | undefined;
  getRecommendationForWeather: (condition: string) => WeatherRecommendation | undefined;
  clearWeatherData: () => void;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      // Weather data
      weatherData: [],
      
      // Actions
      setWeatherData: (locationId, data) => {
        const currentData = get().weatherData;
        const existingIndex = currentData.findIndex(w => w.locationId === locationId);
        
        if (existingIndex >= 0) {
          // Update existing weather data
          const updatedData = [...currentData];
          updatedData[existingIndex] = {
            locationId,
            ...data
          };
          set({ weatherData: updatedData });
        } else {
          // Add new weather data
          set({ 
            weatherData: [
              ...currentData,
              {
                locationId,
                ...data
              }
            ] 
          });
        }
      },
      
      getWeatherForLocation: (locationId) => {
        return get().weatherData.find(w => w.locationId === locationId);
      },
      
      getRecommendationForWeather: (condition) => {
        const lowerCondition = condition.toLowerCase();
        return weatherRecommendations.find(r => 
          lowerCondition.includes(r.condition.toLowerCase())
        );
      },
      
      clearWeatherData: () => set({ weatherData: [] }),
    }),
    {
      name: 'weather-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        weatherData: state.weatherData
      })
    }
  )
);