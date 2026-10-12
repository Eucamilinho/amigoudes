import { COLORS, SPACING, RADIUS, FONT_SIZE, TYPOGRAPHY } from '@/constants/theme';

/**
 * Hook para acceder a los tokens de diseño de la aplicación.
 * Sigue la filosofía "Transit Kiosk": colores limpios, sin sombras,
 * radios binarios y tipografía Inter.
 */
export function useTheme() {
  return {
    colors: COLORS,
    spacing: SPACING,
    radius: RADIUS,
    fontSize: FONT_SIZE,
    typography: TYPOGRAPHY,
  };
}
