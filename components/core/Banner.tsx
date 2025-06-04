import { BadgeCheck, BadgeX, BadgeInfo, TriangleAlert } from 'lucide-react-native';
import React from 'react';
import { View, Text } from 'react-native';
import { cn } from '~/lib/utils';
import Button, { ButtonVariant } from './Button';

type BannerVariant = 'success' | 'error' | 'info' | 'warning';

type BannerProps = {
  title?: string;
  message: string;
  variant?: BannerVariant;
  action?: () => void;
  actionLabel?: string;
  buttonVariant?: ButtonVariant;
};

const Banner: React.FC<BannerProps> = ({
  title,
  message,
  variant = 'info',
  action,
  actionLabel = 'Action',
  buttonVariant = 'primary',
}) => {
  if (!message) return null;

  // Map banner variant to styles
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

  const renderIcon = () => {
    switch (variant) {
      case 'success':
        return <BadgeCheck color="green" size={20} />;
      case 'error':
        return <BadgeX color="red" size={20} />;
      case 'warning':
        return <TriangleAlert color="orange" size={20} />;
      default:
        return <BadgeInfo color="blue" size={20} />;
    }
  };

  return (
    <View
      className={cn(
        'mb-4 items-start justify-between gap-3 rounded-md border p-3',
        styles.container
      )}>
      <View className="flex-1 flex-row items-center gap-2">
        {renderIcon()}
        <View>
          {title && <Text className={cn('flex-1 font-bold', styles.icon)}>{title}</Text>}
          <Text className={cn('flex-1 text-sm', styles.icon)}>{message}</Text>
        </View>
      </View>

      {action && (
        <Button size={'small'} variant={buttonVariant} title={actionLabel} onPress={action} />
      )}
    </View>
  );
};

export default Banner;
