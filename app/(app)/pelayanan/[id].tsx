'use client';

import { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Share,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useFetch } from '~/hooks/useFetch';
import {
  ChevronLeft,
  Share2,
  Bookmark,
  BookmarkCheck,
  Clock,
  Calendar,
  User,
} from 'lucide-react-native';
import { formatDistanceToNow, formatDate } from '~/lib/date';
import PostTypeBadge from '~/components/app/PostTypeBadge';
import RelatedContent from '~/components/app/RelatedContents';
import RenderHtml from '~/components/core/RenderHtml';
import { colors } from '~/lib/color';
import { useBookmarks } from '~/hooks/useBookmarks';
import { Content } from '~/config/types';
import { SafeAreaView } from '~/components/core/SafeAreaView';

export default function PelayananDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  // Fetch the content detail
  const {
    data: content,
    isLoading,
    error,
  } = useFetch<Content>({
    endpoint: `/contents/${id}`,
    enabled: !!id,
  });

  // Bookmarks functionality
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = content ? isBookmarked(content.id) : false;

  // Handle share functionality
  const handleShare = async () => {
    if (!content) return;

    try {
      await Share.share({
        message: `Check out this ${content.type}: ${content.title}\n\nhttps://yourapp.com/pelayanan/${content.id}`,
      });
    } catch (error) {
      console.error('Error sharing content:', error);
    }
  };

  // Handle scroll events to change header appearance
  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setIsScrolled(scrollY > 60);
  };

  // Format reading time (for articles)
  const getReadingTime = (text: string | Record<string, any>) => {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  if (isLoading) {
    return (
      <SafeAreaView edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !content) {
    return (
      <SafeAreaView edges={['top']}>
        <View className="flex-1 items-center justify-center p-5">
          <Text className="mb-2 text-lg font-medium text-gray-800">Content not found</Text>
          <Text className="mb-4 text-center text-gray-600">
            The content you&apos;re looking for might have been removed or is temporarily
            unavailable.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="rounded-md bg-blue-600 px-4 py-2">
            <Text className="font-medium text-white">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']}>
      {/* Floating Header */}
      <View
        className={`absolute left-0 right-0 top-9 z-10 flex-row items-center justify-between px-4 py-3 ${
          isScrolled ? 'border-b border-gray-200 bg-white' : 'bg-transparent'
        }`}>
        <TouchableOpacity
          onPress={() => router.back()}
          className={`rounded-full p-2 ${isScrolled ? 'bg-gray-100' : 'bg-white/80'}`}>
          <ChevronLeft size={24} color={colors.palette.gray[400]} />
        </TouchableOpacity>

        <View className="flex-row">
          <TouchableOpacity
            onPress={handleShare}
            className={`mr-2 rounded-full p-2 ${isScrolled ? 'bg-gray-100' : 'bg-white/80'}`}>
            <Share2 size={20} color={colors.palette.gray[400]} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => toggleBookmark(content)}
            className={`rounded-full p-2 ${isScrolled ? 'bg-gray-100' : 'bg-white/80'}`}>
            {bookmarked ? (
              <BookmarkCheck size={20} color={colors.primary} />
            ) : (
              <Bookmark size={20} color={colors.palette.gray[400]} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        {/* Content Header */}
        <View>
          <Image source={{ uri: content.image_url }} className="h-56 w-full" resizeMode="cover" />

          {/* Content Info */}
          <View className="px-5 pb-2 pt-4">
            <View className="mb-2 flex-row items-center">
              <PostTypeBadge type={content.type} />
              <Text className="ml-2 text-xs text-gray-500">
                {formatDistanceToNow(new Date(content.created_at))}
              </Text>
            </View>

            <Text className="mb-2 text-2xl font-bold text-gray-900">{content.title}</Text>

            {/* Author and Date Info */}
            <View className="mb-4 flex-row items-center">
              <View className="mr-2 h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                <User size={16} color={colors.palette.gray[400]} />
              </View>
              <View>
                <Text className="text-sm font-medium text-gray-800">
                  {content.created_by || 'Admin'}
                </Text>
                <View className=" flex-row items-center">
                  <Calendar size={12} color={colors.palette.gray[400]} />
                  <Text className="ml-1 mr-3 text-xs text-gray-500">
                    {formatDate(new Date(content.created_at))}
                  </Text>

                  {content.type === 'pengumuman' && (
                    <>
                      <Clock size={12} color={colors.palette.gray[400]} className="ml-2" />
                      <Text className="ml-1 text-xs text-gray-500">
                        {getReadingTime(content.content || '')}
                      </Text>
                    </>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Content Divider */}
        <View className="mb-4 h-1 bg-gray-100" />

        {/* Main Content */}
        <View className="mb-6 px-5">
          {content.description && (
            <Text className="mb-3 text-base font-medium text-gray-800">{content.description}</Text>
          )}
          {content.content && <RenderHtml html={content.content} />}
        </View>

        {/* Tags
        {content.type && content.type.length > 0 && (
          <View className="mb-6 px-5">
            <Text className="mb-2 text-base font-semibold">Tags</Text>
            <View className="flex-row flex-wrap">
              {content.type.map((tag: string, index: number) => (
                <TouchableOpacity
                  key={index}
                  className="mb-2 mr-2 rounded-full bg-gray-100 px-3 py-1">
                  <Text className="text-sm text-gray-700">#{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )} */}

        {/* Related Content */}
        <RelatedContent contentType={content.type} excludeId={content.id} />

        {/* Bottom Padding */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
