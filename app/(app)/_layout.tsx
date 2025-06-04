import { View, ActivityIndicator } from 'react-native';
import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useSession } from '~/context/AuthContext';
import { AlertDialogProvider } from '~/components/core/AlertDialogProvider';
import { colors } from '~/lib/color';

export default function AppLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size={'large'} color={colors.primary} />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.semantic.light.background.primary,
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.semantic.light.background.primary,
        },
      }}>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="pelayanan/[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="pengaduan/new"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="pengaduan/pengaduan-saya"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="pengaduan/bantuan"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="pengaduan/[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
