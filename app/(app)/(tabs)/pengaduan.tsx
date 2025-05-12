import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PengaduanScreen() {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-5">
        <Text className="mb-4 text-2xl font-bold text-green-600">Compliance</Text>
        <Text className="text-center text-base text-gray-700">
          This is the Compliance tab. Notice how the tab bar color changes to green when this tab is
          selected.
        </Text>
      </View>
    </SafeAreaView>
  );
}
