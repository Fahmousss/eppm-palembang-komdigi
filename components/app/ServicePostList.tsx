'use client';

import { ActivityIndicator, ScrollView, ScrollViewProps, View } from 'react-native';
import ServicePostItem from './ServicePostItem';
import { Content, ContentType } from '~/config/types';
import { colors } from '~/lib/color';
import Banner from '../core/Banner';
import { useFetch } from '~/hooks/useFetch';

interface Param {
  latest?: boolean;
  type?: ContentType;
  per_page?: number;
}

interface ServicePostListProps {
  params: Param;
  isSimple: boolean;
}

export default function ServicePostsList({ params, isSimple }: ServicePostListProps) {
  const {
    data: contents,
    isLoading,
    error,
  } = useFetch<Content[]>({ endpoint: `/contents`, params: params });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size={'large'} color={colors.primary} />
      </View>
    );
  }
  if (error) {
    return <Banner variant="error" message={error} />;
  }
  console.log(contents);

  return (
    <ScrollView
      horizontal={!isSimple}
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-5 pt-2"
      className="flex-grow">
      {contents?.map((content) => (
        <ServicePostItem key={content.id} post={content} simple={isSimple} />
      ))}
    </ScrollView>
  );
}
