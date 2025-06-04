import { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import Header from '~/components/app/Header';
import ServicePostsList from '~/components/app/ServicePostList';
import { SafeAreaView } from '~/components/core/SafeAreaView';
import SearchBar from '~/components/core/SearchBar';
import TypeFilter from '~/components/core/TypeFilter';
import { ContentType } from '~/config/types';
import { useAppData } from '~/context/AppDataContext';

export default function PelayananScreen() {
  // State for search and filter
  const { triggerRefresh } = useAppData();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ContentType | 'all'>('all');

  // Debounce search query to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Determine if we're showing filtered results
  const isFiltering =
    debouncedSearchQuery !== '' || (selectedType !== 'all' && selectedType !== undefined);

  // Handle search clear
  const handleClearSearch = () => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
  };
  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    triggerRefresh();
    setRefreshing(false);
  };
  return (
    <SafeAreaView edges={['top']}>
      <ScrollView
        stickyHeaderIndices={[0]}
        refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}
        showsVerticalScrollIndicator={false}>
        {/* Search and Filter Section (Sticky) */}
        <View className="z-10 bg-white pb-3 pt-2">
          <View className="mb-3 px-5">
            <SearchBar
              placeholder="Cari berita, pengumuman, infografis"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onClear={handleClearSearch}
            />
          </View>
          <TypeFilter selectedType={selectedType} onSelectType={setSelectedType} />
        </View>

        {/* Content Sections */}
        {isFiltering ? (
          // Filtered results section
          <View className="mb-6">
            <View className="px-5">
              <Header
                title={
                  debouncedSearchQuery
                    ? `Search Results${selectedType !== 'all' ? ` - ${selectedType}` : ''}`
                    : `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}`
                }
              />
            </View>
            <ServicePostsList
              isSimple={false}
              params={{
                search: debouncedSearchQuery,
                type: selectedType === 'all' ? undefined : selectedType,
                per_page: 10,
              }}
            />
          </View>
        ) : (
          // Default sections when no filters applied
          <>
            {/* Latest Updates Section */}
            <View className="mb-6">
              <View className="px-5">
                <Header title="Update Terbaru" />
              </View>
              <ServicePostsList
                isSimple={false}
                params={{
                  latest: true,
                  per_page: 3,
                }}
              />
            </View>

            {/* News Section */}
            <View className="mb-6">
              <View className="px-5">
                <Header title="Berita Hangat" />
              </View>
              <ServicePostsList
                isSimple={true}
                params={{
                  latest: true,
                  type: 'berita',
                }}
              />
            </View>

            {/* Articles Section */}
            <View className="mb-6">
              <View className="px-5">
                <Header title="Pengumuman" />
              </View>
              <ServicePostsList
                isSimple={false}
                params={{
                  type: 'pengumuman',
                  per_page: 3,
                }}
              />
            </View>

            {/* Infographics Section */}
            <View className="mb-6">
              <View className="px-5">
                <Header title="Infografis" actionText="See All" />
              </View>
              <ServicePostsList
                isSimple={true}
                params={{
                  type: 'infografis',
                }}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
