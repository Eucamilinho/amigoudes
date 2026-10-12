import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/lib/env';

/**
 * Cliente de Supabase para autenticación y base de datos de Carpooling UDES.
 *
 * Implementa inicialización segura: si las variables de entorno aún no están
 * configuradas en `.env`, no interrumpe el ciclo de ejecución de la app y
 * emite un aviso para facilitar el desarrollo local y las pruebas unitarias.
 */
let supabaseInstance: SupabaseClient | null = null;

const supabaseUrl = env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const hasValidSupabaseConfig = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')
);

if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
  supabaseInstance = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    }
  );
} else if (__DEV__) {
  console.info(
    '[Supabase] Cliente no inicializado: EXPO_PUBLIC_SUPABASE_URL o EXPO_PUBLIC_SUPABASE_ANON_KEY no están configuradas en .env. Se usará el modo simulado para desarrollo.'
  );
}

export const isSupabaseConfigured = hasValidSupabaseConfig;

export const supabase = supabaseInstance;
