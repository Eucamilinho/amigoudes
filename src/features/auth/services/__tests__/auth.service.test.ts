import { authService } from '../auth.service';

describe('authService', () => {
  it('permite iniciar sesión en modo dev/offline', async () => {
    const res = await authService.signIn({
      email: 'estudiante@udes.edu.co',
      password: 'password123',
    });

    expect(res.user).not.toBeNull();
    expect(res.user?.email).toBe('estudiante@udes.edu.co');
  });

  it('permite registrarse en modo dev/offline', async () => {
    const res = await authService.signUp({
      fullName: 'Estudiante Prueba',
      email: 'prueba@udes.edu.co',
      studentId: '202499',
      password: 'password123',
      confirmPassword: 'password123',
    });

    expect(res.user).not.toBeNull();
    expect(res.user?.fullName).toBe('Estudiante Prueba');
    expect(res.user?.email).toBe('prueba@udes.edu.co');
  });

  it('permite cerrar sesión sin errores', async () => {
    const res = await authService.signOut();
    expect(res.error).toBeUndefined();
  });
});
