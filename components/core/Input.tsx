'use client';

import { useState, forwardRef } from 'react';
import { View, TextInput, Text, type TextInputProps } from 'react-native';
import { cn } from '~/lib/utils';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  value?: string;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  secureTextEntry?: boolean;
  onChangeText?: (text: string) => void;
  error?: string;
  label?: string;
  className?: string;
  inputClassName?: string;
  errorClassName?: string;
  labelClassName?: string;
}

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      value,
      placeholder,
      keyboardType = 'default',
      secureTextEntry = false,
      onChangeText,
      error,
      label,
      className,
      inputClassName,
      errorClassName,
      labelClassName,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: any) => {
      setIsFocused(true);
      if (props.onFocus) {
        props.onFocus(e);
      }
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      if (props.onBlur) {
        props.onBlur(e);
      }
    };

    return (
      <View className={cn('mb-4', className)}>
        {label && (
          <Text
            className={cn(
              'mb-1 text-sm font-medium text-gray-700',
              error && 'text-red-500',
              labelClassName
            )}>
            {label}
          </Text>
        )}

        <TextInput
          ref={ref}
          value={value}
          placeholder={placeholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            'w-full rounded-md border px-3 py-2.5 text-base',
            'bg-white text-gray-900',
            isFocused ? 'border-blue-500 ' : 'border-gray-300',
            error ? 'border-red-500' : '',
            inputClassName
          )}
          placeholderTextColor="#9CA3AF" // text-gray-400 equivalent
          {...props}
        />

        {error && <Text className={cn('mt-1 text-sm text-red-500', errorClassName)}>{error}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';

export default Input;
