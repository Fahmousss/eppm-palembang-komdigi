import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Platform, ScrollView, Text, View } from 'react-native';
import Button from '~/components/core/Button';
import {
  ArrowRight,
  Download,
  Heart,
  Menu,
  Plus,
  Send,
  Settings,
  Trash,
} from 'lucide-react-native';

export default function Index() {
  const [loading, setLoading] = useState(false);

  const handlePress = () => {
    setLoading(true);
    // Simulate an async operation
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="gap-4 p-6">
        <Text className="mb-4 text-xl font-bold">Button Examples</Text>

        <View>
          <Text className="mb-2 text-lg font-semibold">Standard Variants</Text>
          {/* Primary button with title */}
          <Button
            variant="primary"
            title="Sign up"
            onPress={() => router.push('/sign-up')}
            loading={loading}
          />

          <View className="h-2" />

          {/* Secondary button with title */}
          <Button variant="secondary" title="Sign in" onPress={() => router.push('/sign-in')} />

          <View className="h-2" />

          {/* Danger button with title */}
          <Button
            variant="danger"
            title="Danger Button"
            onPress={() => console.log('Danger pressed')}
          />

          <View className="h-2" />

          {/* Ghost button with title */}
          <Button
            variant="ghost"
            title="Ghost Button"
            onPress={() => console.log('Ghost pressed')}
          />
        </View>

        <View className="mt-4">
          <Text className="mb-2 text-lg font-semibold">Size Variants</Text>
          <Button size="small" variant="primary" title="Small Button" />

          <View className="h-2" />

          <Button size="medium" variant="primary" title="Medium Button" />

          <View className="h-2" />

          <Button size="large" variant="primary" title="Large Button" />
        </View>

        <View className="mt-4">
          <Text className="mb-2 text-lg font-semibold">Icon-Only Buttons</Text>
          <View className="flex-row gap-2">
            <Button iconOnly variant="primary" onPress={() => console.log('Add pressed')}>
              <Plus size={18} color="white" />
            </Button>

            <Button
              iconOnly
              variant="secondary"
              size="medium"
              onPress={() => console.log('Settings pressed')}>
              <Settings size={20} color="#1F2937" />
            </Button>

            <Button
              iconOnly
              variant="danger"
              size="large"
              onPress={() => console.log('Delete pressed')}>
              <Trash size={22} color="white" />
            </Button>

            <Button iconOnly variant="ghost" onPress={() => console.log('Ghost icon pressed')}>
              <ArrowRight size={18} color="#1F2937" />
            </Button>
          </View>
        </View>

        <View className="mt-4">
          <Text className="mb-2 text-lg font-semibold">Loading States</Text>
          <View className="flex-row gap-2">
            <Button iconOnly loading variant="primary" />
            <Button size="small" loading variant="secondary" title="Loading..." />
            <Button loading variant="danger" title="Loading..." />
          </View>
        </View>

        <View className="mt-4">
          <Text className="mb-2 text-lg font-semibold">Disabled States</Text>
          <Button disabled variant="primary" title="Disabled Button" />

          <View className="h-2" />

          <View className="flex-row gap-2">
            <Button iconOnly disabled variant="primary">
              <Plus size={18} color="white" />
            </Button>

            <Button iconOnly disabled variant="secondary">
              <Settings size={18} color="#1F2937" />
            </Button>
          </View>
        </View>

        <View className="mt-4">
          <Text className="mb-2 text-lg font-semibold">With Icons and Text</Text>
          <Button variant="primary" onPress={() => console.log('Like pressed')}>
            <View className="flex-row items-center">
              <Heart size={18} color="white" />
              <Text className="ml-2 text-white">Like</Text>
            </View>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
