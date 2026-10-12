# Registro de Decisiones de Arquitectura (ADRs)

Este documento registra las decisiones técnicas fundamentales tomadas para el proyecto de Carpooling Universitario UDES.

---

## ADR-001: Selección de Expo SDK 57 y Expo Router

- **Estado**: Aceptado
- **Contexto**: Se requiere una plataforma móvil moderna, estable y mantenible que permita desarrollo ágil para iOS y Android sin complejidad nativa innecesaria en la etapa inicial.
- **Decisión**: Se selecciona **Expo SDK 57** (`expo@~57.0.28`, `react-native@0.86.3`) con **Expo Router v57** (`main: "expo-router/entry"`).
- **Consecuencias**:
  - Enrutamiento intuitivo basado en el sistema de archivos (`src/app/`).
  - Compatibilidad certificada con librerías nativas clave a través de `expo install`.

---

## ADR-002: TypeScript con Configuración Estricta y Path Aliases

- **Estado**: Aceptado
- **Contexto**: Para prevenir errores en tiempo de ejecución y asegurar la calidad del código a medida que el proyecto escale, se requiere un sistema de tipos riguroso.
- **Decisión**: Configurar `tsconfig.json` con:
  - `"strict": true`
  - `"noImplicitReturns": true`
  - `"noFallthroughCasesInSwitch": true`
  - `"noUncheckedIndexedAccess": true`
  - Path alias: `@/*` apuntando a `./src/*`.
- **Consecuencias**: Código autofuncional, tipado seguro y rutas limpias de importación.

---

## ADR-003: Zod para Validación de Contratos y Entorno

- **Estado**: Aceptado
- **Contexto**: Las variables de entorno y los datos que provienen de APIs externas pueden causar errores silenciosos si no coinciden con la estructura esperada.
- **Decisión**: Integrar `zod` para validar variables de entorno (`schemas/env.schema.ts`) y estructurar los contratos de datos de fases futuras.
- **Consecuencias**: Detección inmediata en tiempo de desarrollo de variables faltantes o mal estructuradas e inferencia de tipos con `z.infer`.

---

## ADR-004: Compatibilidad Verificada de React Native Maps para Fase 3

- **Estado**: Aceptado / Verificado
- **Contexto**: La Fase 3 requerirá visualización de mapas. React Native Maps debe ser compatible con la versión de Expo seleccionada.
- **Decisión**: Se verificó el catálogo de módulos empaquetados de Expo SDK 57 (`bundledNativeModules.json`): versión oficial `react-native-maps: 1.27.2`.
- **Consecuencias**: Garantía de compatibilidad nativa futura; la instalación se posterga deliberadamente hasta la Fase 3.

---

## ADR-005: Seguridad y Aislamiento de Variables de Entorno

- **Estado**: Aceptado
- **Contexto**: En aplicaciones móviles, todo el código empaquetado en el cliente puede ser descompilado.
- **Decisión**:
  - Ignorar en `.gitignore` todos los archivos `.env*` excepto `.env.example`.
  - Solo permitir variables públicas que comiencen con `EXPO_PUBLIC_`.
  - Prohibir terminantemente el uso de claves secretas (`service_role` de Supabase) en el cliente móvil.

---

## ADR-006: Reorganización del Código en `src/` (Práctica Obytes)

- **Estado**: Aceptado
- **Contexto**: Separar el código fuente de los archivos de configuración de la raíz (`package.json`, `app.json`, `jest.config.js`).
- **Decisión**: Mover todas las carpetas funcionales a `src/` (`src/app`, `src/components`, `src/constants`, `src/store`, `src/lib`, etc.).
- **Consecuencias**: Arquitectura más limpia, estándar de la industria y compatible nativamente con Expo Router.

---

## ADR-007: Adopción de Zustand para Estado Ligero del Cliente

- **Estado**: Aceptado (Inspirado en Obytes)
- **Contexto**: El modelo de negocio UDES requiere que el estudiante alterne entre los roles de **Pasajero** y **Conductor** en memoria de cliente.
- **Decisión**: Implementar `zustand` (`src/store/useAppStore.ts`).
- **Consecuencias**:
  - Cero boilerplate y peso mínimo (< 3KB).
  - No requiere Providers anidados.
  - Almacena únicamente el modo activo (`passenger` | `driver`), sin mezclar datos de red ni tokens.

---

## ADR-008: Adopción de TanStack Query para Datos de Servidor

- **Estado**: Aceptado (Inspirado en Obytes)
- **Contexto**: En las fases 1 y 3 se conectarán Supabase y Google Maps. Se requiere una estrategia robusta de gestión de datos asíncronos.
- **Decisión**: Instalar `@tanstack/react-query` y configurar `QueryProvider` en el root layout (`src/app/_layout.tsx`).
- **Consecuencias**: Infraestructura lista para caching, reintentos y estados de carga (`isLoading`, `isError`) sin contaminar el estado local de UI.

---

## ADR-009: Marco de Pruebas Unitarias con Jest y Testing Library

- **Estado**: Aceptado (Inspirado en Obytes)
- **Contexto**: Se requiere verificar la calidad y el comportamiento de componentes y lógica sin depender de pruebas manuales en emulador.
- **Decisión**: Configurar `jest-expo`, `jest` y `@testing-library/react-native` con pruebas automatizadas para componentes UI, esquemas Zod y stores de Zustand.
- **Consecuencias**: Cobertura ejecutable con `npm test` y detección temprana de regresiones.

---

## ADR-010: Conservación del Sistema de Tokens vs. Uniwind en SDK 57

- **Estado**: Aceptado
- **Contexto**: Obytes v9 incorporó `uniwind` con Tailwind CSS v4. En Expo SDK 57 (React 19.2 / RN 0.86), Tailwind v4 requiere configuración experimental con el compilador de React y plugins de Metro adicionales.
- **Decisión**: Conservar nuestro sistema de tokens accesible en `src/constants/theme.ts` y componentes base encapsulados (`components/ui`), evitando dependencias complejas y garantizando compatibilidad inmediata.
