import { z } from 'zod';

/**
 * Esquema de validación para el inicio de sesión de estudiantes UDES.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'El correo electrónico es requerido')
    .email('Ingresa un formato de correo electrónico válido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Esquema de validación para el registro de estudiantes UDES.
 *
 * NOTA DE ARQUITECTURA:
 * Conforme a las directrices del proyecto ("No inventes dominios de correo institucional"),
 * no forzamos una expresión regular rígida de dominio (@udes.edu.co u otro) hasta que sea
 * confirmado oficialmente por la universidad. En su lugar, validamos estructura de correo
 * válida y dejamos preparado el punto de extensión.
 */
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'El nombre completo es requerido')
      .min(3, 'El nombre debe tener al menos 3 caracteres'),
    email: z
      .string()
      .trim()
      .min(1, 'El correo electrónico es requerido')
      .email('Ingresa un formato de correo electrónico válido'),
    studentId: z
      .string()
      .trim()
      .min(1, 'El código estudiantil es requerido')
      .min(4, 'El código debe tener al menos 4 caracteres'),
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z
      .string()
      .min(1, 'Confirma tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
