import { create } from 'zustand';
import type { UserProfile, UserRoutine } from '@/features/auth/types';
import type { LoginFormValues, RegisterFormValues } from '@/features/auth/schemas/auth.schema';

export const DEMO_PASSENGER: UserProfile = {
  id: 'usr-demo-01',
  fullName: 'Valentina Rodríguez',
  email: 'v.rodriguez@udes.edu.co',
  universityRole: 'estudiante',
  faculty: 'Medicina',
  phone: '315 892 4410',
  isPassenger: true,
  isDriver: false,
  activeRole: 'passenger',
  ratingAvg: 4.9,
  ridesCount: 18,
  verified: true,
  routine: {
    originSector: 'Cabecera del Llano',
    campusName: 'Campus Lagos del Cacique',
    days: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
    arrivalTime: '6:30 am',
    departureTime: '12:00 m',
    toleranceMin: 15,
  },
};

export const DEMO_DRIVER: UserProfile = {
  id: 'usr-demo-02',
  fullName: 'Carlos Eduardo Mantilla',
  email: 'c.mantilla@udes.edu.co',
  universityRole: 'docente',
  faculty: 'Ingeniería de Sistemas',
  phone: '318 456 7890',
  isPassenger: true,
  isDriver: true,
  activeRole: 'driver',
  ratingAvg: 5.0,
  ridesCount: 42,
  verified: true,
  vehicle: {
    make: 'Chevrolet',
    model: 'Onix Turbo',
    color: 'Gris Mercurio',
    plate: 'WKL-823',
    seats: 3,
  },
  routine: {
    originSector: 'Cañaveral (Floridablanca)',
    campusName: 'Campus Lagos del Cacique',
    days: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
    arrivalTime: '6:30 am',
    departureTime: '6:00 pm',
    toleranceMin: 15,
  },
};

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Acciones
  login: (values: LoginFormValues) => Promise<boolean>;
  loginAsDemo: (role?: 'passenger' | 'driver') => void;
  register: (values: RegisterFormValues) => Promise<boolean>;
  logout: () => void;
  switchActiveRole: (role: 'passenger' | 'driver') => void;
  updateRoutine: (routine: Partial<UserRoutine>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: DEMO_PASSENGER, // Inicializado con demo para demostración inmediata del flujo
  isAuthenticated: true,
  isLoading: false,
  error: null,

  login: async (values: LoginFormValues): Promise<boolean> => {
    set({ isLoading: true, error: null });
    // Simulación de respuesta de red rápida local
    await new Promise((resolve) => setTimeout(resolve, 350));

    const emailLower = values.email.toLowerCase();
    if (emailLower.includes('mantilla') || emailLower.includes('docente')) {
      set({ user: DEMO_DRIVER, isAuthenticated: true, isLoading: false });
      return true;
    }

    // Perfil estándar basado en el correo
    const newProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName: values.email.split('@')[0]?.replace('.', ' ').toUpperCase() ?? 'Miembro UDES',
      email: values.email,
      universityRole: 'estudiante',
      faculty: 'Comunidad UDES',
      phone: '300 123 4567',
      isPassenger: true,
      isDriver: false,
      activeRole: 'passenger',
      ratingAvg: 5.0,
      ridesCount: 0,
      verified: true,
      routine: {
        originSector: 'Bucaramanga Centro',
        campusName: 'Campus Lagos del Cacique',
        days: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
        arrivalTime: '6:30 am',
        departureTime: '12:00 m',
        toleranceMin: 15,
      },
    };

    set({ user: newProfile, isAuthenticated: true, isLoading: false });
    return true;
  },

  loginAsDemo: (role = 'passenger') => {
    set({
      user: role === 'driver' ? DEMO_DRIVER : DEMO_PASSENGER,
      isAuthenticated: true,
      error: null,
    });
  },

  register: async (values: RegisterFormValues): Promise<boolean> => {
    set({ isLoading: true, error: null });
    await new Promise((resolve) => setTimeout(resolve, 400));

    const newProfile: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName: values.fullName,
      email: values.email,
      universityRole: values.universityRole,
      faculty: values.faculty,
      phone: values.phone,
      isPassenger: values.isPassenger,
      isDriver: values.isDriver,
      activeRole: values.isDriver && !values.isPassenger ? 'driver' : 'passenger',
      ratingAvg: 5.0,
      ridesCount: 0,
      verified: true,
      vehicle: values.isDriver
        ? {
            make: values.vehicleMake ?? 'Vehículo',
            model: values.vehicleModel ?? 'Particular',
            color: values.vehicleColor ?? 'Blanco',
            plate: values.vehiclePlate ?? 'XXX-000',
            seats: values.vehicleSeats ?? 3,
          }
        : undefined,
      routine: {
        originSector: values.originSector,
        originAddress: values.originAddress ?? 'Bucaramanga',
        campusName: 'Campus Lagos del Cacique',
        destinationAddress: values.destinationAddress ?? 'Calle 70 # 55-210, Lagos del Cacique',
        days: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
        arrivalTime: values.habitualTime,
        departureTime: '12:00 m',
        toleranceMin: values.toleranceMin,
      },
    };

    set({ user: newProfile, isAuthenticated: true, isLoading: false });
    return true;
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, error: null });
  },

  switchActiveRole: (role: 'passenger' | 'driver') => {
    const { user } = get();
    if (!user) return;
    set({ user: { ...user, activeRole: role } });
  },

  updateRoutine: (newRoutine: Partial<UserRoutine>) => {
    const { user } = get();
    if (!user) return;
    set({
      user: {
        ...user,
        routine: {
          ...user.routine,
          ...newRoutine,
        },
      },
    });
  },

  clearError: () => set({ error: null }),
}));
