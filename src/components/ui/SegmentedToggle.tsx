import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ThemedText } from '@/components/ui/ThemedText';

export interface ToggleOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

export interface SegmentedToggleProps<T extends string> {
  options: readonly ToggleOption<T>[] | ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
}

export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  style,
}: SegmentedToggleProps<T>) {
  const { colors, spacing, radius } = useTheme();

  return (
    <View
      accessibilityRole="tablist"
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceSubtle,
          borderRadius: radius.full,
          padding: spacing.xs,
        },
        style,
      ]}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityLabel={option.label}
            accessibilityState={{ selected: isSelected }}
            onPress={() => onChange(option.value)}
            style={[
              styles.segment,
              {
                borderRadius: radius.full,
                backgroundColor: isSelected ? colors.surface : 'transparent',
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.lg,
              },
            ]}
          >
            {option.icon ? <View style={styles.iconContainer}>{option.icon}</View> : null}
            <ThemedText
              variant="bodyMedium"
              color={isSelected ? colors.textPrimary : colors.textSecondary}
            >
              {option.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  iconContainer: {
    marginRight: 6,
  },
});
