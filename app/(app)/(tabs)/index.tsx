import { useCallback, useReducer, useState } from 'react';
import { View, Platform, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ComplianceStatusSection from '~/components/app/ComplianceStatusSection';
import ConsentWelcome from '~/components/app/ConsentWelcome';
import CTAMenuSection from '~/components/app/CtaMenuSection';
import ServicePostsSection from '~/components/app/ServicePostSection';
import { useAlert } from '~/components/core/AlertDialogProvider';
import { useAppData } from '~/context/AppDataContext';
import { useSession } from '~/context/AuthContext';

export default function Home() {
  const { triggerRefresh } = useAppData();
  const [refreshing, setRefreshing] = useState(false);
  const { alert } = useAlert();
  const { user, signOut } = useSession();

  const handleRefresh = () => {
    setRefreshing(true);
    triggerRefresh();
    setTimeout(() => setRefreshing(false), 1000);
  };
  //   try {
  //   } catch (error) {
  //     console.error('Error while refreshing posts, ', error);
  //   } finally {
  //     setRefreshing(false);
  //   }
  // };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure want to logout?')) {
        signOut();
      }
    } else {
      const showConfirmationAlert = async () => {
        const response = await alert({
          title: 'Confirm Action',
          message: 'Are you sure you want to proceed with this action?',
          buttons: [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Logout',
              style: 'destructive',
              onPress: () => {
                signOut();
              },
            },
          ],
        });
      };

      showConfirmationAlert();
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
        {/* Consent Welcome Banner */}
        <ConsentWelcome userName={user?.name} complianceStatus={'compliant'} />

        {/* Compliance Status Card */}
        <ComplianceStatusSection status={'compliant'} lastUpdated={''} />
        <View
          className="h-full rounded-2xl bg-white pt-6"
          style={{
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,
            elevation: 6,
          }}>
          {/* CTA Menu Buttons */}
          <CTAMenuSection />

          {/* Latest Service Posts */}
          <ServicePostsSection />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
