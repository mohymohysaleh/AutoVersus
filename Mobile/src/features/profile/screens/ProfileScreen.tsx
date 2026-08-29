import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SavedVehiclesTab } from '../components/SavedVehiclesTab';
import { SavedComparisonsTab } from '../components/SavedComparisonsTab';
import { AccountSettingsTab } from '../components/AccountSettingsTab';

export const ProfileScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'saved' | 'comparisons' | 'account'>('saved');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Row */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.collectionLabel}>SAVED COLLECTION</Text>
          <Text style={styles.mainTitle}>My Garage</Text>
        </View>

        <TouchableOpacity style={styles.editButton} activeOpacity={0.7}>
          <Ionicons name="pencil-outline" size={18} color="#0F2942" />
        </TouchableOpacity>
      </View>

      {/* 3-Tab Pill Switcher Bar */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabPill, activeTab === 'saved' && styles.tabPillActive]}
          onPress={() => setActiveTab('saved')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'saved' && styles.tabTextActive]}>
            Saved Vehicles (6)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabPill, activeTab === 'comparisons' && styles.tabPillActive]}
          onPress={() => setActiveTab('comparisons')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'comparisons' && styles.tabTextActive]}>
            Comparisons (2)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabPill, activeTab === 'account' && styles.tabPillActive]}
          onPress={() => setActiveTab('account')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'account' && styles.tabTextActive]}>
            Account
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab View Content Body */}
      <View style={styles.tabContent}>
        {activeTab === 'saved' && <SavedVehiclesTab />}
        {activeTab === 'comparisons' && <SavedComparisonsTab />}
        {activeTab === 'account' && <AccountSettingsTab />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  collectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#C92A2A',
    letterSpacing: 1,
    marginBottom: 2,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F2942',
  },
  editButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 4,
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  tabPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabPillActive: {
    backgroundColor: '#0F2942',
    shadowColor: '#0F2942',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabContent: {
    flex: 1,
  },
});
