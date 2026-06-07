export const TOOL_PAGES = [
  {
    slug: "what-to-plant-this-week",
    path: "/what-to-plant-this-week/",
    shortTitle: "Plant this week",
    eyebrow: "ZIP timing tool",
    title: "What to Plant This Week by ZIP Code",
    description: "Enter a ZIP code to get a practical this-week planting shortlist based on hardiness, frost timing, crop type, and days to harvest.",
    summary: "Built for the common garden-group question: can I still plant this right now, or should I wait?",
    toolId: "planting-now",
    ctaLabel: "Check my ZIP",
    productIds: ["soil-thermometer", "seed-starting-trays", "floating-row-cover", "frost-blanket", "low-tunnel-hoops", "garden-clips"]
  },
  {
    slug: "pest-damage-triage",
    path: "/tools/pest-damage-triage/",
    shortTitle: "Pest triage",
    eyebrow: "Damage checker",
    title: "Garden Pest and Damage Triage Tool",
    description: "Choose the damage you see and get a short list of likely causes, first checks, and low-drama next steps.",
    summary: "Use this before spraying anything. The tool narrows common garden damage patterns into a few practical checks.",
    toolId: "pest-triage",
    ctaLabel: "Diagnose damage",
    productIds: ["insect-netting", "floating-row-cover", "low-tunnel-hoops", "garden-clips", "animal-protection", "garden-gloves"]
  },
  {
    slug: "companion-planting-checker",
    path: "/tools/companion-planting-checker/",
    shortTitle: "Companion checker",
    eyebrow: "Pairing checker",
    title: "Companion Planting Checker",
    description: "Check two plants against Plant by ZIP pairing rules, pollination cues, spacing context, and site-fit overlap.",
    summary: "Built for quick questions like whether tomatoes and basil, carrots and onions, or fruit trees and understory plants make sense together.",
    toolId: "companion-checker",
    ctaLabel: "Check a pairing",
    productIds: ["plant-labels", "hand-trowel", "trellis-netting", "soft-plant-ties", "organic-mulch"]
  },
  {
    slug: "container-garden-calculator",
    path: "/tools/container-garden-calculator/",
    shortTitle: "Container calculator",
    eyebrow: "Pot-size checker",
    title: "Container Garden Calculator",
    description: "Search a plant and enter your pot size to check whether the container is workable, tight, or too small.",
    summary: "A fast answer for patio gardeners asking whether a tomato, blueberry, herb, shrub, or fruit tree can live in the pot they have.",
    toolId: "container-calculator",
    ctaLabel: "Check pot size",
    productIds: ["drainage-container", "container-potting-mix", "watering-wand", "balanced-fertilizer", "shade-cloth"]
  },
  {
    slug: "drip-irrigation-calculator",
    path: "/tools/drip-irrigation-calculator/",
    shortTitle: "Drip calculator",
    eyebrow: "Watering layout",
    title: "Drip Irrigation Calculator for Raised Beds",
    description: "Enter bed dimensions and crop spacing to estimate drip lines, tubing length, weekly water volume, and a starting runtime.",
    summary: "A practical layout calculator for gardeners trying to turn a raised bed into a simple drip system.",
    toolId: "drip-calculator",
    ctaLabel: "Calculate drip layout",
    productIds: ["drip-irrigation-kit", "hose-timer", "organic-mulch", "garden-clips", "watering-wand"]
  }
];

export function toolPageBySlug(slug) {
  return TOOL_PAGES.find((tool) => tool.slug === slug);
}

export function toolInternalLinks() {
  return TOOL_PAGES.map((tool) => ({
    href: tool.path,
    title: tool.shortTitle,
    description: tool.description
  }));
}
