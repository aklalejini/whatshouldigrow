import { directoryEntries, zoneToNumber } from "./plantDirectory.js";
import { isSourcedValue, plantUrl, relationshipIdentity, termMatchesIdentity } from "./plantUtils.js";

export const PLANT_FAMILY_MIN_COUNT = 3;

export const PLANT_FAMILIES = [
  {
    slug: "tomato-varieties",
    label: "Tomato varieties",
    shortLabel: "Tomatoes",
    title: "Tomato Varieties Compared",
    terms: ["tomato"],
    typeIncludes: ["annual vegetable"],
    decisionPoints: ["Spacing for cages, stakes, or containers", "Days to maturity", "Yield per plant"],
    intro: "Compare tomato varieties by spacing, days to maturity, yield notes, container fit, and garden role."
  },
  {
    slug: "squash-pumpkin-zucchini-varieties",
    label: "Squash, pumpkin, and zucchini varieties",
    shortLabel: "Squash",
    title: "Squash, Pumpkin, and Zucchini Varieties Compared",
    terms: ["squash", "zucchini", "pumpkin", "butternut", "acorn squash", "spaghetti squash", "gourd"],
    typeIncludes: ["annual vegetable", "perennial vegetable", "annual fruit vine"],
    excludeTerms: ["wax gourd"],
    decisionPoints: ["Hill and row spacing", "Days to maturity", "Fresh eating versus storage"],
    intro: "Compare summer squash, winter squash, pumpkins, gourds, and zucchini for spacing, harvest timing, and use."
  },
  {
    slug: "watermelon-varieties",
    label: "Watermelon varieties",
    shortLabel: "Watermelons",
    title: "Watermelon Varieties Compared",
    terms: ["watermelon"],
    typeIncludes: ["annual fruit vine"],
    excludeTerms: ["watermelon radish"],
    decisionPoints: ["Vine spacing", "Days to maturity", "Fruit size and harvest goal"],
    intro: "Compare watermelon varieties by vine spacing, maturity window, container practicality, and harvest expectations."
  },
  {
    slug: "melon-varieties",
    label: "Melon varieties",
    shortLabel: "Melons",
    title: "Melon Varieties Compared",
    terms: ["cantaloupe", "muskmelon", "melon", "honeydew", "charentais", "korean melon", "hami melon", "bitter melon"],
    typeIncludes: ["annual fruit vine"],
    excludeTerms: ["watermelon"],
    decisionPoints: ["Vine spacing", "Days to maturity", "Flavor and harvest style"],
    intro: "Compare cantaloupe, honeydew, specialty melons, and related edible vines by spacing and maturity timing."
  },
  {
    slug: "pear-varieties",
    label: "Pear varieties",
    shortLabel: "Pears",
    title: "Pear Varieties Compared",
    terms: ["pear"],
    typeIncludes: ["fruit tree"],
    decisionPoints: ["Pollination needs", "First bearing age", "Tree spacing and mature size"],
    intro: "Compare European, Asian, and hybrid pear profiles by hardiness, spacing, first output, and yield range."
  },
  {
    slug: "asian-pear-varieties",
    label: "Asian pear varieties",
    shortLabel: "Asian pears",
    title: "Asian Pear Varieties Compared",
    terms: ["asian pear", "hosui", "shinseiki", "20th century", "korean giant", "olympic asian pear", "chojuro", "shinko", "kosui", "ya li", "tennosui"],
    typeIncludes: ["fruit tree"],
    decisionPoints: ["Chill and zone fit", "Pollination pairings", "Tree spacing and first bearing"],
    intro: "Compare Asian pear varieties for zone fit, pollination planning, spacing, and expected output timing."
  },
  {
    slug: "persimmon-varieties",
    label: "Persimmon varieties",
    shortLabel: "Persimmons",
    title: "Persimmon Varieties Compared",
    terms: ["persimmon"],
    typeIncludes: ["fruit tree"],
    decisionPoints: ["Astringent versus non-astringent use", "Cold hardiness", "First bearing age"],
    intro: "Compare Asian, American, and hybrid persimmons by cold hardiness, spacing, harvest timing, and use."
  },
  {
    slug: "fig-varieties",
    label: "Fig varieties",
    shortLabel: "Figs",
    title: "Fig Varieties Compared",
    terms: ["fig"],
    typeIncludes: ["fruit tree"],
    decisionPoints: ["Cold protection", "Container fit", "First bearing and yield"],
    intro: "Compare fig varieties for hardiness, container growing, mature size, first output, and expected yield."
  },
  {
    slug: "blueberry-varieties",
    label: "Blueberry varieties",
    shortLabel: "Blueberries",
    title: "Blueberry Varieties Compared",
    terms: ["blueberry"],
    typeIncludes: ["fruit shrub"],
    decisionPoints: ["Soil acidity", "Chill and zone fit", "Spacing and pollination"],
    intro: "Compare blueberry varieties by type, hardiness, spacing, soil needs, and first productive years."
  },
  {
    slug: "apple-varieties",
    label: "Apple varieties",
    shortLabel: "Apples",
    title: "Apple Varieties Compared",
    terms: ["apple"],
    typeIncludes: ["fruit tree"],
    decisionPoints: ["Pollination", "Rootstock and spacing", "First bearing age"],
    intro: "Compare apple varieties by zone fit, spacing, first bearing, disease pressure, and harvest role."
  },
  {
    slug: "plum-varieties",
    label: "Plum varieties",
    shortLabel: "Plums",
    title: "Plum Varieties Compared",
    terms: ["plum", "prune plum", "japanese plum"],
    typeIncludes: ["fruit tree", "fruit shrub"],
    excludeTerms: ["plum yew"],
    decisionPoints: ["Japanese versus European plum fit", "Pollination", "Tree spacing"],
    intro: "Compare plum varieties by hardiness, first output, spacing, and whether they suit fresh eating or preserving."
  },
  {
    slug: "cherry-varieties",
    label: "Cherry varieties",
    shortLabel: "Cherries",
    title: "Cherry Varieties Compared",
    terms: ["cherry", "bush cherry", "tart cherry", "sweet cherry"],
    typeIncludes: ["fruit tree", "fruit shrub"],
    excludeTerms: ["cherry tomato", "cherry laurel"],
    decisionPoints: ["Sweet versus tart use", "Pollination", "Tree or bush size"],
    intro: "Compare sweet, tart, and bush cherry profiles by zone fit, spacing, first output, and use."
  },
  {
    slug: "pepper-varieties",
    label: "Pepper varieties",
    shortLabel: "Peppers",
    title: "Pepper Varieties Compared",
    terms: ["pepper"],
    typeIncludes: ["annual vegetable"],
    decisionPoints: ["Plant spacing", "Days to maturity", "Heat level and harvest use"],
    intro: "Compare sweet and hot pepper varieties by spacing, days to maturity, container fit, and harvest role."
  },
  {
    slug: "eggplant-varieties",
    label: "Eggplant varieties",
    shortLabel: "Eggplants",
    title: "Eggplant Varieties Compared",
    terms: ["eggplant"],
    typeIncludes: ["annual vegetable"],
    decisionPoints: ["Plant spacing", "Days to maturity", "Fruit size and container fit"],
    intro: "Compare eggplant varieties by spacing, maturity, container fit, and garden use."
  },
  {
    slug: "grape-varieties",
    label: "Grape varieties",
    shortLabel: "Grapes",
    title: "Grape Varieties Compared",
    terms: ["grape", "muscadine"],
    typeIncludes: ["fruit vine", "grape vine"],
    decisionPoints: ["Trellis spacing", "Cold hardiness", "Fresh eating versus wine or jelly"],
    intro: "Compare grape and muscadine varieties by zone fit, trellis spacing, harvest role, and output timing."
  },
  {
    slug: "blackberry-varieties",
    label: "Blackberry varieties",
    shortLabel: "Blackberries",
    title: "Blackberry Varieties Compared",
    terms: ["blackberry"],
    typeIncludes: ["berry cane"],
    decisionPoints: ["Thornless habit", "Cane spacing", "First fruiting season"],
    intro: "Compare blackberry varieties by cane habit, spacing, first output, and practical harvest role."
  },
  {
    slug: "raspberry-varieties",
    label: "Raspberry varieties",
    shortLabel: "Raspberries",
    title: "Raspberry Varieties Compared",
    terms: ["raspberry"],
    typeIncludes: ["berry cane"],
    decisionPoints: ["Summer versus fall bearing", "Cane spacing", "Color and harvest timing"],
    intro: "Compare raspberry varieties by cane spacing, first output, harvest window, and fruit color."
  },
  {
    slug: "bean-varieties",
    label: "Bean varieties",
    shortLabel: "Beans",
    title: "Bean Varieties Compared",
    terms: ["bean", "soybean"],
    typeIncludes: ["annual vegetable", "annual fruit vine"],
    decisionPoints: ["Bush versus pole habit", "Row spacing", "Fresh eating, dry beans, or ornament"],
    intro: "Compare bean varieties by growth habit, spacing, maturity timing, and harvest role."
  },
  {
    slug: "cucumber-varieties",
    label: "Cucumber varieties",
    shortLabel: "Cucumbers",
    title: "Cucumber Varieties Compared",
    terms: ["cucumber"],
    typeIncludes: ["annual vegetable", "annual fruit vine"],
    decisionPoints: ["Trellis spacing", "Slicing versus pickling", "Days to maturity"],
    intro: "Compare cucumber varieties by spacing, trellis fit, maturity timing, and harvest use."
  }
];

export function familyComparisonUrl(family) {
  return `/plants/compare/${family.slug}/`;
}

function typeMatches(plant, family) {
  const plantType = String(plant.type ?? "").toLowerCase();
  return !family.typeIncludes?.length || family.typeIncludes.some((type) => plantType.includes(type));
}

export function plantMatchesFamily(plant, family) {
  const identity = relationshipIdentity(plant);
  const matchesTerm = family.terms.some((term) => termMatchesIdentity(identity, term));
  const excluded = (family.excludeTerms ?? []).some((term) => termMatchesIdentity(identity, term));
  return matchesTerm && !excluded && typeMatches(plant, family);
}

export function entriesForFamily(family, plants, plantMetrics) {
  return directoryEntries(plants, plantMetrics, (plant) => plantMatchesFamily(plant, family));
}

export function activePlantFamilies(plants, plantMetrics, minimumCount = PLANT_FAMILY_MIN_COUNT) {
  return PLANT_FAMILIES
    .map((family) => ({
      ...family,
      count: entriesForFamily(family, plants, plantMetrics).length
    }))
    .filter((family) => family.count >= minimumCount)
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function familyBySlug(slug, plants, plantMetrics) {
  return activePlantFamilies(plants, plantMetrics).find((family) => family.slug === slug) ?? null;
}

export function familiesForPlant(plant, plants, plantMetrics) {
  return activePlantFamilies(plants, plantMetrics)
    .filter((family) => plantMatchesFamily(plant, family));
}

export function familyZoneRange(entries) {
  const zoneValues = entries
    .flatMap(({ plant }) => plant.zones ?? [])
    .map(zoneToNumber)
    .filter(Number.isFinite);
  if (!zoneValues.length) return "";
  const min = Math.min(...zoneValues);
  const max = Math.max(...zoneValues);
  return `${formatZoneNumber(min)}-${formatZoneNumber(max)}`;
}

export function familyMetricCoverage(entries) {
  const hasSpacing = entries.filter(({ metrics }) => isSourcedValue(metrics.display?.spacing)).length;
  const hasYield = entries.filter(({ metrics }) => isSourcedValue(metrics.display?.yieldLbs ?? metrics.display?.output)).length;
  const hasFirstOutput = entries.filter(({ metrics }) => isSourcedValue(metrics.display?.firstOutput)).length;
  return { hasSpacing, hasYield, hasFirstOutput };
}

export function familyComparisonJsonLd(family, entries, siteUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: family.title,
    numberOfItems: entries.length,
    itemListElement: entries.slice(0, 100).map(({ plant }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: plant.name,
      url: siteUrl(plantUrl(plant))
    }))
  };
}

function formatZoneNumber(value) {
  const whole = Math.floor(value);
  return `${whole}${value % 1 === 0.5 ? "b" : "a"}`;
}
