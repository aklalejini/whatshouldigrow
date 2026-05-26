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
    zoneSlug: "zone-7b",
    zone: "7b",
    path: "/planting-calendar/zone-7b/",
    shortTitle: "Zone 7b calendar",
    eyebrow: "Zone planting calendar",
    title: "Zone 7b Planting Calendar",
    description: "Browse database-backed planting windows, frost-aware timing notes, and useful plants for USDA zone 7b gardens.",
    summary: "Zone 7b is a long-shoulder-season climate: mild enough for figs, peaches, muscadines, and fall crops, but still cold enough that bloom frost and winter lows matter.",
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
    family: "what-to-plant-now",
    zoneSlug: "zone-7b",
    zone: "7b",
    path: "/what-to-plant-now/zone-7b/",
    shortTitle: "Plant now in 7b",
    eyebrow: "Seasonal action list",
    title: "What to Plant Now in Zone 7b",
    description: "See practical, database-backed planting ideas for zone 7b based on the current season, hardiness fit, and Plant by ZIP profile data.",
    summary: "Use this as a zone 7b seasonal shortlist, then run your exact ZIP through the matcher or calendar before buying plants, starting seed, or transplanting.",
    intent: "plant-now",
    ctaLabel: "Check my ZIP",
    ctaHref: "/"
  },
  {
    family: "fruit-trees",
    zoneSlug: "zone-7b",
    zone: "7b",
    path: "/fruit-trees/zone-7b/",
    shortTitle: "Fruit trees 7b",
    eyebrow: "Edible landscape",
    title: "Fruit Trees for Zone 7b",
    description: "Compare fruit trees, berries, nut trees, and woody edibles for USDA zone 7b using Plant by ZIP hardiness, water, spacing, and output data.",
    summary: "Zone 7b has enough winter chill for many classic fruits and enough warmth for figs and muscadines, but cultivar choice still hinges on chill hours, bloom frost, humidity, and site drainage.",
    intent: "fruit-trees",
    goal: "fruit",
    ctaLabel: "Match fruit by ZIP",
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
  },
  {
    family: "native-plants",
    zoneSlug: "zone-7b",
    zone: "7b",
    path: "/native-plants/zone-7b/",
    shortTitle: "Native plants 7b",
    eyebrow: "Habitat plants",
    title: "Native Plants for Zone 7b",
    description: "Browse native-cue and habitat-friendly plants for USDA zone 7b gardens using Plant by ZIP hardiness, water, and profile data.",
    summary: "This is a hardiness-based native-cue collection for zone 7b, not a county-level native range map. Use it to shortlist habitat plants, then confirm local provenance.",
    intent: "native-plants",
    goal: "native-plants",
    ctaLabel: "Match natives by ZIP",
    ctaHref: "/"
  }
];

const ZONE_PROFILES = {
  "7": {
    tempRange: "0 to 10 F",
    lastFrost: "early to late April in many lowland sites",
    firstFrost: "late October to early November",
    seasonLength: "roughly 180-220 frost-free days",
    heatCue: "long shoulder seasons with real summer heat",
    chillCue: "usually enough winter chill for apples, pears, peaches, blueberries, and many brambles",
    regionCue: "common across parts of the Mid-Atlantic, southern Appalachia, lower Midwest, interior West, and Pacific Northwest valleys",
    caution: "Elevation, urban heat, cold-air drainage, and humidity can make two zone 7 gardens behave very differently."
  },
  "7a": {
    tempRange: "0 to 5 F",
    lastFrost: "mid to late April in many inland sites",
    firstFrost: "late October",
    seasonLength: "roughly 175-210 frost-free days",
    heatCue: "moderate to long summers with cool spring and fall windows",
    chillCue: "generally strong chill for classic tree fruit, with bloom frost still a key risk",
    regionCue: "common in parts of the Mid-Atlantic, Appalachia, Ozarks, southern Plains, and inland West",
    caution: "Cold pockets and exposed slopes matter more than the half-zone label when plants bloom early."
  },
  "7b": {
    tempRange: "5 to 10 F",
    lastFrost: "early to mid April in many lowland sites",
    firstFrost: "late October to early November",
    seasonLength: "roughly 190-220 frost-free days",
    heatCue: "long shoulder seasons, warm summers, and a useful fall planting window",
    chillCue: "often enough chill for apples, pears, peaches, blueberries, and many brambles; verify low-chill or high-chill cultivars by region",
    regionCue: "common in parts of the Mid-Atlantic, southern Appalachia, lower Midwest, inland Pacific Northwest, and transition areas of the South",
    caution: "Humidity, slope, soil drainage, and late bloom frost often decide success more than the hardiness number alone."
  },
  "8a": {
    tempRange: "10 to 15 F",
    lastFrost: "late March to early April in many sites",
    firstFrost: "early to mid November",
    seasonLength: "roughly 220-250 frost-free days",
    heatCue: "heat, humidity, and summer water often matter more than winter cold",
    chillCue: "chill hours can be limiting for high-chill fruit; low-chill cultivar choice matters",
    regionCue: "common across parts of the Southeast, Pacific Northwest, southern Plains, and lower-elevation West",
    caution: "Warm winters can reduce fruit set even when the tree is fully hardy."
  }
};

export function zoneToNumber(zone) {
  const match = String(zone).trim().toLowerCase().match(/^(\d{1,2})([ab])?$/);
  if (!match) return Number.NaN;
  return Number(match[1]) + (match[2] === "b" ? 0.5 : 0);
}

export function zoneProfileForTarget(target) {
  return ZONE_PROFILES[target.zone] ?? ZONE_PROFILES[String(target.zone).replace(/[ab]$/, "")] ?? {
    tempRange: "zone-dependent",
    lastFrost: "spring, based on your local frost date",
    firstFrost: "fall, based on your local frost date",
    seasonLength: "site-dependent",
    heatCue: "local heat load can change plant performance",
    chillCue: "verify cultivar chill requirements before planting fruit",
    regionCue: "varies by state, elevation, and nearby water",
    caution: "Use the ZIP tool and local extension guidance before planting at scale."
  };
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

export function plantSeasonClass(plant) {
  const identity = `${plant.id} ${plant.name} ${plant.query ?? ""} ${plant.type}`.toLowerCase();
  if (/malabar spinach|new zealand spinach/.test(identity)) return "warm";
  if (/\b(peas?|lettuce|spinach|kale|collards?|chard|carrots?|beets?|radishes|radish|turnips?|arugula|mizuna|broccoli|cauliflower|garlic|onions?|leeks?)\b/.test(identity)) return "cool";
  if (/\b(tomatoes?|peppers?|eggplants?|okra|beans?|cowpeas?|corn|squash|zucchini|melons?|cantaloupe|watermelon|cucumbers?|sweet potatoes?|basil)\b/.test(identity)) return "warm";
  if (/tree|shrub|cane|vine|berry|fruit|nut|citrus|perennial|grass|milkweed|coneflower|sedge|oak|maple/.test(identity)) return "nursery";
  return "general";
}

function plantIdentityText(plant) {
  return `${plant.id} ${plant.name} ${plant.query ?? ""} ${plant.type} ${(plant.traits ?? []).join(" ")}`.toLowerCase();
}

function matchesPlantTerms(plant, pattern) {
  return pattern.test(plantIdentityText(plant));
}

function uniqueEntries(entries, predicate, limit = 5) {
  return entries.filter(({ plant }) => predicate(plant)).slice(0, limit);
}

function currentSeasonLabel() {
  const month = new Date().getMonth();
  if ([2, 3, 4].includes(month)) return "spring";
  if ([5, 6, 7].includes(month)) return "summer";
  if ([8, 9, 10].includes(month)) return "fall";
  return "winter";
}

export function zonePagePlanningWindows(target) {
  const profile = zoneProfileForTarget(target);
  const zone = target.zone;
  const shared = [
    {
      label: "Cool-season crops",
      title: "Use the spring and fall shoulders",
      text: `In zone ${zone}, greens, roots, peas, brassicas, onions, and garlic usually perform best around the ${profile.lastFrost} and ${profile.firstFrost} transitions rather than peak summer heat.`
    },
    {
      label: "Warm-season crops",
      title: "Wait for warm soil after frost",
      text: `Tomatoes, peppers, squash, beans, okra, sweet potatoes, basil, cucumbers, and melons belong after the last-frost window and need steady water through the ${profile.heatCue}.`
    },
    {
      label: "Woody and perennial plants",
      title: "Favor fall through spring establishment",
      text: `Trees, shrubs, vines, native perennials, and grasses establish best when roots can grow before summer stress. Avoid planting into frozen soil or a hot dry spell.`
    },
    {
      label: "Fruit planning",
      title: "Check chill, bloom, and disease pressure",
      text: `${profile.chillCue}. In humid regions, disease resistance and airflow can be as important as winter hardiness.`
    }
  ];

  if (target.intent === "plant-now") {
    const season = currentSeasonLabel();
    if (season === "spring") {
      return [
        {
          label: "Plant now after frost",
          title: "Warm-season crops move to the front",
          text: `For most zone ${zone} gardens, late spring means waiting until nights are reliably mild, then transplanting or direct-sowing warm crops into warm soil.`
        },
        {
          label: "Still useful",
          title: "Set woody and native plants with care",
          text: "Nursery stock can still go in if watering is reliable, but mulch, deep watering, and protection from early heat become more important."
        },
        {
          label: "Plan next",
          title: "Hold cool-season crops for fall",
          text: `Many cool crops are better planned for the ${profile.firstFrost} approach than pushed through summer.`
        }
      ];
    }
    if (season === "summer") {
      return [
        {
          label: "Plant now",
          title: "Heat lovers and succession crops",
          text: "Use the warm-season window for heat-tolerant vegetables, herbs, and quick successions where days to maturity still fit."
        },
        {
          label: "Maintain",
          title: "Water and mulch do the heavy lifting",
          text: `Zone ${zone} summer planting needs even moisture, weed control, and shade/irrigation for stressed transplants.`
        },
        {
          label: "Plan next",
          title: "Prepare for fall cool crops",
          text: `Start planning greens, roots, brassicas, garlic, and nursery planting around the ${profile.firstFrost} season.`
        }
      ];
    }
    if (season === "fall") {
      return [
        {
          label: "Plant now",
          title: "Fall roots, greens, perennials, and woody plants",
          text: `The ${profile.firstFrost} window is ideal for cool crops and a strong establishment season for many trees, shrubs, natives, and grasses.`
        },
        {
          label: "Protect",
          title: "Watch the first hard freeze",
          text: "Use row cover for tender crops and keep new plantings watered until the soil cools."
        },
        {
          label: "Plan next",
          title: "Order dormant fruit and bare-root plants",
          text: "Fall is a good time to choose cultivars, map spacing, and prepare soil for late winter or spring planting."
        }
      ];
    }
    return [
      {
        label: "Plan now",
        title: "Use winter for ordering and layout",
        text: "Compare cultivar chill needs, spacing, containers, and mature size before the spring rush."
      },
      {
        label: "Plant where appropriate",
        title: "Dormant woody plants can work in open soil",
        text: "Bare-root and dormant nursery planting can work when soil is workable and a hard freeze is not imminent."
      },
      {
        label: "Prepare next",
        title: "Start seed timing from the last-frost window",
        text: `Use the ZIP calendar to anchor seed-starting to the ${profile.lastFrost} transition.`
      }
    ];
  }

  if (target.intent === "fruit-trees") {
    return [
      {
        label: "Hardiness",
        title: `Zone ${zone} is good fruit-tree territory`,
        text: `The winter-low range is ${profile.tempRange}, which fits many classic fruit trees and woody edibles in the database.`
      },
      {
        label: "Chill and bloom",
        title: "Cultivar choice still decides reliability",
        text: `${profile.chillCue}. Match bloom time to local frost risk before picking peaches, plums, cherries, apples, and pears.`
      },
      {
        label: "Site conditions",
        title: "Drainage and airflow are not optional",
        text: `Fruit trees need sun, drainage, spacing, and airflow. Humid zone ${zone} sites should prioritize disease resistance and pruning access.`
      }
    ];
  }

  if (target.intent === "native-plants") {
    return [
      {
        label: "Hardiness",
        title: "Zone fit is only the entry point",
        text: `These native-cue plants fit zone ${zone}, but local range, ecoregion, soil moisture, and seed provenance still matter.`
      },
      {
        label: "Habitat layers",
        title: "Mix forms instead of planting one row",
        text: "A strong habitat plan includes flowering perennials, grasses or sedges, shrubs, and woody layers where space allows."
      },
      {
        label: "Establishment",
        title: "Fall and spring are your friend",
        text: `In zone ${zone}, native perennials and woody plants usually establish best before summer heat or after it breaks.`
      }
    ];
  }

  return shared;
}

export function zonePageHighlightGroups(target, entries) {
  if (target.intent === "fruit-trees") {
    return [
      {
        title: "Classic orchard candidates",
        description: "Tree fruits that deserve cultivar-level research for chill, bloom timing, rootstock, disease resistance, and spacing.",
        entries: uniqueEntries(entries, (plant) => matchesPlantTerms(plant, /apple|pear|peach|plum|cherry|persimmon|fig|pawpaw/), 6)
      },
      {
        title: "Berries, vines, and shrub fruit",
        description: "Useful edible layers for smaller yards, fences, trellises, and mixed edible landscapes.",
        entries: uniqueEntries(entries, (plant) => matchesPlantTerms(plant, /berry|blueberry|blackberry|raspberry|grape|muscadine|currant|gooseberry|elderberry|aronia|vine|cane/), 6)
      },
      {
        title: "Specialty and edge-case fruit",
        description: "Worth considering in protected sites, warm microclimates, or with extra cultivar research.",
        entries: uniqueEntries(entries, (plant) => matchesPlantTerms(plant, /pomegranate|jujube|almond|pecan|chestnut|hazelnut|quince|medlar|mulberry|kiwi|passionfruit|olive|loquat/), 6)
      }
    ].filter((group) => group.entries.length);
  }

  if (target.intent === "native-plants") {
    return [
      {
        title: "Pollinator perennials",
        description: "Flowering habitat plants to combine by bloom season, moisture, height, and sun exposure.",
        entries: uniqueEntries(entries, (plant) => matchesPlantTerms(plant, /milkweed|coneflower|bee balm|hyssop|aster|goldenrod|liatris|phlox|penstemon|lobelia|columbine|bergamot|zizia|rudbeckia|coreopsis|flower|perennial/), 6)
      },
      {
        title: "Shrubs and woody layers",
        description: "Structure, nesting cover, berries, shade, and four-season habitat value where space allows.",
        entries: uniqueEntries(entries, (plant) => matchesPlantTerms(plant, /tree|shrub|oak|maple|serviceberry|redbud|dogwood|viburnum|holly|elderberry|spicebush|witch hazel|magnolia|sumac|button/), 6)
      },
      {
        title: "Grasses, sedges, and ground layers",
        description: "Useful for matrix planting, erosion control, winter texture, and lower-canopy habitat.",
        entries: uniqueEntries(entries, (plant) => matchesPlantTerms(plant, /grass|sedge|oats|bluestem|switchgrass|dropseed|grama|phlox|foamflower|ginger|green and gold|mayapple|bloodroot/), 6)
      }
    ].filter((group) => group.entries.length);
  }

  if (target.intent === "plant-now") {
    const season = currentSeasonLabel();
    if (season === "spring") {
      return [
        {
          title: "Plant now after frost",
          description: "Warm-season crops and herbs that belong after the spring frost transition.",
          entries: uniqueEntries(entries, (plant) => plantSeasonClass(plant) === "warm", 6)
        },
        {
          title: "Set with steady watering",
          description: "Woody, perennial, and nursery plants that can establish if you can water through early heat.",
          entries: uniqueEntries(entries, (plant) => plantSeasonClass(plant) === "nursery", 6)
        },
        {
          title: "Plan for a fall repeat",
          description: "Cool-season crops to revisit when the fall shoulder season approaches.",
          entries: uniqueEntries(entries, (plant) => plantSeasonClass(plant) === "cool", 6)
        }
      ].filter((group) => group.entries.length);
    }
    if (season === "summer") {
      return [
        {
          title: "Heat-tolerant plant-now options",
          description: "Warm-season crops and herbs that fit summer planting better than cool-season crops.",
          entries: uniqueEntries(entries, (plant) => plantSeasonClass(plant) === "warm", 6)
        },
        {
          title: "Keep on the fall list",
          description: "Cool-season crops and nursery plants to schedule when heat eases.",
          entries: uniqueEntries(entries, (plant) => plantSeasonClass(plant) !== "warm", 6)
        }
      ].filter((group) => group.entries.length);
    }
    if (season === "fall") {
      return [
        {
          title: "Fall planting priorities",
          description: "Cool-season crops, garlic/onions, perennials, natives, and woody plants that suit fall timing.",
          entries: uniqueEntries(entries, (plant) => plantSeasonClass(plant) === "cool" || plantSeasonClass(plant) === "nursery", 8)
        },
        {
          title: "Protect or finish before frost",
          description: "Warm-season crops to harvest, protect, or replace as the first-frost window approaches.",
          entries: uniqueEntries(entries, (plant) => plantSeasonClass(plant) === "warm", 6)
        }
      ].filter((group) => group.entries.length);
    }
    return [
      {
        title: "Winter planning shortlist",
        description: "Profiles worth comparing now for spacing, chill needs, first output, and spring timing.",
        entries: entries.slice(0, 8)
      }
    ];
  }

  return [
    {
      title: "Cool-season windows",
      description: "Crops that usually depend on spring and fall timing rather than summer heat.",
      entries: uniqueEntries(entries, (plant) => plantSeasonClass(plant) === "cool", 6)
    },
    {
      title: "Warm-season windows",
      description: "Crops that wait for warm soil and the last-frost transition.",
      entries: uniqueEntries(entries, (plant) => plantSeasonClass(plant) === "warm", 6)
    },
    {
      title: "Nursery and perennial windows",
      description: "Trees, shrubs, vines, native perennials, and grasses best established outside severe heat or frozen soil.",
      entries: uniqueEntries(entries, (plant) => plantSeasonClass(plant) === "nursery", 6)
    }
  ].filter((group) => group.entries.length);
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
  const zoneLabel = target.zone;
  const profile = zoneProfileForTarget(target);
  const base = [
    {
      title: "Use hardiness as the first gate",
      text: `These plants fit USDA zone ${zoneLabel} by database range. A ZIP lookup still matters because county, elevation, nearby water, and city heat can move frost risk.`
    },
    {
      title: "Check the season window",
      text: `For ${target.intent === "plant-now" ? "current tasks" : "planting calendars"}, Plant by ZIP uses practical frost-window heuristics. In zone ${zoneLabel}, that often means ${profile.lastFrost} and ${profile.firstFrost}; soil temperature and the 10-day forecast still decide the exact day.`
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
      text: `Zone ${zoneLabel} fruit can fail from chill mismatch, early bloom frost, humidity, or heat even when the hardiness range looks right.`
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

export function zonePageFaqs(target, entries = []) {
  const profile = zoneProfileForTarget(target);
  const zoneLabel = target.zone;
  const base = [
    {
      question: `What does USDA zone ${zoneLabel} mean?`,
      answer: `USDA zone ${zoneLabel} describes average annual extreme minimum temperature. For this page, the working winter-low range is ${profile.tempRange}. It does not describe summer heat, rainfall, humidity, soil, wind, or native range.`
    },
    {
      question: `Are these recommendations ZIP-specific?`,
      answer: `No. This page is a crawlable zone-level guide built from ${entries.length} Plant by ZIP database matches. Use the ZIP matcher or calendar for a more local frost, heat, and condition-aware shortlist.`
    },
    {
      question: `Why can two zone ${zoneLabel} gardens need different plants?`,
      answer: `${profile.caution} Soil drainage, sun exposure, irrigation, slope, and regional disease pressure can change plant performance within the same hardiness zone.`
    }
  ];

  if (target.intent === "fruit-trees") {
    base.push({
      question: `What fruit-tree factor matters most in zone ${zoneLabel}?`,
      answer: "Hardiness gets a fruit tree through winter, but chill hours, bloom timing, rootstock, disease resistance, drainage, and airflow usually decide whether it produces well."
    });
  } else if (target.intent === "native-plants") {
    base.push({
      question: `Does a zone ${zoneLabel} native-cue plant mean it is locally native?`,
      answer: "No. These pages use hardiness and database cues to shortlist habitat-friendly plants. Confirm county or ecoregion range, provenance, and site conditions before planting at scale."
    });
  } else if (target.intent === "plant-now") {
    base.push({
      question: `Can I plant everything listed right now?`,
      answer: "No. The list is sorted by zone fit and practical timing signals. Use the timing notes, local forecast, soil temperature, and plant profile before planting."
    });
  } else {
    base.push({
      question: `When should zone ${zoneLabel} gardeners start planting?`,
      answer: `Cool-season crops use the spring and fall shoulders, warm-season crops wait until after the ${profile.lastFrost} window, and woody or perennial plants usually establish best from fall through spring.`
    });
  }

  return base;
}
