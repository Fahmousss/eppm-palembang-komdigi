import { StatusBar } from 'expo-status-bar';
import { Platform, Text, View } from 'react-native';

export default function Index() {
  return (
    <>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text className="text-yellow-400">Hello</Text>
      </View>
    </>
  );
}
