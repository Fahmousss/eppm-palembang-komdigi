import { View } from 'react-native';
import {
  FileText,
  ClipboardCheck,
  BookOpen,
  Bell,
  Settings,
  HandHeart,
  AlertTriangle,
} from 'lucide-react-native';
import colors from '~/lib/color';
import MenuButton from '../core/MenuButton';

export default function CTAMenuGrid() {
  const menuItems = [
    {
      id: 'pelayanan',
      title: 'Pelayanan',
      icon: <HandHeart size={70} color={colors.success} />,
      bgColor: 'bg-green-50',
      route: '/pelayanan',
      textColor: 'text-emerald-600',
    },
    {
      id: 'pengaduan',
      title: 'Pengaduan',
      icon: <AlertTriangle size={70} color={colors.danger} />,
      bgColor: 'bg-red-50',
      route: '/education',
      textColor: 'text-rose-600',
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <Settings size={70} color={colors.palette.gray['700']} />,
      bgColor: 'bg-gray-100',
      route: '/settings',
    },
  ];

  return (
    <View className="flex-row flex-wrap justify-between">
      {menuItems.map((item) => (
        <MenuButton
          key={item.id}
          title={item.title}
          icon={item.icon}
          bgColor={item.bgColor}
          textColor={item.textColor}
          onPress={() => console.log(`Navigate to ${item.route}`)}
        />
      ))}
    </View>
  );
}
