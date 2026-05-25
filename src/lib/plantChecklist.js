function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function paddedText(value) {
  const normalized = normalizeText(value);
  return normalized ? ` ${normalized} ` : " ";
}

function textHasTerm(text, term) {
  const normalizedTerm = normalizeText(term);
  if (!normalizedTerm) return false;
  if (text.includes(` ${normalizedTerm} `)) return true;
  if (normalizedTerm.includes(" ")) return false;
  return text.includes(` ${normalizedTerm}s `)
    || text.includes(` ${normalizedTerm}es `);
}

function textHasAnyTerm(text, terms = []) {
  return terms.some((term) => textHasTerm(text, term));
}

function listHasAny(list = [], values = []) {
  return values.some((value) => list.includes(value));
}

function ruleMatchesPlant(rule, plant, metrics, context) {
  if (rule.allPlants !== undefined && rule.allPlants !== true) return false;
  if (rule.goalsAny && !listHasAny(plant.goals ?? [], rule.goalsAny)) return false;
  if (rule.soilsAny && !listHasAny(plant.soils ?? [], rule.soilsAny)) return false;
  if (rule.sunAny && !listHasAny(plant.sun ?? [], rule.sunAny)) return false;
  if (rule.waterAny && !rule.waterAny.includes(plant.water)) return false;
  if (rule.containerSuitabilityAny && !rule.containerSuitabilityAny.includes(metrics.containerSuitability)) return false;
  if (rule.lifeCycleAny && !rule.lifeCycleAny.includes(metrics.lifeCycle)) return false;
  if (rule.outputKindAny && !rule.outputKindAny.includes(metrics.outputKind)) return false;
  if (rule.typeIncludes && !rule.typeIncludes.some((term) => context.type.includes(normalizeText(term)))) return false;
  if (rule.identityIncludes && !textHasAnyTerm(context.identity, rule.identityIncludes)) return false;
  if (rule.identityExcludes && textHasAnyTerm(context.identity, rule.identityExcludes)) return false;
  return true;
}

function checklistContext(plant) {
  const fields = [
    plant.id,
    plant.name,
    plant.query,
    plant.type,
    plant.notes,
    ...(plant.traits ?? []),
    ...(plant.goals ?? [])
  ];
  return {
    identity: paddedText(fields.join(" ")),
    type: normalizeText(plant.type)
  };
}

export function plantingChecklistForPlant(plant, metrics = {}, checklistItems = [], limit = 8) {
  const context = checklistContext(plant);
  const scoredItems = checklistItems
    .map((item, index) => {
      const score = Math.max(
        0,
        ...(item.rules ?? [])
          .filter((rule) => ruleMatchesPlant(rule, plant, metrics, context))
          .map((rule) => rule.score ?? 1)
      );
      return { ...item, score, index };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index);

  if (scoredItems.length >= limit) return scoredItems.slice(0, limit);

  const fallbackIds = ["soil-test-lab-mailer", "finished-compost", "organic-mulch", "watering-wand"];
  const existingIds = new Set(scoredItems.map((item) => item.id));
  const fallbackItems = fallbackIds
    .filter((id) => !existingIds.has(id))
    .map((id) => checklistItems.find((item) => item.id === id))
    .filter(Boolean)
    .map((item) => ({ ...item, score: 1, index: checklistItems.indexOf(item) }));

  return [...scoredItems, ...fallbackItems].slice(0, limit);
}
