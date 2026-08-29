import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const CATEGORIES = ['SUV', 'Sedan', 'Electric', 'Hatchback', 'Crossover', 'Coupe', 'Pickup'];

interface CategoryChipsProps {
  onSelectCategory?: (category: string) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({ onSelectCategory }) => {
  const [activeCategory, setActiveCategory] = useState<string>('SUV');

  const handlePress = (category: string) => {
    setActiveCategory(category);
    if (onSelectCategory) {
      onSelectCategory(category);
    }
  };

  return (
    <View nativeID="home-category-chips-wrapper" testID="home-category-chips-wrapper" style={styles.wrapper}>
      <ScrollView
        nativeID="home-category-chips-scrollview"
        testID="home-category-chips-scrollview"
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {CATEGORIES.map((cat) => {
          const isActive = cat === activeCategory;
          return (
            <TouchableOpacity
              key={cat}
              testID={`home-category-chip-${cat.toLowerCase()}`}
              accessibilityLabel={`Filter by ${cat}`}
              style={[styles.chip, isActive ? styles.activeChip : styles.inactiveChip]}
              onPress={() => handlePress(cat)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, isActive ? styles.activeChipText : styles.inactiveChipText]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
  },
  activeChip: {
    backgroundColor: '#0F2942', // Dark navy blue pill
  },
  inactiveChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
  inactiveChipText: {
    color: '#6B7280',
  },
});
