import { loginSchema, registerSchema } from '../auth.schema';

describe('auth.schema', () => {
  describe('loginSchema', () => {
    it('debe validar credenciales correctas', () => {
      const validData = {
        email: 'estudiante@correo.com',
        password: 'password123',
      };
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('debe rechazar un correo con formato inválido', () => {
      const invalidData = {
        email: 'correo-no-valido',
        password: 'password123',
      };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('email');
      }
    });

    it('debe rechazar una contraseña menor a 6 caracteres', () => {
      const invalidData = {
        email: 'estudiante@correo.com',
        password: '12345',
      };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('password');
      }
    });

    it('debe rechazar campos vacíos', () => {
      const emptyData = {
        email: '',
        password: '',
      };
      const result = loginSchema.safeParse(emptyData);
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    const validRegisterData = {
      fullName: 'Camilo Jaimes',
      email: 'camilo@correo.com',
      studentId: '2024101',
      password: 'password123',
      confirmPassword: 'password123',
    };

    it('debe validar un registro estudiantil completo y correcto', () => {
      const result = registerSchema.safeParse(validRegisterData);
      expect(result.success).toBe(true);
    });

    it('debe rechazar si las contraseñas no coinciden', () => {
      const mismatchedData = {
        ...validRegisterData,
        confirmPassword: 'otraPassword',
      };
      const result = registerSchema.safeParse(mismatchedData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe('Las contraseñas no coinciden');
        expect(result.error.issues[0]?.path).toContain('confirmPassword');
      }
    });

    it('debe rechazar nombres muy cortos (menores a 3 caracteres)', () => {
      const shortNameData = {
        ...validRegisterData,
        fullName: 'Al',
      };
      const result = registerSchema.safeParse(shortNameData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('fullName');
      }
    });

    it('debe rechazar un código estudiantil menor a 4 caracteres', () => {
      const shortCodeData = {
        ...validRegisterData,
        studentId: '123',
      };
      const result = registerSchema.safeParse(shortCodeData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('studentId');
      }
    });
  });
});
