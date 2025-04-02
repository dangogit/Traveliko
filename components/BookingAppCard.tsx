import React from 'react';
import { StyleSheet, Text, View, Pressable, Linking, Platform } from 'react-native';
import { Image } from 'expo-image';
import { BookingApp } from '@/types/travel';
import { Star, ExternalLink, Download } from 'lucide-react-native';
import colors from '@/constants/colors';

interface BookingAppCardProps {
  app: BookingApp;
}

export default function BookingAppCard({ app }: BookingAppCardProps) {
  const handleWebsitePress = () => {
    if (app.website) {
      Linking.openURL(app.website);
    }
  };

  const handleAppStorePress = () => {
    if (app.appStoreLink) {
      Linking.openURL(app.appStoreLink);
    }
  };

  const handleGooglePlayPress = () => {
    if (app.googlePlayLink) {
      Linking.openURL(app.googlePlayLink);
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'flights': return 'טיסות';
      case 'hotels': return 'מלונות';
      case 'activities': return 'אטרקציות';
      case 'all': return 'הכל';
      default: return category;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{app.nameHe}</Text>
          <View style={styles.ratingContainer}>
            <Star size={16} color={colors.secondary} fill={colors.secondary} />
            <Text style={styles.rating}>{app.rating.toFixed(1)}</Text>
          </View>
        </View>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: app.logo }}
            style={styles.logo}
            contentFit="cover"
          />
        </View>
      </View>
      
      <Text style={styles.description}>{app.description}</Text>
      
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryLabel}>קטגוריה:</Text>
        <Text style={styles.categoryValue}>{getCategoryLabel(app.category)}</Text>
      </View>
      
      <View style={styles.buttonsContainer}>
        <Pressable style={styles.websiteButton} onPress={handleWebsitePress}>
          <Text style={styles.buttonText}>אתר</Text>
          <ExternalLink size={16} color="white" />
        </Pressable>
        
        {Platform.OS === 'ios' && app.appStoreLink && (
          <Pressable style={styles.appStoreButton} onPress={handleAppStorePress}>
            <Text style={styles.buttonText}>App Store</Text>
            <Download size={16} color="white" />
          </Pressable>
        )}
        
        {Platform.OS === 'android' && app.googlePlayLink && (
          <Pressable style={styles.googlePlayButton} onPress={handleGooglePlayPress}>
            <Text style={styles.buttonText}>Google Play</Text>
            <Download size={16} color="white" />
          </Pressable>
        )}
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    marginLeft: 12,
    backgroundColor: colors.highlight,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'right',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    textAlign: 'right',
    lineHeight: 20,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  categoryLabel: {
    fontSize: 14,
    color: colors.muted,
    marginLeft: 4,
  },
  categoryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  websiteButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  appStoreButton: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googlePlayButton: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8,
    fontSize: 13,
  }
});