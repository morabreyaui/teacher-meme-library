#!/usr/bin/env node
// Build zone-erased blank templates for every remixable gallery item,
// then regenerate gallery PNGs from those blanks so customize matches
// the card preview (Impact typography, no baked-caption ghosts).

import path from "node:path";
import { promises as fs } from "node:fs";
import { galleryItems, gallerySourceMap } from "../app/lib/gallery.js";
import { getFormatById } from "../app/lib/meme-formats.js";
import {
  buildGalleryBlankTemplate,
  galleryBlankRelPath,
  GALLERY_BLANK_OVERRIDES,
  renderMeme,
} from "../app/lib/render.js";

const projectRoot = path.resolve(import.meta.dirname || ".", "..");
const galleryDir = path.join(projectRoot, "public", "gallery");
const blanksDir = path.join(projectRoot, "public", "templates-meme", "gallery-blanks");
const assetsDir = path.resolve(
  projectRoot,
  "../../.cursor/projects/Users-morabreyaui-Code-teacher-meme-generator/assets"
);

const reverseSourceMap = Object.fromEntries(
  Object.entries(gallerySourceMap).map(([src, out]) => [out, src])
);

async function readGallerySource(item) {
  const publicName = item.file.replace(/^\/gallery\//, "");
  const srcName = reverseSourceMap[publicName];
  if (srcName) {
    const assetPath = path.join(assetsDir, srcName);
    try {
      return await fs.readFile(assetPath);
    } catch {
      /* fall through */
    }
  }
  // Prefer a clean on-disk source; never derive blanks from a previously
  // regenerated gallery card (that creates a corruption feedback loop).
  return fs.readFile(path.join(galleryDir, publicName));
}

async function main() {
  await fs.mkdir(blanksDir, { recursive: true });
  const remixable = galleryItems.filter((i) => i.remixFormatId && i.captions);
  let blanksOk = 0;
  let blanksFail = 0;
  let cardsOk = 0;
  let cardsFail = 0;

  for (const item of remixable) {
    const format = getFormatById(item.remixFormatId);
    if (!format) {
      console.warn(`[skip] ${item.id}: unknown format ${item.remixFormatId}`);
      continue;
    }

    const override = GALLERY_BLANK_OVERRIDES[item.file];
    if (override) {
      console.log(`[skip-blank] ${item.id}: uses override ${override}`);
    } else {
      try {
        const srcBuf = await readGallerySource(item);
        const blankBuf = await buildGalleryBlankTemplate(srcBuf, format);
        const rel = galleryBlankRelPath(item.file);
        const outPath = path.join(projectRoot, "public", rel.replace(/^\//, ""));
        await fs.writeFile(outPath, blankBuf);
        blanksOk++;
        console.log(`[blank] ${item.id} -> ${rel} (${blankBuf.length} B)`);
      } catch (err) {
        blanksFail++;
        console.error(`[blank-fail] ${item.id}: ${err.message}`);
      }
    }

    try {
      const cardBuf = await renderMeme(format, item.captions, {
        sourceFile: item.file,
        galleryCard: true,
      });
      const outPath = path.join(
        galleryDir,
        item.file.replace(/^\/gallery\//, "")
      );
      await fs.writeFile(outPath, cardBuf);
      cardsOk++;
      console.log(`[card] ${item.id} -> ${outPath} (${cardBuf.length} B)`);
    } catch (err) {
      cardsFail++;
      console.error(`[card-fail] ${item.id}: ${err.message}`);
    }
  }

  console.log(
    `\nDone: ${blanksOk} blanks, ${cardsOk} cards (${blanksFail + cardsFail} failed)`
  );
  if (blanksFail + cardsFail > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
