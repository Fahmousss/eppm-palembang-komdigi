'use client';

import { Tabs } from 'expo-router';
import {
  Home,
  ClipboardCheck,
  BookOpen,
  Bell,
  User,
  Hand,
  HandHeart,
  AlertTriangle,
  User2,
} from 'lucide-react-native';
import { View } from 'react-native';
import colors from '~/lib/color';

// Define tab configuration
export const tabConfig = [
  {
    name: 'index',
    label: 'Home',
    icon: Home,
    color: colors.primary,
  },
  {
    name: 'compliance',
    label: 'Compliance',
    icon: ClipboardCheck,
    color: colors.success,
  },
  {
    name: 'education',
    label: 'Education',
    icon: BookOpen,
    color: colors.warning,
  },
  {
    name: 'profile',
    label: 'Profile',
    icon: User,
    color: colors.secondary,
  },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="pelayanan"
        options={{
          tabBarActiveTintColor: colors.success,
          title: 'Pelayanan',
          tabBarIcon: ({ color }) => <HandHeart size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="pengaduan"
        options={{
          tabBarActiveTintColor: colors.danger,
          title: 'Pengaduan',
          tabBarIcon: ({ color }) => <AlertTriangle size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User2 size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
