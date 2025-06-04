'use client';

import { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function OnboardingScreen() {
  // Animation values
  const logoAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const descriptionAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(1)).current;

  // Button pulse animation
  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonAnim, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(buttonAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // Logo animation
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      // Title animation
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      // Description animation
      Animated.timing(descriptionAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Start button pulse animation after other animations complete
      startPulse();
    });
  }, []);

  return (
    <LinearGradient
      colors={['#1e40af', '#3b82f6']}
      className="flex-1 items-center justify-center px-6">
      <StatusBar style="light" />

      {/* Logo with animation */}
      <Animated.View
        className="mb-8 items-center justify-center"
        style={{
          opacity: logoAnim,
          transform: [
            {
              scale: logoAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 1],
              }),
            },
          ],
        }}>
        <View className="rounded-full bg-white p-5 shadow-lg">
          <Image
            source={require('../assets/icon.png')}
            className="h-24 w-24"
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      {/* Title with animation */}
      <Animated.Text
        className="mb-2 text-center text-3xl font-bold text-white"
        style={{
          opacity: titleAnim,
          transform: [
            {
              translateY: titleAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}>
        Komdigi
      </Animated.Text>

      {/* Description with animation */}
      <Animated.Text
        className="mb-12 text-center text-lg text-white opacity-90"
        style={{
          opacity: descriptionAnim,
          transform: [
            {
              translateY: descriptionAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}>
        Elektronik Pengaduan dan{'\n'}Pelayanan Masyarakat
      </Animated.Text>

      {/* Button with animation */}
      <Animated.View
        style={{
          transform: [{ scale: buttonAnim }],
        }}>
        <TouchableOpacity
          className="rounded-full bg-white px-10 py-4 shadow-lg"
          onPress={() => router.push('/sign-in')}
          activeOpacity={0.8}>
          <Text className="text-lg font-bold text-blue-700">Masuk</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}
