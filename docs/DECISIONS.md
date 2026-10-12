# Registro de Decisiones de Arquitectura (ADRs)

Este documento registra las decisiones técnicas fundamentales tomadas para el proyecto de Carpooling Universitario UDES.

---

## ADR-001: Selección de Expo SDK 57 y Expo Router

- **Estado**: Aceptado
- **Contexto**: Se requiere una plataforma móvil moderna, estable y mantenible que permita desarrollo ágil para iOS y Android sin complejidad nativa innecesaria en la etapa inicial.
- **Decisión**: Se selecciona **Expo SDK 57** (`expo@~57.0.28`, `react-native@0.86.3`) con **Expo Router v57** (`main: "expo-router/entry"`).
- **Consecuencias**:
  - Enrutamiento intuitivo basado en el sistema de archivos (`app/`).
  - Compatibilidad certificada con librerías nativas clave a través de `expo install`.
  - Simplificación del ciclo de compilación y pruebas multiplataforma.

---

## ADR-002: TypeScript con Configuración Estricta y Path Aliases

- **Estado**: Aceptado
- **Contexto**: Para prevenir errores en tiempo de ejecución y asegurar la calidad del código a medida que el proyecto escale en múltiples fases, se requiere un sistema de tipos riguroso.
- **Decisión**: Configurar `tsconfig.json` con:
  - `"strict": true`
  - `"noImplicitReturns": true`
  - `"noFallthroughCasesInSwitch": true`
  - `"noUncheckedIndexedAccess": true`
  - Path aliases: `@/*`, `@/components/*`, `@/constants/*`, `@/schemas/*`, etc.
- **Consecuencias**:
  - Código autofuncional y documentado mediante tipos.
  - Mayor seguridad al consultar objetos y arrays.
  - Rutas de importación limpias e independientes de la profundidad relativa de carpetas.

---

## ADR-003: Zod para Validación de Contratos y Entorno

- **Estado**: Aceptado
- **Contexto**: Las variables de entorno y los datos que provienen de APIs externas pueden causar errores silenciosos si no coinciden con la estructura esperada.
- **Decisión**: Integrar `zod` para validar variables de entorno (`schemas/env.schema.ts`) y estructurar los contratos de datos de fases futuras.
- **Consecuencias**:
  - Detección inmediata en tiempo de desarrollo de variables faltantes o mal estructuradas.
  - Inferencia automática de tipos de TypeScript (`z.infer<typeof schema>`).

---

## ADR-004: Compatibilidad Verificada de React Native Maps para Fase 3

- **Estado**: Aceptado / Verificado
- **Contexto**: La Fase 3 requerirá visualización de mapas. React Native Maps debe ser compatible con la versión de Expo seleccionada antes de avanzar.
- **Decisión**: Se verificó el catálogo de módulos empaquetados de Expo SDK 57 (`bundledNativeModules.json`):
  - Versión compatible oficial para SDK 57: `react-native-maps: 1.27.2`.
  - Peer dependencies compatibles con React 19 y React Native 0.86.
- **Consecuencias**:
  - Garantía de que en la Fase 3 no habrá bloqueos de incompatibilidad nativa.
  - La instalación se posterga deliberadamente hasta la Fase 3 para no inflar dependencias en Fase 0.

---

## ADR-005: Seguridad y Aislamiento de Variables de Entorno

- **Estado**: Aceptado
- **Contexto**: En aplicaciones móviles, todo el código empaquetado en el cliente puede ser descompilado. Subir credenciales privadas al cliente o a repositorios es un riesgo crítico.
- **Decisión**:
  - Ignorar en `.gitignore` todos los archivos `.env*` excepto `.env.example`.
  - Solo permitir variables públicas que comiencen con `EXPO_PUBLIC_`.
  - Prohibir terminantemente el uso de claves secretas (`service_role` de Supabase o claves de pago) en el cliente móvil.
  - Delegar la seguridad de datos al backend mediante Row Level Security (RLS) en Supabase cuando se inicie la Fase 1.
