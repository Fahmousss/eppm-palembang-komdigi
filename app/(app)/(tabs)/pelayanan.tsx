import { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '~/components/app/Header';
import ServicePostsList from '~/components/app/ServicePostList';
import SearchBar from '~/components/core/SearchBar';
import TypeFilter from '~/components/core/TypeFilter';
import { ContentType } from '~/config/types';

export default function PelayananScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ContentType>();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <ScrollView>
        <View className="mb-3 px-5">
          <SearchBar
            placeholder="Search educational content"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
        </View>
        <TypeFilter selectedType={selectedType} onSelectType={setSelectedType} />

        {/* Latest */}
        <View className="mb-6">
          <View className="px-5">
            <Header title="Latest Updates" actionText="See All" actionLink="/posts" />
          </View>
          <ServicePostsList
            isSimple={false}
            params={{
              latest: false,
              per_page: 3,
            }}
          />
        </View>

        {/* News */}
        <View className="mb-6">
          <View className="px-5">
            <Header title="Latest News" actionText="See All" actionLink="/posts" />
          </View>
          <ServicePostsList
            isSimple={false}
            params={{
              latest: true,
              per_page: 3,
              type: 'berita',
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
