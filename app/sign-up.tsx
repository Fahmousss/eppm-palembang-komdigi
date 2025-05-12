'use client';

import axios from 'axios';
import { router } from 'expo-router';
import { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  type TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Banner from '~/components/core/Banner';
import Button from '~/components/core/Button';
import Input from '~/components/core/Input';
import axiosInstance from '~/config/axiosConfig';

export default function SignUpForm() {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  // Error state (unified)
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    general: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Refs
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  // Helpers
  const updateField = (field: keyof typeof data, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const setFieldError = (field: keyof typeof errors, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  // Validation functions
  const validateFullName = (text: string) => {
    updateField('name', text);
    if (!text.trim()) {
      setFieldError('name', 'Full name is required');
      return false;
    } else if (text.trim().length < 2) {
      setFieldError('name', 'Name is too short');
      return false;
    } else {
      setFieldError('name', '');
      return true;
    }
  };

  const validateEmail = (text: string) => {
    updateField('email', text);
    if (!text.trim()) {
      setFieldError('email', 'Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(text)) {
      setFieldError('email', 'Please enter a valid email address');
      return false;
    } else {
      setFieldError('email', '');
      return true;
    }
  };

  const validatePassword = (text: string) => {
    updateField('password', text);
    if (!text) {
      setFieldError('password', 'Password is required');
      return false;
    } else if (text.length < 8) {
      setFieldError('password', 'Password must be at least 8 characters');
      return false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(text)) {
      setFieldError('password', 'Password must contain uppercase, lowercase, and number');
      return false;
    } else {
      setFieldError('password', '');
      if (data.password_confirmation) {
        validateConfirmPassword(data.password_confirmation, text);
      }
      return true;
    }
  };

  const validateConfirmPassword = (text: string, pass = data.password) => {
    updateField('password_confirmation', text);
    if (!text) {
      setFieldError('password_confirmation', 'Please confirm your password');
      return false;
    } else if (text !== pass) {
      setFieldError('password_confirmation', 'Passwords do not match');
      return false;
    } else {
      setFieldError('password_confirmation', '');
      return true;
    }
  };

  // Submit handler
  const handleSignUp = async () => {
    setFieldError('general', '');

    const isNameValid = validateFullName(data.name);
    const isEmailValid = validateEmail(data.email);
    const isPasswordValid = validatePassword(data.password);
    const isConfirmPasswordValid = validateConfirmPassword(data.password_confirmation);

    if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    setIsLoading(true);
    setErrors({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      general: '',
    });

    try {
      await axiosInstance.post('/register', data);
      // await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Sign up successful', data);

      // Reset
      resetForm();
      setSuccessMessage(
        'Account created successfully! Please check your email to verify your account'
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        if (responseData?.errors) {
          setErrors(responseData.errors);
        } else if (responseData?.message) {
          setFieldError('general', responseData.message);
        } else {
          setFieldError('general', 'Unexpected error occured');
        }
      } else {
        console.error('Error, ', error);
      }
      console.error('Sign up failed', error);
      // Alert.alert('Error', 'Unable to connect to the server');
      setFieldError('general', 'Unable to connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setData({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    });
    setErrors({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      general: '',
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerClassName="flex-grow" keyboardShouldPersistTaps="handled">
          <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 p-6">
              {/* Header */}
              <View className="mb-6 items-center">
                <View className="mb-3 h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  {/* Replace with your actual logo */}
                  <Text className="text-2xl font-bold text-blue-600">A</Text>
                </View>
                <Text className="text-2xl font-bold text-gray-800">Create Account</Text>
                <Text className="mt-1 text-center text-gray-500">Sign up to get started</Text>
              </View>

              {/* Form */}
              <View className="mb-4">
                {errors.general ? (
                  <Banner variant="error" message={errors.general} />
                ) : successMessage ? (
                  <Banner variant="success" message={successMessage} />
                ) : null}

                <Input
                  label="Full Name"
                  value={data.name}
                  onChangeText={(text) => {
                    updateField('name', text);
                    if (errors.name) validateFullName(text);
                  }}
                  placeholder="Enter your full name"
                  error={errors.name}
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                  blurOnSubmit={false}
                />

                <Input
                  ref={emailRef}
                  label="Email"
                  value={data.email}
                  onChangeText={(text) => {
                    updateField('email', text);
                    if (errors.email) validateEmail(text);
                  }}
                  placeholder="Enter your email"
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
                  value={data.password}
                  onChangeText={(text) => {
                    updateField('password', text);
                    if (errors.password) validatePassword(text);
                  }}
                  placeholder="Create a password"
                  secureTextEntry
                  error={errors.password}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                  blurOnSubmit={false}
                />

                <Input
                  ref={confirmPasswordRef}
                  label="Confirm Password"
                  value={data.password_confirmation}
                  onChangeText={(text) => {
                    updateField('password_confirmation', text);
                    if (errors.password_confirmation) validateConfirmPassword(text);
                  }}
                  placeholder="Confirm your password"
                  secureTextEntry
                  error={errors.password_confirmation}
                  returnKeyType="next"
                  onSubmitEditing={handleSignUp}
                />

                <Button
                  title="Create Account"
                  onPress={handleSignUp}
                  loading={isLoading}
                  disabled={isLoading}
                  size="large"
                  className="mt-2"
                />
              </View>

              {/* Sign In Link */}
              <View className="mt-6 flex-row justify-center">
                <Text className="text-gray-600">Already have an account? </Text>
                <TouchableOpacity
                  onPress={() => {
                    router.push('/sign-in');
                  }}>
                  <Text className="font-medium text-blue-600">Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
