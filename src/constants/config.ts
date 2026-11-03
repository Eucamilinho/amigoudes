/**
 * Configuración global del proyecto AmigoUDES.
 * Carpooling exclusivo para la comunidad de la Universidad de Santander (UDES), Bucaramanga.
 */

export const APP_CONFIG = {
  name: 'AmigoUDES',
  tagline: 'Carpooling exclusivo para la comunidad universitaria UDES',
  city: 'Bucaramanga, Santander, Colombia',
  version: '1.0.0',
  phase: 'FASE 0: Sistema de diseño, NativeWind y base arquitectónica',
  campuses: [
    {
      id: 'lagos-cacique',
      name: 'Campus Lagos del Cacique (Principal)',
      address: 'Calle 70 # 55-210, Bucaramanga',
      coordinates: {
        latitude: 7.0988,
        longitude: -73.1042,
      },
    },
  ],
} as const;
