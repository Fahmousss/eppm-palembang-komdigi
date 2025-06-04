import { View, Text } from 'react-native';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  bgColor: string;
}

export default function StatCard({ title, value, icon, bgColor }: StatCardProps) {
  return (
    <View className="items-center">
      <View className={`${bgColor} mb-2 h-12 w-12 items-center justify-center rounded-full`}>
        {icon}
      </View>
      <Text className="text-lg font-bold text-gray-900">{value}</Text>
      <Text className="text-xs text-gray-600">{title}</Text>
    </View>
  );
}
