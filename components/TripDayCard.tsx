import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { TripDay, TripActivity } from '@/types/travel';
import { useTravelStore } from '@/store/travel-store';
import { Calendar, MapPin, ChevronLeft } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useRouter } from 'expo-router';

interface TripDayCardProps {
  day: TripDay;
  activities: TripActivity[];
}

export default function TripDayCard({ day, activities }: TripDayCardProps) {
  const router = useRouter();
  const { getLocationById } = useTravelStore();
  
  const location = getLocationById(day.locationId);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };
  
  const getCompletedActivitiesCount = () => {
    return activities.filter(activity => activity.isCompleted).length;
  };
  
  const handlePress = () => {
    router.push(`/trip-day/${day.id}`);
  };

  return (
    <Pressable 
      style={styles.container} 
      onPress={handlePress}
      android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
    >
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Calendar size={16} color={colors.primary} />
          <Text style={styles.dateText}>{formatDate(day.date)}</Text>
        </View>
        <ChevronLeft size={20} color={colors.muted} />
      </View>
      
      <View style={styles.locationContainer}>
        <MapPin size={16} color={colors.primary} />
        <Text style={styles.locationText}>{location?.nameHe || 'מיקום לא ידוע'}</Text>
      </View>
      
      <View style={styles.activitiesContainer}>
        <Text style={styles.activitiesText}>
          {activities.length} פעילויות ({getCompletedActivitiesCount()} הושלמו)
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: activities.length > 0 
                  ? `${(getCompletedActivitiesCount() / activities.length) * 100}%` 
                  : '0%' 
              }
            ]} 
          />
        </View>
      </View>
      
      {day.notes && (
        <Text style={styles.notes}>{day.notes}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  activitiesContainer: {
    marginBottom: 12,
  },
  activitiesText: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  notes: {
    fontSize: 14,
    color: colors.text,
    fontStyle: 'italic',
    textAlign: 'right',
  }
});