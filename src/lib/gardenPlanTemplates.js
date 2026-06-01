import { isSourcedValue, plantUrl } from "./plantUtils.js";

export const GARDEN_PLAN_TEMPLATES = [
  {
    slug: "zone-7-4x8-vegetable-garden",
    path: "/garden-plans/zone-7-4x8-vegetable-garden/",
    shortTitle: "Zone 7 4x8 vegetable bed",
    title: "Zone 7 4x8 Vegetable Garden Plan",
    eyebrow: "Raised bed template",
    description: "A practical 4x8 raised-bed vegetable garden template for Zone 7, with warm-season anchors, herbs, and quick greens.",
    summary: "Use this as a starter layout for one full-sun 4x8 bed. It is intentionally compact, with tomatoes and cucumbers treated as supported crops.",
    settings: {
      zone: "7b",
      bedLength: 8,
      bedWidth: 4,
      bedCount: 1,
      sun: "full",
      soil: "loam",
      water: "medium",
      mode: "in-ground",
      deerPressure: "ignore",
      walnut: "ignore"
    },
    plants: [
      { id: "black-krim-tomato", quantity: 1, role: "Main summer crop" },
      { id: "banana-pepper", quantity: 2, role: "Long-season producer" },
      { id: "marketmore-cucumber", quantity: 1, role: "Trellis crop" },
      { id: "genovese-basil", quantity: 3, role: "Herb layer" },
      { id: "bloomsdale-spinach", quantity: 4, role: "Cool-season shoulder crop" }
    ],
    layout: {
      "black-krim-tomato__1": { x: 22, y: 50 },
      "banana-pepper__1": { x: 44, y: 35 },
      "banana-pepper__2": { x: 44, y: 67 },
      "marketmore-cucumber__1": { x: 76, y: 50 },
      "genovese-basil__1": { x: 25, y: 22 },
      "genovese-basil__2": { x: 25, y: 78 },
      "genovese-basil__3": { x: 54, y: 78 },
      "bloomsdale-spinach__1": { x: 58, y: 22 },
      "bloomsdale-spinach__2": { x: 65, y: 22 },
      "bloomsdale-spinach__3": { x: 58, y: 38 },
      "bloomsdale-spinach__4": { x: 65, y: 38 }
    },
    productIds: ["soil-test-lab-mailer", "finished-compost", "drip-irrigation-kit", "tomato-cage-stakes", "insect-netting"]
  },
  {
    slug: "salsa-garden-raised-bed",
    path: "/garden-plans/salsa-garden-raised-bed/",
    shortTitle: "Salsa garden",
    title: "Salsa Garden Raised Bed Plan",
    eyebrow: "Kitchen garden template",
    description: "A full-sun salsa garden plan with tomato, pepper, cilantro, onion, and basil in one raised-bed workflow.",
    summary: "This template puts the tall summer crops where they can be supported, then uses smaller herbs and onions around them.",
    settings: {
      zone: "7b",
      bedLength: 8,
      bedWidth: 4,
      bedCount: 1,
      sun: "full",
      soil: "loam",
      water: "medium",
      mode: "in-ground",
      deerPressure: "ignore",
      walnut: "ignore"
    },
    plants: [
      { id: "roma-tomato", quantity: 1, role: "Sauce tomato" },
      { id: "jalapeno-pepper", quantity: 2, role: "Heat" },
      { id: "cilantro", quantity: 4, role: "Fresh herb succession" },
      { id: "candy-onion", quantity: 10, role: "Bulb crop" },
      { id: "genovese-basil", quantity: 2, role: "Flexible herb" }
    ],
    layout: {
      "roma-tomato__1": { x: 22, y: 50 },
      "jalapeno-pepper__1": { x: 45, y: 35 },
      "jalapeno-pepper__2": { x: 45, y: 68 },
      "cilantro__1": { x: 68, y: 28 },
      "cilantro__2": { x: 76, y: 28 },
      "cilantro__3": { x: 68, y: 45 },
      "cilantro__4": { x: 76, y: 45 },
      "candy-onion__1": { x: 62, y: 70 },
      "candy-onion__2": { x: 67, y: 70 },
      "candy-onion__3": { x: 72, y: 70 },
      "candy-onion__4": { x: 77, y: 70 },
      "candy-onion__5": { x: 82, y: 70 },
      "candy-onion__6": { x: 62, y: 84 },
      "candy-onion__7": { x: 67, y: 84 },
      "candy-onion__8": { x: 72, y: 84 },
      "candy-onion__9": { x: 77, y: 84 },
      "candy-onion__10": { x: 82, y: 84 },
      "genovese-basil__1": { x: 24, y: 22 },
      "genovese-basil__2": { x: 24, y: 78 }
    },
    productIds: ["soil-test-lab-mailer", "seed-starting-trays", "grow-light", "tomato-cage-stakes", "plant-labels"]
  },
  {
    slug: "4x8-salad-garden",
    path: "/garden-plans/4x8-salad-garden/",
    shortTitle: "4x8 salad garden",
    title: "4x8 Salad Garden Plan",
    eyebrow: "Cool-season template",
    description: "A 4x8 salad garden layout for lettuce, spinach, arugula, carrots, beets, and bunching onions.",
    summary: "This is a succession-style bed: sow small blocks, harvest young, and replant open squares as weather allows.",
    settings: {
      zone: "7b",
      bedLength: 8,
      bedWidth: 4,
      bedCount: 1,
      sun: "full",
      soil: "loam",
      water: "medium",
      mode: "in-ground",
      deerPressure: "ignore",
      walnut: "ignore"
    },
    plants: [
      { id: "buttercrunch-lettuce", quantity: 4, role: "Leaf lettuce" },
      { id: "parris-island-romaine", quantity: 4, role: "Romaine block" },
      { id: "bloomsdale-spinach", quantity: 6, role: "Cool-season greens" },
      { id: "wild-arugula", quantity: 4, role: "Peppery cut-and-come-again greens" },
      { id: "danvers-carrot", quantity: 16, role: "Root crop strip" },
      { id: "evergreen-bunching-onion", quantity: 8, role: "Edge crop" }
    ],
    layout: {
      "buttercrunch-lettuce__1": { x: 20, y: 25 },
      "buttercrunch-lettuce__2": { x: 28, y: 25 },
      "buttercrunch-lettuce__3": { x: 20, y: 45 },
      "buttercrunch-lettuce__4": { x: 28, y: 45 },
      "parris-island-romaine__1": { x: 45, y: 25 },
      "parris-island-romaine__2": { x: 53, y: 25 },
      "parris-island-romaine__3": { x: 45, y: 45 },
      "parris-island-romaine__4": { x: 53, y: 45 },
      "bloomsdale-spinach__1": { x: 70, y: 25 },
      "bloomsdale-spinach__2": { x: 78, y: 25 },
      "bloomsdale-spinach__3": { x: 86, y: 25 },
      "bloomsdale-spinach__4": { x: 70, y: 45 },
      "bloomsdale-spinach__5": { x: 78, y: 45 },
      "bloomsdale-spinach__6": { x: 86, y: 45 },
      "wild-arugula__1": { x: 20, y: 68 },
      "wild-arugula__2": { x: 28, y: 68 },
      "wild-arugula__3": { x: 20, y: 84 },
      "wild-arugula__4": { x: 28, y: 84 }
    },
    productIds: ["soil-thermometer", "floating-row-cover", "low-tunnel-hoops", "garden-clips", "watering-wand"]
  },
  {
    slug: "deer-resistant-pollinator-bed",
    path: "/garden-plans/deer-resistant-pollinator-bed/",
    shortTitle: "Deer-resistant pollinator bed",
    title: "Deer-Resistant Pollinator Bed Plan",
    eyebrow: "Habitat template",
    description: "A simple full-sun pollinator bed template using plants with better deer-resistance cues in the Plant by ZIP database.",
    summary: "No plant is deer proof, but this template starts with sturdy, sunny plants that are less attractive than many tender garden crops.",
    settings: {
      zone: "7b",
      bedLength: 8,
      bedWidth: 4,
      bedCount: 1,
      sun: "full",
      soil: "loam",
      water: "low",
      mode: "in-ground",
      deerPressure: "deer-pressure",
      walnut: "ignore"
    },
    plants: [
      { id: "purple-coneflower", quantity: 1, role: "Summer bloom" },
      { id: "black-eyed-susan", quantity: 1, role: "Long bloom" },
      { id: "butterfly-weed", quantity: 1, role: "Milkweed host plant" },
      { id: "moonshine-yarrow", quantity: 1, role: "Low aromatic flower" },
      { id: "russian-sage", quantity: 1, role: "Aromatic structure" },
      { id: "october-skies-aster", quantity: 1, role: "Late-season bloom" }
    ],
    layout: {
      "russian-sage__1": { x: 20, y: 50 },
      "purple-coneflower__1": { x: 40, y: 30 },
      "black-eyed-susan__1": { x: 40, y: 70 },
      "butterfly-weed__1": { x: 62, y: 32 },
      "october-skies-aster__1": { x: 74, y: 60 },
      "moonshine-yarrow__1": { x: 62, y: 78 }
    },
    productIds: ["soil-test-lab-mailer", "organic-mulch", "watering-wand", "animal-protection", "hand-trowel"]
  }
];

export function gardenPlanBySlug(slug) {
  return GARDEN_PLAN_TEMPLATES.find((template) => template.slug === slug);
}

export function gardenPlanInternalLinks() {
  return GARDEN_PLAN_TEMPLATES.map((template) => ({
    href: template.path,
    title: template.shortTitle,
    description: template.description
  }));
}

export function gardenPlanPlannerUrl(template) {
  return `/?garden-template=${encodeURIComponent(template.slug)}#garden-planner`;
}

export function gardenPlanTemplatePayloads() {
  return GARDEN_PLAN_TEMPLATES.map((template) => ({
    slug: template.slug,
    title: template.title,
    settings: template.settings,
    plants: template.plants.map(({ id, quantity }) => ({ id, quantity })),
    layout: template.layout
  }));
}

export function gardenPlanPlantEntries(template, plants, plantMetrics) {
  return template.plants
    .map((planPlant) => {
      const plant = plants.find((candidate) => candidate.id === planPlant.id);
      if (!plant) return null;
      return {
        ...planPlant,
        plant,
        metrics: plantMetrics[plant.id] ?? {}
      };
    })
    .filter(Boolean);
}

export function gardenPlanSpaceStats(template, plantMetrics) {
  return template.plants.reduce((stats, planPlant) => {
    const metrics = plantMetrics[planPlant.id] ?? {};
    const quantity = Math.max(1, Number(planPlant.quantity) || 1);
    const min = Number(metrics.spacingAreaSqFtMin);
    const max = Number(metrics.spacingAreaSqFtMax);
    const yieldMin = Number(metrics.yieldLbsMin);
    const yieldMax = Number(metrics.yieldLbsMax);
    return {
      minSqFt: stats.minSqFt + (Number.isFinite(min) ? min * quantity : 0),
      maxSqFt: stats.maxSqFt + (Number.isFinite(max) ? max * quantity : 0),
      minYield: stats.minYield + (Number.isFinite(yieldMin) ? yieldMin * quantity : 0),
      maxYield: stats.maxYield + (Number.isFinite(yieldMax) ? yieldMax * quantity : 0),
      sourcedYieldRows: stats.sourcedYieldRows + (isSourcedValue(metrics.display?.yieldLbs) ? 1 : 0)
    };
  }, {
    minSqFt: 0,
    maxSqFt: 0,
    minYield: 0,
    maxYield: 0,
    sourcedYieldRows: 0
  });
}

export function gardenPlanItemList(entries, siteUrl) {
  return entries.map(({ plant }, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: plant.name,
    url: siteUrl(plantUrl(plant))
  }));
}
