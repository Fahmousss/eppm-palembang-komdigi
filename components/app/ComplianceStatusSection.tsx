import { View, Text, ActivityIndicator } from 'react-native';
import { FileText, CheckCircle, Clock } from 'lucide-react-native';
import { colors } from '~/lib/color';
import StatCard from '../core/StatCard';
import Header from './Header';

interface ComplianceStatusSectionProps {
  stats: any;
  isLoading: boolean;
}

export default function ComplianceStatusSection({
  stats,
  isLoading,
}: ComplianceStatusSectionProps) {
  if (isLoading) {
    return (
      <View className="mb-6 px-5">
        <Header title="Status Pengaduan" />
        <View
          className="items-center justify-center rounded-xl border border-gray-200 bg-white p-4"
          style={{ height: 150 }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  // Default stats if none are provided
  const defaultStats = {
    total: 0,
    resolved: 0,
    pending: 0,
    rejected: 0,
    compliance_rate: 0,
  };

  const complaintStats = stats || defaultStats;

  return (
    <View className="mb-6 px-5">
      <Header title="Status Pengaduan" />
      <View className="rounded-xl border border-gray-200 bg-white p-4">
        <View className="mb-4 flex-row justify-between">
          <StatCard
            title="Total"
            value={complaintStats.total}
            icon={<FileText size={18} color={colors.primary} />}
            bgColor="bg-blue-50"
          />
          <StatCard
            title="Selesai"
            value={complaintStats.resolved}
            icon={<CheckCircle size={18} color={colors.success} />}
            bgColor="bg-green-50"
          />
          <StatCard
            title="Menunggu"
            value={complaintStats.pending}
            icon={<Clock size={18} color={colors.warning} />}
            bgColor="bg-yellow-50"
          />
        </View>

        <View className="mb-2 h-2 rounded-full bg-gray-100">
          <View
            className="h-2 rounded-full bg-green-500"
            style={{ width: `${complaintStats.compliance_rate}%` }}
          />
        </View>
        <Text className="text-center text-sm text-gray-600">
          Tingkat Penyelesaian: {complaintStats.compliance_rate}%
        </Text>
      </View>
    </View>
  );
}
