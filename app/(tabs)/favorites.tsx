import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView } from 'react-native';
import { useTravelStore } from '@/store/travel-store';
import FilterTabs from '@/components/FilterTabs';
import CountryCard from '@/components/CountryCard';
import LocationCard from '@/components/LocationCard';
import RecommendationCard from '@/components/RecommendationCard';
import colors from '@/constants/colors';
import EmptyState from '@/components/EmptyState';
import { Heart } from 'lucide-react-native';

export default function FavoritesScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const { 
    getFavoriteCountries, 
    getFavoriteLocations, 
    getFavoriteRecommendations 
  } = useTravelStore();

  const favoriteCountries = getFavoriteCountries();
  const favoriteLocations = getFavoriteLocations();
  const favoriteRecommendations = getFavoriteRecommendations();

  const tabs = [
    { id: 'all', label: 'הכל' },
    { id: 'countries', label: 'מדינות' },
    { id: 'locations', label: 'מקומות' },
    { id: 'recommendations', label: 'המלצות' }
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const getFilteredFavorites = () => {
    switch (activeTab) {
      case 'countries':
        return favoriteCountries.map(item => ({ ...item, type: 'country' }));
      case 'locations':
        return favoriteLocations.map(item => ({ ...item, type: 'location' }));
      case 'recommendations':
        return favoriteRecommendations.map(item => ({ ...item, type: 'recommendation' }));
      case 'all':
      default:
        return [
          ...favoriteCountries.map(item => ({ ...item, type: 'country' })),
          ...favoriteLocations.map(item => ({ ...item, type: 'location' })),
          ...favoriteRecommendations.map(item => ({ ...item, type: 'recommendation' }))
        ];
    }
  };

  const renderItem = ({ item }: any) => {
    switch (item.type) {
      case 'country':
        return <CountryCard country={item} />;
      case 'location':
        return <LocationCard location={item} />;
      case 'recommendation':
        return <RecommendationCard recommendation={item} />;
      default:
        return null;
    }
  };

  const favorites = getFilteredFavorites();
  const hasFavorites = favorites.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <FilterTabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
      
      <View style={styles.contentContainer}>
        {hasFavorites ? (
          <FlatList
            data={favorites}
            renderItem={renderItem}
            keyExtractor={(item) => `${item.type}-${item.id}`}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <EmptyState 
            title="אין מועדפים"
            message="הוסף פריטים למועדפים כדי לראות אותם כאן"
            icon={<Heart size={48} color={colors.muted} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    gap: 16
  },
}); 