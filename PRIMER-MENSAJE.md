# Primer mensaje para el chat "Pagina web"

Copiá y pegá el bloque de abajo como primer mensaje del chat nuevo.
Con eso queda nombrado "Pagina web" y arranca sabiendo todo.

---

Estoy trabajando en la página web de Legado del Abuelo. El proyecto está en la carpeta
`Legado Del Abuelo\pagina web Legado del abuelo`.

Antes de tocar nada, leé `CLAUDE.md`: ahí está todo el contexto — la referencia de diseño que
recreamos (una toma de Dribbble con un carrusel orbital), la paleta y las tipografías del
manual de marca, cómo está armado el hero por capas, cómo funciona el carrusel de las tres
mostazas y qué está pendiente.

Tres cosas que conviene que sepas de entrada:

1. `index.html` y `artifact.html` son **generados**. Se edita `src/` y se corre
   `python tools/build.py`.
2. La página ya está publicada como Artifact en
   `https://claude.ai/artifact/WNYNdFhS3badyzEjtXqN6e`. Para actualizarla hay que republicar
   `artifact.html` **pasando esa URL**, con los tres PNG de `assets/jars/` como archivos de
   apoyo. Si se publica sin la URL se crea un artifact nuevo en vez de actualizar el que ya está.
3. Pendientes: cargar los precios y el número de WhatsApp en `FLAVORS` y `WPP` de
   `src/app.js`, y elegir una de las tres combinaciones tipográficas para sacar el selector.

Decime qué encontraste y arrancamos.

---

## Si preferís que lo resuma yo en vez de leer el archivo

El proyecto es una landing de una sola página para las tres mostazas artesanales de 150 g
(Honey, Suave, Picante). El hero es un selector orbital: tres frascos sobre un arco, el del
centro es el grande y los otros dos flanquean; se arrastra y rotan, y el fondo entero cambia
de color siguiendo la variedad. Todo apoyado sobre una montaña de granos de mostaza.

Los assets salieron del material que mandó el cliente: el logo y los cuatro elementos de
marca (granos, hojas, boina, flor) están extraídos **en vector** del PDF de rebranding, y los
tres frascos están recortados de las fotos originales. Todo eso está en `assets/` y el
material de origen en `brand/`, junto con el video de referencia.
