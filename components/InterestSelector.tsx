import React from 'react';
import { StyleSheet, Text, View, Pressable, ScrollView } from 'react-native';
import colors from '@/constants/colors';
import { 
  Utensils, 
  Mountain, 
  Palmtree, 
  Building, 
  Landmark, 
  Camera, 
  Tent, 
  Waves, 
  Wine, 
  Music, 
  Compass, 
  ShoppingBag 
} from 'lucide-react-native';

interface InterestSelectorProps {
  selectedInterests: string[];
  onToggle: (interest: string) => void;
}

const interests = [
  { id: 'food', label: 'אוכל', icon: Utensils },
  { id: 'nature', label: 'טבע', icon: Mountain },
  { id: 'beaches', label: 'חופים', icon: Palmtree },
  { id: 'architecture', label: 'אדריכלות', icon: Building },
  { id: 'history', label: 'היסטוריה', icon: Landmark },
  { id: 'photography', label: 'צילום', icon: Camera },
  { id: 'camping', label: 'קמפינג', icon: Tent },
  { id: 'water-sports', label: 'ספורט ימי', icon: Waves },
  { id: 'wine-tasting', label: 'יין', icon: Wine },
  { id: 'festivals', label: 'פסטיבלים', icon: Music },
  { id: 'adventure', label: 'הרפתקאות', icon: Compass },
  { id: 'shopping', label: 'קניות', icon: ShoppingBag }
];

export default function InterestSelector({ selectedInterests, onToggle }: InterestSelectorProps) {
  return (
    <ScrollView 
      horizontal={false} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <View style={styles.interestsGrid}>
        {interests.map(interest => {
          const isSelected = selectedInterests.includes(interest.id);
          const Icon = interest.icon;
          
          return (
            <Pressable
              key={interest.id}
              style={[
                styles.interestItem,
                isSelected && styles.selectedInterestItem
              ]}
              onPress={() => onToggle(interest.id)}
            >
              <Icon 
                size={24} 
                color={isSelected ? 'white' : colors.text} 
              />
              <Text 
                style={[
                  styles.interestLabel,
                  isSelected && styles.selectedInterestLabel
                ]}
              >
                {interest.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  interestItem: {
    width: '31%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedInterestItem: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  interestLabel: {
    fontSize: 14,
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  selectedInterestLabel: {
    color: 'white',
  }
});