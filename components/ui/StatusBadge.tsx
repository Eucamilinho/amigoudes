import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ThemedText } from '@/components/ui/ThemedText';
import type { BadgeVariant } from '@/types/theme';

export interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = 'neutral',
}) => {
  const { colors, spacing, radius } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          backgroundColor: colors.successBackground,
          textColor: colors.success,
        };
      case 'warning':
        return {
          backgroundColor: colors.warningBackground,
          textColor: colors.warning,
        };
      case 'info':
        return {
          backgroundColor: colors.infoBackground,
          textColor: colors.info,
        };
      case 'neutral':
      default:
        return {
          backgroundColor: colors.primaryMuted,
          textColor: colors.primary,
        };
    }
  };

  const { backgroundColor, textColor } = getVariantStyles();

  return (
    <View
      accessibilityRole="text"
      style={[
        styles.badge,
        {
          backgroundColor,
          borderRadius: radius.full,
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.md,
        },
      ]}
    >
      <ThemedText variant="caption" color={textColor} style={styles.text}>
        {label}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
