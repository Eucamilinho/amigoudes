/**
 * Tokens de diseño visual para AmigoUDES.
 * Sistema "clinical blueprint on frosted paper" con azul (#2563EB) como único acento de marca.
 */

export const LIGHT_COLORS = {
  // Superficies
  canvas: '#F5F5F5',
  paper: '#FFFFFF',
  surfaceAlt: '#FAFAFA',

  // Tipografía y contraste
  ink: '#0A0A0A',
  inkSoft: '#171717',
  midGray: '#737373',
  hairline: '#E5E5E5',

  // Acción principal (Azul)
  primary: '#2563EB',
  primaryPressed: '#1D4ED8',
  primarySoft: '#EFF6FF',
  primaryRing: '#BFDBFE',

  // Destructivo (Rojo exclusivo de advertencias/cancelaciones)
  destructive: '#E7000B',
} as const;

export const DARK_COLORS = {
  // Superficies oscuras
  canvas: '#121214',
  paper: '#1C1C20',
  surfaceAlt: '#26262A',

  // Tipografía y contraste
  ink: '#F5F5F7',
  inkSoft: '#D4D4D8',
  midGray: '#9CA3AF',
  hairline: '#2D2D32',

  // Acción principal (Azul accesible en fondos oscuros)
  primary: '#3B82F6',
  primaryPressed: '#2563EB',
  primarySoft: '#1E3A8A',
  primaryRing: '#1E40AF',

  // Destructivo
  destructive: '#EF4444',
} as const;

export const COLORS = LIGHT_COLORS;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 48,
  cardPadding: 20,
  gap: 8,
} as const;

export const RADIUS = {
  nested: 10,
  pill: 18,
  card: 24,
  full: 9999,
} as const;

export const TYPOGRAPHY = {
  caption: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    fontWeight: '500' as const,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  bodyLg: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  subheading: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  headingSm: {
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.6,
    fontWeight: '600' as const,
  },
  heading: {
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.75,
    fontWeight: '600' as const,
  },
  display: {
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -1.2,
    fontWeight: '600' as const,
  },
} as const;

export const SHADOWS = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
} as const;
