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
- **Diseño**: Tokens institucionales UDES accesibles (alto contraste WCAG AA/AAA).

---

## Documentación Técnica

- [Arquitectura del Sistema](docs/ARCHITECTURE.md)
- [Registro de Decisiones de Arquitectura (ADRs)](docs/DECISIONS.md)
- [Hoja de Ruta por Fases](docs/ROADMAP.md)
- [Guía de Variables de Entorno y Seguridad](docs/ENVIRONMENT.md)
