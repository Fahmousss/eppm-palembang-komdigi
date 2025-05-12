'use client';

import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { cn } from '~/lib/utils';

export type AlertButtonStyle = 'default' | 'cancel' | 'destructive';

export interface AlertButton {
  text: string;
  style?: AlertButtonStyle;
  onPress?: () => void;
}

export interface AlertDialogProps {
  visible: boolean;
  title?: string;
  message?: string;
  buttons?: AlertButton[];
  onDismiss?: () => void;
  cancelable?: boolean;
}

export default function AlertDialog({
  visible,
  title,
  message,
  buttons = [{ text: 'OK' }],
  onDismiss,
  cancelable = true,
}: AlertDialogProps) {
  const [modalVisible, setModalVisible] = useState(visible);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setModalVisible(false);
      });
    }
  }, [visible, fadeAnim, scaleAnim]);

  const handleBackdropPress = () => {
    if (cancelable && onDismiss) {
      onDismiss();
    }
  };

  const handleButtonPress = (button: AlertButton) => {
    if (button.onPress) {
      button.onPress();
    }
    if (onDismiss) {
      onDismiss();
    }
  };

  // Determine if buttons should be horizontal or vertical
  const useHorizontalButtons = buttons.length <= 2;

  // Get button style based on type
  const getButtonTextStyle = (style?: AlertButtonStyle) => {
    switch (style) {
      case 'cancel':
        return 'font-semibold text-blue-600';
      case 'destructive':
        return 'font-semibold text-red-600';
      default:
        return 'font-normal text-blue-600';
    }
  };

  return (
    <Modal transparent visible={modalVisible} animationType="none" onRequestClose={onDismiss}>
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View className="flex-1 items-center justify-center bg-black/40">
          <TouchableWithoutFeedback>
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
                width: Math.min(Dimensions.get('window').width - 40, 270),
              }}
              className="overflow-hidden rounded-xl bg-white">
              {/* Title and Message */}
              <View className="px-4 pb-3 pt-4">
                {title && (
                  <Text className="mb-1 text-center text-lg font-semibold text-gray-900">
                    {title}
                  </Text>
                )}
                {message && (
                  <Text className="text-center text-[15px] text-gray-600">{message}</Text>
                )}
              </View>

              {/* Buttons */}
              {useHorizontalButtons ? (
                // Horizontal buttons (1-2 buttons)
                <View className="flex-row border-t border-gray-200">
                  {buttons.map((button, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <View className="w-[1px] bg-gray-200" />}
                      <TouchableOpacity
                        className={cn('flex-1 px-1 py-3')}
                        onPress={() => handleButtonPress(button)}
                        activeOpacity={0.6}>
                        <Text
                          className={cn(
                            'text-center text-[17px]',
                            getButtonTextStyle(button.style)
                          )}>
                          {button.text}
                        </Text>
                      </TouchableOpacity>
                    </React.Fragment>
                  ))}
                </View>
              ) : (
                // Vertical buttons (3+ buttons)
                <View className="border-t border-gray-200">
                  {buttons.map((button, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <View className="h-[1px] bg-gray-200" />}
                      <TouchableOpacity
                        className="px-1 py-3"
                        onPress={() => handleButtonPress(button)}
                        activeOpacity={0.6}>
                        <Text
                          className={cn(
                            'text-center text-[17px]',
                            getButtonTextStyle(button.style)
                          )}>
                          {button.text}
                        </Text>
                      </TouchableOpacity>
                    </React.Fragment>
                  ))}
                </View>
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
