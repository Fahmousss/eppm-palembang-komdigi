import { View } from 'react-native';
import Header from './Header';
import ServicePostsList from './ServicePostList';

export default function ServicePostsSection() {
  return (
    <View className="mb-6">
      <View className="px-5">
        <Header title="Latest Updates" actionText="See All" actionLink="/posts" />
      </View>
      <ServicePostsList isSimple={false} params={{ latest: true, per_page: 3 }} />
    </View>
  );
}
