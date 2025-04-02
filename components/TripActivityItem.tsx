import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { TripActivity } from '@/types/travel';
import { useTravelStore } from '@/store/travel-store';
import { useTripStore } from '@/store/trip-store';
import { 
  Check, 
  Clock, 
  Hotel, 
  Utensils, 
  MapPin, 
  Plane, 
  Pencil,
  Trash2
} from 'lucide-react-native';
import colors from '@/constants/colors';

interface TripActivityItemProps {
  activity: TripActivity;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function TripActivityItem({ activity, onEdit, onDelete }: TripActivityItemProps) {
  const { getRecommendationById } = useTravelStore();
  const { toggleActivityCompletion } = useTripStore();
  
  const recommendation = activity.recommendationId 
    ? getRecommendationById(activity.recommendationId) 
    : undefined;
  
  const getActivityIcon = () => {
    switch (activity.type) {
      case 'hotel':
      case 'hostel':
        return <View><Hotel size={20} color={colors.primary} /></View>;
      case 'restaurant':
        return <View><Utensils size={20} color={colors.primary} /></View>;
      case 'activity':
        return <View><MapPin size={20} color={colors.primary} /></View>;
      case 'transportation':
        return <View><Plane size={20} color={colors.primary} /></View>;
      case 'custom':
        return <View><Pencil size={20} color={colors.primary} /></View>;
      default:
        return <View><MapPin size={20} color={colors.primary} /></View>;
    }
  };
  
  const handleToggleCompletion = () => {
    toggleActivityCompletion(activity.id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftActions}>
        {onEdit && (
          <Pressable 
            style={[styles.actionButton, styles.editButton]} 
            onPress={onEdit}
            hitSlop={8}
          >
            <View>
              <Pencil size={16} color={colors.primary} />
            </View>
          </Pressable>
        )}
        {onDelete && (
          <Pressable 
            style={[styles.actionButton, styles.deleteButton]} 
            onPress={onDelete}
            hitSlop={8}
          >
            <View>
              <Trash2 size={16} color={colors.notification} />
            </View>
          </Pressable>
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            {getActivityIcon()}
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {recommendation ? recommendation.nameHe : activity.name}
            </Text>
            {(activity.startTime || activity.endTime) && (
              <View style={styles.timeContainer}>
                <View>
                  <Clock size={12} color={colors.muted} />
                </View>
                <Text style={styles.timeText}>
                  {activity.startTime && activity.endTime 
                    ? `${activity.startTime} - ${activity.endTime}`
                    : activity.startTime || activity.endTime
                  }
                </Text>
              </View>
            )}
          </View>
        </View>
        
        {activity.notes && (
          <Text style={styles.notes}>{activity.notes}</Text>
        )}
      </View>
      
      <Pressable 
        style={[
          styles.completionButton,
          activity.isCompleted && styles.completedButton
        ]}
        onPress={handleToggleCompletion}
      >
        <View>
          <Check size={16} color={activity.isCompleted ? 'white' : colors.muted} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  leftActions: {
    flexDirection: 'column',
    marginRight: 12,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  editButton: {
    backgroundColor: colors.highlight,
  },
  deleteButton: {
    backgroundColor: '#FFEEEE',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'right',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  timeText: {
    fontSize: 12,
    color: colors.muted,
    marginLeft: 4,
  },
  notes: {
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
    textAlign: 'right',
  },
  completionButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  completedButton: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  }
});