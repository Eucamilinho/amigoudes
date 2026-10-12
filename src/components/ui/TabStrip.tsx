import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ThemedText } from '@/components/ui/ThemedText';

export interface TabItem<T extends string> {
  key: T;
  label: string;
}

export interface TabStripProps<T extends string> {
  tabs: readonly TabItem<T>[] | TabItem<T>[];
  activeTab: T;
  onTabChange: (key: T) => void;
  style?: StyleProp<ViewStyle>;
}

export function TabStrip<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  style,
}: TabStripProps<T>) {
  const { colors, spacing, radius } = useTheme();

  return (
    <View
      accessibilityRole="tablist"
      style={[
        styles.container,
        {
          paddingHorizontal: spacing.lg,
          gap: 0,
        },
        style,
      ]}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: isActive }}
            onPress={() => onTabChange(tab.key)}
            style={[
              styles.tab,
              {
                borderRadius: radius.md,
                backgroundColor: isActive ? colors.primaryMuted : 'transparent',
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.lg,
              },
            ]}
          >
            <ThemedText
              variant="label"
              color={isActive ? colors.primary : colors.textSecondary}
            >
              {tab.label}
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
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
});
