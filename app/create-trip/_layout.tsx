import { Stack } from 'expo-router';
import React from 'react';
import colors from '@/constants/colors';
import HeaderRight from '@/components/HeaderRight';

export default function CreateTripLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
        headerRight: () => <HeaderRight />,
        presentation: 'card',
        animation: 'slide_from_right',
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