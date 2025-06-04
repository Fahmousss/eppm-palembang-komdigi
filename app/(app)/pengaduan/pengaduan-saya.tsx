'use client';

import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  SortDesc,
  SortAsc,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
} from 'lucide-react-native';
import { useFetch } from '~/hooks/useFetch';
import { colors } from '~/lib/color';
import { formatDistanceToNow } from '~/lib/date';
import EmptyState from '~/components/core/EmptyState';
import { useSession } from '~/context/AuthContext';
import { useAppData } from '~/context/AppDataContext';
import { SafeAreaView } from '~/components/core/SafeAreaView';

export default function MyComplaintsScreen() {
  const { triggerRefresh } = useAppData();
  const router = useRouter();
  const { user } = useSession();
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Fetch user's complaints
  const {
    data: complaints,
    isLoading,
    error,
  } = useFetch({
    endpoint: '/complaints',
    params: {
      user_id: user?.id,
      status: filterStatus || undefined,
    },
  });

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    triggerRefresh();
    setRefreshing(false);
  };

  // Sort complaints based on current sort order
  const sortedComplaints = complaints
    ? [...complaints].sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      })
    : [];

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  return (
    <SafeAreaView edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ChevronLeft size={24} color={colors.palette.gray[400]} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">Pengaduan Saya</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Filter and Sort Controls */}
      <View className="flex-row items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-2">
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => setFilterStatus(null)}
            className={`mr-2 rounded-full px-3 py-1 ${filterStatus === null ? 'bg-blue-100' : 'bg-gray-200'}`}>
            <Text
              className={`text-sm ${filterStatus === null ? 'font-medium text-blue-700' : 'text-gray-700'}`}>
              Semua
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilterStatus('pending')}
            className={`mr-2 rounded-full px-3 py-1 ${filterStatus === 'pending' ? 'bg-yellow-100' : 'bg-gray-200'}`}>
            <Text
              className={`text-sm ${filterStatus === 'pending' ? 'font-medium text-yellow-700' : 'text-gray-700'}`}>
              Menunggu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilterStatus('resolved')}
            className={`mr-2 rounded-full px-3 py-1 ${filterStatus === 'resolved' ? 'bg-green-100' : 'bg-gray-200'}`}>
            <Text
              className={`text-sm ${filterStatus === 'resolved' ? 'font-medium text-green-700' : 'text-gray-700'}`}>
              Selesai
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={toggleSortOrder} className="flex-row items-center">
          {sortOrder === 'desc' ? (
            <SortDesc size={18} color={colors.palette.gray[600]} />
          ) : (
            <SortAsc size={18} color={colors.palette.gray[600]} />
          )}
        </TouchableOpacity>
      </View>

      {/* Complaints List */}
      {isLoading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center p-5">
          <AlertCircle size={40} color={colors.danger} className="mb-2" />
          <Text className="mb-1 text-center text-lg font-medium text-gray-800">
            Gagal memuat data
          </Text>
          <Text className="mb-4 text-center text-gray-600">
            Terjadi kesalahan saat memuat pengaduan Anda. Silakan coba lagi.
          </Text>
          <TouchableOpacity onPress={onRefresh} className="rounded-lg bg-blue-600 px-4 py-2">
            <Text className="font-medium text-white">Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : sortedComplaints.length === 0 ? (
        <EmptyState
          title="Belum ada pengaduan"
          description="Anda belum mengajukan pengaduan. Ketika Anda mengajukan, pengaduan akan muncul di sini."
          icon="search"
        />
      ) : (
        <FlatList
          data={sortedComplaints}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ComplaintItem
              complaint={item}
              onPress={() =>
                router.push({
                  pathname: '/pengaduan/[id]',
                  params: { id: item.id },
                })
              }
            />
          )}
          contentContainerClassName="p-4"
          ItemSeparatorComponent={() => <View className="h-3" />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}

      {/* New Complaint Button */}
      <View className="absolute bottom-16 right-6">
        <TouchableOpacity
          onPress={() => router.push('/pengaduan/new')}
          className="h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-lg"
          style={styles.floatingButton}>
          <Text className="text-2xl font-bold text-white">+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Complaint Item Component
function ComplaintItem({ complaint, onPress }: { complaint: any; onPress: () => void }) {
  // Get status configuration
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
      case 'selesai':
        return {
          icon: <CheckCircle size={16} color={colors.success} />,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          label: 'Selesai',
        };
      case 'pending':
      case 'menunggu':
        return {
          icon: <Clock size={16} color={colors.warning} />,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          label: 'Menunggu',
        };
      case 'rejected':
      case 'ditolak':
        return {
          icon: <XCircle size={16} color={colors.danger} />,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          label: 'Ditolak',
        };
      case 'in_progress':
      case 'diproses':
        return {
          icon: <AlertCircle size={16} color={colors.primary} />,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          label: 'Diproses',
        };
      default:
        return {
          icon: <Clock size={16} color={colors.palette.gray[400]} />,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          label: status,
        };
    }
  };

  const statusConfig = getStatusConfig(complaint.status);
  const formattedDate = formatDistanceToNow(new Date(complaint.created_at));

  return (
    <TouchableOpacity
      onPress={onPress}
      className="rounded-xl border border-gray-200 bg-white p-4"
      activeOpacity={0.7}>
      <View className="mb-1 flex-row items-center justify-between">
        <View className={`${statusConfig.bgColor} flex-row items-center rounded-full px-2 py-1`}>
          {statusConfig.icon}
          <Text className={`ml-1 text-xs ${statusConfig.color}`}>{statusConfig.label}</Text>
        </View>
        <Text className="text-xs text-gray-500">{formattedDate}</Text>
      </View>

      <Text className="mb-1 text-base font-semibold text-gray-900" numberOfLines={1}>
        {complaint.title}
      </Text>

      <Text className="mb-2 text-sm text-gray-600" numberOfLines={2}>
        {complaint.description}
      </Text>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text className="text-xs text-gray-500">
            Kategori: {complaint.category?.name || 'Tidak diketahui'}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="mr-1 text-xs text-blue-600">Detail</Text>
          <ChevronRight size={14} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
});
