import { View, Text } from 'react-native';
import StatusBadge from '../core/StatusBadge';

interface ConsentWelcomeProps {
  userName: string | undefined;
  complianceStatus: 'compliant' | 'pending' | 'attention' | 'overdue';
}

export default function ConsentWelcome({ userName, complianceStatus }: ConsentWelcomeProps) {
  return (
    <View className="px-5 pb-6 pt-4">
      <Text className="mb-1 text-2xl font-semibold text-gray-900">Hello, {userName}</Text>
    </View>
  );
}
