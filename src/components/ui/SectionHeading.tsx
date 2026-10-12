import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ThemedText } from '@/components/ui/ThemedText';

export interface SectionHeadingProps {
  title: string;
  marginTop?: number;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  marginTop = 36,
}) => {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { marginTop, marginBottom: spacing.md }]}>
      <ThemedText variant="heading" color={colors.textPrimary}>
        {title}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
