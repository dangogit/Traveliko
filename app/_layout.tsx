import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments, Stack } from 'expo-router';
import { useProfileStore } from '@/store/profile-store';
import { I18nManager, StyleSheet } from 'react-native';
// import HeaderRight from '@/components/HeaderRight';
import colors from '@/constants/colors';

// Force RTL layout for Hebrew
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

export default function RootLayout() {
  const { profile } = useProfileStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Determine if the current route is within the tabs group
    const inTabsGroup = segments[0] === '(tabs)';
    
    // Skip redirection logic if already in tabs or in specific setup routes
    if (inTabsGroup || segments[0] === 'onboarding' || segments[0] === 'profile-setup') {
        return;
    }
    
    // Existing redirection logic
    if (!profile.hasSeenOnboarding) {
      router.replace('/onboarding');
      return;
    }
    if (!profile.isProfileComplete) {
      router.replace('/profile-setup');
      return;
    }
    
    // If onboarding and profile are complete, but we're somehow not in tabs (e.g., at root '/'),
    // redirect to the default tab screen.
    if (segments.length === 0 || segments[0] === '') { // Check for root or empty segments
        router.replace('/(tabs)/index');
    }

  }, [profile.hasSeenOnboarding, profile.isProfileComplete, segments, router]);

  // Initial route logic might need adjustment depending on exact flow desired
  // For now, let Stack handle initial route based on navigation state after redirects

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleAlign: 'center',
      }}
    >
      {/* The Tab navigator group */}
      <Stack.Screen name="(tabs)" options={{ 
        headerShown: false, // Let the tab navigator manage its own headers/titles if needed
      }} />
      
      {/* Keep other Stack screens outside the tabs */}
      <Stack.Screen name="search" options={{ 
        headerTitle: "חיפוש",
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
       {/* Ensure modal and not-found are defined if used elsewhere */}
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}