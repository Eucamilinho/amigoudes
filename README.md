# Carpooling Universitario UDES

> Aplicación móvil de viajes compartidos exclusiva para estudiantes de la Universidad de Santander (UDES), campus Lagos del Cacique, Bucaramanga, Colombia.

---

## Estado del Proyecto

- **Fase Actual**: **FASE 0 - Arquitectura, Configuración y Estructura Inicial (COMPLETADA)**
- **Próxima Fase**: **FASE 1 - Autenticación con Supabase y Verificación de Correo Estudiantil** (Pendiente de aprobación)

---

## Requisitos Previos

- **Node.js**: Versión 20+ (recomendada LTS, testeado en v24).
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
| `npm run typecheck` | Ejecuta la verificación estricta de tipos de TypeScript sin emitir archivos |
| `npm run doctor` | Diagnostica dependencias y compatibilidad con Expo Doctor |

---

## Stack Tecnológico Base

- **Framework**: React Native 0.86 con Expo SDK 57.
- **Navegación**: Expo Router v57 (enrutamiento declarativo basado en archivos).
- **Lenguaje**: TypeScript con configuración estricta (`strict: true`).
- **Validaciones**: Zod para esquemas de datos y variables de entorno.
- **Diseño**: Tokens institucionales UDES y componentes accesibles en `components/ui`.

---

## Documentación Técnica

- [Arquitectura del Sistema](docs/ARCHITECTURE.md)
- [Registro de Decisiones de Arquitectura (ADRs)](docs/DECISIONS.md)
- [Hoja de Ruta por Fases](docs/ROADMAP.md)
- [Guía de Variables de Entorno y Seguridad](docs/ENVIRONMENT.md)
