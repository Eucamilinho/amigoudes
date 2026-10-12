# Guía de Variables de Entorno y Seguridad

## 1. Filosofía de Seguridad

En aplicaciones móviles compiladas para Android e iOS, el binario del cliente se distribuye a dispositivos de usuarios finales. Por esta razón:

- **Cualquier valor incrustado en el código del cliente es potencialmente visible.**
- Las credenciales privadas (como claves de base de datos directas, claves maestras de Supabase o claves de pasarelas de pago) **NUNCA** deben incluirse en la aplicación móvil.
- La seguridad debe aplicarse siempre en el backend (por ejemplo, mediante políticas RLS en PostgreSQL/Supabase).

---

## 2. Prefijo `EXPO_PUBLIC_`

Expo expone únicamente aquellas variables de entorno que tienen el prefijo `EXPO_PUBLIC_`.
Cualquier otra variable se mantiene oculta para el empaquetador del cliente por defecto.

---

## 3. Variables Previstas por Fase

| Variable | Fase de Uso | Descripción | Nivel de Exposición |
| :--- | :--- | :--- | :--- |
| `EXPO_PUBLIC_APP_ENV` | Fase 0+ | Entorno actual (`development`, `staging`, `production`) | Público |
| `EXPO_PUBLIC_SUPABASE_URL` | Fase 1+ | Endpoint del proyecto Supabase | Público |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Fase 1+ | Clave anónima pública de Supabase (protegida con RLS) | Público |
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Fase 3+ | Clave pública de Google Maps con restricción por Package ID | Público |

---

## 4. Cómo Configurar el Entorno Local

1. Copia la plantilla `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```
2. Completa los valores requeridos para el desarrollo local.
3. El archivo `.env` está expresamente excluido en `.gitignore` para evitar cualquier riesgo de subida accidental al repositorio Git.
