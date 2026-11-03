import React from 'react';
import { View, Text, type StyleProp, type ViewStyle } from 'react-native';
import type { BadgeVariant } from '@/types/theme';

export interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

const BADGE_VARIANTS: Record<BadgeVariant, { container: string; text: string }> = {
  solid: {
    container: 'bg-ink-soft',
    text: 'text-canvas font-medium',
  },
  soft: {
    container: 'bg-canvas border border-hairline',
    text: 'text-ink-soft font-medium',
  },
  primary: {
    container: 'bg-primary-soft border border-primary/20',
    text: 'text-primary font-medium',
  },
  destructive: {
    container: 'bg-destructive/10 border border-destructive/20',
    text: 'text-destructive font-medium',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = 'soft',
  className = '',
  style,
}) => {
  const { container, text } = BADGE_VARIANTS[variant] ?? BADGE_VARIANTS.soft;

  return (
    <View
      accessibilityRole="text"
      className={`self-start rounded-pill px-3 py-1 flex-row items-center justify-center ${container} ${className}`.trim()}
      style={style}
    >
      <Text className={`text-[12px] leading-[16px] uppercase tracking-[0.6px] ${text}`}>
        {label}
      </Text>
    </View>
  );
};
