import { Stack } from 'expo-router';
import { I18nManager } from 'react-native';
import { useEffect } from 'react';
import colors from '@/constants/colors';

// Force RTL layout for the entire app
if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

export default function CreateTripLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: 'white',
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
          textAlign: 'center',
          color: colors.text,
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: colors.background,
        },
        headerBackVisible: false,
        // Ensure proper RTL layout for navigation
        headerLayoutPreset: 'center',
        presentation: 'card',
      }}
    >
      <Stack.Screen name="index" options={{ 
        headerTitle: "צור טיול חדש",
      }} />
      <Stack.Screen name="start-point" options={{ 
        headerTitle: "נקודת התחלה",
      }} />
      <Stack.Screen name="visit-countries" options={{ 
        headerTitle: "מדינות לביקור",
      }} />
      <Stack.Screen name="end-point" options={{ 
        headerTitle: "יעד סופי",
      }} />
      <Stack.Screen name="preferences" options={{ 
        headerTitle: "העדפות",
      }} />
      <Stack.Screen name="summary" options={{ 
        headerTitle: "סיכום",
      }} />
    </Stack>
  );
}