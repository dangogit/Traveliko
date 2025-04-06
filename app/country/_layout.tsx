import React from 'react';
import { Stack } from 'expo-router';
// import HeaderRight from '@/components/HeaderRight';
import colors from '@/constants/colors';

export default function CountryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        // headerRight: () => <HeaderRight />,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen name="[id]" options={{ 
        headerShown: true,
      }} />
    </Stack>
  );
}