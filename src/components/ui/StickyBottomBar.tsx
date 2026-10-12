import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { ThemedText } from '@/components/ui/ThemedText';

export interface StickyBottomBarProps {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  accessibilityHint?: string;
}

export const StickyBottomBar: React.FC<StickyBottomBarProps> = ({
  label,
  onPress,
  disabled = false,
  loading = false,
  accessibilityHint,
}) => {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.bar,
        {
          backgroundColor: isDisabled
            ? colors.surfaceSubtle
            : pressed
              ? colors.primaryPressed
              : colors.primary,
          paddingBottom: insets.bottom,
          paddingHorizontal: spacing.lg,
        },
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.textInverse} />
        ) : (
          <ThemedText
            variant="bodyMedium"
            centered
            color={isDisabled ? colors.textMuted : colors.textInverse}
          >
            {label}
          </ThemedText>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  bar: {
    width: '100%',
    borderRadius: 0,
  },
  content: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
