let toolPlants = [];
let toolMetrics = {};
let toolProducts = [];
let toolRelationships = [];
let toolDataPromise = null;
window.__plantByZipToolsReady = true;
const toolZoneCache = new Map();
const toolZoneStorageKey = "plantbyzip.zoneCache.v1";
const toolZoneLookupTimeoutMs = 8000;
const toolDataUrls = {
  plants: "/data/plants.json",
  metrics: "/data/plant-metrics-core.json",
  products: "/data/affiliate-products.json",
  relationships: "/data/plant-relationships.json"
};

async function toolLoadJson(url) {
  const response = await fetch(url, { credentials: "same-origin" });
  if (!response.ok) throw new Error(`Unable to load ${url}`);
  return response.json();
}

async function ensureToolData() {
  if (toolPlants.length) return;
  if (!toolDataPromise) {
    toolDataPromise = Promise.all([
      toolLoadJson(toolDataUrls.plants),
      toolLoadJson(toolDataUrls.metrics),
      toolLoadJson(toolDataUrls.products),
      toolLoadJson(toolDataUrls.relationships)
    ]).then(([plants, metrics, products, relationships]) => {
      toolPlants = plants;
      toolMetrics = metrics;
      toolProducts = products;
      toolRelationships = relationships;
      populateToolPlantLists();
    });
  }
  await toolDataPromise;
}

function toolEscape(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sentenceCase(value) {
  const text = String(value ?? "").replaceAll("-", " ");
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

function formatList(values) {
  return (values ?? []).map(sentenceCase).join(", ");
}

function formatNumber(value, digits = 1) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "";
  return Number.isInteger(number) ? String(number) : String(Math.round(number * (10 ** digits)) / (10 ** digits));
}

function metricFor(plant) {
  return toolMetrics[plant?.id] ?? {};
}

function productById(id) {
  return toolProducts.find((product) => product.id === id);
}

function productLink(product, placement, label = "View") {
  if (!product?.affiliateUrl) return "";
  return `<a class="tool-product-link" href="${toolEscape(product.affiliateUrl)}" target="_blank" rel="sponsored noopener noreferrer" data-partner-placement="${toolEscape(placement)}">${toolEscape(label)}</a>`;
}

function renderProductCards(ids, placement) {
  const products = ids.map(productById).filter(Boolean);
  if (!products.length) return "";
  return `
    <section class="tool-product-strip" aria-label="Relevant supplies">
      <div class="tool-result-head">
        <p class="eyebrow">Helpful supplies</p>
        <p>Product links are separate from the tool result and may earn a commission.</p>
      </div>
      <div class="tool-product-grid">
        ${products.map((product) => `
          <article class="tool-product-card">
            <span>${toolEscape(product.category)} / ${toolEscape(product.timing)}</span>
            <strong>${toolEscape(product.name)}</strong>
            <p>${toolEscape(product.use)}</p>
            ${productLink(product, placement)}
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function trackToolEvent(action, params = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", action, params);
  }
}

function populateToolPlantLists() {
  const options = toolPlants
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((plant) => `<option value="${toolEscape(plant.name)}"></option>`)
    .join("");
  document.querySelectorAll("#plantbyzip-tool-plants").forEach((list) => {
    list.innerHTML = options;
  });
}

function normalizeSearch(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function plantIdentity(plant) {
  return normalizeSearch(`${plant?.id ?? ""} ${plant?.name ?? ""} ${plant?.query ?? ""} ${plant?.type ?? ""} ${plant?.notes ?? ""} ${(plant?.traits ?? []).join(" ")}`);
}

function termMatchesIdentity(identity, term) {
  const cleanTerm = normalizeSearch(term);
  if (!cleanTerm) return false;
  return new RegExp(`(^| )${cleanTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}( |$)`).test(identity);
}

function plantHasAnyTerm(plant, terms = []) {
  const identity = plantIdentity(plant);
  return terms.some((term) => termMatchesIdentity(identity, term));
}

function findToolPlant(query) {
  const clean = normalizeSearch(query);
  if (!clean) return null;
  return toolPlants.find((plant) => normalizeSearch(plant.name) === clean)
    ?? toolPlants.find((plant) => normalizeSearch(plant.id) === clean)
    ?? toolPlants.find((plant) => normalizeSearch(plant.query) === clean)
    ?? toolPlants.find((plant) => plantIdentity(plant).includes(clean))
    ?? null;
}

function readStoredZoneCache() {
  try {
    return JSON.parse(window.localStorage?.getItem(toolZoneStorageKey) || "{}");
  } catch (error) {
    return {};
  }
}

function writeStoredZone(zip, data) {
  try {
    const cache = readStoredZoneCache();
    cache[zip] = { ...data, cachedAt: new Date().toISOString() };
    const entries = Object.entries(cache)
      .sort((a, b) => String(b[1].cachedAt ?? "").localeCompare(String(a[1].cachedAt ?? "")))
      .slice(0, 30);
    window.localStorage?.setItem(toolZoneStorageKey, JSON.stringify(Object.fromEntries(entries)));
  } catch (error) {
    // The tool still works without localStorage.
  }
}

function storedZoneForZip(zip) {
  const cached = readStoredZoneCache()[zip];
  return cached?.zone ? cached : null;
}

async function fetchZoneWithTimeout(url) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), toolZoneLookupTimeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error("Zone lookup failed");
    const data = await response.json();
    if (!data.zone) throw new Error("Zone missing from lookup");
    return data;
  } finally {
    window.clearTimeout(timer);
  }
}

async function lookupToolZone(zip) {
  if (toolZoneCache.has(zip)) return toolZoneCache.get(zip);
  try {
    const data = await fetchZoneWithTimeout(`https://phzmapi.org/${zip}.json`);
    toolZoneCache.set(zip, data);
    writeStoredZone(zip, data);
    return data;
  } catch (error) {
    const cached = storedZoneForZip(zip);
    if (cached) {
      toolZoneCache.set(zip, cached);
      return cached;
    }
    throw error;
  }
}

function zoneToNumber(zone) {
  const match = String(zone ?? "").trim().toLowerCase().match(/^(\d{1,2})([ab])?$/);
  if (!match) return Number.NaN;
  return Number(match[1]) + (match[2] === "b" ? 0.5 : 0);
}

function plantFitsZone(plant, zoneNumber) {
  const min = zoneToNumber(plant.zones?.[0]);
  const max = zoneToNumber(plant.zones?.[1]);
  return Number.isFinite(min) && Number.isFinite(max) && zoneNumber >= min - 0.25 && zoneNumber <= max + 0.25;
}

function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return startOfDay(copy);
}

const dayMs = 24 * 60 * 60 * 1000;
const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const frostAnchors = [
  { zone: 2, last: 162, first: 248 },
  { zone: 3, last: 149, first: 262 },
  { zone: 4, last: 139, first: 272 },
  { zone: 5, last: 128, first: 283 },
  { zone: 6, last: 115, first: 293 },
  { zone: 7, last: 102, first: 305 },
  { zone: 8, last: 87, first: 319 },
  { zone: 9, last: 69, first: 339 },
  { zone: 10, last: 46, first: 359 },
  { zone: 11, last: 20, first: 365 },
  { zone: 12, last: 10, first: 365 }
];
const plantingTerms = {
  warmTransplant: ["tomato", "pepper", "eggplant", "tomatillo", "basil"],
  warmDirect: ["bean", "corn", "cucumber", "squash", "zucchini", "pumpkin", "melon", "watermelon", "cantaloupe", "okra", "cowpea", "edamame", "sweet potato", "yardlong"],
  coolDirect: ["lettuce", "spinach", "arugula", "mizuna", "radish", "carrot", "beet", "turnip", "daikon", "pea", "cilantro", "dill", "mustard", "bok choy", "pak choi", "tatsoi", "komatsuna"],
  coolTransplant: ["broccoli", "cabbage", "cauliflower", "kale", "collards", "chard", "brussels", "parsley", "onion", "leek", "celery", "gai lan"],
  potato: ["potato"],
  garlic: ["garlic"],
  tenderContainer: ["citrus", "kumquat", "calamondin", "yuzu", "mandarin", "orange tree", "lemon tree", "lime tree", "banana", "dragon fruit"]
};

function dateFromDay(year, dayOfYear) {
  const date = new Date(year, 0, 1);
  date.setDate(Math.round(dayOfYear));
  return startOfDay(date);
}

function formatDate(date) {
  return `${monthLabels[date.getMonth()]} ${date.getDate()}`;
}

function interpolateFrost(zoneNumber, key) {
  const clampedZone = Math.min(12, Math.max(2, zoneNumber));
  let lower = frostAnchors[0];
  let upper = frostAnchors[frostAnchors.length - 1];
  for (let index = 0; index < frostAnchors.length - 1; index += 1) {
    if (clampedZone >= frostAnchors[index].zone && clampedZone <= frostAnchors[index + 1].zone) {
      lower = frostAnchors[index];
      upper = frostAnchors[index + 1];
      break;
    }
  }
  if (lower.zone === upper.zone) return lower[key];
  const ratio = (clampedZone - lower.zone) / (upper.zone - lower.zone);
  return lower[key] + (upper[key] - lower[key]) * ratio;
}

function estimateFrost(zoneData, year) {
  const zoneNumber = zoneToNumber(zoneData.zone);
  let lastDay = interpolateFrost(zoneNumber, "last");
  let firstDay = interpolateFrost(zoneNumber, "first");
  const coordinates = zoneData.coordinates ?? {};
  const latitude = Number(coordinates.lat ?? coordinates.latitude ?? zoneData.latitude);
  if (Number.isFinite(latitude)) {
    if (latitude > 42) {
      const adjustment = Math.min(7, (latitude - 42) * 1.2);
      lastDay += adjustment;
      firstDay -= adjustment;
    } else if (latitude < 32) {
      const adjustment = Math.min(7, (32 - latitude) * 1.2);
      lastDay -= adjustment;
      firstDay += adjustment;
    }
  }
  const lastFrost = dateFromDay(year, Math.min(180, Math.max(5, lastDay)));
  const firstFrost = dateFromDay(year, Math.min(365, Math.max(230, firstDay)));
  return {
    zoneNumber,
    lastFrost,
    firstFrost,
    seasonLength: Math.max(0, Math.round((firstFrost - lastFrost) / dayMs)),
    isFrostFree: zoneNumber >= 11
  };
}

function plantingClassForPlant(plant) {
  const type = String(plant.type ?? "").toLowerCase();
  if (plantHasAnyTerm(plant, plantingTerms.garlic)) return "garlic";
  if (plantHasAnyTerm(plant, plantingTerms.potato)) return "potato";
  if (plantHasAnyTerm(plant, plantingTerms.warmTransplant)) return "warm-transplant";
  if (plantHasAnyTerm(plant, plantingTerms.warmDirect)) return "warm-direct";
  if (plantHasAnyTerm(plant, plantingTerms.coolDirect)) return "cool-direct";
  if (plantHasAnyTerm(plant, plantingTerms.coolTransplant)) return "cool-transplant";
  if (plantHasAnyTerm(plant, plantingTerms.tenderContainer) || type === "citrus") return "tender-container";
  if (type.includes("annual vegetable")) return "warm-direct";
  if (type.includes("annual") && (type.includes("flower") || type.includes("herb"))) return "annual-flower";
  if (type.includes("perennial") || type.includes("grass")) return "perennial";
  if (type.includes("tree") || type.includes("shrub") || type.includes("cane") || type.includes("vine") || type.includes("berry")) return "woody";
  return "nursery";
}

function plantingFocusMatches(plant, metrics, focus) {
  if (focus === "all") return true;
  if (focus === "kitchen") return plant.goals?.includes("vegetables-herbs");
  if (focus === "quick") {
    const days = Number(metrics.daysToMaturityMax);
    return plant.goals?.includes("vegetables-herbs")
      && (["quick", "seasonal", "fast-perennial"].includes(metrics.horizonKey) || (Number.isFinite(days) && days > 0 && days <= 75));
  }
  if (focus === "containers") {
    const gallons = Number(metrics.containerMinGallons);
    return ["good", "workable"].includes(metrics.containerSuitability) || (Number.isFinite(gallons) && gallons > 0 && gallons <= 10);
  }
  return true;
}

function maturityDays(metrics, fallback = 70) {
  const days = Number(metrics.daysToMaturityMax ?? metrics.daysToMaturityMin);
  return Number.isFinite(days) && days > 0 ? days : fallback;
}

function recommendationForPlant(plant, frost, today) {
  const metrics = metricFor(plant);
  const plantClass = plantingClassForPlant(plant);
  const daysAfterLast = Math.round((today - frost.lastFrost) / dayMs);
  const daysToFirst = Math.round((frost.firstFrost - today) / dayMs);
  const days = maturityDays(metrics, plantClass.includes("warm") ? 85 : 55);
  const firstOutput = metrics.display?.firstOutput;
  const spacing = metrics.display?.spacing;
  const base = { plant, metrics, plantClass, days, firstOutput, spacing, action: "wait", priority: 0, why: "" };

  if (frost.isFrostFree) {
    if (plantClass.includes("cool")) {
      return { ...base, action: "direct", priority: 72, why: "Frost is not the main limit; use the cooler part of the season and shade/irrigation when weather is hot." };
    }
    if (plantClass === "tender-container") {
      return { ...base, action: "container", priority: 68, why: "Frost risk is low, but container water, heat, and cultivar fit still matter." };
    }
    return { ...base, action: plantClass === "woody" ? "nursery" : "direct", priority: 65, why: "The frost window is open; heat, water, pests, and local rainfall are the bigger checks." };
  }

  if (plantClass === "cool-direct") {
    if (daysAfterLast >= -45 && daysAfterLast <= 35) return { ...base, action: "direct", priority: 95 - Math.abs(daysAfterLast), why: "Cool-season direct-sow window is active or close." };
    if (daysToFirst <= 85 && daysToFirst >= Math.max(25, days + 10)) return { ...base, action: "direct", priority: 88, why: "Fall-crop timing is close enough for a direct-sown cool-season crop." };
    if (daysToFirst < Math.max(25, days + 10)) return { ...base, action: "protect", priority: 38, why: "Too close to frost for a full crop unless protected or harvested young." };
    return { ...base, action: "wait", priority: 28, why: "Better as a spring or fall sowing than a hot-season planting." };
  }

  if (plantClass === "cool-transplant") {
    if (daysAfterLast >= -75 && daysAfterLast <= -35) return { ...base, action: "indoors", priority: 86, why: "Start indoors before the outdoor cool-season transplant window." };
    if (daysAfterLast >= -35 && daysAfterLast <= 25) return { ...base, action: "transplant", priority: 82, why: "Cool-season transplant window is active or close." };
    if (daysToFirst <= 95 && daysToFirst >= Math.max(35, days + 14)) return { ...base, action: "transplant", priority: 78, why: "Fall transplant timing is approaching." };
    return { ...base, action: "wait", priority: 24, why: "Better timed for spring or fall transplanting." };
  }

  if (plantClass === "warm-transplant") {
    if (daysAfterLast >= -70 && daysAfterLast <= -25) return { ...base, action: "indoors", priority: 92, why: "Warm-season crop that benefits from indoor starts before frost risk drops." };
    if (daysAfterLast >= 7 && daysAfterLast <= 60 && daysToFirst > days + 21) return { ...base, action: "transplant", priority: 92 - Math.min(30, Math.abs(daysAfterLast - 21)), why: "Warm-season transplant window is open and there is enough season left." };
    if (daysAfterLast < 7) return { ...base, action: "wait", priority: 44, why: "Wait until nights and soil are warm enough after frost." };
    return { ...base, action: "wait", priority: 30, why: "The season may be too short for a new full crop unless you use large starts or protection." };
  }

  if (plantClass === "warm-direct" || plantClass === "annual-flower") {
    if (daysAfterLast >= 7 && daysToFirst > days + 14) return { ...base, action: "direct", priority: 88 - Math.min(24, Math.abs(daysAfterLast - 28)), why: "Soil should be warm enough and the frost-free window can still fit the crop." };
    if (daysAfterLast < 7) return { ...base, action: "wait", priority: 42, why: "Wait for warmer soil after the last-frost window." };
    return { ...base, action: "wait", priority: 26, why: "Not enough frost-free runway for a reliable new planting." };
  }

  if (plantClass === "garlic") {
    if (daysToFirst <= 45 && daysToFirst >= -25) return { ...base, action: "direct", priority: 84, why: "Garlic is usually planted in fall before deep winter cold." };
    return { ...base, action: "wait", priority: 35, why: "Garlic is usually a fall planting, not a spring or summer crop." };
  }

  if (plantClass === "potato") {
    if (daysAfterLast >= -35 && daysAfterLast <= 30) return { ...base, action: "direct", priority: 78, why: "Potatoes fit the cool-to-mild spring planting window." };
    if (daysToFirst <= 95 && daysToFirst >= 65) return { ...base, action: "direct", priority: 62, why: "A fall potato attempt may work in mild regions with enough frost-free runway." };
    return { ...base, action: "wait", priority: 24, why: "Potatoes are usually better timed for cool spring soil." };
  }

  if (plantClass === "tender-container") {
    if (daysAfterLast >= 7 && daysToFirst > 60) return { ...base, action: "container", priority: 66, why: "Tender plants can move outside now if they can be protected before cold returns." };
    return { ...base, action: "protect", priority: 46, why: "Treat this as a container or protected plant when frost risk is active." };
  }

  if (plantClass === "perennial" || plantClass === "woody" || plantClass === "nursery") {
    if ((daysAfterLast >= -30 && daysToFirst > 45) || (daysToFirst <= 75 && daysToFirst >= 25)) {
      return { ...base, action: "nursery", priority: plant.goals?.includes("vegetables-herbs") ? 52 : 58, why: "Nursery stock can work when soil is workable and weather is not at an extreme." };
    }
    return { ...base, action: "wait", priority: 22, why: "Wait for milder planting weather or plan extra watering/protection." };
  }

  return base;
}

function renderPlantingCards(items) {
  return items.slice(0, 8).map(({ plant, metrics, why, firstOutput, spacing, action }) => `
    <article class="tool-answer-card">
      <div>
        <span>${toolEscape(sentenceCase(plant.type))}</span>
        <h3><a href="/plants/${toolEscape(plant.id)}/">${toolEscape(plant.name)}</a></h3>
        <p>${toolEscape(why)}</p>
      </div>
      <dl>
        <div><dt>Action</dt><dd>${toolEscape(sentenceCase(action))}</dd></div>
        <div><dt>First output</dt><dd>${toolEscape(firstOutput ?? "Check profile")}</dd></div>
        <div><dt>Spacing</dt><dd>${toolEscape(spacing ?? metrics.display?.matureSize ?? "Check profile")}</dd></div>
      </dl>
    </article>
  `).join("");
}

async function handlePlantingNow(form, result) {
  const zip = String(new FormData(form).get("zip") ?? "").replace(/\D+/g, "").slice(0, 5);
  const focus = String(new FormData(form).get("focus") ?? "kitchen");
  if (!/^\d{5}$/.test(zip)) {
    result.innerHTML = `<p class="tool-empty">Enter a five-digit ZIP code.</p>`;
    return;
  }
  result.innerHTML = `<p class="tool-empty">Checking ZIP ${toolEscape(zip)}...</p>`;
  try {
    const [zoneData] = await Promise.all([lookupToolZone(zip), ensureToolData()]);
    const today = startOfDay(new Date());
    const frost = estimateFrost(zoneData, today.getFullYear());
    const recommendations = toolPlants
      .filter((plant) => plantFitsZone(plant, frost.zoneNumber))
      .filter((plant) => plantingFocusMatches(plant, metricFor(plant), focus))
      .map((plant) => recommendationForPlant(plant, frost, today))
      .filter((item) => item.priority > 20)
      .sort((a, b) => b.priority - a.priority || a.plant.name.localeCompare(b.plant.name));
    const groups = {
      direct: recommendations.filter((item) => item.action === "direct"),
      transplant: recommendations.filter((item) => item.action === "transplant"),
      indoors: recommendations.filter((item) => item.action === "indoors"),
      nursery: recommendations.filter((item) => item.action === "nursery" || item.action === "container"),
      protect: recommendations.filter((item) => item.action === "protect")
    };
    result.innerHTML = `
      <div class="tool-result-panel">
        <div class="tool-result-summary">
          <div><span>ZIP</span><strong>${toolEscape(zip)}</strong></div>
          <div><span>USDA zone</span><strong>${toolEscape(zoneData.zone)}</strong></div>
          <div><span>Frost window</span><strong>${frost.isFrostFree ? "Rare freeze" : `${formatDate(frost.lastFrost)} to ${formatDate(frost.firstFrost)}`}</strong></div>
          <div><span>Growing season</span><strong>${frost.isFrostFree ? "Long" : `${frost.seasonLength} days`}</strong></div>
        </div>
        <div class="tool-answer-groups">
          ${groups.direct.length ? `<section><h3>Direct sow or plant now</h3><div class="tool-answer-grid">${renderPlantingCards(groups.direct)}</div></section>` : ""}
          ${groups.transplant.length ? `<section><h3>Transplant or set starts</h3><div class="tool-answer-grid">${renderPlantingCards(groups.transplant)}</div></section>` : ""}
          ${groups.indoors.length ? `<section><h3>Start indoors</h3><div class="tool-answer-grid">${renderPlantingCards(groups.indoors)}</div></section>` : ""}
          ${groups.nursery.length ? `<section><h3>Nursery stock and containers</h3><div class="tool-answer-grid">${renderPlantingCards(groups.nursery)}</div></section>` : ""}
          ${groups.protect.length ? `<section><h3>Only with protection</h3><div class="tool-answer-grid">${renderPlantingCards(groups.protect)}</div></section>` : ""}
        </div>
        ${renderProductCards(["soil-thermometer", "seed-starting-trays", "floating-row-cover", "frost-blanket", "low-tunnel-hoops", "garden-clips"], "planting_now_result")}
      </div>
    `;
    trackToolEvent("tool_result_view", { tool: "planting_now", zip, zone: zoneData.zone });
  } catch (error) {
    result.innerHTML = `<p class="tool-empty">ZIP lookup did not complete. Try again, or use the main Calendar tab for manual zone context.</p>`;
  }
}

const pestDiagnoses = [
  {
    id: "caterpillars",
    title: "Caterpillars or chewing larvae",
    symptoms: ["holes", "skeletonized"],
    groups: ["vegetable", "ornamental"],
    checks: ["Look under leaves and along midribs.", "Check for dark droppings below fresh holes.", "Hand-pick small outbreaks before they spread."],
    response: "Use row cover before eggs are laid on future crops; for active outbreaks, identify the insect before choosing a treatment.",
    productIds: ["insect-netting", "floating-row-cover", "low-tunnel-hoops", "garden-clips"]
  },
  {
    id: "aphids-whiteflies",
    title: "Aphids, whiteflies, or other sap feeders",
    symptoms: ["sticky", "spots"],
    groups: ["vegetable", "fruit", "ornamental", "seedling"],
    checks: ["Inspect tender tips and undersides of leaves.", "Look for honeydew, ants, shed skins, or tiny white flying insects.", "Rinse small colonies off before they distort new growth."],
    response: "Improve airflow, avoid overfertilizing tender growth, and use exclusion or targeted controls only after confirming the pest.",
    productIds: ["insect-netting", "watering-wand", "garden-gloves"]
  },
  {
    id: "mites",
    title: "Spider mites or heat-stress pests",
    symptoms: ["stippling"],
    groups: ["vegetable", "fruit", "ornamental"],
    checks: ["Tap leaves over white paper and look for moving specks.", "Check the hottest, driest side of the plant first.", "Look for fine webbing near leaf stems."],
    response: "Reduce plant stress with even watering and shade during heat; avoid broad sprays that remove mite predators.",
    productIds: ["shade-cloth", "watering-wand", "organic-mulch"]
  },
  {
    id: "fungal-leaf",
    title: "Fungal or bacterial leaf disease",
    symptoms: ["powder", "spots"],
    groups: ["vegetable", "fruit", "ornamental"],
    checks: ["Compare lower older leaves with new growth.", "Check whether leaves stay wet overnight.", "Remove the worst leaves and improve spacing before treating."],
    response: "Water at soil level, mulch to reduce splash, and increase airflow. Match any treatment to the exact disease if it keeps spreading.",
    productIds: ["drip-irrigation-kit", "organic-mulch", "bypass-pruners"]
  },
  {
    id: "animals",
    title: "Deer, rabbits, birds, or larger animals",
    symptoms: ["missing"],
    groups: ["vegetable", "fruit", "ornamental", "seedling"],
    checks: ["Look for clean angled cuts, tracks, droppings, or repeated edge damage.", "Compare protected and exposed plants.", "Check at dawn or dusk when browsing is common."],
    response: "Physical exclusion is more reliable than wishful thinking once animals learn the bed.",
    productIds: ["animal-protection", "bird-netting", "trunk-guard"]
  },
  {
    id: "stem-root",
    title: "Stem, crown, or root stress",
    symptoms: ["wilting", "spots"],
    groups: ["vegetable", "fruit", "ornamental", "seedling"],
    checks: ["Check soil moisture two inches down, not just the surface.", "Inspect the crown for rot, boring, or stem collapse.", "Confirm drainage before adding more water."],
    response: "Fix water and drainage first. If the crown is damaged, remove badly affected annuals before the problem spreads.",
    productIds: ["soil-test-lab-mailer", "finished-compost", "watering-wand"]
  }
];

function scoreDiagnosis(diagnosis, symptoms, group, location) {
  let score = diagnosis.symptoms.filter((symptom) => symptoms.includes(symptom)).length * 4;
  if (diagnosis.groups.includes(group)) score += 2;
  if (location === "roots" && diagnosis.id === "stem-root") score += 3;
  if (location === "fruit" && diagnosis.id === "animals") score += 1;
  if (location === "leaves" && ["caterpillars", "aphids-whiteflies", "mites", "fungal-leaf"].includes(diagnosis.id)) score += 1;
  return score;
}

async function renderPestResults(form, result) {
  await ensureToolData();
  const data = new FormData(form);
  const group = String(data.get("group") ?? "vegetable");
  const location = String(data.get("location") ?? "leaves");
  const symptoms = data.getAll("symptom").map(String);
  if (!symptoms.length) {
    result.innerHTML = `<p class="tool-empty">Choose at least one symptom.</p>`;
    return;
  }
  const ranked = pestDiagnoses
    .map((diagnosis) => ({ ...diagnosis, score: scoreDiagnosis(diagnosis, symptoms, group, location) }))
    .filter((diagnosis) => diagnosis.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  const productIds = Array.from(new Set(ranked.flatMap((diagnosis) => diagnosis.productIds))).slice(0, 6);
  result.innerHTML = `
    <div class="tool-result-panel">
      <div class="tool-result-head">
        <p class="eyebrow">Most likely</p>
        <p>These are pattern matches, not a lab diagnosis. Confirm before treating.</p>
      </div>
      <div class="tool-diagnosis-list">
        ${ranked.map((diagnosis) => `
          <article class="tool-diagnosis-card">
            <span>${diagnosis.score >= 8 ? "Strong match" : "Possible match"}</span>
            <h3>${toolEscape(diagnosis.title)}</h3>
            <p>${toolEscape(diagnosis.response)}</p>
            <ul>${diagnosis.checks.map((check) => `<li>${toolEscape(check)}</li>`).join("")}</ul>
          </article>
        `).join("")}
      </div>
      ${renderProductCards(productIds, "pest_triage_result")}
    </div>
  `;
  trackToolEvent("tool_result_view", { tool: "pest_triage", symptom_count: symptoms.length });
}

function relationTermsMatch(plant, terms = [], excludes = []) {
  if (!terms.length) return false;
  if (plantHasAnyTerm(plant, excludes)) return false;
  return plantHasAnyTerm(plant, terms);
}

function relationshipBetween(plantA, plantB) {
  return toolRelationships.filter((relationship) => {
    const direct = relationTermsMatch(plantA, relationship.sourceMatch ?? [], relationship.sourceExclude ?? [])
      && relationTermsMatch(plantB, relationship.targetMatch ?? [], relationship.targetExclude ?? []);
    const reverse = relationTermsMatch(plantB, relationship.sourceMatch ?? [], relationship.sourceExclude ?? [])
      && relationTermsMatch(plantA, relationship.targetMatch ?? [], relationship.targetExclude ?? []);
    const shared = relationTermsMatch(plantA, relationship.plantMatch ?? [], relationship.plantExclude ?? [])
      && relationTermsMatch(plantB, relationship.plantMatch ?? [], relationship.plantExclude ?? []);
    return direct || reverse || shared;
  });
}

function sharedSiteFacts(plantA, plantB) {
  const metricsA = metricFor(plantA);
  const metricsB = metricFor(plantB);
  const sharedSun = plantA.sun.filter((sun) => plantB.sun.includes(sun));
  const sharedSoil = plantA.soils.filter((soil) => plantB.soils.includes(soil));
  const sameWater = plantA.water === plantB.water;
  const spacingA = Number(metricsA.spacingAreaSqFtMax);
  const spacingB = Number(metricsB.spacingAreaSqFtMax);
  return [
    sharedSun.length ? `Shared light: ${formatList(sharedSun)}.` : "Light needs may not overlap cleanly.",
    sharedSoil.length ? `Shared soil: ${formatList(sharedSoil)}.` : "Soil cues differ; check profiles before pairing.",
    sameWater ? `Both are ${sentenceCase(plantA.water)} water plants.` : `Water differs: ${sentenceCase(plantA.water)} vs ${sentenceCase(plantB.water)}.`,
    Number.isFinite(spacingA) && Number.isFinite(spacingB)
      ? `Combined spacing pressure: roughly ${formatNumber(spacingA + spacingB)} sq ft at the wide end.`
      : "Spacing data is incomplete; keep airflow and mature size visible."
  ];
}

async function handleCompanionChecker(form, result) {
  await ensureToolData();
  const data = new FormData(form);
  const plantA = findToolPlant(data.get("plantA"));
  const plantB = findToolPlant(data.get("plantB"));
  if (!plantA || !plantB) {
    result.innerHTML = `<p class="tool-empty">I could not match one of those plant names. Try a simpler crop name like tomato, basil, carrot, onion, blueberry, or apple.</p>`;
    return;
  }
  const relationships = relationshipBetween(plantA, plantB);
  const siteFacts = sharedSiteFacts(plantA, plantB);
  const tone = relationships.length ? "Looks useful" : "Check site fit";
  result.innerHTML = `
    <div class="tool-result-panel">
      <div class="tool-pair-summary">
        <div><span>Plant one</span><strong>${toolEscape(plantA.name)}</strong></div>
        <div><span>Plant two</span><strong>${toolEscape(plantB.name)}</strong></div>
        <div><span>Read</span><strong>${tone}</strong></div>
      </div>
      ${relationships.length ? `
        <div class="tool-diagnosis-list">
          ${relationships.map((relationship) => `
            <article class="tool-diagnosis-card">
              <span>${toolEscape(sentenceCase(relationship.type))} / ${toolEscape(sentenceCase(relationship.strength))}</span>
              <h3>${toolEscape(relationship.note)}</h3>
              <p>${toolEscape(relationship.placement)}</p>
            </article>
          `).join("")}
        </div>
      ` : `
        <div class="tool-callout">
          <h3>No direct pairing rule found.</h3>
          <p>That does not mean the pair is bad. Use the site-fit checks below and keep spacing, water, and airflow in the decision.</p>
        </div>
      `}
      <ul class="tool-check-list">${siteFacts.map((fact) => `<li>${toolEscape(fact)}</li>`).join("")}</ul>
      <div class="tool-actions-row">
        <a class="plant-page-action is-secondary" href="/plants/${toolEscape(plantA.id)}/">View ${toolEscape(plantA.name)}</a>
        <a class="plant-page-action is-secondary" href="/plants/${toolEscape(plantB.id)}/">View ${toolEscape(plantB.name)}</a>
        <a class="plant-page-action is-primary" href="/#garden-planner">Open Garden planner</a>
      </div>
      ${renderProductCards(["plant-labels", "hand-trowel", "trellis-netting", "soft-plant-ties", "organic-mulch"], "companion_checker_result")}
    </div>
  `;
  trackToolEvent("tool_result_view", { tool: "companion_checker", relationship_count: relationships.length });
}

async function handleContainerCalculator(form, result) {
  await ensureToolData();
  const data = new FormData(form);
  const plant = findToolPlant(data.get("plant"));
  const gallons = Number(data.get("gallons"));
  const sun = String(data.get("sun") ?? "full");
  if (!plant) {
    result.innerHTML = `<p class="tool-empty">I could not match that plant. Try a crop or cultivar name from the database.</p>`;
    return;
  }
  if (!Number.isFinite(gallons) || gallons <= 0) {
    result.innerHTML = `<p class="tool-empty">Enter a container size in gallons.</p>`;
    return;
  }
  const metrics = metricFor(plant);
  const minGallons = Number(metrics.containerMinGallons);
  const ratio = Number.isFinite(minGallons) && minGallons > 0 ? gallons / minGallons : 0;
  let verdict = "Needs local check";
  let tone = "tool-verdict-neutral";
  let note = "The database does not have a firm container minimum for this plant yet.";
  if (ratio >= 1.5) {
    verdict = "Comfortable";
    tone = "tool-verdict-good";
    note = "Your container is larger than the database minimum, which usually makes watering and root growth easier.";
  } else if (ratio >= 1) {
    verdict = "Workable";
    tone = "tool-verdict-good";
    note = "The pot meets the listed minimum. Watch watering closely in heat.";
  } else if (ratio >= 0.65) {
    verdict = "Tight";
    tone = "tool-verdict-warn";
    note = "This is below the listed minimum. It may work only with compact varieties and careful watering.";
  } else if (Number.isFinite(minGallons)) {
    verdict = "Too small";
    tone = "tool-verdict-bad";
    note = "This is well below the listed minimum. Expect stress, low yield, or frequent watering.";
  }
  const sunMismatch = plant.sun.length && !plant.sun.includes(sun);
  const products = ["drainage-container", "container-potting-mix", "watering-wand", "balanced-fertilizer"];
  if (sun === "full" && (plant.water === "high" || plant.type.includes("annual"))) products.push("shade-cloth");
  result.innerHTML = `
    <div class="tool-result-panel">
      <div class="tool-container-verdict ${tone}">
        <span>${toolEscape(plant.name)}</span>
        <strong>${toolEscape(verdict)}</strong>
        <p>${toolEscape(note)}</p>
      </div>
      <div class="tool-result-summary">
        <div><span>Your pot</span><strong>${formatNumber(gallons)} gal</strong></div>
        <div><span>Listed minimum</span><strong>${Number.isFinite(minGallons) ? `${formatNumber(minGallons)}+ gal` : "Not sourced"}</strong></div>
        <div><span>Database fit</span><strong>${toolEscape(sentenceCase(metrics.containerSuitability ?? "check profile"))}</strong></div>
        <div><span>Water</span><strong>${toolEscape(sentenceCase(plant.water))}</strong></div>
      </div>
      <ul class="tool-check-list">
        <li>${toolEscape(metrics.containerNote ?? "Use a container with drainage holes and a real potting mix.")}</li>
        <li>${sunMismatch ? `The selected site is ${toolEscape(sentenceCase(sun))}, but this plant lists ${toolEscape(formatList(plant.sun))}.` : `Light fit looks plausible for ${toolEscape(sentenceCase(sun))} conditions.`}</li>
        <li>${toolEscape(metrics.display?.yieldLbs ? `Yield planning range: ${metrics.display.yieldLbs}.` : metrics.display?.output ? `Output cue: ${metrics.display.output}.` : "Check the plant profile for output expectations.")}</li>
      </ul>
      <div class="tool-actions-row">
        <a class="plant-page-action is-secondary" href="/plants/${toolEscape(plant.id)}/">View plant profile</a>
        <a class="plant-page-action is-primary" href="/container-garden-plants/">Browse container plants</a>
      </div>
      ${renderProductCards(products, "container_calculator_result")}
    </div>
  `;
  trackToolEvent("tool_result_view", { tool: "container_calculator", verdict });
}

async function handleDripCalculator(form, result) {
  await ensureToolData();
  const data = new FormData(form);
  const length = Number(data.get("length"));
  const width = Number(data.get("width"));
  const count = Math.max(1, Math.round(Number(data.get("count")) || 1));
  const spacingIn = Number(data.get("spacing"));
  const emitterRate = Number(data.get("emitter"));
  if (![length, width, spacingIn, emitterRate].every((value) => Number.isFinite(value) && value > 0)) {
    result.innerHTML = `<p class="tool-empty">Enter bed dimensions, line spacing, and emitter rate.</p>`;
    return;
  }
  const spacingFt = spacingIn / 12;
  const linesPerBed = Math.max(1, Math.ceil(width / spacingFt));
  const dripLineFt = linesPerBed * length * count;
  const headerFt = width * count;
  const totalTubingFt = Math.ceil((dripLineFt + headerFt) * 1.1);
  const bedArea = length * width * count;
  const weeklyGallons = bedArea * 0.623;
  const flowGph = dripLineFt * emitterRate;
  const weeklyRuntimeHours = flowGph > 0 ? weeklyGallons / flowGph : 0;
  const runtimePerRun = weeklyRuntimeHours / 2;
  const kitNote = totalTubingFt > 100
    ? "This is a larger layout; plan extra tubing or more than one starter kit."
    : "A typical starter drip kit may cover this size, but check included tubing length.";
  result.innerHTML = `
    <div class="tool-result-panel">
      <div class="tool-result-summary">
        <div><span>Bed area</span><strong>${formatNumber(bedArea)} sq ft</strong></div>
        <div><span>Drip lines</span><strong>${linesPerBed} per bed</strong></div>
        <div><span>Tubing estimate</span><strong>${totalTubingFt} ft</strong></div>
        <div><span>Weekly water</span><strong>${formatNumber(weeklyGallons)} gal</strong></div>
      </div>
      <div class="tool-callout">
        <h3>Starting runtime</h3>
        <p>At about ${formatNumber(flowGph)} gal/hr total flow, start around ${formatNumber(weeklyRuntimeHours, 2)} hr/week, split into two runs of roughly ${formatNumber(runtimePerRun * 60, 0)} minutes each. Adjust for rain, mulch, crop size, and soil moisture.</p>
      </div>
      <ul class="tool-check-list">
        <li>${kitNote}</li>
        <li>Use a pressure regulator and filter when the kit requires it.</li>
        <li>Run lines near crop rows, then mulch over exposed soil to reduce evaporation.</li>
      </ul>
      <div class="tool-actions-row">
        <a class="plant-page-action is-secondary" href="/blog/drip-irrigation-fruit-trees-berries-raised-beds/">Read drip guide</a>
        <a class="plant-page-action is-primary" href="/what-to-grow-in-a-4x8-raised-bed/">Browse raised-bed crops</a>
      </div>
      ${renderProductCards(["drip-irrigation-kit", "hose-timer", "organic-mulch", "garden-clips", "watering-wand"], "drip_calculator_result")}
    </div>
  `;
  trackToolEvent("tool_result_view", { tool: "drip_calculator", bed_area: bedArea });
}

function paramValue(params, names) {
  for (const name of names) {
    const value = params.get(name);
    if (value) return value;
  }
  return "";
}

function setFormValue(form, name, value) {
  if (!value) return;
  const field = form.elements.namedItem(name);
  if (field) field.value = value;
}

function setCheckboxValues(form, name, values) {
  const wanted = new Set(values.map((value) => value.trim()).filter(Boolean));
  if (!wanted.size) return;
  form.querySelectorAll(`input[name="${name}"]`).forEach((input) => {
    input.checked = wanted.has(input.value);
  });
}

function submitFromParams(form, shouldSubmit) {
  if (!shouldSubmit) return;
  window.requestAnimationFrame(() => {
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
}

function applyToolParams(form, tool) {
  const params = new URLSearchParams(window.location.search);
  if (!params.size) return;

  if (tool === "planting-now") {
    const zip = paramValue(params, ["zip", "postal"]);
    setFormValue(form, "zip", zip);
    setFormValue(form, "focus", paramValue(params, ["focus"]));
    submitFromParams(form, Boolean(zip));
    return;
  }

  if (tool === "pest-triage") {
    const symptoms = [
      ...params.getAll("symptom"),
      ...paramValue(params, ["symptoms"]).split(",")
    ].map((value) => value.trim()).filter(Boolean);
    setFormValue(form, "group", paramValue(params, ["group"]));
    setFormValue(form, "location", paramValue(params, ["location"]));
    setCheckboxValues(form, "symptom", symptoms);
    submitFromParams(form, symptoms.length > 0);
    return;
  }

  if (tool === "companion-checker") {
    const plantA = paramValue(params, ["plantA", "a", "first"]);
    const plantB = paramValue(params, ["plantB", "b", "second"]);
    setFormValue(form, "plantA", plantA);
    setFormValue(form, "plantB", plantB);
    submitFromParams(form, Boolean(plantA && plantB));
    return;
  }

  if (tool === "container-calculator") {
    const plant = paramValue(params, ["plant", "crop"]);
    const gallons = paramValue(params, ["gallons", "pot"]);
    setFormValue(form, "plant", plant);
    setFormValue(form, "gallons", gallons);
    setFormValue(form, "sun", paramValue(params, ["sun"]));
    submitFromParams(form, Boolean(plant && gallons));
    return;
  }

  if (tool === "drip-calculator") {
    const length = paramValue(params, ["length", "l"]);
    const width = paramValue(params, ["width", "w"]);
    setFormValue(form, "length", length);
    setFormValue(form, "width", width);
    setFormValue(form, "count", paramValue(params, ["count", "beds"]));
    setFormValue(form, "spacing", paramValue(params, ["spacing"]));
    setFormValue(form, "emitter", paramValue(params, ["emitter"]));
    submitFromParams(form, Boolean(length && width));
  }
}

function initToolForms() {
  document.querySelectorAll("[data-tool-form]").forEach((form) => {
    const tool = form.dataset.toolForm;
    const result = document.querySelector(`[data-tool-result="${tool}"]`);
    if (!result) return;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      try {
        if (tool === "planting-now") await handlePlantingNow(form, result);
        if (tool === "pest-triage") await renderPestResults(form, result);
        if (tool === "companion-checker") await handleCompanionChecker(form, result);
        if (tool === "container-calculator") await handleContainerCalculator(form, result);
        if (tool === "drip-calculator") await handleDripCalculator(form, result);
      } catch (error) {
        result.innerHTML = `<p class="tool-empty">The tool could not finish. Refresh and try again.</p>`;
      }
    });
    applyToolParams(form, tool);
  });
}

initToolForms();
if (document.querySelector("[data-tool-form]")) {
  ensureToolData().catch(() => {});
}
