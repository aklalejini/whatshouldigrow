import { createHash } from "node:crypto";
import { existsSync, statSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const dataDir = path.join(root, "src", "data");
const requiredPublicDataFiles = [
  "plants.json",
  "affiliate-partners.json",
  "plant-art.json",
  "plant-photos.json",
  "plant-metrics-home.json",
  "plant-relationships.json",
  "blog-search.json"
];
const requiredVendorFiles = [
  "vendor/leaflet/leaflet.css",
  "vendor/leaflet/leaflet.js",
  "vendor/leaflet/images/layers.png",
  "vendor/leaflet/images/layers-2x.png",
  "vendor/leaflet/images/marker-icon.png",
  "vendor/leaflet/images/marker-icon-2x.png",
  "vendor/leaflet/images/marker-shadow.png",
  "vendor/leaflet-vectorgrid/Leaflet.VectorGrid.bundled.js",
  "vendor/esri-leaflet/esri-leaflet.js"
];

const failures = [];
const warnings = [];

async function readJson(file) {
  return JSON.parse(await readFile(path.join(dataDir, file), "utf8"));
}

function publicFile(src) {
  return path.join(publicDir, src.replace(/^\//, ""));
}

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function warn(condition, message) {
  if (!condition) warnings.push(message);
}

function optimizedUrl(src, width, format) {
  return `/optimized/${src.replace(/^\//, "").replace(/\.[^.]+$/, `-${width}.${format}`)}`;
}

const [plants, photos, metrics, art, partners] = await Promise.all([
  readJson("plants.json"),
  readJson("plantPhotos.json"),
  readJson("plantMetrics.json"),
  readJson("plantArt.json"),
  readJson("affiliatePartners.json")
]);

const plantIds = new Set();
plants.forEach((plant) => {
  expect(plant.id, "Plant record missing id");
  expect(!plantIds.has(plant.id), `Duplicate plant id: ${plant.id}`);
  plantIds.add(plant.id);
  expect(metrics[plant.id], `Missing metric record for ${plant.id}`);
  expect(!plant.partner || partners[plant.partner], `Missing partner "${plant.partner}" for ${plant.id}`);
});

const photoById = new Map(photos.map((entry) => [entry.id, entry]));
plants.forEach((plant) => {
  const entry = photoById.get(plant.id);
  expect(entry, `Missing photo metadata for ${plant.id}`);
  if (!entry) return;
  expect(entry.primary?.src, `Missing primary photo src for ${plant.id}`);
  expect(existsSync(publicFile(entry.primary.src)), `Missing primary photo file for ${plant.id}: ${entry.primary.src}`);
  [480, 800, 1200].forEach((width) => {
    ["avif", "webp"].forEach((format) => {
      expect(existsSync(publicFile(optimizedUrl(entry.primary.src, width, format))), `Missing optimized ${format} ${width} for ${plant.id}`);
    });
  });
});

art.forEach((entry) => {
  expect(entry.id, "Plant art entry missing id");
  if (entry.image) expect(existsSync(publicFile(`/plant-art/${entry.image}`)), `Missing plant art file: ${entry.image}`);
});

const csvPath = path.join(publicDir, "exports", "plants.csv");
expect(existsSync(csvPath), "Missing public CSV export");
if (existsSync(csvPath)) {
  const csv = await readFile(csvPath, "utf8");
  const rowCount = csv.trim().split(/\r?\n/).length - 1;
  expect(rowCount === plants.length, `CSV row count ${rowCount} does not match plant count ${plants.length}`);
}

for (const file of requiredPublicDataFiles) {
  expect(existsSync(path.join(publicDir, "data", file)), `Missing public data payload: ${file}`);
}

for (const file of requiredVendorFiles) {
  expect(existsSync(path.join(publicDir, file)), `Missing self-hosted vendor asset: ${file}`);
}

let largestPhoto = { file: "", size: 0 };
const photoRoot = path.join(publicDir, "plant-photos");
for (const dir of await readdir(photoRoot)) {
  const primary = path.join(photoRoot, dir, "primary.jpg");
  if (!existsSync(primary)) continue;
  const size = statSync(primary).size;
  if (size > largestPhoto.size) largestPhoto = { file: primary, size };
}
warn(largestPhoto.size < 3 * 1024 * 1024, `Largest plant photo exceeds 3 MB: ${largestPhoto.file}`);

const duplicateHashes = new Map();
for (const entry of photos) {
  if (!entry.primary?.src || !existsSync(publicFile(entry.primary.src))) continue;
  const hash = createHash("sha256").update(await readFile(publicFile(entry.primary.src))).digest("hex");
  const list = duplicateHashes.get(hash) ?? [];
  list.push(entry.primary.src);
  duplicateHashes.set(hash, list);
}
const duplicateReferencedGroups = [...duplicateHashes.values()].filter((list) => new Set(list).size > 1);
warn(duplicateReferencedGroups.length === 0, `${duplicateReferencedGroups.length} duplicate primary photo URL groups are still referenced`);

if (warnings.length) {
  console.warn("Warnings:");
  warnings.forEach((message) => console.warn(`- ${message}`));
}

if (failures.length) {
  console.error("Validation failed:");
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`Validation passed: ${plants.length} plants, ${photos.length} photo records, ${Object.keys(metrics).length} metric records.`);
