import type { ReactNode } from 'react';
import { View, Text, Image } from 'react-native';
import { cn } from '~/lib/utils';

export interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  avatar?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export default function CardHeader({
  title,
  subtitle,
  avatar,
  icon,
  action,
  className,
  titleClassName,
  subtitleClassName,
}: CardHeaderProps) {
  return (
    <View className={cn('flex-row items-center p-4', className)}>
      {/* Avatar or Icon */}
      {avatar && <Image source={{ uri: avatar }} className="mr-3 h-10 w-10 rounded-full" />}
      {!avatar && icon && <View className="mr-3">{icon}</View>}

      {/* Title and Subtitle */}
      <View className="flex-1">
        {title && (
          <Text className={cn('text-lg font-semibold text-gray-900', titleClassName)}>{title}</Text>
        )}
        {subtitle && (
          <Text className={cn('text-sm text-gray-500', subtitleClassName)}>{subtitle}</Text>
        )}
      </View>

      {/* Action */}
      {action && <View>{action}</View>}
    </View>
  );
}
