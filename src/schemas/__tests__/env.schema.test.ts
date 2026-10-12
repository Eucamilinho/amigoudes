import { envSchema } from '@/schemas/env.schema';

describe('envSchema (Zod)', () => {
  it('debe validar con valores por defecto válidos', () => {
    const result = envSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.EXPO_PUBLIC_APP_ENV).toBe('development');
    }
  });

  it('debe aceptar variables de supabase con formato adecuado', () => {
    const result = envSchema.safeParse({
      EXPO_PUBLIC_APP_ENV: 'production',
      EXPO_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      EXPO_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key-12345678',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.EXPO_PUBLIC_APP_ENV).toBe('production');
      expect(result.data.EXPO_PUBLIC_SUPABASE_URL).toBe('https://test.supabase.co');
    }
  });

  it('debe fallar si EXPO_PUBLIC_SUPABASE_URL no es una URL válida', () => {
    const result = envSchema.safeParse({
      EXPO_PUBLIC_SUPABASE_URL: 'not-a-valid-url',
    });
    expect(result.success).toBe(false);
  });
});
