import { mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const publicDir = path.join(root, "public");
const optimizedDir = path.join(publicDir, "optimized");
const plantPhotos = JSON.parse(await readFile(path.join(root, "src", "data", "plantPhotos.json"), "utf8"));

const imageJobs = new Map();

function publicPathToFile(src) {
  return path.join(publicDir, src.replace(/^\//, ""));
}

function optimizedPathFor(src, width, format) {
  const clean = src.replace(/^\//, "").replace(/\.[^.]+$/, `-${width}.${format}`);
  return path.join(optimizedDir, clean);
}

function addJob(src, widths) {
  if (!src || !existsSync(publicPathToFile(src))) return;
  const key = src;
  const existing = imageJobs.get(key);
  imageJobs.set(key, existing ? Array.from(new Set([...existing, ...widths])).sort((a, b) => a - b) : widths);
}

plantPhotos.forEach((entry) => {
  addJob(entry.primary?.src, [480, 800, 1200]);
  (entry.details ?? []).forEach((photo) => addJob(photo.src, [480, 800, 1200]));
});

[
  "/blog/struggling-blueberry-hero.jpg",
  "/blog/right-plant-right-place-hero.jpg",
  "/blog/garden-pests-hero.jpg",
  "/blog/garden-pest-squash-bugs.jpg",
  "/blog/garden-pest-slugs.jpg",
  "/blog/garden-pest-japanese-beetle-damage.jpg",
  "/blog/garden-pest-cucumber-beetles.jpg",
  "/blog/garden-pest-cabbage-worms.jpg",
  "/blog/garden-pest-aphids.jpg",
  "/blog/garden-beds-hero.jpg",
  "/blog/heat-tolerant-plants-hero.jpg",
  "/blog/fruit-tree-apple-hero.jpg",
  "/blog/drip-irrigation-hero.jpg",
  "/blog/zone-6-starter-kit-hero.png",
  "/blog/zone-7-starter-kit-hero.jpg"
].forEach((src) => addJob(src, [640, 1200, 1600]));

addJob("/maps/usda-plant-hardiness-all-states-hillshade.png", [1200, 2000, 3000]);

let created = 0;
let skipped = 0;

for (const [src, widths] of imageJobs) {
  const sourceFile = publicPathToFile(src);
  const source = sharp(sourceFile, { failOn: "none" }).rotate();
  const metadata = await source.metadata();
  for (const width of widths) {
    for (const format of ["avif", "webp"]) {
      const target = optimizedPathFor(src, width, format);
      if (existsSync(target)) {
        skipped += 1;
        continue;
      }
      await mkdir(path.dirname(target), { recursive: true });
      const pipeline = sharp(sourceFile, { failOn: "none" }).rotate().resize({
        width: Math.min(width, metadata.width ?? width),
        withoutEnlargement: true
      });
      if (format === "avif") {
        await pipeline.avif({ quality: 48, effort: 4 }).toFile(target);
      } else {
        await pipeline.webp({ quality: 78, effort: 4 }).toFile(target);
      }
      created += 1;
    }
  }
}

console.log(`Optimized ${imageJobs.size} source images. Created ${created}, skipped ${skipped}.`);
