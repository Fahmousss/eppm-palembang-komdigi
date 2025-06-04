import { Image, RefreshControl, ScrollView, Text, View } from 'react-native';
import { FileText, HelpCircle, MessageSquare, PlusCircle } from 'lucide-react-native';
import { useFetch } from '~/hooks/useFetch';
import { colors } from '~/lib/color';
import { SafeAreaView } from '~/components/core/SafeAreaView';
import ComplianceStatusSection from '~/components/app/ComplianceStatusSection';
import RecentComplaintsSection from '~/components/app/RecentComplaintsSection';
import RecommendationsSection from '~/components/app/RecommendationSection';
import type { MenuItem } from '~/config/types';
import { router } from 'expo-router';
import Button from '~/components/core/Button';
import CTAMenuGrid from '~/components/app/CtaMenuGrid';
import FAQSection from '~/components/app/FAQSection';
import { useAppData } from '~/context/AppDataContext';
import { useState } from 'react';
import { useSession } from '~/context/AuthContext';
import axiosInstance from '~/config/axiosConfig';
import { useAlert } from '~/components/core/AlertDialogProvider';
import axios from 'axios';

export default function PengaduanScreen() {
  // Fetch user's complaint history
  const { data: complaints, isLoading } = useFetch({
    endpoint: '/complaints',
    params: { limit: 5 },
  });
  const { triggerRefresh } = useAppData();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch compliance stats
  const { data: stats } = useFetch({
    endpoint: '/complaint/stats',
  });

  const { user, updateUser } = useSession();
  const { alert } = useAlert();

  if (user?.email_verified_at === null) {
    const handleEmailVerification = async () => {
      try {
        const response = await axiosInstance.post('/email/verification-notification');

        if (response.data.status === 'success') {
          updateUser(response.data.data);
          alert({
            title: 'Berhasil',
            message: 'Email terverifikasi',
          });
        } else {
          alert({
            title: 'Berhasil',
            message: 'Silakan cek inbox email anda dan lakukan verifikasi',
          });
        }
      } catch (error: any) {
        // eslint-disable-next-line import/no-named-as-default-member
        if (axios.isAxiosError(error)) {
          alert({
            title: 'Gagal',
            message: 'Gangguan jaringan, coba ulang beberapa saat lagi',
          });
        }
        alert({
          title: 'Gagal',
          message: error.message,
        });
      }
    };
    return (
      <View className="flex-1 items-center justify-center bg-white px-5 py-8">
        <Image
          className="mb-4 h-28 w-52"
          resizeMode="contain"
          source={require('assets/logo-horizontal.png')}
        />
        <Text className="text-xl font-semibold text-gray-800">Email Belum Diverifikasi</Text>
        <Text className="mt-4 text-center text-base text-gray-600">
          Terima kasih telah mendaftar! Sebelum melanjutkan, harap verifikasi email Anda untuk
          melindungi akun Anda dan mengakses semua fitur.
        </Text>
        <View className="mt-6">
          <Button variant="danger" title="Verifikasi sekarang" onPress={handleEmailVerification} />
        </View>
      </View>
    );
  }

  const menuItems: MenuItem[] = [
    {
      id: 'pengaduan_saya',
      title: 'Pengaduan Saya',
      icon: <FileText size={70} color={colors.primary} />,
      bgColor: 'bg-blue-50',
      route: '/pengaduan/pengaduan-saya',
      textColor: 'text-blue-600',
    },
    {
      id: 'bantuan',
      title: 'Bantuan',
      icon: <HelpCircle size={70} color={colors.success} />,
      bgColor: 'bg-green-50',
      route: '/pengaduan/bantuan',
      textColor: 'text-emerald-600',
    },
  ];
  const onRefresh = async () => {
    setRefreshing(true);
    triggerRefresh();
    setRefreshing(false);
  };

  return (
    <SafeAreaView edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} />}>
        {/* Header Section */}
        <View className="px-5 pb-6 pt-10">
          <Text className="mb-2 text-3xl font-bold text-gray-900">Pusat Pengaduan</Text>
          <Text className="text-base text-gray-600">
            Sampaikan dan pantau pengaduan atau masalah kepatuhan Anda. Kami berkomitmen untuk
            menangani kekhawatiran Anda dengan cepat.
          </Text>
        </View>

        {/* CTA Section */}
        <View className="mb-6 px-5">
          <View className="mb-4 rounded-xl bg-blue-50 p-5">
            <View className="mb-3 flex-row items-center">
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <MessageSquare size={20} color={colors.primary} />
              </View>
              <Text className="text-lg font-semibold text-gray-900">Ajukan Pengaduan</Text>
            </View>
            <Text className="mb-4 text-gray-700">
              Punya masalah atau keluhan? Ajukan pengaduan resmi dan kami akan menanganinya secepat
              mungkin.
            </Text>
            <Button onPress={() => router.push('/pengaduan/new')}>
              <PlusCircle size={18} color="#FFFFFF" />
              <Text className="ml-2 font-medium text-white">Pengaduan Baru</Text>
            </Button>
          </View>
          <CTAMenuGrid menuItems={menuItems} />
          <View className="flex-row justify-between"></View>
        </View>

        {/* Compliance Status */}
        <ComplianceStatusSection stats={stats} isLoading={!stats && isLoading} />

        {/* Recent Complaints */}
        <RecentComplaintsSection
          complaints={complaints}
          isLoading={!complaints && isLoading}
          onViewAll="/"
          onViewDetail={(id) =>
            router.push({
              pathname: '/pengaduan/[id]',
              params: { id: id },
            })
          }
        />

        {/* Recommendations */}
        <RecommendationsSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* Bottom Padding */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
