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
    slug: "zone-7-vegetables",
    path: "/zone-7-vegetables/",
    shortTitle: "Zone 7 vegetables",
    eyebrow: "Zone 7 kitchen garden",
    title: "Best Vegetables and Herbs for Zone 7 Gardens",
    description: "Browse vegetable and herb profiles whose hardiness ranges fit USDA zone 7, with timing, spacing, container, and yield data.",
    summary: "Use this page as a Zone 7 shortlist before opening the ZIP calendar. It favors practical kitchen crops with first-output, spacing, and harvest data.",
    ctaLabel: "Open the Zone 7 calendar",
    ctaHref: "/planting-calendar/zone-7b/",
    filterLabel: "Zone 7 kitchen crops",
    match: (plant) => plant.goals.includes("vegetables-herbs") && (plantFitsZoneNumber(plant, 7) || plantFitsZoneNumber(plant, 7.5))
  },
  {
    slug: "what-to-grow-in-a-4x8-raised-bed",
    path: "/what-to-grow-in-a-4x8-raised-bed/",
    shortTitle: "4x8 raised bed crops",
    eyebrow: "Small-space crops",
    title: "What to Grow in a 4x8 Raised Bed",
    description: "Compare compact vegetables, herbs, and small-space crops that can make sense in a 4x8 raised bed.",
    summary: "A 4x8 bed is only 32 square feet, so this collection favors crops with manageable spacing, container-friendly habits, or strong output per square foot.",
    ctaLabel: "Open 4x8 garden templates",
    ctaHref: "/garden-plans/zone-7-4x8-vegetable-garden/",
    filterLabel: "Small-bed candidates",
    match: (plant, metrics = {}) => plant.goals.includes("vegetables-herbs")
      && !/tree|shrub|cane|nut|citrus/i.test(plant.type)
      && (Number(metrics.spacingAreaSqFtMax) <= 16 || ["good", "workable"].includes(metrics.containerSuitability))
  },
  {
    slug: "deer-resistant-garden-plants",
    path: "/deer-resistant-garden-plants/",
    shortTitle: "Deer-resistant plants",
    eyebrow: "Browse-pressure planning",
    title: "Deer-Resistant Garden Plants",
    description: "Browse plants with better deer-resistance cues, based on the Plant by ZIP screening data and extension-style browsing categories.",
    summary: "No plant is deer proof. This page filters for plants marked rarely damaged or seldom damaged so you can start with a better shortlist.",
    ctaLabel: "Open deer-resistant bed plan",
    ctaHref: "/garden-plans/deer-resistant-pollinator-bed/",
    filterLabel: "Better deer cues",
    match: (plant, metrics = {}) => ["rarely-damaged", "seldom-damaged"].includes(metrics.deerResistance)
  },
  {
    slug: "black-walnut-tolerant-plants",
    path: "/black-walnut-tolerant-plants/",
    shortTitle: "Black walnut tolerant plants",
    eyebrow: "Juglone planning",
    title: "Plants That Tolerate Black Walnut",
    description: "Find plants with black walnut or juglone tolerance cues in the Plant by ZIP database.",
    summary: "Use this collection when planting near black walnut roots or canopy. It filters for tolerant records, then points you back to ZIP and site checks.",
    ctaLabel: "Open the plant screener",
    ctaHref: "/?swalnut=tolerant#screener",
    filterLabel: "Juglone-tolerant profiles",
    match: (plant, metrics = {}) => metrics.jugloneTolerance === "tolerant"
  },
  {
    slug: "full-sun-clay-soil-plants",
    path: "/full-sun-clay-soil-plants/",
    shortTitle: "Full sun clay soil plants",
    eyebrow: "Tough-site shortlist",
    title: "Plants for Full Sun and Clay Soil",
    description: "Browse plants marked for both full sun and clay soil, including vegetables, perennials, shrubs, and practical landscape plants.",
    summary: "Clay soil and full sun can be productive when plants are chosen for the site. This page narrows the database to records with both cues.",
    ctaLabel: "Match clay-soil plants by ZIP",
    ctaHref: "/",
    filterLabel: "Full-sun clay candidates",
    match: (plant) => plant.sun.includes("full") && plant.soils.includes("clay")
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

function plantFitsZoneNumber(plant, targetZoneNumber) {
  const min = zoneToNumber(plant.zones?.[0]);
  const max = zoneToNumber(plant.zones?.[1]);
  return Number.isFinite(min) && Number.isFinite(max) && targetZoneNumber >= min && targetZoneNumber <= max;
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

const hubMethodCopy = {
  "planting-calendar": [
    ["Timing first", "Prioritizes records with first-output windows, harvest-window estimates, and planting-depth guidance."],
    ["ZIP before purchase", "Use the live calendar for frost context before starting seeds, setting transplants, or buying nursery stock."],
    ["Range language", "Dates and maturity windows stay broad because soil temperature, cultivar choice, and spring weather shift timing."]
  ],
  "native-plants": [
    ["Native cue", "Starts from native flags and plant-name or trait cues, then keeps site fit visible instead of treating native status as enough."],
    ["Local check", "County-level nativity is not encoded yet, so each match should be verified against a regional native-plant source."],
    ["Garden role", "Surfaces light, water, mature size, and wildlife function so native choices can still fit the actual yard."]
  ],
  "fruit-trees": [
    ["Bearing horizon", "Shows first-output and full-output timing so long-horizon crops are not compared like annual vegetables."],
    ["Space cost", "Uses mature-size and spacing data because tree crops can consume decades of yard space."],
    ["Yield caution", "Pound-return ranges are useful planning numbers, but rootstock, pruning, chill, and pest pressure can move them a lot."]
  ],
  "privacy-shrubs": [
    ["Screening scale", "Favors records with privacy goals, mature-size context, and spacing cues for hedges or living screens."],
    ["Maintenance fit", "Water, soil, and growth habit matter as much as height when a screen must survive with routine care."],
    ["Edible overlap", "Fruit and wildlife value are surfaced when a screen can do more than block a view."]
  ],
  "low-water-plants": [
    ["Water flag", "Filters for low-water records, then keeps establishment watering and site fit in the decision."],
    ["Dry-site risk", "Low water does not mean no water; mulch, drainage, and first-season irrigation still matter."],
    ["Useful tradeoffs", "Spacing, mature size, and container notes help separate rugged landscape plants from compact patio choices."]
  ],
  "vegetables-herbs": [
    ["Kitchen output", "Ranks annual crops and herbs with timing, spacing, container, and pound-return data where available."],
    ["Seasonal reality", "Annual crops are treated as one-season decisions, not long-term landscape investments."],
    ["Actionable numbers", "Cards emphasize first harvest, spacing, and output so gardeners can plan beds instead of reading filler."]
  ],
  "zone-7-vegetables": [
    ["Zone 7 fit", "Includes vegetables and herbs whose hardiness range covers USDA zone 7 before ZIP-specific frost timing is applied."],
    ["Warm and cool crops", "Keeps fast greens, herbs, fruiting vegetables, and longer-season crops in one comparable shortlist."],
    ["Calendar next", "The page is a shortlist; the planting calendar still handles local spring and fall timing."]
  ],
  "what-to-grow-in-a-4x8-raised-bed": [
    ["32 sq ft constraint", "Favors compact crops, workable container habits, or spacing ranges that can make sense in one 4x8 bed."],
    ["Spacing math", "Highlights plant spacing and square-foot pressure so large vines and sprawling crops are easier to spot."],
    ["Planner handoff", "Use the Garden Planner for quantities; this page is the candidate list before layout."]
  ],
  "deer-resistant-garden-plants": [
    ["Browse category", "Filters for Rutgers-style rarely damaged or seldom damaged cues when the database has them."],
    ["Not deer proof", "The page avoids guarantees because local deer pressure can override resistance ratings."],
    ["Protection context", "Cards keep spacing, water, and deer rating together so fencing or repellents can be planned early."]
  ],
  "black-walnut-tolerant-plants": [
    ["Juglone cue", "Filters for records marked tolerant in the black-walnut planning data."],
    ["Root-zone caveat", "Tolerance still depends on distance, drainage, soil life, cultivar, and tree age."],
    ["Placement check", "Use this list before planting under or near a walnut canopy, then verify locally for valuable plants."]
  ],
  "full-sun-clay-soil-plants": [
    ["Tough-site match", "Requires both full-sun and clay-soil cues so the page stays about a real planting problem."],
    ["Drainage matters", "Clay tolerance does not fix standing water; bed prep and slope still matter."],
    ["Use by layer", "Vegetables, perennials, shrubs, and trees remain visible so gardeners can plan a whole site."]
  ],
  "pollinator-plants": [
    ["Habitat role", "Starts with pollinator, wildlife, or native cues, then keeps bloom/display output and site fit visible."],
    ["Season coverage", "Harvest-window and bloom-window style data help identify gaps in spring, summer, and fall support."],
    ["Practical fit", "Water, spacing, and deer/juglone cues prevent habitat choices from becoming maintenance surprises."]
  ],
  "container-garden-plants": [
    ["Container signal", "Favors compact crops, herbs, berries, patio forms, and records with workable container guidance."],
    ["Volume check", "Container minimums are surfaced because pot size often matters more than the plant label."],
    ["Small-space yield", "Output, timing, and spacing help compare patio plants by return and effort."]
  ],
  "shade-plants": [
    ["Light filter", "Includes records that tolerate shade or partial sun, then keeps soil and water visible."],
    ["Understory fit", "Mature size, spacing, and water cues matter in north-side beds and tree-root competition."],
    ["Expectation setting", "Edible output and bloom can drop in lower light, so profile pages should still be checked."]
  ],
  "clay-soil-plants": [
    ["Clay cue", "Filters for records marked suitable for clay, then keeps drainage-sensitive metrics visible."],
    ["Amendment context", "Compost and mulch help structure, but plant choice is still the first filter."],
    ["Broad use", "Keeps crops, perennials, shrubs, and fruiting plants together for whole-yard planning."]
  ],
  "sandy-soil-plants": [
    ["Drainage cue", "Filters for sandy-soil records and favors plants that can handle faster-draining sites."],
    ["Water planning", "Sandy soil often needs more consistent irrigation even when the plant tolerates dry spells."],
    ["Mulch and organic matter", "Cards pair soil fit with water and spacing so amendments can be planned realistically."]
  ],
  "edible-hedges": [
    ["Food plus structure", "Requires edible or fruiting value along with hedge, vine, shrub, cane, or tree form."],
    ["Space and harvest", "Mature size, spacing, and output ranges show whether the hedge is practical or just romantic."],
    ["Multi-use value", "Wildlife, screening, and kitchen returns stay visible when a plant can do several jobs."]
  ]
};

const hubSourceCopy = {
  "deer-resistant-garden-plants": "Deer categories come from the plant metric source keys behind the visible records, especially Rutgers-style browsing ratings when available.",
  "black-walnut-tolerant-plants": "Juglone cues are traced to black-walnut tolerance references where the database has a defensible source key.",
  "what-to-grow-in-a-4x8-raised-bed": "Spacing, container, and yield references matter most here because a 4x8 bed is a space-budget problem.",
  "zone-7-vegetables": "Vegetable timing, spacing, container, and yield sources are prioritized so the page can feed the calendar and planner.",
  "fruit-trees": "Fruit-tree sources emphasize spacing, years to bearing, mature yield, rootstock caveats, and home-orchard planting guidance."
};

export function plantsForHub(hub, plants, plantMetrics) {
  return plants
    .filter((plant) => hub.match(plant, plantMetrics[plant.id] ?? {}))
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

export function hubPlantSummary(plant, metrics = {}, hub = null) {
  if (plant.harvest) return plant.harvest;
  if (plant.traits?.length) return plant.traits.slice(0, 2).join("; ");
  const display = metrics.display ?? {};
  if (isSourcedValue(display.matureSize)) return `Mature size: ${display.matureSize}.`;
  if (isSourcedValue(display.output)) return `Output: ${display.output}.`;
  return `${sentenceCase(plant.water)} water; ${plant.soils.map(sentenceCase).join("/")} soil.`;
}

export function hubPlantDataPoints(plant, metrics = {}, hub = null) {
  const display = metrics.display ?? {};
  const common = {
    zones: { label: "Zones", value: `${plant.zones[0]}-${plant.zones[1]}` },
    sun: { label: "Light", value: plant.sun.length ? `${plant.sun.map(sentenceCase).join("/")} sun` : "" },
    water: { label: "Water", value: `${sentenceCase(plant.water)} water` },
    soil: { label: "Soil", value: plant.soils.length ? plant.soils.map(sentenceCase).join("/") : "" },
    firstOutput: { label: "First output", value: isSourcedValue(display.firstOutput) ? display.firstOutput : "" },
    yield: { label: metrics.outputKind === "ornamental" ? "Display" : "Yield", value: isSourcedValue(display.yieldLbs) ? display.yieldLbs : isSourcedValue(display.output) ? display.output : "" },
    spacing: { label: "Spacing", value: isSourcedValue(display.spacing) ? display.spacing : "" },
    matureSize: { label: "Mature size", value: isSourcedValue(display.matureSize) ? display.matureSize : "" },
    container: { label: "Container", value: isSourcedValue(display.containerMin) ? display.containerMin : "" },
    deer: { label: "Deer", value: isSourcedValue(display.deerResistance) ? display.deerResistance : "" },
    walnut: { label: "Black walnut", value: isSourcedValue(display.jugloneTolerance) ? display.jugloneTolerance : "" },
    harvest: { label: "Harvest", value: isSourcedValue(display.harvestWindow) ? display.harvestWindow : "" }
  };
  const orderByHub = {
    "planting-calendar": ["firstOutput", "harvest", "spacing", "zones"],
    "native-plants": ["zones", "sun", "matureSize", "water"],
    "fruit-trees": ["firstOutput", "yield", "spacing", "matureSize"],
    "privacy-shrubs": ["matureSize", "spacing", "water", "zones"],
    "low-water-plants": ["water", "sun", "spacing", "container"],
    "vegetables-herbs": ["firstOutput", "yield", "spacing", "container"],
    "zone-7-vegetables": ["firstOutput", "yield", "spacing", "harvest"],
    "what-to-grow-in-a-4x8-raised-bed": ["spacing", "container", "yield", "firstOutput"],
    "deer-resistant-garden-plants": ["deer", "spacing", "water", "sun"],
    "black-walnut-tolerant-plants": ["walnut", "spacing", "sun", "water"],
    "full-sun-clay-soil-plants": ["soil", "water", "spacing", "matureSize"],
    "pollinator-plants": ["firstOutput", "yield", "sun", "deer"],
    "container-garden-plants": ["container", "spacing", "yield", "firstOutput"],
    "shade-plants": ["sun", "water", "matureSize", "spacing"],
    "clay-soil-plants": ["soil", "water", "spacing", "matureSize"],
    "sandy-soil-plants": ["soil", "water", "spacing", "container"],
    "edible-hedges": ["yield", "matureSize", "spacing", "firstOutput"]
  };
  const order = orderByHub[hub?.slug] ?? ["zones", "water", "sun", "firstOutput", "yield", "spacing"];
  return order
    .map((key) => common[key])
    .filter((fact) => fact?.value)
    .slice(0, 4);
}

export function hubPlantTags(plant) {
  return [
    ...plant.goals.slice(0, 2).map(formatGoal),
    ...plant.traits.slice(0, 2)
  ];
}

export function hubMethodCards(hub) {
  const cards = hubMethodCopy[hub.slug] ?? [
    ["Database filter", "Starts from structured plant records rather than freeform article text."],
    ["Practical fit", "Keeps hardiness, light, soil, water, spacing, and timing visible."],
    ["Local verification", "Profile pages link to source trails and caveats for high-stakes planting decisions."]
  ];
  return cards.map(([label, detail]) => ({ label, detail }));
}

export function hubSourceIntro(hub) {
  return hubSourceCopy[hub.slug]
    ?? "These are the most common planning references behind the visible records on this page.";
}

export function hubSourceKeyCounts(entries, limit = 6) {
  const counts = new Map();
  entries.forEach(({ metrics }) => {
    [
      ...(metrics.sourceKeys ?? []),
      ...(metrics.deerResistanceSourceKeys ?? []),
      ...(metrics.jugloneToleranceSourceKeys ?? [])
    ].forEach((key) => counts.set(key, (counts.get(key) ?? 0) + 1));
  });
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }));
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
  "zone-7-vegetables": ["seed-starting-trays", "seedling-heat-mat", "grow-light", "soil-thermometer"],
  "what-to-grow-in-a-4x8-raised-bed": ["finished-compost", "drip-irrigation-kit", "tomato-cage-stakes", "insect-netting"],
  "deer-resistant-garden-plants": ["animal-protection", "organic-mulch", "hand-trowel", "watering-wand"],
  "black-walnut-tolerant-plants": ["soil-test-lab-mailer", "organic-mulch", "digging-spade", "watering-wand"],
  "full-sun-clay-soil-plants": ["soil-test-lab-mailer", "finished-compost", "organic-mulch", "digging-spade"],
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
