import React from 'react';
import type { LucideIcon } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconColor = 'ink' | 'mid-gray' | 'primary' | 'destructive' | 'white';

export interface IconProps {
  icon: LucideIcon;
  size?: IconSize;
  color?: IconColor;
  strokeWidth?: number;
  className?: string;
}

const SIZE_MAP: Record<IconSize, number> = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export const Icon: React.FC<IconProps> = ({
  icon: LucideIconComponent,
  size = 'md',
  color = 'mid-gray',
  strokeWidth = 1.75,
  className = '',
}) => {
  const { colors } = useTheme();

  const colorMap: Record<IconColor, string> = {
    ink: colors.ink,
    'mid-gray': colors.midGray,
    primary: colors.primary,
    destructive: colors.destructive,
    white: '#FFFFFF',
  };

  const pixelSize = SIZE_MAP[size] ?? 20;
  const hexColor = colorMap[color] ?? colors.midGray;

  return (
    <LucideIconComponent
      size={pixelSize}
      color={hexColor}
      strokeWidth={strokeWidth}
      className={className}
    />
  );
};
