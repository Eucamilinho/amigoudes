# AmigoUDES 🚗🎓

> **Carpooling exclusivo para la comunidad de la Universidad de Santander (UDES), Bucaramanga, Colombia.**

Aplicación móvil construida en **React Native** con **Expo SDK 57 (managed workflow + Continuous Native Generation)**, **TypeScript estricto** y estilizada con **NativeWind (Tailwind CSS)** siguiendo el sistema de diseño clínico (*clinical blueprint on frosted paper* con acento exclusivo azul `#2563EB`).

---

## 📱 Visión del Producto

- **Comunidad UDES:** Estudiantes, docentes y personal administrativo comparten trayectos hacia y desde el campus (Lagos del Cacique, Bucaramanga).
- **Dos Roles en Un Solo Perfil:** Pasajero y Conductor integrados, alternables al instante desde el toggle segmentado en el Home.
- **Rutas Habituales y Demanda Potencial:** Registro de horarios rutinarios y sectores de origen para proyectar demanda potencial antes de publicar un viaje.
- **Solidario y Seguro:** Carpooling sin ánimo de lucro (aporte voluntario de gasolina) y protección de privacidad (radios aproximados ~400 m, sin direcciones exactas públicas).

---

## 🛠 Stack Técnico

- **Framework:** Expo SDK 57 (~57.0.28) / React Native 0.86.3 / React 19.2.3.
- **Estilos:** NativeWind v4 (`nativewind@^4.2.7`, `tailwindcss@3`).
- **Navegación:** Expo Router v57 (rutas en `src/app/`).
- **Estado Servidor:** TanStack Query (`@tanstack/react-query`).
- **Validación:** Zod.
- **Animaciones y Gestos:** `react-native-reanimated`, `react-native-gesture-handler`.
- **Íconos:** `lucide-react-native`, `@expo/vector-icons`.

---

## 🎨 Sistema de Diseño (Azul Clínico)

- **Canvas:** `#F5F5F5` (fondo de pantallas e inputs en reposo).
- **Paper:** `#FFFFFF` (tarjetas, modales, bottom sheets).
- **Ink / Ink-soft:** `#0A0A0A` / `#171717` (títulos y textos principales).
- **Mid-gray:** `#737373` (textos atenuados, placeholders).
- **Hairline:** `#E5E5E5` (bordes y divisores).
- **Primary:** `#2563EB` (acciones principales, selección, enlaces).
- **Destructive:** `#E7000B` (exclusivo para errores y acciones destructivas).

---

## 🚦 Comandos de Verificación

```bash
# Comprobación de tipos
npx tsc --noEmit

# Linter oficial de Expo
npx expo lint

# Iniciar servidor de desarrollo
npx expo start
```
