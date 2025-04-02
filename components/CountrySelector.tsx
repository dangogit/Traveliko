import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Pressable, 
  FlatList,
  Modal,
  TextInput,
  SafeAreaView
} from 'react-native';
import { useTravelStore } from '@/store/travel-store';
import colors from '@/constants/colors';
import { MapPin, Search, X, ArrowLeft } from 'lucide-react-native';
import { Country } from '@/types/travel';
import { Stack } from 'expo-router';

interface CountrySelectorProps {
  selectedCountryId: string;
  onSelectCountry: (countryId: string) => void;
}

export default function CountrySelector({ selectedCountryId, onSelectCountry }: CountrySelectorProps) {
  const { countries, getCountryById } = useTravelStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const selectedCountry = getCountryById(selectedCountryId);
  
  const filteredCountries = countries.filter(country => 
    country.nameHe.includes(searchQuery) || 
    country.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSelectCountry = (countryId: string) => {
    onSelectCountry(countryId);
    setModalVisible(false);
  };
  
  const renderCountryItem = ({ item }: { item: Country }) => (
    <Pressable
      style={[
        styles.countryItem,
        selectedCountryId === item.id && styles.selectedCountryItem
      ]}
      onPress={() => handleSelectCountry(item.id)}
    >
      <Text style={styles.countryName}>{item.nameHe}</Text>
      <Text style={styles.countryNameEn}>{item.nameEn}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Pressable 
        style={styles.selector}
        onPress={() => setModalVisible(true)}
      >
        <MapPin size={20} color={colors.primary} />
        <Text style={styles.selectorText}>
          {selectedCountry ? selectedCountry.nameHe : 'בחר מדינה'}
        </Text>
      </Pressable>
      
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
      >
        <SafeAreaView style={styles.modalContainer}>
          <Stack.Screen 
            options={{ 
              title: "בחר מדינה",
              headerShown: true,
              headerTitleAlign: 'center',
              headerLeft: () => (
                <Pressable 
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <ArrowLeft size={24} color={colors.text} />
                </Pressable>
              )
            }} 
          />
          
          <View style={styles.searchContainer}>
            <Search size={20} color={colors.muted} />
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="חפש מדינה..."
              placeholderTextColor={colors.muted}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <X size={20} color={colors.muted} />
              </Pressable>
            )}
          </View>
          
          <FlatList
            data={filteredCountries}
            renderItem={renderCountryItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.countriesList}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectorText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  closeButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    margin: 16,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
    marginRight: 8,
  },
  countriesList: {
    padding: 16,
  },
  countryItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCountryItem: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  countryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  countryNameEn: {
    fontSize: 14,
    color: colors.muted,
  }
});