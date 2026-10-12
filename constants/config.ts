/**
 * Configuración global del proyecto Carpooling UDES.
 */

export const APP_CONFIG = {
  name: 'Carpooling UDES',
  shortName: 'UDES Ride',
  version: '0.1.0',
  phase: 'FASE 0: Arquitectura y Configuración Inicial',
  campus: {
    name: 'Universidad de Santander - Sede Bucaramanga',
    location: 'Campus Lagos del Cacique',
    city: 'Bucaramanga, Santander, Colombia',
    coordinates: {
      latitude: 7.0988,
      longitude: -73.1042,
    },
  },
} as const;
