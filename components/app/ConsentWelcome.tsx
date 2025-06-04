import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

type ConsentWelcomeProps = {
  userName?: string;
};

const quotes = [
  '“Pengaduan Anda adalah langkah pertama menuju pelayanan publik yang lebih baik.”',
  '“Setiap suara dihitung. Terima kasih telah peduli!”',
  '“Perubahan dimulai dari keberanian menyampaikan.”',
  '“Pelayanan yang baik lahir dari masukan yang jujur.”',
  '“Kami mendengar, kami bertindak. Terima kasih atas pengaduan Anda.”',
];

export default function ConsentWelcome({ userName }: ConsentWelcomeProps) {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  return (
    <View className="px-5 pb-6 pt-10">
      <Text className="mb-1 text-3xl font-bold text-gray-900">Selamat datang, {userName} 👋</Text>

      {quote && <Text className="mt-4 italic text-gray-500">{quote}</Text>}
    </View>
  );
}
