import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { WeatherRecommendation } from '@/types/travel';
import colors from '@/constants/colors';
import { CheckCircle } from 'lucide-react-native';

interface WeatherActivitiesListProps {
  recommendation: WeatherRecommendation;
}

export default function WeatherActivitiesList({ recommendation }: WeatherActivitiesListProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>פעילויות מומלצות למזג האוויר</Text>
      <View style={styles.activitiesContainer}>
        {recommendation.activities.map((activity, index) => (
          <View key={index} style={styles.activityItem}>
            <Text style={styles.activityText}>{activity}</Text>
            <CheckCircle size={16} color={colors.primary} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'right',
  },
  activitiesContainer: {
    
  },
  activityItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  activityText: {
    fontSize: 14,
    color: colors.text,
    marginRight: 8,
    flex: 1,
    textAlign: 'right',
  }
});