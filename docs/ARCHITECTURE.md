# Arquitectura del Sistema - Carpooling Universitario UDES

## 1. Visión General

La aplicación móvil de Carpooling UDES está diseñada para conectar a la comunidad estudiantil de la Universidad de Santander (campus Bucaramanga) mediante una plataforma ágil, segura y centrada en dispositivos móviles.

El proyecto sigue una arquitectura modular y desacoplada construida sobre **React Native**, **Expo** y **Expo Router**, orientada a ser mantenible y escalable sin incurrir en complejidad innecesaria para un MVP.

---

## 2. Estructura de Directorios

```text
├── app/                  # Rutas y pantallas de navegación (Expo Router basado en archivos)
│   ├── _layout.tsx       # Root layout con providers (SafeAreaProvider, StatusBar)
│   └── index.tsx         # Pantalla inicial de verificación
├── components/           # Componentes reutilizables
│   └── ui/               # Sistema de diseño base accesible (Button, Card, ThemedText, etc.)
├── constants/            # Constantes globales
│   ├── theme.ts          # Paleta institucional UDES, espaciado, radio y tipografía
│   └── config.ts         # Metadatos del campus y configuración de la app
├── features/             # Módulos organizados por dominio funcional (auth, profile, rides, etc.)
├── hooks/                # Hooks personalizados reutilizables (useTheme, etc.)
├── lib/                  # Integraciones base y utilidades (validador de entorno seguro)
├── services/             # Clientes y adaptadores para APIs externas (Supabase, Maps)
├── schemas/              # Esquemas de validación con Zod
├── types/                # Definiciones de tipos TypeScript compartidos
├── assets/               # Recursos estáticos (logos, iconos de la aplicación)
├── docs/                 # Documentación técnica, ADRs y guías de desarrollo
├── .env.example          # Plantilla documentada de variables de entorno (sin secretos)
├── app.json              # Configuración del proyecto Expo y esquema de enlaces profundos
├── package.json          # Dependencias y scripts de verificación
└── tsconfig.json         # Configuración estricta de TypeScript con path aliases
```

---

## 3. Principios de Diseño

1. **Separación de Responsabilidades**:
   - `app/` maneja exclusivamente el enrutamiento y la composición de vistas.
   - `components/ui/` es puramente agnóstica del dominio y reutilizable.
   - `features/` albergará la lógica de negocio específica de cada caso de uso.
   - `services/` aísla las librerías de infraestructura externa.

2. **Accesibilidad y Experiencia Móvil**:
   - Componentes interactivos con tamaños de toque mínimos (min 44x44 dp).
   - Uso obligatorio de propiedades de accesibilidad (`accessibilityRole`, `accessibilityLabel`, `accessibilityState`).
   - Contraste visual conforme a las pautas WCAG AA/AAA.

3. **Cero Secretos en el Cliente**:
   - Solo se exponen variables públicas con prefijo `EXPO_PUBLIC_`.
   - Las claves maestras (`service_role`, credenciales de base de datos) quedan terminantemente prohibidas en la app móvil.

4. **Validación en los Límites del Sistema**:
   - Toda entrada externa (variables de entorno, respuestas de API, formularios de usuario) se valida mediante esquemas de **Zod**.
