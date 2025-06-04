'use client';

import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useBookmarks } from '~/hooks/useBookmarks';
import BookmarksList from '~/components/app/BookmarksList';
import ProfileHeader from '~/components/app/ProfileHeader';
import { useSession } from '~/context/AuthContext';
import { SafeAreaView } from '~/components/core/SafeAreaView';
import Button from '~/components/core/Button';
import { useAlert } from '~/components/core/AlertDialogProvider';
import AccountEditSection from '~/components/app/AccountEditSection';

// Profile tabs
type ProfileTab = 'bookmarks' | 'akun';

export default function ProfileScreen() {
  const { alert } = useAlert();
  const [activeTab, setActiveTab] = useState<ProfileTab>('bookmarks');
  const { bookmarks } = useBookmarks();
  const { user, signOut } = useSession();

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure want to logout?')) {
        signOut();
      }
    } else {
      const showConfirmationAlert = async () => {
        await alert({
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

  // Tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'bookmarks':
        return <BookmarksList bookmarks={bookmarks} />;
      case 'akun':
        return (
          <>
            <AccountEditSection />
            <Button title="Sign Out" className="m-4" variant="danger" onPress={handleLogout} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <ProfileHeader userData={user} />

        {/* Profile Tabs */}
        <View className="flex-row border-b border-gray-200 px-4">
          <TouchableOpacity
            onPress={() => setActiveTab('bookmarks')}
            className={`px-4 py-3 ${activeTab === 'bookmarks' ? 'border-b-2 border-blue-600' : ''}`}>
            <Text
              className={`text-base font-medium ${activeTab === 'bookmarks' ? 'text-blue-600' : 'text-gray-600'}`}>
              Bookmarks
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('akun')}
            className={`px-4 py-3 ${activeTab === 'akun' ? 'border-b-2 border-blue-600' : ''}`}>
            <Text
              className={`text-base font-medium ${activeTab === 'akun' ? 'text-blue-600' : 'text-gray-600'}`}>
              Akun
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {renderTabContent()}

        {/* App Info */}
        <View className="mb-8 mt-6 items-center">
          <Text className="text-sm text-gray-400">E-PPM Palembang 1.0.0</Text>
          <Text className="mt-1 text-xs text-gray-400">
            © 2025 Kementrian Komunikasi dan Digital Palembang
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
