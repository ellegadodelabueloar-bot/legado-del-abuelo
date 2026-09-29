// Equivalente Node de build.py, para cuando no hay Python en el PATH.
// Uso: node tools/build.js
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");

function read(name) {
  return fs.readFileSync(path.join(SRC, name), "utf-8");
}

function main() {
  const title = read("title.txt").trim();
  const fonts = read("fonts.html").trim();
  const css = read("pattern-tile.css").replace(/\s+$/, "") + "\n\n" + read("styles.css").replace(/\s+$/, "");
  const sprite = read("sprite.svg").trim();
  const page = read("page.html").trim();
  const js = read("app.js").replace(/\s+$/, "");

  const inner = [
    `<title>${title}</title>`,
    fonts,
    "<style>\n" + css + "\n</style>",
    sprite,
    page,
    "<script>\n" + js + "\n</script>",
  ].join("\n");

  fs.writeFileSync(path.join(ROOT, "artifact.html"), inner + "\n", "utf-8");

  const headPart =
    '<!doctype html>\n<html lang="es">\n<head>\n' +
    '<meta charset="utf-8">\n' +
    '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' +
    "<style>\n" +
    ":root{color-scheme:light}\n" +
    "body{margin:0;font:14px system-ui}\n" +
    "img{max-width:100%}\n" +
    "[hidden]{display:none!important}\n" +
    "</style>\n";

  const doc =
    headPart +
    `<title>${title}</title>\n${fonts}\n<style>\n${css}\n</style>\n` +
    "</head>\n<body>\n" +
    sprite + "\n" + page + "\n" +
    "<script>\n" + js + "\n</script>\n" +
    "</body>\n</html>\n";

  fs.writeFileSync(path.join(ROOT, "index.html"), doc, "utf-8");

  console.log(`index.html     ${doc.length.toLocaleString()} bytes  (abrir en el navegador)`);
  console.log(`artifact.html  ${inner.length.toLocaleString()} bytes  (publicar con Artifact)`);
}

main();
