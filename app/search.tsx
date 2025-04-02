import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTravelStore } from '@/store/travel-store';
import SearchBar from '@/components/SearchBar';
import FilterTabs from '@/components/FilterTabs';
import RegionCard from '@/components/RegionCard';
import CountryCard from '@/components/CountryCard';
import LocationCard from '@/components/LocationCard';
import RecommendationCard from '@/components/RecommendationCard';
import colors from '@/constants/colors';
import EmptyState from '@/components/EmptyState';
import { Search as SearchIcon } from 'lucide-react-native';

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ filter?: string, query?: string }>();
  const [searchQuery, setSearchQuery] = useState(params.query || '');
  const [activeTab, setActiveTab] = useState(params.filter || 'all');
  const { 
    searchRegions, 
    searchCountries, 
    searchLocations, 
    searchRecommendations 
  } = useTravelStore();

  const tabs = [
    { id: 'all', label: 'הכל' },
    { id: 'regions', label: 'אזורים' },
    { id: 'countries', label: 'מדינות' },
    { id: 'locations', label: 'מקומות' },
    { id: 'recommendations', label: 'המלצות' }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const regions = searchRegions(searchQuery);
  const countries = searchCountries(searchQuery);
  const locations = searchLocations(searchQuery);
  const recommendations = searchRecommendations(searchQuery);

  const getFilteredResults = () => {
    switch (activeTab) {
      case 'regions':
        return regions.map(item => ({ ...item, type: 'region' }));
      case 'countries':
        return countries.map(item => ({ ...item, type: 'country' }));
      case 'locations':
        return locations.map(item => ({ ...item, type: 'location' }));
      case 'recommendations':
        return recommendations.map(item => ({ ...item, type: 'recommendation' }));
      case 'all':
      default:
        return [
          ...regions.map(item => ({ ...item, type: 'region' })),
          ...countries.map(item => ({ ...item, type: 'country' })),
          ...locations.map(item => ({ ...item, type: 'location' })),
          ...recommendations.map(item => ({ ...item, type: 'recommendation' }))
        ];
    }
  };

  const renderItem = ({ item }: any) => {
    switch (item.type) {
      case 'region':
        return <RegionCard region={item} />;
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

  const results = getFilteredResults();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar 
          value={searchQuery} 
          onChangeText={handleSearch} 
          placeholder="חפש יעדים, מקומות, המלצות..."
        />
      </View>
      
      <FilterTabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
      />
      
      {results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <EmptyState 
          title="לא נמצאו תוצאות"
          message={searchQuery ? `לא נמצאו תוצאות עבור "${searchQuery}"` : "התחל לחפש כדי למצוא יעדים"}
          icon={<SearchIcon size={48} color={colors.muted} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    padding: 16,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
});