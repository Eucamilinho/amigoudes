import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button } from '@/components/ui/Button';

export interface SuggestionCardProps {
  title: string;
  description: string;
  onPressDetails?: () => void;
  illustrationSlot?: React.ReactNode;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  title,
  description,
  onPressDetails,
  illustrationSlot,
}) => {
  const { colors, spacing, radius } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceSubtle,
          borderRadius: radius.md,
          padding: spacing.lg,
        },
      ]}
    >
      <View style={styles.contentRow}>
        {/* Columna izquierda: textos y acción */}
        <View style={styles.textColumn}>
          <ThemedText variant="bodyMedium" color={colors.textPrimary} style={styles.title}>
            {title}
          </ThemedText>
          <ThemedText variant="bodySm" color={colors.textSecondary} style={styles.description}>
            {description}
          </ThemedText>
          {onPressDetails ? (
            <View style={styles.actionRow}>
              <Button
                label="Detalles"
                variant="ghost"
                size="sm"
                onPress={onPressDetails}
                underline
              />
            </View>
          ) : null}
        </View>

        {/* Columna derecha: ilustración o placeholder */}
        <View style={styles.illustrationColumn}>
          {illustrationSlot ?? (
            <View
              style={[
                styles.defaultIllustrationPlaceholder,
                {
                  backgroundColor: colors.primaryMuted,
                  borderRadius: radius.md,
                },
              ]}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  textColumn: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  description: {
    marginBottom: 8,
  },
  actionRow: {
    alignSelf: 'flex-start',
  },
  illustrationColumn: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultIllustrationPlaceholder: {
    width: 80,
    height: 80,
  },
});
