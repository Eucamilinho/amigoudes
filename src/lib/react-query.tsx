import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Cliente centralizado de TanStack Query optimizado para aplicaciones móviles.
 * Configura políticas predeterminadas de caché y reintentos para futuras
 * integraciones de datos (Supabase en Fase 1, Google Maps en Fase 3).
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos de validez de caché
      gcTime: 1000 * 60 * 30, // 30 minutos antes de recolección de basura
      retry: 2,
      refetchOnWindowFocus: false, // Evita peticiones innecesarias al cambiar de app en móvil
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

export interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
