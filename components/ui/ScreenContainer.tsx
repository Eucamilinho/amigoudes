import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

export interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
}) => {
  const { colors, spacing } = useTheme();

  if (scrollable) {
    return (
      <SafeAreaView
        edges={['top', 'bottom', 'left', 'right']}
        style={[styles.safeArea, { backgroundColor: colors.background }, style]}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { padding: spacing.lg },
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['top', 'bottom', 'left', 'right']}
      style={[
        styles.safeArea,
        { backgroundColor: colors.background, padding: spacing.lg },
        style,
      ]}
    >
      <View style={styles.flex}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
});
