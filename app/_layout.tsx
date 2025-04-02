import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments, Stack } from 'expo-router';
import { useProfileStore } from '@/store/profile-store';
import { I18nManager, StyleSheet } from 'react-native';
import HeaderRight from '@/components/HeaderRight';
import colors from '@/constants/colors';

// Force RTL layout for Hebrew
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

export default function RootLayout() {
  const { profile } = useProfileStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Skip redirection in development mode when segments are empty
    if (!segments || segments.length <= 0) return;
    
    // Only redirect if we're on index and not already redirecting to onboarding/profile-setup
    if (segments[0] !== 'onboarding' && segments[0] !== 'profile-setup') {
      // If user hasn't seen onboarding, redirect to onboarding
      if (!profile.hasSeenOnboarding) {
        router.replace('/onboarding');
        return;
      }
      
      // If user has seen onboarding but hasn't completed profile setup, redirect to profile setup
      if (profile.hasSeenOnboarding && !profile.isProfileComplete) {
        router.replace('/profile-setup');
        return;
      }
    }
  }, [profile.hasSeenOnboarding, profile.isProfileComplete, segments]);

  // Determine initial route
  const initialRoute = profile.hasSeenOnboarding 
    ? (profile.isProfileComplete ? 'index' : 'profile-setup') 
    : 'onboarding';

  return (
    <Stack
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: true,
        headerRight: () => <HeaderRight />,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen name="index" options={{ 
        headerTitle: "מדריך טיולים",
      }} />
      <Stack.Screen name="search" options={{ 
        headerTitle: "חיפוש",
      }} />
      <Stack.Screen name="trips" options={{ 
        headerTitle: "הטיולים שלי",
      }} />
      <Stack.Screen name="chat" options={{ 
        headerTitle: "עוזר טיולים",
      }} />
      <Stack.Screen name="favorites" options={{ 
        headerTitle: "המועדפים שלי",
      }} />
      <Stack.Screen name="profile" options={{ 
        headerTitle: "הפרופיל שלי",
      }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="profile-setup" options={{ headerShown: false }} />
      <Stack.Screen name="select-location" options={{ 
        headerTitle: "בחר מיקום",
      }} />
      <Stack.Screen name="location/[id]" options={{ 
        headerShown: true,
      }} />
      <Stack.Screen name="recommendation/[id]" options={{ 
        headerShown: true,
      }} />
      <Stack.Screen name="weather/[id]" options={{ 
        headerShown: true,
      }} />
      <Stack.Screen name="transportation" options={{ 
        headerTitle: "תחבורה",
      }} />
      <Stack.Screen name="trip/[id]" options={{ 
        headerShown: true,
      }} />
      <Stack.Screen name="trip-day/[id]" options={{ 
        headerShown: true,
      }} />
      <Stack.Screen name="add-to-trip" options={{ 
        headerTitle: "הוסף לטיול",
      }} />
      <Stack.Screen name="add-trip-day" options={{ 
        headerTitle: "הוסף יום לטיול",
      }} />
      <Stack.Screen name="add-activity" options={{ 
        headerTitle: "הוסף פעילות",
      }} />
      <Stack.Screen name="country" options={{ 
        headerShown: false,
      }} />
      <Stack.Screen name="region" options={{ 
        headerShown: false,
      }} />
      <Stack.Screen name="create-trip" options={{ 
        headerShown: false,
      }} />
    </Stack>
  );
}