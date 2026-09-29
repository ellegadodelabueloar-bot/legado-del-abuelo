#!/usr/bin/env python3
"""Arma el mosaico de marca de 400x400 y lo escribe como data URI en src/pattern-tile.css.

El mosaico se usa como mascara CSS: el color lo pone background-color, asi que
el relleno de los paths solo aporta la silueta.

Uso:  python tools/build-pattern.py
"""
import re
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BRAND = ROOT / "assets" / "brand"
NUM = re.compile(r"-?\d+\.\d+")

# (elemento, x, y, tamano, rotacion) dentro del tile de 400x400
TILE = [
    ("seed-solid", 26, 40, 30, -14), ("leaf-ring", 108, 8, 74, 18),
    ("flower-solid", 236, 30, 70, 0), ("seed-ring", 340, 74, 34, 22),
    ("beret-ring", 20, 150, 110, -6), ("seed-solid", 168, 128, 26, 30),
    ("leaf-solid", 246, 146, 80, -24), ("seed-ring", 360, 178, 30, -10),
    ("flower-ring", 76, 260, 86, 12), ("seed-solid", 196, 248, 32, 8),
    ("beret-solid", 248, 292, 104, 10), ("seed-ring", 24, 350, 28, 16),
    ("leaf-ring", 154, 320, 62, 40), ("seed-solid", 378, 300, 26, -20),
]


def redondear(s: str) -> str:
    """Baja los decimales de los paths a uno: el archivo pesa casi la mitad."""
    return NUM.sub(lambda m: ("%.1f" % float(m.group(0))).rstrip("0").rstrip(".") or "0", s)


def paths(nombre: str):
    return re.findall(r"<path\b[^>]*?/>", (BRAND / f"icon-{nombre}.svg").read_text(), re.S)


def bbox(d: str):
    v = [float(x) for x in re.findall(r"-?\d+(?:\.\d+)?", d)]
    return min(v[0::2]), min(v[1::2]), max(v[0::2]), max(v[1::2])


def main() -> None:
    g, h, b, f = paths("granos"), paths("hojas"), paths("boina"), paths("flor")
    elementos = {
        "seed-solid": [g[4]], "seed-ring": [g[13]],
        "leaf-solid": [h[0]], "leaf-ring": [h[1]],
        "beret-ring": [b[0]], "beret-solid": [b[1]],
        "flower-ring": [f[0]], "flower-solid": f[1:5],
    }
    cajas = {}
    for k, ps in elementos.items():
        bs = [bbox(re.search(r'\sd="([^"]*)"', p).group(1)) for p in ps]
        cajas[k] = (min(x[0] for x in bs) - 3, min(x[1] for x in bs) - 3,
                    max(x[2] for x in bs) + 3, max(x[3] for x in bs) + 3)

    partes = []
    for nombre, x, y, tam, rot in TILE:
        x0, y0, x1, y1 = cajas[nombre]
        w, alto = x1 - x0, y1 - y0
        sc = tam / max(w, alto)
        ox, oy = x + (tam - w * sc) / 2, y + (tam - alto * sc) / 2
        dibujo = re.sub(r'fill="[^"]*"', 'fill="#000"', redondear("".join(elementos[nombre])))
        partes.append(
            f'<g transform="rotate({rot} {x+tam/2:.0f} {y+tam/2:.0f}) '
            f'translate({ox:.1f} {oy:.1f}) scale({sc:.4f}) '
            f'translate({-x0:.1f} {-y0:.1f})">{dibujo}</g>')

    tile = ('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" '
            'viewBox="0 0 400 400">' + "".join(partes) + "</svg>")
    (BRAND / "pattern-tile.svg").write_text(tile, encoding="utf-8")

    # el '#' NO puede quedar sin codificar: dentro de un data URI corta la URL
    enc = urllib.parse.quote(tile, safe="/:=,()-. ")
    (ROOT / "src" / "pattern-tile.css").write_text(
        "/* Mosaico de elementos de marca usado como mascara CSS.\n"
        "   Generado por tools/build-pattern.py — no editar a mano. */\n"
        f':root{{--tile:url("data:image/svg+xml,{enc}")}}\n', encoding="utf-8")
    print(f"pattern-tile.svg  {len(tile):,} bytes")
    print(f"pattern-tile.css  {len(enc):,} bytes codificados")


if __name__ == "__main__":
    main()
