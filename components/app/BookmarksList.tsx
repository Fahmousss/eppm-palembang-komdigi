'use client';

import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Bookmark, ChevronRight, Trash2, AlertCircle } from 'lucide-react-native';
import { colors } from '~/lib/color';
import { formatDistanceToNow } from '~/lib/date';
import { useBookmarks } from '../../hooks/useBookmarks';
import PostTypeBadge from './PostTypeBadge';

interface BookmarksListProps {
  bookmarks: any[];
}

export default function BookmarksList({ bookmarks }: BookmarksListProps) {
  const { removeBookmark } = useBookmarks();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Handle viewing a bookmark
  const handleViewBookmark = (bookmark: any) => {
    // Navigate to the appropriate screen based on bookmark type
    if (bookmark.type) {
      router.push({ pathname: '/pelayanan/[id]', params: { id: bookmark.id } });
    }
  };

  // Toggle item expansion
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Render empty state
  if (!bookmarks || bookmarks.length === 0) {
    return (
      <View className="items-center justify-center px-4 py-16">
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Bookmark size={28} color={colors.palette.gray['400']} />
        </View>
        <Text className="mb-1 text-lg font-semibold text-gray-900">No bookmarks yet</Text>
        <Text className="text-center text-gray-600">
          Items you bookmark will appear here for easy access.
        </Text>
      </View>
    );
  }

  return (
    <View className="px-5 pb-6">
      <View className="mb-3 mt-4 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-gray-900">
          Saved Items ({bookmarks.length})
        </Text>
        <TouchableOpacity onPress={() => console.log('Filter bookmarks')}>
          <Text className="text-sm text-blue-600">Filter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <BookmarkItem
            bookmark={item}
            isExpanded={expandedId === item.id}
            onToggleExpand={() => toggleExpand(item.id)}
            onView={() => handleViewBookmark(item)}
            onRemove={() => removeBookmark(item.id)}
          />
        )}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View className="h-3" />}
      />
    </View>
  );
}

interface BookmarkItemProps {
  bookmark: any;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onView: () => void;
  onRemove: () => void;
}

function BookmarkItem({
  bookmark,
  isExpanded,
  onToggleExpand,
  onView,
  onRemove,
}: BookmarkItemProps) {
  // Format the bookmark date
  const timeAgo = bookmark.bookmarkedAt
    ? formatDistanceToNow(new Date(bookmark.bookmarkedAt))
    : 'Unknown time';

  return (
    <View className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <TouchableOpacity onPress={onToggleExpand} className="flex-row p-3" activeOpacity={0.7}>
        {/* Thumbnail or Icon */}
        {bookmark.imageUrl ? (
          <Image
            source={{ uri: bookmark.imageUrl }}
            className="mr-3 h-16 w-16 rounded-lg"
            resizeMode="cover"
          />
        ) : (
          <View className="mr-3 h-16 w-16 items-center justify-center rounded-lg bg-gray-100">
            <AlertCircle size={24} color={colors.palette.gray['400']} />
          </View>
        )}

        {/* Content */}
        <View className="flex-1">
          <View className="mb-1 flex-row items-center">
            {bookmark.type && <PostTypeBadge type={bookmark.type} />}
            <Text className="ml-auto text-xs text-gray-500">Saved {timeAgo}</Text>
          </View>

          <Text className="mb-1 text-base font-semibold text-gray-900" numberOfLines={2}>
            {bookmark.title}
          </Text>

          <Text className="text-sm text-gray-600" numberOfLines={1}>
            {bookmark.description || 'No description available'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Expanded actions */}
      {isExpanded && (
        <View className="flex-row justify-end border-t border-gray-100 bg-gray-50 p-3">
          <TouchableOpacity
            onPress={onRemove}
            className="mr-2 flex-row items-center rounded-lg bg-red-50 px-3 py-2">
            <Trash2 size={16} color={colors.danger} />
            <Text className="ml-1 text-sm font-medium text-red-600">Remove</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onView}
            className="flex-row items-center rounded-lg bg-blue-50 px-3 py-2">
            <Text className="mr-1 text-sm font-medium text-blue-600">View</Text>
            <ChevronRight size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
