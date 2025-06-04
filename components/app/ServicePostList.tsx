import { ActivityIndicator, ScrollView, View } from 'react-native';
import ServicePostItem from './ServicePostItem';
import { Content, ContentType } from '~/config/types';
import { colors } from '~/lib/color';
import Banner from '../core/Banner';
import { useFetch } from '~/hooks/useFetch';
import EmptyState from '../core/EmptyState';

interface Param {
  latest?: boolean;
  type?: ContentType;
  per_page?: number;
  search?: string;
  exclude_id?: string;
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
      <View className="flex-1 items-center justify-center bg-white py-8">
        <ActivityIndicator size={'large'} color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return <Banner variant="error" message={error.message} />;
  }

  // Handle empty results
  if (!contents || contents.length === 0) {
    return (
      <View className="px-5">
        <EmptyState
          title="No content found"
          description={
            params.search
              ? "Try adjusting your search or filters to find what you're looking for."
              : 'No content available at the moment.'
          }
          icon="search"
        />
      </View>
    );
  }

  return (
    <ScrollView
      horizontal={!isSimple}
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-5 pt-2"
      className="flex-grow">
      {contents.map((content) => (
        <ServicePostItem key={content.id} post={content} simple={isSimple} />
      ))}
    </ScrollView>
  );
}
