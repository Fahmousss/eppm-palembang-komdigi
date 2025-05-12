import type { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { cn } from '~/lib/utils';

export interface CardContentProps {
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export default function CardContent({
  title,
  description,
  children,
  className,
  titleClassName,
  descriptionClassName,
}: CardContentProps) {
  return (
    <View className={cn('p-4', className)}>
      {title && (
        <Text className={cn('mb-1 text-lg font-semibold text-gray-900', titleClassName)}>
          {title}
        </Text>
      )}
      {description && (
        <Text className={cn('text-gray-600', descriptionClassName)}>{description}</Text>
      )}
      {children}
    </View>
  );
}
