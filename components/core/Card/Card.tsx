import type { ReactNode } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { cn } from '~/lib/utils';

export interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
  style?: any;
  elevation?: 'none' | 'small' | 'medium' | 'large';
  variant?: 'default' | 'outlined' | 'flat';
}

export default function Card({
  children,
  onPress,
  className,
  style,
  elevation = 'medium',
  variant = 'default',
}: CardProps) {
  // Define shadow styles based on elevation
  const shadowStyles = {
    none: {},
    small: {
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    medium: {
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    large: {
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
  };

  // Define variant styles
  const variantStyles = {
    default: 'bg-white',
    outlined: 'bg-white border border-gray-200',
    flat: 'bg-gray-50',
  };

  // Combine styles
  const cardStyles = cn(
    'rounded-xl overflow-hidden',
    variantStyles[variant],
    variant !== 'flat' && elevation !== 'none' && 'shadow-black',
    className
  );

  // Wrapper component based on whether onPress is provided
  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      style={[shadowStyles[elevation], style]}
      className={cardStyles}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}>
      {children}
    </CardWrapper>
  );
}
