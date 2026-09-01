import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useLanguage } from '../../src/shared/context/LanguageContext';

export default function TabLayout() {
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      {/* 1. Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav.home'),
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={22}
                color={color}
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />

      {/* 2. Search Tab */}
      <Tabs.Screen
        name="search"
        options={{
          title: t('nav.catalog'),
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name={focused ? 'search' : 'search-outline'}
                size={22}
                color={color}
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />

      {/* 3. Compare Tab */}
      <Tabs.Screen
        name="compare"
        options={{
          title: t('nav.compare'),
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name={focused ? 'car' : 'car-outline'}
                size={22}
                color={color}
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />

      {/* 4. News Tab */}
      <Tabs.Screen
        name="news"
        options={{
          title: t('nav.news'),
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name={focused ? 'newspaper' : 'newspaper-outline'}
                size={22}
                color={color}
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />

      {/* 5. Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: t('nav.profile'),
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconContainer}>
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={22}
                color={color}
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />

      {/* Hide deprecated two.tsx tab */}
      <Tabs.Screen
        name="two"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0F2942', // Dark navy blue matching screenshot
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 85 : 68,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeDot: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C92A2A', // Accent red active dot
  },
});
