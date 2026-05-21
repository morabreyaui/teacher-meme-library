#!/usr/bin/env node
// Regenerate gallery PNGs for every remixable item using the SAME
// render pipeline the live customize flow uses.
//
// Why this script exists
// ──────────────────────
// Until this commit, gallery PNGs were AI-generated images with text
// baked into the pixels. The customize flow, however, renders text as
// an SVG overlay on top of the canonical blank template (e.g.
// pam-same-picture.jpg). So a teacher could click "Customize this
// template" on a single-panel Pam preview and get back a 2-panel
// "Corporate needs you..." render — visually the same meme template
// in spirit, but a startlingly different image in practice. That's
// exactly the bug the user flagged ("intenté customizar la tercera
// foto y se generó algo nada que ver").
//
// Fix: make the gallery preview be a literal render from the live
// pipeline. What you see in the gallery is byte-for-byte what you
// get back when you customize. No surprises.
//
// Gallery-only items (remixFormatId === null) are skipped; those
// have no customize affordance and continue to use their AI-generated
// PNG via the existing build-gallery.mjs pipeline.

import path from "node:path";
import { promises as fs } from "node:fs";
import { galleryItems, gallerySourceMap } from "../app/lib/gallery.js";
import { getFormatById } from "../app/lib/meme-formats.js";
import { renderMeme } from "../app/lib/render.js";

const projectRoot = path.resolve(import.meta.dirname || ".", "..");
const outDir = path.join(projectRoot, "public", "gallery");
const assetsDir = path.resolve(
  projectRoot,
  "../../.cursor/projects/Users-morabreyaui-Code-teacher-meme-generator/assets"
);

// gallerySourceMap goes assets-name -> public-name. Invert it so we
// can look up the clean AI source by the public filename.
const reverseSourceMap = Object.fromEntries(
  Object.entries(gallerySourceMap).map(([src, out]) => [out, src])
);

// For gallery-derived formats (file lives under /gallery/), we MUST
// render from the original clean AI image in assets/, NOT from the
// previously-rendered PNG in public/gallery/. Otherwise every
// rerender stacks a fresh watermark on top of the old one (the user
// saw this on anakin-padme: two LoL logos). When a clean source
// exists, we copy it over public/gallery/ first so the renderer
// (which always reads format.file) picks up the clean bytes.
async function resetGallerySourceIfNeeded(item) {
  if (!item.file?.startsWith("/gallery/")) return;
  const publicName = item.file.replace(/^\/gallery\//, "");
  const srcName = reverseSourceMap[publicName];
  if (!srcName) return; // No clean source mapping — leave as-is.
  const srcPath = path.join(assetsDir, srcName);
  const dstPath = path.join(outDir, publicName);
  try {
    await fs.access(srcPath);
  } catch {
    return; // Source not present on this machine — skip silently.
  }
  await fs.copyFile(srcPath, dstPath);
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  const results = [];
  for (const item of galleryItems) {
    if (!item.remixFormatId || !item.captions) {
      results.push({ id: item.id, skipped: true, reason: "gallery-only" });
      continue;
    }
    const format = getFormatById(item.remixFormatId);
    if (!format) {
      results.push({ id: item.id, skipped: true, reason: "unknown format" });
      continue;
    }
    // Gallery cards keep the curated AI art (watermarked by
    // build-gallery.mjs). Pipeline renders use blank templates via
    // format.renderFile — overwriting public/gallery/ would replace
    // that art with imgflip blanks + black caption bands.
    if (format.file?.startsWith("/gallery/")) {
      results.push({ id: item.id, skipped: true, reason: "gallery-ai-preview" });
      continue;
    }
    try {
      await resetGallerySourceIfNeeded(item);
      const buf = await renderMeme(format, item.captions);
      const outPath = path.join(
        outDir,
        item.file.replace(/^\/gallery\//, "")
      );
      await fs.writeFile(outPath, buf);
      results.push({ id: item.id, ok: true, bytes: buf.length, outPath });
      console.log(`[ok] ${item.id} ${format.id} -> ${outPath} (${buf.length} B)`);
    } catch (err) {
      results.push({ id: item.id, ok: false, error: err.message });
      console.error(`[fail] ${item.id} ${format.id}: ${err.message}`);
    }
  }

  const ok = results.filter((r) => r.ok).length;
  const skipped = results.filter((r) => r.skipped).length;
  const fail = results.length - ok - skipped;
  console.log(`\nRerender done: ${ok} rendered, ${skipped} skipped, ${fail} failed`);
  if (fail > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
