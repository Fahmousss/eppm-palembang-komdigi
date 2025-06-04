import { View, Text, TouchableOpacity } from 'react-native';
import { CheckCircle, Clock, XCircle, AlertCircle, ChevronRight } from 'lucide-react-native';
import { colors } from '~/lib/color';
import { formatDistanceToNow } from '~/lib/date';

interface ComplaintItemProps {
  complaint: any;
  onPress: () => void;
}

export default function ComplaintItem({ complaint, onPress }: ComplaintItemProps) {
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

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center rounded-xl border border-gray-200 bg-white p-4">
      <View className="flex-1">
        <View className="mb-1 flex-row items-center">
          <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
            {complaint.title || 'Pengaduan #' + complaint.id}
          </Text>
        </View>
        <Text className="mb-2 text-sm text-gray-600" numberOfLines={2}>
          {complaint.description || 'Tidak ada deskripsi.'}
        </Text>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View
              className={`${statusConfig.bgColor} mr-2 flex-row items-center rounded-full px-2 py-1`}>
              {statusConfig.icon}
              <Text className={`ml-1 text-xs ${statusConfig.color}`}>{statusConfig.label}</Text>
            </View>
            <Text className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(complaint.created_at))}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Text className="mr-1 text-xs text-blue-600">Detail</Text>
            <ChevronRight size={14} color={colors.primary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
