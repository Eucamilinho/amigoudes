# Capa de Servicios Externos (Services)

Esta carpeta contendrá los módulos encargados de comunicarse con APIs externas y proveedores de datos.

## Convención de diseño

1. **Aislamiento de infraestructura**: Los componentes de la interfaz de usuario nunca deben llamar a APIs de terceros directamente; deben utilizar las funciones expuestas en esta capa.
2. **Servicios previstos**:
   - `services/supabase/` (Fase 1): Cliente de autenticación y consultas a PostgreSQL con RLS.
   - `services/maps/` (Fase 3): Servicio de geocodificación y cálculo de rutas con Google Maps Platform.
3. **Manejo de errores**: Cada servicio debe normalizar los errores de red o del proveedor a tipos legibles y predecibles definidos en `types/`.
4. **Seguridad**: Ninguna clave secreta (`service_role` o keys sin restricciones) debe incluirse en esta capa.
