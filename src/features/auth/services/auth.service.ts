import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { LoginFormValues, RegisterFormValues } from '@/features/auth/schemas/auth.schema';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  studentId?: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  error?: string | null;
}

/**
 * Servicio de Autenticación para Carpooling UDES.
 * Conecta con Supabase Auth cuando las credenciales están presentes,
 * o utiliza un modo de desarrollo demostrativo para pruebas de interfaz.
 */
export const authService = {
  async signIn(credentials: LoginFormValues): Promise<AuthResponse> {
    if (!isSupabaseConfigured || !supabase) {
      // Modo desarrollo offline / prototipo
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        user: {
          id: 'dev-student-1',
          email: credentials.email,
          fullName: 'Estudiante UDES',
          studentId: 'UDES-2024',
        },
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      return {
        user: null,
        error: error.message === 'Invalid login credentials'
          ? 'Credenciales incorrectas. Verifica tu correo y contraseña.'
          : error.message,
      };
    }

    return {
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email ?? '',
            fullName: data.user.user_metadata?.full_name ?? 'Estudiante UDES',
            studentId: data.user.user_metadata?.student_id,
          }
        : null,
    };
  },

  async signUp(data: RegisterFormValues): Promise<AuthResponse> {
    if (!isSupabaseConfigured || !supabase) {
      // Modo desarrollo offline / prototipo
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        user: {
          id: 'dev-student-new',
          email: data.email,
          fullName: data.fullName,
          studentId: data.studentId,
        },
      };
    }

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          student_id: data.studentId,
        },
      },
    });

    if (error) {
      return {
        user: null,
        error: error.message,
      };
    }

    return {
      user: authData.user
        ? {
            id: authData.user.id,
            email: authData.user.email ?? '',
            fullName: data.fullName,
            studentId: data.studentId,
          }
        : null,
    };
  },

  async signOut(): Promise<{ error?: string | null }> {
    if (!isSupabaseConfigured || !supabase) {
      return {};
    }

    const { error } = await supabase.auth.signOut();
    return { error: error?.message ?? null };
  },
};
