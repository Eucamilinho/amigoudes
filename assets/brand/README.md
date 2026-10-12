# Apartado del Logo del Proyecto (Carpooling UDES)

Este directorio está reservado para el logotipo oficial de la aplicación móvil.

## ¿Dónde colocar tu archivo de logo?

Coloca tu archivo de imagen directamente en esta carpeta con el nombre:

```text
assets/brand/logo.png
```

También puedes colocar variantes como:
- `logo-white.png` (versión blanca para fondos oscuros)
- `logo-icon.png` (sólo isotipo/icono)

## Especificaciones recomendadas:
- **Formato:** PNG con fondo transparente (o SVG si se utiliza react-native-svg).
- **Resolución sugerida:** 512 × 512 px (cuadrado) o 600 × 200 px (horizontal).
- **Paleta recomendada:** Azul `#276EF1` y Blanco `#FFFFFF` acorde a la identidad Transit Kiosk.

## ¿Cómo funciona el componente `AppLogo`?
El componente `AppLogo` (`src/components/ui/AppLogo.tsx`) detecta automáticamente el logo del proyecto. Si aún no has subido tu archivo PNG en esta carpeta, mostrará de manera automática e integrada el isotipo vectorial institucional de "UDES Ride" con la tipografía oficial Inter y el color de marca azul.
