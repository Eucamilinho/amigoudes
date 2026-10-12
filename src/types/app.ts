/**
 * Tipos principales para el estado y flujo general de la aplicación.
 */

export type UserMode = 'passenger' | 'driver';

export interface AppState {
  /**
   * Modo activo en la interfaz del cliente.
   * Permite al estudiante alternar entre buscar viajes (pasajero)
   * y ofrecer cupos (conductor).
   */
  mode: UserMode;
  setMode: (mode: UserMode) => void;
  toggleMode: () => void;
}
