import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ArticleDetailsScreen } from '../../src/features/news/screens/ArticleDetailsScreen';

export default function ArticleDetailsRoute() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  return <ArticleDetailsScreen slug={slug} />;
}
