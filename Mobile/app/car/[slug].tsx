import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { CarDetailsScreen } from '../../src/features/catalog/screens/CarDetailsScreen';

export default function CarDetailsRoute() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  return <CarDetailsScreen slug={slug} />;
}
