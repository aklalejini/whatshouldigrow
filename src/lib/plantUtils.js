export const goalLabels = {
  fruit: "Fruit",
  "vegetables-herbs": "Vegetables & herbs",
  "pollinators-wildlife": "Pollinators & wildlife",
  "curb-appeal": "Curb appeal & color",
  "privacy-screening": "Privacy & screening",
  "low-maintenance-natives": "Native plants"
};

export const relationshipTypeLabels = {
  companion: "Companion",
  guild: "Plant guild",
  understory: "Understory",
  pollination: "Pollination",
  succession: "Succession"
};

export function plantUrl(plantOrId) {
  const id = typeof plantOrId === "string" ? plantOrId : plantOrId.id;
  return `/plants/${id}/`;
}

export function isSourcedValue(value) {
  return value !== null
    && value !== undefined
    && value !== ""
    && value !== "Needs source";
}

export function formatList(values = []) {
  return values.map((value) => value.replaceAll("-", " ")).join(", ");
}

export function formatGoal(value) {
  return goalLabels[value] ?? value.replaceAll("-", " ");
}

export function formatGoalList(values = []) {
  return values.map(formatGoal).join(", ");
}

export function sentenceCase(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

export function plantKind(plant) {
  const type = plant.type.toLowerCase();
  if (type.includes("flower") || type.includes("herb") || type.includes("grass")) return "bloom";
  if (type.includes("vegetable")) return "vegetable";
  if (type.includes("vine")) return "vine";
  if (type.includes("shrub") || type.includes("cane")) return "shrub";
  return "fruit";
}

export function plantIdentity(plant) {
  return `${plant.id} ${plant.name} ${plant.query ?? ""}`.toLowerCase();
}

function cssUrl(value) {
  return String(value ?? "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function versionedPhotoSrc(photo) {
  if (!photo?.src || photo.bytes === undefined || photo.bytes === null || photo.bytes === "") return photo?.src ?? "";
  const separator = photo.src.includes("?") ? "&" : "?";
  return `${photo.src}${separator}v=${encodeURIComponent(String(photo.bytes))}`;
}

export function plantPrimaryPhotoEntry(plant, plantPhotoEntries) {
  return plantPhotoEntries.find((entry) => entry.id === plant.id) ?? null;
}

export function plantRealPhotoStyle(entry) {
  const photo = entry?.primary ?? entry;
  if (!photo?.src) return "";
  return [
    `--plant-photo: url('${cssUrl(versionedPhotoSrc(photo))}')`,
    photo.position ? `--photo-position: ${photo.position}` : ""
  ].filter(Boolean).join("; ");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function relationshipIdentity(plant) {
  return `${plant.id} ${plant.name} ${plant.query ?? ""} ${plant.type}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function termMatchesIdentity(identity, term) {
  const normalizedTerm = String(term).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  if (!normalizedTerm) return false;
  return new RegExp(`(^|\\s)${escapeRegExp(normalizedTerm)}(\\s|$)`).test(identity);
}

export function matchesRelationshipTerms(plant, terms = [], excludes = []) {
  if (!terms.length) return false;
  const identity = relationshipIdentity(plant);
  return terms.some((term) => termMatchesIdentity(identity, term))
    && !excludes.some((term) => termMatchesIdentity(identity, term));
}

export function relatedPlantsForRelationship(plant, relationship, allPlants) {
  const related = new Map();
  if (relationship.plantMatch?.length) {
    if (!matchesRelationshipTerms(plant, relationship.plantMatch, relationship.plantExclude ?? [])) return [];
    allPlants.forEach((candidate) => {
      if (candidate.id !== plant.id && matchesRelationshipTerms(candidate, relationship.plantMatch, relationship.plantExclude ?? [])) {
        related.set(candidate.id, candidate);
      }
    });
    return Array.from(related.values());
  }

  const isSource = matchesRelationshipTerms(plant, relationship.sourceMatch ?? [], relationship.sourceExclude ?? []);
  const isTarget = matchesRelationshipTerms(plant, relationship.targetMatch ?? [], relationship.targetExclude ?? []);
  allPlants.forEach((candidate) => {
    if (candidate.id === plant.id) return;
    if (isSource && matchesRelationshipTerms(candidate, relationship.targetMatch ?? [], relationship.targetExclude ?? [])) {
      related.set(candidate.id, candidate);
    }
    if (isTarget && matchesRelationshipTerms(candidate, relationship.sourceMatch ?? [], relationship.sourceExclude ?? [])) {
      related.set(candidate.id, candidate);
    }
  });
  return Array.from(related.values());
}

export function relationshipEntriesForPlant(plant, relationships, allPlants) {
  return relationships
    .map((relationship) => ({
      relationship,
      relatedPlants: relatedPlantsForRelationship(plant, relationship, allPlants)
    }))
    .filter((entry) => entry.relatedPlants.length > 0);
}
