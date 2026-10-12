import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ThemedText } from '@/components/ui/ThemedText';
import type { BadgeVariant } from '@/types/theme';

export interface ChipProps {
  label: string;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'default',
  style,
}) => {
  const { colors, spacing, radius } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'active':
        return {
          backgroundColor: colors.primaryMuted,
          textColor: colors.primary,
        };
      case 'success':
        return {
          backgroundColor: colors.successBackground,
          textColor: colors.success,
        };
      case 'error':
        return {
          backgroundColor: colors.errorBackground,
          textColor: colors.error,
        };
      case 'warning':
        return {
          backgroundColor: colors.warningBackground,
          textColor: colors.warning,
        };
      case 'info':
        return {
          backgroundColor: colors.primaryMuted,
          textColor: colors.primary,
        };
      case 'default':
      case 'neutral':
      default:
        return {
          backgroundColor: colors.surfaceSubtle,
          textColor: colors.textPrimary,
        };
    }
  };

  const { backgroundColor, textColor } = getVariantStyles();

  return (
    <View
      accessibilityRole="text"
      style={[
        styles.chip,
        {
          backgroundColor,
          borderRadius: radius.full,
          paddingVertical: 6,
          paddingHorizontal: spacing.md,
        },
        style,
      ]}
    >
      <ThemedText variant="label" color={textColor} style={styles.text}>
        {label}
      </ThemedText>
    </View>
  );
};

export const StatusBadge = Chip;

const styles = StyleSheet.create({
  chip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    letterSpacing: 0,
  },
});
