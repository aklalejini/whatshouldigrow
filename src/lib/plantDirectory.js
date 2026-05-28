import { formatGoal, goalLabels, isSourcedValue, plantUrl, sentenceCase } from "./plantUtils.js";

export const DIRECTORY_ZONES = Array.from({ length: 10 }, (_, index) => index + 2)
  .flatMap((zone) => ["a", "b"].map((suffix) => `${zone}${suffix}`));

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function zoneToNumber(zone) {
  const match = String(zone).trim().toLowerCase().match(/^(\d{1,2})([ab])$/);
  if (!match) return Number.NaN;
  return Number(match[1]) + (match[2] === "b" ? 0.5 : 0);
}

export function plantFitsZone(plant, zone) {
  const target = zoneToNumber(zone);
  const min = zoneToNumber(plant.zones?.[0]);
  const max = zoneToNumber(plant.zones?.[1]);
  return Number.isFinite(target) && Number.isFinite(min) && Number.isFinite(max) && target >= min && target <= max;
}

function scorePlantForDirectory(plant, metrics = {}) {
  let score = 0;
  if (isSourcedValue(metrics.display?.firstOutput)) score += 12;
  if (isSourcedValue(metrics.display?.yieldLbs)) score += 10;
  if (isSourcedValue(metrics.display?.spacing)) score += 8;
  if (isSourcedValue(metrics.display?.containerMin)) score += 4;
  score += Math.min(plant.traits?.length ?? 0, 5);
  score += Math.min(plant.goals?.length ?? 0, 4);
  return score;
}

export function directoryEntries(plants, plantMetrics, filter) {
  return plants
    .filter(filter)
    .map((plant) => ({
      plant,
      metrics: plantMetrics[plant.id] ?? {},
      score: scorePlantForDirectory(plant, plantMetrics[plant.id] ?? {})
    }))
    .sort((a, b) => b.score - a.score || a.plant.name.localeCompare(b.plant.name));
}

export function typeGroups(plants) {
  return Array.from(
    plants.reduce((groups, plant) => {
      const slug = slugify(plant.type);
      const group = groups.get(slug) ?? { slug, label: sentenceCase(plant.type), count: 0 };
      group.count += 1;
      groups.set(slug, group);
      return groups;
    }, new Map()).values()
  ).sort((a, b) => a.label.localeCompare(b.label));
}

export function goalGroups(plants) {
  return Object.entries(goalLabels)
    .map(([goal, label]) => ({
      slug: goal,
      label: formatGoal(goal),
      count: plants.filter((plant) => plant.goals.includes(goal)).length
    }))
    .filter((group) => group.count > 0)
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function zoneGroups(plants) {
  return DIRECTORY_ZONES.map((zone) => ({
    slug: `zone-${zone}`,
    zone,
    label: `Zone ${zone}`,
    count: plants.filter((plant) => plantFitsZone(plant, zone)).length
  })).filter((group) => group.count > 0);
}

export function typeBySlug(plants, slug) {
  return typeGroups(plants).find((group) => group.slug === slug);
}

export function goalBySlug(plants, slug) {
  return goalGroups(plants).find((group) => group.slug === slug);
}

export function zoneBySlug(plants, slug) {
  return zoneGroups(plants).find((group) => group.slug === slug);
}

export function itemListJsonLd(entries, siteUrl) {
  return entries.slice(0, 100).map(({ plant }, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: plant.name,
    url: siteUrl(plantUrl(plant))
  }));
}
