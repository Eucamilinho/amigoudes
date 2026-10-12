import { COLORS, SPACING, RADIUS, FONT_SIZE, TYPOGRAPHY } from '@/constants/theme';

export type ColorToken = keyof typeof COLORS;
export type SpacingToken = keyof typeof SPACING;
export type RadiusToken = keyof typeof RADIUS;
export type FontSizeToken = keyof typeof FONT_SIZE;
export type TypographyToken = keyof typeof TYPOGRAPHY;

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'pill';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type TextVariant =
  | 'display'
  | 'heading'
  | 'headingSm'
  | 'subheading'
  | 'body'
  | 'bodyMedium'
  | 'bodySm'
  | 'label'
  | 'caption'
  | 'brand'
  // Alias de compatibilidad:
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bodyBold';

export type BadgeVariant =
  | 'default'
  | 'active'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral';
