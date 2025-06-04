import { View, FlatList, ActivityIndicator } from 'react-native';
import { colors } from '~/lib/color';

import ComplaintItem from './ComplaintItem';
import EmptyState from '../core/EmptyState';
import Header from './Header';

interface RecentComplaintsSectionProps {
  complaints: any[];
  isLoading: boolean;
  onViewAll: string;
  onViewDetail: (id: string) => void;
}

export default function RecentComplaintsSection({
  complaints,
  isLoading,
  onViewAll,
  onViewDetail,
}: RecentComplaintsSectionProps) {
  return (
    <View className="mb-6 px-5">
      <Header title="Pengaduan Terbaru" actionText="Lihat Semua" actionLink="" />

      {isLoading ? (
        <View className="items-center justify-center py-8">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : !complaints || complaints.length === 0 ? (
        <EmptyState
          icon="alert"
          title="Belum ada pengaduan"
          description="Anda belum mengajukan pengaduan. Ketika Anda mengajukan, pengaduan akan muncul di sini."
        />
      ) : (
        <FlatList
          data={complaints}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ComplaintItem complaint={item} onPress={() => onViewDetail(item.id)} />
          )}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View className="h-3" />}
        />
      )}
    </View>
  );
}
