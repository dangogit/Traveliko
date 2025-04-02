import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Region } from '@/types/travel';
import colors from '@/constants/colors';

interface RegionCardProps {
  region: Region;
}

export default function RegionCard({ region }: RegionCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/region/${region.id}`);
  };

  return (
    <Pressable 
      style={styles.container} 
      onPress={handlePress}
      android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
    >
      <Image
        source={{ uri: region.image }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>{region.nameHe}</Text>
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
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'right',
  }
});