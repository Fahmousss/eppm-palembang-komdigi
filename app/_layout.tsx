import { SessionProvider, useSession } from '~/context/AuthContext';
import '../global.css';

import { Redirect, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '~/lib/color';
import 'expo-dev-client';
import { AppDataProvider } from '~/context/AppDataContext';
import { AlertDialogProvider } from '~/components/core/AlertDialogProvider';

function Header() {
  const { session, isLoading } = useSession();

  if (session && !isLoading) {
    return (
      <>
        <StatusBar style="dark" backgroundColor={colors.semantic.light.background.primary} />
        <Redirect href="/(app)/(tabs)" />
      </>
    );
  }

  return <StatusBar style="dark" backgroundColor={colors.semantic.light.background.primary} />;
}

export default function RootLayout() {
  return (
    <AppDataProvider>
      <AlertDialogProvider>
        <SessionProvider>
          <Header />
          <Slot />
        </SessionProvider>
      </AlertDialogProvider>
    </AppDataProvider>
  );
}
