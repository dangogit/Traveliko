import React from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTripStore } from '@/store/trip-store';
import TripCard from '@/components/TripCard';
import colors from '@/constants/colors';
import EmptyState from '@/components/EmptyState';
import { Calendar, Plus } from 'lucide-react-native';

export default function TripsScreen() {
  const router = useRouter();
  const { getAllTrips } = useTripStore();
  
  const trips = getAllTrips();
  
  const handleCreateTrip = () => {
    router.push('/create-trip');
  };
  
  const renderTripItem = ({ item }: { item: any }) => (
    <TripCard trip={item} />
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.createButton} onPress={handleCreateTrip}>
          <Text style={styles.createButtonText}>טיול חדש</Text>
          <Plus size={20} color="white" />
        </Pressable>
      </View>
      
      {trips.length > 0 ? (
        <FlatList
          data={trips}
          renderItem={renderTripItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <EmptyState 
          title="אין טיולים"
          message="לחץ על 'טיול חדש' כדי להתחיל לתכנן את הטיול הבא שלך"
          icon={<Calendar size={48} color={colors.muted} />}
          actionLabel="צור טיול חדש"
          onAction={handleCreateTrip}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
});