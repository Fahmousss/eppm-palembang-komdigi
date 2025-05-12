import { View, Text, Pressable } from 'react-native';
import { Card, CardImage } from '../core/Card';
import { formatDistanceToNow } from '../../lib/date';
import PostTypeBadge from './PostTypeBadge';
import { Content } from '~/config/types';

interface ServicePostItemProps {
  post: Content;
  simple: boolean;
}

export default function ServicePostItem({ post, simple }: ServicePostItemProps) {
  const formattedDate = formatDistanceToNow(new Date(post.created_at));

  return (
    <Pressable
      onPress={() => console.log(`Navigate to post ${post.id}`)}
      className={simple ? 'mb-4' : 'mb-2 mr-4'}>
      <Card className={simple ? 'w-full' : 'w-[280px]'} elevation="small">
        {!simple && post.image_url && (
          <CardImage
            position="top"
            height={100}
            source={{ uri: post.image_url }}
            className=" w-full rounded-t-xl"
            resizeMode="cover"
          />
        )}
        <View className="p-3">
          <View className="mb-2 flex-row items-center justify-between">
            <PostTypeBadge type={post.type} />
            <Text className="text-xs text-gray-500">{formattedDate}</Text>
          </View>
          <Text className="mb-1 text-base font-semibold text-gray-900">{post.title}</Text>
          <Text className="text-sm text-gray-600" numberOfLines={2}>
            {post.created_by}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
}
