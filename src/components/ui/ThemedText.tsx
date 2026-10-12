import React from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import type { TextVariant } from '@/types/theme';

export interface ThemedTextProps extends TextProps {
  variant?: TextVariant;
  color?: string;
  centered?: boolean;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  children,
  variant = 'body',
  color,
  centered = false,
  style,
  ...props
}) => {
  const { colors, fontSize } = useTheme();

  const variantStyles = {
    h1: {
      fontSize: fontSize.xxxl,
      fontWeight: '700' as const,
      color: color ?? colors.textPrimary,
      lineHeight: 40,
    },
    h2: {
      fontSize: fontSize.xxl,
      fontWeight: '700' as const,
      color: color ?? colors.textPrimary,
      lineHeight: 34,
    },
    h3: {
      fontSize: fontSize.xl,
      fontWeight: '600' as const,
      color: color ?? colors.textPrimary,
      lineHeight: 28,
    },
    body: {
      fontSize: fontSize.md,
      fontWeight: '400' as const,
      color: color ?? colors.textSecondary,
      lineHeight: 24,
    },
    bodyBold: {
      fontSize: fontSize.md,
      fontWeight: '600' as const,
      color: color ?? colors.textPrimary,
      lineHeight: 24,
    },
    caption: {
      fontSize: fontSize.xs,
      fontWeight: '400' as const,
      color: color ?? colors.textMuted,
      lineHeight: 16,
    },
    label: {
      fontSize: fontSize.sm,
      fontWeight: '600' as const,
      color: color ?? colors.textPrimary,
      lineHeight: 20,
    },
  };

  const isHeader = variant === 'h1' || variant === 'h2' || variant === 'h3';

  return (
    <Text
      accessibilityRole={isHeader ? 'header' : 'text'}
      style={[
        styles.base,
        variantStyles[variant],
        centered && styles.centered,
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    letterSpacing: -0.2,
  },
  centered: {
    textAlign: 'center',
  },
});
