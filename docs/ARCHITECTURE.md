# Arquitectura del Sistema - Carpooling Universitario UDES

## 1. Visión General

La aplicación móvil de Carpooling UDES conecta a la comunidad estudiantil de la Universidad de Santander (campus Bucaramanga) mediante una plataforma móvil ágil, segura y moderna.

La arquitectura base adopta las mejores prácticas y patrones de la plantilla oficial de [Obytes](https://github.com/obytes/react-native-template-obytes), adaptadas a **Expo SDK 57**, **React Native 0.86** y **TypeScript estricto**, garantizando alta modularidad, cobertura de pruebas y desacoplamiento para el desarrollo por fases.

---

## 2. Estructura de Directorios (Basada en `src/`)

```text
brave-brahmagupta/
├── src/
│   ├── app/                      # Rutas de Expo Router (controladores de pantalla delgados)
│   │   ├── _layout.tsx           # Providers: QueryProvider, SafeAreaProvider, StatusBar
│   │   └── index.tsx             # Pantalla de inicio conectada a Zustand y componentes UI
│   ├── components/
│   │   ├── ui/                   # Sistema de diseño UDES: ThemedText, Button, Card, ScreenContainer, StatusBadge
│   │   └── ui/__tests__/         # Pruebas unitarias de componentes con Testing Library
│   ├── constants/
│   │   ├── theme.ts              # Tokens institucionales UDES: colores, espaciado, radios, tipografía
│   │   └── config.ts             # Metadatos del campus y configuración de la app
│   ├── features/                 # Dominios de negocio (README con lineamientos; módulos a partir de Fase 1)
│   ├── hooks/
│   │   └── useTheme.ts           # Hook desacoplado para tokens de diseño
│   ├── lib/
│   │   ├── react-query.tsx       # Cliente y proveedor centralizado de TanStack Query
│   │   └── env.ts                # Lectura segura y validación de variables de entorno
│   ├── schemas/
│   │   ├── env.schema.ts         # Esquemas de validación Zod
│   │   └── __tests__/            # Pruebas unitarias de esquemas Zod
│   ├── services/                 # Clientes para APIs externas (Supabase, Maps) con aislamiento
│   ├── store/
│   │   ├── useAppStore.ts        # Store global Zustand: alternancia de modo Pasajero / Conductor
│   │   └── __tests__/            # Pruebas unitarias del estado global
│   └── types/
│       ├── app.ts                # Tipos de estado global (UserMode, AppState)
│       ├── env.ts                # Tipos inferidos de entorno
│       └── theme.ts              # Tipos del sistema de diseño
├── docs/                         # Documentación técnica, ADRs y roadmap
├── .env.example                  # Plantilla documentada de variables de entorno
├── app.json                      # Configuración de Expo y esquema de deep linking
├── eslint.config.js              # Configuración moderna de ESLint (flat config)
├── jest.config.js                # Configuración de Jest con jest-expo preset
├── package.json                  # Dependencias y scripts de validación
└── tsconfig.json                 # TypeScript estricto con alias @/* -> ./src/*
```

---

## 3. Principios de Diseño Adoptados de Obytes

1. **Estructura en `src/`**: Todo el código de la aplicación reside en `src/`, separándolo de los archivos raíz de configuración y herramientas (`app.json`, `package.json`, `jest.config.js`, etc.).
2. **Separación Estricta entre Rutas y Vistas**: Las rutas en `src/app/` son exclusivamente puntos de entrada de navegación. Delegan la lógica a stores (`src/store/`), llamadas de red a `src/lib/` / `src/services/` y la presentación a componentes reutilizables.
3. **Gestión Dual de Estado**:
   - **Estado del Servidor**: Administrado por **TanStack Query** (`@tanstack/react-query`). Maneja caché, deduplicación de consultas y reintentos automáticos.
   - **Estado del Cliente**: Administrado por **Zustand** (`zustand`). Almacena únicamente el estado de interfaz en memoria (ej. rol activo: Pasajero vs. Conductor), sin mezclar datos de red ni guardar información sensible.
4. **Validación en los Límites**: Todos los datos externos se validan rigurosamente mediante esquemas de **Zod**.
5. **Cultura de Pruebas Automatizadas**: Cada componente base, esquema y store cuenta con pruebas unitarias (`jest` + `@testing-library/react-native`).
