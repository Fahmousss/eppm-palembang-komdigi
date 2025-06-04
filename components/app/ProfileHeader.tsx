import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Settings, User } from 'lucide-react-native';
import { colors } from '~/lib/color';
import { User as UserData } from '~/config/types';
import { formatDate } from '~/lib/date';

interface ProfileHeaderProps {
  userData: UserData;
}

export default function ProfileHeader({ userData }: ProfileHeaderProps) {
  return (
    <View className="px-5 pb-6 pt-10">
      {/* Header with settings button */}
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-3xl font-bold text-gray-900">Profile</Text>
      </View>

      {/* User info */}
      <View className="flex-row items-center">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-blue-100">
          <User size={36} color={colors.primary} />
        </View>

        <View className="ml-4 flex-1">
          <Text className="text-xl font-bold text-gray-900">{userData.name}</Text>
          <Text className="mb-1 text-gray-600">{userData.email}</Text>
          <View className="flex-row items-center">
            <View className="rounded-full bg-blue-100 px-2 py-0.5">
              <Text className="text-xs font-medium text-blue-700">{userData.role}</Text>
            </View>
            <Text className="ml-2 text-xs text-gray-500">
              {/* Joined {formatDate(userData.created_at)} */}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
