'use client';

import type React from 'react';

import { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Animated,
  Dimensions,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Search,
  ChevronDown,
  HelpCircle,
  FileText,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Mail,
  Phone,
  ExternalLink,
} from 'lucide-react-native';
import { colors } from '~/lib/color';

export default function BantuanPengaduanScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [expandedFaqs, setExpandedFaqs] = useState<string[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<typeof faqData>(faqData);
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Handle search
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredFaqs(faqData);
      return;
    }

    const lowercasedQuery = text.toLowerCase();
    const filtered = faqData.filter(
      (faq) =>
        faq.question.toLowerCase().includes(lowercasedQuery) ||
        faq.answer.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredFaqs(filtered);
  };

  // Toggle FAQ expansion
  const toggleFaq = (id: string) => {
    setExpandedFaqs((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);

    // Animate the section expansion
    Animated.timing(animatedValue, {
      toValue: activeSection === section ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Render FAQ item
  const renderFaqItem = ({ item }: { item: (typeof faqData)[0] }) => {
    const isExpanded = expandedFaqs.includes(item.id);
    return (
      <TouchableOpacity
        onPress={() => toggleFaq(item.id)}
        className="mb-3 overflow-hidden rounded-lg border border-gray-200 bg-white"
        activeOpacity={0.7}>
        <View className="p-4">
          <View className="flex-row items-center justify-between">
            <Text className="mr-2 flex-1 text-base font-semibold text-gray-900">
              {item.question}
            </Text>
            <ChevronDown
              size={20}
              color={colors.palette.gray['500']}
              style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}
            />
          </View>
          {isExpanded && <Text className="mt-2 text-gray-700">{item.answer}</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <ChevronLeft size={24} color={colors.palette.gray['400']} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">Bantuan Pengaduan</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="bg-blue-50 px-5 py-6">
          <View className="mb-4 items-center">
            <View className="mb-2 h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <HelpCircle size={32} color={colors.primary} />
            </View>
            <Text className="text-center text-xl font-bold text-gray-900">
              Pusat Bantuan Pengaduan
            </Text>
            <Text className="mt-1 text-center text-gray-600">
              Temukan jawaban untuk pertanyaan umum dan pelajari cara menggunakan sistem pengaduan
              kami.
            </Text>
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center rounded-lg border border-gray-300 bg-white px-3 py-2">
            <Search size={20} color={colors.palette.gray['400']} />
            <TextInput
              className="ml-2 flex-1 text-base text-gray-900"
              placeholder="Cari bantuan..."
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor={colors.palette.gray['400']}
            />
          </View>
        </View>

        {/* Quick Links */}
        <View className="px-5 py-4">
          <Text className="mb-3 text-lg font-semibold text-gray-900">Akses Cepat</Text>
          <View className="flex-row flex-wrap justify-between">
            <QuickLinkButton
              title="Cara Mengajukan"
              icon={<FileText size={24} color={colors.primary} />}
              bgColor="bg-blue-50"
              onPress={() => {
                setActiveSection('cara-mengajukan');
                // Scroll to the section
                setTimeout(() => {
                  setExpandedFaqs(['how-to-submit']);
                }, 100);
              }}
            />
            <QuickLinkButton
              title="Status Pengaduan"
              icon={<Clock size={24} color={colors.warning} />}
              bgColor="bg-yellow-50"
              onPress={() => {
                setActiveSection('status-pengaduan');
                // Scroll to the section
                setTimeout(() => {
                  setExpandedFaqs(['status-meaning']);
                }, 100);
              }}
            />
            <QuickLinkButton
              title="Hubungi Kami"
              icon={<MessageSquare size={24} color={colors.success} />}
              bgColor="bg-green-50"
              onPress={() => {
                setActiveSection('hubungi-kami');
              }}
            />
          </View>
        </View>

        {/* FAQ Section */}
        <View className="px-5 py-4">
          <TouchableOpacity
            onPress={() => toggleSection('faq')}
            className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-900">Pertanyaan Umum</Text>
            <ChevronDown
              size={20}
              color={colors.palette.gray['500']}
              style={{ transform: [{ rotate: activeSection === 'faq' ? '180deg' : '0deg' }] }}
            />
          </TouchableOpacity>

          {activeSection === 'faq' && (
            <FlatList
              data={filteredFaqs}
              renderItem={renderFaqItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ListEmptyComponent={
                <View className="items-center rounded-lg bg-gray-50 p-4">
                  <Text className="text-center text-gray-600">
                    Tidak ada hasil yang cocok dengan pencarian Anda. Coba kata kunci lain atau
                    hubungi dukungan kami.
                  </Text>
                </View>
              }
            />
          )}
        </View>

        {/* Cara Mengajukan Pengaduan */}
        <View className="border-t border-gray-100 px-5 py-4">
          <TouchableOpacity
            onPress={() => toggleSection('cara-mengajukan')}
            className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-900">Cara Mengajukan Pengaduan</Text>
            <ChevronDown
              size={20}
              color={colors.palette.gray['500']}
              style={{
                transform: [{ rotate: activeSection === 'cara-mengajukan' ? '180deg' : '0deg' }],
              }}
            />
          </TouchableOpacity>

          {activeSection === 'cara-mengajukan' && (
            <View>
              <View className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
                <Text className="mb-3 text-base font-semibold text-gray-900">
                  Langkah-langkah Pengajuan
                </Text>

                <StepItem
                  number={1}
                  title="Buka halaman Pengaduan"
                  description="Navigasi ke tab Pengaduan di aplikasi atau klik tombol 'Pengaduan Baru' di halaman beranda."
                />

                <StepItem
                  number={2}
                  title="Isi formulir pengaduan"
                  description="Lengkapi semua informasi yang diperlukan seperti judul, kategori, lokasi, dan deskripsi pengaduan Anda."
                />

                <StepItem
                  number={3}
                  title="Tambahkan lampiran (opsional)"
                  description="Anda dapat menambahkan foto atau dokumen pendukung untuk memperkuat pengaduan Anda."
                />

                <StepItem
                  number={4}
                  title="Tinjau dan kirim"
                  description="Periksa kembali informasi yang Anda masukkan, lalu klik tombol 'Kirim Pengaduan'."
                />

                <StepItem
                  number={5}
                  title="Pantau status"
                  description="Setelah pengaduan terkirim, Anda dapat memantau statusnya di halaman 'Pengaduan Saya'."
                  isLast
                />
              </View>

              <View className="mb-3 rounded-lg border border-gray-200 bg-white p-4">
                <Text className="mb-2 text-base font-semibold text-gray-900">
                  Tips Pengajuan Pengaduan
                </Text>
                <View className="mb-2">
                  <Text className="mb-1 text-gray-700">
                    • Berikan detail yang spesifik dan jelas
                  </Text>
                  <Text className="mb-1 text-gray-700">
                    • Sertakan tanggal, waktu, dan lokasi kejadian
                  </Text>
                  <Text className="mb-1 text-gray-700">• Lampirkan bukti pendukung jika ada</Text>
                  <Text className="mb-1 text-gray-700">
                    • Gunakan bahasa yang sopan dan objektif
                  </Text>
                  <Text className="text-gray-700">
                    • Periksa kembali pengaduan sebelum mengirim
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Status Pengaduan */}
        <View className="border-t border-gray-100 px-5 py-4">
          <TouchableOpacity
            onPress={() => toggleSection('status-pengaduan')}
            className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-900">Status Pengaduan</Text>
            <ChevronDown
              size={20}
              color={colors.palette.gray['500']}
              style={{
                transform: [{ rotate: activeSection === 'status-pengaduan' ? '180deg' : '0deg' }],
              }}
            />
          </TouchableOpacity>

          {activeSection === 'status-pengaduan' && (
            <View className="mb-3 rounded-lg border border-gray-200 bg-white p-4">
              <Text className="mb-3 text-base font-semibold text-gray-900">
                Arti Status Pengaduan
              </Text>

              <StatusItem
                icon={<Clock size={18} color={colors.warning} />}
                title="Menunggu"
                description="Pengaduan Anda telah diterima dan sedang menunggu untuk ditinjau oleh tim kami."
                bgColor="bg-yellow-50"
                textColor="text-yellow-700"
              />

              <StatusItem
                icon={<AlertCircle size={18} color={colors.primary} />}
                title="Diproses"
                description="Pengaduan Anda sedang dalam proses penanganan oleh tim terkait."
                bgColor="bg-blue-50"
                textColor="text-blue-700"
              />

              <StatusItem
                icon={<CheckCircle size={18} color={colors.success} />}
                title="Selesai"
                description="Pengaduan Anda telah ditangani dan diselesaikan."
                bgColor="bg-green-50"
                textColor="text-green-700"
              />

              <StatusItem
                icon={<XCircle size={18} color={colors.danger} />}
                title="Ditolak"
                description="Pengaduan Anda tidak dapat diproses karena alasan tertentu. Lihat detail untuk informasi lebih lanjut."
                bgColor="bg-red-50"
                textColor="text-red-700"
                isLast
              />
            </View>
          )}
        </View>

        {/* Hubungi Kami */}
        <View className="border-t border-gray-100 px-5 py-4">
          <TouchableOpacity
            onPress={() => toggleSection('hubungi-kami')}
            className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-900">Hubungi Kami</Text>
            <ChevronDown
              size={20}
              color={colors.palette.gray['500']}
              style={{
                transform: [{ rotate: activeSection === 'hubungi-kami' ? '180deg' : '0deg' }],
              }}
            />
          </TouchableOpacity>

          {activeSection === 'hubungi-kami' && (
            <View className="mb-3 rounded-lg border border-gray-200 bg-white p-4">
              <Text className="mb-3 text-base font-semibold text-gray-900">
                Butuh bantuan lebih lanjut? Hubungi kami melalui:
              </Text>

              <ContactItem
                icon={<Mail size={20} color={colors.primary} />}
                title="Email"
                value="admin.ppm@fahmousss.xyz"
                onPress={() => {
                  if (Platform.OS !== 'web') {
                    Linking.openURL('mailto:admin.ppm@fahmousss.xyz');
                  }
                }}
              />

              <ContactItem
                icon={<Phone size={20} color={colors.success} />}
                title="Telepon"
                value="(021) 1234-5678"
                onPress={() => {
                  if (Platform.OS !== 'web') {
                    Linking.openURL('tel:+62211234567');
                  }
                }}
              />

              <ContactItem
                icon={<MessageSquare size={20} color={colors.warning} />}
                title="Live Chat"
                value="Tersedia 24/7"
                onPress={() => {
                  // Open live chat
                  console.log('Open live chat');
                }}
                isLast
              />

              <View className="mt-3 rounded-lg bg-gray-50 p-3">
                <Text className="text-center text-sm text-gray-600">
                  Jam operasional: Senin - Jumat, 08.00 - 17.00 WIB
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Bottom Padding */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}

// Quick Link Button Component
function QuickLinkButton({
  title,
  icon,
  bgColor,
  onPress,
}: {
  title: string;
  icon: React.ReactNode;
  bgColor: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${bgColor} mb-2 w-[31%] items-center justify-center rounded-xl p-4`}
      activeOpacity={0.7}>
      <View className="mb-2">{icon}</View>
      <Text className="text-center text-sm font-medium text-gray-800">{title}</Text>
    </TouchableOpacity>
  );
}

// Step Item Component
function StepItem({
  number,
  title,
  description,
  isLast = false,
}: {
  number: number;
  title: string;
  description: string;
  isLast?: boolean;
}) {
  return (
    <View className="mb-4 flex-row">
      <View className="mr-3">
        <View className="h-8 w-8 items-center justify-center rounded-full bg-blue-100">
          <Text className="font-bold text-blue-700">{number}</Text>
        </View>
        {!isLast && <View className="absolute left-4 top-8 -ml-px h-full w-0.5 bg-blue-100" />}
      </View>
      <View className="flex-1">
        <Text className="mb-1 text-base font-medium text-gray-900">{title}</Text>
        <Text className="text-gray-600">{description}</Text>
      </View>
    </View>
  );
}

// Status Item Component
function StatusItem({
  icon,
  title,
  description,
  bgColor,
  textColor,
  isLast = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
  isLast?: boolean;
}) {
  return (
    <View className={`mb-${isLast ? '0' : '3'}`}>
      <View className="mb-1 flex-row items-center">
        <View className={`${bgColor} mr-2 rounded-full p-1.5`}>{icon}</View>
        <Text className={`text-base font-medium ${textColor}`}>{title}</Text>
      </View>
      <Text className="ml-9 text-gray-600">{description}</Text>
    </View>
  );
}

// Contact Item Component
function ContactItem({
  icon,
  title,
  value,
  onPress,
  isLast = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  onPress: () => void;
  isLast?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-between p-3 ${!isLast ? 'border-b border-gray-100' : ''}`}
      activeOpacity={0.7}>
      <View className="flex-row items-center">
        <View className="mr-3">{icon}</View>
        <View>
          <Text className="text-sm text-gray-500">{title}</Text>
          <Text className="text-base font-medium text-gray-900">{value}</Text>
        </View>
      </View>
      <ExternalLink size={18} color={colors.palette.gray['400']} />
    </TouchableOpacity>
  );
}

// FAQ Data
const faqData = [
  {
    id: 'how-to-submit',
    question: 'Bagaimana cara mengajukan pengaduan?',
    answer:
      "Untuk mengajukan pengaduan, buka tab Pengaduan dan klik tombol 'Pengaduan Baru'. Isi formulir dengan lengkap, tambahkan lampiran jika diperlukan, lalu klik 'Kirim Pengaduan'.",
  },
  {
    id: 'status-meaning',
    question: 'Apa arti dari status pengaduan?',
    answer:
      "Status 'Menunggu' berarti pengaduan sedang menunggu ditinjau. 'Diproses' berarti sedang ditangani. 'Selesai' berarti pengaduan telah diselesaikan. 'Ditolak' berarti pengaduan tidak dapat diproses.",
  },
  {
    id: 'time-to-process',
    question: 'Berapa lama waktu yang dibutuhkan untuk memproses pengaduan?',
    answer:
      'Waktu pemrosesan pengaduan bervariasi tergantung kompleksitas masalah. Umumnya, pengaduan akan direspon dalam 1-3 hari kerja dan diselesaikan dalam 5-10 hari kerja.',
  },
  {
    id: 'edit-complaint',
    question: 'Bisakah saya mengubah pengaduan yang sudah dikirim?',
    answer:
      "Anda tidak dapat mengubah pengaduan yang sudah dikirim. Namun, Anda dapat membatalkan pengaduan yang masih berstatus 'Menunggu' dan mengajukan pengaduan baru dengan informasi yang diperbarui.",
  },
  {
    id: 'cancel-complaint',
    question: 'Bagaimana cara membatalkan pengaduan?',
    answer:
      "Untuk membatalkan pengaduan, buka detail pengaduan yang ingin dibatalkan, lalu klik tombol 'Batalkan Pengaduan' di bagian bawah halaman. Perhatikan bahwa hanya pengaduan dengan status 'Menunggu' yang dapat dibatalkan.",
  },
  {
    id: 'attachments',
    question: 'Jenis lampiran apa yang dapat saya sertakan?',
    answer:
      'Anda dapat melampirkan foto (JPG, PNG), dokumen (PDF, DOC, DOCX), dan file lain yang relevan dengan pengaduan Anda. Ukuran maksimum setiap file adalah 5MB dan Anda dapat mengunggah hingga 5 file.',
  },
  {
    id: 'notification',
    question: 'Apakah saya akan mendapatkan notifikasi tentang status pengaduan?',
    answer:
      'Ya, Anda akan menerima notifikasi saat status pengaduan Anda berubah. Pastikan notifikasi aplikasi diaktifkan di pengaturan perangkat Anda untuk menerima pembaruan.',
  },
  {
    id: 'privacy',
    question: 'Apakah pengaduan saya bersifat rahasia?',
    answer:
      'Ya, semua pengaduan bersifat rahasia dan hanya dapat diakses oleh Anda dan tim penanganan pengaduan. Informasi pribadi Anda dilindungi sesuai dengan kebijakan privasi kami.',
  },
];
