'use client';

import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { cn } from '../../lib/utils';
import colors from '../../lib/color';
import { type ContentType } from '~/config/types';

interface TypeFilterProps {
  selectedType: ContentType | undefined;
  onSelectType: (type: ContentType) => void;
}

export default function TypeFilter({ selectedType, onSelectType }: TypeFilterProps) {
  const filterTypes: { value: ContentType | string; label: string }[] = [
    { value: 'all', label: 'Semua' },
    { value: 'pengumuman', label: 'Pengumuman' },
    { value: 'berita', label: 'Berita' },
    { value: 'infografis', label: 'Infografis' },
  ];

  // Get color for filter type
  const getTypeColor = (type: ContentType) => {
    switch (type) {
      case 'berita':
        return colors.warning;
      case 'pengumuman':
        return colors.primary;
      case 'infografis':
        return colors.success;
      default:
        return colors.palette.gray['700'];
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-5 pb-2"
      className="flex-grow">
      {filterTypes.map((type) => {
        const isSelected = selectedType === type.value;
        const typeColor =
          type.value === 'all' ? colors.palette.gray['700'] : getTypeColor(type.value);

        return (
          <TouchableOpacity
            key={type.value}
            onPress={() => onSelectType(type.value)}
            className={cn(
              'mr-2 rounded-full px-4 py-1.5',
              isSelected ? 'bg-opacity-10' : 'bg-gray-100'
            )}
            style={{
              backgroundColor: isSelected ? `${typeColor}20` : undefined,
              borderWidth: isSelected ? 1 : 0,
              borderColor: typeColor,
            }}>
            <Text
              style={{
                color: typeColor,
                fontWeight: isSelected ? '600' : '400',
              }}
              className="text-sm">
              {type.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
