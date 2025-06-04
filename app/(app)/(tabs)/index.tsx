import axios from 'axios';
import { useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import ComplianceStatusSection from '~/components/app/ComplianceStatusSection';
import ConsentWelcome from '~/components/app/ConsentWelcome';
import CTAMenuSection from '~/components/app/CtaMenuSection';
import ServicePostsSection from '~/components/app/ServicePostSection';
import { useAlert } from '~/components/core/AlertDialogProvider';
import Banner from '~/components/core/Banner';
import { SafeAreaView } from '~/components/core/SafeAreaView';
import axiosInstance from '~/config/axiosConfig';
import { useAppData } from '~/context/AppDataContext';
import { useSession } from '~/context/AuthContext';
import { useFetch } from '~/hooks/useFetch';

export default function Home() {
  const { triggerRefresh } = useAppData();
  const [refreshing, setRefreshing] = useState(false);
  const { user, updateUser } = useSession();
  const { alert } = useAlert();
  const { data: stats } = useFetch({
    endpoint: '/complaint/stats',
  });

  const showAlert = async ({ title, message }: { title: string; message: string }) => {
    await alert({
      title: title,
      message: message,
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    triggerRefresh();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleEmailVerification = async () => {
    try {
      const response = await axiosInstance.post('/email/verification-notification');

      if (response.data.status === 'success') {
        updateUser(response.data.data);
        showAlert({
          title: 'Berhasil',
          message: 'Email terverifikasi',
        });
      } else {
        showAlert({
          title: 'Berhasil',
          message: 'Silakan cek inbox email anda dan lakukan verifikasi',
        });
      }
    } catch (error: any) {
      // eslint-disable-next-line import/no-named-as-default-member
      if (axios.isAxiosError(error)) {
        showAlert({
          title: 'Gagal',
          message: 'Gangguan jaringan, coba ulang beberapa saat lagi',
        });
      }
      showAlert({
        title: 'Gagal',
        message: error.message,
      });
    }
  };

  return (
    <SafeAreaView edges={['top']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}>
        {/* Consent Welcome Banner */}
        <ConsentWelcome userName={user?.name} />

        {user?.email_verified_at === null && (
          <View className="mx-4">
            <Banner
              message="Anda belum melakukan verifikasi email!"
              buttonVariant="danger"
              variant="error"
              actionLabel="Verifikasi sekarang"
              action={handleEmailVerification}
            />
          </View>
        )}

        {/* Compliance Status Card */}
        <ComplianceStatusSection stats={stats} isLoading={refreshing} />
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
