import React from 'react';
import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';
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
  const { colors, typography } = useTheme();

  // Mapeo de alias de compatibilidad a variantes de TYPOGRAPHY
  const normalizedVariant = (() => {
    switch (variant) {
      case 'h1':
        return 'display';
      case 'h2':
        return 'heading';
      case 'h3':
        return 'headingSm';
      case 'bodyBold':
        return 'bodyMedium';
      default:
        return variant;
    }
  })();

  const token = typography[normalizedVariant] ?? typography.body;

  // Asignación de color predeterminado según jerarquía
  const defaultColor = (() => {
    if (color) return color;
    switch (normalizedVariant) {
      case 'display':
      case 'heading':
      case 'headingSm':
      case 'brand':
        return colors.textPrimary;
      case 'subheading':
        return colors.textHeading2;
      case 'caption':
        return colors.textMuted;
      case 'label':
      case 'bodyMedium':
        return colors.textPrimary;
      case 'bodySm':
      case 'body':
      default:
        return colors.textSecondary;
    }
  })();

  const isHeader =
    normalizedVariant === 'display' ||
    normalizedVariant === 'heading' ||
    normalizedVariant === 'headingSm';

  const textStyle: TextStyle = {
    fontFamily: token.fontFamily,
    fontSize: token.fontSize,
    lineHeight: token.lineHeight,
    letterSpacing: token.letterSpacing,
    color: defaultColor,
    textAlign: centered ? 'center' : 'left',
  };

  return (
    <Text
      accessibilityRole={isHeader ? 'header' : 'text'}
      style={[styles.base, textStyle, style]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
