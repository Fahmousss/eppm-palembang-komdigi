import { View } from 'react-native';
import MenuButton from '../core/MenuButton';
import { MenuItem } from '~/config/types';
import { router } from 'expo-router';

interface MenuItemProps {
  menuItems: MenuItem[];
}

export default function CTAMenuGrid({ menuItems }: MenuItemProps) {
  return (
    <View className="flex-row flex-wrap justify-between gap-3">
      {menuItems.map((item) => (
        <MenuButton
          key={item.id}
          title={item.title}
          icon={item.icon}
          bgColor={item.bgColor}
          textColor={item.textColor}
          onPress={() => router.push(item.route)}
        />
      ))}
    </View>
  );
}
