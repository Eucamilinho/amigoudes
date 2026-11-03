import { z } from 'zod';

/**
 * Esquema de validación para inicio de sesión de la comunidad UDES.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'El correo institucional es requerido')
    .email('Formato de correo electrónico no válido')
    .refine(
      (val) => val.toLowerCase().includes('udes.edu.co'),
      'Debe ser un correo institucional de la UDES (@udes.edu.co)'
    ),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Esquema de validación para registro integral en AmigoUDES.
 * Incluye perfil, rol en carpooling y ruta habitual inicial.
 */
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, 'Ingresa tu nombre completo (mínimo 3 caracteres)'),
    email: z
      .string()
      .trim()
      .min(1, 'El correo institucional es requerido')
      .email('Formato de correo no válido')
      .refine(
        (val) => val.toLowerCase().includes('udes.edu.co'),
        'Debe ser tu correo institucional (@udes.edu.co)'
      ),
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z
      .string()
      .min(1, 'Confirma tu contraseña'),
    universityRole: z.enum(['estudiante', 'docente', 'administrativo'], {
      error: 'Selecciona tu vinculación universitaria',
    }),
    faculty: z
      .string()
      .trim()
      .min(2, 'Ingresa tu programa académico o facultad'),
    phone: z
      .string()
      .trim()
      .min(7, 'Número de celular requerido para coordinar viajes'),
    isPassenger: z.boolean(),
    isDriver: z.boolean(),
    // Datos de vehículo si es conductor
    vehicleMake: z.string().optional(),
    vehicleModel: z.string().optional(),
    vehicleColor: z.string().optional(),
    vehiclePlate: z.string().optional(),
    vehicleSeats: z.number().min(1).max(6).optional(),
    // Ruta habitual inicial
    originSector: z
      .string()
      .trim()
      .min(3, 'Indica tu barrio o sector de origen en Bucaramanga'),
    originAddress: z.string().optional(),
    destinationAddress: z.string().optional(),
    habitualTime: z
      .string()
      .min(1, 'Selecciona tu franja horaria habitual'),
    toleranceMin: z.union([z.literal(15), z.literal(30), z.literal(45)]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })
  .refine((data) => data.isPassenger || data.isDriver, {
    message: 'Debes seleccionar al menos un rol: Pasajero o Conductor',
    path: ['isPassenger'],
  })
  .refine(
    (data) => {
      if (data.isDriver) {
        return !!data.vehiclePlate && data.vehiclePlate.trim().length >= 5;
      }
      return true;
    },
    {
      message: 'Ingresa la placa del vehículo (mínimo 5 caracteres)',
      path: ['vehiclePlate'],
    }
  );

export type RegisterFormValues = z.infer<typeof registerSchema>;
