import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '~/lib/color';
import { router } from 'expo-router';

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  actionLink?: string;
}

export default function Header({ title, actionText, actionLink }: SectionHeaderProps) {
  return (
    <View className="mb-4 flex-row items-center justify-between">
      <Text className="text-lg font-semibold text-gray-900">{title}</Text>
      {actionText && actionLink && (
        <TouchableOpacity onPress={() => router.push(actionLink)} className="flex-row items-center">
          <Text className="mr-1 text-sm font-medium text-blue-600">{actionText}</Text>
          <ChevronRight size={16} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}
