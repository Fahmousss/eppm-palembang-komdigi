import { TouchableOpacity, Text, View, type StyleProp, Pressable } from 'react-native';
import { cn } from '../../lib/utils';
import type { ReactNode } from 'react';

interface MenuButtonProps {
  title: string;
  icon: ReactNode;
  bgColor?: string;
  textColor?: string;
  onPress: () => void;
}

export default function MenuButton({
  title,
  icon,
  bgColor = 'bg-gray-50',
  textColor = 'text-black',
  onPress,
}: MenuButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className={cn(
        'relative mb-3 h-20 w-[31%] grow items-center justify-center overflow-hidden rounded-xl',
        bgColor
      )}
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 3,
      }}>
      <View className="absolute -bottom-4 -left-4 opacity-20">{icon}</View>
      <Text className={cn('z-10 text-center text-lg font-semibold', textColor)}>{title}</Text>
      {/* </View> */}
    </TouchableOpacity>
  );
}
