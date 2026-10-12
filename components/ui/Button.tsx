import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ThemedText } from '@/components/ui/ThemedText';
import type { ButtonSize, ButtonVariant } from '@/types/theme';

export interface ButtonProps {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  accessibilityHint?: string;
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
  accessibilityHint,
  style,
}) => {
  const { colors, spacing, radius } = useTheme();
  const isDisabled = disabled || loading;

  const getContainerStyle = (pressed: boolean): ViewStyle => {
    let backgroundColor: string = colors.primary;
    let borderColor: string = colors.primary;
    let borderWidth = 0;

    switch (variant) {
      case 'primary':
        backgroundColor = isDisabled ? colors.surfaceSubtle : pressed ? colors.primaryDark : colors.primary;
        break;
      case 'secondary':
        backgroundColor = isDisabled ? colors.surfaceSubtle : pressed ? colors.accentLight : colors.accent;
        break;
      case 'outline':
        backgroundColor = pressed ? colors.primaryMuted : 'transparent';
        borderColor = isDisabled ? colors.border : colors.primary;
        borderWidth = 1.5;
        break;
      case 'ghost':
        backgroundColor = pressed ? colors.surfaceSubtle : 'transparent';
        break;
    }

    const paddingVertical = size === 'sm' ? spacing.sm : size === 'lg' ? spacing.lg : spacing.md;
    const paddingHorizontal = size === 'sm' ? spacing.md : size === 'lg' ? spacing.xxl : spacing.xl;

    return {
      backgroundColor,
      borderColor,
      borderWidth,
      borderRadius: radius.md,
      paddingVertical,
      paddingHorizontal,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: isDisabled && variant !== 'primary' ? 0.5 : 1,
      width: fullWidth ? '100%' : 'auto',
    };
  };

  const getTextColor = (): string => {
    if (isDisabled && variant === 'primary') return colors.textMuted;
    switch (variant) {
      case 'primary':
        return colors.textInverse;
      case 'secondary':
        return colors.textPrimary;
      case 'outline':
        return isDisabled ? colors.textMuted : colors.primary;
      case 'ghost':
        return isDisabled ? colors.textMuted : colors.textPrimary;
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [getContainerStyle(pressed), style]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.textInverse : colors.primary}
        />
      ) : (
        <ThemedText
          variant={size === 'sm' ? 'caption' : size === 'lg' ? 'bodyBold' : 'label'}
          color={getTextColor()}
        >
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
};
