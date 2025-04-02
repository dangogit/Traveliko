import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Recommendation } from '@/types/travel';
import { Heart, Star } from 'lucide-react-native';
import { useTravelStore } from '@/store/travel-store';
import colors from '@/constants/colors';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const router = useRouter();
  const { addFavorite, removeFavorite, isFavorite, addToHistory } = useTravelStore();
  const isFav = isFavorite(recommendation.id);

  const handlePress = () => {
    addToHistory('recommendation', recommendation.id);
    router.push(`/recommendation/${recommendation.id}`);
  };

  const toggleFavorite = (e: any) => {
    e.stopPropagation();
    if (isFav) {
      removeFavorite(recommendation.id);
    } else {
      addFavorite('recommendation', recommendation.id);
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'hotel': return 'מלון';
      case 'hostel': return 'הוסטל';
      case 'activity': return 'אטרקציה';
      case 'restaurant': return 'מסעדה';
      default: return type;
    }
  };

  return (
    <Pressable 
      style={styles.container} 
      onPress={handlePress}
      android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
    >
      <Image
        source={{ uri: recommendation.image }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{recommendation.nameHe}</Text>
          <Pressable onPress={toggleFavorite} hitSlop={10}>
            <Heart 
              size={22} 
              color={colors.text} 
              fill={isFav ? colors.primary : "transparent"} 
              stroke={isFav ? colors.primary : colors.text}
            />
          </Pressable>
        </View>
        
        <View style={styles.details}>
          <View style={styles.typeContainer}>
            <Text style={styles.type}>{getTypeLabel(recommendation.type)}</Text>
          </View>
          
          <View style={styles.ratingContainer}>
            <Star size={16} color={colors.secondary} fill={colors.secondary} />
            <Text style={styles.rating}>{recommendation.rating.toFixed(1)}</Text>
          </View>
        </View>
        
        <Text style={styles.price}>{recommendation.priceRange}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: colors.card,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 100,
    height: 100,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  typeContainer: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  type: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  price: {
    marginTop: 8,
    color: colors.muted,
    fontSize: 14,
    textAlign: 'right',
  }
});