'use client';

import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { colors } from '~/lib/color';
import Header from './Header';

export default function FAQSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Sample FAQs
  const faqs = [
    {
      id: '1',
      question: 'Berapa lama waktu yang dibutuhkan untuk memproses pengaduan?',
      answer:
        'Sebagian besar pengaduan diproses dalam 3-5 hari kerja. Masalah yang kompleks mungkin membutuhkan waktu lebih lama untuk diselesaikan.',
    },
    {
      id: '2',
      question: 'Bisakah saya memperbarui pengaduan setelah pengajuan?',
      answer:
        'Ya, Anda dapat menambahkan informasi tambahan ke pengaduan Anda kapan saja melalui halaman detail pengaduan.',
    },
    {
      id: '3',
      question: 'Apa yang terjadi jika pengaduan saya ditolak?',
      answer:
        'Jika pengaduan Anda ditolak, Anda akan menerima penjelasan terperinci. Anda dapat mengajukan pengaduan baru dengan informasi tambahan jika diperlukan.',
    },
  ];

  return (
    <View className="mb-6 px-5">
      <Header title="Pertanyaan yang Sering Diajukan" />

      {faqs.map((faq) => (
        <TouchableOpacity
          key={faq.id}
          onPress={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
          className="mb-3 rounded-xl border border-gray-200 bg-white p-4">
          <View className="flex-row items-center justify-between">
            <Text className="flex-1 pr-2 text-base font-semibold text-gray-900">
              {faq.question}
            </Text>
            <ChevronRight
              size={20}
              color={colors.palette.gray[400]}
              style={{ transform: [{ rotate: expandedId === faq.id ? '90deg' : '0deg' }] }}
            />
          </View>

          {expandedId === faq.id && <Text className="mt-2 text-gray-600">{faq.answer}</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
}
