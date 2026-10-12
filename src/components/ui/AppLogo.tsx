import React from 'react';
import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ThemedText } from '@/components/ui/ThemedText';

export interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  orientation?: 'vertical' | 'horizontal';
  variant?: 'image' | 'vector';
  useCustomImage?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  showText = true,
  orientation = 'vertical',
  variant = 'image',
  useCustomImage,
  style,
}) => {
  const { colors, spacing, radius } = useTheme();

  // Permite controlar si se usa imagen o vector por variant o useCustomImage
  const isImageVariant = useCustomImage !== undefined ? useCustomImage : variant === 'image';

  const dimensions = (() => {
    switch (size) {
      case 'sm':
        return { iconSize: 36, fontSize: 'bodyMedium' as const, badgeRadius: radius.md };
      case 'lg':
        return { iconSize: 72, fontSize: 'heading' as const, badgeRadius: radius.md };
      case 'xl':
        return { iconSize: 96, fontSize: 'display' as const, badgeRadius: radius.md };
      case 'md':
      default:
        return { iconSize: 52, fontSize: 'headingSm' as const, badgeRadius: radius.md };
    }
  })();

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel="Logotipo Carpooling UDES"
      style={[
        styles.container,
        orientation === 'horizontal' ? styles.row : styles.column,
        style,
      ]}
    >
      {isImageVariant ? (
        <Image
          source={require('../../../assets/brand/logo.png')}
          style={{
            width: dimensions.iconSize,
            height: dimensions.iconSize,
            borderRadius: dimensions.badgeRadius,
          }}
          resizeMode="contain"
        />
      ) : (
        /* Emblema Vectorial Transit Kiosk */
        <View
          style={[
            styles.emblemBadge,
            {
              width: dimensions.iconSize,
              height: dimensions.iconSize,
              backgroundColor: colors.primary,
              borderRadius: dimensions.badgeRadius,
            },
          ]}
        >
          <ThemedText
            variant="brand"
            color={colors.textInverse}
            style={{ fontSize: dimensions.iconSize * 0.44, lineHeight: dimensions.iconSize * 0.52 }}
          >
            U
          </ThemedText>
        </View>
      )}

      {showText ? (
        <View style={orientation === 'horizontal' ? { marginLeft: spacing.md } : { marginTop: spacing.sm }}>
          <ThemedText variant={dimensions.fontSize} color={colors.textPrimary}>
            UDES Ride
          </ThemedText>
          {size === 'xl' || size === 'lg' ? (
            <ThemedText variant="caption" color={colors.textSecondary}>
              Carpooling Universitario
            </ThemedText>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  emblemBadge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
