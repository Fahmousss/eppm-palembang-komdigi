'use client';

import { useState } from 'react';
import { Image, View, ActivityIndicator, type ImageSourcePropType, Text } from 'react-native';
import { cn } from '~/lib/utils';

export interface CardImageProps {
  source: ImageSourcePropType | string;
  alt?: string;
  height?: number;
  className?: string;
  position?: 'top' | 'bottom' | 'center';
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

export default function CardImage({
  source,
  alt,
  height = 200,
  className,
  position = 'center',
  resizeMode = 'cover',
}: CardImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Handle string source (URL)
  const imageSource = typeof source === 'string' ? { uri: source } : source;

  // Position styles
  const positionStyles = {
    top: 'justify-start',
    center: 'justify-center',
    bottom: 'justify-end',
  };

  return (
    <View style={{ height }} className={cn('relative w-full bg-gray-100', className)}>
      <Image
        source={imageSource}
        accessibilityLabel={alt}
        className="h-full w-full"
        resizeMode={resizeMode}
        onLoadStart={() => setLoading(true)}
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />

      {/* Loading indicator */}
      {loading && (
        <View className="absolute inset-0 items-center justify-center">
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      )}

      {/* Error state */}
      {error && (
        <View className="absolute inset-0 items-center justify-center bg-gray-200">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-gray-300">
            <Text className="text-lg text-gray-500">!</Text>
          </View>
        </View>
      )}
    </View>
  );
}
