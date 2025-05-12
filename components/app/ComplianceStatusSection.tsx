import { View } from 'react-native';
import Header from './Header';
import ComplianceStatusCard from './ComplianceStatusCard';

interface ComplianceStatusSectionProps {
  status: 'compliant' | 'pending' | 'attention' | 'overdue';
  lastUpdated: string;
}

export default function ComplianceStatusSection({
  status,
  lastUpdated,
}: ComplianceStatusSectionProps) {
  return (
    <View className="mb-6 px-5">
      <Header title="Status Pengaduan" actionText="View Details" actionLink="/pengaduan" />
      <ComplianceStatusCard status={status} lastUpdated={lastUpdated} />
    </View>
  );
}
