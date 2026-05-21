#!/usr/bin/env node
// Scan all baked-in captions (gallery + meme formats) against the
// local blocklist. Run: node scripts/audit-safety.mjs

import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(root);

const { galleryItems } = await import("../app/lib/gallery.js");
const { memeFormats } = await import("../app/lib/meme-formats.js");
const { findBlockedTerm } = await import("../app/lib/blocklist.js");

const issues = [];

function scan(label, captions) {
  const flat = Object.values(captions || {})
    .filter((v) => typeof v === "string")
    .join("\n");
  const hit = findBlockedTerm(flat);
  if (hit) issues.push({ label, hit, captions });
}

for (const item of galleryItems) {
  if (item.captions) scan(`gallery:${item.id}`, item.captions);
  if (item.captionPreview) {
    const hit = findBlockedTerm(item.captionPreview);
    if (hit) issues.push({ label: `gallery-preview:${item.id}`, hit });
  }
}

for (const fmt of memeFormats) {
  for (const ex of fmt.exampleCaptions || []) {
    scan(`format:${fmt.id}`, ex);
  }
}

if (issues.length === 0) {
  console.log("Safety audit passed — no blocklist hits in curated captions.");
  process.exit(0);
}

console.error(`Safety audit failed — ${issues.length} issue(s):`);
for (const i of issues) {
  console.error(`  - ${i.label}: blocked term "${i.hit}"`);
}
process.exit(1);
