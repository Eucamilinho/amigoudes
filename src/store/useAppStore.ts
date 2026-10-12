import { create } from 'zustand';
import type { AppState, UserMode } from '@/types/app';

/**
 * Store global ligero de Zustand para el estado del cliente.
 * Gestiona el modo activo del estudiante (Pasajero o Conductor)
 * de forma reactiva y sin providers anidados pesados.
 *
 * NOTA DE SEGURIDAD:
 * No almacena tokens, contraseñas ni datos sensibles de sesión.
 */
export const useAppStore = create<AppState>((set) => ({
  mode: 'passenger',

  setMode: (mode: UserMode) => set({ mode }),

  toggleMode: () =>
    set((state) => ({
      mode: state.mode === 'passenger' ? 'driver' : 'passenger',
    })),
}));
