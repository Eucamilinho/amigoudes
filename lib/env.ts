import { envSchema, type EnvConfig } from '@/schemas/env.schema';

/**
 * Valida las variables de entorno en tiempo de ejecución.
 * En modo desarrollo muestra advertencias descriptivas si faltan variables futuras.
 */
function validateEnv(): EnvConfig {
  const rawEnv = {
    EXPO_PUBLIC_APP_ENV: process.env.EXPO_PUBLIC_APP_ENV ?? 'development',
    EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
    EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
    EXPO_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
  };

  const parsed = envSchema.safeParse(rawEnv);

  if (!parsed.success) {
    if (__DEV__) {
      console.warn(
        '[ENV Warning] Variables de entorno con formato no válido:',
        parsed.error.flatten().fieldErrors
      );
    }
    // Retornamos valores por defecto seguros para no interrumpir el arranque en Fase 0
    return {
      EXPO_PUBLIC_APP_ENV: 'development',
      EXPO_PUBLIC_SUPABASE_URL: '',
      EXPO_PUBLIC_SUPABASE_ANON_KEY: '',
      EXPO_PUBLIC_GOOGLE_MAPS_API_KEY: '',
    };
  }

  return parsed.data;
}

export const env: EnvConfig = validateEnv();
