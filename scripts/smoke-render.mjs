// Quick smoke test: renders one meme per format with its baked-in
// example caption and writes the result to ./tmp-smoke/. Run with:
//   node scripts/smoke-render.mjs

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
process.chdir(path.resolve(__dirname, ".."));

const { memeFormats } = await import("../app/lib/meme-formats.js");
const { renderMeme, auditMemeBrandClearance } = await import("../app/lib/render.js");

const outDir = path.resolve(process.cwd(), "tmp-smoke");
await fs.mkdir(outDir, { recursive: true });

let okCount = 0;
let failCount = 0;
for (const fmt of memeFormats) {
  const example = (fmt.exampleCaptions || [])[0];
  if (!example) {
    console.warn(`[skip] ${fmt.id}: no example`);
    continue;
  }
  try {
    const violations = await auditMemeBrandClearance(fmt, example);
    if (violations.length) {
      throw new Error(
        `caption overlaps brand: ${violations.map((v) => v.zone).join(", ")}`
      );
    }
    const png = await renderMeme(fmt, example);
    const outPath = path.join(outDir, `${fmt.id}.png`);
    await fs.writeFile(outPath, png);
    console.log(`[ok] ${fmt.id} -> ${outPath} (${png.length} bytes)`);
    okCount++;
  } catch (e) {
    console.error(`[fail] ${fmt.id}: ${e.message}`);
    failCount++;
  }
}
console.log(`\nDone: ${okCount} ok, ${failCount} failed`);
