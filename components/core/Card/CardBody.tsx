import type { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { cn } from '~/lib/utils';

export interface CardBodyProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export default function CardBody({ children, className, contentClassName }: CardBodyProps) {
  // If children is a string, wrap it in a Text component
  const content =
    typeof children === 'string' ? (
      <Text className={cn('text-gray-700', contentClassName)}>{children}</Text>
    ) : (
      children
    );

  return <View className={cn('px-4 pb-4', className)}>{content}</View>;
}
