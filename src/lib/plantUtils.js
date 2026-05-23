export const goalLabels = {
  fruit: "Fruit",
  "vegetables-herbs": "Vegetables & herbs",
  "pollinators-wildlife": "Pollinators & wildlife",
  "curb-appeal": "Curb appeal & color",
  "privacy-screening": "Privacy & screening",
  "low-maintenance-natives": "Low-maintenance natives"
};

export const relationshipTypeLabels = {
  companion: "Companion",
  guild: "Plant guild",
  understory: "Understory"
};

export function plantUrl(plantOrId) {
  const id = typeof plantOrId === "string" ? plantOrId : plantOrId.id;
  return `/plants/${id}/`;
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

export function matchesArtEntry(identity, entry) {
  const matches = entry.match ?? [];
  const excludes = entry.exclude ?? [];
  return matches.some((term) => identity.includes(term.toLowerCase()))
    && !excludes.some((term) => identity.includes(term.toLowerCase()));
}

export function genericArt(plant) {
  const type = plant.type.toLowerCase();
  if (type.includes("flower") || type.includes("herb") || type.includes("grass") || type.includes("ornamental")) return "generic-flower-herb";
  if (type.includes("vegetable")) return "generic-vegetable";
  if (type.includes("vine")) return "generic-vine";
  if (type.includes("tree")) return "generic-tree";
  return "generic-fruit";
}

export function plantArtEntry(plant, plantArtEntries) {
  const plantArtById = Object.fromEntries(plantArtEntries.map((entry) => [entry.id, entry]));
  const identity = plantIdentity(plant);
  return plantArtEntries.find((entry) => matchesArtEntry(identity, entry))
    ?? plantArtById[genericArt(plant)]
    ?? null;
}

export function plantPhotoStyle(entry) {
  if (!entry?.image) return "";
  return [
    `--plant-photo: url('/plant-art/${entry.image}')`,
    entry.position ? `--photo-position: ${entry.position}` : "",
    entry.plateBg ? `--plate-bg: ${entry.plateBg}` : ""
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
