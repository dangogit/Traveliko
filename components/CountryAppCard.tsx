import React from 'react';
import { StyleSheet, Text, View, Pressable, Linking, Platform } from 'react-native';
import colors from '@/constants/colors';
import { ExternalLink, Download } from 'lucide-react-native';
import { CountryApp } from '@/types/travel';
import { Image } from 'expo-image';

interface CountryAppCardProps {
  app: CountryApp;
}

export default function CountryAppCard({ app }: CountryAppCardProps) {
  const handleOpenWebsite = () => {
    if (app.website) {
      Linking.openURL(app.website);
    }
  };
  
  const handleOpenAppStore = () => {
    if (Platform.OS === 'ios' && app.appStoreLink) {
      Linking.openURL(app.appStoreLink);
    } else if (Platform.OS === 'android' && app.googlePlayLink) {
      Linking.openURL(app.googlePlayLink);
    }
  };
  
  const getCategoryColor = () => {
    switch (app.category) {
      case 'transportation':
        return '#4CAF50'; // Green
      case 'food':
        return '#FF9800'; // Orange
      case 'accommodation':
        return '#2196F3'; // Blue
      case 'activities':
        return '#9C27B0'; // Purple
      default:
        return '#607D8B'; // Gray
    }
  };
  
  const getCategoryLabel = () => {
    switch (app.category) {
      case 'transportation':
        return 'תחבורה';
      case 'food':
        return 'אוכל';
      case 'accommodation':
        return 'לינה';
      case 'activities':
        return 'פעילויות';
      default:
        return 'כללי';
    }
  };

  const getStoreLabel = () => {
    return Platform.OS === 'ios' ? 'App Store' : 'Google Play';
  };

  const hasStoreLink = Platform.OS === 'ios' ? !!app.appStoreLink : !!app.googlePlayLink;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {app.icon ? (
            <Image source={{ uri: app.icon }} style={styles.icon} />
          ) : (
            <View style={[styles.placeholderIcon, { backgroundColor: getCategoryColor() }]}>
              <Text style={styles.placeholderText}>{app.name.charAt(0)}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{app.name}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor() }]}>
            <Text style={styles.categoryText}>{getCategoryLabel()}</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.description}>{app.description}</Text>
      
      <View style={styles.actions}>
        {hasStoreLink && (
          <Pressable style={styles.actionButton} onPress={handleOpenAppStore}>
            <Download size={16} color={colors.primary} />
            <Text style={styles.actionText}>{getStoreLabel()}</Text>
          </Pressable>
        )}
        
        {app.website && (
          <Pressable style={styles.actionButton} onPress={handleOpenWebsite}>
            <ExternalLink size={16} color={colors.primary} />
            <Text style={styles.actionText}>אתר</Text>
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
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
    justifyContent: 'flex-end',
  },
  iconContainer: {
    marginLeft: 12,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  placeholderIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'right',
  },
  categoryBadge: {
    alignSelf: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.background,
    marginLeft: 8,
  },
  actionText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  }
});