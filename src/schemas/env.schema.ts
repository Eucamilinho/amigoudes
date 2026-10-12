import { z } from 'zod';

/**
 * Esquema de validación para las variables de entorno del cliente.
 * Solo se permiten variables con prefijo EXPO_PUBLIC_ para evitar filtraciones.
 */
export const envSchema = z.object({
  EXPO_PUBLIC_APP_ENV: z
    .enum(['development', 'staging', 'production'])
    .default('development'),

  // Variables para Fase 1 (Autenticación y Supabase)
  EXPO_PUBLIC_SUPABASE_URL: z
    .string()
    .url('EXPO_PUBLIC_SUPABASE_URL debe ser una URL válida')
    .optional()
    .or(z.literal('')),

  EXPO_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(10, 'EXPO_PUBLIC_SUPABASE_ANON_KEY debe tener al menos 10 caracteres')
    .optional()
    .or(z.literal('')),

  // Variables para Fase 3 (Mapas y Rutas)
  EXPO_PUBLIC_GOOGLE_MAPS_API_KEY: z
    .string()
    .optional()
    .or(z.literal('')),
});

export type EnvConfig = z.infer<typeof envSchema>;
