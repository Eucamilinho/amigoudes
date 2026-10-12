import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export interface CardProps extends ViewProps {
  style?: StyleProp<ViewStyle>;
  selected?: boolean;
  highlighted?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  selected = false,
  highlighted = false,
  ...props
}) => {
  const { colors, spacing, radius } = useTheme();
  const isSelected = selected || highlighted;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceSubtle,
          borderRadius: radius.md,
          padding: spacing.xxl,
          borderWidth: isSelected ? 2 : 0,
          borderColor: isSelected ? colors.primary : 'transparent',
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
    overflow: 'hidden',
  },
});
