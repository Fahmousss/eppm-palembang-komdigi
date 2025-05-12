import { View } from 'react-native';
import Header from './Header';
import CTAMenuGrid from './CtaMenuGrid';

export default function CTAMenuSection() {
  return (
    <View className="mb-6 px-5">
      <Header title="Quick Access" />
      <CTAMenuGrid />
    </View>
  );
}
