# Carpooling Universitario UDES

> Aplicación móvil de viajes compartidos exclusiva para estudiantes de la Universidad de Santander (UDES), campus Lagos del Cacique, Bucaramanga, Colombia.
> Arquitectura moderna y modular inspirada en las mejores prácticas de la plantilla oficial de [Obytes](https://github.com/obytes/react-native-template-obytes).

---

## Estado del Proyecto

- **Fase Actual**: **FASE 0 - Arquitectura, Configuración y Estructura Inicial (COMPLETADA Y REFORZADA CON OBYTES)**
- **Próxima Fase**: **FASE 1 - Autenticación con Supabase y Verificación de Correo Estudiantil** (Pendiente de aprobación)

---

## Requisitos Previos

- **Node.js**: v20+ (recomendada LTS, testeado en v24).
- **npm**: v10+ (o gestor compatible).
- **Expo Go** en dispositivo físico (iOS o Android) o emulador local.

---

## Instalación y Configuración

1. Clonar el repositorio y acceder al directorio:
   ```bash
   cd brave-brahmagupta
   ```

2. Instalar dependencias del proyecto:
   ```bash
   npm install
   ```

3. Configurar variables de entorno locales:
   ```bash
   cp .env.example .env
   ```

---

## Comandos Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run start` | Inicia el servidor de desarrollo de Metro/Expo |
| `npm run android` | Ejecuta la aplicación en emulador o dispositivo Android |
| `npm run ios` | Ejecuta la aplicación en simulador iOS (requiere macOS) |
| `npm run web` | Ejecuta la aplicación en navegador web |
| `npm run typecheck` | Ejecuta la verificación estricta de tipos de TypeScript |
| `npm run lint` | Ejecuta el análisis estático de código con ESLint |
| `npm test` | Ejecuta la suite de pruebas unitarias con Jest |
| `npm run doctor` | Diagnostica dependencias y compatibilidad con Expo Doctor |

---

## Stack Tecnológico y Herramientas Adoptadas

- **Framework**: React Native 0.86 con Expo SDK 57.
- **Navegación**: Expo Router v57 (enrutamiento declarativo basado en archivos en `src/app/`).
- **Estado Cliente**: Zustand v5 (gestión ligera de modo Pasajero / Conductor en `src/store/`).
- **Datos Servidor**: TanStack Query v5 (cliente y caché en `src/lib/react-query.tsx`).
- **Formularios y Validaciones**: TanStack Form + Zod (esquemas en `src/schemas/`).
- **Pruebas Automatizadas**: Jest 29 + React Native Testing Library v14 (en `src/**/__tests__/`).
- **Análisis de Calidad**: ESLint con `eslint-config-expo` + Expo Doctor.
- **Diseño**: "Transit Kiosk" inspirado en Uber con **Azul (#276EF1)** como único color de marca, diseño plano sin sombras, radios binarios (8 y 9999) y tipografía Inter (`@expo-google-fonts/inter`).

---

## Sistema de Diseño: Transit Kiosk Azul

- **Filosofía**: Lienzo blanco (`#FFFFFF`), texto de alto contraste (`#000000`, `#333333`), y un único azul cromático (`#276EF1`) para elementos estructurales e interactivos (cabecera, CTA principal, barra inferior fija, estados activos).
- **Cero Sombras**: Diseño totalmente plano; la profundidad se genera mediante escalones de superficie (`#FFFFFF` → `#F6F6F6` → azul) y bordes hairline de 1px.
- **Tipografía Inter**: Títulos en peso 400 (`display`, `heading`, `headingSm`), textos medios en peso 500 (`subheading`, `bodyMedium`, `label`) y wordmark en peso 700 (`brand`). En Android, el peso se resuelve exclusivamente vía `fontFamily` para evitar distorsiones.
- **Componentes Base**: `AppHeader`, `StickyBottomBar`, `SegmentedToggle`, `LocationInput`, `SuggestionCard`, `SectionHeading`, `TabStrip`, `Button`, `Card`, `Chip` y `ThemedText`.

---

## Documentación Técnica

- [Arquitectura del Sistema](docs/ARCHITECTURE.md)
- [Registro de Decisiones de Arquitectura (ADRs)](docs/DECISIONS.md)
- [Hoja de Ruta por Fases](docs/ROADMAP.md)
- [Guía de Variables de Entorno y Seguridad](docs/ENVIRONMENT.md)
