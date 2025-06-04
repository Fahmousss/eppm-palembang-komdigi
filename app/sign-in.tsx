import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useSession } from '~/context/AuthContext';
import Banner from '~/components/core/Banner';
import Input from '~/components/core/Input';
import Button from '~/components/core/Button';
import axiosInstance from '~/config/axiosConfig';
import axios from 'axios';
import { SafeAreaView } from '~/components/core/SafeAreaView';

type FormState = {
  email: string;
  password: string;
};

type ErrorState = {
  email?: string;
  password?: string;
  general?: string;
};

const SignInScreen = () => {
  const { signIn } = useSession();
  const [form, setForm] = useState<FormState>({ email: '', password: '' });
  const [errors, setErrors] = useState<ErrorState>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const passwordRef = useRef<TextInput>(null);

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    // Real-time validation
    if (errors[key]) validateField(key, value);
  };

  const handleError = (key: keyof ErrorState, message = '') => {
    setErrors((prev) => ({ ...prev, [key]: message }));
  };

  const validateField = (key: keyof FormState, value: string) => {
    switch (key) {
      case 'email':
        if (!value.trim()) return handleError('email', 'Email is required');
        if (!/\S+@\S+\.\S+/.test(value))
          return handleError('email', 'Please enter a valid email address');
        break;
      case 'password':
        if (!value.trim()) return handleError('password', 'Password is required');
        break;
    }
    handleError(key); // Clear error
    return true;
  };

  const handleSignIn = async () => {
    setErrors({});
    setSuccessMessage('');

    const isEmailValid = validateField('email', form.email);
    const isPasswordValid = validateField('password', form.password);

    if (!isEmailValid || !isPasswordValid) return;

    setIsLoading(true);
    setErrors({
      email: '',
      password: '',
      general: '',
    });
    try {
      const response = await axiosInstance.post('/login', form);

      await signIn(response.data.token, response.data.user);
      router.replace('/');
      // setSuccessMessage('Successfully signed in!');
      // Reset form if needed
      // setForm({ email: '', password: '' });
    } catch (error) {
      // eslint-disable-next-line import/no-named-as-default-member
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        if (responseData?.errors) {
          setErrors(responseData.errors);
        } else if (responseData?.message) {
          handleError('general', responseData?.message);
        }
      } else {
        handleError('general', 'Unable connect to the server');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerClassName="flex-grow" keyboardShouldPersistTaps="handled">
          <SafeAreaView>
            <View className="flex-1 justify-center p-6">
              <View className="mb-8 items-center">
                <Image
                  className="mb-4 h-28 w-52"
                  resizeMode="contain"
                  source={require('assets/logo-horizontal.png')}
                />
                <Text className="text-3xl font-bold text-gray-800">Selamat Datang</Text>
                <Text className="mt-2 text-center text-gray-500">
                  Masuk dengan akun anda untuk lanjut
                </Text>
              </View>

              <View className="mb-6">
                {errors.general ? (
                  <Banner variant="error" message={errors.general} />
                ) : successMessage ? (
                  <Banner variant="success" message={successMessage} />
                ) : null}

                <Input
                  label="Email"
                  value={form.email}
                  onChangeText={(text) => handleChange('email', text)}
                  placeholder="Masukkan email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  blurOnSubmit={false}
                />

                <Input
                  ref={passwordRef}
                  label="Password"
                  value={form.password}
                  onChangeText={(text) => handleChange('password', text)}
                  placeholder="Masukkan password"
                  secureTextEntry
                  error={errors.password}
                  returnKeyType="done"
                  onSubmitEditing={handleSignIn}
                />
                {/* 
                <TouchableOpacity className="mb-4 self-end">
                  <Text className="text-sm text-blue-600">Forgot Password?</Text>
                </TouchableOpacity> */}

                <Button
                  title="Sign In"
                  onPress={handleSignIn}
                  loading={isLoading}
                  disabled={isLoading}
                  size="large"
                  className="mt-2"
                />
              </View>

              <View className="mt-6 flex-row justify-center">
                <Text className="text-gray-600">Belum punya akun? </Text>
                <TouchableOpacity onPress={() => router.push('/sign-up')}>
                  <Text className="font-medium text-blue-600">Daftar sekarang</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;
