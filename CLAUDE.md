# Legado del Abuelo — página web

Landing de una sola página para la mostaza artesanal **Legado del Abuelo** (Juan → Martín,
"herencia gastronómica"). Tres variedades de 150 g: **Honey**, **Suave** y **Picante**.

Esta carpeta es el proyecto completo. `index.html` y `artifact.html` son **generados**:
no los edites a mano, editá `src/` y corré `python tools/build.py`.

---

## Cómo trabajar

```bash
python tools/build.py        # regenera index.html y artifact.html desde src/
# abrir index.html en el navegador para ver el resultado
```

| Archivo | Qué es |
|---|---|
| `src/page.html` | Todo el marcado del body. Sin `<html>`, `<head>` ni `<body>`. |
| `src/styles.css` | Todo el CSS. Los tokens de marca están arriba de todo en `:root`. |
| `src/app.js` | Datos de las variedades + carrusel orbital + patrón + selector de tipografía. |
| `src/sprite.svg` | Sprite SVG inline: logo, cara del abuelo y los elementos de marca. |
| `src/pattern-tile.css` | Solo la variable `--tile` (data URI del mosaico). Está aparte porque son 47 KB. |
| `src/fonts.html` | El `<link>` a Google Fonts. |
| `src/title.txt` | El `<title>` de la página. |
| `index.html` | **Generado.** Documento completo, para abrir localmente. |
| `artifact.html` | **Generado.** Fragmento sin esqueleto HTML, para publicar como Artifact de Claude. |

### Publicar

La página ya está publicada como Artifact en
`https://claude.ai/artifact/WNYNdFhS3badyzEjtXqN6e`.
Para actualizarla hay que republicar `artifact.html` **pasando esa URL**, con estos archivos
de apoyo: `assets/jars/honey.png`, `assets/jars/suave.png`, `assets/jars/picante.png`.
Si se publica sin la URL se crea un artifact nuevo en vez de actualizar el existente.

Restricciones del entorno Artifact, importantes al editar:

- El HTML publicado **no** lleva `<!doctype>`, `<html>`, `<head>` ni `<body>` — los agrega la plataforma.
- No se pueden cargar recursos externos salvo scripts de cdnjs/jsdelivr y hojas de estilo de Google Fonts.
  Por eso el sprite va inline y el mosaico va como data URI.
- Las imágenes sí pueden ir como archivos de apoyo (es el caso de los tres frascos).

---

## De dónde salió esto

### La referencia

El pedido fue recrear el formato de una toma de Dribbble:
*"Kumo — Interactive Matcha Tea Landing Page UI/UX"* de Kris Anfalova
(`dribbble.com/shots/26971799`). Lo que se tomó de ahí:

- Marco redondeado a pantalla completa con borde de color y esquinas muy redondeadas.
- Nav flotante: logo arriba a la izquierda, píldora central oscura con íconos, botón circular a la derecha.
- Producto central apoyado sobre una montaña de materia prima (allá matcha en polvo, acá granos de mostaza).
- Nombre de la variedad en serif itálica sobre el producto.
- Ficha chica de precio + botón de carrito superpuesta al producto.
- Titular gigante abajo, centrado.
- **Carrusel orbital**: tarjetas cuadradas color crema, inclinadas, sobre un arco alrededor del producto.
  Al arrastrar rotan sobre el arco cambiando posición, escala, inclinación y opacidad, y el producto
  central cambia acompañando la selección.

### La adaptación

El original tiene 5 tarjetas porque son 5 sabores. Acá son 3 productos, así que **el centro del
arco es el frasco grande y las otras dos variedades quedan flanqueando**. Al girar, la de un
costado pasa al centro y la del centro se va al costado. El arco nunca queda vacío y escala
bien si mañana hay una cuarta variedad (basta con sumarla a `FLAVORS` en `src/app.js`).

Decisión tomada con el cliente entre tres opciones; se descartó intercalar tarjetas decorativas
de ingredientes.

---

## Identidad (del PDF de rebranding, en `brand/`)

### Paleta

| Token | Hex | Uso |
|---|---|---|
| `--bordo` | `#78120B` | Etiqueta Picante, sección de pedidos |
| `--crema` | `#D8C39E` | Etiqueta Suave, fondos claros |
| `--ocre` | `#C6822E` | Etiqueta Honey. **Color principal de marca** |
| `--oliva` | `#695F2C` | Hojas, sección "Lo que hay adentro" |
| `--marron` | `#3D2116` | Tipografía y fondos oscuros |

Derivados propios del sitio: `--tinta #2A1710` (fondo general), `--papel #EDE2CC` (texto sobre oscuro),
`--papel-2 #E2D2B4` (tarjetas del carrusel).

### Tipografías

El manual define **Farmhand Sans** (títulos) y **Powell** (textos). Las dos son de pago y no
están en Google Fonts. La página trae un **selector flotante abajo a la derecha** con tres
combinaciones libres para que el cliente elija:

| Opción | Títulos | Textos |
|---|---|---|
| `manual` (por defecto) | Big Shoulders Display | Gilda Display |
| `almacen` | Staatliches | EB Garamond |
| `campo` | Bevan | Vollkorn |

Se cambian con `data-font` en `<html>`; cada una redefine `--display` y `--texto`.
**Cuando el cliente elija, hay que sacar el selector y dejar solo esa combinación** (borrar
el bloque `.fontbar` de `page.html` y `styles.css`, el bloque de tipografía al final de
`app.js`, y las familias que sobren del `<link>` en `fonts.html`). Si consiguen las licencias
de Farmhand Sans y Powell, se cargan con `@font-face` en base64 dentro de `styles.css`
(el CSP del Artifact no deja traerlas de otro host).

### Elementos de marca

Los cuatro del manual, extraídos del PDF **como vectores**: **granos de mostaza** (el producto),
**hojas** y **flor** de la Sinapis Alba (el proceso de plantación y cosecha) y la **boina**
(la conexión emocional con el abuelo). Están en `assets/brand/` y como `<symbol>` en
`src/sprite.svg` con estos ids:

```
el-logo  el-abuelo  el-seeds
el-seed-solid  el-seed-ring
el-leaf-solid  el-leaf-ring
el-beret-solid el-beret-ring
el-flower-solid el-flower-ring
```

Todos usan `fill="currentColor"`, así que se tiñen con `color` en CSS. Se usan con
`<svg style="aspect-ratio:W/H"><use href="#el-xxx"/></svg>` — **sin `viewBox` en el `<svg>`
externo**, porque el `<symbol>` ya trae el suyo y poner los dos desplaza el dibujo fuera de vista.

El **mosaico de fondo** combina esos elementos en un tile de 400×400 y se aplica como
**máscara CSS** (`mask-image` + `background-color: currentColor`), no como `<pattern>` SVG.
Esto es a propósito: un `<pattern>` con `<use>` adentro no repetía bien y además la máscara
permite teñir el patrón con el color de la variedad activa.

---

## Contenido

### Secciones

1. **Hero** (`#inicio`) — el carrusel orbital.
2. **La herencia** (`#herencia`) — Juan → Martín, con la cara del logo en grande.
3. **Las tres** (`#catalogo`) — una ficha por variedad: descripción, escala de picor, maridajes, CTA.
4. **Lo que hay adentro** (`#adentro`) — los cuatro elementos de marca explicados.
5. **Pedí tu frasco** (`#pedido`) — CTA principal.

### Datos de las variedades

Están todos juntos en el array `FLAVORS` al principio de `src/app.js`. Cada entrada define
nombre, bajada, precio, colores (acento, patrón, dos tonos de fondo, tinta, panel),
descripción, picor y maridajes. Tocar solo ahí.

---

## Pendientes

1. **Precios.** `price: ""` en las tres entradas de `FLAVORS`. Mientras esté vacío la ficha
   del hero dice "Consultar". Poner solo el número, sin `$` (el código lo agrega).
2. **WhatsApp.** La constante `WPP` al principio de `app.js` está vacía. Va el número con
   código de país, sin `+` ni espacios: `"5491122334455"`. Mientras esté vacía, **todos los
   botones de pedido apuntan a Instagram** (`@legadodelabuelo.ar`) y aparece un cartelito
   "Falta cargar el número de WhatsApp" en la sección de pedidos — ese cartel desaparece solo
   cuando se carga el número.
3. **Escala de picor.** Honey 1, Suave 2, Picante 5 sobre 5. El 5 de la Picante sale de los
   cinco puntitos de la etiqueta; los otros dos están estimados y hay que confirmarlos.
4. **Textos de sabor.** Los redactó Claude a partir de la etiqueta y del manual. Falta que el
   cliente los valide.
5. **Fotos.** Las originales vienen a 582×725 px. Alcanza justo para el hero; si consiguen
   tomas más grandes, reemplazarlas y volver a correr `tools/cutout-frascos.py`.
6. **Elegir tipografía** (ver arriba).

---

## Detalles de implementación que conviene saber antes de tocar

- **Geometría del carrusel.** Está toda en variables CSS sobre `.stage`: `--ch` (alto del
  item), `--cw` (ancho), `--rx` / `--ry` (radios del arco) y `--cy` (centro vertical). El JS
  **no** lee esas variables con `getPropertyValue` — un `clamp()` o `min()` no se resuelve a
  píxeles ahí. Las mide con un elemento invisible `#measure` que tiene `width:var(--rx)` y
  `height:var(--ry)`. Si cambiás las variables, la JS se adapta sola.
- **Capas del hero.** Todo vive dentro de `.stage` (que crea contexto de apilado), en este
  orden: patrón 0 · viñeta 1 · titular 7 · montaña de atrás 3 · frasco central 5 ·
  montaña de adelante 6 · tarjetas laterales 8 · nombre 12 · ficha de precio 20 · flechas 22 ·
  nav 30. El frasco del centro va **debajo** de la montaña de adelante para que la base quede
  enterrada en los granos; las tarjetas laterales van **encima**.
- **Las montañas** son dos SVG con `preserveAspectRatio="none"` (estiran exacto al contenedor,
  que es lo que permite calcular dónde cae la cresta). Los granos encima se generan por JS con
  un PRNG determinístico (`rng` + `scatter`), siguiendo una gaussiana que replica la curva del
  path. Si cambiás un path, hay que ajustar los parámetros de `scatter` para que los granos
  sigan la nueva cresta.
- **Tema.** La página está comprometida con un único aspecto oscuro y cálido: no tiene modo
  claro ni oscuro. Todos los colores se pintan explícitamente, incluido el fondo del `body`.
- **El fondo del hero cambia de color** interpolando en RGB entre las dos variedades más
  cercanas mientras arrastrás (`mix()` en `app.js`), así que la transición es continua y no un
  salto al soltar.
- Arrastre con puntero, rueda horizontal, clic en las tarjetas laterales, flechas del teclado
  y botones. `prefers-reduced-motion` anula las transiciones.

---

## Cómo se generaron los assets

Los scripts de `tools/` dejan constancia del proceso; no hace falta correrlos salvo que
lleguen fotos nuevas o cambie el manual de marca.

- `tools/cutout-frascos.py` — recorta el fondo blanco de las fotos de los frascos. Detecta el
  marco oscuro, saca el blanco conectado al borde, recorta la sombra del piso limitando la
  silueta al ancho del cuerpo del frasco y descarta las filas de abajo que son solo sombra.
- `tools/extraer-marca.py` — saca el logo y los cuatro elementos del PDF de rebranding en
  vector, quedándose solo con los paths que caen dentro de cada recuadro.
- `tools/build-pattern.py` — arma el tile de 400×400 y lo codifica como data URI en
  `src/pattern-tile.css`.
