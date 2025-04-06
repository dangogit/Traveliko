import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Country } from '@/types/travel';
import { Heart } from 'lucide-react-native';
import { useTravelStore } from '@/store/travel-store';
import colors from '@/constants/colors';

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
        source={{ uri: country.image || `https://source.unsplash.com/300x200/?${encodeURIComponent(country.nameEn)},landmark,travel` }}
        style={styles.image}
        contentFit="cover"
        transition={300}
        placeholder={{
          uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=300"
        }}
      />
      <View style={styles.overlay}>
        <View style={styles.header}> 
          <Text style={styles.title}>{country.nameHe}</Text>
          <Pressable onPress={toggleFavorite} hitSlop={10}>
            <Heart 
              size={22}
              color="white" 
              fill={isFav ? "white" : "transparent"} 
            />
          </Pressable>
        </View>
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'right',
    flex: 1,
    marginRight: 8,
  },
});