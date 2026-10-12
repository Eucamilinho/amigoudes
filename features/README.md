# Arquitectura de Características (Features)

Esta carpeta organiza el código de la aplicación por dominios de negocio a medida que avance el desarrollo de cada fase.

## Convención de estructura por dominio

Cada dominio se creará cuando la fase correspondiente sea autorizada:

- `features/auth/` (Fase 1): Componentes, hooks y validaciones de login, registro institucional y recuperación de clave.
- `features/profile/` (Fase 2): Gestión de perfil del estudiante, modo Pasajero / Conductor, y vehículo.
- `features/map/` (Fase 3): Integración de mapas, geocodificación y trazo de rutas hacia la UDES.
- `features/rides/` (Fases 4 y 5): Publicación, búsqueda y gestión de recorridos compartidos.
- `features/bookings/` (Fase 6): Solicitudes y confirmación de cupos entre estudiantes.
- `features/notifications/` (Fase 7): Avisos y herramientas de confianza comunitaria.

## Reglas de aislamiento
1. Cada feature encapsula sus componentes y hooks específicos.
2. Los componentes genéricos de UI compartidos deben residir en `components/ui`.
3. Ninguna feature debe importar elementos privados internos de otra feature; las dependencias cruzadas deben pasar por contratos en `types/` o servicios compartidos.
