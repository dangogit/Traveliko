import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useTravelStore } from '@/store/travel-store';
import CountryCard from '@/components/CountryCard';
import colors from '@/constants/colors';
import { Image } from 'expo-image';
import EmptyState from '@/components/EmptyState';
import { MapPin } from 'lucide-react-native';

export default function RegionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getRegionById, getCountriesByRegion } = useTravelStore();

  const region = getRegionById(id);
  const countries = getCountriesByRegion(id);

  if (!region) {
    return (
      <EmptyState 
        title="אזור לא נמצא"
        message="האזור המבוקש לא נמצא"
        icon={<MapPin size={48} color={colors.muted} />}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: region.nameHe }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: region.image }}
            style={styles.headerImage}
            contentFit="cover"
          />
          <View style={styles.headerOverlay}>
            <Text style={styles.headerTitle}>{region.nameHe}</Text>
          </View>
        </View>

        <Text style={styles.description}>{region.description}</Text>

        <View style={styles.countriesContainer}>
          <Text style={styles.sectionTitle}>מדינות באזור</Text>
          {countries.length > 0 ? (
            countries.map(country => (
              <CountryCard key={country.id} country={country} />
            ))
          ) : (
            <Text style={styles.emptyText}>אין מדינות זמינות באזור זה</Text>
          )}
        </View>
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
    paddingBottom: 24,
  },
  headerContainer: {
    height: 200,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    padding: 16,
    textAlign: 'right',
  },
  countriesContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text,
    textAlign: 'right',
  },
  emptyText: {
    fontSize: 16,
    color: colors.muted,
    textAlign: 'right',
    marginTop: 8,
  },
});