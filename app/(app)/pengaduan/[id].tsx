'use client';

import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Share,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Share2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Calendar,
  FileText,
  Image as ImageIcon,
  File,
  Eye,
  MessageSquare,
  Trash2,
} from 'lucide-react-native';
import { useFetch } from '~/hooks/useFetch';
import { colors } from '~/lib/color';
import { formatDate, formatDistanceToNow } from '~/lib/date';
import axiosInstance from '~/config/axiosConfig';
import { useAlert } from '~/components/core/AlertDialogProvider';
import { useAppData } from '~/context/AppDataContext';
import { SafeAreaView } from '~/components/core/SafeAreaView';

export default function ComplaintDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { alert } = useAlert();
  const { triggerRefresh } = useAppData();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    triggerRefresh();
    setRefreshing(false);
  };

  // Fetch complaint details
  const {
    data: complaint,
    isLoading: isLoadingComplaint,
    error,
  } = useFetch({
    endpoint: `/complaints/${id}`,
    enabled: !!id,
  });

  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

  // Handle share functionality
  const handleShare = async () => {
    if (!complaint) return;

    try {
      await Share.share({
        message: `Pengaduan: ${complaint.title}\n\nStatus: ${getStatusLabel(
          complaint.status
        )}\n\nDeskripsi: ${complaint.description}`,
      });
    } catch (error) {
      console.error('Error sharing complaint:', error);
    }
  };

  // Get status label
  const getStatusLabel = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'Selesai';
      case 'pending':
        return 'Menunggu';
      case 'rejected':
        return 'Ditolak';
      case 'in_progress':
        return 'Diproses';
      default:
        return status;
    }
  };

  // Get status configuration
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'selesai':
        return {
          icon: <CheckCircle size={20} color={colors.success} />,
          color: colors.success,
          bgColor: 'bg-green-50',
          label: 'Selesai',
          description: 'Pengaduan Anda telah diselesaikan.',
        };
      case 'menunggu':
        return {
          icon: <Clock size={20} color={colors.warning} />,
          color: colors.warning,
          bgColor: 'bg-yellow-50',
          label: 'Menunggu',
          description: 'Pengaduan Anda sedang menunggu untuk diproses.',
        };
      case 'ditolak':
        return {
          icon: <XCircle size={20} color={colors.danger} />,
          color: colors.danger,
          bgColor: 'bg-red-50',
          label: 'Ditolak',
          description: 'Pengaduan Anda telah ditolak.',
        };
      case 'proses':
        return {
          icon: <AlertCircle size={20} color={colors.primary} />,
          color: colors.primary,
          bgColor: 'bg-blue-50',
          label: 'Diproses',
          description: 'Pengaduan Anda sedang diproses.',
        };
      default:
        return {
          icon: <Clock size={20} color={colors.palette.gray[400]} />,
          color: colors.palette.gray[400],
          bgColor: 'bg-gray-50',
          label: status,
          description: 'Status pengaduan Anda.',
        };
    }
  };

  // Handle view attachment
  const handleViewAttachment = (attachment: any) => {
    // Check if it's an image
    if (attachment.file_type.startsWith('image/')) {
      // Navigate to image viewer or open in browser
      Linking.openURL(`${BASE_URL}/storage/${attachment.file_path}`);
    } else {
      // Open document in browser or download
      Linking.openURL(`${BASE_URL}/storage/${attachment.file_path}`);
    }
  };

  // Handle cancel complaint
  const handleCancelComplaint = async () => {
    const result = await alert({
      title: 'Batalkan Pengaduan',
      message:
        'Apakah Anda yakin ingin membatalkan pengaduan ini? Tindakan ini tidak dapat dibatalkan.',
      buttons: [
        {
          text: 'Tidak',
          style: 'cancel',
        },
        {
          text: 'Ya, Batalkan',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await axiosInstance.delete(`/complaints/${id}`);
              setIsLoading(false);

              // Refresh data and navigate back
              triggerRefresh();
              router.back();
            } catch (error) {
              setIsLoading(false);
              console.error('Error canceling complaint:', error);

              // Show error message
              await alert({
                title: 'Gagal Membatalkan',
                message: 'Terjadi kesalahan saat membatalkan pengaduan. Silakan coba lagi nanti.',
              });
            }
          },
        },
      ],
    });
  };

  if (isLoadingComplaint) {
    return (
      <SafeAreaView edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !complaint) {
    return (
      <SafeAreaView edges={['top']}>
        <View className="flex-1 items-center justify-center p-5">
          <AlertCircle size={40} color={colors.danger} className="mb-2" />
          <Text className="mb-1 text-center text-lg font-medium text-gray-800">
            Pengaduan tidak ditemukan
          </Text>
          <Text className="mb-4 text-center text-gray-600">
            Pengaduan yang Anda cari mungkin telah dihapus atau tidak tersedia.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="rounded-lg bg-blue-600 px-4 py-2">
            <Text className="font-medium text-white">Kembali</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusConfig = getStatusConfig(complaint.status);
  const createdDate = new Date(complaint.created_at);
  const formattedDate = formatDate(createdDate);
  const timeAgo = formatDistanceToNow(createdDate);
  const canCancel = complaint.status === 'menunggu';

  return (
    <SafeAreaView edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ChevronLeft size={24} color={colors.palette.gray[400]} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">Detail Pengaduan</Text>
        <TouchableOpacity onPress={handleShare} className="p-2">
          <Share2 size={20} color={colors.palette.gray[400]} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}>
        {/* Status Banner */}
        <View className={`${statusConfig.bgColor} p-4`}>
          <View className="flex-row items-center">
            {statusConfig.icon}
            <View className="ml-3 flex-1">
              <Text className="text-base font-semibold" style={{ color: statusConfig.color }}>
                {statusConfig.label}
              </Text>
              <Text className="text-sm text-gray-700">{statusConfig.description}</Text>
            </View>
          </View>
        </View>

        {/* Complaint Details */}
        <View className="p-4">
          <Text className="mb-2 text-xl font-bold text-gray-900">{complaint.title}</Text>

          <View className="mb-4 flex-row flex-wrap">
            <View className="mb-2 mr-4 flex-row items-center">
              <Calendar size={16} color={colors.palette.gray[400]} />
              <Text className="ml-1 text-sm text-gray-600">{formattedDate}</Text>
            </View>
            <View className="mb-2 mr-4 flex-row items-center">
              <Clock size={16} color={colors.palette.gray[400]} />
              <Text className="ml-1 text-sm text-gray-600">{timeAgo}</Text>
            </View>
            <View className="mb-2 flex-row items-center">
              <MessageSquare size={16} color={colors.palette.gray[400]} />
              <Text className="ml-1 text-sm text-gray-600">ID: #{complaint.id}</Text>
            </View>
          </View>

          {/* Category and Location */}
          <View className="mb-4 rounded-lg bg-gray-50 p-3">
            <View className="mb-2 flex-row items-center">
              <Text className="text-sm font-medium text-gray-700">Kategori:</Text>
              <Text className="ml-2 text-sm text-gray-900">
                {complaint.category?.name || 'Tidak diketahui'}
              </Text>
            </View>
            <View className="flex-row items-center">
              <MapPin size={16} color={colors.palette.gray[400]} />
              <Text className="ml-1 text-sm text-gray-900">{complaint.location}</Text>
            </View>
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="mb-2 text-base font-semibold text-gray-900">Deskripsi</Text>
            <Text className="text-gray-700">{complaint.description}</Text>
          </View>

          {/* Attachments */}
          {complaint.attachments && complaint.attachments.length > 0 && (
            <View className="mb-4">
              <Text className="mb-2 text-base font-semibold text-gray-900">
                Lampiran ({complaint.attachments.length})
              </Text>
              {complaint.attachments.map((attachment: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleViewAttachment(attachment)}
                  className="mb-2 flex-row items-center rounded-lg border border-gray-200 p-3">
                  {attachment.file_type.startsWith('image/') ? (
                    <View className="mr-3 h-10 w-10 items-center justify-center rounded bg-blue-100">
                      <ImageIcon size={20} color={colors.primary} />
                    </View>
                  ) : attachment.file_type.includes('pdf') ? (
                    <View className="mr-3 h-10 w-10 items-center justify-center rounded bg-red-100">
                      <FileText size={20} color={colors.danger} />
                    </View>
                  ) : (
                    <View className="mr-3 h-10 w-10 items-center justify-center rounded bg-gray-100">
                      <File size={20} color={colors.palette.gray[400]} />
                    </View>
                  )}
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-900" numberOfLines={1}>
                      {attachment.file_name}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      {attachment.file_type.split('/')[1]?.toUpperCase() || attachment.file_type}
                    </Text>
                  </View>
                  <View className="flex-row">
                    <TouchableOpacity
                      className="mr-2 h-8 w-8 items-center justify-center rounded-full bg-gray-100"
                      onPress={() => handleViewAttachment(attachment)}>
                      <Eye size={16} color={colors.palette.gray[600]} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Admin Notes (if any) */}
          {complaint.response && (
            <View className="mb-4 rounded-lg bg-blue-50 p-3">
              <Text className="mb-1 text-sm font-semibold text-gray-900">Catatan Admin</Text>
              <Text className="text-sm text-gray-700">{complaint.response}</Text>
            </View>
          )}

          {/* Cancel Button (only for pending complaints) */}
          {canCancel && (
            <TouchableOpacity
              onPress={handleCancelComplaint}
              className="mt-2 flex-row items-center justify-center rounded-lg border border-red-300 bg-red-50 p-3"
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.danger} />
              ) : (
                <>
                  <Trash2 size={18} color={colors.danger} />
                  <Text className="ml-2 font-medium text-red-600">Batalkan Pengaduan</Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Bottom Padding */}
          <View className="h-20" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
