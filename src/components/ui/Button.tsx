import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import type { ButtonSize, ButtonVariant } from '@/types/theme';
import { useTheme } from '@/hooks/useTheme';

export interface ButtonProps {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  accessibilityHint?: string;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  icon,
  iconPosition = 'left',
  accessibilityHint,
  className = '',
  style,
}) => {
  const resolvedLeftIcon = leftIcon ?? (iconPosition === 'left' ? icon : undefined);
  const resolvedRightIcon = rightIcon ?? (iconPosition === 'right' ? icon : undefined);
  const isDisabled = disabled || loading;

  const sizeContainerClasses: Record<ButtonSize, string> = {
    sm: 'h-11 px-4',
    md: 'h-12 px-5',
    lg: 'h-14 px-6',
  };

  const sizeTextClasses: Record<ButtonSize, string> = {
    sm: 'text-[14px] leading-[20px]',
    md: 'text-[15px] leading-[22px]',
    lg: 'text-[16px] leading-[24px]',
  };

  const { colors } = useTheme();

  const getVariantStyles = (): { container: string; text: string; spinner: string } => {
    switch (variant) {
      case 'primary':
        return {
          container: isDisabled
            ? 'bg-hairline opacity-60'
            : 'bg-primary active:bg-primary-pressed',
          text: isDisabled ? 'text-mid-gray' : 'text-white font-medium',
          spinner: '#FFFFFF',
        };
      case 'secondary':
        return {
          container: isDisabled
            ? 'bg-canvas opacity-50'
            : 'bg-canvas active:bg-hairline',
          text: isDisabled ? 'text-mid-gray' : 'text-ink font-medium',
          spinner: colors.ink,
        };
      case 'outline':
        return {
          container: isDisabled
            ? 'bg-transparent border border-hairline opacity-50'
            : 'bg-transparent border border-hairline active:bg-surface-alt active:border-mid-gray',
          text: isDisabled ? 'text-mid-gray' : 'text-ink font-medium',
          spinner: colors.ink,
        };
      case 'destructive':
        return {
          container: isDisabled
            ? 'bg-transparent border border-hairline opacity-40'
            : 'bg-transparent border border-destructive active:bg-destructive/10',
          text: isDisabled ? 'text-mid-gray' : 'text-destructive font-medium',
          spinner: colors.destructive,
        };
    }
  };

  const { container, text, spinner } = getVariantStyles();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={style}
      className={`rounded-pill min-h-[44px] flex-row items-center justify-center gap-2 ${sizeContainerClasses[size]} ${container} ${
        fullWidth ? 'w-full' : 'self-start'
      } ${className}`.trim()}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinner} />
      ) : (
        <>
          {resolvedLeftIcon}
          <Text className={`${sizeTextClasses[size]} ${text}`}>
            {label}
          </Text>
          {resolvedRightIcon}
        </>
      )}
    </Pressable>
  );
};
