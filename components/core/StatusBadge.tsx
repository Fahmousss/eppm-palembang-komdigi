import { View, Text } from 'react-native';
import { CheckCircle, AlertCircle, Clock, AlertTriangle } from 'lucide-react-native';
import { colors } from '~/lib/color';

interface StatusBadgeProps {
  status: 'compliant' | 'pending' | 'attention' | 'overdue';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  // Define status configurations
  const statusConfig = {
    compliant: {
      label: 'Compliant',
      icon: <CheckCircle size={14} color={colors.success} />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    pending: {
      label: 'Pending Review',
      icon: <Clock size={14} color={colors.warning} />,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
    },
    attention: {
      label: 'Needs Attention',
      icon: <AlertCircle size={14} color={colors.primary} />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    overdue: {
      label: 'Overdue',
      icon: <AlertTriangle size={14} color={colors.danger} />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
    },
  };

  const config = statusConfig[status];

  return (
    <View className={`flex-row items-center rounded-full px-2 py-1 ${config.bgColor}`}>
      {config.icon}
      <Text className={`ml-1 text-xs font-medium ${config.textColor}`}>{config.label}</Text>
    </View>
  );
}
