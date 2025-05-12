import { View, Text } from 'react-native';
import { Search, FileQuestion, AlertCircle } from 'lucide-react-native';
import colors from '~/lib/color';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'search' | 'question' | 'alert';
}

export default function EmptyState({ title, description, icon = 'search' }: EmptyStateProps) {
  const getIcon = () => {
    switch (icon) {
      case 'search':
        return <Search size={40} color={colors.palette.gray['400']} />;
      case 'question':
        return <FileQuestion size={40} color={colors.palette.gray['400']} />;
      case 'alert':
        return <AlertCircle size={40} color={colors.palette.gray['400']} />;
    }
  };

  return (
    <View className="items-center py-10">
      <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        {getIcon()}
      </View>
      <Text className="mb-1 text-lg font-semibold text-gray-800">{title}</Text>
      <Text className="max-w-[250px] text-center text-gray-500">{description}</Text>
    </View>
  );
}
