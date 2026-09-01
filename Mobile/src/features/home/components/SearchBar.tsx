import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useLanguage } from '../../../shared/context/LanguageContext';

interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onFilterPress?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onFilterPress,
}) => {
  const { t } = useLanguage();

  return (
    <View nativeID="home-search-bar-container" testID="home-search-bar-container" style={styles.container}>
      {/* Input Box */}
      <View nativeID="home-search-input-box" testID="home-search-input-box" style={styles.inputContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          nativeID="home-search-text-input"
          testID="home-search-text-input"
          accessibilityLabel="Search vehicle catalog"
          style={styles.input}
          placeholder={t('home.searchPlaceholder')}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
        />
      </View>

      {/* Filter Button Icon */}
      <TouchableOpacity
        testID="home-search-filter-button"
        accessibilityLabel="Open Vehicle Filters"
        style={styles.filterButton}
        onPress={onFilterPress}
        activeOpacity={0.8}
      >
        <Ionicons name="options-outline" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1F2937',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0F2942', // Dark navy blue from design
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F2942',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
