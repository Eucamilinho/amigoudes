# Hoja de Ruta del Proyecto - Carpooling Universitario UDES

El desarrollo del MVP se ejecuta de forma incremental por fases pequeñas, independientes y verificables.

---

## Estado Actual de las Fases

| Fase | Descripción | Estado |
| :--- | :--- | :--- |
| **FASE 0** | **Arquitectura, configuración y estructura inicial** | **COMPLETADA** |
| **FASE 1** | Registro, inicio de sesión institucional, verificación de correo, recuperación de contraseña y persistencia de sesión con Supabase | Pendiente (Requiere autorización) |
| **FASE 2** | Perfil del estudiante, datos de vehículo y cambio dinámico entre modo Pasajero y Conductor | Pendiente |
| **FASE 3** | Mapa real con React Native Maps, geocodificación y cálculo de rutas con Google Maps Platform | Pendiente |
| **FASE 4** | Creación, edición y gestión de rutas habituales hacia el campus UDES | Pendiente |
| **FASE 5** | Publicación de recorridos, algoritmo de búsqueda y coincidencias entre estudiantes | Pendiente |
| **FASE 6** | Solicitudes de cupo, aceptación, cancelación y gestión de viajes | Pendiente |
| **FASE 7** | Notificaciones, seguridad adicional y herramientas de confianza comunitaria | Pendiente |
| **FASE 8** | Pruebas integrales, piloto y preparación del MVP | Pendiente |

---

## Criterios de Aceptación de la Fase 0

- [x] Dependencias compatibles y verificadas.
- [x] Proyecto inicializado en Expo SDK 57 con TypeScript en modo estricto.
- [x] Expo Router configurado como motor de enrutamiento basado en archivos.
- [x] Estructura inicial de carpetas creada sin abstracciones vacías innecesarias.
- [x] Sistema de diseño base accesible con identidad UDES (`components/ui`).
- [x] Validación de variables de entorno mediante esquemas de Zod (`schemas/env.schema.ts`).
- [x] Archivo `.env.example` preparado y documentado; `.gitignore` protege todos los archivos `.env*`.
- [x] Pantalla inicial funcional (`app/index.tsx`) con verificación de interactividad.
- [x] Cero servicios externos conectados prematuramente (no Supabase, no mapas en Fase 0).
- [x] Documentación de decisiones técnicas y arquitectura lista.
