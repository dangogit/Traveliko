import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons'; // Example icon library
import colors from '@/constants/colors';
import { I18nManager } from 'react-native';

export default function TabLayout() {
  const isRTL = I18nManager.isRTL;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary, // Example active color
        tabBarInactiveTintColor: colors.grey, // Example inactive color
        tabBarStyle: {
          backgroundColor: colors.background, // Example background color
          borderTopWidth: 0, // Optional: remove top border
          // Add other styling as needed
        },
        headerShown: false, // Hide header for tab screens, root layout will handle headers
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'מדריך', // Guide/Home
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="map-o" size={size} color={color} /> // Example icon
          ),
          // Ensure tab order respects RTL if needed, though default behavior might be sufficient
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'טיולים', // Trips
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="briefcase" size={size} color={color} /> // Example icon
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'מועדפים', // Favorites
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="heart-o" size={size} color={color} /> // Example icon
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'עוזר טיולים', // Travel Assistant
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="comments-o" size={size} color={color} /> // Example icon
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'פרופיל', // Profile
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user-o" size={size} color={color} /> // Example icon
          ),
        }}
      />
      {/* Add other main tabs like 'chat' if desired */}
      {/* 
      <Tabs.Screen
        name="chat"
        options={{
          title: 'עוזר טיולים', // Travel Assistant
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="comments-o" size={size} color={color} /> // Example icon
          ),
        }}
      /> 
      */}
    </Tabs>
  );
} 