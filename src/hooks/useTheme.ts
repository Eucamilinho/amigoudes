import { create } from 'zustand';
import { useColorScheme } from 'nativewind';
import {
  LIGHT_COLORS,
  DARK_COLORS,
  SPACING,
  RADIUS,
  TYPOGRAPHY,
  SHADOWS,
} from '@/constants/theme';

export type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeStore {
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
}

const useThemePreferenceStore = create<ThemeStore>((set) => ({
  preference: 'system',
  setPreference: (preference) => set({ preference }),
}));

/**
 * Hook para acceder al modo actual (claro/oscuro), preferencias y tokens de diseño de AmigoUDES.
 */
export function useTheme() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { preference, setPreference } = useThemePreferenceStore();

  const setThemePreference = (pref: ThemePreference) => {
    setPreference(pref);
    setColorScheme(pref);
  };

  const isDark = colorScheme === 'dark';
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  return {
    isDark,
    colorScheme,
    preference,
    setThemePreference,
    setColorScheme,
    toggleColorScheme: () => {
      const next: ThemePreference = isDark ? 'light' : 'dark';
      setThemePreference(next);
    },
    colors,
    spacing: SPACING,
    radius: RADIUS,
    typography: TYPOGRAPHY,
    shadows: SHADOWS,
  };
}
