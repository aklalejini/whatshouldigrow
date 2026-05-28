import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const photoMetadataPath = path.join(root, "src", "data", "plantPhotos.json");
const photos = JSON.parse(await readFile(photoMetadataPath, "utf8"));
const canonicalByHash = new Map();
let rewrites = 0;

async function hashPublicFile(src) {
  const file = path.join(publicDir, src.replace(/^\//, ""));
  if (!existsSync(file)) return null;
  const buffer = await readFile(file);
  return createHash("sha256").update(buffer).digest("hex");
}

function canonicalRank(src) {
  if (/\/primary\./.test(src)) return 0;
  return 1;
}

for (const entry of photos) {
  const photo = entry.primary;
  if (!photo?.src) continue;
  const hash = await hashPublicFile(photo.src);
  if (!hash) continue;
  const current = canonicalByHash.get(hash);
  if (!current || canonicalRank(photo.src) < canonicalRank(current)) {
    canonicalByHash.set(hash, photo.src);
  }
}

for (const entry of photos) {
  const photo = entry.primary;
  if (!photo?.src) continue;
  const hash = await hashPublicFile(photo.src);
  const canonical = hash ? canonicalByHash.get(hash) : null;
  if (canonical && canonical !== photo.src) {
    photo.src = canonical;
    rewrites += 1;
  }
}

await writeFile(photoMetadataPath, `${JSON.stringify(photos, null, 2)}\n`, "utf8");
console.log(`Reused canonical URLs for ${rewrites} duplicate primary plant photos.`);
