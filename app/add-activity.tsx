import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView, 
  Pressable,
  TextInput,
  Alert
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useTripStore } from '@/store/trip-store';
import { useTravelStore } from '@/store/travel-store';
import colors from '@/constants/colors';
import { 
  Check, 
  Clock, 
  Hotel, 
  Utensils, 
  MapPin, 
  Plane, 
  Pencil
} from 'lucide-react-native';
import { Recommendation } from '@/types/travel';

export default function AddActivityScreen() {
  const { dayId } = useLocalSearchParams<{ dayId: string }>();
  const router = useRouter();
  const { createTripActivity } = useTripStore();
  const { getRecommendationsByLocation } = useTravelStore();
  
  const [activityType, setActivityType] = useState<'hotel' | 'hostel' | 'activity' | 'restaurant' | 'transportation' | 'custom'>('activity');
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const [recommendationId, setRecommendationId] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  
  const tripDay = useTripStore(state => 
    state.tripDays.find(day => day.id === dayId)
  );
  
  // Get recommendations for this location
  const recommendations = tripDay 
    ? getRecommendationsByLocation(
        tripDay.locationId, 
        activityType === 'custom' || activityType === 'transportation' 
          ? undefined 
          : (activityType as 'hotel' | 'hostel' | 'activity' | 'restaurant')
      )
    : [];
  
  // Filter recommendations based on search query
  const filteredRecommendations = recommendations.filter(rec => 
    rec.nameHe.includes(searchQuery) || 
    rec.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.description.includes(searchQuery)
  );
  
  const activityTypes = [
    { id: 'hotel', label: 'מלון', icon: <Hotel size={20} color={colors.primary} /> },
    { id: 'hostel', label: 'הוסטל', icon: <Hotel size={20} color={colors.primary} /> },
    { id: 'activity', label: 'אטרקציה', icon: <MapPin size={20} color={colors.primary} /> },
    { id: 'restaurant', label: 'מסעדה', icon: <Utensils size={20} color={colors.primary} /> },
    { id: 'transportation', label: 'תחבורה', icon: <Plane size={20} color={colors.primary} /> },
    { id: 'custom', label: 'אחר', icon: <Pencil size={20} color={colors.primary} /> }
  ];
  
  const handleCreateActivity = () => {
    if (activityType === 'custom' && !name.trim()) {
      Alert.alert('שגיאה', 'יש להזין שם לפעילות');
      return;
    }
    
    if (activityType !== 'custom' && !recommendationId) {
      Alert.alert('שגיאה', 'יש לבחור המלצה');
      return;
    }
    
    createTripActivity({
      tripDayId: dayId,
      recommendationId,
      type: activityType,
      name: activityType === 'custom' ? name : (
        recommendationId 
          ? useTravelStore.getState().getRecommendationById(recommendationId)?.nameHe || name
          : name
      ),
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      notes: notes.trim() || undefined,
      isCompleted: false
    });
    
    router.replace(`/trip-day/${dayId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: "הוסף פעילות",
        headerRight: () => (
          <Pressable onPress={handleCreateActivity} style={styles.saveButton}>
            <Check size={24} color={colors.primary} />
          </Pressable>
        )
      }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>סוג פעילות</Text>
          <View style={styles.activityTypesContainer}>
            {activityTypes.map(type => (
              <Pressable
                key={type.id}
                style={[
                  styles.activityTypeButton,
                  activityType === type.id && styles.selectedActivityTypeButton
                ]}
                onPress={() => {
                  setActivityType(type.id as any);
                  setRecommendationId(undefined);
                }}
              >
                {type.icon}
                <Text 
                  style={[
                    styles.activityTypeText,
                    activityType === type.id && styles.selectedActivityTypeText
                  ]}
                >
                  {type.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        
        {activityType === 'custom' ? (
          <View style={styles.formGroup}>
            <Text style={styles.label}>שם הפעילות</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="הזן שם לפעילות"
              placeholderTextColor={colors.muted}
              textAlign="right"
            />
          </View>
        ) : (
          <View style={styles.formGroup}>
            <Text style={styles.label}>בחר המלצה</Text>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="חפש המלצה..."
              placeholderTextColor={colors.muted}
              textAlign="right"
            />
            
            <ScrollView style={styles.recommendationsContainer} nestedScrollEnabled>
              {filteredRecommendations.length > 0 ? (
                filteredRecommendations.map((recommendation: Recommendation) => (
                  <Pressable
                    key={recommendation.id}
                    style={[
                      styles.recommendationItem,
                      recommendationId === recommendation.id && styles.selectedRecommendationItem
                    ]}
                    onPress={() => setRecommendationId(recommendation.id)}
                  >
                    <View style={styles.recommendationInfo}>
                      <Text style={styles.recommendationName}>{recommendation.nameHe}</Text>
                      <Text style={styles.recommendationPrice}>{recommendation.priceRange}</Text>
                    </View>
                    {recommendationId === recommendation.id && (
                      <Check size={20} color={colors.primary} />
                    )}
                  </Pressable>
                ))
              ) : (
                <View style={styles.emptyRecommendations}>
                  <Text style={styles.emptyRecommendationsText}>
                    אין המלצות זמינות. נסה לשנות את סוג הפעילות או השתמש בפעילות מותאמת אישית.
                  </Text>
                  <Pressable
                    style={styles.customActivityButton}
                    onPress={() => setActivityType('custom')}
                  >
                    <Text style={styles.customActivityButtonText}>צור פעילות מותאמת אישית</Text>
                  </Pressable>
                </View>
              )}
            </ScrollView>
          </View>
        )}
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>זמנים (אופציונלי)</Text>
          <View style={styles.timeInputsContainer}>
            <View style={styles.timeInputWrapper}>
              <Text style={styles.timeLabel}>שעת התחלה</Text>
              <View style={styles.timeInputContainer}>
                <Clock size={16} color={colors.primary} />
                <TextInput
                  style={styles.timeInput}
                  value={startTime}
                  onChangeText={setStartTime}
                  placeholder="HH:MM"
                  placeholderTextColor={colors.muted}
                  textAlign="right"
                />
              </View>
            </View>
            
            <View style={styles.timeInputWrapper}>
              <Text style={styles.timeLabel}>שעת סיום</Text>
              <View style={styles.timeInputContainer}>
                <Clock size={16} color={colors.primary} />
                <TextInput
                  style={styles.timeInput}
                  value={endTime}
                  onChangeText={setEndTime}
                  placeholder="HH:MM"
                  placeholderTextColor={colors.muted}
                  textAlign="right"
                />
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>הערות (אופציונלי)</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="הזן הערות לפעילות זו..."
            placeholderTextColor={colors.muted}
            multiline
            numberOfLines={4}
            textAlign="right"
            textAlignVertical="top"
          />
        </View>
        
        <Pressable style={styles.createButton} onPress={handleCreateActivity}>
          <Text style={styles.createButtonText}>הוסף פעילות</Text>
        </Pressable>
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
  saveButton: {
    padding: 8,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'right',
  },
  activityTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityTypeButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedActivityTypeButton: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  activityTypeText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  selectedActivityTypeText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  recommendationsContainer: {
    maxHeight: 200,
  },
  recommendationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedRecommendationItem: {
    borderColor: colors.primary,
  },
  recommendationInfo: {
    flex: 1,
  },
  recommendationName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'right',
  },
  recommendationPrice: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'right',
  },
  emptyRecommendations: {
    padding: 16,
    alignItems: 'center',
  },
  emptyRecommendationsText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 12,
  },
  customActivityButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
  },
  customActivityButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  timeInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInputWrapper: {
    width: '48%',
  },
  timeLabel: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
    textAlign: 'right',
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  notesInput: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  createButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});