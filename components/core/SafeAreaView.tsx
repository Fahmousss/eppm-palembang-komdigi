import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Edge = 'top' | 'bottom' | 'left' | 'right';

interface SafeAreaViewProps {
  children: React.ReactNode;
  edges?: Edge[]; // opsional, default bisa diatur
}

export const SafeAreaView = ({
  children,
  edges = ['top', 'bottom', 'left', 'right'],
}: SafeAreaViewProps) => {
  const insets = useSafeAreaInsets();

  const paddingTop = edges.includes('top') ? insets.top : 0;
  const paddingBottom = edges.includes('bottom') ? insets.bottom : 0;
  const paddingLeft = edges.includes('left') ? insets.left : 0;
  const paddingRight = edges.includes('right') ? insets.right : 0;

  return (
    <View
      className="flex-1 bg-white"
      style={{
        paddingTop,
        paddingBottom,
        paddingLeft,
        paddingRight,
      }}>
      {children}
    </View>
  );
};

export default SafeAreaView;
