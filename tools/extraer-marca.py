#!/usr/bin/env python3
"""Extrae el logo y los elementos de marca del PDF de rebranding, en vector.

pdftocairo convierte una pagina entera a SVG; este script se queda solo con los
paths que caen dentro del recuadro de cada elemento y arma un sprite con
<symbol> por elemento, todos con fill="currentColor".

Requiere poppler-utils (pdftocairo, pdftoppm) y Pillow + numpy.
Uso:  python tools/extraer-marca.py brand/PRESENTACION-REBRANDING.pdf
"""
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
NUM = re.compile(r"-?\d+(?:\.\d+)?")

# pagina del PDF y color de fondo de esa pagina
PAGE_LOGO, BG_LOGO = 1, (198, 130, 46)
PAGE_ELEMENTOS, BG_ELEMENTOS = 6, (216, 195, 158)

# recuadros de busqueda dentro de la pagina 6, en pixeles del render
RECUADROS = [
    ("granos", 60, 470, 40, 340),
    ("hojas", 1000, 1400, 40, 330),
    ("boina", 40, 480, 420, 760),
    ("flor", 980, 1420, 420, 780),
]


def bbox(d: str):
    v = [float(x) for x in NUM.findall(d)]
    return min(v[0::2]), min(v[1::2]), max(v[0::2]), max(v[1::2])


def render(pdf: Path, page: int, out: Path, dpi: int = 70) -> Image.Image:
    subprocess.run(["pdftoppm", "-jpeg", "-r", str(dpi), "-f", str(page), "-l", str(page),
                    str(pdf), str(out / "p")], check=True)
    return Image.open(next(out.glob("p-*.jpg"))).convert("RGB")


def to_svg(pdf: Path, page: int, out: Path) -> str:
    dst = out / f"page{page}.svg"
    subprocess.run(["pdftocairo", "-svg", "-f", str(page), "-l", str(page), str(pdf), str(dst)],
                   check=True)
    return dst.read_text(encoding="utf-8")


def main() -> None:
    pdf = Path(sys.argv[1] if len(sys.argv) > 1 else ROOT / "brand" / "PRESENTACION-REBRANDING.pdf")
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        img = render(pdf, PAGE_ELEMENTOS, tmp)
        escala = 1920 / img.size[0]
        mascara = np.abs(np.array(img).astype(int) - np.array(BG_ELEMENTOS)).sum(axis=2) > 55

        svg = to_svg(pdf, PAGE_ELEMENTOS, tmp)
        cuerpo = svg.split("</defs>", 1)[1].rsplit("</svg>", 1)[0]
        paths = re.findall(r"<path\b[^>]*?/>", cuerpo, re.S)
        cajas = [(bbox(re.search(r'\sd="([^"]*)"', p).group(1)), p) for p in paths]

        salida = ROOT / "assets" / "brand"
        salida.mkdir(parents=True, exist_ok=True)
        for nombre, x0, x1, y0, y1 in RECUADROS:
            ys, xs = np.where(mascara[y0:y1, x0:x1])
            X0, Y0 = (x0 + xs.min()) * escala, (y0 + ys.min()) * escala
            X1, Y1 = (x0 + xs.max()) * escala, (y0 + ys.max()) * escala
            dentro = [p for (a, b, c, d), p in cajas
                      if a >= X0 - 12 and b >= Y0 - 12 and c <= X1 + 12 and d <= Y1 + 12]
            doc = (f'<svg xmlns="http://www.w3.org/2000/svg" '
                   f'viewBox="{X0-4:.0f} {Y0-4:.0f} {X1-X0+8:.0f} {Y1-Y0+8:.0f}">'
                   + "".join(dentro) + "</svg>")
            doc = re.sub(r'fill="rgb\([^)]*\)"', 'fill="currentColor"', doc)
            (salida / f"icon-{nombre}.svg").write_text(doc, encoding="utf-8")
            print(f"icon-{nombre}.svg  {len(dentro)} paths")

    print("\nEl sprite src/sprite.svg se arma eligiendo paths de estos archivos; "
          "ver CLAUDE.md para la lista de ids.")


if __name__ == "__main__":
    main()
