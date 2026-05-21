// One-off script to re-render a stored meme PNG using the current
// renderer + template files. Used after we fixed the four template
// images that had been swapped (grumpy-cat, side-eye-chloe, pepe,
// rickroll) so previously-saved meme share links display correctly.
//
// Usage:  node scripts/rerender-meme.mjs <id> [<id> ...]
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const { renderMeme } = await import(path.join(ROOT, "app/lib/render.js"));
const { getFormatById } = await import(path.join(ROOT, "app/lib/meme-formats.js"));

const ids = process.argv.slice(2);
if (ids.length === 0) {
  console.error("usage: node scripts/rerender-meme.mjs <id> [...]");
  process.exit(1);
}

for (const id of ids) {
  const jsonPath = path.join(ROOT, "data/memes", `${id}.json`);
  let record;
  try {
    record = JSON.parse(await fs.readFile(jsonPath, "utf8"));
  } catch (e) {
    console.error(`[skip] ${id}: ${e.message}`);
    continue;
  }
  const format = getFormatById(record.formatId);
  if (!format) {
    console.error(`[skip] ${id}: unknown formatId ${record.formatId}`);
    continue;
  }
  const buf = await renderMeme(format, record.captions);
  const pngPath = path.join(ROOT, "public/memes", `${id}.png`);
  await fs.writeFile(pngPath, buf);
  console.log(`[ok]   ${id}: ${format.name} (${buf.length} B)`);
}
