import { Text } from 'react-native';
import { Card, CardBody, CardHeader } from '../core/Card';
import { formatDistanceToNow } from '~/lib/date';
import { CheckCircle, AlertCircle, Clock, AlertTriangle } from 'lucide-react-native';
import colors from '~/lib/color';

interface ComplianceStatusCardProps {
  status: 'compliant' | 'pending' | 'attention' | 'overdue';
  lastUpdated: string;
}

export default function ComplianceStatusCard({ status, lastUpdated }: ComplianceStatusCardProps) {
  // Define status configurations
  const statusConfig = {
    compliant: {
      title: "You're Compliant",
      description: 'All your compliance requirements are up to date.',
      icon: <CheckCircle size={24} color={colors.success} />,
      color: colors.success,
      bgColor: 'bg-green-50',
    },
    pending: {
      title: 'Review Pending',
      description: 'Your compliance submission is being reviewed.',
      icon: <Clock size={24} color={colors.warning} />,
      color: colors.warning,
      bgColor: 'bg-yellow-50',
    },
    attention: {
      title: 'Needs Attention',
      description: 'Some compliance items require your attention.',
      icon: <AlertCircle size={24} color={colors.primary} />,
      color: colors.primary,
      bgColor: 'bg-blue-50',
    },
    overdue: {
      title: 'Compliance Overdue',
      description: 'Your compliance requirements are overdue.',
      icon: <AlertTriangle size={24} color={colors.danger} />,
      color: colors.danger,
      bgColor: 'bg-red-50',
    },
  };

  const config = statusConfig[status];
  const formattedDate = formatDistanceToNow(new Date(lastUpdated));

  return (
    <Card className={config.bgColor} elevation="small">
      <CardHeader title={config.title} icon={config.icon} />
      <CardBody>
        <Text className="mb-2 text-gray-700">{config.description}</Text>
        <Text className="text-sm text-gray-500">Last updated: {formattedDate}</Text>
      </CardBody>
    </Card>
  );
}
