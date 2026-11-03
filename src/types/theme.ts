import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '@/constants/theme';

export type ColorToken = keyof typeof COLORS;
export type SpacingToken = keyof typeof SPACING;
export type RadiusToken = keyof typeof RADIUS;
export type TypographyToken = keyof typeof TYPOGRAPHY;

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type TextVariant =
  | 'display'
  | 'heading'
  | 'headingSm'
  | 'subheading'
  | 'bodyLg'
  | 'body'
  | 'bodyBold'
  | 'caption'
  | 'label';

export type BadgeVariant = 'solid' | 'soft' | 'primary' | 'destructive';

export type AppRole = 'passenger' | 'driver';
