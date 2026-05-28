import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const plantsPath = path.join(rootDir, "src", "data", "plants.json");
const metricsPath = path.join(rootDir, "src", "data", "plantMetrics.json");
const sourcesPath = path.join(rootDir, "src", "data", "plantMetricSources.json");
const csvPath = path.join(rootDir, "public", "exports", "plants.csv");

const plants = JSON.parse(fs.readFileSync(plantsPath, "utf8"));
const lastReviewed = "2026-05-24";

const metricSources = {
  "uga-vegetable-days-spacing": {
    title: "UGA Extension - Growing Vegetables Organically",
    url: "https://fieldreport.caes.uga.edu/publications/B1011/growing-vegetables-organically/",
    note: "Vegetable hardiness, days to maturity, and row-by-plant spacing tables."
  },
  "cornell-vegetable-yield": {
    title: "Cornell Cooperative Extension - Recommended Spacing and Expected Yield for Garden Vegetables",
    url: "https://gardening.cals.cornell.edu/files/Recommended-spacing-and-expected-yield-for-garden-vegetables-in-New-York-1iozy2c.pdf",
    note: "Home garden vegetable spacing and yield estimates per plant or per row."
  },
  "umaine-vegetable-yield": {
    title: "University of Maine Extension - Planting Chart for the Home Vegetable Garden",
    url: "https://extension.umaine.edu/gardening/manual/vegetables/planting-chart/",
    note: "Home vegetable average yields, spacing, and planting chart."
  },
  "umn-vegetable-field-planning": {
    title: "University of Minnesota Extension - Crop and Field Planning Tools for Vegetable Farmers",
    url: "https://extension.umn.edu/vegetable-growing-guides-farmers/crop-and-field-planning-tools-vegetable-farmers",
    note: "Expected vegetable yield per plant, per 100-foot bed, spacing, days to harvest, and harvest windows."
  },
  "lsu-vegetable-yields": {
    title: "LSU AgCenter - Expected Vegetable Garden Yields",
    url: "https://www.lsuagcenter.com/topics/lawn_garden/home_gardening/vegetables/expected-vegetable-garden-yields",
    note: "Home garden vegetable yields by 100-foot row; used as a regional cross-check for pound-return ranges."
  },
  "lsu-citrus-yield": {
    title: "LSU AgCenter - Sustainable Gardening for School and Home Gardens: Citrus",
    url: "https://www.lsuagcenter.com/~/media/system/b/7/2/4/b7241310f6e89ae9b1097d8e54a3028d/p3761l_sustgardcitrus_rh0721pdf.pdf",
    note: "Citrus spacing, years to harvest, and annual yield per mature tree."
  },
  "uga-pomegranate-production": {
    title: "UGA Extension - Pomegranate Production",
    url: "https://fieldreport.caes.uga.edu/publications/C997/pomegranate-production/",
    note: "Pomegranate spacing, first harvest, full production timing, and yield caveats for the Southeast."
  },
  "usu-tomatillo": {
    title: "Utah State Extension - How to Grow Tomatillos in Your Garden",
    url: "https://extension.usu.edu/yardandgarden/research/tomatillos-in-the-garden",
    note: "Tomatillo spacing and pounds of fruit per plant."
  },
  "purdue-midwest-fruit": {
    title: "Midwest Home Fruit Production Guide",
    url: "https://extension.purdue.edu/county/vigo/_docs/Midwest-Home-Fruit-Production-Guide_B940.pdf",
    note: "Fruit crop spacing, expected yield, years to bearing, useful life, and risk notes."
  },
  "psu-pome-spacing-yield": {
    title: "Penn State Extension - Apple and Pear Tree Spacings",
    url: "https://extension.psu.edu/home-orchards-table-4-3-apple-and-pear-tree-spacings-on-various-rootstocks",
    note: "Apple and pear spacing and probable yield by rootstock."
  },
  "psu-stone-spacing-yield": {
    title: "Penn State Extension - Stone Fruit Spacing and Probable Yield",
    url: "https://extension.psu.edu/home-orchards-table-5-1-stone-fruit-spacing-and-probable-yield/",
    note: "Stone fruit spacing and probable yield for mature trees."
  },
  "umn-stone-fruit": {
    title: "University of Minnesota Extension - Growing Stone Fruits in the Home Garden",
    url: "https://extension.umn.edu/fruit/growing-stone-fruits-home-garden",
    note: "Stone fruit spacing and first-fruit timing guidance."
  },
  "umn-blueberry": {
    title: "University of Minnesota Extension - Growing Blueberries in the Home Garden",
    url: "https://extension.umn.edu/fruit/growing-blueberries-home-garden",
    note: "Blueberry establishment, pollination, full-size timing, and care guidance."
  },
  "osu-blueberry": {
    title: "Oregon State Extension - Growing Blueberries in Your Home Garden",
    url: "https://extension.oregonstate.edu/catalog/ec-1304-growing-blueberries-your-home-garden",
    note: "Blueberry mature yield and establishment progression."
  },
  "uga-blueberry": {
    title: "UGA Extension - Home Garden Blueberries",
    url: "https://extension.uga.edu/publications/detail.html?number=C946&title=home-garden-blueberries",
    note: "Rabbiteye blueberry spacing, first fruit timing, and mature yield guidance."
  },
  "okstate-grape": {
    title: "Oklahoma State Extension - Growing Grapes in the Home Garden",
    url: "https://extension.okstate.edu/fact-sheets/growing-grapes-in-the-home-garden-2",
    note: "Grape spacing, yield range, and first harvest timing."
  },
  "umd-brambles": {
    title: "University of Maryland Extension - Growing Raspberries and Blackberries in a Home Garden",
    url: "https://extension.umd.edu/resource/growing-raspberries-and-blackberries-home-garden",
    note: "Bramble spacing, trellis, and pruning guidance."
  },
  "umn-strawberry": {
    title: "University of Minnesota Extension - Growing Strawberries in the Home Garden",
    url: "https://extension.umn.edu/fruit/growing-strawberries-home-garden",
    note: "Strawberry types, spacing, runners, and harvest timing."
  },
  "usu-strawberry-yield": {
    title: "Utah State Extension - How to Grow Strawberries in Your Garden",
    url: "https://extension.usu.edu/yardandgarden/research/strawberries-in-the-garden",
    note: "Expected strawberry bed yield and productive season length."
  },
  "osu-elderberry": {
    title: "Ohio State Extension - Elderberry Production in Ohio",
    url: "https://ohioline.osu.edu/factsheet/anr-0110",
    note: "Elderberry spacing and establishment considerations."
  },
  "stark-elderberry-yield": {
    title: "Stark Bro's - Harvesting Elderberry Plants",
    url: "https://www.starkbros.com/growing-guide/how-to-grow/berry-plants/elderberry-plants/harvesting",
    note: "Retail nursery harvest timing and yield estimate for elderberry."
  },
  "umd-aronia": {
    title: "University of Maryland Extension - Aronia",
    url: "https://extension.umd.edu/programs/agriculture-food-systems/program-areas/fruit-vegetable-production/alternative-crops/aronia",
    note: "Aronia first-fruit timing and mature plant yield."
  },
  "osu-lingonberry": {
    title: "Oregon State Extension - Lingonberry Production Guide",
    url: "https://extension.oregonstate.edu/catalog/pnw-583-lingonberry-production-guide-pacific-northwest",
    note: "Lingonberry productivity and useful life guidance."
  },
  "ncsu-plant-toolbox": {
    title: "NC State Extension Gardener Plant Toolbox",
    url: "https://plants.ces.ncsu.edu/",
    note: "Reference basis for ornamental plant size, function, and right-plant-right-place screening."
  },
  "mobot-plant-finder": {
    title: "Missouri Botanical Garden Plant Finder",
    url: "https://www.missouribotanicalgarden.org/PlantFinder/PlantFinderSearch.aspx",
    note: "Reference basis for horticultural height, spread, bloom, and cultural ranges."
  },
  "kstate-herbaceous-spacing": {
    title: "K-State Extension Master Gardener Handbook - Herbaceous Plants",
    url: "https://www.meadowlark.k-state.edu/docs/lawn_garden/extension-master-gardener/handouts/EMG%20Handbook%20chapter%208%20Herbaceous%20Plants.pdf",
    note: "Herbaceous spacing method based on mature plant form and height."
  },
  "umd-container-sizes": {
    title: "University of Maryland Extension - Types of Containers for Growing Vegetables",
    url: "https://extension.umd.edu/resource/types-containers-growing-vegetables/",
    note: "Container volume guidance, including large vegetables and 25-30 gallon dwarf fruit tree containers."
  },
  "illinois-container-vegetables": {
    title: "Illinois Extension - Growing Vegetables in Containers",
    url: "https://extension.illinois.edu/container-gardens/growing-vegetables-containers",
    note: "Container vegetable guidance for matching container size, rooting depth, and plant density."
  },
  "umd-tree-shrub-planting": {
    title: "University of Maryland Extension - Planting a Tree or Shrub",
    url: "https://extension.umd.edu/resource/planting-tree-or-shrub",
    note: "Tree and shrub planting depth guidance, especially keeping the root flare at soil level."
  },
  "umd-home-fruit-planting": {
    title: "University of Maryland Extension - Starting a Home Fruit Garden",
    url: "https://www.extension.umd.edu/resource/starting-home-fruit-garden",
    note: "Fruit tree graft union, root flare, and small fruit crown placement guidance."
  },
  "umn-strawberry-planting": {
    title: "University of Minnesota Extension - Growing Strawberries in the Home Garden",
    url: "https://extension.umn.edu/fruit/growing-strawberries-home-garden",
    note: "Strawberry crown planting depth guidance."
  }
};

const baseByType = {
  "annual vegetable": {
    lifeCycle: "annual",
    outputKind: "edible",
    outputUnit: "lb/plant/season",
    daysToMaturityMin: 60,
    daysToMaturityMax: 90,
    firstYieldYearsMin: 0,
    firstYieldYearsMax: 0,
    fullYieldYearsMin: 0,
    fullYieldYearsMax: 0,
    productiveLifespanYearsMin: 1,
    productiveLifespanYearsMax: 1,
    matureHeightFtMin: 1,
    matureHeightFtMax: 4,
    matureSpreadFtMin: 1,
    matureSpreadFtMax: 3,
    spacingPlantFtMin: 1,
    spacingPlantFtMax: 2,
    spacingRowFtMin: 2,
    spacingRowFtMax: 4,
    outputMin: null,
    outputMax: null,
    harvestWindowWeeksMin: 2,
    harvestWindowWeeksMax: 8,
    difficultyScore: 2,
    reliabilityScore: 3,
    maintenanceScore: 3,
    dataConfidence: "medium",
    dataMethod: "crop-specific vegetable template",
    sourceKeys: ["uga-vegetable-days-spacing", "cornell-vegetable-yield", "umaine-vegetable-yield"]
  },
  "annual herb": {
    lifeCycle: "annual",
    outputKind: "culinary",
    outputUnit: "weeks of leaf/flower harvest",
    daysToMaturityMin: 40,
    daysToMaturityMax: 75,
    firstYieldYearsMin: 0,
    firstYieldYearsMax: 0,
    fullYieldYearsMin: 0,
    fullYieldYearsMax: 0,
    productiveLifespanYearsMin: 1,
    productiveLifespanYearsMax: 1,
    matureHeightFtMin: 1,
    matureHeightFtMax: 3,
    matureSpreadFtMin: 1,
    matureSpreadFtMax: 2,
    spacingPlantFtMin: 0.75,
    spacingPlantFtMax: 1.5,
    spacingRowFtMin: 1,
    spacingRowFtMax: 2,
    outputMin: 6,
    outputMax: 18,
    harvestWindowWeeksMin: 8,
    harvestWindowWeeksMax: 18,
    difficultyScore: 1,
    reliabilityScore: 4,
    maintenanceScore: 2,
    dataConfidence: "medium",
    dataMethod: "culinary herb crop template",
    sourceKeys: ["uga-vegetable-days-spacing", "ncsu-plant-toolbox"]
  },
  "biennial herb": {
    lifeCycle: "biennial",
    outputKind: "culinary",
    outputUnit: "weeks of leaf harvest",
    daysToMaturityMin: 60,
    daysToMaturityMax: 90,
    firstYieldYearsMin: 0,
    firstYieldYearsMax: 0,
    fullYieldYearsMin: 0,
    fullYieldYearsMax: 1,
    productiveLifespanYearsMin: 1,
    productiveLifespanYearsMax: 2,
    matureHeightFtMin: 1,
    matureHeightFtMax: 2,
    matureSpreadFtMin: 1,
    matureSpreadFtMax: 1.5,
    spacingPlantFtMin: 0.5,
    spacingPlantFtMax: 1,
    spacingRowFtMin: 1,
    spacingRowFtMax: 1.5,
    outputMin: 8,
    outputMax: 18,
    harvestWindowWeeksMin: 8,
    harvestWindowWeeksMax: 18,
    difficultyScore: 1,
    reliabilityScore: 4,
    maintenanceScore: 2,
    dataConfidence: "medium",
    dataMethod: "culinary herb crop template",
    sourceKeys: ["uga-vegetable-days-spacing", "ncsu-plant-toolbox"]
  },
  "perennial vegetable": {
    lifeCycle: "herbaceous perennial",
    outputKind: "edible",
    outputUnit: "lb/plant/year",
    daysToMaturityMin: null,
    daysToMaturityMax: null,
    firstYieldYearsMin: 1,
    firstYieldYearsMax: 2,
    fullYieldYearsMin: 2,
    fullYieldYearsMax: 4,
    productiveLifespanYearsMin: 5,
    productiveLifespanYearsMax: 15,
    matureHeightFtMin: 1,
    matureHeightFtMax: 5,
    matureSpreadFtMin: 1,
    matureSpreadFtMax: 4,
    spacingPlantFtMin: 1,
    spacingPlantFtMax: 3,
    spacingRowFtMin: 2,
    spacingRowFtMax: 4,
    outputMin: null,
    outputMax: null,
    harvestWindowWeeksMin: 3,
    harvestWindowWeeksMax: 10,
    difficultyScore: 2,
    reliabilityScore: 4,
    maintenanceScore: 2,
    dataConfidence: "medium",
    dataMethod: "perennial edible template",
    sourceKeys: ["cornell-vegetable-yield", "umaine-vegetable-yield", "ncsu-plant-toolbox"]
  },
  "fruit tree": {
    lifeCycle: "woody perennial",
    outputKind: "edible",
    outputUnit: "lb/plant/year",
    daysToMaturityMin: null,
    daysToMaturityMax: null,
    firstYieldYearsMin: 3,
    firstYieldYearsMax: 5,
    fullYieldYearsMin: 6,
    fullYieldYearsMax: 10,
    productiveLifespanYearsMin: 15,
    productiveLifespanYearsMax: 30,
    matureHeightFtMin: 12,
    matureHeightFtMax: 25,
    matureSpreadFtMin: 10,
    matureSpreadFtMax: 20,
    spacingPlantFtMin: 12,
    spacingPlantFtMax: 20,
    spacingRowFtMin: 12,
    spacingRowFtMax: 25,
    outputMin: null,
    outputMax: null,
    harvestWindowWeeksMin: 2,
    harvestWindowWeeksMax: 5,
    difficultyScore: 3,
    reliabilityScore: 3,
    maintenanceScore: 4,
    dataConfidence: "medium",
    dataMethod: "tree fruit template; rootstock and region can change values materially",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  },
  "fruit shrub": {
    lifeCycle: "woody perennial",
    outputKind: "edible",
    outputUnit: "lb/plant/year",
    daysToMaturityMin: null,
    daysToMaturityMax: null,
    firstYieldYearsMin: 2,
    firstYieldYearsMax: 4,
    fullYieldYearsMin: 4,
    fullYieldYearsMax: 7,
    productiveLifespanYearsMin: 10,
    productiveLifespanYearsMax: 25,
    matureHeightFtMin: 4,
    matureHeightFtMax: 10,
    matureSpreadFtMin: 4,
    matureSpreadFtMax: 10,
    spacingPlantFtMin: 4,
    spacingPlantFtMax: 8,
    spacingRowFtMin: 6,
    spacingRowFtMax: 10,
    outputMin: null,
    outputMax: null,
    harvestWindowWeeksMin: 2,
    harvestWindowWeeksMax: 5,
    difficultyScore: 2,
    reliabilityScore: 3,
    maintenanceScore: 3,
    dataConfidence: "medium",
    dataMethod: "small fruit shrub template",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  },
  "berry shrub": {
    lifeCycle: "woody perennial",
    outputKind: "edible",
    outputUnit: "lb/plant/year",
    daysToMaturityMin: null,
    daysToMaturityMax: null,
    firstYieldYearsMin: 2,
    firstYieldYearsMax: 3,
    fullYieldYearsMin: 4,
    fullYieldYearsMax: 8,
    productiveLifespanYearsMin: 10,
    productiveLifespanYearsMax: 25,
    matureHeightFtMin: 3,
    matureHeightFtMax: 8,
    matureSpreadFtMin: 3,
    matureSpreadFtMax: 8,
    spacingPlantFtMin: 3,
    spacingPlantFtMax: 6,
    spacingRowFtMin: 6,
    spacingRowFtMax: 10,
    outputMin: null,
    outputMax: null,
    harvestWindowWeeksMin: 2,
    harvestWindowWeeksMax: 6,
    difficultyScore: 2,
    reliabilityScore: 4,
    maintenanceScore: 3,
    dataConfidence: "medium",
    dataMethod: "berry shrub template",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  },
  "berry cane": {
    lifeCycle: "cane perennial",
    outputKind: "edible",
    outputUnit: "lb/plant/year",
    daysToMaturityMin: null,
    daysToMaturityMax: null,
    firstYieldYearsMin: 1,
    firstYieldYearsMax: 2,
    fullYieldYearsMin: 2,
    fullYieldYearsMax: 3,
    productiveLifespanYearsMin: 8,
    productiveLifespanYearsMax: 15,
    matureHeightFtMin: 4,
    matureHeightFtMax: 8,
    matureSpreadFtMin: 2,
    matureSpreadFtMax: 4,
    spacingPlantFtMin: 2,
    spacingPlantFtMax: 4,
    spacingRowFtMin: 8,
    spacingRowFtMax: 10,
    outputMin: 2,
    outputMax: 10,
    harvestWindowWeeksMin: 3,
    harvestWindowWeeksMax: 8,
    difficultyScore: 3,
    reliabilityScore: 4,
    maintenanceScore: 4,
    dataConfidence: "medium",
    dataMethod: "bramble template",
    sourceKeys: ["umd-brambles"]
  },
  "berry perennial": {
    lifeCycle: "herbaceous perennial",
    outputKind: "edible",
    outputUnit: "lb/plant/year",
    daysToMaturityMin: null,
    daysToMaturityMax: null,
    firstYieldYearsMin: 0,
    firstYieldYearsMax: 1,
    fullYieldYearsMin: 1,
    fullYieldYearsMax: 2,
    productiveLifespanYearsMin: 3,
    productiveLifespanYearsMax: 5,
    matureHeightFtMin: 0.5,
    matureHeightFtMax: 1,
    matureSpreadFtMin: 1,
    matureSpreadFtMax: 2,
    spacingPlantFtMin: 1,
    spacingPlantFtMax: 1.5,
    spacingRowFtMin: 3,
    spacingRowFtMax: 4,
    outputMin: 0.75,
    outputMax: 2,
    harvestWindowWeeksMin: 3,
    harvestWindowWeeksMax: 14,
    difficultyScore: 2,
    reliabilityScore: 3,
    maintenanceScore: 3,
    dataConfidence: "medium",
    dataMethod: "strawberry and small berry perennial template",
    sourceKeys: ["umn-strawberry", "usu-strawberry-yield"]
  },
  "grape vine": {
    lifeCycle: "woody vine",
    outputKind: "edible",
    outputUnit: "lb/plant/year",
    daysToMaturityMin: null,
    daysToMaturityMax: null,
    firstYieldYearsMin: 3,
    firstYieldYearsMax: 3,
    fullYieldYearsMin: 4,
    fullYieldYearsMax: 5,
    productiveLifespanYearsMin: 20,
    productiveLifespanYearsMax: 40,
    matureHeightFtMin: 6,
    matureHeightFtMax: 10,
    matureSpreadFtMin: 6,
    matureSpreadFtMax: 20,
    spacingPlantFtMin: 6,
    spacingPlantFtMax: 8,
    spacingRowFtMin: 8,
    spacingRowFtMax: 10,
    outputMin: 1,
    outputMax: 25,
    harvestWindowWeeksMin: 2,
    harvestWindowWeeksMax: 4,
    difficultyScore: 3,
    reliabilityScore: 3,
    maintenanceScore: 4,
    dataConfidence: "medium",
    dataMethod: "grape template",
    sourceKeys: ["okstate-grape"]
  },
  "fruit vine": {
    lifeCycle: "woody or herbaceous vine",
    outputKind: "edible",
    outputUnit: "lb/plant/year",
    daysToMaturityMin: null,
    daysToMaturityMax: null,
    firstYieldYearsMin: 2,
    firstYieldYearsMax: 4,
    fullYieldYearsMin: 4,
    fullYieldYearsMax: 6,
    productiveLifespanYearsMin: 8,
    productiveLifespanYearsMax: 25,
    matureHeightFtMin: 6,
    matureHeightFtMax: 12,
    matureSpreadFtMin: 6,
    matureSpreadFtMax: 20,
    spacingPlantFtMin: 6,
    spacingPlantFtMax: 10,
    spacingRowFtMin: 8,
    spacingRowFtMax: 12,
    outputMin: null,
    outputMax: null,
    harvestWindowWeeksMin: 2,
    harvestWindowWeeksMax: 6,
    difficultyScore: 3,
    reliabilityScore: 3,
    maintenanceScore: 4,
    dataConfidence: "low",
    dataMethod: "fruit vine template; cultivar and pollination details often dominate",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  },
  "nut tree": {
    lifeCycle: "woody perennial",
    outputKind: "edible",
    outputUnit: "lb/plant/year",
    daysToMaturityMin: null,
    daysToMaturityMax: null,
    firstYieldYearsMin: 4,
    firstYieldYearsMax: 8,
    fullYieldYearsMin: 8,
    fullYieldYearsMax: 15,
    productiveLifespanYearsMin: 25,
    productiveLifespanYearsMax: 75,
    matureHeightFtMin: 25,
    matureHeightFtMax: 70,
    matureSpreadFtMin: 20,
    matureSpreadFtMax: 60,
    spacingPlantFtMin: 25,
    spacingPlantFtMax: 40,
    spacingRowFtMin: 25,
    spacingRowFtMax: 40,
    outputMin: null,
    outputMax: null,
    harvestWindowWeeksMin: 2,
    harvestWindowWeeksMax: 5,
    difficultyScore: 4,
    reliabilityScore: 3,
    maintenanceScore: 4,
    dataConfidence: "low",
    dataMethod: "nut tree template; seedling/rootstock/region strongly affect timing and yield",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  },
  "nut shrub": {
    lifeCycle: "woody perennial",
    outputKind: "edible",
    outputUnit: "lb/plant/year",
    daysToMaturityMin: null,
    daysToMaturityMax: null,
    firstYieldYearsMin: 3,
    firstYieldYearsMax: 5,
    fullYieldYearsMin: 5,
    fullYieldYearsMax: 8,
    productiveLifespanYearsMin: 15,
    productiveLifespanYearsMax: 30,
    matureHeightFtMin: 6,
    matureHeightFtMax: 12,
    matureSpreadFtMin: 6,
    matureSpreadFtMax: 12,
    spacingPlantFtMin: 6,
    spacingPlantFtMax: 10,
    spacingRowFtMin: 8,
    spacingRowFtMax: 12,
    outputMin: 2,
    outputMax: 8,
    harvestWindowWeeksMin: 2,
    harvestWindowWeeksMax: 4,
    difficultyScore: 2,
    reliabilityScore: 3,
    maintenanceScore: 3,
    dataConfidence: "low",
    dataMethod: "nut shrub template",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  },
  "citrus": {
    lifeCycle: "woody perennial",
    outputKind: "edible",
    outputUnit: "fruit/plant/year",
    daysToMaturityMin: null,
    daysToMaturityMax: null,
    firstYieldYearsMin: 2,
    firstYieldYearsMax: 4,
    fullYieldYearsMin: 4,
    fullYieldYearsMax: 7,
    productiveLifespanYearsMin: 15,
    productiveLifespanYearsMax: 30,
    matureHeightFtMin: 6,
    matureHeightFtMax: 15,
    matureSpreadFtMin: 4,
    matureSpreadFtMax: 12,
    spacingPlantFtMin: 8,
    spacingPlantFtMax: 15,
    spacingRowFtMin: 8,
    spacingRowFtMax: 15,
    outputMin: null,
    outputMax: null,
    harvestWindowWeeksMin: 4,
    harvestWindowWeeksMax: 12,
    difficultyScore: 3,
    reliabilityScore: 3,
    maintenanceScore: 3,
    dataConfidence: "low",
    dataMethod: "citrus template; container culture and frost protection can change outputs",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  },
  "fruit cactus": {
    lifeCycle: "perennial cactus",
    outputKind: "edible",
    outputUnit: "fruit or pads/plant/year",
    daysToMaturityMin: null,
    daysToMaturityMax: null,
    firstYieldYearsMin: 1,
    firstYieldYearsMax: 3,
    fullYieldYearsMin: 3,
    fullYieldYearsMax: 5,
    productiveLifespanYearsMin: 10,
    productiveLifespanYearsMax: 25,
    matureHeightFtMin: 2,
    matureHeightFtMax: 8,
    matureSpreadFtMin: 3,
    matureSpreadFtMax: 8,
    spacingPlantFtMin: 3,
    spacingPlantFtMax: 8,
    spacingRowFtMin: 4,
    spacingRowFtMax: 8,
    outputMin: null,
    outputMax: null,
    harvestWindowWeeksMin: 4,
    harvestWindowWeeksMax: 12,
    difficultyScore: 2,
    reliabilityScore: 3,
    maintenanceScore: 2,
    dataConfidence: "low",
    dataMethod: "fruiting cactus template",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  },
  "perennial herb": {
    lifeCycle: "herbaceous or woody perennial",
    outputKind: "culinary",
    outputUnit: "weeks of leaf/flower harvest",
    daysToMaturityMin: null,
    daysToMaturityMax: null,
    firstYieldYearsMin: 0,
    firstYieldYearsMax: 1,
    fullYieldYearsMin: 1,
    fullYieldYearsMax: 2,
    productiveLifespanYearsMin: 3,
    productiveLifespanYearsMax: 10,
    matureHeightFtMin: 1,
    matureHeightFtMax: 4,
    matureSpreadFtMin: 1,
    matureSpreadFtMax: 4,
    spacingPlantFtMin: 1,
    spacingPlantFtMax: 3,
    spacingRowFtMin: 1,
    spacingRowFtMax: 3,
    outputMin: 8,
    outputMax: 26,
    harvestWindowWeeksMin: 8,
    harvestWindowWeeksMax: 26,
    difficultyScore: 2,
    reliabilityScore: 4,
    maintenanceScore: 2,
    dataConfidence: "medium",
    dataMethod: "perennial culinary herb template",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  },
  "perennial flower": {
    lifeCycle: "herbaceous perennial",
    outputKind: "ornamental",
    outputUnit: "weeks of bloom/display/year",
    daysToMaturityMin: null,
    daysToMaturityMax: null,
    firstYieldYearsMin: 1,
    firstYieldYearsMax: 2,
    fullYieldYearsMin: 2,
    fullYieldYearsMax: 3,
    productiveLifespanYearsMin: 3,
    productiveLifespanYearsMax: 10,
    matureHeightFtMin: 1,
    matureHeightFtMax: 4,
    matureSpreadFtMin: 1,
    matureSpreadFtMax: 3,
    spacingPlantFtMin: 1,
    spacingPlantFtMax: 3,
    spacingRowFtMin: 1,
    spacingRowFtMax: 3,
    outputMin: 3,
    outputMax: 8,
    harvestWindowWeeksMin: 3,
    harvestWindowWeeksMax: 8,
    difficultyScore: 2,
    reliabilityScore: 4,
    maintenanceScore: 2,
    dataConfidence: "medium",
    dataMethod: "herbaceous ornamental template",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder", "kstate-herbaceous-spacing"]
  },
  "annual flower": {
    lifeCycle: "annual",
    outputKind: "ornamental",
    outputUnit: "weeks of bloom/display/year",
    daysToMaturityMin: 60,
    daysToMaturityMax: 90,
    firstYieldYearsMin: 0,
    firstYieldYearsMax: 0,
    fullYieldYearsMin: 0,
    fullYieldYearsMax: 0,
    productiveLifespanYearsMin: 1,
    productiveLifespanYearsMax: 1,
    matureHeightFtMin: 1,
    matureHeightFtMax: 4,
    matureSpreadFtMin: 1,
    matureSpreadFtMax: 3,
    spacingPlantFtMin: 1,
    spacingPlantFtMax: 2,
    spacingRowFtMin: 1,
    spacingRowFtMax: 2,
    outputMin: 8,
    outputMax: 18,
    harvestWindowWeeksMin: 8,
    harvestWindowWeeksMax: 18,
    difficultyScore: 1,
    reliabilityScore: 4,
    maintenanceScore: 2,
    dataConfidence: "medium",
    dataMethod: "annual ornamental template",
    sourceKeys: ["ncsu-plant-toolbox", "kstate-herbaceous-spacing"]
  },
  "ornamental grass": {
    lifeCycle: "herbaceous perennial",
    outputKind: "ornamental",
    outputUnit: "weeks of foliage/seedhead display/year",
    daysToMaturityMin: null,
    daysToMaturityMax: null,
    firstYieldYearsMin: 1,
    firstYieldYearsMax: 2,
    fullYieldYearsMin: 2,
    fullYieldYearsMax: 3,
    productiveLifespanYearsMin: 5,
    productiveLifespanYearsMax: 15,
    matureHeightFtMin: 2,
    matureHeightFtMax: 6,
    matureSpreadFtMin: 1.5,
    matureSpreadFtMax: 4,
    spacingPlantFtMin: 2,
    spacingPlantFtMax: 4,
    spacingRowFtMin: 2,
    spacingRowFtMax: 4,
    outputMin: 14,
    outputMax: 32,
    harvestWindowWeeksMin: 14,
    harvestWindowWeeksMax: 32,
    difficultyScore: 1,
    reliabilityScore: 5,
    maintenanceScore: 1,
    dataConfidence: "medium",
    dataMethod: "ornamental grass template",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder", "kstate-herbaceous-spacing"]
  },
  "ornamental shrub": {
    lifeCycle: "woody perennial",
    outputKind: "ornamental",
    outputUnit: "weeks of bloom/display/year",
    daysToMaturityMin: null,
    daysToMaturityMax: null,
    firstYieldYearsMin: 1,
    firstYieldYearsMax: 2,
    fullYieldYearsMin: 3,
    fullYieldYearsMax: 5,
    productiveLifespanYearsMin: 10,
    productiveLifespanYearsMax: 30,
    matureHeightFtMin: 3,
    matureHeightFtMax: 10,
    matureSpreadFtMin: 3,
    matureSpreadFtMax: 10,
    spacingPlantFtMin: 3,
    spacingPlantFtMax: 8,
    spacingRowFtMin: 3,
    spacingRowFtMax: 8,
    outputMin: 4,
    outputMax: 16,
    harvestWindowWeeksMin: 4,
    harvestWindowWeeksMax: 16,
    difficultyScore: 2,
    reliabilityScore: 4,
    maintenanceScore: 2,
    dataConfidence: "medium",
    dataMethod: "ornamental shrub template",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  },
  "ornamental tree": {
    lifeCycle: "woody perennial",
    outputKind: "ornamental",
    outputUnit: "weeks of bloom/display/year",
    daysToMaturityMin: null,
    daysToMaturityMax: null,
    firstYieldYearsMin: 2,
    firstYieldYearsMax: 5,
    fullYieldYearsMin: 5,
    fullYieldYearsMax: 10,
    productiveLifespanYearsMin: 20,
    productiveLifespanYearsMax: 80,
    matureHeightFtMin: 15,
    matureHeightFtMax: 40,
    matureSpreadFtMin: 12,
    matureSpreadFtMax: 35,
    spacingPlantFtMin: 15,
    spacingPlantFtMax: 35,
    spacingRowFtMin: 15,
    spacingRowFtMax: 35,
    outputMin: 4,
    outputMax: 12,
    harvestWindowWeeksMin: 4,
    harvestWindowWeeksMax: 12,
    difficultyScore: 2,
    reliabilityScore: 4,
    maintenanceScore: 2,
    dataConfidence: "medium",
    dataMethod: "ornamental tree template",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  },
  "ornamental perennial": {
    lifeCycle: "herbaceous perennial",
    outputKind: "ornamental",
    outputUnit: "weeks of foliage/display/year",
    daysToMaturityMin: null,
    daysToMaturityMax: null,
    firstYieldYearsMin: 1,
    firstYieldYearsMax: 2,
    fullYieldYearsMin: 2,
    fullYieldYearsMax: 3,
    productiveLifespanYearsMin: 3,
    productiveLifespanYearsMax: 10,
    matureHeightFtMin: 1,
    matureHeightFtMax: 3,
    matureSpreadFtMin: 1,
    matureSpreadFtMax: 4,
    spacingPlantFtMin: 1,
    spacingPlantFtMax: 3,
    spacingRowFtMin: 1,
    spacingRowFtMax: 3,
    outputMin: 16,
    outputMax: 28,
    harvestWindowWeeksMin: 16,
    harvestWindowWeeksMax: 28,
    difficultyScore: 1,
    reliabilityScore: 4,
    maintenanceScore: 2,
    dataConfidence: "medium",
    dataMethod: "ornamental perennial template",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder", "kstate-herbaceous-spacing"]
  }
};

baseByType["annual fruit vine"] = {
  ...baseByType["annual vegetable"],
  dataMethod: "annual fruiting-vine crop template"
};

const cropRules = [
  rule(["cherry tomato", "sungold"], {
    daysToMaturityMin: 60,
    daysToMaturityMax: 75,
    matureHeightFtMin: 5,
    matureHeightFtMax: 8,
    matureSpreadFtMin: 2,
    matureSpreadFtMax: 3,
    spacingPlantFtMin: 1.5,
    spacingPlantFtMax: 2,
    spacingRowFtMin: 4,
    spacingRowFtMax: 4,
    outputMin: 8,
    outputMax: 15,
    outputUnit: "lb/plant/season",
    harvestWindowWeeksMin: 8,
    harvestWindowWeeksMax: 16,
    difficultyScore: 2,
    reliabilityScore: 4
  }),
  rule(["tomato"], {
    daysToMaturityMin: 70,
    daysToMaturityMax: 90,
    matureHeightFtMin: 3,
    matureHeightFtMax: 8,
    matureSpreadFtMin: 2,
    matureSpreadFtMax: 3,
    spacingPlantFtMin: 1.5,
    spacingPlantFtMax: 2,
    spacingRowFtMin: 4,
    spacingRowFtMax: 4,
    outputMin: 8,
    outputMax: 20,
    outputUnit: "lb/plant/season",
    harvestWindowWeeksMin: 6,
    harvestWindowWeeksMax: 14,
    difficultyScore: 2,
    reliabilityScore: 3
  }),
  rule(["habanero", "serrano", "jalapeno", "poblano", "pepper", "aji amarillo", "shishito"], {
    daysToMaturityMin: 65,
    daysToMaturityMax: 95,
    matureHeightFtMin: 2,
    matureHeightFtMax: 4,
    matureSpreadFtMin: 1.5,
    matureSpreadFtMax: 2.5,
    spacingPlantFtMin: 1.5,
    spacingPlantFtMax: 2,
    spacingRowFtMin: 3,
    spacingRowFtMax: 3,
    outputMin: 2,
    outputMax: 4,
    outputUnit: "lb/plant/season",
    harvestWindowWeeksMin: 6,
    harvestWindowWeeksMax: 14,
    difficultyScore: 2,
    reliabilityScore: 3
  }),
  rule(["eggplant"], {
    daysToMaturityMin: 75,
    daysToMaturityMax: 90,
    matureHeightFtMin: 2,
    matureHeightFtMax: 4,
    matureSpreadFtMin: 2,
    matureSpreadFtMax: 3,
    spacingPlantFtMin: 2,
    spacingPlantFtMax: 2,
    spacingRowFtMin: 3,
    spacingRowFtMax: 3,
    outputMin: 4,
    outputMax: 7,
    outputUnit: "lb/plant/season",
    difficultyScore: 2
  }),
  rule(["okra"], {
    daysToMaturityMin: 55,
    daysToMaturityMax: 65,
    matureHeightFtMin: 4,
    matureHeightFtMax: 7,
    matureSpreadFtMin: 2,
    matureSpreadFtMax: 3,
    spacingPlantFtMin: 1,
    spacingPlantFtMax: 1.25,
    spacingRowFtMin: 3,
    spacingRowFtMax: 3,
    outputMin: 2,
    outputMax: 4,
    outputUnit: "lb/plant/season",
    reliabilityScore: 4
  }),
  rule(["bush bean", "blue lake bush", "provider", "dragon tongue"], {
    daysToMaturityMin: 50,
    daysToMaturityMax: 60,
    matureHeightFtMin: 1.5,
    matureHeightFtMax: 2.5,
    matureSpreadFtMin: 1,
    matureSpreadFtMax: 1.5,
    spacingPlantFtMin: 0.17,
    spacingPlantFtMax: 0.33,
    spacingRowFtMin: 2,
    spacingRowFtMax: 3,
    outputMin: 0.25,
    outputMax: 0.5,
    outputUnit: "lb/plant/season",
    harvestWindowWeeksMin: 2,
    harvestWindowWeeksMax: 5,
    reliabilityScore: 4
  }),
  rule(["pole bean", "runner bean", "rattlesnake", "yardlong"], {
    daysToMaturityMin: 60,
    daysToMaturityMax: 75,
    matureHeightFtMin: 6,
    matureHeightFtMax: 10,
    matureSpreadFtMin: 1,
    matureSpreadFtMax: 2,
    spacingPlantFtMin: 0.33,
    spacingPlantFtMax: 1,
    spacingRowFtMin: 3,
    spacingRowFtMax: 3,
    outputMin: 0.7,
    outputMax: 1.2,
    outputUnit: "lb/plant/season",
    harvestWindowWeeksMin: 4,
    harvestWindowWeeksMax: 8,
    reliabilityScore: 4
  }),
  rule(["lima bean", "cowpea", "crowder pea", "southern pea"], {
    daysToMaturityMin: 60,
    daysToMaturityMax: 80,
    matureHeightFtMin: 1.5,
    matureHeightFtMax: 3,
    matureSpreadFtMin: 1,
    matureSpreadFtMax: 2,
    spacingPlantFtMin: 0.25,
    spacingPlantFtMax: 0.67,
    spacingRowFtMin: 3,
    spacingRowFtMax: 3,
    outputMin: 0.25,
    outputMax: 0.8,
    outputUnit: "lb/plant/season",
    reliabilityScore: 4
  }),
  rule(["edamame", "soybean"], {
    daysToMaturityMin: 75,
    daysToMaturityMax: 95,
    matureHeightFtMin: 1.5,
    matureHeightFtMax: 3,
    matureSpreadFtMin: 1,
    matureSpreadFtMax: 2,
    spacingPlantFtMin: 0.25,
    spacingPlantFtMax: 0.5,
    spacingRowFtMin: 2,
    spacingRowFtMax: 3,
    outputMin: 0.3,
    outputMax: 0.7,
    outputUnit: "lb/plant/season",
    reliabilityScore: 3
  }),
  rule(["pea"], {
    daysToMaturityMin: 60,
    daysToMaturityMax: 70,
    matureHeightFtMin: 2,
    matureHeightFtMax: 6,
    matureSpreadFtMin: 0.5,
    matureSpreadFtMax: 1,
    spacingPlantFtMin: 0.17,
    spacingPlantFtMax: 0.25,
    spacingRowFtMin: 1,
    spacingRowFtMax: 3,
    outputMin: 0.18,
    outputMax: 0.3,
    outputUnit: "lb/plant/season",
    harvestWindowWeeksMin: 2,
    harvestWindowWeeksMax: 5
  }),
  rule(["kale", "collards", "chard", "mizuna", "arugula", "spinach", "malabar", "new zealand spinach", "miner", "tatsoi", "bok choy", "choi", "komatsuna", "mustard"], {
    daysToMaturityMin: 35,
    daysToMaturityMax: 70,
    matureHeightFtMin: 0.75,
    matureHeightFtMax: 3,
    matureSpreadFtMin: 0.75,
    matureSpreadFtMax: 2,
    spacingPlantFtMin: 0.5,
    spacingPlantFtMax: 1.5,
    spacingRowFtMin: 1,
    spacingRowFtMax: 3,
    outputMin: 0.5,
    outputMax: 1.5,
    outputUnit: "lb/plant/season",
    harvestWindowWeeksMin: 4,
    harvestWindowWeeksMax: 14,
    reliabilityScore: 4
  }),
  rule(["lettuce", "radicchio"], {
    daysToMaturityMin: 45,
    daysToMaturityMax: 85,
    matureHeightFtMin: 0.5,
    matureHeightFtMax: 1,
    matureSpreadFtMin: 0.5,
    matureSpreadFtMax: 1,
    spacingPlantFtMin: 0.5,
    spacingPlantFtMax: 1,
    spacingRowFtMin: 1,
    spacingRowFtMax: 3,
    outputMin: 1,
    outputMax: 1,
    outputUnit: "head/plant/season",
    harvestWindowWeeksMin: 1,
    harvestWindowWeeksMax: 4
  }),
  rule(["carrot"], {
    daysToMaturityMin: 60,
    daysToMaturityMax: 80,
    matureHeightFtMin: 0.75,
    matureHeightFtMax: 1.5,
    matureSpreadFtMin: 0.25,
    matureSpreadFtMax: 0.5,
    spacingPlantFtMin: 0.17,
    spacingPlantFtMax: 0.25,
    spacingRowFtMin: 1,
    spacingRowFtMax: 1.5,
    outputMin: 0.1,
    outputMax: 0.2,
    outputUnit: "lb/plant/season"
  }),
  rule(["beet"], {
    daysToMaturityMin: 55,
    daysToMaturityMax: 65,
    matureHeightFtMin: 0.75,
    matureHeightFtMax: 1.5,
    matureSpreadFtMin: 0.25,
    matureSpreadFtMax: 0.5,
    spacingPlantFtMin: 0.17,
    spacingPlantFtMax: 0.25,
    spacingRowFtMin: 1,
    spacingRowFtMax: 3,
    outputMin: 0.25,
    outputMax: 0.35,
    outputUnit: "lb/plant/season"
  }),
  rule(["radish"], {
    daysToMaturityMin: 25,
    daysToMaturityMax: 35,
    matureHeightFtMin: 0.5,
    matureHeightFtMax: 1,
    matureSpreadFtMin: 0.25,
    matureSpreadFtMax: 0.5,
    spacingPlantFtMin: 0.08,
    spacingPlantFtMax: 0.17,
    spacingRowFtMin: 0.5,
    spacingRowFtMax: 2,
    outputMin: 1,
    outputMax: 1,
    outputUnit: "root/plant/season",
    harvestWindowWeeksMin: 1,
    harvestWindowWeeksMax: 3,
    reliabilityScore: 5
  }),
  rule(["turnip", "daikon", "rutabaga"], {
    daysToMaturityMin: 45,
    daysToMaturityMax: 65,
    matureHeightFtMin: 0.75,
    matureHeightFtMax: 1.5,
    matureSpreadFtMin: 0.5,
    matureSpreadFtMax: 1,
    spacingPlantFtMin: 0.17,
    spacingPlantFtMax: 0.5,
    spacingRowFtMin: 1.5,
    spacingRowFtMax: 2,
    outputMin: 0.4,
    outputMax: 0.6,
    outputUnit: "lb/plant/season"
  }),
  rule(["parsnip"], {
    daysToMaturityMin: 95,
    daysToMaturityMax: 120,
    matureHeightFtMin: 1,
    matureHeightFtMax: 2,
    matureSpreadFtMin: 0.5,
    matureSpreadFtMax: 1,
    spacingPlantFtMin: 0.25,
    spacingPlantFtMax: 0.5,
    spacingRowFtMin: 1.5,
    spacingRowFtMax: 2,
    outputMin: 0.25,
    outputMax: 0.5,
    outputUnit: "lb/plant/season"
  }),
  rule(["celeriac"], {
    daysToMaturityMin: 100,
    daysToMaturityMax: 120,
    matureHeightFtMin: 1,
    matureHeightFtMax: 2,
    matureSpreadFtMin: 1,
    matureSpreadFtMax: 1.5,
    spacingPlantFtMin: 0.75,
    spacingPlantFtMax: 1,
    spacingRowFtMin: 1.5,
    spacingRowFtMax: 2,
    outputMin: 0.75,
    outputMax: 1.5,
    outputUnit: "lb/plant/season",
    difficultyScore: 3
  }),
  rule(["florence fennel"], {
    daysToMaturityMin: 80,
    daysToMaturityMax: 100,
    matureHeightFtMin: 2,
    matureHeightFtMax: 4,
    matureSpreadFtMin: 1,
    matureSpreadFtMax: 1.5,
    spacingPlantFtMin: 0.5,
    spacingPlantFtMax: 1,
    spacingRowFtMin: 1.5,
    spacingRowFtMax: 2,
    outputMin: 0.5,
    outputMax: 1,
    outputUnit: "lb/plant/season",
    difficultyScore: 3
  }),
  rule(["broccoli", "cauliflower"], {
    daysToMaturityMin: 55,
    daysToMaturityMax: 90,
    matureHeightFtMin: 1.5,
    matureHeightFtMax: 3,
    matureSpreadFtMin: 1.5,
    matureSpreadFtMax: 2.5,
    spacingPlantFtMin: 1,
    spacingPlantFtMax: 2,
    spacingRowFtMin: 2,
    spacingRowFtMax: 3,
    outputMin: 1.25,
    outputMax: 1.75,
    outputUnit: "lb/plant/season",
    difficultyScore: 3
  }),
  rule(["cucumber"], {
    daysToMaturityMin: 50,
    daysToMaturityMax: 65,
    matureHeightFtMin: 4,
    matureHeightFtMax: 8,
    matureSpreadFtMin: 2,
    matureSpreadFtMax: 6,
    spacingPlantFtMin: 0.5,
    spacingPlantFtMax: 4,
    spacingRowFtMin: 2,
    spacingRowFtMax: 6,
    outputMin: 3,
    outputMax: 5,
    outputUnit: "lb/plant/season",
    harvestWindowWeeksMin: 4,
    harvestWindowWeeksMax: 8,
    reliabilityScore: 4,
    sourceKeys: ["umn-vegetable-field-planning", "umaine-vegetable-yield", "lsu-vegetable-yields"]
  }),
  rule(["zucchini", "summer squash", "crookneck"], {
    daysToMaturityMin: 40,
    daysToMaturityMax: 60,
    matureHeightFtMin: 1.5,
    matureHeightFtMax: 3,
    matureSpreadFtMin: 3,
    matureSpreadFtMax: 5,
    spacingPlantFtMin: 2,
    spacingPlantFtMax: 4,
    spacingRowFtMin: 3,
    spacingRowFtMax: 4,
    outputMin: 3,
    outputMax: 8,
    outputUnit: "lb/plant/season",
    harvestWindowWeeksMin: 5,
    harvestWindowWeeksMax: 10,
    reliabilityScore: 4,
    sourceKeys: ["umn-vegetable-field-planning", "umaine-vegetable-yield", "lsu-vegetable-yields"]
  }),
  rule(["butternut", "winter squash", "delicata", "kabocha", "pumpkin", "spaghetti squash"], {
    daysToMaturityMin: 85,
    daysToMaturityMax: 120,
    matureHeightFtMin: 1,
    matureHeightFtMax: 2,
    matureSpreadFtMin: 6,
    matureSpreadFtMax: 12,
    spacingPlantFtMin: 3,
    spacingPlantFtMax: 4,
    spacingRowFtMin: 5,
    spacingRowFtMax: 6,
    outputMin: 10,
    outputMax: 20,
    outputUnit: "lb/plant/season",
    harvestWindowWeeksMin: 1,
    harvestWindowWeeksMax: 4
  }),
  rule(["watermelon"], {
    daysToMaturityMin: 80,
    daysToMaturityMax: 100,
    matureHeightFtMin: 1,
    matureHeightFtMax: 2,
    matureSpreadFtMin: 6,
    matureSpreadFtMax: 12,
    spacingPlantFtMin: 3,
    spacingPlantFtMax: 4,
    spacingRowFtMin: 5,
    spacingRowFtMax: 6,
    outputMin: 3,
    outputMax: 10,
    outputUnit: "lb/plant/season",
    difficultyScore: 3,
    sourceKeys: ["umn-vegetable-field-planning", "lsu-vegetable-yields"]
  }),
  rule(["cantaloupe", "melon"], {
    daysToMaturityMin: 80,
    daysToMaturityMax: 95,
    matureHeightFtMin: 1,
    matureHeightFtMax: 2,
    matureSpreadFtMin: 4,
    matureSpreadFtMax: 8,
    spacingPlantFtMin: 1.5,
    spacingPlantFtMax: 3,
    spacingRowFtMin: 5,
    spacingRowFtMax: 6,
    outputMin: 4,
    outputMax: 7,
    outputUnit: "lb/plant/season",
    difficultyScore: 3,
    sourceKeys: ["umn-vegetable-field-planning", "lsu-vegetable-yields"]
  }),
  rule(["corn"], {
    daysToMaturityMin: 65,
    daysToMaturityMax: 100,
    matureHeightFtMin: 5,
    matureHeightFtMax: 8,
    matureSpreadFtMin: 1,
    matureSpreadFtMax: 2,
    spacingPlantFtMin: 0.5,
    spacingPlantFtMax: 0.75,
    spacingRowFtMin: 2,
    spacingRowFtMax: 3,
    outputMin: 1,
    outputMax: 2,
    outputUnit: "ears/plant/season",
    difficultyScore: 3
  }),
  rule(["potato"], {
    daysToMaturityMin: 70,
    daysToMaturityMax: 120,
    matureHeightFtMin: 1.5,
    matureHeightFtMax: 3,
    matureSpreadFtMin: 1,
    matureSpreadFtMax: 2,
    spacingPlantFtMin: 1,
    spacingPlantFtMax: 1.5,
    spacingRowFtMin: 3,
    spacingRowFtMax: 3,
    outputMin: 2,
    outputMax: 3,
    outputUnit: "lb/plant/season"
  }),
  rule(["sweet potato"], {
    daysToMaturityMin: 90,
    daysToMaturityMax: 150,
    matureHeightFtMin: 1,
    matureHeightFtMax: 2,
    matureSpreadFtMin: 3,
    matureSpreadFtMax: 6,
    spacingPlantFtMin: 1,
    spacingPlantFtMax: 1.5,
    spacingRowFtMin: 3,
    spacingRowFtMax: 3,
    outputMin: 2,
    outputMax: 3,
    outputUnit: "lb/plant/season"
  }),
  rule(["garlic"], {
    daysToMaturityMin: 240,
    daysToMaturityMax: 300,
    matureHeightFtMin: 1,
    matureHeightFtMax: 2,
    matureSpreadFtMin: 0.25,
    matureSpreadFtMax: 0.5,
    spacingPlantFtMin: 0.5,
    spacingPlantFtMax: 0.67,
    spacingRowFtMin: 1,
    spacingRowFtMax: 1.5,
    outputMin: 0.05,
    outputMax: 0.2,
    outputUnit: "lb/plant/season",
    reliabilityScore: 4,
    sourceKeys: ["umn-vegetable-field-planning", "umaine-vegetable-yield"]
  }),
  rule(["onion"], {
    daysToMaturityMin: 90,
    daysToMaturityMax: 120,
    matureHeightFtMin: 1,
    matureHeightFtMax: 2,
    matureSpreadFtMin: 0.25,
    matureSpreadFtMax: 0.5,
    spacingPlantFtMin: 0.25,
    spacingPlantFtMax: 0.5,
    spacingRowFtMin: 1,
    spacingRowFtMax: 1.5,
    outputMin: 0.25,
    outputMax: 0.5,
    outputUnit: "lb/plant/season",
    reliabilityScore: 4,
    sourceKeys: ["umn-vegetable-field-planning", "umaine-vegetable-yield", "lsu-vegetable-yields"]
  }),
  rule(["leek"], {
    daysToMaturityMin: 90,
    daysToMaturityMax: 120,
    matureHeightFtMin: 1,
    matureHeightFtMax: 2,
    matureSpreadFtMin: 0.25,
    matureSpreadFtMax: 0.5,
    spacingPlantFtMin: 0.25,
    spacingPlantFtMax: 0.5,
    spacingRowFtMin: 1,
    spacingRowFtMax: 1.5,
    outputMin: 0.25,
    outputMax: 0.75,
    outputUnit: "lb/plant/season",
    reliabilityScore: 4,
    dataConfidence: "low",
    sourceKeys: ["umaine-vegetable-yield", "lsu-vegetable-yields"]
  }),
  rule(["apple"], {
    firstYieldYearsMin: 2,
    firstYieldYearsMax: 4,
    fullYieldYearsMin: 6,
    fullYieldYearsMax: 10,
    productiveLifespanYearsMin: 15,
    productiveLifespanYearsMax: 25,
    matureHeightFtMin: 10,
    matureHeightFtMax: 22,
    matureSpreadFtMin: 10,
    matureSpreadFtMax: 20,
    spacingPlantFtMin: 10,
    spacingPlantFtMax: 20,
    spacingRowFtMin: 12,
    spacingRowFtMax: 25,
    outputMin: 75,
    outputMax: 150,
    outputUnit: "lb/plant/year",
    difficultyScore: 4,
    reliabilityScore: 3,
    sourceKeys: ["purdue-midwest-fruit", "psu-pome-spacing-yield"]
  }),
  rule(["pear tree", "bartlett pear", "kieffer pear", "ayers pear", "asian pear", "bosc pear", "comice pear", "magness pear", "warren pear", "harrow sweet pear"], {
    firstYieldYearsMin: 4,
    firstYieldYearsMax: 5,
    fullYieldYearsMin: 7,
    fullYieldYearsMax: 10,
    productiveLifespanYearsMin: 15,
    productiveLifespanYearsMax: 30,
    matureHeightFtMin: 12,
    matureHeightFtMax: 25,
    matureSpreadFtMin: 12,
    matureSpreadFtMax: 20,
    spacingPlantFtMin: 15,
    spacingPlantFtMax: 20,
    spacingRowFtMin: 18,
    spacingRowFtMax: 25,
    outputMin: 80,
    outputMax: 120,
    outputUnit: "lb/plant/year",
    difficultyScore: 3,
    sourceKeys: ["purdue-midwest-fruit", "psu-pome-spacing-yield"]
  }),
  rule(["peach", "nectarine"], {
    firstYieldYearsMin: 3,
    firstYieldYearsMax: 4,
    fullYieldYearsMin: 5,
    fullYieldYearsMax: 7,
    productiveLifespanYearsMin: 10,
    productiveLifespanYearsMax: 15,
    matureHeightFtMin: 12,
    matureHeightFtMax: 20,
    matureSpreadFtMin: 12,
    matureSpreadFtMax: 20,
    spacingPlantFtMin: 14,
    spacingPlantFtMax: 20,
    spacingRowFtMin: 20,
    spacingRowFtMax: 25,
    outputMin: 90,
    outputMax: 120,
    outputUnit: "lb/plant/year",
    difficultyScore: 4,
    reliabilityScore: 2,
    sourceKeys: ["purdue-midwest-fruit", "psu-stone-spacing-yield", "umn-stone-fruit"]
  }),
  rule(["plum"], {
    firstYieldYearsMin: 4,
    firstYieldYearsMax: 5,
    fullYieldYearsMin: 6,
    fullYieldYearsMax: 8,
    productiveLifespanYearsMin: 12,
    productiveLifespanYearsMax: 20,
    matureHeightFtMin: 12,
    matureHeightFtMax: 20,
    matureSpreadFtMin: 12,
    matureSpreadFtMax: 20,
    spacingPlantFtMin: 14,
    spacingPlantFtMax: 20,
    spacingRowFtMin: 20,
    spacingRowFtMax: 25,
    outputMin: 75,
    outputMax: 120,
    outputUnit: "lb/plant/year",
    difficultyScore: 3,
    sourceKeys: ["purdue-midwest-fruit", "psu-stone-spacing-yield", "umn-stone-fruit"]
  }),
  rule(["sweet cherry", "bing cherry", "rainier", "stella", "blackgold", "sweetheart"], {
    firstYieldYearsMin: 4,
    firstYieldYearsMax: 7,
    fullYieldYearsMin: 7,
    fullYieldYearsMax: 10,
    productiveLifespanYearsMin: 15,
    productiveLifespanYearsMax: 25,
    matureHeightFtMin: 15,
    matureHeightFtMax: 30,
    matureSpreadFtMin: 15,
    matureSpreadFtMax: 25,
    spacingPlantFtMin: 20,
    spacingPlantFtMax: 25,
    spacingRowFtMin: 25,
    spacingRowFtMax: 30,
    outputMin: 60,
    outputMax: 90,
    outputUnit: "lb/plant/year",
    difficultyScore: 4,
    reliabilityScore: 2,
    sourceKeys: ["purdue-midwest-fruit", "psu-stone-spacing-yield", "umn-stone-fruit"]
  }),
  rule(["tart cherry", "north star", "montmorency", "balaton"], {
    firstYieldYearsMin: 3,
    firstYieldYearsMax: 5,
    fullYieldYearsMin: 6,
    fullYieldYearsMax: 8,
    productiveLifespanYearsMin: 10,
    productiveLifespanYearsMax: 20,
    matureHeightFtMin: 8,
    matureHeightFtMax: 18,
    matureSpreadFtMin: 8,
    matureSpreadFtMax: 18,
    spacingPlantFtMin: 15,
    spacingPlantFtMax: 20,
    spacingRowFtMin: 18,
    spacingRowFtMax: 25,
    outputMin: 40,
    outputMax: 75,
    outputUnit: "lb/plant/year",
    difficultyScore: 3,
    sourceKeys: ["purdue-midwest-fruit", "psu-stone-spacing-yield", "umn-stone-fruit"]
  }),
  rule(["bush cherry", "nanking", "carmine jewel", "romeo"], {
    firstYieldYearsMin: 2,
    firstYieldYearsMax: 4,
    fullYieldYearsMin: 4,
    fullYieldYearsMax: 6,
    productiveLifespanYearsMin: 10,
    productiveLifespanYearsMax: 20,
    matureHeightFtMin: 4,
    matureHeightFtMax: 8,
    matureSpreadFtMin: 4,
    matureSpreadFtMax: 8,
    spacingPlantFtMin: 4,
    spacingPlantFtMax: 8,
    spacingRowFtMin: 6,
    spacingRowFtMax: 10,
    outputMin: 8,
    outputMax: 25,
    outputUnit: "lb/plant/year",
    difficultyScore: 2,
    reliabilityScore: 4
  }),
  rule(["apricot"], {
    firstYieldYearsMin: 3,
    firstYieldYearsMax: 5,
    fullYieldYearsMin: 5,
    fullYieldYearsMax: 8,
    productiveLifespanYearsMin: 12,
    productiveLifespanYearsMax: 20,
    matureHeightFtMin: 12,
    matureHeightFtMax: 20,
    matureSpreadFtMin: 12,
    matureSpreadFtMax: 20,
    spacingPlantFtMin: 13,
    spacingPlantFtMax: 20,
    spacingRowFtMin: 20,
    spacingRowFtMax: 25,
    outputMin: 60,
    outputMax: 120,
    outputUnit: "lb/plant/year",
    difficultyScore: 4,
    reliabilityScore: 2,
    sourceKeys: ["psu-stone-spacing-yield", "umn-stone-fruit"]
  }),
  rule(["fig"], {
    firstYieldYearsMin: 1,
    firstYieldYearsMax: 3,
    fullYieldYearsMin: 3,
    fullYieldYearsMax: 5,
    productiveLifespanYearsMin: 15,
    productiveLifespanYearsMax: 30,
    matureHeightFtMin: 6,
    matureHeightFtMax: 15,
    matureSpreadFtMin: 6,
    matureSpreadFtMax: 15,
    spacingPlantFtMin: 8,
    spacingPlantFtMax: 15,
    spacingRowFtMin: 8,
    spacingRowFtMax: 15,
    outputMin: 20,
    outputMax: 60,
    outputUnit: "lb/plant/year",
    difficultyScore: 2,
    reliabilityScore: 4,
    dataConfidence: "low",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  }),
  rule(["blueberry"], {
    firstYieldYearsMin: 2,
    firstYieldYearsMax: 3,
    fullYieldYearsMin: 5,
    fullYieldYearsMax: 8,
    productiveLifespanYearsMin: 20,
    productiveLifespanYearsMax: 40,
    matureHeightFtMin: 3,
    matureHeightFtMax: 8,
    matureSpreadFtMin: 3,
    matureSpreadFtMax: 6,
    spacingPlantFtMin: 4,
    spacingPlantFtMax: 6,
    spacingRowFtMin: 8,
    spacingRowFtMax: 12,
    outputMin: 5,
    outputMax: 15,
    outputUnit: "lb/plant/year",
    difficultyScore: 3,
    reliabilityScore: 4,
    sourceKeys: ["umn-blueberry", "osu-blueberry", "uga-blueberry"]
  }),
  rule(["legacy blueberry"], {
    outputMin: 9,
    outputMax: 21,
    sourceKeys: ["osu-blueberry"]
  }),
  rule(["elderberry"], {
    firstYieldYearsMin: 2,
    firstYieldYearsMax: 3,
    fullYieldYearsMin: 4,
    fullYieldYearsMax: 6,
    productiveLifespanYearsMin: 10,
    productiveLifespanYearsMax: 20,
    matureHeightFtMin: 6,
    matureHeightFtMax: 12,
    matureSpreadFtMin: 6,
    matureSpreadFtMax: 10,
    spacingPlantFtMin: 4,
    spacingPlantFtMax: 8,
    spacingRowFtMin: 10,
    spacingRowFtMax: 12,
    outputMin: 4,
    outputMax: 15,
    outputUnit: "lb/plant/year",
    difficultyScore: 2,
    reliabilityScore: 4,
    sourceKeys: ["osu-elderberry", "stark-elderberry-yield"]
  }),
  rule(["aronia", "chokeberry"], {
    firstYieldYearsMin: 2,
    firstYieldYearsMax: 3,
    fullYieldYearsMin: 7,
    fullYieldYearsMax: 8,
    matureHeightFtMin: 3,
    matureHeightFtMax: 8,
    matureSpreadFtMin: 3,
    matureSpreadFtMax: 6,
    spacingPlantFtMin: 3,
    spacingPlantFtMax: 6,
    outputMin: 3,
    outputMax: 15,
    outputUnit: "lb/plant/year",
    sourceKeys: ["umd-aronia"]
  }),
  rule(["strawberry"], {
    firstYieldYearsMin: 0,
    firstYieldYearsMax: 1,
    fullYieldYearsMin: 1,
    fullYieldYearsMax: 2,
    productiveLifespanYearsMin: 3,
    productiveLifespanYearsMax: 5,
    matureHeightFtMin: 0.5,
    matureHeightFtMax: 1,
    matureSpreadFtMin: 1,
    matureSpreadFtMax: 2,
    spacingPlantFtMin: 1,
    spacingPlantFtMax: 1.5,
    spacingRowFtMin: 3,
    spacingRowFtMax: 4,
    outputMin: 0.75,
    outputMax: 2,
    outputUnit: "lb/plant/year",
    harvestWindowWeeksMin: 2,
    harvestWindowWeeksMax: 14,
    sourceKeys: ["umn-strawberry", "usu-strawberry-yield"]
  }),
  rule(["blackberry"], {
    firstYieldYearsMin: 1,
    firstYieldYearsMax: 2,
    fullYieldYearsMin: 2,
    fullYieldYearsMax: 3,
    matureHeightFtMin: 4,
    matureHeightFtMax: 8,
    spacingPlantFtMin: 3,
    spacingPlantFtMax: 4,
    spacingRowFtMin: 8,
    spacingRowFtMax: 10,
    outputMin: 5,
    outputMax: 15,
    outputUnit: "lb/plant/year",
    sourceKeys: ["umd-brambles"]
  }),
  rule(["raspberry"], {
    firstYieldYearsMin: 1,
    firstYieldYearsMax: 2,
    fullYieldYearsMin: 2,
    fullYieldYearsMax: 3,
    matureHeightFtMin: 4,
    matureHeightFtMax: 6,
    spacingPlantFtMin: 2,
    spacingPlantFtMax: 3,
    spacingRowFtMin: 8,
    spacingRowFtMax: 10,
    outputMin: 2,
    outputMax: 6,
    outputUnit: "lb/plant/year",
    sourceKeys: ["umd-brambles"]
  }),
  rule(["muscadine"], {
    firstYieldYearsMin: 3,
    firstYieldYearsMax: 4,
    fullYieldYearsMin: 5,
    fullYieldYearsMax: 6,
    matureSpreadFtMin: 10,
    matureSpreadFtMax: 20,
    spacingPlantFtMin: 10,
    spacingPlantFtMax: 20,
    spacingRowFtMin: 10,
    spacingRowFtMax: 12,
    outputMin: 20,
    outputMax: 60,
    outputUnit: "lb/plant/year",
    sourceKeys: ["okstate-grape"]
  }),
  rule(["grape"], {
    firstYieldYearsMin: 3,
    firstYieldYearsMax: 3,
    fullYieldYearsMin: 4,
    fullYieldYearsMax: 5,
    outputMin: 1,
    outputMax: 25,
    outputUnit: "lb/plant/year",
    sourceKeys: ["okstate-grape"]
  }),
  rule(["goumi", "gooseberry", "currant", "honeyberry", "serviceberry"], {
    firstYieldYearsMin: 2,
    firstYieldYearsMax: 4,
    fullYieldYearsMin: 4,
    fullYieldYearsMax: 7,
    matureHeightFtMin: 3,
    matureHeightFtMax: 8,
    matureSpreadFtMin: 3,
    matureSpreadFtMax: 8,
    spacingPlantFtMin: 4,
    spacingPlantFtMax: 8,
    outputMin: 3,
    outputMax: 12,
    outputUnit: "lb/plant/year",
    dataConfidence: "low",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  }),
  rule(["lingonberry"], {
    firstYieldYearsMin: 2,
    firstYieldYearsMax: 4,
    fullYieldYearsMin: 5,
    fullYieldYearsMax: 8,
    productiveLifespanYearsMin: 20,
    productiveLifespanYearsMax: 25,
    matureHeightFtMin: 0.75,
    matureHeightFtMax: 1.5,
    matureSpreadFtMin: 1,
    matureSpreadFtMax: 2,
    spacingPlantFtMin: 1,
    spacingPlantFtMax: 2,
    outputMin: 0.25,
    outputMax: 1,
    outputUnit: "lb/plant/year",
    sourceKeys: ["osu-lingonberry"]
  }),
  rule(["cranberry"], {
    firstYieldYearsMin: 2,
    firstYieldYearsMax: 4,
    fullYieldYearsMin: 4,
    fullYieldYearsMax: 6,
    matureHeightFtMin: 0.25,
    matureHeightFtMax: 0.75,
    matureSpreadFtMin: 1,
    matureSpreadFtMax: 3,
    spacingPlantFtMin: 1,
    spacingPlantFtMax: 2,
    outputMin: 0.25,
    outputMax: 1,
    outputUnit: "lb/plant/year",
    dataConfidence: "low"
  }),
  rule(["pomegranate"], {
    firstYieldYearsMin: 3,
    firstYieldYearsMax: 3,
    fullYieldYearsMin: 5,
    fullYieldYearsMax: 6,
    matureHeightFtMin: 6,
    matureHeightFtMax: 12,
    matureSpreadFtMin: 6,
    matureSpreadFtMax: 10,
    spacingPlantFtMin: 14,
    spacingPlantFtMax: 18,
    spacingRowFtMin: 18,
    spacingRowFtMax: 18,
    outputMin: 20,
    outputMax: 50,
    outputUnit: "fruit/plant/year",
    dataConfidence: "low",
    sourceKeys: ["uga-pomegranate-production"]
  }),
  rule(["loquat"], {
    firstYieldYearsMin: 3,
    firstYieldYearsMax: 5,
    fullYieldYearsMin: 5,
    fullYieldYearsMax: 8,
    matureHeightFtMin: 10,
    matureHeightFtMax: 25,
    matureSpreadFtMin: 10,
    matureSpreadFtMax: 20,
    spacingPlantFtMin: 15,
    spacingPlantFtMax: 25,
    outputMin: 20,
    outputMax: 75,
    outputUnit: "lb/plant/year",
    dataConfidence: "low",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  }),
  rule(["mayhaw"], {
    firstYieldYearsMin: 3,
    firstYieldYearsMax: 6,
    fullYieldYearsMin: 6,
    fullYieldYearsMax: 10,
    matureHeightFtMin: 15,
    matureHeightFtMax: 30,
    matureSpreadFtMin: 15,
    matureSpreadFtMax: 25,
    spacingPlantFtMin: 15,
    spacingPlantFtMax: 25,
    outputMin: 20,
    outputMax: 60,
    outputUnit: "lb/plant/year",
    dataConfidence: "low",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  }),
  rule(["olive"], {
    firstYieldYearsMin: 3,
    firstYieldYearsMax: 5,
    fullYieldYearsMin: 5,
    fullYieldYearsMax: 8,
    matureHeightFtMin: 8,
    matureHeightFtMax: 20,
    matureSpreadFtMin: 6,
    matureSpreadFtMax: 15,
    spacingPlantFtMin: 8,
    spacingPlantFtMax: 15,
    outputMin: 10,
    outputMax: 50,
    outputUnit: "lb/plant/year",
    dataConfidence: "low",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  }),
  rule(["satsuma mandarin", "owari satsuma", "mandarin"], {
    firstYieldYearsMin: 3,
    firstYieldYearsMax: 4,
    fullYieldYearsMin: 5,
    fullYieldYearsMax: 8,
    matureHeightFtMin: 8,
    matureHeightFtMax: 20,
    matureSpreadFtMin: 6,
    matureSpreadFtMax: 15,
    spacingPlantFtMin: 20,
    spacingPlantFtMax: 30,
    outputMin: 80,
    outputMax: 250,
    outputUnit: "lb/plant/year",
    difficultyScore: 3,
    sourceKeys: ["lsu-citrus-yield"]
  }),
  rule(["citrus", "meyer lemon", "kumquat", "calamondin", "finger lime", "yuzu", "hardy orange"], {
    firstYieldYearsMin: 2,
    firstYieldYearsMax: 4,
    fullYieldYearsMin: 4,
    fullYieldYearsMax: 7,
    matureHeightFtMin: 6,
    matureHeightFtMax: 15,
    matureSpreadFtMin: 4,
    matureSpreadFtMax: 12,
    spacingPlantFtMin: 8,
    spacingPlantFtMax: 15,
    outputMin: 40,
    outputMax: 100,
    outputUnit: "lb/plant/year",
    difficultyScore: 3,
    sourceKeys: ["lsu-citrus-yield"]
  }),
  rule(["kiwi"], {
    firstYieldYearsMin: 3,
    firstYieldYearsMax: 5,
    fullYieldYearsMin: 5,
    fullYieldYearsMax: 8,
    matureHeightFtMin: 8,
    matureHeightFtMax: 12,
    matureSpreadFtMin: 10,
    matureSpreadFtMax: 20,
    spacingPlantFtMin: 8,
    spacingPlantFtMax: 12,
    spacingRowFtMin: 10,
    spacingRowFtMax: 15,
    outputMin: 20,
    outputMax: 50,
    outputUnit: "lb/plant/year",
    difficultyScore: 3,
    dataConfidence: "low",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  }),
  rule(["passionfruit", "maypop"], {
    firstYieldYearsMin: 1,
    firstYieldYearsMax: 3,
    fullYieldYearsMin: 2,
    fullYieldYearsMax: 4,
    matureHeightFtMin: 6,
    matureHeightFtMax: 12,
    matureSpreadFtMin: 6,
    matureSpreadFtMax: 12,
    spacingPlantFtMin: 6,
    spacingPlantFtMax: 10,
    outputMin: 20,
    outputMax: 60,
    outputUnit: "fruit/plant/year",
    dataConfidence: "low",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  }),
  rule(["schisandra"], {
    firstYieldYearsMin: 3,
    firstYieldYearsMax: 5,
    fullYieldYearsMin: 5,
    fullYieldYearsMax: 7,
    matureHeightFtMin: 8,
    matureHeightFtMax: 15,
    matureSpreadFtMin: 6,
    matureSpreadFtMax: 12,
    spacingPlantFtMin: 6,
    spacingPlantFtMax: 10,
    outputMin: 2,
    outputMax: 8,
    outputUnit: "lb/plant/year",
    dataConfidence: "low",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  }),
  rule(["goji"], {
    firstYieldYearsMin: 2,
    firstYieldYearsMax: 3,
    fullYieldYearsMin: 3,
    fullYieldYearsMax: 5,
    matureHeightFtMin: 4,
    matureHeightFtMax: 8,
    matureSpreadFtMin: 4,
    matureSpreadFtMax: 8,
    spacingPlantFtMin: 4,
    spacingPlantFtMax: 6,
    outputMin: 1,
    outputMax: 5,
    outputUnit: "lb/plant/year",
    dataConfidence: "low",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  }),
  rule(["seaberry"], {
    firstYieldYearsMin: 3,
    firstYieldYearsMax: 5,
    fullYieldYearsMin: 5,
    fullYieldYearsMax: 8,
    matureHeightFtMin: 6,
    matureHeightFtMax: 12,
    matureSpreadFtMin: 4,
    matureSpreadFtMax: 8,
    spacingPlantFtMin: 4,
    spacingPlantFtMax: 8,
    outputMin: 5,
    outputMax: 15,
    outputUnit: "lb/plant/year",
    dataConfidence: "low",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  }),
  rule(["medlar", "quince", "cornelian cherry", "che fruit"], {
    firstYieldYearsMin: 3,
    firstYieldYearsMax: 6,
    fullYieldYearsMin: 5,
    fullYieldYearsMax: 9,
    matureHeightFtMin: 8,
    matureHeightFtMax: 20,
    matureSpreadFtMin: 8,
    matureSpreadFtMax: 18,
    spacingPlantFtMin: 10,
    spacingPlantFtMax: 20,
    outputMin: 15,
    outputMax: 50,
    outputUnit: "lb/plant/year",
    dataConfidence: "low",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  }),
  rule(["guava", "feijoa"], {
    firstYieldYearsMin: 2,
    firstYieldYearsMax: 4,
    fullYieldYearsMin: 4,
    fullYieldYearsMax: 6,
    matureHeightFtMin: 4,
    matureHeightFtMax: 15,
    matureSpreadFtMin: 4,
    matureSpreadFtMax: 12,
    spacingPlantFtMin: 6,
    spacingPlantFtMax: 12,
    outputMin: 5,
    outputMax: 40,
    outputUnit: "lb/plant/year",
    dataConfidence: "low",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  }),
  rule(["jaboticaba", "starfruit", "white sapote", "sapodilla", "cherimoya", "atemoya", "custard apple"], {
    firstYieldYearsMin: 3,
    firstYieldYearsMax: 6,
    fullYieldYearsMin: 6,
    fullYieldYearsMax: 10,
    matureHeightFtMin: 10,
    matureHeightFtMax: 25,
    matureSpreadFtMin: 8,
    matureSpreadFtMax: 20,
    spacingPlantFtMin: 10,
    spacingPlantFtMax: 20,
    outputMin: 20,
    outputMax: 80,
    outputUnit: "fruit/plant/year",
    difficultyScore: 4,
    dataConfidence: "low",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  }),
  rule(["dragon fruit"], {
    firstYieldYearsMin: 1,
    firstYieldYearsMax: 3,
    fullYieldYearsMin: 3,
    fullYieldYearsMax: 5,
    matureHeightFtMin: 4,
    matureHeightFtMax: 8,
    matureSpreadFtMin: 3,
    matureSpreadFtMax: 6,
    spacingPlantFtMin: 3,
    spacingPlantFtMax: 6,
    outputMin: 5,
    outputMax: 25,
    outputUnit: "fruit/plant/year",
    dataConfidence: "low",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  }),
  rule(["prickly pear"], {
    firstYieldYearsMin: 1,
    firstYieldYearsMax: 3,
    fullYieldYearsMin: 3,
    fullYieldYearsMax: 5,
    matureHeightFtMin: 1,
    matureHeightFtMax: 4,
    matureSpreadFtMin: 2,
    matureSpreadFtMax: 6,
    spacingPlantFtMin: 2,
    spacingPlantFtMax: 6,
    outputMin: 10,
    outputMax: 40,
    outputUnit: "fruit or pads/plant/year",
    dataConfidence: "low",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  }),
  rule(["yacon", "oca", "skirret"], {
    daysToMaturityMin: 120,
    daysToMaturityMax: 180,
    firstYieldYearsMin: 0,
    firstYieldYearsMax: 1,
    fullYieldYearsMin: 1,
    fullYieldYearsMax: 2,
    matureHeightFtMin: 1,
    matureHeightFtMax: 5,
    matureSpreadFtMin: 1,
    matureSpreadFtMax: 3,
    spacingPlantFtMin: 1,
    spacingPlantFtMax: 3,
    spacingRowFtMin: 2,
    spacingRowFtMax: 4,
    outputMin: 1,
    outputMax: 5,
    outputUnit: "lb/plant/year",
    dataConfidence: "low",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  }),
  rule(["chayote"], {
    firstYieldYearsMin: 0,
    firstYieldYearsMax: 1,
    fullYieldYearsMin: 1,
    fullYieldYearsMax: 2,
    matureHeightFtMin: 6,
    matureHeightFtMax: 12,
    matureSpreadFtMin: 8,
    matureSpreadFtMax: 20,
    spacingPlantFtMin: 6,
    spacingPlantFtMax: 10,
    outputMin: 20,
    outputMax: 75,
    outputUnit: "fruit/plant/year",
    dataConfidence: "low",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  }),
  rule(["roselle"], {
    daysToMaturityMin: 90,
    daysToMaturityMax: 120,
    matureHeightFtMin: 4,
    matureHeightFtMax: 7,
    matureSpreadFtMin: 2,
    matureSpreadFtMax: 4,
    spacingPlantFtMin: 2,
    spacingPlantFtMax: 3,
    spacingRowFtMin: 3,
    spacingRowFtMax: 4,
    outputMin: 1,
    outputMax: 3,
    outputUnit: "lb calyces/plant/season",
    dataConfidence: "low",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  }),
  rule(["pawpaw"], {
    firstYieldYearsMin: 4,
    firstYieldYearsMax: 7,
    fullYieldYearsMin: 7,
    fullYieldYearsMax: 10,
    matureHeightFtMin: 12,
    matureHeightFtMax: 25,
    matureSpreadFtMin: 10,
    matureSpreadFtMax: 20,
    spacingPlantFtMin: 10,
    spacingPlantFtMax: 20,
    outputMin: 15,
    outputMax: 40,
    outputUnit: "lb/plant/year",
    difficultyScore: 3,
    reliabilityScore: 3,
    dataConfidence: "low"
  }),
  rule(["persimmon"], {
    firstYieldYearsMin: 3,
    firstYieldYearsMax: 6,
    fullYieldYearsMin: 7,
    fullYieldYearsMax: 10,
    matureHeightFtMin: 15,
    matureHeightFtMax: 30,
    matureSpreadFtMin: 12,
    matureSpreadFtMax: 25,
    spacingPlantFtMin: 15,
    spacingPlantFtMax: 25,
    outputMin: 35,
    outputMax: 75,
    outputUnit: "lb/plant/year",
    dataConfidence: "low"
  }),
  rule(["mulberry"], {
    firstYieldYearsMin: 2,
    firstYieldYearsMax: 4,
    fullYieldYearsMin: 5,
    fullYieldYearsMax: 8,
    matureHeightFtMin: 20,
    matureHeightFtMax: 40,
    matureSpreadFtMin: 20,
    matureSpreadFtMax: 40,
    spacingPlantFtMin: 20,
    spacingPlantFtMax: 35,
    outputMin: 30,
    outputMax: 100,
    outputUnit: "lb/plant/year",
    difficultyScore: 2,
    reliabilityScore: 4,
    dataConfidence: "low"
  }),
  rule(["jujube"], {
    firstYieldYearsMin: 2,
    firstYieldYearsMax: 4,
    fullYieldYearsMin: 5,
    fullYieldYearsMax: 8,
    matureHeightFtMin: 15,
    matureHeightFtMax: 25,
    matureSpreadFtMin: 10,
    matureSpreadFtMax: 20,
    spacingPlantFtMin: 10,
    spacingPlantFtMax: 20,
    outputMin: 30,
    outputMax: 80,
    outputUnit: "lb/plant/year",
    difficultyScore: 2,
    reliabilityScore: 4,
    dataConfidence: "low"
  }),
  rule(["pecan", "walnut", "chestnut"], {
    firstYieldYearsMin: 4,
    firstYieldYearsMax: 8,
    fullYieldYearsMin: 10,
    fullYieldYearsMax: 15,
    matureHeightFtMin: 40,
    matureHeightFtMax: 80,
    matureSpreadFtMin: 30,
    matureSpreadFtMax: 70,
    spacingPlantFtMin: 35,
    spacingPlantFtMax: 50,
    outputMin: 20,
    outputMax: 100,
    outputUnit: "lb/plant/year",
    difficultyScore: 4,
    dataConfidence: "low"
  }),
  rule(["almond"], {
    firstYieldYearsMin: 3,
    firstYieldYearsMax: 5,
    fullYieldYearsMin: 6,
    fullYieldYearsMax: 8,
    matureHeightFtMin: 12,
    matureHeightFtMax: 20,
    matureSpreadFtMin: 12,
    matureSpreadFtMax: 20,
    spacingPlantFtMin: 15,
    spacingPlantFtMax: 20,
    outputMin: 10,
    outputMax: 30,
    outputUnit: "lb/plant/year",
    difficultyScore: 4,
    reliabilityScore: 2,
    dataConfidence: "low"
  }),
  rule(["hazelnut"], {
    firstYieldYearsMin: 3,
    firstYieldYearsMax: 5,
    fullYieldYearsMin: 6,
    fullYieldYearsMax: 8,
    outputMin: 2,
    outputMax: 8,
    outputUnit: "lb/plant/year",
    dataConfidence: "low"
  }),
  rule(["rhubarb"], {
    firstYieldYearsMin: 1,
    firstYieldYearsMax: 2,
    fullYieldYearsMin: 3,
    fullYieldYearsMax: 4,
    productiveLifespanYearsMin: 8,
    productiveLifespanYearsMax: 15,
    matureHeightFtMin: 2,
    matureHeightFtMax: 3,
    matureSpreadFtMin: 3,
    matureSpreadFtMax: 4,
    spacingPlantFtMin: 3,
    spacingPlantFtMax: 4,
    spacingRowFtMin: 3,
    spacingRowFtMax: 4,
    outputMin: 2,
    outputMax: 5,
    outputUnit: "lb/plant/year"
  }),
  rule(["asparagus"], {
    firstYieldYearsMin: 2,
    firstYieldYearsMax: 2,
    fullYieldYearsMin: 3,
    fullYieldYearsMax: 4,
    productiveLifespanYearsMin: 10,
    productiveLifespanYearsMax: 20,
    matureHeightFtMin: 3,
    matureHeightFtMax: 5,
    matureSpreadFtMin: 1,
    matureSpreadFtMax: 2,
    spacingPlantFtMin: 1,
    spacingPlantFtMax: 1.5,
    spacingRowFtMin: 3,
    spacingRowFtMax: 4,
    outputMin: 0.5,
    outputMax: 0.8,
    outputUnit: "lb/plant/year",
    sourceKeys: ["cornell-vegetable-yield", "uga-vegetable-days-spacing"]
  }),
  rule(["artichoke"], {
    daysToMaturityMin: 85,
    daysToMaturityMax: 120,
    firstYieldYearsMin: 0,
    firstYieldYearsMax: 1,
    fullYieldYearsMin: 1,
    fullYieldYearsMax: 2,
    matureHeightFtMin: 3,
    matureHeightFtMax: 5,
    matureSpreadFtMin: 3,
    matureSpreadFtMax: 5,
    spacingPlantFtMin: 3,
    spacingPlantFtMax: 4,
    spacingRowFtMin: 4,
    spacingRowFtMax: 5,
    outputMin: 3,
    outputMax: 6,
    outputUnit: "buds/plant/year",
    difficultyScore: 3
  }),
  rule(["sunchoke", "jerusalem artichoke"], {
    firstYieldYearsMin: 0,
    firstYieldYearsMax: 1,
    matureHeightFtMin: 6,
    matureHeightFtMax: 10,
    matureSpreadFtMin: 2,
    matureSpreadFtMax: 4,
    spacingPlantFtMin: 1.5,
    spacingPlantFtMax: 2,
    spacingRowFtMin: 2,
    spacingRowFtMax: 3,
    outputMin: 2,
    outputMax: 5,
    outputUnit: "lb/plant/year",
    reliabilityScore: 5,
    maintenanceScore: 2
  }),
  rule(["basil", "cilantro", "dill", "shiso", "borage"], {
    daysToMaturityMin: 40,
    daysToMaturityMax: 70,
    outputMin: 8,
    outputMax: 18,
    outputUnit: "weeks of harvest",
    harvestWindowWeeksMin: 8,
    harvestWindowWeeksMax: 18,
    spacingPlantFtMin: 0.75,
    spacingPlantFtMax: 1.5
  }),
  rule(["mint", "lemon balm", "oregano", "thyme", "chives", "sage", "lovage", "sorrel", "horseradish"], {
    firstYieldYearsMin: 0,
    firstYieldYearsMax: 1,
    fullYieldYearsMin: 1,
    fullYieldYearsMax: 2,
    outputMin: 10,
    outputMax: 26,
    outputUnit: "weeks of harvest",
    reliabilityScore: 5,
    maintenanceScore: 2
  }),
  rule(["rosemary", "lavender"], {
    firstYieldYearsMin: 0,
    firstYieldYearsMax: 1,
    fullYieldYearsMin: 1,
    fullYieldYearsMax: 3,
    productiveLifespanYearsMin: 5,
    productiveLifespanYearsMax: 15,
    matureHeightFtMin: 2,
    matureHeightFtMax: 4,
    matureSpreadFtMin: 2,
    matureSpreadFtMax: 4,
    spacingPlantFtMin: 2,
    spacingPlantFtMax: 4,
    outputMin: 8,
    outputMax: 20,
    outputUnit: "weeks of harvest/display",
    difficultyScore: 2,
    reliabilityScore: 4
  }),
  rule(["zinnia", "cosmos", "marigold", "nasturtium", "sunflower", "tithonia", "calendula", "nicotiana"], {
    daysToMaturityMin: 55,
    daysToMaturityMax: 90,
    outputMin: 8,
    outputMax: 18,
    outputUnit: "weeks of bloom/year",
    harvestWindowWeeksMin: 8,
    harvestWindowWeeksMax: 18,
    difficultyScore: 1,
    reliabilityScore: 4
  }),
  rule(["oak"], {
    matureHeightFtMin: 50,
    matureHeightFtMax: 80,
    matureSpreadFtMin: 40,
    matureSpreadFtMax: 70,
    spacingPlantFtMin: 40,
    spacingPlantFtMax: 60,
    spacingRowFtMin: 40,
    spacingRowFtMax: 60,
    productiveLifespanYearsMin: 80,
    productiveLifespanYearsMax: 200,
    outputMin: 16,
    outputMax: 28,
    outputUnit: "weeks of shade/fall display",
    dataConfidence: "medium"
  }),
  rule(["maple", "birch", "bald cypress", "tupelo"], {
    matureHeightFtMin: 40,
    matureHeightFtMax: 70,
    matureSpreadFtMin: 25,
    matureSpreadFtMax: 50,
    spacingPlantFtMin: 25,
    spacingPlantFtMax: 45,
    spacingRowFtMin: 25,
    spacingRowFtMax: 45,
    productiveLifespanYearsMin: 40,
    productiveLifespanYearsMax: 100,
    outputMin: 12,
    outputMax: 28,
    outputUnit: "weeks of shade/fall display",
    dataConfidence: "medium"
  }),
  rule(["arborvitae green giant"], {
    matureHeightFtMin: 30,
    matureHeightFtMax: 50,
    matureSpreadFtMin: 10,
    matureSpreadFtMax: 18,
    spacingPlantFtMin: 6,
    spacingPlantFtMax: 12,
    spacingRowFtMin: 6,
    spacingRowFtMax: 12,
    outputMin: 52,
    outputMax: 52,
    outputUnit: "weeks of evergreen screen/year"
  }),
  rule(["emerald green", "techny arborvitae", "hicks yew"], {
    matureHeightFtMin: 8,
    matureHeightFtMax: 15,
    matureSpreadFtMin: 3,
    matureSpreadFtMax: 6,
    spacingPlantFtMin: 3,
    spacingPlantFtMax: 6,
    outputMin: 52,
    outputMax: 52,
    outputUnit: "weeks of evergreen screen/year"
  }),
  rule(["boxwood", "inkberry", "yaupon", "holly", "cherry laurel", "tea olive", "wax myrtle", "bayberry"], {
    matureHeightFtMin: 3,
    matureHeightFtMax: 12,
    matureSpreadFtMin: 3,
    matureSpreadFtMax: 10,
    spacingPlantFtMin: 3,
    spacingPlantFtMax: 8,
    outputMin: 28,
    outputMax: 52,
    outputUnit: "weeks of structure/year"
  }),
  rule(["hydrangea", "viburnum", "ninebark", "forsythia", "lilac", "rose", "fothergilla", "clethra", "sweetspire", "buttonbush", "witch hazel", "spicebush", "sumac"], {
    matureHeightFtMin: 3,
    matureHeightFtMax: 10,
    matureSpreadFtMin: 3,
    matureSpreadFtMax: 10,
    spacingPlantFtMin: 3,
    spacingPlantFtMax: 8,
    outputMin: 4,
    outputMax: 16,
    outputUnit: "weeks of bloom/display/year",
    reliabilityScore: 4
  }),
  rule(["hosta", "heuchera", "coral bells", "foamflower", "wild ginger", "trillium", "bloodroot", "mayapple"], {
    matureHeightFtMin: 0.5,
    matureHeightFtMax: 2,
    matureSpreadFtMin: 1,
    matureSpreadFtMax: 4,
    spacingPlantFtMin: 1,
    spacingPlantFtMax: 3,
    outputMin: 12,
    outputMax: 28,
    outputUnit: "weeks of foliage/bloom display/year",
    difficultyScore: 1,
    reliabilityScore: 4
  }),
  rule(["joe pye", "cup plant", "silphium", "perennial sunflower", "maximilian", "swamp sunflower"], {
    matureHeightFtMin: 4,
    matureHeightFtMax: 9,
    matureSpreadFtMin: 2,
    matureSpreadFtMax: 5,
    spacingPlantFtMin: 2,
    spacingPlantFtMax: 4,
    outputMin: 4,
    outputMax: 8,
    outputUnit: "weeks of bloom/year",
    reliabilityScore: 4
  }),
  rule(["aster", "goldenrod", "rudbeckia", "black-eyed susan", "coneflower", "milkweed", "bee balm", "phlox", "coreopsis", "yarrow", "salvia", "liatris", "penstemon", "columbine", "bluebells", "lobelia", "baptisia", "amsonia", "iris"], {
    matureHeightFtMin: 1,
    matureHeightFtMax: 5,
    matureSpreadFtMin: 1,
    matureSpreadFtMax: 3,
    spacingPlantFtMin: 1,
    spacingPlantFtMax: 3,
    outputMin: 3,
    outputMax: 8,
    outputUnit: "weeks of bloom/year",
    difficultyScore: 1,
    reliabilityScore: 4
  }),
  rule(["switchgrass", "little bluestem", "feather reed", "miscanthus", "prairie dropseed", "sedge", "sea oats", "grama", "love grass", "bamboo"], {
    matureHeightFtMin: 1,
    matureHeightFtMax: 7,
    matureSpreadFtMin: 1,
    matureSpreadFtMax: 5,
    spacingPlantFtMin: 1.5,
    spacingPlantFtMax: 5,
    outputMin: 16,
    outputMax: 36,
    outputUnit: "weeks of foliage/seedhead display/year",
    difficultyScore: 1,
    reliabilityScore: 5
  })
];

const yieldConversionRules = [
  rule(["pomegranate"], {
    conversionMin: 0.45,
    conversionMax: 0.9,
    conversionUnit: "lb/fruit",
    yieldLbsConfidence: "low",
    yieldLbsMethod: "fruit-count range converted with conservative per-fruit weight; UGA supports timing and spacing but not a direct home-garden pounds-per-plant value",
    sourceKeys: ["uga-pomegranate-production"]
  }),
  rule(["passionfruit", "maypop"], {
    conversionMin: 0.08,
    conversionMax: 0.18,
    conversionUnit: "lb/fruit",
    yieldLbsConfidence: "low",
    yieldLbsMethod: "fruit-count range converted with conservative small-fruit weights",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  }),
  rule(["jaboticaba", "starfruit", "white sapote", "sapodilla", "cherimoya", "atemoya", "custard apple"], {
    conversionMin: 0.4,
    conversionMax: 1,
    conversionUnit: "lb/fruit",
    yieldLbsConfidence: "low",
    yieldLbsMethod: "fruit-count range converted with broad tropical-fruit weight assumptions",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  }),
  rule(["dragon fruit"], {
    conversionMin: 0.5,
    conversionMax: 1,
    conversionUnit: "lb/fruit",
    yieldLbsConfidence: "low",
    yieldLbsMethod: "fruit-count range converted with broad dragon-fruit weight assumptions",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  }),
  rule(["corn"], {
    conversionMin: 0.33,
    conversionMax: 0.5,
    conversionUnit: "lb/ear",
    yieldLbsConfidence: "low",
    yieldLbsMethod: "ear-count range converted to pounds for stock-style return comparison",
    sourceKeys: ["umaine-vegetable-yield", "lsu-vegetable-yields"]
  }),
  rule(["lettuce", "radicchio"], {
    conversionMin: 0.5,
    conversionMax: 1,
    conversionUnit: "lb/head",
    yieldLbsConfidence: "low",
    yieldLbsMethod: "head-count range converted to pounds for return comparison",
    sourceKeys: ["umn-vegetable-field-planning", "lsu-vegetable-yields"]
  }),
  rule(["radish"], {
    conversionMin: 0.04,
    conversionMax: 0.12,
    conversionUnit: "lb/root",
    yieldLbsConfidence: "low",
    yieldLbsMethod: "root-count range converted to pounds for return comparison",
    sourceKeys: ["umn-vegetable-field-planning", "lsu-vegetable-yields"]
  }),
  rule(["artichoke"], {
    conversionMin: 0.3,
    conversionMax: 0.7,
    conversionUnit: "lb/bud",
    yieldLbsConfidence: "low",
    yieldLbsMethod: "bud-count range converted to pounds for return comparison",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  }),
  rule(["prickly pear"], {
    conversionMin: 0.2,
    conversionMax: 0.5,
    conversionUnit: "lb/fruit or pad",
    yieldLbsConfidence: "low",
    yieldLbsMethod: "fruit-or-pad count converted to pounds for return comparison",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  })
];

const plantingDepthRules = [
  rule(["tomato"], {
    plantingDepthInMin: null,
    plantingDepthInMax: null,
    plantingDepthKind: "deep transplant",
    plantingDepthNote: "Transplant deep, burying the stem up to the lowest healthy leaves.",
    plantingDepthConfidence: "medium",
    sourceKeys: ["uga-vegetable-days-spacing"]
  }),
  rule(["strawberry"], {
    plantingDepthInMin: 0,
    plantingDepthInMax: 0,
    plantingDepthKind: "crown",
    plantingDepthNote: "Set the crown at soil level; burying the crown can rot the plant.",
    plantingDepthConfidence: "high",
    sourceKeys: ["umn-strawberry-planting"]
  }),
  rule(["asparagus"], {
    plantingDepthInMin: 6,
    plantingDepthInMax: 8,
    plantingDepthKind: "crown trench",
    plantingDepthNote: "Set crowns in a trench, then fill gradually as spears grow.",
    plantingDepthConfidence: "medium",
    sourceKeys: ["uga-vegetable-days-spacing"]
  }),
  rule(["rhubarb"], {
    plantingDepthInMin: 1,
    plantingDepthInMax: 2,
    plantingDepthKind: "crown",
    plantingDepthNote: "Set crown buds just below the soil surface.",
    plantingDepthConfidence: "medium",
    sourceKeys: ["ncsu-plant-toolbox"]
  }),
  rule(["peony"], {
    plantingDepthInMin: 1,
    plantingDepthInMax: 2,
    plantingDepthKind: "crown",
    plantingDepthNote: "Keep eyes shallow; deep planting can reduce flowering.",
    plantingDepthConfidence: "medium",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  }),
  rule(["iris"], {
    plantingDepthInMin: 0,
    plantingDepthInMax: 1,
    plantingDepthKind: "rhizome",
    plantingDepthNote: "Keep rhizomes at or just below the soil surface; avoid deep planting.",
    plantingDepthConfidence: "medium",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  }),
  rule(["daylily"], {
    plantingDepthInMin: 0,
    plantingDepthInMax: 1,
    plantingDepthKind: "crown",
    plantingDepthNote: "Set the crown at or slightly below the soil surface.",
    plantingDepthConfidence: "medium",
    sourceKeys: ["ncsu-plant-toolbox", "mobot-plant-finder"]
  }),
  rule(["garlic"], {
    plantingDepthInMin: 1,
    plantingDepthInMax: 2,
    plantingDepthKind: "clove",
    plantingDepthNote: "Plant cloves pointed end up.",
    plantingDepthConfidence: "medium",
    sourceKeys: ["uga-vegetable-days-spacing"]
  }),
  rule(["onion", "leek"], {
    plantingDepthInMin: 0.5,
    plantingDepthInMax: 1,
    plantingDepthKind: "set or transplant",
    plantingDepthNote: "Set shallow; keep the growing point above the soil.",
    plantingDepthConfidence: "medium",
    sourceKeys: ["uga-vegetable-days-spacing"]
  }),
  rule(["potato"], {
    plantingDepthInMin: 3,
    plantingDepthInMax: 5,
    plantingDepthKind: "seed piece",
    plantingDepthNote: "Plant seed pieces in a trench and hill soil as shoots grow.",
    plantingDepthConfidence: "medium",
    sourceKeys: ["uga-vegetable-days-spacing"]
  }),
  rule(["sweet potato"], {
    plantingDepthInMin: 3,
    plantingDepthInMax: 4,
    plantingDepthKind: "slip",
    plantingDepthNote: "Bury slips to cover the roots and lower nodes.",
    plantingDepthConfidence: "medium",
    sourceKeys: ["uga-vegetable-days-spacing"]
  }),
  rule(["bean", "corn", "pea", "cowpea"], {
    plantingDepthInMin: 1,
    plantingDepthInMax: 2,
    plantingDepthKind: "seed",
    plantingDepthNote: "Sow seed into warm, workable soil at the packet depth.",
    plantingDepthConfidence: "medium",
    sourceKeys: ["uga-vegetable-days-spacing"]
  }),
  rule(["cucumber", "squash", "zucchini", "melon", "cantaloupe", "watermelon", "pumpkin", "okra"], {
    plantingDepthInMin: 0.5,
    plantingDepthInMax: 1,
    plantingDepthKind: "seed or transplant",
    plantingDepthNote: "Sow seed shallow or set transplants at nursery depth.",
    plantingDepthConfidence: "medium",
    sourceKeys: ["uga-vegetable-days-spacing"]
  }),
  rule(["carrot", "lettuce", "arugula", "spinach", "mizuna", "miner"], {
    plantingDepthInMin: 0.125,
    plantingDepthInMax: 0.25,
    plantingDepthKind: "seed",
    plantingDepthNote: "Sow shallow and keep the seedbed evenly moist.",
    plantingDepthConfidence: "medium",
    sourceKeys: ["uga-vegetable-days-spacing"]
  }),
  rule(["radish", "beet", "turnip", "daikon"], {
    plantingDepthInMin: 0.25,
    plantingDepthInMax: 0.5,
    plantingDepthKind: "seed",
    plantingDepthNote: "Sow directly and thin promptly for root sizing.",
    plantingDepthConfidence: "medium",
    sourceKeys: ["uga-vegetable-days-spacing"]
  }),
  rule(["broccoli", "cauliflower", "kale", "collards", "chard", "pepper", "eggplant", "artichoke"], {
    plantingDepthInMin: 0,
    plantingDepthInMax: 0,
    plantingDepthKind: "transplant",
    plantingDepthNote: "Set transplants at the same depth as the nursery pot.",
    plantingDepthConfidence: "medium",
    sourceKeys: ["uga-vegetable-days-spacing"]
  })
];

const containerRules = [
  rule(["tomato"], {
    containerMinGallons: 5,
    containerSuitability: "good",
    containerNote: "5+ gal per plant; 10+ gal is better for full-size indeterminate varieties.",
    containerConfidence: "medium",
    sourceKeys: ["umd-container-sizes", "illinois-container-vegetables"]
  }),
  rule(["pepper", "eggplant", "okra"], {
    containerMinGallons: 5,
    containerSuitability: "good",
    containerNote: "Use one plant per 5+ gal container.",
    containerConfidence: "medium",
    sourceKeys: ["umd-container-sizes", "illinois-container-vegetables"]
  }),
  rule(["cucumber", "zucchini", "squash", "melon", "cantaloupe"], {
    containerMinGallons: 10,
    containerSuitability: "workable",
    containerNote: "Use 10+ gal with a trellis or room for vines.",
    containerConfidence: "medium",
    sourceKeys: ["umd-container-sizes", "illinois-container-vegetables"]
  }),
  rule(["watermelon", "pumpkin"], {
    containerMinGallons: 15,
    containerSuitability: "limited",
    containerNote: "Use 15+ gal and compact varieties; large vines are better in-ground.",
    containerConfidence: "medium",
    sourceKeys: ["umd-container-sizes", "illinois-container-vegetables"]
  }),
  rule(["lettuce", "arugula", "spinach", "mizuna", "radish", "basil", "parsley", "cilantro", "dill", "thyme", "oregano", "herb"], {
    containerMinGallons: 1,
    containerSuitability: "good",
    containerNote: "Small herbs, leafy crops, and radishes work in 1+ gal pots or wider shallow planters.",
    containerConfidence: "medium",
    sourceKeys: ["umd-container-sizes", "illinois-container-vegetables"]
  }),
  rule(["bean", "pea", "carrot", "beet", "turnip", "daikon", "onion", "garlic"], {
    containerMinGallons: 2,
    containerSuitability: "good",
    containerNote: "Shallow to medium containers work when depth matches the root crop.",
    containerConfidence: "medium",
    sourceKeys: ["umd-container-sizes", "illinois-container-vegetables"]
  }),
  rule(["strawberry"], {
    containerMinGallons: 2,
    containerSuitability: "good",
    containerNote: "Use 2+ gal per plant or a wider trough with crowns at soil level.",
    containerConfidence: "medium",
    sourceKeys: ["umd-container-sizes", "umn-strawberry-planting"]
  }),
  rule(["blueberry"], {
    containerMinGallons: 10,
    containerSuitability: "workable",
    containerNote: "Use 10+ gal with acidic potting mix; larger containers are better at maturity.",
    containerConfidence: "medium",
    sourceKeys: ["umd-container-sizes", "umn-blueberry", "osu-blueberry"]
  }),
  rule(["fig"], {
    containerMinGallons: 25,
    containerSuitability: "good",
    containerNote: "Use 25+ gal for mature container figs and plan winter protection in cold zones.",
    containerConfidence: "medium",
    sourceKeys: ["umd-container-sizes"]
  }),
  rule(["citrus", "kumquat", "yuzu", "calamondin", "finger lime", "lemon tree", "lime tree", "orange tree"], {
    containerMinGallons: 15,
    containerSuitability: "good",
    containerNote: "Use 15+ gal with excellent drainage and move indoors where winters are cold.",
    containerConfidence: "medium",
    sourceKeys: ["umd-container-sizes", "lsu-citrus-yield"]
  }),
  rule(["nut tree", "pecan", "chestnut", "oak", "maple", "birch", "cypress", "tupelo", "magnolia"], {
    containerMinGallons: 45,
    containerSuitability: "in-ground preferred",
    containerNote: "Large trees can be started in containers but are not practical long-term patio crops.",
    containerConfidence: "low",
    sourceKeys: ["umd-container-sizes", "umd-tree-shrub-planting"]
  }),
  rule(["grape", "kiwi", "passionfruit"], {
    containerMinGallons: 15,
    containerSuitability: "workable",
    containerNote: "Use 15+ gal plus a sturdy trellis.",
    containerConfidence: "medium",
    sourceKeys: ["umd-container-sizes"]
  }),
  rule(["blackberry", "raspberry", "currant", "gooseberry", "elderberry", "aronia", "honeyberry", "seaberry", "goumi"], {
    containerMinGallons: 10,
    containerSuitability: "workable",
    containerNote: "Use 10+ gal; larger containers stabilize moisture and yield.",
    containerConfidence: "medium",
    sourceKeys: ["umd-container-sizes"]
  })
];

function rule(terms, values) {
  return { terms, values };
}

function plantText(plant) {
  return `${plant.id} ${plant.name} ${plant.type} ${plant.query ?? ""} ${plant.notes} ${(plant.traits ?? []).join(" ")}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function round(value, decimals = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) return null;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function applyRule(base, override) {
  const { sourceKeys, ...values } = override;
  const next = { ...base, ...values };
  next.sourceKeys = sourceKeys ? unique(sourceKeys) : unique(base.sourceKeys ?? []);
  return next;
}

function matchingRules(plant) {
  const text = plantText(plant);
  return cropRules.filter(({ terms, values }) => {
    if (isEdiblePlantType(plant) && isOrnamentalRule(values)) return false;
    return terms.some((term) => termMatches(text, term));
  }).sort((a, b) => matchSpecificity(text, a) - matchSpecificity(text, b));
}

function bestMatchingRule(plant, rules) {
  const text = plantText(plant);
  return rules
    .filter(({ terms }) => terms.some((term) => termMatches(text, term)))
    .sort((a, b) => matchSpecificity(text, a) - matchSpecificity(text, b))
    .at(-1) ?? null;
}

function termMatches(text, term) {
  const normalizedTerm = String(term).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  if (!normalizedTerm) return false;
  return new RegExp(`(^|\\s)${escapeRegExp(normalizedTerm)}(\\s|$)`).test(text);
}

function matchSpecificity(text, { terms }) {
  return Math.max(...terms
    .filter((term) => termMatches(text, term))
    .map((term) => String(term).split(/\s+/).filter(Boolean).join("").length));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isEdiblePlantType(plant) {
  return /fruit|berry|nut|citrus|vegetable|grape/.test(plant.type.toLowerCase());
}

function isOrnamentalRule(values) {
  return values.outputKind === "ornamental"
    || /bloom|foliage|display|shade|screen|structure/.test(String(values.outputUnit ?? ""));
}

function estimateHarvestWindow(plant, metrics) {
  const text = `${plant.harvest} ${plant.notes}`.toLowerCase();
  if (text.includes("year-round") || text.includes("year round") || text.includes("evergreen foliage year-round")) return [40, 52];
  if (text.includes("much of the year")) return [24, 40];
  if (text.includes("spring to fall") || text.includes("summer to frost") || text.includes("all summer to frost")) return [14, 24];
  if (text.includes("all summer") || text.includes("most seasons") || text.includes("all season")) return [10, 18];
  if (text.includes("from summer into fall") || text.includes("summer into fall") || text.includes("summer to fall")) return [8, 14];
  if (text.includes("spring through fall")) return [12, 24];
  if (text.includes("spring to summer")) return [6, 12];
  if (text.includes("fall color") || text.includes("foliage all season")) return [12, 24];
  if (metrics.outputKind === "ornamental" && text.includes("foliage")) return [12, 28];
  if (text.includes("cool-season") || text.includes("leaves")) return [6, 12];
  if (text.includes("early") || text.includes("late") || text.includes("mid") || text.includes("ripens") || text.includes("mature")) return [2, 5];
  return [metrics.harvestWindowWeeksMin, metrics.harvestWindowWeeksMax];
}

function dataQualityRank(value) {
  return { high: 3, medium: 2, low: 1 }[value] ?? 1;
}

function confidenceFromSources(metrics) {
  if (metrics.dataConfidence === "high") return "high";
  if (metrics.dataConfidence === "low") return "low";
  const cropSpecificSources = [
    "uga-vegetable-days-spacing",
    "cornell-vegetable-yield",
    "umn-vegetable-field-planning",
    "lsu-vegetable-yields",
    "purdue-midwest-fruit",
    "psu-pome-spacing-yield",
    "psu-stone-spacing-yield",
    "lsu-citrus-yield",
    "osu-blueberry",
    "uga-blueberry",
    "okstate-grape",
    "umd-brambles",
    "umn-strawberry",
    "usu-strawberry-yield",
    "osu-elderberry",
    "umd-aronia",
    "osu-lingonberry",
    "usu-tomatillo"
  ];
  const hasCropSpecific = metrics.sourceKeys?.some((key) => cropSpecificSources.includes(key));
  if (hasCropSpecific && metrics.outputMin !== null && metrics.outputMax !== null) {
    return dataQualityRank(metrics.dataConfidence) >= 2 ? metrics.dataConfidence : "medium";
  }
  return metrics.dataConfidence ?? "low";
}

function horizonKey(metrics) {
  if (metrics.daysToMaturityMax !== null && metrics.daysToMaturityMax <= 60) return "quick";
  if (metrics.firstYieldYearsMax === 0) return "seasonal";
  if (metrics.firstYieldYearsMax !== null && metrics.firstYieldYearsMax <= 1) return "fast-perennial";
  if (metrics.firstYieldYearsMax !== null && metrics.firstYieldYearsMax <= 3) return "medium";
  return "long";
}

function horizonLabel(key) {
  return {
    quick: "Quick harvest",
    seasonal: "Seasonal annual",
    "fast-perennial": "Fast-bearing perennial",
    medium: "Medium horizon",
    long: "Long horizon"
  }[key] ?? "Plant horizon";
}

function riskLevel(metrics) {
  if (metrics.difficultyScore >= 4 || metrics.reliabilityScore <= 2) return "elevated";
  if (metrics.difficultyScore <= 2 && metrics.reliabilityScore >= 4) return "lower";
  return "moderate";
}

function rangeLabel(min, max, suffix = "", fallback = "Needs source") {
  if (min === null || min === undefined || max === null || max === undefined) return fallback;
  if (min === max) return `${formatNumber(min)}${suffix}`;
  return `${formatNumber(min)}-${formatNumber(max)}${suffix}`;
}

function formatNumber(value) {
  if (value === null || value === undefined) return "";
  return Number.isInteger(value) ? String(value) : String(round(value, 1));
}

function outputLabel(metrics) {
  if (metrics.outputMin === null || metrics.outputMax === null || !metrics.outputUnit) return "Needs source";
  return rangeLabel(metrics.outputMin, metrics.outputMax, ` ${metrics.outputUnit}`);
}

function firstOutputLabel(metrics) {
  if (metrics.firstYieldYearsMax === 0) {
    return rangeLabel(metrics.daysToMaturityMin, metrics.daysToMaturityMax, " days", "This season");
  }
  return rangeLabel(metrics.firstYieldYearsMin, metrics.firstYieldYearsMax, " yrs");
}

function fullOutputLabel(metrics) {
  if (metrics.fullYieldYearsMax === 0) return "This season";
  return rangeLabel(metrics.fullYieldYearsMin, metrics.fullYieldYearsMax, " yrs");
}

function spacingLabel(metrics) {
  const inRow = rangeLabel(metrics.spacingPlantFtMin, metrics.spacingPlantFtMax, " ft");
  const row = rangeLabel(metrics.spacingRowFtMin, metrics.spacingRowFtMax, " ft");
  if (inRow === "Needs source") return inRow;
  if (row === "Needs source" || inRow === row) return `${inRow} apart`;
  return `${inRow} in-row x ${row} rows`;
}

function plantingDepthLabel(metrics) {
  if (metrics.plantingDepthNote && metrics.plantingDepthInMin === null && metrics.plantingDepthInMax === null) {
    return metrics.plantingDepthNote;
  }
  if (metrics.plantingDepthInMin === 0 && metrics.plantingDepthInMax === 0) {
    return metrics.plantingDepthNote ?? "Set crown/rootball at soil level";
  }
  const depth = rangeLabel(metrics.plantingDepthInMin, metrics.plantingDepthInMax, " in");
  if (depth === "Needs source") return metrics.plantingDepthNote ?? "Needs source";
  const verb = metrics.plantingDepthKind === "seed" ? "Sow" : "Plant";
  return `${verb} ${depth} deep`;
}

function containerLabel(metrics) {
  if (metrics.containerMinGallons === null || metrics.containerMinGallons === undefined) return "Needs source";
  const size = `${formatNumber(metrics.containerMinGallons)}+ gal`;
  return metrics.containerSuitability ? `${size} (${metrics.containerSuitability})` : size;
}

function matureSizeLabel(metrics) {
  const height = rangeLabel(metrics.matureHeightFtMin, metrics.matureHeightFtMax, " ft");
  const spread = rangeLabel(metrics.matureSpreadFtMin, metrics.matureSpreadFtMax, " ft");
  if (height === "Needs source" || spread === "Needs source") return "Needs source";
  return `${height} H x ${spread} W`;
}

function plantsPer100SqFt(metrics) {
  const minArea = metrics.spacingPlantFtMin * metrics.spacingRowFtMin;
  const maxArea = metrics.spacingPlantFtMax * metrics.spacingRowFtMax;
  if (!minArea || !maxArea) return [null, null];
  return [round(100 / maxArea, 1), round(100 / minArea, 1)];
}

function matchingYieldConversion(plant) {
  const text = plantText(plant);
  return yieldConversionRules.find(({ terms }) => terms.some((term) => termMatches(text, term)))?.values ?? null;
}

function directPoundYield(metrics) {
  if (!/^lb\b/.test(String(metrics.outputUnit ?? ""))) return null;
  if (metrics.outputMin === null || metrics.outputMax === null) return null;
  return {
    yieldLbsMin: metrics.outputMin,
    yieldLbsMax: metrics.outputMax,
    yieldLbsUnit: metrics.outputUnit,
    yieldLbsConfidence: metrics.dataConfidence,
    yieldLbsMethod: "direct pound yield from crop metric source"
  };
}

function convertedPoundYield(plant, metrics) {
  if (metrics.outputMin === null || metrics.outputMax === null) return null;
  if (!/fruit|melon|ear|head|root|bud|bulb|stalk|pad/i.test(String(metrics.outputUnit ?? ""))) return null;
  const conversion = matchingYieldConversion(plant);
  if (!conversion) return null;
  return {
    yieldLbsMin: round(metrics.outputMin * conversion.conversionMin, 1),
    yieldLbsMax: round(metrics.outputMax * conversion.conversionMax, 1),
    yieldLbsUnit: String(metrics.outputUnit).includes("/year") ? "lb/plant/year" : "lb/plant/season",
    yieldLbsConfidence: conversion.yieldLbsConfidence ?? "low",
    yieldLbsMethod: conversion.yieldLbsMethod,
    yieldLbsConversionUnit: conversion.conversionUnit,
    yieldLbsSourceKeys: conversion.sourceKeys ?? []
  };
}

function applyYieldLbs(plant, metrics) {
  const yieldLbs = directPoundYield(metrics) ?? convertedPoundYield(plant, metrics);
  if (!yieldLbs) {
    metrics.yieldLbsMin = null;
    metrics.yieldLbsMax = null;
    metrics.yieldLbsUnit = null;
    metrics.yieldLbsConfidence = null;
    metrics.yieldLbsMethod = metrics.outputKind === "ornamental"
      ? "ornamental output is tracked as display weeks, not pound yield"
      : "no defensible pound-yield source encoded yet";
    metrics.yieldLbsConversionUnit = null;
    return metrics;
  }
  Object.assign(metrics, yieldLbs);
  metrics.sourceKeys = unique([...(metrics.sourceKeys ?? []), ...(yieldLbs.yieldLbsSourceKeys ?? [])]);
  return metrics;
}

function rampValue(year, firstYear, fullYear, matureValue) {
  if (matureValue === null || matureValue === undefined) return null;
  if (year < firstYear) return 0;
  if (fullYear <= firstYear || year >= fullYear) return matureValue;
  const progress = (year - firstYear + 1) / (fullYear - firstYear + 1);
  return matureValue * Math.min(1, Math.max(0.2, progress));
}

function yieldCurve(metrics, years = 10) {
  if (metrics.yieldLbsMin === null || metrics.yieldLbsMax === null) return null;
  const firstYear = metrics.firstYieldYearsMax === 0 ? 1 : Math.max(1, metrics.firstYieldYearsMin ?? 1);
  const fullYear = metrics.fullYieldYearsMax === 0 ? 1 : Math.max(firstYear, metrics.fullYieldYearsMax ?? firstYear);
  return Array.from({ length: years }, (_, index) => {
    const year = index + 1;
    const min = round(rampValue(year, firstYear, fullYear, metrics.yieldLbsMin), 1);
    const max = round(rampValue(year, firstYear, fullYear, metrics.yieldLbsMax), 1);
    return {
      year,
      min,
      max,
      mid: round((min + max) / 2, 1)
    };
  });
}

function cumulativeYield(curve, field) {
  if (!curve?.length) return null;
  return round(curve.reduce((total, point) => total + (point[field] ?? 0), 0), 1);
}

function defaultPlantingDepth(plant) {
  const type = plant.type.toLowerCase();
  if (type.includes("tree")) {
    return {
      plantingDepthInMin: 0,
      plantingDepthInMax: 0,
      plantingDepthKind: "root flare",
      plantingDepthNote: "Keep the root flare at soil level; graft unions stay above grade.",
      plantingDepthConfidence: "medium",
      sourceKeys: ["umd-tree-shrub-planting", "umd-home-fruit-planting"]
    };
  }
  if (type.includes("shrub") || type.includes("cane") || type.includes("vine")) {
    return {
      plantingDepthInMin: 0,
      plantingDepthInMax: 0,
      plantingDepthKind: "root crown",
      plantingDepthNote: "Set the crown or top of root ball level with the surrounding soil.",
      plantingDepthConfidence: "medium",
      sourceKeys: ["umd-tree-shrub-planting", "umd-home-fruit-planting"]
    };
  }
  if (type.includes("flower") || type.includes("grass") || type.includes("perennial")) {
    return {
      plantingDepthInMin: 0,
      plantingDepthInMax: 0,
      plantingDepthKind: "crown",
      plantingDepthNote: "Set the crown at the same level it grew in the nursery pot.",
      plantingDepthConfidence: "medium",
      sourceKeys: ["ncsu-plant-toolbox", "kstate-herbaceous-spacing"]
    };
  }
  return {
    plantingDepthInMin: 0,
    plantingDepthInMax: 0,
    plantingDepthKind: "transplant",
    plantingDepthNote: "Set transplants at nursery depth or follow seed-packet depth for direct sowing.",
    plantingDepthConfidence: "medium",
    sourceKeys: ["uga-vegetable-days-spacing"]
  };
}

function defaultContainerSpec(plant) {
  const type = plant.type.toLowerCase();
  if (type.includes("tree")) {
    return {
      containerMinGallons: type.includes("fruit") || type.includes("citrus") ? 25 : 45,
      containerSuitability: type.includes("fruit") || type.includes("citrus") ? "limited" : "in-ground preferred",
      containerNote: type.includes("fruit") || type.includes("citrus")
        ? "Use dwarf/root-pruned culture for long-term containers; in-ground usually performs better."
        : "Large trees can be started in containers but are not practical long-term patio crops.",
      containerConfidence: "low",
      sourceKeys: ["umd-container-sizes", "umd-tree-shrub-planting"]
    };
  }
  if (type.includes("shrub") || type.includes("cane")) {
    return {
      containerMinGallons: 10,
      containerSuitability: "workable",
      containerNote: "Use 10+ gal; larger containers improve moisture buffering at maturity.",
      containerConfidence: "medium",
      sourceKeys: ["umd-container-sizes"]
    };
  }
  if (type.includes("vine")) {
    return {
      containerMinGallons: 10,
      containerSuitability: "workable",
      containerNote: "Use 10+ gal and provide a trellis or room for vines.",
      containerConfidence: "medium",
      sourceKeys: ["umd-container-sizes"]
    };
  }
  if (type.includes("vegetable")) {
    return {
      containerMinGallons: 5,
      containerSuitability: "workable",
      containerNote: "Use 5+ gal for most single vegetable plants; smaller leafy/root crops can use less.",
      containerConfidence: "medium",
      sourceKeys: ["umd-container-sizes", "illinois-container-vegetables"]
    };
  }
  if (type.includes("herb") || type.includes("flower")) {
    return {
      containerMinGallons: 2,
      containerSuitability: "good",
      containerNote: "Use 2+ gal per plant, or wider mixed containers with similar water needs.",
      containerConfidence: "medium",
      sourceKeys: ["umd-container-sizes", "illinois-container-vegetables"]
    };
  }
  if (type.includes("grass") || type.includes("perennial")) {
    return {
      containerMinGallons: 3,
      containerSuitability: "workable",
      containerNote: "Use 3+ gal for establishment and size up as clumps mature.",
      containerConfidence: "medium",
      sourceKeys: ["umd-container-sizes", "kstate-herbaceous-spacing"]
    };
  }
  return {
    containerMinGallons: 5,
    containerSuitability: "workable",
    containerNote: "Use at least a medium container and size up for mature spread.",
    containerConfidence: "low",
    sourceKeys: ["umd-container-sizes"]
  };
}

function applyDepthAndContainerGuidance(plant, metrics) {
  const plantingDefault = defaultPlantingDepth(plant);
  const { sourceKeys: plantingDefaultSources, ...plantingDefaultValues } = plantingDefault;
  const plantingRule = bestMatchingRule(plant, plantingDepthRules);
  const { sourceKeys: plantingRuleSources, ...plantingRuleValues } = plantingRule?.values ?? {};
  Object.assign(metrics, plantingDefaultValues, plantingRuleValues);
  metrics.sourceKeys = unique([
    ...(metrics.sourceKeys ?? []),
    ...(plantingDefaultSources ?? []),
    ...(plantingRuleSources ?? [])
  ]);

  const containerDefault = defaultContainerSpec(plant);
  const { sourceKeys: containerDefaultSources, ...containerDefaultValues } = containerDefault;
  const containerRule = bestMatchingRule(plant, containerRules);
  const { sourceKeys: containerRuleSources, ...containerRuleValues } = containerRule?.values ?? {};
  Object.assign(metrics, containerDefaultValues, containerRuleValues);
  metrics.sourceKeys = unique([
    ...(metrics.sourceKeys ?? []),
    ...(containerDefaultSources ?? []),
    ...(containerRuleSources ?? [])
  ]);
  return metrics;
}

function makeNotes(plant, metrics) {
  const notes = [];
  if (metrics.dataConfidence === "low") {
    notes.push("Quantitative values are broad estimates; verify cultivar-specific nursery and local extension data before buying at scale.");
  }
  if (plant.type.includes("tree") && plant.goals.includes("fruit")) {
    notes.push("Rootstock, pruning system, chill hours, and pest pressure can materially change yield and mature size.");
  }
  if (/pollinator|another|compatible|pair|self-fertile/i.test(`${plant.notes} ${(plant.traits ?? []).join(" ")}`)) {
    notes.push("Pollination context can change realized yield; use companion or compatible cultivar notes before planting.");
  }
  if (plant.water === "high") {
    notes.push("Water demand is high; expected output assumes consistent moisture during establishment and crop fill.");
  }
  if (plant.goals.includes("privacy-screening")) {
    notes.push("Spacing may be tightened for screens, but dense planting can reduce airflow and increase maintenance.");
  }
  if (metrics.outputKind === "ornamental") {
    notes.push("Output is expressed as ornamental display weeks, not edible yield.");
  }
  if (metrics.yieldLbsConfidence === "low" && metrics.yieldLbsMin !== null) {
    notes.push("Pound-return values are estimated ranges; source quality and unit conversions are flagged separately from basic growing data.");
  }
  return notes;
}

function buildMetrics(plant) {
  let metrics = clone(baseByType[plant.type] ?? baseByType["perennial flower"]);
  for (const { values } of matchingRules(plant)) {
    metrics = applyRule(metrics, values);
  }

  const [harvestMin, harvestMax] = estimateHarvestWindow(plant, metrics);
  metrics.harvestWindowWeeksMin = harvestMin;
  metrics.harvestWindowWeeksMax = harvestMax;
  metrics.dataConfidence = confidenceFromSources(metrics);
  metrics.horizonKey = horizonKey(metrics);
  metrics.horizonLabel = horizonLabel(metrics.horizonKey);
  metrics.riskLevel = riskLevel(metrics);
  const [densityMin, densityMax] = plantsPer100SqFt(metrics);
  metrics.plantsPer100SqFtMin = densityMin;
  metrics.plantsPer100SqFtMax = densityMax;
  metrics.multiUseScore = Math.min(5, Math.max(1, Math.round((plant.goals.length / 6) * 5)));
  metrics.lastReviewed = lastReviewed;
  applyDepthAndContainerGuidance(plant, metrics);
  metrics.sourceKeys = unique(metrics.sourceKeys);
  applyYieldLbs(plant, metrics);
  metrics.yieldCurve = yieldCurve(metrics);
  metrics.tenYearYieldLbsMin = cumulativeYield(metrics.yieldCurve, "min");
  metrics.tenYearYieldLbsMax = cumulativeYield(metrics.yieldCurve, "max");
  metrics.notes = makeNotes(plant, metrics);
  metrics.display = {
    firstOutput: firstOutputLabel(metrics),
    fullOutput: fullOutputLabel(metrics),
    spacing: spacingLabel(metrics),
    plantingDepth: plantingDepthLabel(metrics),
    plantingDepthNote: metrics.plantingDepthNote,
    containerMin: containerLabel(metrics),
    containerNote: metrics.containerNote,
    matureSize: matureSizeLabel(metrics),
    output: outputLabel(metrics),
    yieldLbs: rangeLabel(metrics.yieldLbsMin, metrics.yieldLbsMax, ` ${metrics.yieldLbsUnit ?? ""}`),
    tenYearYieldLbs: rangeLabel(metrics.tenYearYieldLbsMin, metrics.tenYearYieldLbsMax, " lb/10 yrs"),
    lifespan: rangeLabel(metrics.productiveLifespanYearsMin, metrics.productiveLifespanYearsMax, " yrs"),
    harvestWindow: rangeLabel(metrics.harvestWindowWeeksMin, metrics.harvestWindowWeeksMax, " weeks"),
    difficulty: `${metrics.difficultyScore}/5`,
    reliability: `${metrics.reliabilityScore}/5`,
    maintenance: `${metrics.maintenanceScore}/5`,
    confidence: metrics.dataConfidence.charAt(0).toUpperCase() + metrics.dataConfidence.slice(1)
  };
  return metrics;
}

function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const text = Array.isArray(value) ? value.join("; ") : String(value);
  if (/[",\n\r]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

const metricsByPlant = Object.fromEntries(plants.map((plant) => [plant.id, buildMetrics(plant)]));

const csvColumns = [
  "id",
  "name",
  "type",
  "zone_min",
  "zone_max",
  "sun",
  "soils",
  "water",
  "goals",
  "harvest",
  "traits",
  "notes",
  "partner",
  "query",
  "life_cycle",
  "horizon",
  "days_to_maturity_min",
  "days_to_maturity_max",
  "first_output_years_min",
  "first_output_years_max",
  "full_output_years_min",
  "full_output_years_max",
  "productive_lifespan_years_min",
  "productive_lifespan_years_max",
  "mature_height_ft_min",
  "mature_height_ft_max",
  "mature_spread_ft_min",
  "mature_spread_ft_max",
  "spacing_plant_ft_min",
  "spacing_plant_ft_max",
  "spacing_row_ft_min",
  "spacing_row_ft_max",
  "plants_per_100_sqft_min",
  "plants_per_100_sqft_max",
  "planting_depth_in_min",
  "planting_depth_in_max",
  "planting_depth_kind",
  "planting_depth_note",
  "planting_depth_confidence",
  "container_min_gallons",
  "container_suitability",
  "container_note",
  "container_confidence",
  "output_kind",
  "output_unit",
  "output_min",
  "output_max",
  "yield_lbs_unit",
  "yield_lbs_min",
  "yield_lbs_max",
  "yield_lbs_confidence",
  "yield_lbs_method",
  "ten_year_yield_lbs_min",
  "ten_year_yield_lbs_max",
  "harvest_window_weeks_min",
  "harvest_window_weeks_max",
  "difficulty_score",
  "reliability_score",
  "maintenance_score",
  "multi_use_score",
  "risk_level",
  "data_confidence",
  "data_method",
  "metric_source_keys",
  "metric_notes",
  "last_reviewed"
];

const csvRows = plants.map((plant) => {
  const metrics = metricsByPlant[plant.id];
  const row = {
    id: plant.id,
    name: plant.name,
    type: plant.type,
    zone_min: plant.zones[0],
    zone_max: plant.zones[1],
    sun: plant.sun,
    soils: plant.soils,
    water: plant.water,
    goals: plant.goals,
    harvest: plant.harvest,
    traits: plant.traits,
    notes: plant.notes,
    partner: plant.partner,
    query: plant.query,
    life_cycle: metrics.lifeCycle,
    horizon: metrics.horizonLabel,
    days_to_maturity_min: metrics.daysToMaturityMin,
    days_to_maturity_max: metrics.daysToMaturityMax,
    first_output_years_min: metrics.firstYieldYearsMin,
    first_output_years_max: metrics.firstYieldYearsMax,
    full_output_years_min: metrics.fullYieldYearsMin,
    full_output_years_max: metrics.fullYieldYearsMax,
    productive_lifespan_years_min: metrics.productiveLifespanYearsMin,
    productive_lifespan_years_max: metrics.productiveLifespanYearsMax,
    mature_height_ft_min: metrics.matureHeightFtMin,
    mature_height_ft_max: metrics.matureHeightFtMax,
    mature_spread_ft_min: metrics.matureSpreadFtMin,
    mature_spread_ft_max: metrics.matureSpreadFtMax,
    spacing_plant_ft_min: metrics.spacingPlantFtMin,
    spacing_plant_ft_max: metrics.spacingPlantFtMax,
    spacing_row_ft_min: metrics.spacingRowFtMin,
    spacing_row_ft_max: metrics.spacingRowFtMax,
    plants_per_100_sqft_min: metrics.plantsPer100SqFtMin,
    plants_per_100_sqft_max: metrics.plantsPer100SqFtMax,
    planting_depth_in_min: metrics.plantingDepthInMin,
    planting_depth_in_max: metrics.plantingDepthInMax,
    planting_depth_kind: metrics.plantingDepthKind,
    planting_depth_note: metrics.plantingDepthNote,
    planting_depth_confidence: metrics.plantingDepthConfidence,
    container_min_gallons: metrics.containerMinGallons,
    container_suitability: metrics.containerSuitability,
    container_note: metrics.containerNote,
    container_confidence: metrics.containerConfidence,
    output_kind: metrics.outputKind,
    output_unit: metrics.outputUnit,
    output_min: metrics.outputMin,
    output_max: metrics.outputMax,
    yield_lbs_unit: metrics.yieldLbsUnit,
    yield_lbs_min: metrics.yieldLbsMin,
    yield_lbs_max: metrics.yieldLbsMax,
    yield_lbs_confidence: metrics.yieldLbsConfidence,
    yield_lbs_method: metrics.yieldLbsMethod,
    ten_year_yield_lbs_min: metrics.tenYearYieldLbsMin,
    ten_year_yield_lbs_max: metrics.tenYearYieldLbsMax,
    harvest_window_weeks_min: metrics.harvestWindowWeeksMin,
    harvest_window_weeks_max: metrics.harvestWindowWeeksMax,
    difficulty_score: metrics.difficultyScore,
    reliability_score: metrics.reliabilityScore,
    maintenance_score: metrics.maintenanceScore,
    multi_use_score: metrics.multiUseScore,
    risk_level: metrics.riskLevel,
    data_confidence: metrics.dataConfidence,
    data_method: metrics.dataMethod,
    metric_source_keys: metrics.sourceKeys,
    metric_notes: metrics.notes,
    last_reviewed: metrics.lastReviewed
  };
  return csvColumns.map((column) => csvEscape(row[column])).join(",");
});

fs.writeFileSync(metricsPath, `${JSON.stringify(metricsByPlant, null, 2)}\n`);
fs.writeFileSync(sourcesPath, `${JSON.stringify(metricSources, null, 2)}\n`);
fs.writeFileSync(csvPath, `${csvColumns.join(",")}\n${csvRows.join("\n")}\n`);

const confidenceCounts = Object.values(metricsByPlant).reduce((counts, metrics) => {
  counts[metrics.dataConfidence] = (counts[metrics.dataConfidence] ?? 0) + 1;
  return counts;
}, {});

console.log(`Generated metrics for ${Object.keys(metricsByPlant).length} plants.`);
console.log(`Confidence counts: ${JSON.stringify(confidenceCounts)}`);
console.log(`Pound-yield records: ${Object.values(metricsByPlant).filter((metrics) => metrics.yieldLbsMin !== null && metrics.yieldLbsMax !== null).length}`);
