import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { transportation } from '@/mocks/transportation';
import { airlines } from '@/mocks/airlines';
import { bookingApps } from '@/mocks/booking-apps';
import TransportationCard from '@/components/TransportationCard';
import AirlineCard from '@/components/AirlineCard';
import BookingAppCard from '@/components/BookingAppCard';
import FilterTabs from '@/components/FilterTabs';
import colors from '@/constants/colors';
import { Plane, Train, Bus, Ship, Globe, Smartphone } from 'lucide-react-native';

export default function TransportationScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [activeSection, setActiveSection] = useState('transportation');
  
  const transportationTabs = [
    { id: 'all', label: 'הכל' },
    { id: 'flight', label: 'טיסות' },
    { id: 'train', label: 'רכבות' },
    { id: 'bus', label: 'אוטובוסים' },
    { id: 'ferry', label: 'מעבורות' }
  ];
  
  const sectionTabs = [
    { id: 'transportation', label: 'תחבורה' },
    { id: 'airlines', label: 'חברות תעופה' },
    { id: 'apps', label: 'אפליקציות הזמנות' }
  ];
  
  const filteredTransportation = activeTab === 'all' 
    ? transportation 
    : transportation.filter(item => item.type === activeTab);
  
  const getSectionIcon = () => {
    switch (activeSection) {
      case 'transportation':
        return <Plane size={24} color={colors.primary} />;
      case 'airlines':
        return <Globe size={24} color={colors.primary} />;
      case 'apps':
        return <Smartphone size={24} color={colors.primary} />;
      default:
        return <Plane size={24} color={colors.primary} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "תחבורה והזמנות" }} />
      
      <View style={styles.sectionTabsContainer}>
        <FilterTabs 
          tabs={sectionTabs} 
          activeTab={activeSection} 
          onTabChange={setActiveSection} 
        />
      </View>
      
      {activeSection === 'transportation' && (
        <>
          <View style={styles.filterContainer}>
            <FilterTabs 
              tabs={transportationTabs} 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />
          </View>
          
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>
                {activeTab === 'all' 
                  ? 'כל אפשרויות התחבורה' 
                  : activeTab === 'flight' 
                    ? 'טיסות' 
                    : activeTab === 'train' 
                      ? 'רכבות' 
                      : activeTab === 'bus' 
                        ? 'אוטובוסים' 
                        : 'מעבורות'
                }
              </Text>
              <View style={styles.iconContainer}>
                {activeTab === 'all' ? (
                  <Plane size={24} color={colors.primary} />
                ) : activeTab === 'flight' ? (
                  <Plane size={24} color={colors.primary} />
                ) : activeTab === 'train' ? (
                  <Train size={24} color={colors.primary} />
                ) : activeTab === 'bus' ? (
                  <Bus size={24} color={colors.primary} />
                ) : (
                  <Ship size={24} color={colors.primary} />
                )}
              </View>
            </View>
            
            {filteredTransportation.map(item => (
              <TransportationCard key={item.id} transportation={item} />
            ))}
          </ScrollView>
        </>
      )}
      
      {activeSection === 'airlines' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>חברות תעופה מומלצות</Text>
            <View style={styles.iconContainer}>
              <Globe size={24} color={colors.primary} />
            </View>
          </View>
          
          {airlines.map(airline => (
            <AirlineCard key={airline.id} airline={airline} />
          ))}
        </ScrollView>
      )}
      
      {activeSection === 'apps' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>אפליקציות הזמנות מומלצות</Text>
            <View style={styles.iconContainer}>
              <Smartphone size={24} color={colors.primary} />
            </View>
          </View>
          
          {bookingApps.map(app => (
            <BookingAppCard key={app.id} app={app} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  sectionTabsContainer: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterContainer: {
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'flex-end',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'right',
  }
});