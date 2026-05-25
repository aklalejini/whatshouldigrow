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
    description: "Browse native-cue plants that can support habitat, pollinators, edible landscapes, and lower-maintenance planting plans.",
    summary: "These records use current Plant by ZIP native cues, traits, and notes. Confirm county-level nativity before planting at scale.",
    ctaLabel: "Match natives by ZIP",
    ctaHref: "/",
    filterLabel: "Native-cue plants",
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
    summary: "This collection favors plants tagged for privacy or screening, then surfaces mature-size and spacing cues where the database has them.",
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

export function itemListForPlants(plants, baseUrl) {
  return plants.map(({ plant }, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: plant.name,
    url: new URL(plantUrl(plant), baseUrl).toString()
  }));
}
