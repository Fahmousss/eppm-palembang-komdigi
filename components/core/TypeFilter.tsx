'use client';

import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { ContentType } from '~/config/types';
import { colors } from '~/lib/color';

interface TypeFilterProps {
  selectedType: ContentType | 'all';
  onSelectType: (type: ContentType | 'all') => void;
}

export default function TypeFilter({ selectedType, onSelectType }: TypeFilterProps) {
  const filterTypes: { value: ContentType | 'all'; label: string }[] = [
    { value: 'all', label: 'Semua' },
    { value: 'berita', label: 'Berita' },
    { value: 'pengumuman', label: 'Pengumuman' },
    { value: 'infografis', label: 'Infografis' },
    // Add other content types as needed
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-5 pb-2"
      className="flex-grow">
      {filterTypes.map((type) => {
        const isSelected = selectedType === type.value;
        const typeColor = type.value === 'all' ? colors.palette.gray[400] : colors.primary;

        return (
          <TouchableOpacity
            key={type.value}
            onPress={() => onSelectType(type.value)}
            className={`mr-2 rounded-full px-4 py-1.5 ${isSelected ? 'border' : 'bg-gray-100'}`}
            style={{
              backgroundColor: isSelected ? `${typeColor}20` : undefined,
              borderColor: isSelected ? typeColor : 'transparent',
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
