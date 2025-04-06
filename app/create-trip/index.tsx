import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ActivityIndicator
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTripStore } from '@/store/trip-store';
import { useProfileStore } from '@/store/profile-store';
import colors from '@/constants/colors';
import BackButton from '@/components/BackButton';

export default function CreateTripScreen() {
  const router = useRouter();
  const { profile } = useProfileStore();
  const { resetTripPlanning } = useTripStore();
  const [loading, setLoading] = useState(true);

  // Reset trip planning state when starting a new trip
  useEffect(() => {
    resetTripPlanning();
  }, []);

  // Check if user has completed profile setup and redirect to start point
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      
      // If profile is not complete, redirect to profile setup first
      if (!profile.isProfileComplete) {
        router.push({
          pathname: '/profile-setup',
          params: { returnTo: 'create-trip' }
        });
      } else {
        // Skip the intro screen and navigate directly to start point
        router.replace('/create-trip/start-point');
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [profile, router]);

  // Show only loading screen (this will quickly redirect to start-point)
  return (
    <SafeAreaView style={styles.loadingContainer}>
      <Stack.Screen options={{ 
        title: "טוען...",
        headerLeft: () => <BackButton />
      }} />
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>טוען...</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text,
  }
});