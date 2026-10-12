import { COLORS, SPACING, RADIUS, FONT_SIZE } from '@/constants/theme';

export type ColorToken = keyof typeof COLORS;
export type SpacingToken = keyof typeof SPACING;
export type RadiusToken = keyof typeof RADIUS;
export type FontSizeToken = keyof typeof FONT_SIZE;

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodyBold'
  | 'caption'
  | 'label';

export type BadgeVariant = 'success' | 'warning' | 'info' | 'neutral';
