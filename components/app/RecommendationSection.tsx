import { View, FlatList, Text } from 'react-native';
import { Lightbulb, FileText, Clock } from 'lucide-react-native';
import { colors } from '~/lib/color';
import Header from './Header';

export default function RecommendationsSection() {
  // Sample recommendations
  const recommendations = [
    {
      id: '1',
      title: 'Berikan detail yang spesifik',
      description: 'Sertakan informasi relevan seperti tanggal, lokasi, dan pihak yang terlibat.',
      icon: <Lightbulb size={20} color={colors.warning} />,
    },
    {
      id: '2',
      title: 'Lampirkan bukti pendukung',
      description:
        'Foto, dokumen, atau bukti lain dapat membantu menyelesaikan pengaduan Anda lebih cepat.',
      icon: <FileText size={20} color={colors.primary} />,
    },
    {
      id: '3',
      title: 'Pantau secara berkala',
      description: 'Periksa status pengaduan Anda dan berikan informasi tambahan jika diminta.',
      icon: <Clock size={20} color={colors.success} />,
    },
  ];

  return (
    <View className="mb-6 px-5">
      <Header title="Tips & Rekomendasi" />
      <FlatList
        data={recommendations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-3 rounded-xl border border-gray-200 bg-white p-4">
            <View className="mb-2 flex-row items-center">
              <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                {item.icon}
              </View>
              <Text className="text-base font-semibold text-gray-900">{item.title}</Text>
            </View>
            <Text className="text-gray-600">{item.description}</Text>
          </View>
        )}
        scrollEnabled={false}
      />
    </View>
  );
}
