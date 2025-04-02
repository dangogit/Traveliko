import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView, 
  Pressable,
  Alert
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useTripStore } from '@/store/trip-store';
import { useTravelStore } from '@/store/travel-store';
import colors from '@/constants/colors';
import { 
  Calendar, 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2,
  ChevronLeft
} from 'lucide-react-native';
import TripActivityItem from '@/components/TripActivityItem';
import EmptyState from '@/components/EmptyState';

export default function TripDayDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { 
    getTripDaysByTripId, 
    getTripActivitiesByDayId,
    deleteTripDay,
    getTripById
  } = useTripStore();
  const { getLocationById } = useTravelStore();
  
  const tripDay = useTripStore(state => 
    state.tripDays.find(day => day.id === id)
  );
  
  const trip = tripDay ? getTripById(tripDay.tripId) : undefined;
  const activities = getTripActivitiesByDayId(id);
  const location = tripDay ? getLocationById(tripDay.locationId) : undefined;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  const handleAddActivity = () => {
    router.push({
      pathname: '/add-activity',
      params: { dayId: id }
    });
  };
  
  const handleEditDay = () => {
    router.push({
      pathname: '/edit-trip-day',
      params: { dayId: id }
    });
  };
  
  const handleDeleteDay = () => {
    Alert.alert(
      "מחיקת יום",
      "האם אתה בטוח שברצונך למחוק את היום? כל הפעילויות המתוכננות ליום זה יימחקו.",
      [
        { text: "ביטול", style: "cancel" },
        { 
          text: "מחק", 
          style: "destructive",
          onPress: () => {
            if (tripDay) {
              deleteTripDay(id);
              router.replace(`/trip/${tripDay.tripId}`);
            }
          }
        }
      ]
    );
  };
  
  const handleEditActivity = (activityId: string) => {
    router.push({
      pathname: '/edit-activity',
      params: { activityId }
    });
  };
  
  const handleDeleteActivity = (activityId: string) => {
    Alert.alert(
      "מחיקת פעילות",
      "האם אתה בטוח שברצונך למחוק את הפעילות?",
      [
        { text: "ביטול", style: "cancel" },
        { 
          text: "מחק", 
          style: "destructive",
          onPress: () => {
            useTripStore.getState().deleteTripActivity(activityId);
          }
        }
      ]
    );
  };
  
  if (!tripDay || !trip) {
    return (
      <EmptyState 
        title="יום לא נמצא"
        message="היום המבוקש לא נמצא"
        icon={<View><Calendar size={48} color={colors.muted} /></View>}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: formatDate(tripDay.date),
        headerRight: () => (
          <View style={styles.headerActions}>
            <Pressable onPress={handleEditDay} style={styles.headerButton}>
              <View>
                <Edit3 size={20} color={colors.primary} />
              </View>
            </Pressable>
            <Pressable onPress={handleDeleteDay} style={styles.headerButton}>
              <View>
                <Trash2 size={20} color={colors.notification} />
              </View>
            </Pressable>
          </View>
        )
      }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable 
          style={styles.tripLink}
          onPress={() => router.push(`/trip/${trip.id}`)}
        >
          <Text style={styles.tripLinkText}>{trip.name}</Text>
          <View>
            <ChevronLeft size={16} color={colors.primary} />
          </View>
        </Pressable>
        
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <View>
              <MapPin size={20} color={colors.primary} />
            </View>
            <Text style={styles.locationText}>
              {location?.nameHe || 'מיקום לא ידוע'}
            </Text>
          </View>
          
          <View style={styles.dateContainer}>
            <View>
              <Calendar size={20} color={colors.primary} />
            </View>
            <Text style={styles.dateText}>{formatDate(tripDay.date)}</Text>
          </View>
          
          {tripDay.notes && (
            <Text style={styles.notes}>{tripDay.notes}</Text>
          )}
        </View>
        
        <View style={styles.activitiesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>פעילויות</Text>
            <Pressable style={styles.addButton} onPress={handleAddActivity}>
              <Text style={styles.addButtonText}>הוסף פעילות</Text>
              <View>
                <Plus size={16} color={colors.primary} />
              </View>
            </Pressable>
          </View>
          
          {activities.length === 0 ? (
            <EmptyState 
              title="אין פעילויות מתוכננות"
              message="לחץ על 'הוסף פעילות' כדי להתחיל לתכנן את היום שלך"
              icon={<View><MapPin size={36} color={colors.muted} /></View>}
            />
          ) : (
            activities
              .sort((a, b) => {
                // Sort by start time if available
                if (a.startTime && b.startTime) {
                  return a.startTime.localeCompare(b.startTime);
                }
                if (a.startTime) return -1;
                if (b.startTime) return 1;
                return 0;
              })
              .map(activity => (
                <TripActivityItem 
                  key={activity.id} 
                  activity={activity}
                  onEdit={() => handleEditActivity(activity.id)}
                  onDelete={() => handleDeleteActivity(activity.id)}
                />
              ))
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
    padding: 16,
    paddingBottom: 40,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  tripLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tripLinkText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
    marginRight: 4,
  },
  header: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  notes: {
    fontSize: 14,
    color: colors.text,
    fontStyle: 'italic',
    textAlign: 'right',
  },
  activitiesSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  addButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    marginRight: 4,
  }
});