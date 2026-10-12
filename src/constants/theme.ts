/**
 * Sistema de diseño: "Kiosco de transporte azul y blanco"
 *
 * Lienzo blanco, texto casi negro, y UN solo azul para todo lo estructural e interactivo
 * (header, CTA principal, barra inferior fija, estados activos). Diseño plano: SIN sombras
 * ni elevation. La profundidad sale solo de los escalones de superficie (#FFFFFF → #F6F6F6 → azul)
 * y de bordes hairline de 1px. Los radios son binarios: 8 o 9999. Los títulos usan peso 400,
 * nunca bold. El texto siempre va alineado a la izquierda. El color "decorativo" vive solo en
 * ilustraciones.
 */

export const COLORS = {
  // Marca (único color cromático de la UI)
  primary: '#276EF1', // CTA, header, sticky bar, foco, links activos
  primaryPressed: '#1A56C9', // estado pressed
  primaryMuted: '#DCE7FD', // fondo de pestaña/toggle activo (reemplaza el teal)
  primarySubtle: '#F0F5FF', // lavado muy sutil, uso excepcional

  // Neutros (texto y superficies)
  textPrimary: '#000000',
  textHeading2: '#333333', // títulos secundarios
  textSecondary: '#5E5E5E', // párrafos
  textMuted: '#AFAFAF', // ayuda, deshabilitado
  textInverse: '#FFFFFF',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceSubtle: '#F6F6F6', // cards, inputs con relleno, toggles
  border: '#767676', // borde de inputs (hairline)
  divider: '#E2E2E2', // separadores de lista, más suave que border
  borderFocus: '#276EF1',

  // Semánticos: SOLO para feedback de formularios/errores, nunca decorativos
  success: '#05944F',
  successBackground: '#E6F4EA',
  error: '#E11900',
  errorBackground: '#FDE8E8',
  warning: '#B45309',
  warningBackground: '#FEF3C7',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  section: 48,
  sectionLg: 64,
} as const;

export const RADIUS = {
  none: 0,
  md: 8,
  full: 9999,
  // Alias de compatibilidad:
  sm: 8,
  lg: 8,
  xl: 8,
} as const;

export const TYPOGRAPHY = {
  display: {
    fontFamily: 'Inter_400Regular',
    fontSize: 36,
    lineHeight: 44,
    letterSpacing: 0,
  },
  heading: {
    fontFamily: 'Inter_400Regular',
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0,
  },
  headingSm: {
    fontFamily: 'Inter_400Regular',
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 0,
  },
  subheading: {
    fontFamily: 'Inter_500Medium',
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0,
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodySm: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },
  brand: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0,
  },
} as const;

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 36,
} as const;
