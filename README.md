# Página web — Legado del Abuelo

Landing de una página para las tres mostazas artesanales de 150 g: Honey, Suave y Picante.
El hero es un selector orbital: se arrastra y el frasco del centro cambia junto con el color
de toda la pantalla.

## Arrancar

```bash
python tools/build.py
```

Eso regenera `index.html` (abrilo en el navegador) y `artifact.html` (el que se publica).
Para editar, tocá `src/`, nunca los dos HTML de la raíz.

## Qué falta cargar

- Precios de las tres variedades → `FLAVORS` en `src/app.js`
- Número de WhatsApp → constante `WPP` en `src/app.js`
- Elegir una de las tres combinaciones tipográficas y sacar el selector

El detalle completo —identidad, decisiones de diseño, cómo funciona el carrusel y cómo
republicar— está en `CLAUDE.md`.

## Estructura

```
src/            fuentes que se editan
assets/brand/   logo y elementos de marca en SVG
assets/jars/    los tres frascos recortados
brand/          manual de rebranding y fotos originales sin recortar
tools/          build y scripts de generación de assets
```
