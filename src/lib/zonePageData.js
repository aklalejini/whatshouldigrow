import { isSourcedValue, sentenceCase } from "./plantUtils.js";
import { hasNativeCue } from "./hubData.js";

export const ZONE_PAGE_TARGETS = [
  {
    family: "planting-calendar",
    zoneSlug: "zone-7a",
    zone: "7a",
    path: "/planting-calendar/zone-7a/",
    shortTitle: "Zone 7a calendar",
    eyebrow: "Zone planting calendar",
    title: "Zone 7a Planting Calendar",
    description: "Browse database-backed planting windows, frost-aware timing notes, and useful plants for USDA zone 7a gardens.",
    summary: "Zone 7a usually has a real winter, a mid-spring frost transition, and enough season for tree fruit, berries, warm-season vegetables, and many native perennials.",
    intent: "calendar",
    ctaLabel: "Build calendar by ZIP",
    ctaHref: "/#calendar"
  },
  {
    family: "planting-calendar",
    zoneSlug: "zone-8a",
    zone: "8a",
    path: "/planting-calendar/zone-8a/",
    shortTitle: "Zone 8a calendar",
    eyebrow: "Zone planting calendar",
    title: "Zone 8a Planting Calendar",
    description: "Browse database-backed planting windows, frost-aware timing notes, and useful plants for USDA zone 8a gardens.",
    summary: "Zone 8a opens a longer warm season than zone 7, with more room for figs, pomegranates, muscadines, warm vegetables, and fall planting.",
    intent: "calendar",
    ctaLabel: "Build calendar by ZIP",
    ctaHref: "/#calendar"
  },
  {
    family: "what-to-plant-now",
    zoneSlug: "zone-7a",
    zone: "7a",
    path: "/what-to-plant-now/zone-7a/",
    shortTitle: "Plant now in 7a",
    eyebrow: "Seasonal action list",
    title: "What to Plant Now in Zone 7a",
    description: "See practical, database-backed planting ideas for zone 7a based on the current season, hardiness fit, and Plant by ZIP profile data.",
    summary: "Use this as a seasonal shortlist, then run your exact ZIP through the matcher or calendar before buying plants or starting seed.",
    intent: "plant-now",
    ctaLabel: "Check my ZIP",
    ctaHref: "/"
  },
  {
    family: "fruit-trees",
    zoneSlug: "zone-8a",
    zone: "8a",
    path: "/fruit-trees/zone-8a/",
    shortTitle: "Fruit trees 8a",
    eyebrow: "Edible landscape",
    title: "Fruit Trees for Zone 8a",
    description: "Compare fruit trees, nut trees, citrus-adjacent plants, and woody edibles for USDA zone 8a using Plant by ZIP data.",
    summary: "Zone 8a can support a broad fruit palette, but chill hours, humidity, bloom frost, and summer water shape which cultivars are actually reliable.",
    intent: "fruit-trees",
    goal: "fruit",
    ctaLabel: "Match fruit by ZIP",
    ctaHref: "/"
  },
  {
    family: "native-plants",
    zoneSlug: "zone-7",
    zone: "7",
    path: "/native-plants/zone-7/",
    shortTitle: "Native plants 7",
    eyebrow: "Habitat plants",
    title: "Native Plants for Zone 7",
    description: "Browse native-cue and habitat-friendly plants for USDA zone 7 gardens using Plant by ZIP hardiness, water, and profile data.",
    summary: "This is a hardiness-based native-cue collection, not a county-level native range. Confirm local provenance before planting at scale.",
    intent: "native-plants",
    goal: "native-plants",
    ctaLabel: "Match natives by ZIP",
    ctaHref: "/"
  }
];

export function zoneToNumber(zone) {
  const match = String(zone).trim().toLowerCase().match(/^(\d{1,2})([ab])?$/);
  if (!match) return Number.NaN;
  return Number(match[1]) + (match[2] === "b" ? 0.5 : 0);
}

export function targetForFamilyAndZone(family, zoneSlug) {
  return ZONE_PAGE_TARGETS.find((target) => target.family === family && target.zoneSlug === zoneSlug);
}

export function targetsForFamily(family) {
  return ZONE_PAGE_TARGETS.filter((target) => target.family === family);
}

export function featuredZoneInternalLinks() {
  return ZONE_PAGE_TARGETS.map((target) => ({
    href: target.path,
    title: target.shortTitle,
    description: target.description
  }));
}

export function plantFitsZone(plant, targetZone) {
  const min = zoneToNumber(plant.zones?.[0]);
  const max = zoneToNumber(plant.zones?.[1]);
  const zone = zoneToNumber(targetZone);
  if (!Number.isFinite(min) || !Number.isFinite(max) || !Number.isFinite(zone)) return false;
  if (/^\d+$/.test(String(targetZone))) {
    return max >= zone && min <= zone + 0.5;
  }
  return zone >= min - 0.05 && zone <= max + 0.05;
}

function isWoodyFruit(plant) {
  return plant.goals.includes("fruit") && /tree|shrub|cane|vine|citrus|nut|berry/i.test(plant.type);
}

function targetMatchesPlant(plant, target) {
  if (!plantFitsZone(plant, target.zone)) return false;
  if (target.intent === "fruit-trees") return isWoodyFruit(plant);
  if (target.intent === "native-plants") return hasNativeCue(plant);
  if (target.intent === "plant-now") {
    return plant.goals.includes("vegetables-herbs")
      || plant.goals.includes("fruit")
      || hasNativeCue(plant)
      || plant.goals.includes("pollinators-wildlife");
  }
  return true;
}

function scoreZonePlant(plant, metrics = {}, target) {
  const targetZone = zoneToNumber(target.zone.replace(/^(\d+)$/, "$1a"));
  const min = zoneToNumber(plant.zones?.[0]);
  const max = zoneToNumber(plant.zones?.[1]);
  const zoneMargin = Number.isFinite(targetZone) && Number.isFinite(min) && Number.isFinite(max)
    ? Math.min(Math.abs(targetZone - min), Math.abs(max - targetZone))
    : 0;
  let score = Math.max(0, 18 - zoneMargin * 4);
  if (isSourcedValue(metrics.display?.firstOutput)) score += 10;
  if (isSourcedValue(metrics.display?.spacing)) score += 6;
  if (isSourcedValue(metrics.display?.yieldLbs)) score += 8;
  if (target.intent === "fruit-trees" && isWoodyFruit(plant)) score += 16;
  if (target.intent === "native-plants" && hasNativeCue(plant)) score += 16;
  if (target.intent === "plant-now" && plant.goals.includes("vegetables-herbs")) score += 10;
  if (plant.water === "low") score += 3;
  score += Math.min(plant.traits?.length ?? 0, 4);
  return score;
}

export function plantsForZoneTarget(target, plants, plantMetrics) {
  return plants
    .filter((plant) => targetMatchesPlant(plant, target))
    .map((plant) => ({
      plant,
      metrics: plantMetrics[plant.id] ?? {},
      score: scoreZonePlant(plant, plantMetrics[plant.id] ?? {}, target),
      timing: timingForPlant(plant, target)
    }))
    .sort((a, b) => b.score - a.score || a.plant.name.localeCompare(b.plant.name));
}

function plantSeasonClass(plant) {
  const identity = `${plant.id} ${plant.name} ${plant.query ?? ""} ${plant.type}`.toLowerCase();
  if (/pea|lettuce|spinach|kale|collard|chard|carrot|beet|radish|turnip|arugula|mizuna|broccoli|cauliflower|garlic|onion|leek/.test(identity)) return "cool";
  if (/tomato|pepper|eggplant|okra|bean|corn|squash|zucchini|melon|cucumber|sweet potato|basil/.test(identity)) return "warm";
  if (/tree|shrub|cane|vine|berry|fruit|nut|citrus|perennial|grass|milkweed|coneflower|sedge|oak|maple/.test(identity)) return "nursery";
  return "general";
}

function frostPhrase(target, kind) {
  const zone = zoneToNumber(target.zone.replace(/^(\d+)$/, "$1a"));
  const warmer = Number.isFinite(zone) && zone >= 8;
  if (kind === "last") return warmer ? "early to mid spring" : "mid to late spring";
  if (kind === "first") return warmer ? "mid to late fall" : "mid fall";
  return warmer ? "long warm season" : "moderate warm season";
}

export function timingForPlant(plant, target) {
  const seasonClass = plantSeasonClass(plant);
  if (target.intent === "plant-now") {
    const month = new Date().getMonth();
    if ([2, 3, 4].includes(month)) {
      if (seasonClass === "warm") return `Start after frost as soil warms; ${plant.harvest}.`;
      if (seasonClass === "cool") return `Use the cool spring window now, then plan a fall repeat.`;
      return `Plant nursery stock with steady watering before summer heat.`;
    }
    if ([5, 6, 7].includes(month)) {
      if (seasonClass === "warm") return `Use the warm-season window now; mulch and water evenly.`;
      if (seasonClass === "cool") return `Plan for fall sowing rather than peak summer heat.`;
      return `Plant only with reliable irrigation, or wait for fall establishment.`;
    }
    if ([8, 9, 10].includes(month)) {
      if (seasonClass === "warm") return `Harvest or protect warm-season crops before the first frost window.`;
      if (seasonClass === "cool") return `Use the fall cool-season window now.`;
      return `Fall is a strong establishment window for woody and perennial plants.`;
    }
    if (seasonClass === "cool") return `Plan late winter starts and early spring direct sowing.`;
    return `Use winter for ordering, pruning, soil prep, and dormant planting where appropriate.`;
  }
  if (seasonClass === "warm") return `Plant after the ${frostPhrase(target, "last")} frost transition; harvest ${plant.harvest}.`;
  if (seasonClass === "cool") return `Use early spring and fall windows around the ${frostPhrase(target, "first")} frost season.`;
  if (seasonClass === "nursery") return `Plant dormant or nursery stock in fall through spring, avoiding frozen soil and summer stress.`;
  return `Use local frost dates and soil temperature to place this in the right window.`;
}

export function zonePageStats(entries) {
  const types = new Set(entries.map(({ plant }) => plant.type));
  const sourced = entries.filter(({ metrics }) => isSourcedValue(metrics.display?.firstOutput)).length;
  const lowWater = entries.filter(({ plant }) => plant.water === "low").length;
  return {
    matches: entries.length,
    types: types.size,
    sourced,
    lowWater
  };
}

export function zonePageAdvice(target) {
  const zoneLabel = target.zone.toUpperCase();
  const base = [
    {
      title: "Use hardiness as the first gate",
      text: `These plants fit USDA ${zoneLabel} by database range. A ZIP lookup still matters because county, elevation, coast, and city heat can move frost risk.`
    },
    {
      title: "Check the season window",
      text: `For ${target.intent === "plant-now" ? "current tasks" : "planting calendars"}, Plant by ZIP uses practical frost-window heuristics. Soil temperature and the 10-day forecast still decide the exact day.`
    },
    {
      title: "Use profile data before buying",
      text: "Open plant profiles for spacing, container minimums, first output, water needs, relationship cards, and sourced metric notes."
    }
  ];
  if (target.intent === "native-plants") {
    base[1] = {
      title: "Confirm local native range",
      text: "Native cues here are hardiness and database signals, not county-level provenance. Check local extension, state native plant societies, or regional floras before large plantings."
    };
  }
  if (target.intent === "fruit-trees") {
    base[1] = {
      title: "Verify chill and bloom risk",
      text: "Zone 8a fruit can fail from low chill, early bloom frost, humidity, or heat even when the hardiness range looks right."
    };
  }
  return base;
}

export function zonePlantSummary(plant, metrics = {}, timing = "") {
  return [
    `Zones ${plant.zones[0]}-${plant.zones[1]}`,
    `${sentenceCase(plant.water)} water`,
    metrics.display?.firstOutput && metrics.display.firstOutput !== "Needs source" ? metrics.display.firstOutput : "",
    timing
  ].filter(Boolean).join(" / ");
}

export function relatedZoneTargets(target) {
  return ZONE_PAGE_TARGETS.filter((entry) => entry.path !== target.path);
}
