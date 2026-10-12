import { COLORS, SPACING, RADIUS, FONT_SIZE, SHADOWS } from '@/constants/theme';

/**
 * Hook para acceder a los tokens de diseño de la aplicación.
 * Prepara la arquitectura para soportar temas dinámicos (claro/oscuro) en fases futuras
 * manteniendo una API desacoplada.
 */
export function useTheme() {
  return {
    colors: COLORS,
    spacing: SPACING,
    radius: RADIUS,
    fontSize: FONT_SIZE,
    shadows: SHADOWS,
  };
}
