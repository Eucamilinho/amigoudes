import React, { useState } from 'react';
import {
  Text,
  TextInput,
  View,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useTheme } from '@/hooks/useTheme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  containerStyle,
  containerClassName = '',
  className = '',
  placeholderTextColor,
  onFocus,
  onBlur,
  ...props
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={`w-full gap-1.5 ${containerClassName}`.trim()} style={containerStyle}>
      {label ? (
        <Text className="text-[12px] leading-[16px] font-medium uppercase tracking-[0.6px] text-mid-gray px-1">
          {label}
        </Text>
      ) : null}

      <View
        className={`w-full flex-row items-center rounded-pill bg-canvas px-4 h-12 ${
          error
            ? 'border border-destructive'
            : isFocused
              ? 'border border-primary bg-paper'
              : 'border border-transparent'
        }`}
      >
        {leftIcon ? <View className="mr-2.5">{leftIcon}</View> : null}

        <TextInput
          className={`flex-1 text-[15px] leading-[22px] text-ink font-normal ${className}`.trim()}
          placeholderTextColor={placeholderTextColor ?? colors.midGray}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />

        {rightIcon ? <View className="ml-2.5">{rightIcon}</View> : null}
      </View>

      {error ? (
        <Text className="text-[12px] leading-[16px] text-destructive font-medium px-1">
          {error}
        </Text>
      ) : hint ? (
        <Text className="text-[12px] leading-[16px] text-mid-gray px-1">
          {hint}
        </Text>
      ) : null}
    </View>
  );
};
