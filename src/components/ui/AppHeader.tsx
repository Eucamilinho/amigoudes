import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/hooks/useTheme';
import { ThemedText } from '@/components/ui/ThemedText';

export interface AppHeaderProps {
  title?: string;
  rightSlot?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title = 'UDES Ride',
  rightSlot,
}) => {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar style="light" />
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.primary,
            paddingTop: insets.top,
            paddingHorizontal: spacing.lg,
          },
        ]}
      >
        <View style={styles.content}>
          <ThemedText variant="brand" color={colors.textInverse}>
            {title}
          </ThemedText>
          {rightSlot ? <View style={styles.rightSlot}>{rightSlot}</View> : null}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  content: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rightSlot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
