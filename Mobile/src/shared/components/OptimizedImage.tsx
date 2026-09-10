import React, { useState } from 'react';
import { Image, ImageProps, ImageStyle } from 'expo-image';
import { StyleSheet, View, StyleProp } from 'react-native';

export interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  uri?: string | null;
  source?: any;
  style?: StyleProp<ImageStyle>;
  aspectRatio?: number;
  contentFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  placeholderBlurhash?: string;
}

const DEFAULT_BLURHASH = 'L6PZfW_n.ayE_3t7t7R**0o#DgR*';
const FALLBACK_CAR_IMAGE = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop';

/**
 * Reusable High-Performance Image Component
 * Powered by expo-image (Glide on Android / SDWebImage on iOS)
 * Enforces memory/disk caching, responsive aspect ratio placeholders, and zero layout shifts.
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  uri,
  source,
  style,
  aspectRatio,
  contentFit = 'cover',
  placeholderBlurhash = DEFAULT_BLURHASH,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  const imageSource = hasError
    ? { uri: FALLBACK_CAR_IMAGE }
    : source
    ? source
    : uri && uri.trim().length > 0
    ? { uri }
    : { uri: FALLBACK_CAR_IMAGE };

  return (
    <View style={[styles.container, aspectRatio ? { aspectRatio } : null, style]}>
      <Image
        source={imageSource}
        style={styles.image}
        contentFit={contentFit}
        cachePolicy="memory-disk"
        transition={200}
        onError={() => setHasError(true)}
        placeholder={placeholderBlurhash ? { blurhash: placeholderBlurhash } : undefined}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

