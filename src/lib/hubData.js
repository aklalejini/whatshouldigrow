import {
  formatGoal,
  isSourcedValue,
  plantUrl,
  sentenceCase
} from "./plantUtils.js";

export const HUB_PAGES = [
  {
    slug: "planting-calendar",
    path: "/planting-calendar/",
    shortTitle: "Planting calendar",
    eyebrow: "Seasonal planner",
    title: "Planting Calendar by ZIP Code",
    description: "Use ZIP-based hardiness and frost context to plan seed-starting, direct-sow, transplanting, and nursery planting windows.",
    summary: "Start with the live ZIP calendar, then browse plants that already have timing, first-output, and harvest-window data in Plant by ZIP.",
    ctaLabel: "Open the ZIP calendar",
    ctaHref: "/#calendar",
    filterLabel: "Calendar-ready plants",
    match: () => true
  },
  {
    slug: "native-plants",
    path: "/native-plants/",
    shortTitle: "Native plants",
    eyebrow: "Habitat plants",
    title: "Native Plants for Real Yards",
    description: "Browse native-flagged plants that can support habitat, pollinators, edible landscapes, and lower-maintenance planting plans.",
    summary: "These records use current Plant by ZIP native flags, traits, and notes. Confirm county-level nativity before planting at scale.",
    ctaLabel: "Match natives by ZIP",
    ctaHref: "/",
    filterLabel: "Native-flagged plants",
    match: (plant) => hasNativeCue(plant)
  },
  {
    slug: "fruit-trees",
    path: "/fruit-trees/",
    shortTitle: "Fruit trees",
    eyebrow: "Edible landscape",
    title: "Best Fruit Trees by Zone and Site Fit",
    description: "Compare fruit trees and tree-like edible plants by hardiness range, water needs, spacing, first output, and sourced yield data.",
    summary: "Use this hub as a crawlable starting point for tree fruit, nut trees, citrus, pawpaw, persimmon, figs, peaches, apples, and similar woody crops.",
    ctaLabel: "Find fruit for my ZIP",
    ctaHref: "/",
    filterLabel: "Tree fruit profiles",
    match: (plant) => plant.goals.includes("fruit") && /tree|citrus|nut/i.test(plant.type)
  },
  {
    slug: "privacy-shrubs",
    path: "/privacy-shrubs/",
    shortTitle: "Privacy shrubs",
    eyebrow: "Screens and buffers",
    title: "Privacy Shrubs, Vines, and Screening Plants",
    description: "Find plants for screening, edible hedges, visual buffers, and wildlife-friendly privacy by zone, water, soil, and mature size.",
    summary: "This collection favors plants tagged for privacy or screening, then surfaces mature-size and spacing data where the database has them.",
    ctaLabel: "Match privacy plants",
    ctaHref: "/",
    filterLabel: "Screening candidates",
    match: (plant) => plant.goals.includes("privacy-screening")
  },
  {
    slug: "low-water-plants",
    path: "/low-water-plants/",
    shortTitle: "Low-water plants",
    eyebrow: "Dry-site planning",
    title: "Low-Water Plants for Practical Gardens",
    description: "Browse drought-tolerant and lower-water plant options for edible, native, ornamental, and screening goals.",
    summary: "These plants are marked low-water in the database, but establishment watering, mulch, soil, and regional rainfall still matter.",
    ctaLabel: "Find low-water matches",
    ctaHref: "/",
    filterLabel: "Low-water profiles",
    match: (plant) => plant.water === "low"
  },
  {
    slug: "vegetables-herbs",
    path: "/vegetables-herbs/",
    shortTitle: "Vegetables & herbs",
    eyebrow: "Kitchen garden",
    title: "Vegetables and Herbs by Site Fit",
    description: "Browse vegetable and herb profiles by hardiness range, light, soil, water, timing, spacing, container fit, and output data.",
    summary: "Use this collection to compare annual crops, perennial herbs, and edible garden staples before running an exact ZIP calendar.",
    ctaLabel: "Match kitchen crops",
    ctaHref: "/",
    filterLabel: "Kitchen-garden profiles",
    match: (plant) => plant.goals.includes("vegetables-herbs")
  },
  {
    slug: "pollinator-plants",
    path: "/pollinator-plants/",
    shortTitle: "Pollinator plants",
    eyebrow: "Habitat and bloom",
    title: "Pollinator Plants for Gardens",
    description: "Compare flowers, herbs, shrubs, natives, and habitat plants that support pollinators and wildlife while fitting real garden conditions.",
    summary: "This hub surfaces plants tagged for pollinators, wildlife, native planting, bloom value, or habitat structure.",
    ctaLabel: "Match pollinator plants",
    ctaHref: "/",
    filterLabel: "Pollinator profiles",
    match: (plant) => plant.goals.includes("pollinators-wildlife") || hasNativeCue(plant)
  },
  {
    slug: "container-garden-plants",
    path: "/container-garden-plants/",
    shortTitle: "Container plants",
    eyebrow: "Small-space growing",
    title: "Container Garden Plants by Size and Yield",
    description: "Find edible, ornamental, and habitat plants that can work in containers, patio beds, raised beds, and smaller spaces.",
    summary: "These records favor compact forms, annual crops, herbs, berries, and plants with practical container notes in the profile data.",
    ctaLabel: "Find container matches",
    ctaHref: "/",
    filterLabel: "Container-friendly profiles",
    match: (plant) => /annual|herb|vegetable|berry|strawberry|pepper|tomato|eggplant|okra|fig|citrus|dwarf|container|patio/i.test(`${plant.id} ${plant.name} ${plant.type} ${plant.notes} ${(plant.traits ?? []).join(" ")}`)
  },
  {
    slug: "shade-plants",
    path: "/shade-plants/",
    shortTitle: "Shade plants",
    eyebrow: "Lower-light sites",
    title: "Plants for Shade and Part Sun",
    description: "Browse plants that tolerate shade or part sun, including edible, native, ornamental, and ground-layer options for lower-light gardens.",
    summary: "Use this hub to shortlist plants for woodland edges, north sides, understories, and yards that do not receive all-day sun.",
    ctaLabel: "Match shade plants",
    ctaHref: "/",
    filterLabel: "Shade-tolerant profiles",
    match: (plant) => plant.sun.includes("shade") || plant.sun.includes("partial")
  },
  {
    slug: "clay-soil-plants",
    path: "/clay-soil-plants/",
    shortTitle: "Clay soil plants",
    eyebrow: "Heavy-soil planning",
    title: "Plants That Can Handle Clay Soil",
    description: "Compare plants marked suitable for clay soils, including native perennials, shrubs, fruiting plants, and practical garden crops.",
    summary: "Clay soil still needs drainage judgment, but this collection gives you a better first shortlist than starting from generic plant lists.",
    ctaLabel: "Match clay-soil plants",
    ctaHref: "/",
    filterLabel: "Clay-tolerant profiles",
    match: (plant) => plant.soils.includes("clay")
  },
  {
    slug: "sandy-soil-plants",
    path: "/sandy-soil-plants/",
    shortTitle: "Sandy soil plants",
    eyebrow: "Fast-draining sites",
    title: "Plants for Sandy or Fast-Draining Soil",
    description: "Find plants that can work in sandy, fast-draining, or lower-moisture sites when water and mulch are managed well.",
    summary: "This hub emphasizes plant records with sandy-soil fit and practical drought or drainage tolerance.",
    ctaLabel: "Match sandy-soil plants",
    ctaHref: "/",
    filterLabel: "Sandy-soil profiles",
    match: (plant) => plant.soils.includes("sandy")
  },
  {
    slug: "edible-hedges",
    path: "/edible-hedges/",
    shortTitle: "Edible hedges",
    eyebrow: "Food and structure",
    title: "Edible Hedges, Screens, and Living Borders",
    description: "Compare fruiting shrubs, cane fruit, vines, small trees, and screening plants that can add harvest value and structure.",
    summary: "Use this page to find plants that can do more than one job: food, screening, wildlife value, and garden structure.",
    ctaLabel: "Match edible screens",
    ctaHref: "/",
    filterLabel: "Edible structure profiles",
    match: (plant) => plant.goals.includes("fruit") && (/shrub|cane|vine|tree/i.test(plant.type) || plant.goals.includes("privacy-screening"))
  }
];

export const TRUST_PAGES = [
  {
    path: "/about/",
    title: "About Plant by ZIP"
  },
  {
    path: "/methodology/",
    title: "Methodology"
  },
  {
    path: "/editorial-policy/",
    title: "Editorial Policy"
  },
  {
    path: "/photo-sourcing-policy/",
    title: "Photo Sourcing Policy"
  },
  {
    path: "/affiliate-policy/",
    title: "Affiliate Policy"
  }
];

export function hubPageBySlug(slug) {
  return HUB_PAGES.find((hub) => hub.slug === slug);
}

export function hasNativeCue(plant) {
  const text = [plant.name, plant.type, plant.notes, plant.query, ...(plant.traits ?? [])]
    .join(" ")
    .toLowerCase();
  return plant.goals.includes("low-maintenance-natives")
    || /\bnative\b/.test(text)
    || /\bmilkweed\b|\bpawpaw\b|\bserviceberry\b|\bconeflower\b|\bgoldenrod\b|\bsedge\b|\boak\b/.test(text);
}

function zoneToNumber(zone) {
  const [, number = "0", suffix = ""] = String(zone).match(/^(\d+)([ab])?$/) ?? [];
  return Number(number) + (suffix === "b" ? 0.5 : 0);
}

function hubScore(plant, metrics = {}, hub) {
  let score = 0;
  if (isSourcedValue(metrics.display?.yieldLbs)) score += 18;
  if (isSourcedValue(metrics.display?.firstOutput)) score += 10;
  if (isSourcedValue(metrics.display?.spacing)) score += 6;
  if (plant.goals.includes("fruit")) score += hub.slug === "fruit-trees" ? 10 : 0;
  if (plant.goals.includes("privacy-screening")) score += hub.slug === "privacy-shrubs" ? 10 : 0;
  if (plant.water === "low") score += hub.slug === "low-water-plants" ? 10 : 0;
  if (hasNativeCue(plant)) score += hub.slug === "native-plants" ? 10 : 0;
  score += Math.min(plant.goals.length, 5);
  score += Math.min(plant.traits.length, 4);
  score += Math.max(0, 12 - zoneToNumber(plant.zones[0])) * 0.1;
  return score;
}

export function plantsForHub(hub, plants, plantMetrics) {
  return plants
    .filter((plant) => hub.match(plant))
    .map((plant) => ({
      plant,
      metrics: plantMetrics[plant.id] ?? {},
      score: hubScore(plant, plantMetrics[plant.id] ?? {}, hub)
    }))
    .sort((a, b) => b.score - a.score || a.plant.name.localeCompare(b.plant.name));
}

export function relatedHubsForPlant(plant) {
  return HUB_PAGES
    .filter((hub) => hub.match(plant))
    .slice(0, 4);
}

export function hubPlantSummary(plant, metrics = {}) {
  const parts = [
    `Zones ${plant.zones[0]}-${plant.zones[1]}`,
    `${sentenceCase(plant.water)} water`,
    plant.sun.length ? `${plant.sun.map(sentenceCase).join("/")} sun` : "",
    isSourcedValue(metrics.display?.firstOutput) ? metrics.display.firstOutput : "",
    isSourcedValue(metrics.display?.yieldLbs) ? metrics.display.yieldLbs : ""
  ].filter(Boolean);
  return parts.join(" / ");
}

export function hubPlantTags(plant) {
  return [
    ...plant.goals.slice(0, 2).map(formatGoal),
    ...plant.traits.slice(0, 2)
  ];
}

export function hubInternalLinks() {
  return HUB_PAGES.map((hub) => ({
    href: hub.path,
    title: hub.shortTitle,
    description: hub.description
  }));
}

const hubProductMap = {
  "planting-calendar": ["soil-thermometer", "seed-starting-trays", "frost-blanket", "garden-clips"],
  "native-plants": ["soil-test-lab-mailer", "finished-compost", "organic-mulch", "animal-protection"],
  "fruit-trees": ["soil-test-lab-mailer", "drip-irrigation-kit", "bypass-pruners", "organic-mulch"],
  "privacy-shrubs": ["digging-spade", "organic-mulch", "drip-irrigation-kit", "animal-protection"],
  "low-water-plants": ["soil-test-lab-mailer", "organic-mulch", "drip-irrigation-kit", "shade-cloth"],
  "vegetables-herbs": ["seed-starting-trays", "seedling-heat-mat", "grow-light", "insect-netting"],
  "pollinator-plants": ["soil-test-lab-mailer", "finished-compost", "organic-mulch", "watering-wand"],
  "container-garden-plants": ["drainage-container", "container-potting-mix", "watering-wand", "plant-labels"],
  "shade-plants": ["soil-test-lab-mailer", "finished-compost", "organic-mulch", "hand-trowel"],
  "clay-soil-plants": ["soil-test-lab-mailer", "finished-compost", "organic-mulch", "digging-spade"],
  "sandy-soil-plants": ["soil-test-lab-mailer", "finished-compost", "organic-mulch", "drip-irrigation-kit"],
  "edible-hedges": ["drip-irrigation-kit", "organic-mulch", "bypass-pruners", "trellis-netting"]
};

export function hubProductIds(hub) {
  return hubProductMap[hub.slug] ?? [];
}

export function itemListForPlants(plants, baseUrl) {
  return plants.map(({ plant }, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: plant.name,
    url: new URL(plantUrl(plant), baseUrl).toString()
  }));
}
