import type React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { cn } from '~/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  title?: string;
  children?: React.ReactNode;
  className?: string;
  textClassName?: string;
  iconOnly?: boolean;
}

export default function Button({
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
  title,
  children,
  className,
  textClassName,
  iconOnly = false,
}: ButtonProps) {
  // Determine if the button is in a non-interactive state
  const isDisabled = disabled || loading;

  // Base styles for different button variants
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          button: 'bg-blue-600 active:bg-blue-700',
          text: 'text-white font-medium',
          disabled: 'bg-blue-400',
        };
      case 'secondary':
        return {
          button: 'bg-gray-200 active:bg-gray-300',
          text: 'text-gray-800 font-medium',
          disabled: 'bg-gray-100',
        };
      case 'danger':
        return {
          button: 'bg-red-600 active:bg-red-700',
          text: 'text-white font-medium',
          disabled: 'bg-red-400',
        };
      case 'ghost':
        return {
          button: 'bg-transparent active:bg-gray-100',
          text: 'text-gray-800 font-medium',
          disabled: 'opacity-50 bg-transparent',
        };

      case 'link':
        return {
          button: '',
          text: 'text-blue-600 text-sm',
          disabled: 'text-gray-100',
        };
      default:
        return {
          button: 'bg-blue-600 active:bg-blue-700',
          text: 'text-white font-medium',
          disabled: 'bg-blue-400',
        };
    }
  };

  // Size styles for different button sizes
  const getSizeStyles = () => {
    if (iconOnly) {
      switch (size) {
        case 'small':
          return {
            button: 'p-1.5 min-h-[32px] min-w-[32px]',
            text: 'text-sm',
          };
        case 'medium':
          return {
            button: 'p-2 min-h-[40px] min-w-[40px]',
            text: 'text-base',
          };
        case 'large':
          return {
            button: 'p-2.5 min-h-[48px] min-w-[48px]',
            text: 'text-lg',
          };
      }
    } else {
      switch (size) {
        case 'small':
          return {
            button: 'px-3 py-1.5 min-h-[32px]',
            text: 'text-sm',
          };
        case 'medium':
          return {
            button: 'px-4 py-2 min-h-[40px]',
            text: 'text-base',
          };
        case 'large':
          return {
            button: 'px-5 py-2.5 min-h-[48px]',
            text: 'text-lg',
          };
      }
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      className={cn(
        'flex-row items-center justify-center rounded-md',
        iconOnly && 'aspect-square',
        variantStyles.button,
        sizeStyles?.button,
        isDisabled && variantStyles.disabled,
        className
      )}>
      {loading && (
        <View className={cn(!iconOnly && 'mr-2')}>
          <ActivityIndicator
            size={size === 'large' ? 'small' : 'small'}
            color={variant === 'secondary' || variant === 'ghost' ? '#1F2937' : '#FFFFFF'}
          />
        </View>
      )}

      {!loading || !iconOnly
        ? children || (
            <Text
              className={cn(
                'text-center',
                sizeStyles?.text,
                variantStyles.text,
                isDisabled && 'opacity-70',
                textClassName
              )}>
              {title}
            </Text>
          )
        : null}
    </Pressable>
  );
}
