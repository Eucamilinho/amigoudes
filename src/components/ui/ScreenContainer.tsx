import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';

export interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  bottomBar?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  bottomBar,
  style,
  contentContainerStyle,
}) => {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  // Si hay bottomBar fija (alto 56 + inset inferior), añadimos padding al contenido
  const bottomBarPadding = bottomBar ? 56 + insets.bottom + spacing.lg : insets.bottom + spacing.lg;

  if (scrollable) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <SafeAreaView
          edges={['left', 'right']}
          style={[styles.safeArea, { backgroundColor: colors.background }, style]}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingHorizontal: spacing.lg,
                paddingTop: spacing.md,
                paddingBottom: bottomBarPadding,
              },
              contentContainerStyle,
            ]}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </SafeAreaView>
        {bottomBar ? <View style={styles.bottomBarContainer}>{bottomBar}</View> : null}
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <SafeAreaView
        edges={['left', 'right']}
        style={[
          styles.safeArea,
          {
            backgroundColor: colors.background,
            paddingHorizontal: spacing.lg,
            paddingBottom: bottomBar ? 0 : insets.bottom + spacing.lg,
          },
          style,
        ]}
      >
        <View style={[styles.flex, { paddingBottom: bottomBar ? 56 + insets.bottom : 0 }]}>
          {children}
        </View>
      </SafeAreaView>
      {bottomBar ? <View style={styles.bottomBarContainer}>{bottomBar}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    gap: 16,
  },
  flex: {
    flex: 1,
    gap: 16,
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
