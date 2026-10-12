/**
 * Constantes de diseño visual para Carpooling Universitario UDES.
 * Paleta basada en la identidad institucional de la Universidad de Santander (UDES),
 * optimizada para alto contraste, accesibilidad y diseño móvil limpio.
 */

export const COLORS = {
  // Primarios institucionales UDES
  primary: '#006633', // Verde institucional UDES
  primaryDark: '#004D26',
  primaryLight: '#008744',
  primaryMuted: '#E6F4EA',

  // Secundarios y acentos
  accent: '#F2A900', // Dorado / Ámbar institucional
  accentLight: '#FEF6E0',

  // Superficies y neutros
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  border: '#E2E8F0',
  borderFocus: '#006633',

  // Textos con contraste accesible (WCAG AA/AAA)
  textPrimary: '#0F172A', // Slate 900
  textSecondary: '#475569', // Slate 600
  textMuted: '#94A3B8', // Slate 400
  textInverse: '#FFFFFF',

  // Estados semánticos
  success: '#16A34A',
  successBackground: '#DCFCE7',
  warning: '#D97706',
  warningBackground: '#FEF3C7',
  error: '#DC2626',
  errorBackground: '#FEE2E2',
  info: '#0284C7',
  infoBackground: '#E0F2FE',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 34,
} as const;

export const SHADOWS = {
  card: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  button: {
    shadowColor: '#006633',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
} as const;
