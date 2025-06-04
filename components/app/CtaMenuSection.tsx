import { View } from 'react-native';
import Header from './Header';
import CTAMenuGrid from './CtaMenuGrid';
import { AlertTriangle, HandHeart, Settings } from 'lucide-react-native';
import { colors } from '~/lib/color';

export default function CTAMenuSection() {
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
      route: '/pengaduan',
      textColor: 'text-rose-600',
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: <Settings size={70} color={colors.primary} />,
      bgColor: 'bg-blue-100',
      route: '/profile',
      textColor: 'text-blue-600',
    },
  ];
  return (
    <View className="mb-6 px-5">
      <Header title="Quick Access" />
      <CTAMenuGrid menuItems={menuItems} />
    </View>
  );
}
