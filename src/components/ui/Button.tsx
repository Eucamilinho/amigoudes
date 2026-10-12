import React from 'react';
import {
  ActivityIndicator,
  Pressable,
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
  underline?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  underline = false,
  accessibilityHint,
  style,
  testID,
}) => {
  const { colors, spacing, radius } = useTheme();
  const isDisabled = disabled || loading;

  const getContainerStyle = (pressed: boolean): ViewStyle => {
    let backgroundColor: string = colors.primary;
    let borderRadius: number = radius.md;
    let minHeight = 48;
    let paddingVertical = 12;
    let paddingHorizontal: number = spacing.lg;

    switch (variant) {
      case 'primary':
        backgroundColor = isDisabled
          ? colors.surfaceSubtle
          : pressed
            ? colors.primaryPressed
            : colors.primary;
        break;
      case 'secondary':
        backgroundColor = isDisabled
          ? colors.surfaceSubtle
          : pressed
            ? colors.divider
            : colors.surfaceSubtle;
        break;
      case 'ghost':
        backgroundColor = 'transparent';
        minHeight = 44;
        paddingVertical = spacing.sm;
        paddingHorizontal = spacing.xs;
        break;
      case 'pill':
        backgroundColor = pressed ? colors.primarySubtle : colors.surface;
        borderRadius = radius.full;
        minHeight = 36;
        paddingVertical = 6;
        paddingHorizontal = spacing.lg;
        break;
    }

    // Ajuste opcional por tamaño explícito
    if (size === 'sm' && variant !== 'pill') {
      minHeight = 44;
      paddingVertical = spacing.sm;
      paddingHorizontal = spacing.md;
    }

    return {
      backgroundColor,
      borderRadius,
      minHeight,
      paddingVertical,
      paddingHorizontal,
      alignItems: 'center',
      justifyContent: 'center',
      width: fullWidth ? '100%' : 'auto',
    };
  };

  const getTextColor = (): string => {
    if (isDisabled) return colors.textMuted;
    switch (variant) {
      case 'primary':
        return colors.textInverse;
      case 'secondary':
        return colors.textPrimary;
      case 'ghost':
        return colors.primary;
      case 'pill':
        return colors.primary;
    }
  };

  const getTextVariant = () => {
    if (variant === 'pill' || size === 'sm') {
      return 'label';
    }
    return 'bodyMedium';
  };

  return (
    <Pressable
      testID={testID}
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
          variant={getTextVariant()}
          color={getTextColor()}
          style={underline && variant === 'ghost' ? { textDecorationLine: 'underline' } : undefined}
        >
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
};
