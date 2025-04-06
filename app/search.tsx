import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView } from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { useTravelStore } from '@/store/travel-store';
import SearchBar from '@/components/SearchBar';
import RegionCard from '@/components/RegionCard';
import CountryCard from '@/components/CountryCard';
import LocationCard from '@/components/LocationCard';
import RecommendationCard from '@/components/RecommendationCard';
import colors from '@/constants/colors';
import EmptyState from '@/components/EmptyState';
import { Search as SearchIcon } from 'lucide-react-native';

export default function SearchScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ query?: string }>();
  const [searchQuery, setSearchQuery] = useState(params.query || '');

  const { 
    searchAll
  } = useTravelStore();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const searchResults = searchAll(searchQuery);

  const combinedResults = [
    ...searchResults.regions.map(item => ({ ...item, type: 'region' })),
    ...searchResults.countries.map(item => ({ ...item, type: 'country' })),
    ...searchResults.locations.map(item => ({ ...item, type: 'location' })),
    ...searchResults.accommodations.map(item => ({ ...item, type: 'recommendation' })),
    ...searchResults.recommendations.filter(rec => rec.type !== 'hotel' && rec.type !== 'hostel').map(item => ({ ...item, type: 'recommendation' }))
  ].sort(() => Math.random() - 0.5);

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

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: `תוצאות חיפוש עבור "${searchQuery}"` }} />
      
      <View style={styles.searchContainer}>
        <SearchBar 
          value={searchQuery} 
          onChangeText={handleSearch} 
          placeholder="חפש יעד, מלון, אטרקציה..."
        />
      </View>
      
      {combinedResults.length > 0 ? (
        <FlatList
          data={combinedResults}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.type}-${item.id}`}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <EmptyState 
          title="לא נמצאו תוצאות"
          message={`לא מצאנו תוצאות עבור "${searchQuery}"`}
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