import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import {
  ChevronLeft,
  Camera,
  File,
  X,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Upload,
  Paperclip,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import axiosInstance from '~/config/axiosConfig';
import { colors } from '~/lib/color';
import { useAppData } from '~/context/AppDataContext';
import { SafeAreaView } from '~/components/core/SafeAreaView';
import { useAlert } from '~/components/core/AlertDialogProvider';
import Input from '~/components/core/Input';
import Button from '~/components/core/Button';
import { useSession } from '~/context/AuthContext';
import type { Complaint, ComplaintAttachment, Category } from '~/config/types';

export default function NewComplaintScreen() {
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB dalam bytes
  const { alert } = useAlert();
  const { user } = useSession();
  const { triggerRefresh } = useAppData();
  const scrollViewRef = useRef<ScrollView>(null);

  // Add a fallback categories array after the useState declarations
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Add these fallback categories to use if API fetch fails
  const fallbackCategories: Category[] = [
    { id: '1', name: 'Layanan' },
    { id: '2', name: 'Fasilitas' },
    { id: '3', name: 'Staf/Pegawai' },
    { id: '4', name: 'Aplikasi/Website' },
    { id: '5', name: 'Lainnya' },
  ];

  // State untuk form
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Complaint & { attachments: ComplaintAttachment[] }>({
    user_id: user?.id,
    title: '',
    category_id: '',
    location: '',
    description: '',
    attachments: [],
  });

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    location: '',
    category_id: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update the useEffect that fetches categories to handle failures better
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await axiosInstance.get('/categories');
        if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          setCategories(response.data.data);
          // Set default category
          setFormData((prev) => ({
            ...prev,
            category_id: response.data.data[0].id.toString(),
          }));
        } else {
          // Use fallback categories if API returns empty array
          setCategories(fallbackCategories);
          setFormData((prev) => ({
            ...prev,
            category_id: fallbackCategories[0].id.toString(),
          }));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Use fallback categories on error
        setCategories(fallbackCategories);
        setFormData((prev) => ({
          ...prev,
          category_id: fallbackCategories[0].id.toString(),
        }));
        showAlert({
          title: 'Peringatan',
          message: 'Gagal memuat kategori dari server. Menggunakan kategori default.',
        });
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Validasi form
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      title: '',
      description: '',
      location: '',
      category_id: '',
    };

    if (!formData.title.trim()) {
      newErrors.title = 'Judul pengaduan wajib diisi';
      isValid = false;
    } else if (formData.title.length < 5) {
      newErrors.title = 'Judul terlalu pendek (minimal 5 karakter)';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Deskripsi pengaduan wajib diisi';
      isValid = false;
    } else if (formData.description.length < 20) {
      newErrors.description = 'Deskripsi terlalu pendek (minimal 20 karakter)';
      isValid = false;
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Lokasi wajib diisi';
      isValid = false;
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Kategori wajib dipilih';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Fungsi untuk menangani perubahan input
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Hapus error saat pengguna mengetik
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Fungsi untuk menangani langkah berikutnya
  const handleNextStep = () => {
    if (currentStep === 1 && !validateForm()) {
      return;
    }
    setCurrentStep((prev) => prev + 1);
    // Scroll ke atas saat pindah langkah
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  // Fungsi untuk menangani langkah sebelumnya
  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
    // Scroll ke atas saat pindah langkah
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  // Fungsi untuk memilih gambar dari galeri
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const fileExtension = asset.uri.split('.').pop() || 'jpg';
      const fileName = `image_${Date.now()}.${fileExtension}`;
      const fileInfo = await getFileInfo(asset.uri);

      if (fileInfo?.size && fileInfo.size > MAX_FILE_SIZE) {
        showAlert({
          title: 'Ukuran File Terlalu Besar',
          message: 'Maksimal ukuran file adalah 10MB. Silakan pilih file yang lebih kecil.',
        });
        return;
      }

      const newAttachment: ComplaintAttachment = {
        uri: asset.uri,
        type: `image/${fileExtension}`,
        name: fileName,
        file_name: fileName,
        file_type: `image/${fileExtension}`,
        file_size: fileInfo?.size || 0,
      };

      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment],
      }));
    }
  };

  // Helper function to get file info
  const getFileInfo = async (uri: string) => {
    try {
      const fileInfo = await fetch(uri).then((response) => {
        return {
          size: Number.parseInt(response.headers.get('Content-Length') || '0'),
          type: response.headers.get('Content-Type') || '',
        };
      });
      return fileInfo;
    } catch (error) {
      console.error('Error getting file info:', error);
      return null;
    }
  };

  const showAlert = async ({
    title,
    message,
    textButton,
    onPress,
  }: {
    title: string;
    message: string;
    textButton?: string;
    onPress?(): void;
  }) => {
    await alert({
      title: title,
      message: message,
      buttons: [
        {
          text: textButton || 'Oke',
          onPress: onPress,
        },
      ],
    });
  };

  // Fungsi untuk mengambil foto dengan kamera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      showAlert({
        title: 'Izin diperlukan',
        message: 'Maaf, kami membutuhkan izin kamera untuk fitur ini!',
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const fileExtension = asset.uri.split('.').pop() || 'jpg';
      const fileName = `camera_${Date.now()}.${fileExtension}`;
      const fileInfo = await getFileInfo(asset.uri);

      if (fileInfo?.size && fileInfo.size > MAX_FILE_SIZE) {
        showAlert({
          title: 'Ukuran File Terlalu Besar',
          message:
            'Maksimal ukuran file adalah 10MB. Silakan ambil foto dengan resolusi lebih rendah.',
        });
        return;
      }

      const newAttachment: ComplaintAttachment = {
        uri: asset.uri,
        type: `image/${fileExtension}`,
        name: fileName,
        file_name: fileName,
        file_type: `image/${fileExtension}`,
        file_size: fileInfo?.size || 0,
      };

      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment],
      }));
    }
  };

  // Fungsi untuk memilih dokumen
  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      copyToCacheDirectory: true,
    });

    if (result.canceled === false && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];

      if (asset.size && asset.size > MAX_FILE_SIZE) {
        showAlert({
          title: 'Ukuran File Terlalu Besar',
          message: 'Dokumen melebihi batas 10MB. Silakan pilih file yang lebih kecil.',
        });
        return;
      }

      const newAttachment: ComplaintAttachment = {
        uri: asset.uri,
        type: asset.mimeType || 'application/octet-stream',
        name: asset.name || `document_${Date.now()}`,
        file_name: asset.name || `document_${Date.now()}`,
        file_type: asset.mimeType || 'application/octet-stream',
        file_size: asset.size || 0,
      };

      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment],
      }));
    }
  };

  // Fungsi untuk menghapus lampiran
  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  // Format file size to readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Fungsi untuk mengirim pengaduan
  const handleSubmit = async () => {
    if (!validateForm()) {
      setCurrentStep(1); // Kembali ke langkah pertama jika ada error
      return;
    }
    const oversizedFiles = formData.attachments.filter((a) => a.file_size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      showAlert({
        title: 'Lampiran Terlalu Besar',
        message:
          'Satu atau lebih file melebihi batas 10MB. Silakan hapus atau ganti file tersebut.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Buat FormData untuk mengirim file
      const formDataToSend = new FormData();

      // Add basic complaint data
      formDataToSend.append('title', formData.title);
      formDataToSend.append('category_id', formData.category_id);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('description', formData.description);

      // Add user ID if available
      if (formData.user_id) {
        formDataToSend.append('user_id', formData.user_id.toString());
      }

      // Tambahkan lampiran dengan format yang benar untuk backend
      if (formData.attachments && formData.attachments.length > 0) {
        formData.attachments.forEach((attachment, index) => {
          // Format file object according to what the backend expects
          const file = {
            uri: attachment.uri,
            type: attachment.type,
            name: attachment.name,
          };

          // Use the correct field name expected by the backend
          formDataToSend.append(`lampiran[${index}]`, file as any);
        });
      }

      // Kirim ke API dengan konfigurasi yang benar
      const response = await axiosInstance.post('/complaints', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });

      // Refresh data pengaduan
      triggerRefresh();

      // Tampilkan pesan sukses
      showAlert({
        title: 'Pengaduan Terkirim',
        message: 'Pengaduan Anda telah berhasil dikirim. Kami akan memprosesnya segera.',
        textButton: 'Ok',
        onPress() {
          router.back();
        },
      });
    } catch (error: any) {
      console.error('Error submitting complaint:', error);

      // Handle error response from server
      let errorMessage = 'Terjadi kesalahan saat mengirim pengaduan Anda. Silakan coba lagi nanti.';

      showAlert({
        title: 'Gagal Mengirim',
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get category name by ID
  const getCategoryName = (id: string | number): string => {
    const category = categories.find((cat) => cat.id.toString() === id.toString());
    return category ? category.name : 'Unknown';
  };

  // Render langkah form yang berbeda
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View>
            <Text className="mb-6 text-lg font-semibold text-gray-900">Detail Pengaduan</Text>

            {/* Judul Pengaduan */}
            <Input
              required
              label="Judul Pengaduan"
              value={formData.title}
              onChangeText={(text) => handleChange('title', text)}
              placeholder="Masukkan judul pengaduan"
              keyboardType="default"
              autoCapitalize="none"
              error={errors.title}
              returnKeyType="next"
              blurOnSubmit={false}
            />

            {/* Kategori Pengaduan */}
            <View className="mb-4">
              <Text className="mb-1 text-sm font-medium text-gray-700">
                Kategori <Text className="text-red-500">*</Text>
              </Text>
              <View className="overflow-hidden rounded-lg border border-gray-300">
                {isLoadingCategories ? (
                  <View className="h-12 items-center justify-center">
                    <ActivityIndicator size="small" color={colors.primary} />
                  </View>
                ) : (
                  <Picker
                    selectedValue={formData.category_id}
                    onValueChange={(value) => handleChange('category_id', value.toString())}
                    style={{ height: 50 }}>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <Picker.Item
                          key={category.id.toString()}
                          label={category.name}
                          value={category.id.toString()}
                        />
                      ))
                    ) : (
                      <Picker.Item label="Tidak ada kategori" value="" />
                    )}
                  </Picker>
                )}
              </View>
              {errors.category_id ? (
                <Text className="mt-1 text-xs text-red-500">{errors.category_id}</Text>
              ) : null}
            </View>

            {/* Lokasi */}
            <Input
              required
              label="Lokasi"
              value={formData.location}
              onChangeText={(text) => handleChange('location', text)}
              placeholder="Misal: jl. H Ponorogo 1, www.humbali.com"
              keyboardType="default"
              autoCapitalize="none"
              error={errors.location}
              returnKeyType="next"
              blurOnSubmit={false}
            />

            {/* Deskripsi Pengaduan */}
            <Input
              multiline
              inputClassName="min-h-[120px]"
              label="Deksripsi Pengaduan"
              required
              returnKeyType="next"
              placeholder="Jelaskan detail pengaduan Anda"
              value={formData.description}
              onChangeText={(text) => handleChange('description', text)}
              textAlignVertical="top"
              error={errors.description}
            />
          </View>
        );

      case 2:
        return (
          <View>
            <Text className="mb-6 text-lg font-semibold text-gray-900">Lampiran</Text>
            <Text className="mb-4 text-gray-600">
              Tambahkan foto atau dokumen yang mendukung pengaduan Anda (opsional).
            </Text>

            {/* Tombol Tambah Lampiran */}
            <View className="mb-6 flex-row">
              <TouchableOpacity
                onPress={pickImage}
                className="mr-3 flex-row items-center rounded-lg bg-blue-50 p-3">
                <Upload size={18} color={colors.primary} />
                <Text className="ml-2 font-medium text-blue-600">Galeri</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={takePhoto}
                className="mr-3 flex-row items-center rounded-lg bg-green-50 p-3">
                <Camera size={18} color={colors.success} />
                <Text className="ml-2 font-medium text-green-600">Kamera</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={pickDocument}
                className="flex-row items-center rounded-lg bg-purple-50 p-3">
                <File size={18} color={colors.secondary} />
                <Text className="ml-2 font-medium text-purple-600">Dokumen</Text>
              </TouchableOpacity>
            </View>

            {/* Daftar Lampiran */}
            {formData.attachments?.length > 0 ? (
              <View>
                <Text className="mb-2 text-sm font-medium text-gray-700">
                  Lampiran ({formData.attachments.length})
                </Text>
                {formData.attachments.map((attachment, index) => (
                  <View
                    key={index}
                    className="mb-2 flex-row items-center rounded-lg bg-gray-50 p-3">
                    {attachment.type.startsWith('image/') ? (
                      <Image source={{ uri: attachment.uri }} className="mr-3 h-10 w-10 rounded" />
                    ) : (
                      <View className="mr-3 h-10 w-10 items-center justify-center rounded bg-gray-200">
                        <File size={20} color={colors.palette.gray[400]} />
                      </View>
                    )}
                    <View className="flex-1">
                      <Text className="text-gray-900" numberOfLines={1}>
                        {attachment.name}
                      </Text>
                      <View className="flex-row items-center">
                        <Text className="text-xs text-gray-500">
                          {attachment.type.startsWith('image/') ? 'Gambar' : 'Dokumen'}
                        </Text>
                        {attachment.file_size ? (
                          <Text className="ml-2 text-xs text-gray-500">
                            {formatFileSize(attachment.file_size)}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => removeAttachment(index)}>
                      <X size={20} color={colors.danger} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <View className="items-center rounded-lg bg-gray-50 p-6">
                <View className="mb-2 h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                  <Paperclip size={24} color={colors.palette.gray[400]} />
                </View>
                <Text className="text-center text-gray-700">Belum ada lampiran</Text>
                <Text className="text-center text-sm text-gray-500">
                  Lampiran dapat membantu kami memahami pengaduan Anda dengan lebih baik
                </Text>
              </View>
            )}
          </View>
        );

      case 3:
        return (
          <View>
            <Text className="mb-6 text-lg font-semibold text-gray-900">Pratinjau & Kirim</Text>

            {/* Ringkasan Pengaduan */}
            <View className="mb-6 rounded-lg bg-gray-50 p-4">
              <View className="mb-4">
                <Text className="mb-1 text-sm text-gray-500">Judul Pengaduan</Text>
                <Text className="text-base font-medium text-gray-900">{formData.title}</Text>
              </View>

              <View className="mb-4">
                <Text className="mb-1 text-sm text-gray-500">Kategori</Text>
                <Text className="text-base text-gray-900">
                  {getCategoryName(formData.category_id)}
                </Text>
              </View>

              <View className="mb-4">
                <Text className="mb-1 text-sm text-gray-500">Lokasi</Text>
                <Text className="text-base text-gray-900">{formData.location}</Text>
              </View>

              <View className="mb-4">
                <Text className="mb-1 text-sm text-gray-500">Deskripsi</Text>
                <Text className="text-base text-gray-900">{formData.description}</Text>
              </View>

              <View>
                <Text className="mb-1 text-sm text-gray-500">Lampiran</Text>
                <Text className="text-base text-gray-900">
                  {formData.attachments.length > 0
                    ? `${formData.attachments.length} file terlampir`
                    : 'Tidak ada lampiran'}
                </Text>
              </View>
            </View>

            {/* Disclaimer */}
            <View className="mb-6 rounded-lg bg-yellow-50 p-4">
              <View className="flex-row">
                <AlertCircle size={20} color={colors.warning} />
                <Text className="ml-2 flex-1 text-yellow-700">
                  Dengan mengirimkan pengaduan ini, Anda menyatakan bahwa informasi yang diberikan
                  adalah benar dan akurat.
                </Text>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ChevronLeft size={24} color={colors.palette.gray[400]} />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">Pengaduan Baru</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Progress Indicator */}
        <View className="w-full px-5 pb-2 pt-4">
          <View className="mb-2 w-full flex-row items-center">
            {[1, 2, 3].map((step) => (
              <View key={step} className={`${step < 3 && 'flex-1'} flex-row items-center`}>
                <View
                  className={`h-8 w-8 items-center justify-center rounded-full ${
                    currentStep >= step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}>
                  {currentStep > step ? (
                    <CheckCircle size={16} color="#FFFFFF" />
                  ) : (
                    <Text
                      className={`font-medium ${currentStep >= step ? 'text-white' : 'text-gray-600'}`}>
                      {step}
                    </Text>
                  )}
                </View>
                {step < 3 && (
                  <View
                    className={`h-1 flex-1 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}`}></View>
                )}
              </View>
            ))}
          </View>
          <View className="flex-row justify-between">
            <Text className="text-xs text-gray-600">Detail</Text>
            <Text className="text-xs text-gray-600">Lampiran</Text>
            <Text className="text-xs text-gray-600">Kirim</Text>
          </View>
        </View>

        {/* Form Content */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-5 pt-2"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {renderStepContent()}
          <View className="h-20" />
        </ScrollView>

        {/* Navigation Buttons */}
        <View className="border-t border-gray-200 bg-white px-5 py-4">
          <View className="flex-row justify-between">
            {currentStep > 1 ? (
              <Button onPress={handlePrevStep} variant="secondary">
                <ChevronLeft size={16} color={colors.palette.gray[400]} />
                <Text className="ml-1 font-medium text-gray-700">Kembali</Text>
              </Button>
            ) : (
              <Button onPress={() => router.back()} variant="secondary">
                <X size={16} color={colors.palette.gray[400]} />
                <Text className="ml-1 font-medium text-gray-700">Batal</Text>
              </Button>
            )}

            {currentStep < 3 ? (
              <Button onPress={handleNextStep}>
                <Text className="mr-1 font-medium text-white">Lanjut</Text>
                <ChevronRight size={16} color="#FFFFFF" />
              </Button>
            ) : (
              <Button
                onPress={async () => {
                  await alert({
                    title: 'Konfirmasi aksi',
                    message: 'Apakah anda yakin dengan data yang anda kirim?',
                    cancelable: true,
                    buttons: [
                      { text: 'Cancel', style: 'destructive' },
                      {
                        text: 'Kirim',
                        style: 'cancel',
                        onPress: () => {
                          handleSubmit();
                        },
                      },
                    ],
                  });
                }}
                disabled={isSubmitting}
                className={isSubmitting ? 'bg-blue-400' : ''}>
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="font-medium text-white">Kirim Pengaduan</Text>
                )}
              </Button>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
