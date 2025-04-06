import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Country } from '@/types/travel';
import { Heart } from 'lucide-react-native';
import { useTravelStore } from '@/store/travel-store';
import colors from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import CountryFlag from './CountryFlag';

interface CountryCardProps {
  country: Country;
}

export default function CountryCard({ country }: CountryCardProps) {
  const router = useRouter();
  const { addFavorite, removeFavorite, isFavorite, addToHistory } = useTravelStore();
  const isFav = isFavorite(country.id);

  const handlePress = () => {
    addToHistory('country', country.id);
    router.push(`/country/${country.id}`);
  };

  const toggleFavorite = (e: any) => {
    e.stopPropagation();
    if (isFav) {
      removeFavorite(country.id);
    } else {
      addFavorite('country', country.id);
    }
  };

  return (
    <Pressable 
      style={styles.container} 
      onPress={handlePress}
      android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
    >
      <Image
        source={{ uri: `https://source.unsplash.com/300x200/?${encodeURIComponent(country.nameEn)},landmark,travel` }}
        style={styles.image}
        contentFit="cover"
        transition={300}
        placeholder={{
          uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=300"
        }}
      />
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.5)']}
        style={styles.gradient}
      />
      <View style={styles.content}>
        <View style={styles.flagContainer}>
          <CountryFlag countryCode={country.id} size={30} />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.countryName}>{country.nameHe}</Text>
          <Text style={styles.countryNameEn}>{country.nameEn}</Text>
        </View>
        
        <Pressable 
          onPress={toggleFavorite} 
          hitSlop={10} 
          style={styles.favoriteButton}
        >
          <Heart 
            size={22} 
            color="white" 
            fill={isFav ? "white" : "transparent"} 
          />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 180,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: colors.card,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  flagContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
    alignSelf: 'flex-end',
  },
  infoContainer: {
    marginTop: 'auto',
  },
  countryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  countryNameEn: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'right',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});