'use client';

// import { View, Text, ScrollView } from "react-native"
import { Text, View } from 'react-native';
import ServicePostsList from './ServicePostList';
import { ContentType } from '~/config/types';

interface RelatedContentProps {
  contentType: ContentType;
  excludeId: string;
}

export default function RelatedContent({ contentType, excludeId }: RelatedContentProps) {
  return (
    <View className="mb-6">
      <View className="mb-3 px-5">
        <Text className="text-lg font-semibold text-gray-900">Related Content</Text>
      </View>

      <ServicePostsList
        isSimple={false}
        params={{
          type: contentType,
          per_page: 3,
          exclude_id: excludeId,
        }}
      />
    </View>
  );
}
