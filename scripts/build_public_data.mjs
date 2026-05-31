import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const contentDir = path.join(root, "src", "content", "blog");
const publicDataDir = path.join(root, "public", "data");

const metricTopLevelKeys = [
  "daysToMaturityMax",
  "daysToMaturityMin",
  "firstYieldYearsMax",
  "firstYieldYearsMin",
  "spacingPlantFtMin",
  "spacingPlantFtMax",
  "spacingRowFtMin",
  "spacingRowFtMax",
  "spacingAreaSqFtMin",
  "spacingAreaSqFtMax",
  "plantsPer100SqFtMin",
  "plantsPer100SqFtMax",
  "matureHeightFtMin",
  "matureHeightFtMax",
  "matureSpreadFtMin",
  "matureSpreadFtMax",
  "outputMax",
  "outputMin",
  "difficultyScore",
  "reliabilityScore",
  "maintenanceScore",
  "multiUseScore",
  "dataConfidence",
  "dataMethod",
  "horizonKey",
  "horizonLabel",
  "riskLevel",
  "plantingDepthInMin",
  "plantingDepthInMax",
  "containerMinGallons",
  "containerSuitability",
  "deerResistance",
  "deerResistanceLabel",
  "deerResistanceConfidence",
  "deerResistanceNote",
  "deerResistanceSourceKeys",
  "jugloneTolerance",
  "jugloneToleranceLabel",
  "jugloneToleranceConfidence",
  "jugloneToleranceNote",
  "jugloneToleranceSourceKeys",
  "yieldLbsMin",
  "yieldLbsMax",
  "yieldLbsMethod",
  "sourceKeys",
  "lastReviewed"
];

const metricDisplayKeys = [
  "firstOutput",
  "fullOutput",
  "spacing",
  "plantingDepth",
  "plantingDepthNote",
  "containerMin",
  "containerNote",
  "deerResistance",
  "jugloneTolerance",
  "matureSize",
  "output",
  "yieldLbs",
  "tenYearYieldLbs",
  "lifespan",
  "harvestWindow",
  "difficulty",
  "reliability",
  "maintenance",
  "confidence"
];

function cleanValue(value) {
  return value === "Needs source" ? null : value;
}

async function readJson(file) {
  return JSON.parse(await readFile(path.join(dataDir, file), "utf8"));
}

async function writeJson(file, value) {
  await mkdir(publicDataDir, { recursive: true });
  await writeFile(path.join(publicDataDir, file), `${JSON.stringify(value)}\n`, "utf8");
}

function trimMetrics(metrics) {
  return Object.fromEntries(
    Object.entries(metrics).map(([id, metric]) => {
      const trimmed = {};
      metricTopLevelKeys.forEach((key) => {
        if (Object.hasOwn(metric, key)) trimmed[key] = cleanValue(metric[key]);
      });
      trimmed.display = Object.fromEntries(
        metricDisplayKeys.map((key) => [key, cleanValue(metric.display?.[key])])
      );
      return [id, trimmed];
    })
  );
}

function frontmatterValue(source, key) {
  const match = source.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  if (!match) return "";
  const raw = match[1].trim();
  if (raw.startsWith("[") && raw.endsWith("]")) {
    return raw
      .slice(1, -1)
      .split(",")
      .map((value) => value.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }
  return raw.replace(/^["']|["']$/g, "");
}

async function buildBlogSearchData() {
  const { readdir } = await import("node:fs/promises");
  const files = (await readdir(contentDir)).filter((file) => file.endsWith(".md"));
  return Promise.all(
    files.map(async (file) => {
      const source = await readFile(path.join(contentDir, file), "utf8");
      const slug = frontmatterValue(source, "slug") || file.replace(/\.md$/, "");
      const title = frontmatterValue(source, "title");
      const excerpt = frontmatterValue(source, "excerpt");
      const category = frontmatterValue(source, "category");
      const tags = frontmatterValue(source, "tags");
      const body = source.replace(/^---[\s\S]*?---/, "");
      const searchableText = [title, excerpt, category, Array.isArray(tags) ? tags.join(" ") : tags, body]
        .join(" ")
        .replace(/<[^>]*>/g, " ")
        .replace(/[#*_`>\-[\]()]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
      return { slug, searchableText };
    })
  );
}

const [plants, partners, plantArt, plantMetrics, plantRelationships, affiliateProducts] = await Promise.all([
  readJson("plants.json"),
  readJson("affiliatePartners.json"),
  readJson("plantArt.json"),
  readJson("plantMetrics.json"),
  readJson("plantRelationships.json"),
  readJson("affiliateProducts.json")
]);

await Promise.all([
  writeJson("plants.json", plants),
  writeJson("affiliate-partners.json", partners),
  writeJson("affiliate-products.json", affiliateProducts),
  writeJson("plant-art.json", plantArt),
  writeJson("plant-metrics-home.json", trimMetrics(plantMetrics)),
  writeJson("plant-relationships.json", plantRelationships),
  writeJson("blog-search.json", await buildBlogSearchData())
]);

console.log(`Built public data payloads for ${plants.length} plants.`);
