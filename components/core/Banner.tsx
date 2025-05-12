import {
  BadgeCheck,
  BadgeInfo,
  BadgeX,
  Check,
  CheckCircle2,
  Info,
  XCircle,
} from 'lucide-react-native';
import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '~/lib/utils';

type BannerVariant = 'success' | 'error' | 'info' | 'warning';

type BannerProps = {
  message: string;
  variant?: BannerVariant;
};

const Banner: React.FC<BannerProps> = ({ message, variant = 'info' }) => {
  if (!message) return null;

  // Map variant to specific styles
  const variantStyles = {
    success: {
      container: 'bg-green-50 border-green-200 text-green-600',
      icon: 'text-green-500',
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-600',
      icon: 'text-red-500',
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-600',
      icon: 'text-blue-500',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-600',
      icon: 'text-yellow-500',
    },
  };

  const styles = variantStyles[variant];

  // Use cn utility function to merge classNames
  return (
    <View className={cn('mb-4 flex-row gap-2 rounded-md border p-3', styles.container)}>
      {variant === 'success' && <BadgeCheck color="green" size={20} />}
      {variant === 'error' && <BadgeX color="red" size={20} />}
      {variant === 'info' && <BadgeInfo color={'blue'} size={20} />}
      {variant === 'warning' && <BadgeInfo color={'orange'} size={20} />}
      <Text className={cn('text-sm', styles.icon)}>{message}</Text>
    </View>
  );
};

export default Banner;
