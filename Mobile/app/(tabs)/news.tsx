import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function NewsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Automotive News & Price Trends</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
});
