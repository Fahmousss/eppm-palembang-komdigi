import type { ReactNode } from 'react';
import { View } from 'react-native';
import { cn } from '~/lib/utils';

export interface CardFooterProps {
  children: ReactNode;
  className?: string;
  bordered?: boolean;
}

export default function CardFooter({ children, className, bordered = false }: CardFooterProps) {
  return (
    <View className={cn('px-4 py-3', bordered && 'border-t border-gray-100', className)}>
      {children}
    </View>
  );
}
