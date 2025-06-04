'use client';

import { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { colors } from '~/lib/color';
import Input from '~/components/core/Input';
import Button from '~/components/core/Button';
import { useAlert } from '~/components/core/AlertDialogProvider';
import { useSession } from '~/context/AuthContext';
import axiosInstance from '~/config/axiosConfig';
import Banner from '../core/Banner';

export default function ChangePasswordSection() {
  const { alert } = useAlert();
  const { user } = useSession();

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Password saat ini wajib diisi';
    }
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password baru harus minimal 6 karakter';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await axiosInstance.patch('/user/update', {
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        new_password_confirmation: passwordData.confirmPassword,
      });

      setShowSuccess(true);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: any) {
      alert({
        title: 'Gagal Mengubah Password',
        message:
          error?.response?.data?.message || 'Terjadi kesalahan saat mengubah password. Coba lagi.',
        buttons: [{ text: 'OK' }],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <View className="items-center justify-center p-8">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-4 text-gray-600">Memuat data pengguna...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="px-5 py-4">
      <Text className="mb-6 text-xl font-bold text-gray-900">Ubah Password</Text>

      {showSuccess && <Banner variant="success" message="Password berhasil diubah" />}

      <Input
        label="Password Saat Ini"
        value={passwordData.currentPassword}
        onChangeText={(text) => handleChange('currentPassword', text)}
        placeholder="Masukkan password saat ini"
        secureTextEntry
        error={errors.currentPassword}
        required
      />

      <Input
        label="Password Baru"
        value={passwordData.newPassword}
        onChangeText={(text) => handleChange('newPassword', text)}
        placeholder="Masukkan password baru"
        secureTextEntry
        error={errors.newPassword}
        required
      />

      <Input
        label="Konfirmasi Password Baru"
        value={passwordData.confirmPassword}
        onChangeText={(text) => handleChange('confirmPassword', text)}
        placeholder="Ulangi password baru"
        secureTextEntry
        error={errors.confirmPassword}
        required
      />

      <View className="mt-6">
        <Button
          title={isSubmitting ? 'Menyimpan...' : 'Ubah Password'}
          onPress={handleSubmit}
          disabled={isSubmitting}
          loading={isSubmitting}
        />
      </View>
    </ScrollView>
  );
}
