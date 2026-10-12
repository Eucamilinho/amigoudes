import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export interface CardProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  highlighted?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  highlighted = false,
  ...props
}) => {
  const { colors, spacing, radius, shadows } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: highlighted ? colors.primary : colors.border,
          borderRadius: radius.lg,
          padding: spacing.lg,
          ...shadows.card,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    overflow: 'hidden',
  },
});
