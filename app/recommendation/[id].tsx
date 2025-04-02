import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Linking, Pressable } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useTravelStore } from '@/store/travel-store';
import colors from '@/constants/colors';
import { Image } from 'expo-image';
import EmptyState from '@/components/EmptyState';
import { MapPin, Star, Phone, Globe, Heart } from 'lucide-react-native';

export default function RecommendationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { 
    getRecommendationById, 
    getLocationById, 
    getCountryById,
    addFavorite,
    removeFavorite,
    isFavorite
  } = useTravelStore();

  const recommendation = getRecommendationById(id);
  const location = recommendation ? getLocationById(recommendation.locationId) : null;
  const country = location ? getCountryById(location.countryId) : null;
  
  const isFav = recommendation ? isFavorite(recommendation.id) : false;

  const toggleFavorite = () => {
    if (!recommendation) return;
    
    if (isFav) {
      removeFavorite(recommendation.id);
    } else {
      addFavorite('recommendation', recommendation.id);
    }
  };

  const handlePhonePress = () => {
    if (recommendation?.phone) {
      Linking.openURL(`tel:${recommendation.phone}`);
    }
  };

  const handleWebsitePress = () => {
    if (recommendation?.website) {
      Linking.openURL(recommendation.website);
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

  if (!recommendation) {
    return (
      <EmptyState 
        title="המלצה לא נמצאה"
        message="ההמלצה המבוקשת לא נמצאה"
        icon={<MapPin size={48} color={colors.muted} />}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: recommendation.nameHe,
        headerRight: () => (
          <Pressable onPress={toggleFavorite} style={{ marginRight: 16 }}>
            <Heart 
              size={24} 
              color={colors.primary} 
              fill={isFav ? colors.primary : "transparent"} 
            />
          </Pressable>
        )
      }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: recommendation.image }}
            style={styles.headerImage}
            contentFit="cover"
          />
          <View style={styles.headerOverlay}>
            <View style={styles.typeContainer}>
              <Text style={styles.typeText}>{getTypeLabel(recommendation.type)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{recommendation.nameHe}</Text>
            <View style={styles.ratingContainer}>
              <Star size={20} color={colors.secondary} fill={colors.secondary} />
              <Text style={styles.rating}>{recommendation.rating.toFixed(1)}</Text>
            </View>
          </View>

          <View style={styles.locationContainer}>
            <MapPin size={16} color={colors.muted} />
            <Text style={styles.locationText}>
              {location?.nameHe}{country ? `, ${country.nameHe}` : ''}
            </Text>
          </View>

          <Text style={styles.price}>{recommendation.priceRange}</Text>

          <Text style={styles.description}>{recommendation.description}</Text>

          <Text style={styles.address}>{recommendation.address}</Text>

          <View style={styles.contactContainer}>
            {recommendation.phone && (
              <Pressable 
                style={[styles.contactButton, styles.phoneButton]} 
                onPress={handlePhonePress}
              >
                <Phone size={20} color="white" />
                <Text style={styles.contactButtonText}>התקשר</Text>
              </Pressable>
            )}
            
            {recommendation.website && (
              <Pressable 
                style={[styles.contactButton, styles.websiteButton]} 
                onPress={handleWebsitePress}
              >
                <Globe size={20} color="white" />
                <Text style={styles.contactButtonText}>אתר</Text>
              </Pressable>
            )}
          </View>
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
    height: 250,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  typeContainer: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  contentContainer: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    textAlign: 'right',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.highlight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginLeft: 8,
  },
  rating: {
    marginLeft: 4,
    fontWeight: 'bold',
    color: colors.text,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    color: colors.muted,
    marginLeft: 4,
    fontSize: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'right',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
    marginBottom: 16,
    textAlign: 'right',
  },
  address: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 24,
    textAlign: 'right',
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  phoneButton: {
    backgroundColor: colors.primary,
  },
  websiteButton: {
    backgroundColor: colors.secondary,
  },
  contactButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});