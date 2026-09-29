#!/usr/bin/env python3
"""Arma los dos HTML finales a partir de src/.

  index.html     documento completo, para abrir localmente en el navegador
  artifact.html  fragmento sin <!doctype>/<html>/<head>/<body>, que es lo que
                 espera la herramienta Artifact de Claude al publicar

Uso:  python tools/build.py
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"


def read(name: str) -> str:
    return (SRC / name).read_text(encoding="utf-8")


def main() -> None:
    title = read("title.txt").strip()
    fonts = read("fonts.html").strip()
    css = read("pattern-tile.css").rstrip() + "\n\n" + read("styles.css").rstrip()
    sprite = read("sprite.svg").strip()
    page = read("page.html").strip()
    js = read("app.js").rstrip()

    inner = "\n".join([
        f"<title>{title}</title>",
        fonts,
        "<style>\n" + css + "\n</style>",
        sprite,
        page,
        "<script>\n" + js + "\n</script>",
    ])

    (ROOT / "artifact.html").write_text(inner + "\n", encoding="utf-8")

    doc = (
        '<!doctype html>\n<html lang="es">\n<head>\n'
        '<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
        "<style>\n"
        ":root{color-scheme:light}\n"
        "body{margin:0;font:14px system-ui}\n"
        "img{max-width:100%}\n"
        "[hidden]{display:none!important}\n"
        "</style>\n"
        + inner
        + "\n</head>\n<body>\n</body>\n</html>\n"
    )
    # el contenido va en el body, no en el head
    head_end = doc.index(f"<title>{title}</title>")
    head_part = doc[:head_end]
    doc = (
        head_part
        + f"<title>{title}</title>\n{fonts}\n<style>\n{css}\n</style>\n"
        + "</head>\n<body>\n"
        + sprite + "\n" + page + "\n"
        + "<script>\n" + js + "\n</script>\n"
        + "</body>\n</html>\n"
    )
    (ROOT / "index.html").write_text(doc, encoding="utf-8")

    print(f"index.html     {len(doc):>8,} bytes  (abrir en el navegador)")
    print(f"artifact.html  {len(inner):>8,} bytes  (publicar con Artifact)")


if __name__ == "__main__":
    main()
