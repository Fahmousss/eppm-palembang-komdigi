import { View, Text } from 'react-native';
import { BookOpen, PieChart, Newspaper, Info } from 'lucide-react-native';
import colors from '~/lib/color';
import { ContentType } from '~/config/types';

interface PostTypeBadgeProps {
  type: ContentType;
}

export default function PostTypeBadge({ type }: PostTypeBadgeProps) {
  // Configuration for different post types
  const typeConfig = {
    pengumuman: {
      label: 'Pengumuman',
      icon: <Info size={12} color={colors.primary} />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    infografis: {
      label: 'Infografis',
      icon: <PieChart size={12} color={colors.success} />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    berita: {
      label: 'News',
      icon: <Newspaper size={12} color={colors.warning} />,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
    },
  };

  const config = typeConfig[type];

  return (
    <View className={`flex-row items-center rounded-full px-2 py-1 ${config.bgColor}`}>
      {config.icon}
      <Text className={`ml-1 text-xs font-medium ${config.textColor}`}>{config.label}</Text>
    </View>
  );
}
