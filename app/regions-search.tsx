import React, { useState } from 'react';
import { StyleSheet, View, FlatList, SafeAreaView } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useTravelStore } from '@/store/travel-store';
import SearchBar from '@/components/SearchBar';
import RegionCard from '@/components/RegionCard';
import colors from '@/constants/colors';
import EmptyState from '@/components/EmptyState';
import { Compass } from 'lucide-react-native';

export default function RegionsSearchScreen() {
  const params = useLocalSearchParams<{ query?: string }>();
  const [searchQuery, setSearchQuery] = useState(params.query || '');
  const { searchRegions } = useTravelStore();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const results = searchRegions(searchQuery);

  const renderItem = ({ item }: any) => {
    return <RegionCard region={item} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "חיפוש אזורים" }} />
      
      <View style={styles.searchContainer}>
        <SearchBar 
          value={searchQuery} 
          onChangeText={handleSearch} 
          placeholder="חפש אזור..."
        />
      </View>
      
      {results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <EmptyState 
          title="לא נמצאו אזורים"
          message={searchQuery ? `לא מצאנו תוצאות עבור "${searchQuery}"` : "התחל לחפש כדי למצוא אזורים"}
          icon={<Compass size={48} color={colors.muted} />}
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