#!/usr/bin/env python3
"""Recorta el fondo blanco de las fotos de los frascos.

Pasos: saca el marco oscuro de la foto, marca como fondo el blanco conectado al
borde, limita la silueta al ancho del cuerpo del frasco (asi se va la sombra que
se abre sobre la mesa) y descarta las filas de abajo que son solo sombra.

Uso:  python tools/cutout-frascos.py
Entrada:  brand/foto-original-<variedad>.png
Salida:   assets/jars/<variedad>.png
"""
from PIL import Image, ImageFilter
import numpy as np
from scipy import ndimage

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VARIEDADES = ["honey", "picante", "suave"]
SRC = {v: ROOT / "brand" / f"foto-original-{v}.png" for v in VARIEDADES}
DST = ROOT / "assets" / "jars"
DST.mkdir(parents=True, exist_ok=True)
THR = 232

def crop_border(a):
    g = a.mean(axis=2); dark = g < 60
    r = np.where(dark.mean(axis=1) < .5)[0]; c = np.where(dark.mean(axis=0) < .5)[0]
    return a[r.min():r.max()+1, c.min():c.max()+1]

def fill_small_holes(fg, maxsize):
    lab, n = ndimage.label(~fg)
    bids = set(lab[0,:]) | set(lab[-1,:]) | set(lab[:,0]) | set(lab[:,-1])
    out = fg.copy()
    for i in range(1, n+1):
        if i in bids: continue
        m = lab == i
        if m.sum() <= maxsize: out |= m
    return out

for name, path in SRC.items():
    im = Image.open(path).convert("RGB")
    a = crop_border(np.array(im)); g = a.mean(axis=2); H, W, _ = a.shape

    lab, n = ndimage.label(g > THR)
    bids = set(lab[0,:]) | set(lab[-1,:]) | set(lab[:,0]) | set(lab[:,-1]); bids.discard(0)
    fg = ~np.isin(lab, list(bids))
    l2, n2 = ndimage.label(fg)
    if n2 > 1:
        fg = l2 == (np.argmax(ndimage.sum(fg, l2, range(1, n2+1)))+1)

    # jar silhouette x-range from the body rows (excludes ground shadow spread)
    body = fg[int(H*.20):int(H*.72)]
    xs = np.where(body.any(axis=0))[0]
    lo, hi = max(xs.min()-2, 0), min(xs.max()+3, W)
    fg[:, :lo] = False; fg[:, hi:] = False

    # trim bottom rows that are pure soft shadow (no genuinely dark pixel)
    for y in range(H-1, 0, -1):
        m = fg[y]
        if m.any() and g[y][m].min() < 165: break
        fg[y] = False

    fg = fill_small_holes(fg, 6000)
    alpha = np.array(Image.fromarray((fg*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7)))
    img = Image.fromarray(np.dstack([a, alpha]).astype(np.uint8), "RGBA")
    img = img.crop(img.getbbox())
    img.save(DST / f"{name}.png")
    print(name, img.size)
