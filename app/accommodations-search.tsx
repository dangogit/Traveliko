import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, SafeAreaView } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useTravelStore } from '@/store/travel-store';
import SearchBar from '@/components/SearchBar';
import FilterTabs from '@/components/FilterTabs';
import RecommendationCard from '@/components/RecommendationCard';
import colors from '@/constants/colors';
import EmptyState from '@/components/EmptyState';
import { Search as SearchIcon, Bed } from 'lucide-react-native';

export default function AccommodationsSearchScreen() {
  const params = useLocalSearchParams<{ query?: string }>();
  const [searchQuery, setSearchQuery] = useState(params.query || '');
  const [countryFilter, setCountryFilter] = useState<string | null>(null);
  const { 
    searchAccommodations, 
    countries: allCountries 
  } = useTravelStore();

  // Generate tabs for country filter
  const countryFilterTabs = allCountries && allCountries.length > 0 ? [
    { id: 'all', label: 'כל המדינות' }, 
    ...allCountries.map(country => ({ id: country.id, label: country.nameHe }))
  ] : [];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCountryFilterChange = (countryId: string) => {
    setCountryFilter(countryId === 'all' ? null : countryId);
  };

  // Get accommodations based on search and country filter
  const allSearchedAccommodations = searchAccommodations(searchQuery);
  const results = countryFilter
    ? allSearchedAccommodations.filter(acc => acc.countryId === countryFilter)
    : allSearchedAccommodations;

  const renderItem = ({ item }: any) => {
    // Use RecommendationCard for rendering accommodations
    return <RecommendationCard recommendation={item} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "חיפוש לינה" }} />
      
      <View style={styles.searchContainer}>
        <SearchBar 
          value={searchQuery} 
          onChangeText={handleSearch} 
          placeholder="חפש מלון, הוסטל, עיר..."
        />
      </View>
      
      {/* Country Filter Tabs */}
      {countryFilterTabs.length > 0 && (
        <View style={styles.countryFilterContainer}>
          <FilterTabs 
            tabs={countryFilterTabs}
            activeTab={countryFilter || 'all'} 
            onTabChange={handleCountryFilterChange}
          />
        </View>
      )}
      
      {/* Results List */}
      {results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.id}-${countryFilter}`}
          contentContainerStyle={styles.listContent}
          extraData={countryFilter}
        />
      ) : (
        <EmptyState 
          title="לא נמצאו מקומות לינה"
          message={searchQuery ? `לא מצאנו תוצאות עבור "${searchQuery}"` : countryFilter ? "נסה לחפש או שנה את המדינה" : "התחל לחפש או בחר מדינה"} 
          icon={<Bed size={48} color={colors.muted} />}
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  countryFilterContainer: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
}); 