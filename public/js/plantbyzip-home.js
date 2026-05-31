let plants = [];
let partners = {};
let affiliateProducts = [];
let plantArtEntries = [];
let plantMetrics = {};
let plantRelationships = [];
let blogSearchData = [];
let plantArtById = {};
let coreDataPromise = null;
let blogDataPromise = null;
let zoneMapInitialized = false;
let calendarInitialized = false;
let screenerInitialized = false;
let gardenPlannerInitialized = false;
const dataUrls = {
  plants: "/data/plants.json",
  partners: "/data/affiliate-partners.json",
  affiliateProducts: "/data/affiliate-products.json",
  plantArt: "/data/plant-art.json",
  plantMetrics: "/data/plant-metrics-home.json",
  plantRelationships: "/data/plant-relationships.json",
  blogSearch: "/data/blog-search.json"
};

async function loadJson(url) {
  const response = await fetch(url, { credentials: "same-origin" });
  if (!response.ok) throw new Error(`Unable to load ${url}`);
  return response.json();
}

function setDataLoading(message = "Loading plant data...") {
  if (statusEl && !plants.length) statusEl.textContent = message;
}

async function ensureCoreData() {
  if (plants.length) return;
  if (!coreDataPromise) {
    coreDataPromise = Promise.all([
      loadJson(dataUrls.plants),
      loadJson(dataUrls.partners),
      loadJson(dataUrls.affiliateProducts),
      loadJson(dataUrls.plantArt),
      loadJson(dataUrls.plantMetrics),
      loadJson(dataUrls.plantRelationships)
    ]).then(([plantRows, partnerRows, productRows, artRows, metricRows, relationshipRows]) => {
      plants = plantRows;
      partners = partnerRows;
      affiliateProducts = productRows;
      plantArtEntries = artRows;
      plantMetrics = metricRows;
      plantRelationships = relationshipRows;
      plantArtById = Object.fromEntries(plantArtEntries.map((entry) => [entry.id, entry]));
    });
  }
  await coreDataPromise;
}

async function ensureBlogData() {
  if (blogSearchData.length) return;
  if (!blogDataPromise) {
    blogDataPromise = loadJson(dataUrls.blogSearch).then((rows) => {
      blogSearchData = rows;
    });
  }
  await blogDataPromise;
}
const appShellEl = document.querySelector("[data-progressive-shell]");
const form = document.getElementById("matcher-form");
const statusEl = document.getElementById("status");
const titleEl = document.getElementById("results-title");
const zoneNoteEl = document.getElementById("zone-note");
const resultsEl = document.getElementById("results");
const climatePanelEl = document.getElementById("climate-panel");
const seeMoreEl = document.getElementById("see-more");
const saveListEl = document.getElementById("save-list");
const sharePlanEl = document.getElementById("share-plan");
const savedPlanPanelEl = document.getElementById("saved-plan-panel");
const savedPlanTitleEl = document.getElementById("saved-plan-title");
const savedPlanMetaEl = document.getElementById("saved-plan-meta");
const savedPlanCountEl = document.getElementById("saved-plan-count");
const savedPlanListEl = document.getElementById("saved-plan-list");
const savedPlanShoppingEl = document.getElementById("saved-plan-shopping");
const savedPlanDownloadEl = document.getElementById("saved-plan-download");
const savedPlanPrintEl = document.getElementById("saved-plan-print");
const savedPlanClearEl = document.getElementById("saved-plan-clear");
const emailPlanFormEl = document.getElementById("email-plan-form");
const emailPlanInputEl = document.getElementById("email-plan-input");
const emailPlanStatusEl = document.getElementById("email-plan-status");
const zipEl = document.getElementById("zip");
const zonePreviewEl = document.getElementById("zone-preview");
const tabButtons = Array.from(document.querySelectorAll("[data-view]"));
const viewPanels = Array.from(document.querySelectorAll("[data-view-panel]"));
const articleSearchEl = document.getElementById("article-search");
const blogEmptyEl = document.getElementById("blog-empty");
const articleCards = Array.from(document.querySelectorAll("[data-article-slug]"));
const calendarFormEl = document.getElementById("calendar-form");
const calendarZipEl = document.getElementById("calendar-zip");
const calendarStatusEl = document.getElementById("calendar-status");
const calendarSetEl = document.getElementById("calendar-set");
const calendarPlantClassEl = document.getElementById("calendar-plant-class");
const calendarPlantClassComboboxEl = document.querySelector("[data-calendar-combobox='plant-group']");
const calendarPlantClassSearchEl = document.getElementById("calendar-plant-group-search");
const calendarPlantClassListEl = document.getElementById("calendar-plant-group-options");
const calendarVarietyEl = document.getElementById("calendar-variety");
const calendarVarietyComboboxEl = document.querySelector("[data-calendar-combobox='variety']");
const calendarVarietySearchEl = document.getElementById("calendar-variety-search");
const calendarVarietyListEl = document.getElementById("calendar-variety-options");
const calendarPlantClassCombo = {
  root: calendarPlantClassComboboxEl,
  input: calendarPlantClassSearchEl,
  list: calendarPlantClassListEl,
  select: calendarPlantClassEl,
  clear: calendarPlantClassComboboxEl?.querySelector(".calendar-combobox-clear"),
  toggle: calendarPlantClassComboboxEl?.querySelector(".calendar-combobox-toggle"),
  placeholder: "Search groups or presets",
  disabledPlaceholder: "Search groups or presets",
  emptyLabel: "plant groups",
  activeIndex: 0
};
const calendarVarietyCombo = {
  root: calendarVarietyComboboxEl,
  input: calendarVarietySearchEl,
  list: calendarVarietyListEl,
  select: calendarVarietyEl,
  clear: calendarVarietyComboboxEl?.querySelector(".calendar-combobox-clear"),
  toggle: calendarVarietyComboboxEl?.querySelector(".calendar-combobox-toggle"),
  placeholder: "Search varieties",
  disabledPlaceholder: "Choose a plant group first",
  emptyLabel: "varieties",
  activeIndex: 0
};
const calendarComboboxes = [calendarPlantClassCombo, calendarVarietyCombo];
const calendarExpandVarietiesEl = document.getElementById("calendar-expand-varieties");
const calendarSeasonEl = document.getElementById("calendar-season");
const calendarMethodEl = document.getElementById("calendar-method");
const calendarZoneValueEl = document.getElementById("calendar-zone-value");
const calendarTempValueEl = document.getElementById("calendar-temp-value");
const calendarLastFrostEl = document.getElementById("calendar-last-frost");
const calendarLastFrostNoteEl = document.getElementById("calendar-last-frost-note");
const calendarFirstFrostEl = document.getElementById("calendar-first-frost");
const calendarFirstFrostNoteEl = document.getElementById("calendar-first-frost-note");
const calendarSeasonLengthEl = document.getElementById("calendar-season-length");
const calendarNowTitleEl = document.getElementById("calendar-now-title");
const calendarNowSummaryEl = document.getElementById("calendar-now-summary");
const calendarNowListEl = document.getElementById("calendar-now-list");
const calendarVisualSummaryEl = document.getElementById("calendar-visual-summary");
const calendarHeatmapEl = document.getElementById("calendar-heatmap");
const calendarMobilePlanEl = document.getElementById("calendar-mobile-plan");
const calendarGanttEl = document.getElementById("calendar-gantt");
const calendarPrintEl = document.getElementById("calendar-print");
const calendarResultsTitleEl = document.getElementById("calendar-results-title");
const calendarSummaryEl = document.getElementById("calendar-summary");
const calendarEventsEl = document.getElementById("calendar-events");
const calendarEmptyEl = document.getElementById("calendar-empty");
const zoneMapFormEl = document.getElementById("zone-map-form");
const zoneMapZipEl = document.getElementById("zone-map-zip");
const zoneMapStatusEl = document.getElementById("zone-map-status");
const zoneMapZoneValueEl = document.getElementById("zone-map-zone-value");
const zoneMapTempRangeEl = document.getElementById("zone-map-temp-range");
const zoneMapFrostValueEl = document.getElementById("zone-map-frost-value");
const zoneMapFrostNoteEl = document.getElementById("zone-map-frost-note");
const zoneMapHeatValueEl = document.getElementById("zone-map-heat-value");
const zoneMapHeatNoteEl = document.getElementById("zone-map-heat-note");
const zoneMapChillValueEl = document.getElementById("zone-map-chill-value");
const zoneMapChillNoteEl = document.getElementById("zone-map-chill-note");
const zoneMapRegionLayerEl = document.getElementById("zone-map-region-layer");
const zoneMapCanvasEl = document.getElementById("zone-map-canvas");
const zoneMapLiveMapEl = document.getElementById("zone-map-live-map");
const zoneMapLiveStatusEl = document.getElementById("zone-map-live-status");
const zoneMapIdentifyEl = document.getElementById("zone-map-identify");
const zoneMapImageStageEl = document.getElementById("zone-map-image-stage");
const zoneMapPinEl = document.getElementById("zone-map-pin");
const zoneMapPinLabelEl = document.getElementById("zone-map-pin-label");
const zoneMapExpandEl = document.getElementById("zone-map-expand");
const zoneMapZoomInEl = document.getElementById("zone-map-zoom-in");
const zoneMapZoomOutEl = document.getElementById("zone-map-zoom-out");
const zoneMapResetEl = document.getElementById("zone-map-reset");
const zoneMapCloseEl = document.getElementById("zone-map-close");
const zoneMapRegionTitleEl = document.getElementById("zone-map-region-title");
const zoneMapRegionSummaryEl = document.getElementById("zone-map-region-summary");
const zoneMapRegionChecksEl = document.getElementById("zone-map-region-checks");
const zoneMapZoneButtonsEl = document.getElementById("zone-map-zone-buttons");
const zoneMapZoneDetailEl = document.getElementById("zone-map-zone-detail");
const zoneMapPlantOverlaySelectEl = document.getElementById("zone-map-plant-overlay-select");
const zoneMapPlantOverlayComboboxEl = document.querySelector("[data-zone-map-combobox='plant-overlay']");
const zoneMapPlantOverlaySearchEl = document.getElementById("zone-map-plant-overlay-search");
const zoneMapPlantOverlayListEl = document.getElementById("zone-map-plant-overlay-options");
const zoneMapPlantOverlayClearEl = zoneMapPlantOverlayComboboxEl?.querySelector(".calendar-combobox-clear");
const zoneMapPlantOverlaySummaryEl = document.getElementById("zone-map-plant-overlay-summary");
const zoneMapPlantOverlayCombo = {
  root: zoneMapPlantOverlayComboboxEl,
  input: zoneMapPlantOverlaySearchEl,
  list: zoneMapPlantOverlayListEl,
  select: zoneMapPlantOverlaySelectEl,
  clear: zoneMapPlantOverlayClearEl,
  toggle: zoneMapPlantOverlayComboboxEl?.querySelector(".calendar-combobox-toggle"),
  placeholder: "Search plants",
  disabledPlaceholder: "Search plants",
  emptyLabel: "plants",
  defaultValue: "",
  activeIndex: 0
};
if (zoneMapPlantOverlayCombo.root) calendarComboboxes.push(zoneMapPlantOverlayCombo);
const zoneMapPlantTitleEl = document.getElementById("zone-map-plant-title");
const zoneMapPlantSummaryEl = document.getElementById("zone-map-plant-summary");
const zoneMapPlantListEl = document.getElementById("zone-map-plant-list");
const zoneMapUseMatcherEl = document.getElementById("zone-map-use-matcher");
const zoneMapUseCalendarEl = document.getElementById("zone-map-use-calendar");
const screenerSearchEl = document.getElementById("screener-search");
const screenerColumnPresetEl = document.getElementById("screener-column-preset");
const screenerSavedScreenEl = document.getElementById("screener-saved-screen");
const screenerTypeEl = document.getElementById("screener-type");
const screenerZoneEl = document.getElementById("screener-zone");
const screenerHorizonEl = document.getElementById("screener-horizon");
const screenerContainerEl = document.getElementById("screener-container");
const screenerSunEl = document.getElementById("screener-sun");
const screenerSoilEl = document.getElementById("screener-soil");
const screenerWaterEl = document.getElementById("screener-water");
const screenerGoalEl = document.getElementById("screener-goal");
const screenerFlagEl = document.getElementById("screener-flag");
const screenerDeerEl = document.getElementById("screener-deer");
const screenerJugloneEl = document.getElementById("screener-juglone");
const screenerPartnerEl = document.getElementById("screener-partner");
const screenerConfidenceEl = document.getElementById("screener-confidence");
const screenerMinYieldEl = document.getElementById("screener-min-yield");
const screenerMinYieldSpaceEl = document.getElementById("screener-min-yield-space");
const screenerMaxFirstOutputEl = document.getElementById("screener-max-first-output");
const screenerMaxContainerEl = document.getElementById("screener-max-container");
const screenerMaxDifficultyEl = document.getElementById("screener-max-difficulty");
const screenerMinReliabilityEl = document.getElementById("screener-min-reliability");
const screenerMaxHeightEl = document.getElementById("screener-max-height");
const screenerMinDensityEl = document.getElementById("screener-min-density");
const screenerGroupTypeEl = document.getElementById("screener-group-type");
const screenerShowSourceLinksEl = document.getElementById("screener-show-source-links");
const screenerResetEl = document.getElementById("screener-reset");
const screenerMoreEl = document.getElementById("screener-more");
const screenerBodyEl = document.getElementById("screener-body");
const screenerTableWrapEl = document.querySelector(".screener-table-wrap");
const screenerSupplyPanelEl = document.getElementById("screener-supply-panel");
const screenerSupplyTitleEl = document.getElementById("screener-supply-title");
const screenerSupplyKickerEl = document.getElementById("screener-supply-kicker");
const screenerSupplyListEl = document.getElementById("screener-supply-list");
const screenerComparePanelEl = document.getElementById("screener-compare-panel");
const screenerCompareTitleEl = document.getElementById("screener-compare-title");
const screenerCompareStatusEl = document.getElementById("screener-compare-status");
const screenerCompareTableEl = document.getElementById("screener-compare-table");
const screenerClearCompareEl = document.getElementById("screener-clear-compare");
const screenerPortfolioPanelEl = document.getElementById("screener-portfolio-panel");
const screenerPortfolioTitleEl = document.getElementById("screener-portfolio-title");
const screenerPortfolioNoteEl = document.getElementById("screener-portfolio-note");
const screenerPortfolioStatsEl = document.getElementById("screener-portfolio-stats");
const screenerPortfolioTableEl = document.getElementById("screener-portfolio-table");
const screenerPortfolioFilterEl = document.getElementById("screener-portfolio-filter");
const screenerPortfolioOpenPlannerEl = document.getElementById("screener-portfolio-open-planner");
const screenerPortfolioCompareEl = document.getElementById("screener-portfolio-compare");
const screenerPortfolioExportEl = document.getElementById("screener-portfolio-export");
const screenerPortfolioClearEl = document.getElementById("screener-portfolio-clear");
const gardenPlannerStatsEl = document.getElementById("garden-planner-stats");
const gardenPlannerWarningsEl = document.getElementById("garden-planner-warnings");
const gardenPlannerSettingsFormEl = document.getElementById("garden-planner-settings-form");
const gardenPlannerZipEl = document.getElementById("garden-planner-zip");
const gardenPlannerZoneEl = document.getElementById("garden-planner-zone");
const gardenPlannerBedLengthEl = document.getElementById("garden-planner-bed-length");
const gardenPlannerBedWidthEl = document.getElementById("garden-planner-bed-width");
const gardenPlannerBedCountEl = document.getElementById("garden-planner-bed-count");
const gardenPlannerSunEl = document.getElementById("garden-planner-sun");
const gardenPlannerSoilEl = document.getElementById("garden-planner-soil");
const gardenPlannerWaterEl = document.getElementById("garden-planner-water");
const gardenPlannerModeEl = document.getElementById("garden-planner-mode");
const gardenPlannerDeerEl = document.getElementById("garden-planner-deer");
const gardenPlannerWalnutEl = document.getElementById("garden-planner-walnut");
const gardenPlannerSettingsStatusEl = document.getElementById("garden-planner-settings-status");
const gardenPlannerSpaceEl = document.getElementById("garden-planner-space");
const gardenPlannerCompanionsEl = document.getElementById("garden-planner-companions");
const gardenPlannerTimelineEl = document.getElementById("garden-planner-timeline");
const gardenPlannerComparePanelEl = document.getElementById("garden-planner-compare-panel");
const gardenPlannerSearchEl = document.getElementById("garden-planner-search");
const gardenPlannerSearchResultsEl = document.getElementById("garden-planner-search-results");
const gardenPlannerTableEl = document.getElementById("garden-planner-table");
const gardenPlannerSuppliesEl = document.getElementById("garden-planner-supplies");
const gardenPlannerOpenScreenerEl = document.getElementById("garden-planner-open-screener");
const gardenPlannerCompareEl = document.getElementById("garden-planner-compare");
const gardenPlannerExportEl = document.getElementById("garden-planner-export");
const gardenPlannerPrintBedEl = document.getElementById("garden-planner-print-bed");
const gardenPlannerClearEl = document.getElementById("garden-planner-clear");
const screenerSummaryEl = document.getElementById("screener-summary");
const screenerEmptyEl = document.getElementById("screener-empty");
const screenerVisibleCountEl = document.getElementById("screener-visible-count");
const screenerTypeCountEl = document.getElementById("screener-type-count");
const screenerRelationCountEl = document.getElementById("screener-relation-count");
const screenerPortfolioCountEl = document.getElementById("screener-portfolio-count");
const screenerSortButtons = Array.from(document.querySelectorAll("[data-screener-sort]"));
const screenerFilterEls = [
  screenerSearchEl,
  screenerColumnPresetEl,
  screenerTypeEl,
  screenerZoneEl,
  screenerHorizonEl,
  screenerContainerEl,
  screenerSunEl,
  screenerSoilEl,
  screenerWaterEl,
  screenerGoalEl,
  screenerFlagEl,
  screenerDeerEl,
  screenerJugloneEl,
  screenerPartnerEl,
  screenerConfidenceEl,
  screenerMinYieldEl,
  screenerMinYieldSpaceEl,
  screenerMaxFirstOutputEl,
  screenerMaxContainerEl,
  screenerMaxDifficultyEl,
  screenerMinReliabilityEl,
  screenerMaxHeightEl,
  screenerMinDensityEl
].filter(Boolean);
const screenerRangeEls = [
  screenerMinYieldEl,
  screenerMinYieldSpaceEl,
  screenerMaxFirstOutputEl,
  screenerMaxContainerEl,
  screenerMaxDifficultyEl,
  screenerMinReliabilityEl,
  screenerMaxHeightEl,
  screenerMinDensityEl
].filter(Boolean);
let currentRanked = [];
let currentInputs = null;
let currentPlanParams = null;
let savedPlan = null;
let visibleCount = 12;
let screenerSort = { key: "name", direction: "asc" };
let screenerGroupedByType = false;
let screenerVisibleLimit = 120;
let screenerCompareIds = new Set();
let screenerWatchlistIds = new Set();
let gardenPlannerQuantities = {};
let gardenPlannerLayout = {};
let gardenPlannerSettings = {
  zip: "",
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
};
let gardenPlannerCompareOpen = false;
let gardenPlannerLayoutDragId = null;
let gardenPlannerLayoutPointerDrag = null;
let gardenPlannerSuppressLayoutClick = false;
let gardenPlannerSelectedLayoutId = null;
let screenerLastFiltered = [];
let calendarZoneData = null;
let calendarFrost = null;
let calendarEvents = [];
let calendarMonthFilter = "";
let calendarDisplayYear = new Date().getFullYear();
let zoneMapZoneData = null;
let zoneMapSelectedRegion = "humid-east";
let zoneMapSelectedZone = "7b";
let zoneMapScale = 1;
let zoneMapPanX = 0;
let zoneMapPanY = 0;
let zoneMapPointer = null;
let zoneMapLibraryPromise = null;
let zoneMapLiveInitPromise = null;
let zoneMapMapModules = null;
let zoneMapView = null;
let zoneMapHardinessLayer = null;
let zoneMapHardinessTileLayer = null;
let zoneMapPlantRangeTileLayer = null;
let zoneMapZipGraphicsLayer = null;
let zoneMapHoverTooltip = null;
let zoneMapSelectedPlantOverlay = null;
const screenerPageSize = 120;
const screenerCompareLimit = 5;
const screenerWatchlistStorageKey = "plantbyzip.screenerWatchlist.v1";
const gardenPlannerQuantityStorageKey = "plantbyzip.gardenPlannerQuantities.v1";
const gardenPlannerSettingsStorageKey = "plantbyzip.gardenPlannerSettings.v1";
const gardenPlannerLayoutStorageKey = "plantbyzip.gardenPlannerLayout.v1";
const gardenPlannerBedKitProducts = [
  {
    id: "raised-bed-4-in-1",
    name: "4-in-1 galvanized raised bed kit",
    configuration: "4-in-1",
    affiliateUrl: "https://amzn.to/3RFf8GH",
    priority: 1,
    sizes: [[3.5, 3.5], [2, 2], [2, 5], [2, 3.5]]
  },
  {
    id: "raised-bed-9-in-1",
    name: "9-in-1 galvanized raised bed kit",
    configuration: "9-in-1",
    affiliateUrl: "https://amzn.to/3RFf8GH",
    priority: 2,
    sizes: [[8, 2], [3.5, 6.5], [2, 6.5], [5, 5], [3.5, 5], [3.5, 3.5], [2, 5], [2, 3.5], [2, 2]]
  },
  {
    id: "raised-bed-4x10",
    name: "4 x 10 ft galvanized raised bed kit",
    configuration: "4 x 10",
    affiliateUrl: "https://amzn.to/4u2HQih",
    priority: 1,
    sizes: [[4, 10]]
  },
  {
    id: "raised-bed-2x12",
    name: "2 x 12 ft galvanized raised bed kit",
    configuration: "2 x 12",
    affiliateUrl: "https://amzn.to/3QcLTdN",
    priority: 1,
    sizes: [[2, 12]]
  },
  {
    id: "raised-bed-10-in-1",
    name: "10-in-1 galvanized raised bed kit",
    configuration: "10-in-1",
    affiliateUrl: "https://amzn.to/3QcLTdN",
    priority: 2,
    sizes: [[2.5, 9.5], [4, 8], [2.5, 8], [2.5, 7.5], [5.5, 6.5], [4, 6.5], [2.5, 6.5], [6, 6], [4, 6], [2.5, 6]]
  }
];
const screenerColumnPresets = {
  core: ["name", "type", "zone", "firstOutput", "yield", "difficulty", "data", "source", "profile"],
  yield: ["name", "type", "zone", "firstOutput", "yield", "yieldPerSpace", "score", "difficulty", "reliability", "data", "source", "profile"],
  space: ["name", "type", "zone", "spacing", "container", "yield", "yieldPerSpace", "score", "sun", "water", "profile"],
  container: ["name", "type", "zone", "container", "yield", "score", "sun", "soil", "water", "screening", "source", "profile"],
  risk: ["name", "type", "zone", "difficulty", "reliability", "data", "deer", "juglone", "screening", "water", "pairings", "source", "profile"],
  ecology: ["name", "type", "zone", "sun", "soil", "water", "goals", "traits", "native", "lowWater", "deer", "juglone", "pairings", "screening", "profile"],
  all: ["name", "type", "zone", "firstOutput", "spacing", "plantingDepth", "container", "yield", "yieldPerSpace", "score", "difficulty", "reliability", "data", "sun", "soil", "water", "goals", "harvest", "traits", "native", "lowWater", "pairings", "deer", "juglone", "screening", "source", "profile"]
};
const screenerSavedScreens = {
  "high-yield-small-space": {
    label: "High-yield small-space edibles",
    columnPreset: "space",
    values: { sgoal: "vegetables-herbs", scontainer: "10", sdata: "medium" },
    ranges: { sminspace: "20", smaxfirst: "1", smaxdifficulty: "4" },
    sort: { key: "yieldPerSpace", direction: "desc" }
  },
  "fast-annual-crops": {
    label: "Fast annual crops",
    columnPreset: "yield",
    values: { stype: "annual vegetable", sdata: "medium" },
    ranges: { smaxfirst: "0.35", smaxdifficulty: "4" },
    sort: { key: "firstOutput", direction: "asc" }
  },
  "beginner-fruit": {
    label: "Beginner fruit plants",
    columnPreset: "risk",
    values: { sgoal: "fruit", sdata: "medium" },
    ranges: { smaxdifficulty: "3", sminreliability: "3" },
    sort: { key: "reliability", direction: "desc" }
  },
  "low-water-perennials": {
    label: "Low-water perennials",
    columnPreset: "risk",
    values: { swater: "low", sattr: "low-water", sdata: "medium" },
    ranges: { smaxdifficulty: "4" },
    sort: { key: "difficulty", direction: "asc" }
  },
  "native-pollinator-anchors": {
    label: "Native pollinator anchors",
    columnPreset: "ecology",
    values: { sgoal: "native-plants", sattr: "native" },
    ranges: { sminreliability: "3" },
    sort: { key: "pairings", direction: "desc" }
  },
  "container-winners": {
    label: "Container winners",
    columnPreset: "container",
    values: { scontainer: "10", sdata: "medium" },
    ranges: { smaxcontainer: "10", sminreliability: "3" },
    sort: { key: "containerEfficiency", direction: "desc" }
  }
};
const zoneCache = new Map();
const zoneStorageKey = "plantbyzip.zoneCache.v1";
const zoneLookupTimeoutMs = 8000;
let zoneLookupTimer = null;
const screenerParamMap = {
  sq: screenerSearchEl,
  sview: screenerColumnPresetEl,
  stype: screenerTypeEl,
  szone: screenerZoneEl,
  shorizon: screenerHorizonEl,
  scontainer: screenerContainerEl,
  ssun: screenerSunEl,
  ssoil: screenerSoilEl,
  swater: screenerWaterEl,
  sgoal: screenerGoalEl,
  sattr: screenerFlagEl,
  sdeer: screenerDeerEl,
  sjuglone: screenerJugloneEl,
  ssource: screenerPartnerEl,
  sdata: screenerConfidenceEl,
  sminyield: screenerMinYieldEl,
  sminspace: screenerMinYieldSpaceEl,
  smaxfirst: screenerMaxFirstOutputEl,
  smaxcontainer: screenerMaxContainerEl,
  smaxdifficulty: screenerMaxDifficultyEl,
  sminreliability: screenerMinReliabilityEl,
  smaxheight: screenerMaxHeightEl,
  smindensity: screenerMinDensityEl
};
const screenerParamKeys = [...Object.keys(screenerParamMap), "ssort", "sdir", "sgroup", "sscreen"];
const matcherParamKeys = ["zip", "sun", "soil", "water", "goal"];
const savedPlanStorageKey = "plantbyzip.savedPlan.v1";
const leafletCssUrl = "/vendor/leaflet/leaflet.css";
const leafletJsUrl = "/vendor/leaflet/leaflet.js";
const leafletVectorGridJsUrl = "/vendor/leaflet-vectorgrid/Leaflet.VectorGrid.bundled.js";
const esriLeafletJsUrl = "/vendor/esri-leaflet/esri-leaflet.js";
const hardinessFeatureLayerUrl = "https://services8.arcgis.com/1WIA3UeOTguiTsKg/arcgis/rest/services/USDS_2023_Plant_Hardiness_Zones_Vector_Tile_From_Pro/FeatureServer/0";
const hardinessVectorTileServerUrl = "https://vectortileservices1.arcgis.com/rKbpcgHXWYYaP4pQ/arcgis/rest/services/phzm_us_zones_shp_2023_view/VectorTileServer";
const matcherDefaults = {
  zip: "",
  sun: "full",
  soil: "loam",
  water: "medium",
  goal: "fruit"
};

const waterRank = { low: 1, medium: 2, high: 3 };
const confidenceRank = { low: 1, medium: 2, high: 3 };
const deerResistanceRank = {
  "rarely-damaged": 4,
  "seldom-damaged": 3,
  "occasionally-damaged": 2,
  "frequently-damaged": 1,
  unknown: 0
};
const jugloneToleranceRank = {
  tolerant: 3,
  "mixed-uncertain": 2,
  sensitive: 1,
  unknown: 0
};
const goalLabels = {
  fruit: "fruit",
  "vegetables-herbs": "vegetables & herbs",
  "pollinators-wildlife": "pollinators & wildlife",
  "curb-appeal": "curb appeal & color",
  "privacy-screening": "privacy & screening",
  "native-plants": "native plants"
};
const legacyGoalLabels = {
  "low-maintenance-natives": "native plants"
};
const formLabels = {
  tree: ["tree", "trees"],
  shrub: ["shrub", "shrubs"],
  vine: ["vine", "vines"],
  vegetable: ["vegetable", "vegetables"],
  flowerHerb: ["flower/herb", "flowers/herbs"],
  cactus: ["cactus", "cacti"],
  fruiting: ["fruiting plant", "fruiting plants"]
};
const formOrder = ["tree", "shrub", "vine", "vegetable", "flowerHerb", "cactus", "fruiting"];
const plantGroupTerms = [
  { label: "Tomatoes", terms: ["tomato"] },
  { label: "Peppers", terms: ["pepper", "habanero", "jalapeno", "poblano", "shishito", "aji amarillo"] },
  { label: "Eggplants", terms: ["eggplant"] },
  { label: "Apples", terms: ["apple"] },
  { label: "Pears", terms: ["pear"] },
  { label: "Peaches", terms: ["peach", "nectarine"] },
  { label: "Plums", terms: ["plum"] },
  { label: "Cherries", terms: ["cherry"] },
  { label: "Figs", terms: ["fig"] },
  { label: "Persimmons", terms: ["persimmon"] },
  { label: "Pawpaws", terms: ["pawpaw"] },
  { label: "Prickly pears", terms: ["prickly pear"] },
  { label: "Blueberries", terms: ["blueberry"] },
  { label: "Blackberries", terms: ["blackberry"] },
  { label: "Raspberries", terms: ["raspberry"] },
  { label: "Strawberries", terms: ["strawberry"] },
  { label: "Currants", terms: ["currant"] },
  { label: "Gooseberries", terms: ["gooseberry"] },
  { label: "Grapes", terms: ["grape", "muscadine"] },
  { label: "Kiwi vines", terms: ["kiwi"] },
  { label: "Beans", terms: ["bean"] },
  { label: "Peas", terms: ["pea", "cowpea"] },
  { label: "Leafy greens", terms: ["lettuce", "spinach", "kale", "collards", "chard", "arugula", "mizuna", "miner"] },
  { label: "Root crops", terms: ["carrot", "beet", "radish", "turnip", "daikon"] },
  { label: "Onions & garlic", terms: ["onion", "garlic", "leek"] },
  { label: "Squash & zucchini", terms: ["squash", "zucchini"] },
  { label: "Melons", terms: ["melon", "cantaloupe", "watermelon"] },
  { label: "Cucumbers", terms: ["cucumber"] },
  { label: "Potatoes", terms: ["potato"] },
  { label: "Basil", terms: ["basil"] },
  { label: "Mint", terms: ["mint"] },
  { label: "Culinary herbs", terms: ["rosemary", "thyme", "parsley", "cilantro", "dill", "sage", "oregano", "lavender"] },
  { label: "Milkweeds", terms: ["milkweed"] },
  { label: "Coneflowers", terms: ["coneflower", "echinacea"] },
  { label: "Hydrangeas", terms: ["hydrangea"] },
  { label: "Hollies", terms: ["holly"] },
  { label: "Maples", terms: ["maple"] },
  { label: "Oaks", terms: ["oak"] }
];
const calendarPlantClassTerms = [
  { label: "Apple", plural: "Apples", terms: ["apple"] },
  { label: "Pear", plural: "Pears", terms: ["pear"], excludes: ["prickly pear"] },
  { label: "Peach", plural: "Peaches", terms: ["peach", "nectarine"] },
  { label: "Plum", plural: "Plums", terms: ["plum"] },
  { label: "Cherry", plural: "Cherries", terms: ["cherry"] },
  { label: "Fig", plural: "Figs", terms: ["fig"] },
  { label: "Persimmon", plural: "Persimmons", terms: ["persimmon"] },
  { label: "Pawpaw", plural: "Pawpaws", terms: ["pawpaw"] },
  { label: "Jujube", plural: "Jujubes", terms: ["jujube"] },
  { label: "Pomegranate", plural: "Pomegranates", terms: ["pomegranate"] },
  { label: "Loquat", plural: "Loquats", terms: ["loquat"] },
  { label: "Mulberry", plural: "Mulberries", terms: ["mulberry"] },
  { label: "Blueberry", plural: "Blueberries", terms: ["blueberry"] },
  { label: "Blackberry", plural: "Blackberries", terms: ["blackberry"] },
  { label: "Raspberry", plural: "Raspberries", terms: ["raspberry"] },
  { label: "Strawberry", plural: "Strawberries", terms: ["strawberry"] },
  { label: "Currant", plural: "Currants", terms: ["currant"] },
  { label: "Gooseberry", plural: "Gooseberries", terms: ["gooseberry"] },
  { label: "Grape", plural: "Grapes", terms: ["grape", "muscadine"] },
  { label: "Kiwi", plural: "Kiwis", terms: ["kiwi"] },
  { label: "Elderberry", plural: "Elderberries", terms: ["elderberry"] },
  { label: "Hazelnut", plural: "Hazelnuts", terms: ["hazelnut"] },
  { label: "Pecan", plural: "Pecans", terms: ["pecan"] },
  { label: "Chestnut", plural: "Chestnuts", terms: ["chestnut"] },
  { label: "Almond", plural: "Almonds", terms: ["almond"] },
  { label: "Citrus", plural: "Citrus", types: ["citrus"], terms: ["citrus", "kumquat", "calamondin", "yuzu", "mandarin", "orange tree", "lemon tree", "lime tree"], excludes: ["lemon basil", "lemon balm", "lemon cucumber", "lemon thyme", "lemongrass"] },
  { label: "Olive", plural: "Olives", terms: ["olive"] },
  { label: "Prickly pear", plural: "Prickly pears", terms: ["prickly pear"] },
  { label: "Mayhaw", plural: "Mayhaws", terms: ["mayhaw"] },
  { label: "Quince", plural: "Quinces", terms: ["quince"] },
  { label: "Che fruit", plural: "Che fruit", terms: ["che fruit"] },
  { label: "Jaboticaba", plural: "Jaboticabas", terms: ["jaboticaba"] },
  { label: "Starfruit", plural: "Starfruit", terms: ["starfruit"] },
  { label: "White sapote", plural: "White sapotes", terms: ["white sapote"] },
  { label: "Atemoya", plural: "Atemoyas", terms: ["atemoya", "cherimoya"] },
  { label: "Medlar", plural: "Medlars", terms: ["medlar"] },
  { label: "Pineapple guava", plural: "Pineapple guavas", terms: ["pineapple guava", "feijoa"] },
  { label: "Guava", plural: "Guavas", terms: ["guava"] },
  { label: "Sapodilla", plural: "Sapodillas", terms: ["sapodilla"] },
  { label: "Apricot", plural: "Apricots", terms: ["apricot"] },
  { label: "Walnut", plural: "Walnuts", terms: ["walnut"] },
  { label: "Serviceberry", plural: "Serviceberries", terms: ["serviceberry"] },
  { label: "Aronia", plural: "Aronias", terms: ["aronia", "chokeberry"] },
  { label: "Goumi", plural: "Goumis", terms: ["goumi"] },
  { label: "Goji", plural: "Goji berries", terms: ["goji"] },
  { label: "Honeyberry", plural: "Honeyberries", terms: ["honeyberry"] },
  { label: "Seaberry", plural: "Seaberries", terms: ["seaberry"] },
  { label: "Lingonberry", plural: "Lingonberries", terms: ["lingonberry"] },
  { label: "Cranberry", plural: "Cranberries", terms: ["cranberry"] },
  { label: "Passionfruit", plural: "Passionfruits", terms: ["passionfruit", "passionflower", "maypop"] },
  { label: "Schisandra", plural: "Schisandra", terms: ["schisandra"] },
  { label: "Dragon fruit", plural: "Dragon fruit", terms: ["dragon fruit"] },
  { label: "Tomato", plural: "Tomatoes", terms: ["tomato"] },
  { label: "Pepper", plural: "Peppers", terms: ["pepper", "habanero", "jalapeno", "poblano", "shishito", "aji amarillo"] },
  { label: "Eggplant", plural: "Eggplants", terms: ["eggplant"] },
  { label: "Bean", plural: "Beans", terms: ["bean"] },
  { label: "Pea", plural: "Peas", terms: ["pea", "cowpea"] },
  { label: "Corn", plural: "Corn", terms: ["corn"] },
  { label: "Lettuce", plural: "Lettuce", terms: ["lettuce"] },
  { label: "Spinach", plural: "Spinach", terms: ["spinach"] },
  { label: "Kale", plural: "Kale", terms: ["kale"] },
  { label: "Collard", plural: "Collards", terms: ["collard", "collards"] },
  { label: "Chard", plural: "Chard", terms: ["chard"] },
  { label: "Arugula", plural: "Arugula", terms: ["arugula"] },
  { label: "Carrot", plural: "Carrots", terms: ["carrot"] },
  { label: "Beet", plural: "Beets", terms: ["beet"] },
  { label: "Radish", plural: "Radishes", terms: ["radish", "daikon"] },
  { label: "Turnip", plural: "Turnips", terms: ["turnip"] },
  { label: "Onion", plural: "Onions", terms: ["onion"] },
  { label: "Garlic", plural: "Garlic", terms: ["garlic"] },
  { label: "Leek", plural: "Leeks", terms: ["leek"] },
  { label: "Potato", plural: "Potatoes", terms: ["potato"], excludes: ["sweet potato"] },
  { label: "Sweet potato", plural: "Sweet potatoes", terms: ["sweet potato"] },
  { label: "Cucumber", plural: "Cucumbers", terms: ["cucumber"] },
  { label: "Squash", plural: "Squash", terms: ["squash", "zucchini", "pumpkin"] },
  { label: "Melon", plural: "Melons", terms: ["melon", "cantaloupe", "watermelon"] },
  { label: "Okra", plural: "Okra", terms: ["okra"] },
  { label: "Broccoli", plural: "Broccoli", terms: ["broccoli"] },
  { label: "Cabbage", plural: "Cabbage", terms: ["cabbage"] },
  { label: "Cauliflower", plural: "Cauliflower", terms: ["cauliflower"] },
  { label: "Rhubarb", plural: "Rhubarb", terms: ["rhubarb"] },
  { label: "Asparagus", plural: "Asparagus", terms: ["asparagus"] },
  { label: "Artichoke", plural: "Artichokes", terms: ["artichoke"] },
  { label: "Oca", plural: "Oca", terms: ["oca"] },
  { label: "Yacon", plural: "Yacon", terms: ["yacon"] },
  { label: "Sunchoke", plural: "Sunchokes", terms: ["sunchoke"] },
  { label: "Skirret", plural: "Skirret", terms: ["skirret"] },
  { label: "Roselle", plural: "Roselle", terms: ["roselle"] },
  { label: "Mizuna", plural: "Mizuna", terms: ["mizuna"] },
  { label: "Basil", plural: "Basil", terms: ["basil"] },
  { label: "Mint", plural: "Mint", terms: ["mint"] },
  { label: "Rosemary", plural: "Rosemary", terms: ["rosemary"] },
  { label: "Thyme", plural: "Thyme", terms: ["thyme"] },
  { label: "Parsley", plural: "Parsley", terms: ["parsley"] },
  { label: "Cilantro", plural: "Cilantro", terms: ["cilantro"] },
  { label: "Dill", plural: "Dill", terms: ["dill"] },
  { label: "Bee balm", plural: "Bee balm", terms: ["bee balm", "bergamot"] },
  { label: "Hyssop", plural: "Hyssops", terms: ["hyssop", "agastache"] },
  { label: "Lavender", plural: "Lavender", terms: ["lavender", "lavandin"] },
  { label: "Sage", plural: "Sage", terms: ["sage"], excludes: ["russian sage"] },
  { label: "Russian sage", plural: "Russian sage", terms: ["russian sage"] },
  { label: "Yarrow", plural: "Yarrows", terms: ["yarrow"] },
  { label: "Coreopsis", plural: "Coreopsis", terms: ["coreopsis"] },
  { label: "Blanket flower", plural: "Blanket flowers", terms: ["blanket flower", "gaillardia"] },
  { label: "Salvia", plural: "Salvias", terms: ["salvia"] },
  { label: "Blazing star", plural: "Blazing stars", terms: ["blazing star", "liatris"] },
  { label: "Joe Pye weed", plural: "Joe Pye weeds", terms: ["joe pye"] },
  { label: "Goldenrod", plural: "Goldenrods", terms: ["goldenrod", "solidago"] },
  { label: "Aster", plural: "Asters", terms: ["aster"] },
  { label: "Penstemon", plural: "Penstemons", terms: ["penstemon", "beardtongue"] },
  { label: "Phlox", plural: "Phlox", terms: ["phlox"] },
  { label: "Zinnia", plural: "Zinnias", terms: ["zinnia"] },
  { label: "Cosmos", plural: "Cosmos", terms: ["cosmos"] },
  { label: "Marigold", plural: "Marigolds", terms: ["marigold"] },
  { label: "Nasturtium", plural: "Nasturtiums", terms: ["nasturtium"] },
  { label: "Sunflower", plural: "Sunflowers", terms: ["sunflower", "helianthus"] },
  { label: "Hosta", plural: "Hostas", terms: ["hosta"] },
  { label: "Coral bells", plural: "Coral bells", terms: ["coral bells", "heuchera"] },
  { label: "Shiso", plural: "Shiso", terms: ["shiso", "perilla"] },
  { label: "Oregano", plural: "Oregano", terms: ["oregano"] },
  { label: "Chives", plural: "Chives", terms: ["chives"] },
  { label: "Fennel", plural: "Fennel", terms: ["fennel"] },
  { label: "Lemon balm", plural: "Lemon balm", terms: ["lemon balm"] },
  { label: "Lemongrass", plural: "Lemongrass", terms: ["lemongrass"] },
  { label: "Sorrel", plural: "Sorrels", terms: ["sorrel"] },
  { label: "Horseradish", plural: "Horseradish", terms: ["horseradish"] },
  { label: "Good King Henry", plural: "Good King Henry", terms: ["good king henry"] },
  { label: "Stevia", plural: "Stevia", terms: ["stevia"] },
  { label: "Lovage", plural: "Lovage", terms: ["lovage"] },
  { label: "Milkweed", plural: "Milkweeds", terms: ["milkweed"] },
  { label: "Butterfly weed", plural: "Butterfly weed", terms: ["butterfly weed", "asclepias tuberosa"] },
  { label: "Coneflower", plural: "Coneflowers", terms: ["coneflower", "echinacea"] },
  { label: "Black-eyed Susan", plural: "Black-eyed Susans", terms: ["black eyed susan", "rudbeckia"] },
  { label: "Lobelia", plural: "Lobelias", terms: ["lobelia"] },
  { label: "Cardinal flower", plural: "Cardinal flowers", terms: ["cardinal flower"] },
  { label: "Bluebell", plural: "Bluebells", terms: ["bluebell", "bluebells"] },
  { label: "Columbine", plural: "Columbines", terms: ["columbine"] },
  { label: "Nicotiana", plural: "Nicotiana", terms: ["nicotiana", "flowering tobacco"] },
  { label: "Catmint", plural: "Catmints", terms: ["catmint"] },
  { label: "Borage", plural: "Borage", terms: ["borage"] },
  { label: "Calendula", plural: "Calendulas", terms: ["calendula"] },
  { label: "Verbena", plural: "Verbenas", terms: ["verbena"] },
  { label: "Peony", plural: "Peonies", terms: ["peony"] },
  { label: "Daylily", plural: "Daylilies", terms: ["daylily"] },
  { label: "Iris", plural: "Irises", terms: ["iris"] },
  { label: "Astilbe", plural: "Astilbes", terms: ["astilbe"] },
  { label: "Foamflower", plural: "Foamflowers", terms: ["foamflower"] },
  { label: "Wild ginger", plural: "Wild ginger", terms: ["wild ginger"] },
  { label: "Green and gold", plural: "Green and gold", terms: ["green and gold"] },
  { label: "Bluestar", plural: "Bluestars", terms: ["bluestar", "amsonia"] },
  { label: "Baptisia", plural: "Baptisias", terms: ["baptisia", "wild indigo"] },
  { label: "Rattlesnake master", plural: "Rattlesnake master", terms: ["rattlesnake master"] },
  { label: "Silphium", plural: "Silphiums", terms: ["silphium", "cup plant", "rosinweed"] },
  { label: "Golden ragwort", plural: "Golden ragwort", terms: ["ragwort"] },
  { label: "Golden Alexanders", plural: "Golden Alexanders", terms: ["golden alexanders"] },
  { label: "Trillium", plural: "Trilliums", terms: ["trillium"] },
  { label: "Mayapple", plural: "Mayapples", terms: ["mayapple"] },
  { label: "Bloodroot", plural: "Bloodroot", terms: ["bloodroot"] },
  { label: "Hydrangea", plural: "Hydrangeas", terms: ["hydrangea"] },
  { label: "Beautyberry", plural: "Beautyberries", terms: ["beautyberry"] },
  { label: "Witch hazel", plural: "Witch hazels", terms: ["witch hazel"] },
  { label: "Dogwood", plural: "Dogwoods", terms: ["dogwood"] },
  { label: "Viburnum", plural: "Viburnums", terms: ["viburnum"] },
  { label: "Ninebark", plural: "Ninebarks", terms: ["ninebark"] },
  { label: "Smokebush", plural: "Smokebushes", terms: ["smokebush"] },
  { label: "Weigela", plural: "Weigelas", terms: ["weigela"] },
  { label: "Beautybush", plural: "Beautybushes", terms: ["beautybush"] },
  { label: "Forsythia", plural: "Forsythias", terms: ["forsythia"] },
  { label: "Lilac", plural: "Lilacs", terms: ["lilac"] },
  { label: "Boxwood", plural: "Boxwoods", terms: ["boxwood"] },
  { label: "Rose of Sharon", plural: "Rose of Sharon", terms: ["rose of sharon"] },
  { label: "Rose", plural: "Roses", terms: ["rose"], excludes: ["rose of sharon"] },
  { label: "Arborvitae", plural: "Arborvitae", terms: ["arborvitae", "thuja"] },
  { label: "Wax myrtle", plural: "Wax myrtles", terms: ["wax myrtle", "bayberry"] },
  { label: "Privet", plural: "Privets", terms: ["privet"] },
  { label: "Yew", plural: "Yews", terms: ["yew"] },
  { label: "Spicebush", plural: "Spicebush", terms: ["spicebush"] },
  { label: "Sumac", plural: "Sumacs", terms: ["sumac"] },
  { label: "Fothergilla", plural: "Fothergillas", terms: ["fothergilla"] },
  { label: "Summersweet", plural: "Summersweets", terms: ["summersweet", "clethra"] },
  { label: "Sweetspire", plural: "Sweetspires", terms: ["sweetspire", "itea"] },
  { label: "Buttonbush", plural: "Buttonbushes", terms: ["buttonbush"] },
  { label: "Groundsel bush", plural: "Groundsel bushes", terms: ["groundsel"] },
  { label: "Holly", plural: "Hollies", terms: ["holly"] },
  { label: "Inkberry", plural: "Inkberries", terms: ["inkberry"] },
  { label: "Crape myrtle", plural: "Crape myrtles", terms: ["crape myrtle", "crepe myrtle"] },
  { label: "Redbud", plural: "Redbuds", terms: ["redbud"] },
  { label: "Magnolia", plural: "Magnolias", terms: ["magnolia"] },
  { label: "Cryptomeria", plural: "Cryptomeria", terms: ["cryptomeria"] },
  { label: "Red cedar", plural: "Red cedars", terms: ["red cedar"] },
  { label: "Hornbeam", plural: "Hornbeams", terms: ["hornbeam"] },
  { label: "Chaste tree", plural: "Chaste trees", terms: ["chaste tree", "vitex"] },
  { label: "River birch", plural: "River birches", terms: ["river birch"] },
  { label: "Bald cypress", plural: "Bald cypress", terms: ["bald cypress"] },
  { label: "Black gum", plural: "Black gums", terms: ["black gum", "tupelo"] },
  { label: "Maple", plural: "Maples", terms: ["maple"] },
  { label: "Oak", plural: "Oaks", terms: ["oak"] },
  { label: "Little bluestem", plural: "Little bluestem", terms: ["little bluestem"] },
  { label: "Switchgrass", plural: "Switchgrass", terms: ["switchgrass", "panicum"] },
  { label: "Forest grass", plural: "Forest grasses", terms: ["forest grass"] },
  { label: "Feather reed grass", plural: "Feather reed grass", terms: ["feather reed"] },
  { label: "Miscanthus", plural: "Miscanthus", terms: ["miscanthus"] },
  { label: "Bamboo", plural: "Bamboo", terms: ["bamboo", "fargesia"] },
  { label: "Inland sea oats", plural: "Inland sea oats", terms: ["inland sea oats"] },
  { label: "Prairie dropseed", plural: "Prairie dropseed", terms: ["prairie dropseed"] },
  { label: "Side oats grama", plural: "Side oats grama", terms: ["side oats grama"] },
  { label: "Love grass", plural: "Love grasses", terms: ["love grass"] },
  { label: "Sedge", plural: "Sedges", terms: ["sedge"] }
];

function trackEvent(name, params = {}) {
  if (typeof window.plantByZipTrack === "function") {
    window.plantByZipTrack(name, params);
  }
}

function setLandingStarted(started = true) {
  appShellEl?.classList.toggle("has-started", started);
}

function setActiveView(view) {
  tabButtons.forEach((button) => {
    const isActive = button.dataset.view === view;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
  viewPanels.forEach((panel) => {
    const isActive = panel.dataset.viewPanel === view;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
  appShellEl?.setAttribute("data-active-view", view);
  if (view !== "matcher") setLandingStarted(true);
  ensureViewReady(view);
}

async function filterArticles() {
  const query = articleSearchEl.value.trim().toLowerCase();
  if (query) await ensureBlogData();
  let visibleArticles = 0;
  articleCards.forEach((card) => {
    const article = blogSearchData.find((entry) => entry.slug === card.dataset.articleSlug);
    const isMatch = !query || article?.searchableText.includes(query);
    card.hidden = !isMatch;
    if (isMatch) visibleArticles += 1;
  });
  blogEmptyEl.hidden = visibleArticles > 0;
}

async function ensureZoneMapReady() {
  await ensureCoreData();
  if (!zoneMapInitialized) {
    initializeZoneMap();
    zoneMapInitialized = true;
  }
  ensureZoneMapLiveMap();
  queueZoneMapResize();
}

async function ensureCalendarReady() {
  await ensureCoreData();
  if (!calendarInitialized) {
    initializeCalendar();
    calendarInitialized = true;
  }
}

async function ensureScreenerReady() {
  await ensureCoreData();
  if (!screenerInitialized) {
    initializeScreener();
    screenerInitialized = true;
  }
}

async function ensureGardenPlannerReady() {
  await ensureCoreData();
  if (!screenerInitialized) {
    initializeScreener();
    screenerInitialized = true;
  }
  if (!gardenPlannerInitialized) {
    initializeGardenPlanner();
    gardenPlannerInitialized = true;
  }
  renderGardenPlanner();
}

async function ensureViewReady(view) {
  try {
    if (view === "zone-map") await ensureZoneMapReady();
    if (view === "calendar") await ensureCalendarReady();
    if (view === "screener") await ensureScreenerReady();
    if (view === "garden-planner") await ensureGardenPlannerReady();
    if (view === "blog" && articleSearchEl.value.trim()) await filterArticles();
  } catch (error) {
    console.warn("Plant by ZIP data could not load", error);
    if (view === "calendar") calendarStatusEl.textContent = "Plant data could not load. Refresh and try again.";
    if (view === "screener") screenerSummaryEl.textContent = "Plant data could not load. Refresh and try again.";
    if (view === "garden-planner" && gardenPlannerTableEl) {
      gardenPlannerTableEl.innerHTML = `<div class="garden-planner-empty"><strong>Plant data could not load.</strong><span>Refresh and try again.</span></div>`;
    }
    if (view === "zone-map") zoneMapStatusEl.textContent = "Plant data could not load. Refresh and try again.";
  }
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const view = button.dataset.view;
    if (view === "calendar") syncCalendarZipFromMatcher();
    if (view === "zone-map") syncZoneMapZipFromMatcher();
    setActiveView(view);
    const viewHash = { blog: "#blog", calendar: "#calendar", screener: "#screener", "garden-planner": "#garden-planner", "zone-map": "#zone-map" };
    const hash = viewHash[view] ?? window.location.pathname;
    history.replaceState(null, "", hash);
    trackEvent(view === "calendar" ? "calendar_view" : "tool_tab_view", { tool: view, source: "tab" });
  });
});

articleSearchEl.addEventListener("input", () => {
  filterArticles();
});
const initialParams = new URLSearchParams(window.location.search);
const initialBlogQuery = initialParams.get("q");
const hasInitialScreenerQuery = screenerParamKeys.some((key) => initialParams.has(key));
const hasInitialMatcherQuery = matcherParamKeys.some((key) => initialParams.has(key));
const initialWantsScreener = hasInitialScreenerQuery || window.location.hash === "#screener" || window.location.hash === "#screener-view";
const initialWantsGardenPlanner = window.location.hash === "#garden-planner" || window.location.hash === "#garden-planner-view";
const initialWantsCalendar = window.location.hash === "#calendar" || window.location.hash === "#calendar-view";
const initialWantsZoneMap = window.location.hash === "#zone-map" || window.location.hash === "#zone-map-view";
const initialWantsBlog = Boolean(initialBlogQuery) || window.location.hash === "#blog" || window.location.hash === "#blog-view";
const initialWantsMatcher = hasInitialMatcherQuery && !initialWantsScreener && !initialWantsGardenPlanner && !initialWantsCalendar && !initialWantsZoneMap && !initialWantsBlog;
if (initialBlogQuery) {
  articleSearchEl.value = initialBlogQuery;
  filterArticles();
}
if (initialWantsScreener) {
  setActiveView("screener");
} else if (initialWantsGardenPlanner) {
  setActiveView("garden-planner");
} else if (initialWantsCalendar) {
  setActiveView("calendar");
} else if (initialWantsZoneMap) {
  setActiveView("zone-map");
} else if (initialWantsBlog) {
  setActiveView("blog");
}

function zoneToNumber(zone) {
  const match = String(zone).trim().toLowerCase().match(/^(\d{1,2})([ab])$/);
  if (!match) return Number.NaN;
  return Number(match[1]) + (match[2] === "b" ? 0.5 : 0);
}

function readStoredZoneCache() {
  try {
    return JSON.parse(window.localStorage?.getItem(zoneStorageKey) || "{}");
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
    window.localStorage?.setItem(zoneStorageKey, JSON.stringify(Object.fromEntries(entries)));
  } catch (error) {
    // Zone lookup still works without localStorage.
  }
}

function storedZoneForZip(zip) {
  const cached = readStoredZoneCache()[zip];
  return cached?.zone ? cached : null;
}

async function fetchZoneWithTimeout(url) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), zoneLookupTimeoutMs);
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

async function lookupZone(zip) {
  if (zoneCache.has(zip)) return zoneCache.get(zip);
  try {
    const data = await fetchZoneWithTimeout(`https://phzmapi.org/${zip}.json`);
    zoneCache.set(zip, data);
    writeStoredZone(zip, data);
    return data;
  } catch (error) {
    const cached = storedZoneForZip(zip);
    if (cached) {
      zoneCache.set(zip, cached);
      return cached;
    }
    throw error;
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatList(values) {
  return values.map((value) => value.replace("-", " ")).join(", ");
}

function formatGoal(value) {
  return goalLabels[value] ?? legacyGoalLabels[value] ?? value.replaceAll("-", " ");
}

function formatGoalList(values) {
  return values.map(formatGoal).join(", ");
}

function plantPagePath(plant) {
  return `/plants/${plant.id}/`;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function relationshipIdentity(plant) {
  return `${plant.id} ${plant.name} ${plant.query ?? ""} ${plant.type}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function termMatchesIdentity(identity, term) {
  const normalizedTerm = String(term).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  if (!normalizedTerm) return false;
  return new RegExp(`(^|\\s)${escapeRegExp(normalizedTerm)}(\\s|$)`).test(identity);
}

function matchesRelationshipTerms(plant, terms = [], excludes = []) {
  if (!terms.length) return false;
  const identity = relationshipIdentity(plant);
  return terms.some((term) => termMatchesIdentity(identity, term))
    && !excludes.some((term) => termMatchesIdentity(identity, term));
}

function relatedPlantsForRelationship(plant, relationship) {
  const related = new Map();
  if (relationship.plantMatch?.length) {
    if (!matchesRelationshipTerms(plant, relationship.plantMatch, relationship.plantExclude ?? [])) return [];
    plants.forEach((candidate) => {
      if (candidate.id !== plant.id && matchesRelationshipTerms(candidate, relationship.plantMatch, relationship.plantExclude ?? [])) {
        related.set(candidate.id, candidate);
      }
    });
    return Array.from(related.values());
  }

  const isSource = matchesRelationshipTerms(plant, relationship.sourceMatch ?? [], relationship.sourceExclude ?? []);
  const isTarget = matchesRelationshipTerms(plant, relationship.targetMatch ?? [], relationship.targetExclude ?? []);
  plants.forEach((candidate) => {
    if (candidate.id === plant.id) return;
    if (isSource && matchesRelationshipTerms(candidate, relationship.targetMatch ?? [], relationship.targetExclude ?? [])) {
      related.set(candidate.id, candidate);
    }
    if (isTarget && matchesRelationshipTerms(candidate, relationship.sourceMatch ?? [], relationship.sourceExclude ?? [])) {
      related.set(candidate.id, candidate);
    }
  });
  return Array.from(related.values());
}

const relationshipTypeLabels = {
  companion: "Companion",
  guild: "Plant guild",
  understory: "Understory",
  pollination: "Pollination",
  succession: "Succession"
};

function relationshipEntriesForPlant(plant) {
  return plantRelationships
    .map((relationship) => ({
      relationship,
      relatedPlants: relatedPlantsForRelationship(plant, relationship)
    }))
    .filter((entry) => entry.relatedPlants.length > 0);
}

function renderRelationshipPanel(plant) {
  const entries = relationshipEntriesForPlant(plant).slice(0, 3);
  if (!entries.length) return "";
  return `
    <div class="detail-panel relationship-panel">
      <h4>Plant relationships</h4>
      <div class="relationship-list">
        ${entries.map(({ relationship, relatedPlants }) => {
          const visiblePlants = relatedPlants.slice(0, 5);
          const moreCount = relatedPlants.length - visiblePlants.length;
          return `
            <article class="relationship-item">
              <div class="relationship-head">
                <span>${relationshipTypeLabels[relationship.type] ?? sentenceCase(relationship.type)}</span>
                <strong>${sentenceCase(relationship.strength ?? "noted")}</strong>
              </div>
              <p>${relationship.note}</p>
              ${relationship.placement ? `<p class="relationship-action"><strong>Use it:</strong> ${relationship.placement}</p>` : ""}
              <div class="relationship-tags">
                ${visiblePlants.map((relatedPlant) => `<a href="${plantPagePath(relatedPlant)}">${relatedPlant.name}</a>`).join("")}
                ${moreCount > 0 ? `<span>+${moreCount} more</span>` : ""}
              </div>
            </article>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function sentenceCase(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

function plantKind(plant) {
  const type = plant.type.toLowerCase();
  if (type.includes("flower") || type.includes("herb") || type.includes("grass")) return "bloom";
  if (type.includes("vegetable")) return "vegetable";
  if (type.includes("vine")) return "vine";
  if (type.includes("shrub") || type.includes("cane")) return "shrub";
  return "fruit";
}

function plantFormKey(plant) {
  const type = plant.type.toLowerCase();
  if (type.includes("tree") || type === "citrus") return "tree";
  if (type.includes("shrub") || type.includes("cane")) return "shrub";
  if (type.includes("vine")) return "vine";
  if (type.includes("vegetable")) return "vegetable";
  if (type.includes("flower") || type.includes("herb") || type.includes("grass")) return "flowerHerb";
  if (type.includes("cactus")) return "cactus";
  return "fruiting";
}

function summarizeForms(entries) {
  const counts = entries.reduce((summary, entry) => {
    const key = plantFormKey(entry.plant);
    summary[key] = (summary[key] ?? 0) + 1;
    return summary;
  }, {});
  return formOrder
    .filter((key) => counts[key])
    .map((key) => {
      const count = counts[key];
      const labels = formLabels[key];
      return `${count} ${count === 1 ? labels[0] : labels[1]}`;
    })
    .join(", ");
}

function plantIdentity(plant) {
  return `${plant.id} ${plant.name} ${plant.query ?? ""}`.toLowerCase();
}

function matchesArtEntry(identity, entry) {
  const matches = entry.match ?? [];
  const excludes = entry.exclude ?? [];
  return matches.some((term) => identity.includes(term.toLowerCase()))
    && !excludes.some((term) => identity.includes(term.toLowerCase()));
}

function genericArt(plant) {
  const type = plant.type.toLowerCase();
  if (type.includes("flower") || type.includes("herb") || type.includes("grass") || type.includes("ornamental")) return "generic-flower-herb";
  if (type.includes("vegetable")) return "generic-vegetable";
  if (type.includes("vine")) return "generic-vine";
  if (type.includes("tree")) return "generic-tree";
  return "generic-fruit";
}

function plantArtEntry(plant) {
  const identity = plantIdentity(plant);
  return plantArtEntries.find((entry) => matchesArtEntry(identity, entry))
    ?? plantArtById[genericArt(plant)]
    ?? null;
}

function plantPhotoStyle(entry) {
  if (!entry?.image) return "";
  const styles = [
    `--plant-photo: url('/plant-art/${entry.image}')`,
    entry.position ? `--photo-position: ${entry.position}` : "",
    entry.plateBg ? `--plate-bg: ${entry.plateBg}` : ""
  ].filter(Boolean);
  return ` style="${styles.join("; ")}"`;
}

const relationshipCountCache = new Map();

function relationshipCount(plant) {
  if (!relationshipCountCache.has(plant.id)) {
    relationshipCountCache.set(plant.id, relationshipEntriesForPlant(plant).length);
  }
  return relationshipCountCache.get(plant.id);
}

const fruitGroupLabels = new Set([
  "Apples",
  "Pears",
  "Peaches",
  "Plums",
  "Cherries",
  "Figs",
  "Persimmons",
  "Pawpaws",
  "Blueberries",
  "Blackberries",
  "Raspberries",
  "Strawberries",
  "Currants",
  "Gooseberries",
  "Grapes",
  "Kiwi vines",
  "Prickly pears"
]);

function pluralTypeLabel(type) {
  const label = sentenceCase(type);
  if (label.endsWith("s")) return label;
  if (label.endsWith("y")) return `${label.slice(0, -1)}ies`;
  return `${label}s`;
}

function plantGroupLabel(plant) {
  const identity = relationshipIdentity(plant);
  const type = plant.type.toLowerCase();
  const matchedGroups = plantGroupTerms
    .filter((group) => group.terms.some((term) => termMatchesIdentity(identity, term)))
    .filter((group) => {
      if (!fruitGroupLabels.has(group.label)) return true;
      return /fruit|berry|grape|citrus|nut/.test(type);
    });
  if (matchedGroups.length) {
    return matchedGroups
      .sort((a, b) => {
        const aLength = Math.max(...a.terms.map((term) => String(term).length));
        const bLength = Math.max(...b.terms.map((term) => String(term).length));
        return bLength - aLength || a.label.localeCompare(b.label);
      })[0].label;
  }
  return pluralTypeLabel(plant.type);
}

function calendarOptionKey(label) {
  return String(label ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function singularPlantClassLabel(label) {
  const replacements = {
    Apples: "Apple",
    Pears: "Pear",
    Peaches: "Peach",
    Plums: "Plum",
    Cherries: "Cherry",
    Figs: "Fig",
    Persimmons: "Persimmon",
    Pawpaws: "Pawpaw",
    Blueberries: "Blueberry",
    Blackberries: "Blackberry",
    Raspberries: "Raspberry",
    Strawberries: "Strawberry",
    Currants: "Currant",
    Gooseberries: "Gooseberry",
    Grapes: "Grape",
    "Kiwi vines": "Kiwi",
    Beans: "Bean",
    Peas: "Pea",
    Tomatoes: "Tomato",
    Peppers: "Pepper",
    Eggplants: "Eggplant",
    "Root crops": "Root crop",
    "Onions & garlic": "Onion or garlic",
    "Squash & zucchini": "Squash",
    Melons: "Melon",
    Cucumbers: "Cucumber",
    Potatoes: "Potato",
    Milkweeds: "Milkweed",
    Coneflowers: "Coneflower",
    Hydrangeas: "Hydrangea",
    Hollies: "Holly",
    Maples: "Maple",
    Oaks: "Oak"
  };
  if (replacements[label]) return replacements[label];
  if (label.endsWith("ies")) return `${label.slice(0, -3)}y`;
  if (label.endsWith("s") && !label.endsWith("ss")) return label.slice(0, -1);
  return label;
}

function calendarPlantClassForPlant(plant) {
  const identity = relationshipIdentity(plant);
  const type = plant.type.toLowerCase();
  const matchedClass = calendarPlantClassTerms.find((plantClass) => {
    const typeMatches = (plantClass.types ?? []).some((term) => termMatchesIdentity(type, term));
    const matches = typeMatches || plantClass.terms.some((term) => termMatchesIdentity(identity, term));
    const excluded = (plantClass.excludes ?? []).some((term) => termMatchesIdentity(identity, term));
    return matches && !excluded;
  });
  if (matchedClass) {
    return {
      id: calendarOptionKey(matchedClass.label),
      label: matchedClass.label,
      plural: matchedClass.plural ?? pluralTypeLabel(matchedClass.label)
    };
  }
  const plural = plantGroupLabel(plant);
  return {
    id: calendarOptionKey(plural),
    label: singularPlantClassLabel(plural),
    plural
  };
}

function partnerName(value) {
  return partners[value]?.name ?? sentenceCase(String(value ?? "").replaceAll("-", " "));
}

function partnerSearchHref(source, query) {
  if (!source?.searchUrl || !query) return "";
  const url = source.searchUrl.replace("{query}", encodeURIComponent(query));
  const affiliateParam = source.affiliateParam?.replace(/^[?&]/, "");
  if (!affiliateParam) return url;
  return `${url}${url.includes("?") ? "&" : "?"}${affiliateParam}`;
}

function sourceActionForPlant(plant) {
  const name = partnerName(plant.partner);
  if (plant.affiliateUrl) {
    return {
      href: plant.affiliateUrl,
      label: "Affiliate listing",
      rel: "sponsored noopener noreferrer"
    };
  }
  const href = partnerSearchHref(partners[plant.partner], plant.query);
  return href
    ? { href, label: `Search ${name}`, rel: "noopener noreferrer" }
    : null;
}

function productNormalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function productPaddedText(value) {
  const normalized = productNormalizeText(value);
  return normalized ? ` ${normalized} ` : " ";
}

function productTextHasTerm(text, term) {
  const normalizedTerm = productNormalizeText(term);
  if (!normalizedTerm) return false;
  if (text.includes(` ${normalizedTerm} `)) return true;
  if (normalizedTerm.includes(" ")) return false;
  return text.includes(` ${normalizedTerm}s `)
    || text.includes(` ${normalizedTerm}es `);
}

function productTextHasAnyTerm(text, terms = []) {
  return terms.some((term) => productTextHasTerm(text, term));
}

function productListHasAny(list = [], values = []) {
  return values.some((value) => list.includes(value));
}

function productRuleMatchesPlant(rule, plant, metrics, context) {
  if (rule.allPlants !== undefined && rule.allPlants !== true) return false;
  if (rule.goalsAny && !productListHasAny(plant.goals ?? [], rule.goalsAny)) return false;
  if (rule.soilsAny && !productListHasAny(plant.soils ?? [], rule.soilsAny)) return false;
  if (rule.sunAny && !productListHasAny(plant.sun ?? [], rule.sunAny)) return false;
  if (rule.waterAny && !rule.waterAny.includes(plant.water)) return false;
  if (rule.containerSuitabilityAny && !rule.containerSuitabilityAny.includes(metrics.containerSuitability)) return false;
  if (rule.lifeCycleAny && !rule.lifeCycleAny.includes(metrics.lifeCycle)) return false;
  if (rule.outputKindAny && !rule.outputKindAny.includes(metrics.outputKind)) return false;
  if (rule.typeIncludes && !rule.typeIncludes.some((term) => context.type.includes(productNormalizeText(term)))) return false;
  if (rule.identityIncludes && !productTextHasAnyTerm(context.identity, rule.identityIncludes)) return false;
  if (rule.identityExcludes && productTextHasAnyTerm(context.identity, rule.identityExcludes)) return false;
  return true;
}

function productContextForPlant(plant) {
  return {
    identity: productPaddedText([
      plant.id,
      plant.name,
      plant.query,
      plant.type,
      plant.notes,
      ...(plant.traits ?? []),
      ...(plant.goals ?? [])
    ].join(" ")),
    type: productNormalizeText(plant.type)
  };
}

function productScoreForPlant(product, plant) {
  const metrics = metricFor(plant);
  const context = productContextForPlant(plant);
  return Math.max(
    0,
    ...(product.rules ?? [])
      .filter((rule) => productRuleMatchesPlant(rule, plant, metrics, context))
      .map((rule) => rule.score ?? 1)
  );
}

function productById(id) {
  return affiliateProducts.find((product) => product.id === id);
}

function productLink(product, placement, label = "View") {
  if (!product?.affiliateUrl) return "";
  return `
    <a
      href="${escapeHtml(product.affiliateUrl)}"
      target="_blank"
      rel="sponsored noopener noreferrer"
      data-partner-placement="${escapeHtml(placement)}"
      data-product-id="${escapeHtml(product.id)}"
    >${escapeHtml(label)}</a>
  `;
}

function planPlants(plan) {
  const ids = new Set((plan?.plants ?? []).map((plant) => plant.id));
  return plants.filter((plant) => ids.has(plant.id));
}

function productsForPlants(plantsForPlan, limit = 10) {
  if (!affiliateProducts.length || !plantsForPlan.length) return [];
  const summaries = new Map();
  affiliateProducts.forEach((product, index) => {
    plantsForPlan.forEach((plant) => {
      const score = productScoreForPlant(product, plant);
      if (score <= 0) return;
      const existing = summaries.get(product.id) ?? {
        ...product,
        score: 0,
        maxScore: 0,
        index,
        plantNames: []
      };
      existing.score += score;
      existing.maxScore = Math.max(existing.maxScore, score);
      if (existing.plantNames.length < 3 && !existing.plantNames.includes(plant.name)) {
        existing.plantNames.push(plant.name);
      }
      summaries.set(product.id, existing);
    });
  });
  return Array.from(summaries.values())
    .sort((a, b) => b.maxScore - a.maxScore || b.score - a.score || a.index - b.index)
    .slice(0, limit);
}

const calendarSupplyProductIds = {
  indoors: ["seed-starting-trays", "seedling-heat-mat", "grow-light"],
  direct: ["soil-thermometer", "floating-row-cover", "low-tunnel-hoops"],
  transplant: ["hand-trowel", "finished-compost", "floating-row-cover"],
  nursery: ["digging-spade", "organic-mulch", "drip-irrigation-kit"]
};

function calendarSupplyProductsForGroup(group, limit = 3) {
  const ids = [...(calendarSupplyProductIds[group.method] ?? [])];
  const identity = productPaddedText((group.plants ?? [])
    .map((plant) => `${plant.id} ${plant.name} ${plant.type} ${plant.query ?? ""}`)
    .join(" "));
  if (group.season === "fall" || /frost|cold|cool|spring/.test(`${group.action} ${group.notes?.join(" ") ?? ""}`.toLowerCase())) {
    ids.push("frost-blanket", "garden-clips");
  }
  if (productTextHasAnyTerm(identity, ["tomato", "pepper", "eggplant", "cucumber", "melon", "bean"])) {
    ids.push("tomato-cage-stakes", "trellis-netting");
  }
  if (productTextHasAnyTerm(identity, ["tree", "shrub", "berry", "citrus", "fig", "pomegranate"])) {
    ids.push("organic-mulch", "hose-timer");
  }
  return Array.from(new Set(ids))
    .map(productById)
    .filter(Boolean)
    .slice(0, limit);
}

function renderCalendarSupplyLinks(group, limit = 3) {
  const products = calendarSupplyProductsForGroup(group, limit);
  if (!products.length) return "";
  return `
    <div class="calendar-supplies">
      <div>
        <span>Useful supplies</span>
        <small>Sponsored links may earn a commission.</small>
      </div>
      <div class="calendar-supply-links">
        ${products.map((product) => productLink(product, "calendar_action", product.name)).join("")}
      </div>
    </div>
  `;
}

function selectedRadioValue(name) {
  return form.querySelector(`input[name="${name}"]:checked`)?.value ?? matcherDefaults[name] ?? "";
}

function setRadioValue(name, value) {
  const fallback = matcherDefaults[name] ?? "";
  const inputs = Array.from(form.querySelectorAll(`input[name="${name}"]`));
  const requested = inputs.some((input) => input.value === value) ? value : fallback;
  const input = inputs.find((entry) => entry.value === requested);
  if (input) input.checked = true;
}

function matcherPlanParamsFromForm() {
  return {
    zip: zipEl.value.trim(),
    sun: selectedRadioValue("sun"),
    soil: selectedRadioValue("soil"),
    water: selectedRadioValue("water"),
    goal: selectedRadioValue("goal")
  };
}

function normalizedMatcherInputs(zoneData, planParams) {
  const climate = estimateLocationClimate(zoneData);
  const frost = estimateCalendarFrost(zoneData, new Date().getFullYear());
  return {
    zip: planParams.zip,
    zone: zoneData.zone,
    sun: planParams.sun,
    soil: planParams.soil === "not-sure" ? "loam" : planParams.soil,
    water: planParams.water,
    goal: planParams.goal,
    climate,
    frost
  };
}

function applyMatcherPlanParams(planParams) {
  zipEl.value = planParams.zip ?? "";
  setRadioValue("sun", planParams.sun ?? matcherDefaults.sun);
  setRadioValue("soil", planParams.soil ?? matcherDefaults.soil);
  setRadioValue("water", planParams.water ?? matcherDefaults.water);
  setRadioValue("goal", planParams.goal ?? matcherDefaults.goal);
}

function matcherUrlForPlan(planParams) {
  const url = new URL(window.location.href);
  url.search = "";
  matcherParamKeys.forEach((key) => {
    const value = planParams[key];
    if (value && value !== matcherDefaults[key]) url.searchParams.set(key, value);
  });
  if (planParams.zip) url.searchParams.set("zip", planParams.zip);
  url.hash = "";
  return url;
}

function writeMatcherUrl(planParams) {
  const url = matcherUrlForPlan(planParams);
  history.replaceState(null, "", `${url.pathname}${url.search}`);
}

function localRealityNote(zoneData, inputs) {
  const base = zoneData.temperature_range
    ? `USDA average annual extreme minimum: ${zoneData.temperature_range} F. Zone lookup returned coordinates near ${zoneData.coordinates.lat}, ${zoneData.coordinates.lon}.`
    : "Zone lookup succeeded.";
  const checks = ["Confirm drainage, soil pH, and any state invasive restrictions before buying."];
  if (inputs.climate) checks.push(`${inputs.climate.heatZoneLabel} and ${inputs.climate.chillLabel.toLowerCase()} are planning estimates, not station normals.`);
  if (inputs.goal === "fruit") checks.push("For fruit, verify winter chill needs and bloom frost risk by cultivar.");
  if (inputs.goal === "native-plants") checks.push("Native scoring uses current database notes, not county-level native range yet.");
  if (inputs.goal === "vegetables-herbs") checks.push("For direct sowing, soil temperature and the 10-day forecast still matter.");
  return `${base} ${checks.join(" ")}`;
}

async function copyShareText(text) {
  if (navigator.share) {
    try {
      await navigator.share({ title: "Plant by ZIP garden plan", url: text });
      return "Shared";
    } catch (error) {
      if (error?.name === "AbortError") return "";
    }
  }
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return "Copied";
  }
  return "Copy this URL from the address bar";
}

function downloadTextFile(text, filename) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function safeStorageGet(key) {
  try {
    return window.localStorage?.getItem(key) ?? null;
  } catch (error) {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    window.localStorage?.setItem(key, value);
    return true;
  } catch (error) {
    return false;
  }
}

function safeStorageRemove(key) {
  try {
    window.localStorage?.removeItem(key);
  } catch (error) {
    // Local storage can be unavailable in private browsing; clearing is best-effort.
  }
}

function savedPlanDateLabel(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.valueOf())) return "just now";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function savedPlanFileName(plan) {
  const zone = String(plan?.zone ?? "zone").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `plant-by-zip-${zone}-plan.txt`;
}

function currentPlanSnapshot() {
  if (!currentInputs || currentRanked.length === 0) return null;
  return {
    id: `plan-${Date.now()}`,
    savedAt: new Date().toISOString(),
    zone: currentInputs.zone,
    goal: currentInputs.goal,
    sun: currentInputs.sun,
    soil: currentInputs.soil,
    water: currentInputs.water,
    plantCount: currentRanked.length,
    visibleCount,
    plants: currentRanked.slice(0, visibleCount).map((entry, index) => {
      const fit = overallFit(entry.score);
      return {
        id: entry.plant.id,
        name: entry.plant.name,
        type: entry.plant.type,
        fitPercent: fit.percent,
        fitLabel: fit.label,
        url: plantPagePath(entry.plant),
        note: cardSummaryText(entry.plant)
      };
    })
  };
}

function savedPlanText(plan) {
  if (!plan) return "";
  const supplyLines = productsForPlants(planPlants(plan), 8).map((product, index) => (
    `${index + 1}. ${product.name} (${product.category}) - ${product.use}`
  ));
  const header = [
    "Plant by ZIP saved garden plan",
    `Zone ${plan.zone} | ${formatGoal(plan.goal)} | ${sentenceCase(plan.sun)} sun | ${sentenceCase(plan.soil)} soil | ${sentenceCase(plan.water)} water`,
    `Saved ${savedPlanDateLabel(plan.savedAt)}`,
    "",
    "Top plants"
  ];
  const plantLines = (plan.plants ?? []).map((plant, index) => (
    `${index + 1}. ${plant.name} (${plant.fitPercent}% ${plant.fitLabel}) - ${plant.note}`
  ));
  const supplySection = supplyLines.length
    ? ["", "Useful supplies generated from this plan", ...supplyLines]
    : [];
  return [...header, ...plantLines, ...supplySection, "", "Use Plant by ZIP to refresh this plan with your latest ZIP and filters."].join("\n");
}

function renderSavedPlanShopping(plan) {
  if (!savedPlanShoppingEl) return;
  const products = productsForPlants(planPlants(plan), 10);
  if (!products.length) {
    savedPlanShoppingEl.hidden = true;
    savedPlanShoppingEl.innerHTML = "";
    return;
  }
  const grouped = products.reduce((groups, product) => {
    const category = product.category || "Supplies";
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category).push(product);
    return groups;
  }, new Map());
  savedPlanShoppingEl.hidden = false;
  savedPlanShoppingEl.innerHTML = `
    <div class="saved-plan-shopping-head">
      <div>
        <p class="eyebrow">Supplies for this plan</p>
        <h4 id="saved-plan-shopping-title">A practical shopping list</h4>
      </div>
      <p>Generated from the plants in this saved list. Product links are separate from plant rankings and may earn a commission.</p>
    </div>
    <div class="saved-plan-shopping-groups">
      ${Array.from(grouped.entries()).map(([category, items]) => `
        <section class="saved-plan-shopping-group" aria-label="${escapeHtml(category)} supplies">
          <h5>${escapeHtml(category)}</h5>
          <ul>
            ${items.map((product) => `
              <li>
                <div>
                  <strong>${escapeHtml(product.name)}</strong>
                  <span>${escapeHtml(product.timing ?? "As needed")}</span>
                  <p>${escapeHtml(product.use)}</p>
                  ${product.plantNames?.length ? `<small>Useful for ${escapeHtml(product.plantNames.join(", "))}</small>` : ""}
                </div>
                ${productLink(product, "saved_plan_shopping", "View")}
              </li>
            `).join("")}
          </ul>
        </section>
      `).join("")}
    </div>
  `;
}

function renderSavedPlanPanel(plan) {
  savedPlan = plan;
  if (!plan) {
    savedPlanPanelEl.hidden = true;
    if (savedPlanShoppingEl) {
      savedPlanShoppingEl.hidden = true;
      savedPlanShoppingEl.innerHTML = "";
    }
    return;
  }
  const plantsForDisplay = plan.plants ?? [];
  savedPlanPanelEl.hidden = false;
  savedPlanTitleEl.textContent = `${formatGoal(plan.goal)} plan for zone ${plan.zone}`;
  savedPlanMetaEl.textContent = `Saved ${savedPlanDateLabel(plan.savedAt)} in this browser. ZIP is not stored.`;
  savedPlanCountEl.textContent = `${plantsForDisplay.length} ${plantsForDisplay.length === 1 ? "plant" : "plants"}`;
  savedPlanListEl.innerHTML = plantsForDisplay.slice(0, 8).map((plant, index) => `
    <li>
      <span>${index + 1}</span>
      <div>
        <a href="${escapeHtml(plant.url)}">${escapeHtml(plant.name)}</a>
        <p>${escapeHtml(plant.fitPercent)}% ${escapeHtml(plant.fitLabel)} / ${escapeHtml(plant.type)}</p>
      </div>
    </li>
  `).join("");
  renderSavedPlanShopping(plan);
  emailPlanStatusEl.textContent = "";
}

function loadSavedPlan() {
  const rawPlan = safeStorageGet(savedPlanStorageKey);
  if (!rawPlan) return null;
  try {
    return JSON.parse(rawPlan);
  } catch (error) {
    safeStorageRemove(savedPlanStorageKey);
    return null;
  }
}

function saveCurrentPlan() {
  const plan = currentPlanSnapshot();
  if (!plan) return false;
  const saved = safeStorageSet(savedPlanStorageKey, JSON.stringify(plan));
  renderSavedPlanPanel(plan);
  trackEvent("save_plan", {
    zone: plan.zone,
    goal: plan.goal,
    plant_count: plan.plantCount,
    visible_count: plan.visibleCount,
    storage_available: saved
  });
  return saved;
}

async function submitEmailPlan(event) {
  event.preventDefault();
  const plan = savedPlan ?? currentPlanSnapshot();
  if (!plan) {
    emailPlanStatusEl.textContent = "Save a plan first.";
    return;
  }
  const email = emailPlanInputEl.value.trim();
  if (!emailPlanInputEl.checkValidity() || !email) {
    emailPlanStatusEl.textContent = "Enter a valid email address.";
    emailPlanInputEl.focus();
    return;
  }

  const endpoint = emailPlanFormEl.dataset.emailEndpoint?.trim();
  const payload = {
    email,
    plan
  };
  trackEvent("email_signup", {
    source: "saved_plan",
    zone: plan.zone,
    goal: plan.goal,
    provider: endpoint ? "endpoint" : "mailto"
  });

  if (endpoint) {
    emailPlanStatusEl.textContent = "Sending...";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Email endpoint failed");
      emailPlanStatusEl.textContent = "Plan sent.";
      emailPlanInputEl.value = "";
    } catch (error) {
      emailPlanStatusEl.textContent = "Email service did not respond. Download or print this plan instead.";
    }
    return;
  }

  const mailto = new URL(`mailto:${email}`);
  mailto.searchParams.set("subject", `Plant by ZIP plan for zone ${plan.zone}`);
  mailto.searchParams.set("body", savedPlanText(plan));
  window.location.href = mailto.toString();
  emailPlanStatusEl.textContent = "Opened your mail app with the saved plan.";
}

function metricFor(plant) {
  return plantMetrics[plant.id] ?? {};
}

function numberFromControl(control) {
  const value = Number(control?.value);
  return Number.isFinite(value) && control?.value !== "" ? value : null;
}

function rangeAverage(min, max) {
  const values = [min, max].filter((value) => Number.isFinite(value));
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function metricMidpoint(metrics, minKey, maxKey) {
  return rangeAverage(metrics[minKey], metrics[maxKey]);
}

function yieldMidpoint(metrics) {
  return metricMidpoint(metrics, "yieldLbsMin", "yieldLbsMax")
    ?? metricMidpoint(metrics, "outputMin", "outputMax");
}

function spacingAreaRange(metrics) {
  const storedMin = Number(metrics.spacingAreaSqFtMin);
  const storedMax = Number(metrics.spacingAreaSqFtMax);
  if (Number.isFinite(storedMin) && Number.isFinite(storedMax) && storedMin > 0 && storedMax > 0) {
    return [Math.min(storedMin, storedMax), Math.max(storedMin, storedMax)];
  }
  const minArea = Number(metrics.spacingPlantFtMin) * Number(metrics.spacingRowFtMin);
  const maxArea = Number(metrics.spacingPlantFtMax) * Number(metrics.spacingRowFtMax);
  if (!Number.isFinite(minArea) || !Number.isFinite(maxArea) || minArea <= 0 || maxArea <= 0) return [null, null];
  return [Math.min(minArea, maxArea), Math.max(minArea, maxArea)];
}

function spacingAreaMidpoint(metrics) {
  const [minArea, maxArea] = spacingAreaRange(metrics);
  return rangeAverage(minArea, maxArea);
}

function densityMidpoint(metrics) {
  const area = spacingAreaMidpoint(metrics);
  if (Number.isFinite(area) && area > 0) return 100 / area;
  return metricMidpoint(metrics, "plantsPer100SqFtMin", "plantsPer100SqFtMax");
}

function matureHeightMidpoint(metrics) {
  return metricMidpoint(metrics, "matureHeightFtMin", "matureHeightFtMax");
}

function yieldPer100SqFt(metrics) {
  const yieldValue = yieldMidpoint(metrics);
  const densityValue = densityMidpoint(metrics);
  if (!Number.isFinite(yieldValue) || !Number.isFinite(densityValue)) return null;
  return yieldValue * densityValue;
}

function firstOutputYears(metrics) {
  return firstOutputSortValue(metrics);
}

function reliabilityAdjustedYield(metrics) {
  const yieldValue = yieldMidpoint(metrics);
  if (!Number.isFinite(yieldValue) || !Number.isFinite(metrics.reliabilityScore)) return null;
  return yieldValue * (metrics.reliabilityScore / 5);
}

function difficultyAdjustedYield(metrics) {
  const yieldValue = yieldMidpoint(metrics);
  if (!Number.isFinite(yieldValue) || !Number.isFinite(metrics.difficultyScore)) return null;
  return yieldValue * ((6 - metrics.difficultyScore) / 5);
}

function containerEfficiency(metrics) {
  const yieldValue = yieldMidpoint(metrics);
  if (!Number.isFinite(yieldValue) || !Number.isFinite(metrics.containerMinGallons) || metrics.containerMinGallons <= 0) return null;
  return yieldValue / metrics.containerMinGallons;
}

function timeToPayoffScore(metrics) {
  const yieldValue = yieldMidpoint(metrics);
  const years = Math.max(firstOutputYears(metrics), 0.25);
  if (!Number.isFinite(yieldValue) || !Number.isFinite(years)) return null;
  return yieldValue / years;
}

function formatCompactNumber(value, digits = 0, fallback = "-") {
  if (!Number.isFinite(value)) return fallback;
  return value.toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0
  });
}

function formatCompactRange(min, max, digits = 1, unit = "", fallback = "-") {
  const hasMin = Number.isFinite(min);
  const hasMax = Number.isFinite(max);
  if (!hasMin && !hasMax) return fallback;
  if (hasMin && hasMax && Math.abs(min - max) < 0.05) {
    return `${formatCompactNumber(min, digits)}${unit}`;
  }
  if (hasMin && hasMax) {
    return `${formatCompactNumber(min, digits)}-${formatCompactNumber(max, digits)}${unit}`;
  }
  return `${formatCompactNumber(hasMin ? min : max, digits)}${unit}`;
}

function averageNumber(values) {
  const numeric = values.filter((value) => Number.isFinite(value));
  if (!numeric.length) return null;
  return numeric.reduce((sum, value) => sum + value, 0) / numeric.length;
}

function sumNumber(values) {
  const numeric = values.filter((value) => Number.isFinite(value));
  if (!numeric.length) return null;
  return numeric.reduce((sum, value) => sum + value, 0);
}

function bestByNumber(entries, reader) {
  return entries.reduce((best, entry) => {
    const value = reader(entry);
    if (!Number.isFinite(value)) return best;
    return !best || value > best.value ? { entry, value } : best;
  }, null);
}

function textForPlant(plant) {
  return [
    plant.id,
    plant.name,
    plant.type,
    plant.query,
    plant.notes,
    plant.harvest,
    ...(plant.traits ?? []),
    ...(plant.goals ?? [])
  ].join(" ").toLowerCase();
}

function textHasAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function deerResistanceValue(metrics) {
  return metrics?.deerResistance ?? "unknown";
}

function deerResistanceLabel(metrics) {
  return metrics?.deerResistanceLabel ?? metrics?.display?.deerResistance ?? "Not rated";
}

function jugloneToleranceValue(metrics) {
  return metrics?.jugloneTolerance ?? "unknown";
}

function jugloneToleranceLabel(metrics) {
  return metrics?.jugloneToleranceLabel ?? metrics?.display?.jugloneTolerance ?? "Not rated";
}

function siteRiskPillTone(kind, value) {
  if (kind === "deer") {
    if (["rarely-damaged", "seldom-damaged"].includes(value)) return "is-positive";
    if (value === "frequently-damaged") return "is-warning";
    if (value === "unknown") return "is-muted";
    return "";
  }
  if (value === "tolerant") return "is-positive";
  if (value === "sensitive") return "is-warning";
  if (value === "unknown") return "is-muted";
  return "";
}

function renderSiteRiskCell(kind, metrics) {
  const value = kind === "deer" ? deerResistanceValue(metrics) : jugloneToleranceValue(metrics);
  const label = kind === "deer" ? deerResistanceLabel(metrics) : jugloneToleranceLabel(metrics);
  const confidence = kind === "deer" ? metrics.deerResistanceConfidence : metrics.jugloneToleranceConfidence;
  const note = kind === "deer" ? metrics.deerResistanceNote : metrics.jugloneToleranceNote;
  const tone = siteRiskPillTone(kind, value);
  return `
    <span class="screener-data-cell" title="${escapeHtml(note ?? "")}">
      <span class="screener-pill ${tone}">${escapeHtml(label)}</span>
      <span class="screener-metric-note">${escapeHtml(confidence ? `${sentenceCase(confidence)} confidence` : "Planning cue")}</span>
    </span>
  `;
}

function screeningProfile(plant, metrics = metricFor(plant)) {
  const text = textForPlant(plant);
  const isFruitTree = plant.type.includes("fruit tree");
  const isTree = plant.type.includes("tree");
  const isShrub = plant.type.includes("shrub");
  const isVine = plant.type.includes("vine") || textHasAny(text, ["grape", "kiwi", "passionfruit", "cucumber", "melon", "watermelon"]);
  const isAnnualVeg = plant.type.includes("annual vegetable");
  const acidLovers = ["blueberry", "cranberry", "lingonberry", "huckleberry", "azalea", "rhododendron"];
  const alkalineTolerant = ["lavender", "rosemary", "thyme", "sage", "salvia", "yarrow"];
  const storageCrops = ["garlic", "onion", "shallot", "potato", "sweet potato", "winter squash", "pumpkin", "rutabaga", "parsnip"];
  const coolSeason = ["lettuce", "spinach", "kale", "collard", "broccoli", "cabbage", "cauliflower", "pea", "radish", "turnip", "arugula", "bok choy", "mustard"];
  const heatLovers = ["okra", "pepper", "eggplant", "tomato", "sweet potato", "melon", "watermelon", "cucumber", "pomegranate", "fig", "citrus"];
  const diseaseWatch = ["peach", "nectarine", "apple", "pear", "tomato", "cucumber", "squash", "melon", "watermelon", "grape", "rose", "phlox", "bee balm"];
  const pestWatch = ["brassica", "broccoli", "cabbage", "cauliflower", "kale", "collard", "eggplant", "potato", "cucumber", "squash", "melon", "tomato"];
  const spreadWatch = ["mint", "bamboo", "comfrey", "horseradish", "maypop", "passionfruit", "blackberry", "raspberry"];

  const ph = textHasAny(text, acidLovers)
    ? "Acidic 4.5-5.5"
    : textHasAny(text, alkalineTolerant)
      ? "Neutral-alkaline 6.5-8.0"
      : text.includes("potato")
        ? "Slightly acidic 5.0-6.5"
        : "Near-neutral 6.0-7.0";

  const pollination = textHasAny(text, ["apple", "pear", "plum", "sweet cherry", "blueberry", "elderberry", "hazelnut", "pecan", "chestnut"])
    ? "Partner often needed"
    : textHasAny(text, ["fig", "pomegranate", "peach", "nectarine", "sour cherry", "apricot", "tomato", "pepper", "eggplant", "bean", "pea"])
      ? "Usually self-fruitful"
      : isFruitTree || plant.type.includes("nut")
        ? "Verify cultivar"
        : isAnnualVeg
          ? "Mostly self/insect set"
          : "Not a primary filter";

  const support = textHasAny(text, ["tomato", "pepper", "eggplant"])
    ? "Stake/cage useful"
    : textHasAny(text, ["blackberry", "raspberry", "grape", "kiwi", "cucumber", "pea", "bean"])
      ? "Trellis useful"
      : isVine
        ? "Support likely"
        : isTree
          ? "Stake while young"
          : "Usually none";

  const deer = deerResistanceLabel(metrics);
  const juglone = jugloneToleranceLabel(metrics);

  const pestPressure = textHasAny(text, pestWatch)
    ? "Elevated"
    : textHasAny(text, ["lavender", "rosemary", "thyme", "sage", "yarrow", "ornamental grass"])
      ? "Lower"
      : "Moderate";

  const diseasePressure = textHasAny(text, diseaseWatch)
    ? "Elevated"
    : metrics.riskLevel === "lower"
      ? "Lower"
      : "Moderate";

  const chill = textHasAny(text, ["apple", "pear", "cherry"])
    ? "500-900 chill hrs"
    : textHasAny(text, ["peach", "nectarine", "apricot", "plum"])
      ? "400-900 chill hrs"
      : textHasAny(text, ["blueberry", "blackberry", "raspberry"])
        ? "200-700 chill hrs"
        : textHasAny(text, ["fig", "pomegranate", "citrus", "olive", "loquat"])
          ? "Low chill"
          : "Not central";

  const heat = textHasAny(text, heatLovers)
    ? "High heat OK"
    : textHasAny(text, coolSeason)
      ? "Heat sensitive"
      : "Moderate";

  const storage = textHasAny(text, storageCrops)
    ? "Stores well"
    : textHasAny(text, ["berry", "strawberry", "raspberry", "blackberry", "tomato", "fig", "peach", "nectarine", "apricot"])
      ? "Short shelf life"
      : metrics.outputKind === "ornamental"
        ? "Not a harvest crop"
        : "Use fresh";

  const warning = textHasAny(text, spreadWatch)
    ? "Can spread"
    : textHasAny(text, ["privet", "burning bush", "barberry", "nandina"])
      ? "Check local invasive status"
      : "No broad warning";

  return {
    ph,
    pollination,
    support,
    deer,
    juglone,
    pestPressure,
    diseasePressure,
    chill,
    heat,
    storage,
    warning,
    confidence: "Screening cue"
  };
}

function metricDisplayValue(value, fallback = "Not available yet") {
  return value && value !== "Needs source" ? value : fallback;
}

function firstOutputSortValue(metrics) {
  if (metrics.firstYieldYearsMax === 0) return (metrics.daysToMaturityMax ?? 365) / 365;
  return metrics.firstYieldYearsMax ?? 999;
}

function spacingSortValue(metrics) {
  const plantSpacing = metrics.spacingPlantFtMax ?? metrics.spacingPlantFtMin ?? 999;
  const rowSpacing = metrics.spacingRowFtMax ?? metrics.spacingRowFtMin ?? plantSpacing;
  return plantSpacing * rowSpacing;
}

function outputSortValue(metrics) {
  return metrics.yieldLbsMax ?? metrics.outputMax ?? -1;
}

function hasNativeCue(plant) {
  const text = [plant.name, plant.type, plant.notes, plant.query, ...(plant.traits ?? [])]
    .join(" ")
    .toLowerCase();
  return plant.goals.includes("low-maintenance-natives")
    || (/\bnative\b/.test(text) && !/\bnon[-\s]?native\b/.test(text));
}

function hasLowWaterCue(plant) {
  return plant.water === "low";
}

function goalMatchesPlant(plant, goal) {
  if (goal === "native-plants") return hasNativeCue(plant);
  return plant.goals.includes(goal);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const calendarDayMs = 24 * 60 * 60 * 1000;
const calendarMonthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const calendarMethodLabels = {
  indoors: "Start indoors",
  direct: "Direct sow",
  transplant: "Transplant",
  nursery: "Nursery stock"
};
const calendarPresetPrefix = "preset:";
const calendarPlantSetPresets = [
  { id: "kitchen", label: "Kitchen garden" },
  { id: "fruit", label: "Fruit and berries" },
  { id: "pollinator", label: "Pollinator plants" },
  { id: "native", label: "Native flags" },
  { id: "containers", label: "Container-friendly" },
  { id: "quick", label: "Quick harvest" }
];
const calendarMethodOrder = { indoors: 1, direct: 2, transplant: 3, nursery: 4 };
const calendarUrgencyLabels = {
  active: "This week",
  week: "This week",
  soon: "Next 30 days",
  later: "Coming up"
};
const calendarSoilTempGuidance = {
  "warm-transplant": "Soil target: 60F+ before transplanting.",
  "warm-direct": "Soil target: 60F+ for reliable germination.",
  "cool-direct": "Soil target: 45-75F; avoid hot soil for fall sowing.",
  "cool-transplant": "Soil target: 45-65F for steady establishment.",
  potato: "Soil target: 45-55F and workable.",
  garlic: "Soil target: cooling fall soil before freeze-up.",
  "annual-flower": "Soil target: 60F+ after frost risk drops.",
  "tender-container": "Soil target: warm containers and mild nights.",
  woody: "Soil target: workable soil, not frozen or waterlogged.",
  perennial: "Soil target: 45-70F for root establishment.",
  nursery: "Soil target: workable soil; follow nursery directions."
};
const calendarFormLabels = {
  tree: "Tree",
  shrub: "Shrub",
  vine: "Vine",
  vegetable: "Veg",
  flowerHerb: "Flower/herb",
  cactus: "Cactus",
  fruiting: "Fruit"
};
const calendarFrostAnchors = [
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
const calendarTermSets = {
  warmTransplant: ["tomato", "pepper", "eggplant", "tomatillo", "basil"],
  warmDirect: ["bean", "corn", "cucumber", "squash", "zucchini", "pumpkin", "melon", "watermelon", "cantaloupe", "okra", "cowpea", "edamame", "sweet potato"],
  shortIndoorWarm: ["cucumber", "squash", "zucchini", "pumpkin", "melon", "watermelon", "cantaloupe", "okra"],
  coolDirect: ["lettuce", "spinach", "arugula", "mizuna", "radish", "carrot", "beet", "turnip", "daikon", "pea", "cilantro", "dill", "mustard", "bok choy", "pak choi"],
  coolTransplant: ["broccoli", "cabbage", "cauliflower", "kale", "collards", "chard", "brussels", "parsley", "onion", "leek", "celery"],
  potato: ["potato"],
  garlic: ["garlic"],
  tenderContainer: ["citrus", "kumquat", "calamondin", "yuzu", "mandarin", "orange tree", "lemon tree", "lime tree", "banana", "dragon fruit"]
};
const heatZoneThresholds = [
  { zone: 1, min: 0, max: 0 },
  { zone: 2, min: 1, max: 7 },
  { zone: 3, min: 8, max: 14 },
  { zone: 4, min: 15, max: 30 },
  { zone: 5, min: 31, max: 45 },
  { zone: 6, min: 46, max: 60 },
  { zone: 7, min: 61, max: 90 },
  { zone: 8, min: 91, max: 120 },
  { zone: 9, min: 121, max: 150 },
  { zone: 10, min: 151, max: 180 },
  { zone: 11, min: 181, max: 210 },
  { zone: 12, min: 211, max: 366 }
];
const climateHeatRuleSets = [
  {
    preference: "cool",
    label: "cool-summer leaning",
    terms: ["rhubarb", "honeycrisp", "cox orange", "montmorency", "bing cherry", "rainier", "sweet cherry", "tart cherry", "northern highbush", "duke blueberry", "bluecrop", "raspberry", "currant", "gooseberry", "honeyberry", "lilac", "hosta", "astilbe", "peony"],
    excludes: ["cherry belle", "cornelian cherry", "cherry laurel", "miss kim"]
  },
  {
    preference: "cool-season",
    label: "cool-season crop",
    terms: ["lettuce", "spinach", "arugula", "mizuna", "cilantro", "pea", "radish", "turnip", "kale", "collard", "broccoli", "cauliflower", "cabbage"]
  },
  {
    preference: "hot",
    label: "heat lover",
    terms: ["fig", "pomegranate", "jujube", "persimmon", "okra", "sweet potato", "eggplant", "pepper", "watermelon", "cantaloupe", "melon", "muscadine", "citrus", "kumquat", "calamondin", "yuzu", "mandarin", "orange tree", "lemon tree", "lime tree", "prickly pear", "olive", "guava", "dragon fruit", "starfruit", "sapodilla"],
    excludes: ["lemon basil", "lemon cucumber", "lemon thyme", "lemon balm", "lemongrass"]
  },
  {
    preference: "warm",
    label: "warm-season crop",
    terms: ["tomato", "bean", "corn", "cucumber", "squash", "zucchini", "basil", "zinnia", "sunflower", "crape myrtle", "vitex", "southern pear", "rabbiteye blueberry", "flordaking", "anna apple", "ein shemer", "dorsett golden"]
  }
];
const climateChillRuleSets = [
  {
    label: "very low chill",
    min: 100,
    max: 350,
    terms: ["anna apple", "ein shemer", "dorsett golden", "flordaking", "sunshine blue", "beauty plum"],
    note: "bred or selected for mild-winter fruiting"
  },
  {
    label: "low to moderate chill",
    min: 300,
    max: 650,
    terms: ["rabbiteye blueberry", "brightwell", "tifblue", "premier blueberry", "powderblue", "southern highbush", "kieffer pear", "ayers pear", "orient pear", "pineapple quince"],
    note: "usually better in warm-winter fruit regions than northern cultivars"
  },
  {
    label: "high chill",
    min: 800,
    max: 1200,
    terms: ["honeycrisp", "cox orange", "duke northern highbush", "bluecrop", "montmorency", "bing cherry", "rainier", "balaton", "damson", "mount royal", "rhubarb", "lilac"],
    excludes: ["miss kim"],
    note: "needs a real winter to flower or crop reliably"
  },
  {
    label: "moderate chill",
    min: 500,
    max: 900,
    terms: ["apple", "pear", "peach", "plum", "cherry", "apricot", "nectarine", "blueberry"],
    excludes: ["low chill", "rabbiteye", "southern highbush", "sunshine blue", "anna apple", "ein shemer", "dorsett golden", "flordaking", "beauty plum", "chickasaw", "prickly pear", "cornelian cherry", "cherry laurel", "cherry belle"],
    note: "cultivar-specific chill matters"
  }
];
const humidDiseaseTerms = ["apple", "peach", "pear", "plum", "cherry", "apricot", "grape", "rose", "tomato", "blueberry"];
const zoneMapRegions = [
  {
    id: "pacific",
    label: "Pacific coast",
    range: "8a-10b",
    style: "--x: 8%; --y: 27%; --w: 13%; --h: auto;",
    summary: "Marine air, fog, slope, and summer-dry soil can matter more than the printed USDA zone.",
    checks: ["Use Sunset or local coastal guidance for ornamentals.", "Verify chill hours before buying fruit trees.", "Plan irrigation even where winter rainfall is generous."]
  },
  {
    id: "mountain-west",
    label: "Mountain West",
    range: "3a-7b",
    style: "--x: 26%; --y: 28%; --w: 16%; --h: auto;",
    summary: "Elevation, wind, snow cover, and late spring freezes create sharp local differences.",
    checks: ["Favor cold-hardy roots and wind-tolerant structure.", "Treat valley floors and slopes as different gardens.", "Use short-season vegetables unless your frost window is proven."]
  },
  {
    id: "desert-southwest",
    label: "Desert Southwest",
    range: "8a-11a",
    style: "--x: 21%; --y: 64%; --w: 18%; --h: auto;",
    summary: "Warm winter zones do not mean easy growing; heat, alkaline soil, and irrigation drive success.",
    checks: ["Low-water plants still need establishment water.", "Use afternoon shade for many edibles.", "Check salt, pH, and drainage before planting fruit."]
  },
  {
    id: "plains",
    label: "Plains",
    range: "3b-8a",
    style: "--x: 45%; --y: 35%; --w: 13%; --h: auto;",
    summary: "Wind, drought swings, hail, and fast temperature changes make hardiness margins important.",
    checks: ["Mulch and wind protection often matter as much as zone.", "Choose drought- and cold-tolerant woody plants.", "Time transplants around wind and hardening-off, not just frost."]
  },
  {
    id: "midwest",
    label: "Midwest / Great Lakes",
    range: "4a-7a",
    style: "--x: 62%; --y: 31%; --w: 16%; --h: auto;",
    summary: "Winter lows are useful, but freeze-thaw cycles, wet spring soil, and lake effects complicate timing.",
    checks: ["Wait for workable soil before direct sowing.", "Use disease-resistant fruit cultivars in humid summers.", "Watch late frost pockets around bloom time."]
  },
  {
    id: "northeast",
    label: "Northeast",
    range: "3b-7b",
    style: "--x: 78%; --y: 24%; --w: 14%; --h: auto;",
    summary: "Shorter seasons, snow cover, and coastal moderation can change the real garden window.",
    checks: ["Use frost dates for vegetables and bloom risk.", "Protect broadleaf evergreens from winter wind.", "Match fruit cultivars to chill and disease pressure."]
  },
  {
    id: "mid-atlantic",
    label: "Mid-Atlantic / Appalachia",
    range: "5b-8a",
    style: "--x: 75%; --y: 47%; --w: 16%; --h: auto;",
    summary: "Elevation and humidity can move a garden from easy to difficult within a few miles.",
    checks: ["Drainage and airflow are key for fruit and roses.", "Use native-range checks for habitat plantings.", "Account for mountain frost pockets before tender crops."]
  },
  {
    id: "southeast",
    label: "Southeast",
    range: "7a-9a",
    style: "--x: 65%; --y: 63%; --w: 15%; --h: auto;",
    summary: "The USDA zone is often less limiting than heat, humidity, disease pressure, and low chill.",
    checks: ["Choose low-chill fruit cultivars where winters are mild.", "Prioritize disease resistance and airflow.", "Use spring and fall as prime vegetable seasons."]
  },
  {
    id: "gulf-florida",
    label: "Gulf & Florida",
    range: "8b-11b",
    style: "--x: 58%; --y: 69%; --w: 18%; --h: auto;",
    summary: "Rare freezes still happen, but warm nights, rainfall timing, and low chill drive many decisions.",
    checks: ["Plan freeze protection for tender perennials.", "Treat cool-season vegetables as winter crops.", "Verify chill needs before buying peaches, apples, or blueberries."]
  },
  {
    id: "alaska",
    label: "Alaska",
    range: "1a-8b",
    style: "--x: 8%; --y: 79%; --w: 13%; --h: auto;",
    summary: "Day length, snow cover, and microclimate can matter as much as the hardiness label.",
    checks: ["Use local extension calendars for vegetables.", "Favor very hardy perennials and shrubs.", "Protect roots from freeze-thaw and winter desiccation."]
  },
  {
    id: "hawaii-pr",
    label: "Hawaii / Caribbean",
    range: "10a-13b",
    style: "--x: 29%; --y: 82%; --w: 14%; --h: auto;",
    summary: "USDA zones mostly confirm frost is rare; rainfall, elevation, wind, and salt exposure decide the garden.",
    checks: ["Use local tropical crop guidance.", "Map wet and dry sides separately.", "Match plants to rainfall, salt, and elevation."]
  }
];
const zoneMapZoneIds = Array.from({ length: 13 }, (_, index) => index + 1)
  .flatMap((zone) => ["a", "b"].map((suffix) => `${zone}${suffix}`));

function syncCalendarZipFromMatcher() {
  const suggestedZip = currentInputs?.zip ?? zipEl.value.trim();
  if (/^\d{5}$/.test(suggestedZip) && !calendarZipEl.value.trim()) {
    calendarZipEl.value = suggestedZip;
  }
}

function syncZoneMapZipFromMatcher() {
  const suggestedZip = currentInputs?.zip || zipEl.value.trim() || calendarZipEl.value.trim();
  if (/^\d{5}$/.test(suggestedZip) && !zoneMapZipEl.value.trim()) {
    zoneMapZipEl.value = suggestedZip;
  }
}

function startOfCalendarDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function addCalendarDays(date, days) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return startOfCalendarDay(copy);
}

function calendarDateFromDay(year, dayOfYear) {
  const date = new Date(year, 0, 1);
  date.setDate(Math.round(dayOfYear));
  return startOfCalendarDay(date);
}

function calendarDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function calendarYearStart() {
  return startOfCalendarDay(new Date(calendarDisplayYear, 0, 1));
}

function calendarYearEnd() {
  return startOfCalendarDay(new Date(calendarDisplayYear, 11, 31));
}

function formatCalendarDate(date) {
  return `${calendarMonthLabels[date.getMonth()]} ${date.getDate()}`;
}

function formatCalendarWindow(start, end) {
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  if (calendarDateKey(start) === calendarDateKey(end)) return formatCalendarDate(start);
  if (sameMonth) return `${calendarMonthLabels[start.getMonth()]} ${start.getDate()}-${end.getDate()}`;
  return `${formatCalendarDate(start)} - ${formatCalendarDate(end)}`;
}

function calendarRangeOverlaps(start, end, filterStart, filterEnd) {
  return start <= filterEnd && end >= filterStart;
}

function calendarPercentForDate(date) {
  const yearStart = calendarYearStart();
  const yearEnd = calendarYearEnd();
  return clamp(((startOfCalendarDay(date) - yearStart) / (yearEnd - yearStart)) * 100, 0, 100);
}

function calendarBarGeometry(start, end) {
  const yearStart = calendarYearStart();
  const yearEnd = calendarYearEnd();
  const clippedStart = start < yearStart ? yearStart : start;
  const clippedEnd = end > yearEnd ? yearEnd : end;
  const left = calendarPercentForDate(clippedStart);
  const right = calendarPercentForDate(clippedEnd);
  return {
    left,
    width: Math.max(1.2, right - left)
  };
}

function calendarToday() {
  return startOfCalendarDay(new Date());
}

function calendarTodayPercent() {
  const today = calendarToday();
  if (today < calendarYearStart() || today > calendarYearEnd()) return null;
  return calendarPercentForDate(today);
}

function identityMatchesAny(identity, terms = [], excludes = []) {
  return terms.some((term) => termMatchesIdentity(identity, term))
    && !excludes.some((term) => termMatchesIdentity(identity, term));
}

function isPacificCoastal(lat, lon) {
  return Number.isFinite(lat) && Number.isFinite(lon) && lon <= -117 && lat >= 32 && lat <= 49;
}

function isDesertSouthwest(lat, lon) {
  return Number.isFinite(lat) && Number.isFinite(lon) && lon <= -103 && lat <= 38;
}

function heatZoneFromDays(days) {
  return heatZoneThresholds.find((entry) => days >= entry.min && days <= entry.max)?.zone ?? 12;
}

function heatDaysRange(zoneNumber, lat, lon) {
  let mid = 8 + Math.max(0, zoneNumber - 4) * 24;
  if (lat < 32) mid += 18;
  if (lat > 42) mid -= 18;
  if (lat > 46) mid -= 14;
  if (isDesertSouthwest(lat, lon)) mid += 42;
  if (lon < -100 && lon >= -112 && lat < 38) mid += 16;
  if (isPacificCoastal(lat, lon)) mid -= zoneNumber >= 9 ? 88 : 64;
  if (lat < 31 && lon > -100 && lon < -75) mid += 34;
  if (lat >= 32 && lat <= 37 && lon > -96 && lon < -75) mid += 12;
  mid = clamp(Math.round(mid), 0, 230);
  const spread = mid > 150 ? 26 : mid > 80 ? 20 : 14;
  return {
    min: clamp(mid - spread, 0, 230),
    mid,
    max: clamp(mid + spread, 0, 240)
  };
}

function chillHoursRange(zoneNumber, lat, lon, heatDaysMid) {
  let mid = 1620 - zoneNumber * 115;
  if (zoneNumber >= 9.5) mid -= 80;
  if (zoneNumber <= 6) mid += 120;
  if (lat < 31) mid -= 140;
  if (lat > 42) mid += 120;
  if (isPacificCoastal(lat, lon)) mid -= 160;
  if (isDesertSouthwest(lat, lon)) mid += 60;
  if (heatDaysMid > 150) mid -= 80;
  if (heatDaysMid > 200) mid -= 90;
  mid = clamp(Math.round(mid), 80, 1500);
  const spread = mid > 900 ? 220 : mid > 500 ? 170 : 120;
  return {
    min: clamp(mid - spread, 0, 1500),
    mid,
    max: clamp(mid + spread, 0, 1600)
  };
}

function chillLevelForHours(hours) {
  if (hours < 250) return "Very low chill";
  if (hours < 500) return "Low chill";
  if (hours < 800) return "Moderate chill";
  if (hours < 1100) return "High chill";
  return "Very high chill";
}

function moisturePatternFor(lat, lon) {
  if (isDesertSouthwest(lat, lon)) {
    return {
      key: "arid",
      label: "Arid / irrigated",
      note: "Low-water plants still need establishment irrigation; high-water crops need a plan."
    };
  }
  if (isPacificCoastal(lat, lon)) {
    return {
      key: "summer-dry",
      label: "Summer-dry West",
      note: "Winter rain and dry summers make irrigation timing as important as total rainfall."
    };
  }
  if (lon < -100) {
    return {
      key: "semi-arid",
      label: "Semi-arid interior",
      note: "Rainfall is often seasonal or sparse; mulch and drip irrigation change the result."
    };
  }
  if (lat < 31 && lon > -100 && lon < -75) {
    return {
      key: "humid-hot",
      label: "Humid hot-season",
      note: "Humidity and warm nights raise disease pressure even when water is available."
    };
  }
  return {
    key: "humid-mixed",
    label: "Humid / mixed rainfall",
    note: "Rain is usually not the whole water story; drainage and disease pressure still matter."
  };
}

function regionLabelFor(lat, lon) {
  if (isPacificCoastal(lat, lon)) return "Pacific/Sunset-style microclimate";
  if (isDesertSouthwest(lat, lon)) return "Desert or interior West";
  if (lon < -100) return "Interior West / Plains";
  if (lat < 31 && lon > -100 && lon < -75) return "Gulf or subtropical South";
  if (lat > 41 && lon > -100) return "Northern humid region";
  return "Humid temperate region";
}

function estimateLocationClimate(zoneData) {
  const zoneNumber = zoneToNumber(zoneData.zone);
  const coordinates = zoneData.coordinates ?? {};
  const lat = Number(coordinates.lat ?? coordinates.latitude ?? zoneData.latitude);
  const lon = Number(coordinates.lon ?? coordinates.lng ?? coordinates.longitude ?? zoneData.longitude);
  const heat = heatDaysRange(zoneNumber, lat, lon);
  const chill = chillHoursRange(zoneNumber, lat, lon, heat.mid);
  const heatZone = heatZoneFromDays(heat.mid);
  const moisture = moisturePatternFor(lat, lon);
  return {
    zoneNumber,
    lat,
    lon,
    regionLabel: regionLabelFor(lat, lon),
    westernClimateCritical: Number.isFinite(lon) && lon <= -105,
    heatDays: heat,
    heatZone,
    heatZoneLabel: `Estimated AHS heat zone ${heatZone}`,
    chillHours: chill,
    chillLabel: chillLevelForHours(chill.mid),
    moistureKey: moisture.key,
    moistureLabel: moisture.label,
    moistureNote: moisture.note
  };
}

function formatNumberRange(range, unit) {
  return `${Math.round(range.min)}-${Math.round(range.max)} ${unit}`;
}

function formatRoundedNumberRange(range, unit, step = 100) {
  const min = Math.max(0, Math.round(range.min / step) * step);
  const max = Math.max(min + step, Math.round(range.max / step) * step);
  return `roughly ${min}-${max} ${unit}`;
}

function frostUncertaintyDays(zoneData) {
  const climate = estimateLocationClimate(zoneData);
  let spread = 14;
  if (climate.westernClimateCritical) spread += 6;
  if (climate.moistureKey === "arid" || climate.moistureKey === "summer-dry") spread += 3;
  if (climate.zoneNumber >= 10) spread += 5;
  return spread;
}

function frostBandFor(date, spread) {
  return {
    p10: addCalendarDays(date, -spread),
    p50: startOfCalendarDay(date),
    p90: addCalendarDays(date, spread)
  };
}

function formatFrostBand(band) {
  return `${formatCalendarDate(band.p50)} likely (${formatCalendarDate(band.p10)}-${formatCalendarDate(band.p90)} usual range)`;
}

function formatPlainFrostRange(band) {
  return `${formatCalendarDate(band.p10)}-${formatCalendarDate(band.p90)}`;
}

function zoneMapTemperatureRange(zone) {
  const match = String(zone).trim().toLowerCase().match(/^(\d{1,2})([ab])$/);
  if (!match) return null;
  const base = -60 + (Number(match[1]) - 1) * 10 + (match[2] === "b" ? 5 : 0);
  return {
    min: base,
    max: base + 5,
    label: `${base} to ${base + 5} F`
  };
}

function zoneMapGuidanceForZone(zone) {
  const zoneNumber = zoneToNumber(zone);
  if (!Number.isFinite(zoneNumber)) {
    return {
      title: "Choose a zone",
      notes: ["Pick a hardiness zone to see its winter-low meaning."]
    };
  }
  if (zoneNumber <= 3.5) {
    return {
      title: "Very cold winter, short season",
      notes: [
        "Prioritize proven cold-hardy perennials, shrubs, and trees.",
        "Start warm-season vegetables indoors and use short-season varieties.",
        "Snow cover, wind exposure, and root protection can decide overwintering."
      ]
    };
  }
  if (zoneNumber <= 5.5) {
    return {
      title: "Cold-temperate garden",
      notes: [
        "USDA hardiness is a strong first filter for woody plants.",
        "Late spring frost still matters for fruit bloom and tender transplants.",
        "Use season extenders for tomatoes, peppers, melons, and other heat lovers."
      ]
    };
  }
  if (zoneNumber <= 7.5) {
    return {
      title: "Long shoulder seasons",
      notes: [
        "Many fruit trees and perennials fit, but bloom frost and disease pressure still matter.",
        "Spring and fall are prime windows for greens, roots, perennials, shrubs, and trees.",
        "Heat load can decide whether cool-season plants behave well through summer."
      ]
    };
  }
  if (zoneNumber <= 9.5) {
    return {
      title: "Mild winter, heat-aware planting",
      notes: [
        "Hardiness is rarely the only limit; summer heat, humidity, or drought often dominate.",
        "Use low-chill fruit cultivars where winters are mild.",
        "Shift many vegetables into fall, winter, and early spring instead of midsummer."
      ]
    };
  }
  return {
    title: "Warm winter or frost-light garden",
    notes: [
      "USDA zone mostly says freezes are limited; rainfall, heat, and local exposure drive success.",
      "Fruit decisions depend heavily on chill hours, humidity, and cultivar selection.",
      "Use shade, irrigation, drainage, and wind exposure as primary design constraints."
    ]
  };
}

function zoneMapRegionForLocation(lat, lon) {
  if (Number.isFinite(lat) && Number.isFinite(lon)) {
    if (lat >= 50 && lon <= -125) return "alaska";
    if (lat <= 23 && (lon <= -145 || lon >= -70)) return "hawaii-pr";
    if (isPacificCoastal(lat, lon)) return "pacific";
    if (isDesertSouthwest(lat, lon)) return "desert-southwest";
    if (lon <= -105) return "mountain-west";
    if (lon <= -95) return "plains";
    if (lat <= 30.5 && lon > -100) return "gulf-florida";
    if (lat <= 37 && lon > -95) return "southeast";
    if (lon >= -83 && lat <= 36) return "southeast";
    if (lon >= -82 && lat >= 39) return "northeast";
    if (lon >= -88 && lat >= 36) return "mid-atlantic";
    if (lon >= -95 && lat >= 39) return "midwest";
  }
  return "southeast";
}

function zoneMapPinPosition(lat, lon, regionId) {
  if (regionId === "alaska") return { x: 28, y: 84 };
  if (regionId === "hawaii-pr") return lon >= -90 ? { x: 71, y: 86 } : { x: 14, y: 79 };
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  const phi1 = 29.5 * Math.PI / 180;
  const phi2 = 45.5 * Math.PI / 180;
  const phi0 = 37.5 * Math.PI / 180;
  const lambda0 = -96 * Math.PI / 180;
  const phi = lat * Math.PI / 180;
  const lambda = lon * Math.PI / 180;
  const n = (Math.sin(phi1) + Math.sin(phi2)) / 2;
  const c = Math.cos(phi1) ** 2 + 2 * n * Math.sin(phi1);
  const rho = Math.sqrt(c - 2 * n * Math.sin(phi)) / n;
  const rho0 = Math.sqrt(c - 2 * n * Math.sin(phi0)) / n;
  const theta = n * (lambda - lambda0);
  const projected = {
    x: rho * Math.sin(theta),
    y: rho0 - rho * Math.cos(theta)
  };
  const bounds = {
    xMin: -0.4624,
    xMax: 0.4778,
    yMin: -0.2358,
    yMax: 0.2558
  };
  return {
    x: clamp(5 + ((projected.x - bounds.xMin) / (bounds.xMax - bounds.xMin)) * 88, 5, 93),
    y: clamp(12 + ((bounds.yMax - projected.y) / (bounds.yMax - bounds.yMin)) * 72, 10, 82)
  };
}

function zoneMapRegionById(id) {
  return zoneMapRegions.find((region) => region.id === id) ?? zoneMapRegions.find((region) => region.id === "mid-atlantic") ?? zoneMapRegions[0];
}

function zoneMapFullZone(zone) {
  const match = String(zone ?? "").trim().toLowerCase().match(/^(\d{1,2})/);
  return match ? match[1] : null;
}

function zoneMapExactOrFullZone(zone) {
  const match = String(zone ?? "").trim().toLowerCase().match(/^(\d{1,2}[ab]?)/);
  return match ? match[1] : null;
}

const zoneMapVectorSymbolToZone = {
  "0": "3a",
  "1": "3b",
  "2": "4a",
  "3": "4b",
  "4": "5a",
  "5": "5b",
  "6": "6a",
  "7": "6b",
  "8": "7a",
  "9": "7b",
  "10": "8a",
  "11": "8b",
  "12": "9a",
  "13": "9b",
  "14": "10a",
  "15": "10b",
  "16": "11a",
  "17": "11b",
  "18": "12a"
};

function zoneMapFullZoneFromProperties(properties = {}) {
  const directZone = zoneMapExactOrFullZone(properties.full_zone ?? properties.fullZone ?? properties.zone);
  if (directZone) return directZone;
  const symbol = properties._symbol ?? properties.symbol;
  return zoneMapVectorSymbolToZone[String(symbol)] ?? null;
}

function zoneMapZoneForFullZone(fullZone) {
  const exactZone = String(fullZone ?? "").trim().toLowerCase();
  if (/^\d{1,2}[ab]$/.test(exactZone) && zoneMapZoneIds.includes(exactZone)) {
    return exactZone;
  }
  const normalized = zoneMapFullZone(fullZone);
  if (!normalized) return zoneMapSelectedZone;
  if (zoneMapZoneData && zoneMapFullZone(zoneMapZoneData.zone) === normalized) {
    return zoneMapZoneData.zone;
  }
  return [`${normalized}b`, `${normalized}a`].find((zone) => zoneMapZoneIds.includes(zone)) ?? zoneMapSelectedZone;
}

function zoneMapFullZoneHex(fullZone) {
  const colors = {
    "1": "#d6d6ff",
    "3a": "#d99ae1",
    "3b": "#c684ce",
    "2": "#ababd9",
    "3": "#e091eb",
    "4a": "#c684ce",
    "4b": "#6a81e1",
    "4": "#a66bff",
    "5a": "#7ca2ed",
    "5b": "#70c5d9",
    "5": "#73a1ff",
    "6a": "#4bb948",
    "6b": "#72c34c",
    "6": "#49ad4a",
    "7a": "#abd76a",
    "7b": "#cddb72",
    "7": "#abd669",
    "8a": "#ebd983",
    "8b": "#e7cc5b",
    "8": "#ede185",
    "9a": "#deb54b",
    "9b": "#f6b678",
    "9": "#debb47",
    "10a": "#eb9c37",
    "10b": "#e6781f",
    "10": "#e58026",
    "11a": "#e75622",
    "11b": "#e78665",
    "11": "#e88e6c",
    "12a": "#d45a4f",
    "12": "#d4594e",
    "13": "#962f1e"
  };
  const zone = String(fullZone ?? "").trim().toLowerCase();
  return colors[zone] ?? colors[zoneMapFullZone(zone)] ?? "#abd669";
}

function zoneMapFullZoneRangeLabel(fullZone) {
  const exactZone = String(fullZone ?? "").trim().toLowerCase();
  const exactRange = zoneMapTemperatureRange(exactZone);
  if (exactRange) return exactRange.label;
  const zoneNumber = Number(zoneMapFullZone(fullZone));
  if (!Number.isFinite(zoneNumber)) return "winter-low range";
  const base = -60 + (zoneNumber - 1) * 10;
  return `${base} to ${base + 10} F`;
}

function zoneMapExactZoneId(zone) {
  const exactZone = zoneMapExactOrFullZone(zone);
  if (!exactZone) return null;
  if (/^\d{1,2}[ab]$/.test(exactZone)) {
    return zoneMapZoneIds.includes(exactZone) ? exactZone : null;
  }
  return [`${exactZone}a`, `${exactZone}b`].find((zoneId) => zoneMapZoneIds.includes(zoneId)) ?? null;
}

function zoneMapPlantRange(plant) {
  if (!plant?.zones?.length) return null;
  const minZone = zoneMapExactZoneId(plant.zones[0]);
  const maxZone = zoneMapExactZoneId(plant.zones[1]);
  const minIndex = zoneMapZoneIds.indexOf(minZone);
  const maxIndex = zoneMapZoneIds.indexOf(maxZone);
  if (minIndex < 0 || maxIndex < 0) return null;
  return {
    minZone,
    maxZone,
    minIndex: Math.min(minIndex, maxIndex),
    maxIndex: Math.max(minIndex, maxIndex)
  };
}

function zoneMapPlantRangeFit(plant, zone) {
  const range = zoneMapPlantRange(plant);
  const zoneId = zoneMapExactZoneId(zone);
  const zoneIndex = zoneMapZoneIds.indexOf(zoneId);
  if (!range || zoneIndex < 0) return "unknown";
  if (zoneIndex < range.minIndex - 1 || zoneIndex > range.maxIndex + 1) return "outside";
  if (zoneIndex < range.minIndex || zoneIndex > range.maxIndex) return "near";
  if (zoneIndex === range.minIndex || zoneIndex === range.maxIndex) return "edge";
  return "core";
}

function zoneMapPlantRangeFitLabel(fit) {
  if (fit === "core") return "strong hardiness fit";
  if (fit === "edge") return "edge of database range";
  if (fit === "near") return "near the listed range";
  if (fit === "outside") return "outside listed range";
  return "range unknown";
}

function zoneMapPlantRangeFitBadge(fit) {
  if (fit === "core") return "Core fit";
  if (fit === "edge") return "Range edge";
  if (fit === "near") return "Near range";
  if (fit === "outside") return "Outside range";
  return "Range unknown";
}

function zoneMapPlantRangeFitNote(fit) {
  if (fit === "core") return "This zone sits inside the plant's database hardiness range.";
  if (fit === "edge") return "This zone is at the cold or warm edge of the listed range.";
  if (fit === "near") return "This zone is one subzone outside the listed range; microclimate matters.";
  if (fit === "outside") return "This zone is outside the listed hardiness range.";
  return "Hardiness fit could not be calculated for this zone.";
}

function zoneMapPlantRangeTooltipDetails(attributes) {
  if (!zoneMapSelectedPlantOverlay) return null;
  const fullZone = zoneMapFullZoneFromProperties(attributes) ?? zoneMapFullZone(attributes?.full_zone);
  if (!fullZone) return null;
  const range = zoneMapPlantRange(zoneMapSelectedPlantOverlay);
  const fit = zoneMapPlantRangeFit(zoneMapSelectedPlantOverlay, fullZone);
  const rangeLabel = range ? `${range.minZone}-${range.maxZone}` : "n/a";
  return {
    fit,
    fullZone,
    rangeLabel,
    plant: zoneMapSelectedPlantOverlay,
    badge: zoneMapPlantRangeFitBadge(fit),
    note: zoneMapPlantRangeFitNote(fit)
  };
}

function zoneMapLayerTooltipContent(attributes) {
  const fullZone = zoneMapFullZoneFromProperties(attributes) ?? zoneMapFullZone(attributes?.full_zone);
  if (!fullZone) return "";
  const trange = attributes?.trange ? `${attributes.trange} F` : zoneMapFullZoneRangeLabel(fullZone);
  const plantDetails = zoneMapPlantRangeTooltipDetails(attributes);
  if (plantDetails) {
    return `
      <span class="zone-map-tooltip-kicker">Plant range overlay</span>
      <strong>${escapeHtml(plantDetails.plant.name)}: ${escapeHtml(plantDetails.badge)}</strong>
      <small>USDA zone ${escapeHtml(plantDetails.fullZone)} | database range ${escapeHtml(plantDetails.rangeLabel)}</small>
      <p>${escapeHtml(plantDetails.note)}</p>
    `;
  }
  return `
    <strong>USDA zone ${escapeHtml(fullZone)}</strong>
    <small>${escapeHtml(trange)} average annual extreme minimum</small>
  `;
}

function zoneMapPlantRangeTileStyle(properties) {
  const fullZone = zoneMapFullZoneFromProperties(properties);
  const fit = zoneMapSelectedPlantOverlay ? zoneMapPlantRangeFit(zoneMapSelectedPlantOverlay, fullZone) : "outside";
  const active = fullZone && zoneMapFullZone(fullZone) === zoneMapFullZone(zoneMapSelectedZone);
  const styles = {
    core: { fillColor: "#1f8f5a", fillOpacity: 0.46, color: "#0f5937", opacity: 0.68, weight: active ? 1.4 : 0.7 },
    edge: { fillColor: "#d0a642", fillOpacity: 0.5, color: "#8c6717", opacity: 0.75, weight: active ? 1.5 : 0.75 },
    near: { fillColor: "#f1d784", fillOpacity: 0.25, color: "#b68424", opacity: 0.5, weight: active ? 1.2 : 0.55 },
    outside: { fillColor: "#ffffff", fillOpacity: 0, color: "#ffffff", opacity: 0, weight: 0 },
    unknown: { fillColor: "#ffffff", fillOpacity: 0, color: "#ffffff", opacity: 0, weight: 0 }
  };
  return {
    fill: true,
    ...styles[fit]
  };
}

function loadStylesheetOnce(id, href) {
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function loadScriptOnce(id, src) {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id);
    if (existing?.dataset.loaded === "true") {
      resolve();
      return;
    }
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(`Could not load ${src}`)), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    }, { once: true });
    script.addEventListener("error", () => reject(new Error(`Could not load ${src}`)), { once: true });
    document.head.appendChild(script);
  });
}

function zoneMapLeafletStyle(feature) {
  const fullZone = zoneMapFullZone(feature?.properties?.full_zone);
  const isActive = fullZone && fullZone === zoneMapFullZone(zoneMapSelectedZone);
  return {
    color: isActive ? "#173820" : "rgba(31, 67, 43, 0.32)",
    weight: isActive ? 1.8 : 0.6,
    fillColor: zoneMapFullZoneHex(fullZone),
    fillOpacity: isActive ? 0.08 : 0.01,
    opacity: isActive ? 0.85 : 0.22
  };
}

function zoneMapVectorTileStyle(properties) {
  const fullZone = zoneMapFullZoneFromProperties(properties);
  const isExactSubzone = /^\d{1,2}[ab]$/.test(fullZone ?? "");
  const isActive = fullZone && (
    isExactSubzone
      ? fullZone === zoneMapSelectedZone
      : zoneMapFullZone(fullZone) === zoneMapFullZone(zoneMapSelectedZone)
  );
  return {
    fill: true,
    fillColor: zoneMapFullZoneHex(fullZone),
    fillOpacity: isActive ? 0.82 : 0.72,
    color: isActive ? "#153721" : "rgba(255, 253, 248, 0.58)",
    opacity: isActive ? 0.78 : 0.42,
    weight: isActive ? 1.2 : 0.45
  };
}

async function loadZoneMapLibraries() {
  if (zoneMapMapModules) return zoneMapMapModules;
  if (!zoneMapLibraryPromise) {
    zoneMapLibraryPromise = (async () => {
      loadStylesheetOnce("plantbyzip-leaflet-css", leafletCssUrl);
      await loadScriptOnce("plantbyzip-leaflet-js", leafletJsUrl);
      await loadScriptOnce("plantbyzip-leaflet-vectorgrid-js", leafletVectorGridJsUrl);
      await loadScriptOnce("plantbyzip-esri-leaflet-js", esriLeafletJsUrl);
      if (!window.L?.vectorGrid?.protobuf || !window.L?.esri?.featureLayer) {
        throw new Error("Leaflet GIS layer loader unavailable.");
      }
      zoneMapMapModules = { L: window.L };
      return zoneMapMapModules;
    })().catch((error) => {
      zoneMapLibraryPromise = null;
      throw error;
    });
  }
  return zoneMapLibraryPromise;
}

function queueZoneMapResize() {
  if (!zoneMapView) return;
  window.setTimeout(() => {
    if (typeof zoneMapView.invalidateSize === "function") zoneMapView.invalidateSize();
  }, 80);
}

function highlightZoneMapFullZone(fullZone) {
  const normalized = zoneMapFullZone(fullZone);
  if (!normalized) return;
  if (zoneMapHardinessLayer && typeof zoneMapHardinessLayer.setStyle === "function") {
    zoneMapHardinessLayer.setStyle(zoneMapLeafletStyle);
  }
  if (zoneMapHardinessTileLayer && typeof zoneMapHardinessTileLayer.redraw === "function") {
    zoneMapHardinessTileLayer.redraw();
  }
  if (zoneMapPlantRangeTileLayer && typeof zoneMapPlantRangeTileLayer.redraw === "function") {
    zoneMapPlantRangeTileLayer.redraw();
  }
}

function renderZoneMapIdentify(attributes, mode = "hover") {
  const fullZone = zoneMapFullZoneFromProperties(attributes) ?? zoneMapFullZone(attributes?.full_zone);
  if (!fullZone || !zoneMapIdentifyEl) return;
  const trange = attributes?.trange ? `${attributes.trange} F` : zoneMapFullZoneRangeLabel(fullZone);
  const lookupZone = zoneMapZoneData && zoneMapFullZone(zoneMapZoneData.zone) === zoneMapFullZone(fullZone)
    ? `Your ZIP lookup refines this to zone ${zoneMapZoneData.zone}.`
    : "Use ZIP lookup to refine the a/b subzone, frost windows, heat, and chill.";
  const plantDetails = zoneMapPlantRangeTooltipDetails(attributes);
  const plantFit = plantDetails
    ? `<p class="zone-map-identify-fit"><b>${escapeHtml(plantDetails.plant.name)}:</b> ${escapeHtml(plantDetails.badge)}. ${escapeHtml(plantDetails.note)}</p>`
    : "";
  zoneMapIdentifyEl.innerHTML = `
    <span>${mode === "click" ? "Selected GIS zone" : "Hovered GIS zone"}</span>
    <strong>USDA zone ${escapeHtml(fullZone)}</strong>
    <small>${escapeHtml(trange)} average annual extreme minimum.</small>
    <p>${escapeHtml(lookupZone)}</p>
    ${plantFit}
  `;
  zoneMapIdentifyEl.hidden = false;
}

function showZoneMapHoverTooltip(attributes, latlng) {
  if (!zoneMapView || !latlng) return;
  const content = zoneMapLayerTooltipContent(attributes);
  if (!content) return;
  const L = zoneMapMapModules?.L ?? window.L;
  if (!L?.tooltip) return;
  if (!zoneMapHoverTooltip) {
    zoneMapHoverTooltip = L.tooltip({
      direction: "top",
      offset: [0, -8],
      opacity: 1,
      sticky: true,
      className: "zone-map-leaflet-tooltip"
    });
  }
  zoneMapHoverTooltip.setContent(content);
  zoneMapHoverTooltip.setLatLng(latlng);
  if (!zoneMapView.hasLayer(zoneMapHoverTooltip)) {
    zoneMapHoverTooltip.addTo(zoneMapView);
  }
}

function hideZoneMapHoverTooltip() {
  if (zoneMapView && zoneMapHoverTooltip && zoneMapView.hasLayer(zoneMapHoverTooltip)) {
    zoneMapView.removeLayer(zoneMapHoverTooltip);
  }
}

function initializeZoneMapPlantOverlayPicker() {
  if (!zoneMapPlantOverlaySelectEl) return;
  const options = plants
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((plant) => {
      const zoneLabel = plant.zones?.length ? `${plant.zones[0]}-${plant.zones[1]}` : "zone range n/a";
      return `<option value="${escapeHtml(plant.id)}">${escapeHtml(plant.name)} (${escapeHtml(zoneLabel)})</option>`;
    })
    .join("");
  zoneMapPlantOverlaySelectEl.innerHTML = `<option value="">No plant selected</option>${options}`;
  renderZoneMapPlantOverlaySummary();
  syncCalendarCombobox(zoneMapPlantOverlayCombo, "Search plants");
}

function setZoneMapPlantRangeOverlay(plantId, source = "picker") {
  zoneMapSelectedPlantOverlay = plants.find((plant) => plant.id === plantId) ?? null;
  if (zoneMapPlantOverlaySelectEl && zoneMapPlantOverlaySelectEl.value !== (zoneMapSelectedPlantOverlay?.id ?? "")) {
    zoneMapPlantOverlaySelectEl.value = zoneMapSelectedPlantOverlay?.id ?? "";
  }
  updateZoneMapPlantRangeOverlay();
  syncCalendarCombobox(zoneMapPlantOverlayCombo, "Search plants");
  if (zoneMapSelectedPlantOverlay) {
    ensureZoneMapLiveMap();
    const range = zoneMapPlantRange(zoneMapSelectedPlantOverlay);
    trackEvent("plant_range_overlay_select", {
      plant_id: zoneMapSelectedPlantOverlay.id,
      min_zone: range?.minZone,
      max_zone: range?.maxZone,
      source
    });
  } else {
    trackEvent("plant_range_overlay_clear", { source });
  }
}

function renderZoneMapPlantOverlaySummary() {
  if (!zoneMapPlantOverlaySummaryEl || !zoneMapPlantOverlayClearEl) return;
  zoneMapPlantOverlayClearEl.disabled = !zoneMapSelectedPlantOverlay;
  if (!zoneMapSelectedPlantOverlay) {
    zoneMapPlantOverlaySummaryEl.hidden = true;
    zoneMapPlantOverlaySummaryEl.innerHTML = "";
    return;
  }
  const plant = zoneMapSelectedPlantOverlay;
  const range = zoneMapPlantRange(plant);
  const zipFit = zoneMapZoneData ? zoneMapPlantRangeFit(plant, zoneMapZoneData.zone) : null;
  const zipFitText = zoneMapZoneData
    ? `ZIP zone ${zoneMapZoneData.zone}: ${zoneMapPlantRangeFitLabel(zipFit)}.`
    : "Enter a ZIP to compare your local zone to this plant.";
  const nativeNote = hasNativeCue(plant)
    ? "Native flag present; verify county/ecoregion range before habitat planting."
    : "This shades hardiness suitability, not a wild native or observation range.";
  zoneMapPlantOverlaySummaryEl.innerHTML = `
    <div>
      <strong>${escapeHtml(plant.name)}</strong>
      <span>${escapeHtml(plant.type)} | database range ${escapeHtml(range ? `${range.minZone}-${range.maxZone}` : "n/a")}</span>
    </div>
    <p>${escapeHtml(zipFitText)} ${escapeHtml(nativeNote)}</p>
    <div class="zone-map-plant-overlay-legend" aria-label="Plant range overlay legend">
      <span><i class="is-core"></i>Core fit</span>
      <span><i class="is-edge"></i>Range edge</span>
      <span><i class="is-near"></i>Near range</span>
    </div>
  `;
  zoneMapPlantOverlaySummaryEl.hidden = false;
}

function updateZoneMapPlantRangeOverlay() {
  renderZoneMapPlantOverlaySummary();
  if (!zoneMapPlantRangeTileLayer || !zoneMapView) return;
  const hasLayer = zoneMapView.hasLayer(zoneMapPlantRangeTileLayer);
  if (zoneMapSelectedPlantOverlay) {
    if (!hasLayer) zoneMapPlantRangeTileLayer.addTo(zoneMapView);
    if (typeof zoneMapPlantRangeTileLayer.redraw === "function") {
      zoneMapPlantRangeTileLayer.redraw();
    }
    return;
  }
  if (hasLayer) zoneMapView.removeLayer(zoneMapPlantRangeTileLayer);
}

function selectZoneMapFromFullZone(fullZone, source = "map_click") {
  const selectedZone = zoneMapZoneForFullZone(fullZone);
  zoneMapSelectedZone = selectedZone;
  renderZoneMapZoneButtons();
  renderZoneMapZoneDetail(selectedZone);
  const contextZoneData = zoneMapZoneData && zoneMapFullZone(zoneMapZoneData.zone) === zoneMapFullZone(fullZone)
    ? zoneMapZoneData
    : null;
  renderZoneMapPlants(contextZoneData);
  highlightZoneMapFullZone(fullZone);
  trackEvent("zone_map_identify", {
    full_zone: zoneMapFullZone(fullZone),
    selected_zone: selectedZone,
    source
  });
}

function renderZoneMapLiveMarker(zoneData, shouldNavigate = false) {
  if (!zoneMapView || !zoneMapZipGraphicsLayer || !zoneMapMapModules) return;
  const { L } = zoneMapMapModules;
  zoneMapZipGraphicsLayer.clearLayers();
  if (!zoneData) return;
  const climate = estimateLocationClimate(zoneData);
  if (!Number.isFinite(climate.lat) || !Number.isFinite(climate.lon)) return;
  const latLng = [climate.lat, climate.lon];
  const marker = L.marker(latLng, {
    icon: L.divIcon({
      className: "zone-map-leaflet-pin",
      html: "<span></span>",
      iconSize: [28, 28],
      iconAnchor: [14, 28]
    })
  }).bindTooltip(`Approximate ZIP area: zone ${zoneData.zone}`, {
    permanent: true,
    direction: "top",
    offset: [0, -18],
    className: "zone-map-leaflet-label"
  });
  marker.addTo(zoneMapZipGraphicsLayer);
  if (shouldNavigate) {
    const targetZoom = zoneMapCanvasEl.classList.contains("is-fullscreen") ? 7 : 6;
    zoneMapView.flyTo(latLng, Math.max(zoneMapView.getZoom(), targetZoom), { duration: 0.85 });
  }
}

async function initializeZoneMapLiveMap() {
  if (zoneMapView || !zoneMapLiveMapEl) return;
  zoneMapCanvasEl.classList.add("is-loading-live-map");
  zoneMapLiveStatusEl.hidden = false;
  zoneMapLiveStatusEl.textContent = "Loading live GIS zone layer...";
  try {
    const { L } = await loadZoneMapLibraries();
    zoneMapCanvasEl.classList.add("has-live-map");
    zoneMapView = L.map(zoneMapLiveMapEl, {
      center: [38.5, -96],
      zoom: 4,
      minZoom: 3,
      maxZoom: 12,
      zoomControl: false,
      scrollWheelZoom: true,
      worldCopyJump: false
    });
    const topoLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
      attribution: "Tiles &copy; Esri, USGS, NOAA",
      maxZoom: 12
    }).addTo(zoneMapView);
    const imageryLayer = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution: "Imagery &copy; Esri",
      maxZoom: 12
    });
    zoneMapView.createPane("zoneMapHardinessPane");
    zoneMapView.getPane("zoneMapHardinessPane").style.zIndex = 375;
    zoneMapHardinessTileLayer = L.vectorGrid.protobuf(`${hardinessVectorTileServerUrl}/tile/{z}/{y}/{x}.pbf`, {
      rendererFactory: L.canvas.tile,
      pane: "zoneMapHardinessPane",
      interactive: true,
      maxNativeZoom: 12,
      vectorTileLayerStyles: {
        "phzm_us_zones_shp_2023": zoneMapVectorTileStyle,
        "USDA 2023 Plant Hardiness Full Zones": zoneMapVectorTileStyle
      }
    }).addTo(zoneMapView);
    zoneMapHardinessTileLayer.on("mouseover", (event) => {
      const attrs = event.layer?.properties ?? {};
      renderZoneMapIdentify(attrs, "hover");
      showZoneMapHoverTooltip(attrs, event.latlng);
    });
    zoneMapHardinessTileLayer.on("mousemove", (event) => {
      showZoneMapHoverTooltip(event.layer?.properties ?? {}, event.latlng);
    });
    zoneMapHardinessTileLayer.on("mouseout", () => {
      hideZoneMapHoverTooltip();
    });
    zoneMapHardinessTileLayer.on("click", (event) => {
      const attrs = event.layer?.properties ?? {};
      const fullZone = zoneMapFullZoneFromProperties(attrs);
      if (!fullZone) return;
      renderZoneMapIdentify(attrs, "click");
      selectZoneMapFromFullZone(fullZone, "map_click");
    });
    zoneMapView.createPane("zoneMapPlantRangePane");
    zoneMapView.getPane("zoneMapPlantRangePane").style.zIndex = 390;
    zoneMapView.getPane("zoneMapPlantRangePane").style.pointerEvents = "none";
    zoneMapPlantRangeTileLayer = L.vectorGrid.protobuf(`${hardinessVectorTileServerUrl}/tile/{z}/{y}/{x}.pbf`, {
      rendererFactory: L.canvas.tile,
      pane: "zoneMapPlantRangePane",
      interactive: false,
      maxNativeZoom: 12,
      vectorTileLayerStyles: {
        "phzm_us_zones_shp_2023": zoneMapPlantRangeTileStyle,
        "USDA 2023 Plant Hardiness Full Zones": zoneMapPlantRangeTileStyle
      }
    });
    zoneMapHardinessLayer = L.esri.featureLayer({
      url: hardinessFeatureLayerUrl,
      fields: ["full_zone", "trange"],
      simplifyFactor: 0.8,
      precision: 5,
      style: zoneMapLeafletStyle,
      onEachFeature(feature, layer) {
        const attrs = feature.properties ?? {};
        layer.on("mouseover", (event) => {
          renderZoneMapIdentify(attrs, "hover");
          showZoneMapHoverTooltip(attrs, event.latlng);
        });
        layer.on("mousemove", (event) => showZoneMapHoverTooltip(attrs, event.latlng));
        layer.on("mouseout", hideZoneMapHoverTooltip);
        layer.on("click", () => {
          renderZoneMapIdentify(attrs, "click");
          selectZoneMapFromFullZone(attrs.full_zone, "map_click");
        });
      }
    }).addTo(zoneMapView);
    zoneMapZipGraphicsLayer = L.layerGroup().addTo(zoneMapView);
    L.control.zoom({ position: "topleft" }).addTo(zoneMapView);
    L.control.layers(
      { "Topo": topoLayer, "Imagery": imageryLayer },
      { "Hardiness zones": zoneMapHardinessTileLayer, "ZIP marker": zoneMapZipGraphicsLayer },
      { position: "topleft", collapsed: true }
    ).addTo(zoneMapView);
    L.control.scale({ position: "bottomleft", imperial: true, metric: true }).addTo(zoneMapView);
    zoneMapView.on("mouseout", () => {
      hideZoneMapHoverTooltip();
      if (!zoneMapZoneData && zoneMapIdentifyEl) zoneMapIdentifyEl.hidden = true;
    });
    zoneMapLiveStatusEl.hidden = true;
    zoneMapCanvasEl.classList.remove("is-loading-live-map", "has-live-map-error");
    highlightZoneMapFullZone(zoneMapFullZone(zoneMapSelectedZone));
    updateZoneMapPlantRangeOverlay();
    renderZoneMapLiveMarker(zoneMapZoneData, false);
    queueZoneMapResize();
  } catch (error) {
    console.warn("Live GIS zone map failed to initialize", error);
    zoneMapCanvasEl.classList.remove("has-live-map", "is-loading-live-map");
    zoneMapCanvasEl.classList.add("has-live-map-error");
    zoneMapLiveStatusEl.hidden = false;
    zoneMapLiveStatusEl.textContent = "Live GIS layer could not load; static USDA map remains available.";
  }
}

function ensureZoneMapLiveMap() {
  if (zoneMapView || !zoneMapLiveMapEl) {
    queueZoneMapResize();
    return Promise.resolve();
  }
  if (!zoneMapLiveInitPromise) {
    zoneMapLiveInitPromise = initializeZoneMapLiveMap().finally(() => {
      if (!zoneMapView) zoneMapLiveInitPromise = null;
    });
  }
  return zoneMapLiveInitPromise;
}

function updateZoneMapTransform() {
  if (zoneMapView) return;
  zoneMapImageStageEl.style.transform = `translate(${zoneMapPanX}px, ${zoneMapPanY}px) scale(${zoneMapScale})`;
  zoneMapImageStageEl.style.cursor = zoneMapScale > 1 || zoneMapCanvasEl.classList.contains("is-fullscreen") ? "grab" : "";
}

function resetZoneMapView() {
  zoneMapScale = 1;
  zoneMapPanX = 0;
  zoneMapPanY = 0;
  if (zoneMapView) {
    const zoneData = zoneMapZoneData;
    if (zoneData) {
      const climate = estimateLocationClimate(zoneData);
      if (Number.isFinite(climate.lat) && Number.isFinite(climate.lon)) {
        zoneMapView.flyTo([climate.lat, climate.lon], 6, { duration: 0.5 });
        return;
      }
    }
    zoneMapView.flyTo([38.5, -96], 4, { duration: 0.5 });
    return;
  }
  updateZoneMapTransform();
}

function setZoneMapScale(nextScale) {
  if (zoneMapView) {
    const direction = nextScale > zoneMapScale ? 1 : -1;
    zoneMapScale = clamp(nextScale, 1, 3);
    if (direction > 0) {
      zoneMapView.zoomIn(1);
    } else {
      zoneMapView.zoomOut(1);
    }
    return;
  }
  zoneMapScale = clamp(nextScale, 1, 3);
  if (zoneMapScale === 1) {
    zoneMapPanX = 0;
    zoneMapPanY = 0;
  }
  updateZoneMapTransform();
}

function setZoneMapFullscreen(isFullscreen) {
  zoneMapCanvasEl.classList.toggle("is-fullscreen", isFullscreen);
  document.body.classList.toggle("has-zone-map-fullscreen", isFullscreen);
  zoneMapExpandEl.setAttribute("aria-pressed", String(isFullscreen));
  zoneMapExpandEl.textContent = isFullscreen ? "Collapse map" : "Expand map";
  queueZoneMapResize();
  if (!isFullscreen) resetZoneMapView();
}

function renderZoneMapRegion(id = zoneMapSelectedRegion) {
  const region = zoneMapRegionById(id);
  zoneMapSelectedRegion = region.id;
  zoneMapRegionTitleEl.textContent = region.label;
  zoneMapRegionSummaryEl.textContent = `${region.summary} Typical USDA range: ${region.range}.`;
  zoneMapRegionChecksEl.innerHTML = region.checks
    .map((check) => `<p><span></span>${escapeHtml(check)}</p>`)
    .join("");
  zoneMapRegionLayerEl.querySelectorAll("[data-zone-map-region]").forEach((button) => {
    const isActive = button.dataset.zoneMapRegion === region.id;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderZoneMapRegions() {
  zoneMapRegionLayerEl.innerHTML = zoneMapRegions
    .map((region) => `
      <button
        class="zone-map-region zone-map-tooltip"
        type="button"
        data-zone-map-region="${region.id}"
        data-tooltip="${escapeHtml(`${region.summary} Typical USDA range: ${region.range}.`)}"
        aria-pressed="false"
      >
        <strong>${escapeHtml(region.label)}</strong>
        <span>${escapeHtml(region.range)}</span>
      </button>
    `)
    .join("");
  zoneMapRegionLayerEl.querySelectorAll("[data-zone-map-region]").forEach((button) => {
    button.addEventListener("click", () => renderZoneMapRegion(button.dataset.zoneMapRegion));
  });
  renderZoneMapRegion(zoneMapSelectedRegion);
}

function selectZoneMapZone(zone, source = "selector") {
  zoneMapSelectedZone = zone;
  renderZoneMapZoneButtons();
  renderZoneMapZoneDetail(zoneMapSelectedZone);
  const contextZoneData = zoneMapZoneData && zoneMapZoneData.zone === zone ? zoneMapZoneData : null;
  renderZoneMapPlants(contextZoneData);
  highlightZoneMapFullZone(zoneMapFullZone(zone));
  updateZoneMapPlantRangeOverlay();
  trackEvent("zone_map_select", {
    selected_zone: zone,
    full_zone: zoneMapFullZone(zone),
    source
  });
}

function renderZoneMapZoneButtons() {
  zoneMapZoneButtonsEl.innerHTML = zoneMapZoneIds
    .map((zone) => `
      <button
        class="zone-map-tooltip ${zone === zoneMapSelectedZone ? "is-active" : ""}"
        type="button"
        data-zone-map-zone="${zone}"
        data-tooltip="${escapeHtml(`${zoneMapTemperatureRange(zone)?.label ?? "Unknown winter range"} average annual extreme minimum.`)}"
        aria-pressed="${zone === zoneMapSelectedZone}"
      >${zone}</button>
    `)
    .join("");
  zoneMapZoneButtonsEl.querySelectorAll("[data-zone-map-zone]").forEach((button) => {
    button.addEventListener("click", () => {
      selectZoneMapZone(button.dataset.zoneMapZone, "selector");
    });
  });
}

function renderZoneMapZoneDetail(zone = zoneMapSelectedZone) {
  const range = zoneMapTemperatureRange(zone);
  const guidance = zoneMapGuidanceForZone(zone);
  zoneMapZoneDetailEl.innerHTML = `
    <div>
      <span>Zone ${escapeHtml(zone)}</span>
      <strong>${escapeHtml(range?.label ?? "Unknown winter range")}</strong>
      <small>Average annual extreme minimum temperature</small>
    </div>
    <div>
      <h3>${escapeHtml(guidance.title)}</h3>
      ${guidance.notes.map((note) => `<p>${escapeHtml(note)}</p>`).join("")}
    </div>
  `;
}

function zoneMapFormatRegionClimate(zoneData) {
  const climate = estimateLocationClimate(zoneData);
  const frost = estimateCalendarFrost(zoneData, calendarPlanningYear(zoneData));
  const frostText = frost.isFrostFree
    ? "Rare freeze"
    : `${formatCalendarDate(frost.lastFrost)} to ${formatCalendarDate(frost.firstFrost)}`;
  return { climate, frost, frostText };
}

function renderZoneMapDashboard(zoneData) {
  if (!zoneData) {
    zoneMapZoneValueEl.textContent = "--";
    zoneMapTempRangeEl.textContent = "Average annual extreme minimum";
    zoneMapFrostValueEl.textContent = "--";
    zoneMapFrostNoteEl.textContent = "Likely/range estimates after lookup";
    zoneMapHeatValueEl.textContent = "--";
    zoneMapHeatNoteEl.textContent = "AHS-style days above 86 F";
    zoneMapChillValueEl.textContent = "--";
    zoneMapChillNoteEl.textContent = "Estimated winter chill";
    zoneMapPinEl.hidden = true;
    zoneMapPinLabelEl.hidden = true;
    renderZoneMapLiveMarker(null);
    if (zoneMapIdentifyEl) zoneMapIdentifyEl.hidden = true;
    renderZoneMapPlantOverlaySummary();
    return;
  }
  const { climate, frost, frostText } = zoneMapFormatRegionClimate(zoneData);
  const tempRange = zoneData.temperature_range ? `${zoneData.temperature_range} F` : zoneMapTemperatureRange(zoneData.zone)?.label;
  zoneMapZoneValueEl.textContent = zoneData.zone;
  zoneMapTempRangeEl.textContent = tempRange ? `${tempRange} average extreme minimum` : "Average annual extreme minimum";
  zoneMapFrostValueEl.textContent = frostText;
  zoneMapFrostNoteEl.textContent = frost.isFrostFree
    ? "Frost is uncommon; track rare cold snaps and exposure."
    : `Last spring frost: likely ${formatCalendarDate(frost.lastFrost)}, range ${formatPlainFrostRange(frost.lastFrostBand)}. First fall frost: likely ${formatCalendarDate(frost.firstFrost)}, range ${formatPlainFrostRange(frost.firstFrostBand)}.`;
  zoneMapHeatValueEl.textContent = `AHS ${climate.heatZone}`;
  zoneMapHeatNoteEl.textContent = `${formatNumberRange(climate.heatDays, "days >86 F")} per year, estimated.`;
  zoneMapChillValueEl.textContent = climate.chillLabel;
  zoneMapChillNoteEl.textContent = `${formatRoundedNumberRange(climate.chillHours, "chill hours")}; confirm fruit cultivar requirements.`;
  renderZoneMapPlantOverlaySummary();
}

function renderZoneMapPin(zoneData) {
  if (!zoneData) {
    zoneMapPinEl.hidden = true;
    zoneMapPinLabelEl.hidden = true;
    return;
  }
  const climate = estimateLocationClimate(zoneData);
  const position = zoneMapPinPosition(climate.lat, climate.lon, zoneMapSelectedRegion);
  if (!position) {
    zoneMapPinEl.hidden = true;
    zoneMapPinLabelEl.hidden = true;
    return;
  }
  zoneMapPinEl.style.left = `${position.x}%`;
  zoneMapPinEl.style.top = `${position.y}%`;
  zoneMapPinEl.title = `ZIP zone ${zoneData.zone}`;
  zoneMapPinEl.dataset.tooltip = `Approximate ZIP area. USDA zone ${zoneData.zone}.`;
  zoneMapPinEl.hidden = false;
  zoneMapPinLabelEl.style.left = `${position.x}%`;
  zoneMapPinLabelEl.style.top = `${position.y}%`;
  zoneMapPinLabelEl.textContent = `Approx. zone ${zoneData.zone}`;
  zoneMapPinLabelEl.hidden = false;
}

function zoneMapPlantScore(plant, climate) {
  const metrics = metricFor(plant);
  const fit = climateFitForPlant(plant, climate);
  const reliability = metrics.reliabilityScore ?? 2;
  const difficulty = metrics.difficultyScore ?? 4;
  const nativeBoost = hasNativeCue(plant) ? 0.5 : 0;
  return reliability * 12 - difficulty * 4 + (fit?.score ?? 0) + nativeBoost;
}

function zoneMapPlantReason(plant, climate) {
  const type = plant.type.toLowerCase();
  const goals = plant.goals.join(" ");
  const metrics = metricFor(plant);
  if (climate?.moistureKey?.includes("humid") && isHumiditySensitive(plant)) {
    return "Choose disease-resistant cultivars and keep airflow open.";
  }
  if (hasNativeCue(plant)) {
    return "Native flag present; verify local range before habitat planting.";
  }
  if (type.includes("vegetable") || type.includes("herb")) {
    return "Use local frost windows to time seed-starting and transplanting.";
  }
  if (type.includes("fruit") || goals.includes("fruit")) {
    return climate?.chillLabel
      ? `${climate.chillLabel}; confirm cultivar chill and pollination needs.`
      : "Verify cultivar chill and pollination before buying.";
  }
  if ((metrics.difficultyScore ?? 4) <= 2) {
    return "Reliable starter for building confidence in this zone.";
  }
  return "Good hardiness fit; check light, water, and soil before planting.";
}

function zoneMapPlantGroups(matchingPlants, climate) {
  const usedPlants = new Set();
  const take = (label, predicate, limit = 3) => {
    const groupPlants = [];
    matchingPlants.forEach((plant) => {
      if (groupPlants.length >= limit || usedPlants.has(plant.id) || !predicate(plant)) return;
      usedPlants.add(plant.id);
      groupPlants.push(plant);
    });
    return { label, plants: groupPlants };
  };

  return [
    take("Easy starters", (plant) => (metricFor(plant).difficultyScore ?? 4) <= 2),
    take("Fruit and berries", (plant) => {
      const type = plant.type.toLowerCase();
      return type.includes("fruit") || plant.goals.includes("fruit");
    }),
    take("Native / pollinator", (plant) => hasNativeCue(plant) || plant.goals.includes("pollinators-wildlife")),
    take("Vegetables / herbs", (plant) => /vegetable|herb|annual/.test(plant.type.toLowerCase()))
  ].filter((group) => group.plants.length);
}

function renderZoneMapPlants(zoneData = null) {
  const zone = zoneData?.zone ?? zoneMapSelectedZone;
  const zoneNumber = zoneToNumber(zone);
  const climate = zoneData ? estimateLocationClimate(zoneData) : null;
  const matchingPlants = plants
    .filter((plant) => {
      const minZone = zoneToNumber(plant.zones[0]);
      const maxZone = zoneToNumber(plant.zones[1]);
      return Number.isFinite(zoneNumber) && zoneNumber >= minZone && zoneNumber <= maxZone;
    })
    .sort((a, b) => zoneMapPlantScore(b, climate) - zoneMapPlantScore(a, climate) || a.name.localeCompare(b.name));
  const plantGroups = zoneMapPlantGroups(matchingPlants, climate);
  const counts = matchingPlants.reduce((summary, plant) => {
    const type = plant.type.toLowerCase();
    const key = type.includes("tree") ? "trees"
      : type.includes("shrub") ? "shrubs"
      : type.includes("vine") ? "vines"
      : type.includes("vegetable") ? "vegetables"
      : "flowersHerbs";
    summary[key] = (summary[key] ?? 0) + 1;
    return summary;
  }, {});
  zoneMapPlantTitleEl.textContent = zoneData ? `Zone ${zone} planning moves` : `Explore zone ${zone}`;
  zoneMapPlantSummaryEl.textContent = zoneData && climate
    ? `${matchingPlants.length} database plants fit the USDA range. ${climate.regionLabel}; ${climate.moistureLabel.toLowerCase()}.`
    : `${matchingPlants.length} database plants fit this hardiness range. Enter a ZIP to add frost dates, summer heat, winter chill, and rainfall context.`;
  zoneMapPlantListEl.innerHTML = `
    <div class="zone-map-fit-counts">
      <span><strong>${matchingPlants.length}</strong> total fits</span>
      <span><strong>${counts.trees ?? 0}</strong> trees</span>
      <span><strong>${counts.shrubs ?? 0}</strong> shrubs</span>
      <span><strong>${counts.vegetables ?? 0}</strong> vegetables</span>
    </div>
    <div class="zone-map-plant-groups">
      ${plantGroups.map((group) => `
        <section class="zone-map-plant-group">
          <h3>${escapeHtml(group.label)}</h3>
          <div class="zone-map-plant-links">
            ${group.plants.map((plant) => {
              const metrics = metricFor(plant);
              return `
                <a href="${plantPagePath(plant)}">
                  <strong>${escapeHtml(plant.name)}</strong>
                  <span>${escapeHtml(plant.type)} | ${escapeHtml(metrics.display?.difficulty ?? "difficulty n/a")} difficulty</span>
                  <em>${escapeHtml(zoneMapPlantReason(plant, climate))}</em>
                </a>
              `;
            }).join("")}
          </div>
        </section>
      `).join("") || "<p>No plants match this hardiness zone yet.</p>"}
    </div>
  `;
}

function renderZoneMapForLookup(zoneData, zip) {
  zoneMapZoneData = zoneData;
  zoneMapSelectedZone = zoneData.zone;
  const climate = estimateLocationClimate(zoneData);
  zoneMapSelectedRegion = zoneMapRegionForLocation(climate.lat, climate.lon);
  renderZoneMapDashboard(zoneData);
  renderZoneMapRegion(zoneMapSelectedRegion);
  renderZoneMapZoneButtons();
  renderZoneMapZoneDetail(zoneMapSelectedZone);
  renderZoneMapPin(zoneData);
  renderZoneMapLiveMarker(zoneData, true);
  highlightZoneMapFullZone(zoneMapFullZone(zoneData.zone));
  if (zoneMapIdentifyEl) {
    renderZoneMapIdentify({
      full_zone: zoneData.zone,
      trange: zoneData.temperature_range
    }, "click");
  }
  renderZoneMapPlants(zoneData);
  zoneMapUseMatcherEl.disabled = false;
  zoneMapUseCalendarEl.disabled = false;
  zoneMapStatusEl.textContent = `ZIP ${zip} is zone ${zoneData.zone}. Map pin and local climate estimates are ready.`;
}

async function runZoneMapLookup(event) {
  event?.preventDefault();
  const zip = zoneMapZipEl.value.trim();
  if (!/^\d{5}$/.test(zip)) {
    zoneMapStatusEl.textContent = "Enter a five-digit U.S. ZIP code.";
    zoneMapZipEl.focus();
    return false;
  }
  zoneMapStatusEl.textContent = "Looking up USDA hardiness zone...";
  try {
    const [zoneData] = await Promise.all([lookupZone(zip), ensureCoreData()]);
    renderZoneMapForLookup(zoneData, zip);
    trackEvent("zip_submit", {
      tool: "zone_map",
      zone: zoneData.zone
    });
    return true;
  } catch (error) {
    zoneMapStatusEl.textContent = "The zone lookup did not respond. Try again in a moment.";
    return false;
  }
}

function plantHeatPreference(plant) {
  const identity = relationshipIdentity(plant);
  return climateHeatRuleSets.find((rule) => identityMatchesAny(identity, rule.terms, rule.excludes ?? [])) ?? null;
}

function plantChillRequirement(plant) {
  const identity = relationshipIdentity(plant);
  return climateChillRuleSets.find((rule) => identityMatchesAny(identity, rule.terms, rule.excludes ?? [])) ?? null;
}

function isHumiditySensitive(plant) {
  const identity = relationshipIdentity(plant);
  return identityMatchesAny(identity, humidDiseaseTerms, ["cherry belle", "cornelian cherry", "cherry laurel"]);
}

function isWoodyOrPerennial(plant) {
  const type = plant.type.toLowerCase();
  return type.includes("tree") || type.includes("shrub") || type.includes("vine") || type.includes("perennial") || type.includes("grass");
}

function climateFitForPlant(plant, climate) {
  if (!climate) return null;
  const chill = plantChillRequirement(plant);
  const heat = plantHeatPreference(plant);
  let score = 6;
  let value = 72;
  let note = `${climate.regionLabel} estimate is workable; verify microclimates.`;

  if (chill) {
    if (climate.chillHours.max < chill.min) {
      score -= 34;
      value = 12;
      note = `likely short on chill (${formatNumberRange(climate.chillHours, "hrs")} vs ${chill.min}-${chill.max} hrs)`;
    } else if (climate.chillHours.mid < chill.min) {
      score -= 18;
      value = Math.min(value, 38);
      note = `borderline chill fit; choose a lower-chill cultivar if possible`;
    } else if (climate.chillHours.mid > chill.max + 150 && chill.max <= 500) {
      score -= 14;
      value = Math.min(value, 46);
      note = `low-chill cultivar may bloom too early after mild winter warmups`;
    } else {
      score += 14;
      value = Math.max(value, 88);
      note = `estimated winter chill fits ${chill.label} needs`;
    }
  }

  if (heat?.preference === "cool" && climate.heatDays.mid >= 120) {
    score -= 18;
    value = Math.min(value, 30);
    note = `summer heat likely limits performance (${formatNumberRange(climate.heatDays, "days >86 F")})`;
  } else if (heat?.preference === "cool" && climate.heatDays.mid >= 90) {
    score -= 8;
    value = Math.min(value, 58);
    note = `watch heat stress in this warm-summer pattern`;
  } else if (heat?.preference === "hot" && climate.heatDays.mid >= 75) {
    score += 9;
    value = Math.max(value, 86);
    if (!chill) note = `summer heat suits this ${heat.label}`;
  } else if (heat?.preference === "hot" && climate.heatDays.mid < 35) {
    score -= 8;
    value = Math.min(value, 58);
    note = `may need more summer heat than this location reliably provides`;
  } else if (heat?.preference === "cool-season" && climate.heatDays.mid >= 110) {
    score -= 4;
    value = Math.min(value, 66);
    note = "treat as a spring/fall crop; summer heat closes the window";
  }

  if ((climate.moistureKey === "arid" || climate.moistureKey === "semi-arid") && plant.water !== "low") {
    score -= plant.water === "high" ? 10 : 5;
    value = Math.min(value, plant.water === "high" ? 45 : 62);
    note = plant.water === "high" ? "needs dependable irrigation in this dry pattern" : note;
  }
  if ((climate.moistureKey === "humid-hot" || climate.moistureKey === "humid-mixed") && isHumiditySensitive(plant)) {
    score -= climate.moistureKey === "humid-hot" ? 7 : 4;
    value = Math.min(value, climate.moistureKey === "humid-hot" ? 58 : 68);
    if (!chill || value < 60) note = "humidity raises disease pressure; favor resistant cultivars and airflow";
  }

  return {
    score: clamp(Math.round(score), -38, 24),
    value: clamp(Math.round(value), 0, 100),
    note
  };
}

function climatePanelCard(label, value, note) {
  return `
    <article>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <p>${escapeHtml(note)}</p>
    </article>
  `;
}

function renderClimatePanel(inputs) {
  const climate = inputs.climate;
  const frost = inputs.frost;
  if (!climate) return "";
  const frostNote = !frost
    ? "Frost bands appear after the hardiness lookup returns a usable zone."
    : frost.isFrostFree
    ? "Freeze events are uncommon; heat, water, and cultivar fit matter more than frost averages."
    : `${formatFrostBand(frost.lastFrostBand)} last frost; ${formatFrostBand(frost.firstFrostBand)} first frost.`;
  return `
    <div class="climate-panel-copy">
      <p class="eyebrow">Climate reality check</p>
      <h3>Beyond the USDA zone</h3>
      <p>These estimates influence the ranking, but they still need local confirmation for microclimates and cultivar choices.</p>
    </div>
    <div class="climate-panel-grid">
      ${climatePanelCard("Summer heat", climate.heatZoneLabel, `${formatNumberRange(climate.heatDays, "days above 86F")} per year, estimated.`)}
      ${climatePanelCard("Winter chill", climate.chillLabel, `${formatNumberRange(climate.chillHours, "winter chill hours")}; confirm fruit cultivar needs.`)}
      ${climatePanelCard("Frost window", !frost ? "Needs lookup" : frost.isFrostFree ? "Rare freeze" : `${formatCalendarDate(frost.lastFrost)} to ${formatCalendarDate(frost.firstFrost)}`, frostNote)}
      ${climatePanelCard("Rainfall pattern", climate.moistureLabel, climate.moistureNote)}
    </div>
  `;
}

function plantClimateNotes(plant, inputs) {
  const climate = inputs.climate;
  if (!climate) return [];
  const notes = [];
  const chill = plantChillRequirement(plant);
  const heat = plantHeatPreference(plant);
  const fit = climateFitForPlant(plant, climate);
  if (fit?.note) notes.push(fit.note);
  if (chill) {
    notes.push(`Chill target: roughly ${chill.min}-${chill.max} hours; ${chill.note}.`);
  }
  if (heat) {
    notes.push(`Heat preference: ${heat.label}; afternoon shade, reflected heat, or airflow can change performance.`);
  }
  if ((climate.moistureKey === "arid" || climate.moistureKey === "semi-arid") && plant.water !== "low") {
    notes.push("Dry climate: plan drip irrigation and mulch before counting this as low maintenance.");
  }
  if ((climate.moistureKey === "humid-hot" || climate.moistureKey === "humid-mixed") && isHumiditySensitive(plant)) {
    notes.push("Humid climate: disease-resistant cultivars and wider spacing matter as much as hardiness.");
  }
  if (climate.westernClimateCritical && isWoodyOrPerennial(plant)) {
    notes.push("Western climates: USDA zones miss marine, desert, elevation, and valley effects; verify microclimate fit.");
  }
  return Array.from(new Set(notes)).slice(0, 4);
}

function renderPlantClimateNotes(plant, inputs) {
  const notes = plantClimateNotes(plant, inputs);
  if (!notes.length) return "";
  return `
    <div class="detail-panel climate-detail">
      <h4>Climate checks</h4>
      <ul>
        ${notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}
      </ul>
    </div>
  `;
}

function interpolateCalendarFrost(zoneNumber, key) {
  const anchors = calendarFrostAnchors;
  const lastAnchor = anchors[anchors.length - 1];
  const clampedZone = clamp(zoneNumber, anchors[0].zone, lastAnchor.zone);
  let lower = anchors[0];
  let upper = lastAnchor;
  for (let index = 0; index < anchors.length - 1; index += 1) {
    if (clampedZone >= anchors[index].zone && clampedZone <= anchors[index + 1].zone) {
      lower = anchors[index];
      upper = anchors[index + 1];
      break;
    }
  }
  if (lower.zone === upper.zone) return lower[key];
  const ratio = (clampedZone - lower.zone) / (upper.zone - lower.zone);
  return lower[key] + (upper[key] - lower[key]) * ratio;
}

function estimateCalendarFrost(zoneData, year) {
  const zoneNumber = zoneToNumber(zoneData.zone);
  if (!Number.isFinite(zoneNumber)) throw new Error("Zone missing from lookup");
  let lastDay = interpolateCalendarFrost(zoneNumber, "last");
  let firstDay = interpolateCalendarFrost(zoneNumber, "first");
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
  const isFrostFree = zoneNumber >= 11;
  const lastFrost = calendarDateFromDay(year, clamp(lastDay, 5, 180));
  const firstFrost = calendarDateFromDay(year, clamp(firstDay, 230, 365));
  const seasonLength = Math.max(0, Math.round((firstFrost - lastFrost) / calendarDayMs));
  const uncertaintyDays = frostUncertaintyDays(zoneData);
  return {
    zoneNumber,
    lastFrost,
    firstFrost,
    lastFrostBand: frostBandFor(lastFrost, uncertaintyDays),
    firstFrostBand: frostBandFor(firstFrost, uncertaintyDays),
    seasonLength,
    isFrostFree,
    year,
    uncertaintyDays
  };
}

function calendarPlanningYear(zoneData) {
  const currentYear = new Date().getFullYear();
  const currentFrost = estimateCalendarFrost(zoneData, currentYear);
  const today = startOfCalendarDay(new Date());
  return today > addCalendarDays(currentFrost.firstFrost, 45) ? currentYear + 1 : currentYear;
}

function calendarIdentityMatches(identity, terms) {
  return terms.some((term) => termMatchesIdentity(identity, term));
}

function calendarClassForPlant(plant) {
  const identity = relationshipIdentity(plant);
  const type = plant.type.toLowerCase();
  if (calendarIdentityMatches(identity, calendarTermSets.garlic)) return "garlic";
  if (calendarIdentityMatches(identity, ["sweet potato"])) return "warm-direct";
  if (calendarIdentityMatches(identity, calendarTermSets.potato)) return "potato";
  if (calendarIdentityMatches(identity, calendarTermSets.warmTransplant)) return "warm-transplant";
  if (calendarIdentityMatches(identity, calendarTermSets.warmDirect)) return "warm-direct";
  if (calendarIdentityMatches(identity, calendarTermSets.coolDirect)) return "cool-direct";
  if (calendarIdentityMatches(identity, calendarTermSets.coolTransplant)) return "cool-transplant";
  if (calendarIdentityMatches(identity, calendarTermSets.tenderContainer) || type === "citrus") return "tender-container";
  if (type.includes("annual vegetable")) return "warm-direct";
  if (type.includes("annual") && (type.includes("flower") || type.includes("herb"))) return "annual-flower";
  if (calendarIdentityMatches(identity, ["strawberry", "asparagus", "rhubarb"]) || type.includes("herbaceous perennial") || type.includes("perennial flower") || type.includes("perennial herb") || type.includes("perennial vegetable") || type.includes("grass")) return "perennial";
  if (type.includes("tree") || type.includes("shrub") || type.includes("cane") || type.includes("vine") || type.includes("woody") || type.includes("berry")) return "woody";
  if (type.includes("perennial") || type.includes("grass")) return "perennial";
  return "nursery";
}

function calendarPlantFitsZone(plant, zoneNumber) {
  const minZone = zoneToNumber(plant.zones[0]);
  const maxZone = zoneToNumber(plant.zones[1]);
  return Number.isFinite(minZone) && Number.isFinite(maxZone) && zoneNumber >= minZone - 0.25 && zoneNumber <= maxZone + 0.25;
}

function calendarPlantMatchesSet(plant, set) {
  const metrics = metricFor(plant);
  if (set === "all") return true;
  if (set === "kitchen") return goalMatchesPlant(plant, "vegetables-herbs");
  if (set === "fruit") return goalMatchesPlant(plant, "fruit");
  if (set === "pollinator") return goalMatchesPlant(plant, "pollinators-wildlife");
  if (set === "native") return hasNativeCue(plant);
  if (set === "containers") {
    const containerMin = Number(metrics.containerMinGallons);
    return ["good", "workable"].includes(metrics.containerSuitability) || (Number.isFinite(containerMin) && containerMin > 0 && containerMin <= 10);
  }
  if (set === "quick") {
    const maturityDays = Number(metrics.daysToMaturityMax);
    return ["quick", "seasonal", "fast-perennial"].includes(metrics.horizonKey) || (Number.isFinite(maturityDays) && maturityDays > 0 && maturityDays <= 75);
  }
  return true;
}

function calendarPresetValue(presetId) {
  return `${calendarPresetPrefix}${presetId}`;
}

function calendarPresetIdFromValue(value) {
  return String(value ?? "").startsWith(calendarPresetPrefix)
    ? String(value).slice(calendarPresetPrefix.length)
    : "";
}

function calendarPlantFilterBasePlants() {
  return plants
    .filter((plant) => !calendarFrost || calendarPlantFitsZone(plant, calendarFrost.zoneNumber))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function calendarPlantMatchesFocusedFilters(plant) {
  const selectedClass = calendarPlantClassEl.value;
  const selectedVariety = calendarVarietyEl.value;
  const presetId = calendarPresetIdFromValue(selectedClass);
  if (presetId && !calendarPlantMatchesSet(plant, presetId)) return false;
  if (!presetId && selectedClass !== "all" && calendarPlantClassForPlant(plant).id !== selectedClass) return false;
  if (selectedVariety !== "all" && plant.id !== selectedVariety) return false;
  return true;
}

function calendarSelectedPlantFocusLabel() {
  if (calendarVarietyEl.value !== "all") {
    return calendarPlantFilterBasePlants().find((plant) => plant.id === calendarVarietyEl.value)?.name ?? "selected variety";
  }
  if (calendarPlantClassEl.value !== "all") {
    return calendarPlantClassEl.selectedOptions[0]?.textContent?.replace(/\s+\(\d+\)$/, "").replace(/^Preset:\s*/, "") ?? "selected group";
  }
  return calendarSetEl.selectedOptions[0]?.textContent ?? "selected plants";
}

function calendarOptionTextWithoutCount(text) {
  return String(text ?? "").replace(/\s+\(\d+\)$/, "").trim();
}

function calendarOptionCount(text) {
  return String(text ?? "").match(/\((\d+)\)\s*$/)?.[1] ?? "";
}

function calendarSearchOptionLabel(option) {
  return option?.textContent?.trim() ?? "";
}

function calendarSearchDisplayLabel(option) {
  return calendarOptionTextWithoutCount(calendarSearchOptionLabel(option));
}

function calendarSearchOptionList(selectEl) {
  return Array.from(selectEl.options).map((option, index) => ({
    option,
    index,
    value: option.value,
    text: calendarSearchOptionLabel(option),
    plainText: calendarOptionTextWithoutCount(option.textContent),
    count: calendarOptionCount(option.textContent),
    selected: option.selected
  }));
}

function calendarSearchNormalize(value) {
  return String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function calendarComboboxVisibleEntries(combo) {
  const normalizedQuery = calendarSearchNormalize(combo.input.value);
  const entries = calendarSearchOptionList(combo.select);
  if (!normalizedQuery || calendarSearchNormalize(calendarSearchDisplayLabel(combo.select.selectedOptions[0])) === normalizedQuery) {
    return entries;
  }
  return entries.filter((entry) => {
    return calendarSearchNormalize(entry.text).includes(normalizedQuery)
      || calendarSearchNormalize(entry.plainText).includes(normalizedQuery);
  });
}

function renderCalendarComboboxOptions(combo) {
  const entries = calendarComboboxVisibleEntries(combo);
  combo.activeIndex = Math.min(Math.max(combo.activeIndex, 0), Math.max(entries.length - 1, 0));
  if (!entries.length) {
    combo.list.innerHTML = `<p class="calendar-combobox-empty">No ${escapeHtml(combo.emptyLabel)} match "${escapeHtml(combo.input.value)}".</p>`;
    combo.input.removeAttribute("aria-activedescendant");
    return;
  }
  combo.list.innerHTML = entries.map((entry, index) => {
    const optionId = `${combo.list.id}-${index}`;
    const selectedClass = entry.value === combo.select.value ? " is-selected" : "";
    const activeClass = index === combo.activeIndex ? " is-active" : "";
    const count = entry.count ? `<small>${escapeHtml(entry.count)}</small>` : "";
    return `
      <button
        id="${escapeHtml(optionId)}"
        class="calendar-combobox-option${selectedClass}${activeClass}"
        type="button"
        role="option"
        aria-selected="${entry.value === combo.select.value}"
        data-value="${escapeHtml(entry.value)}"
      >
        <span>${escapeHtml(entry.plainText || entry.text)}</span>
        ${count}
      </button>
    `;
  }).join("");
  const activeButton = combo.list.querySelector(".calendar-combobox-option.is-active");
  if (activeButton) combo.input.setAttribute("aria-activedescendant", activeButton.id);
}

function syncCalendarCombobox(combo, placeholder) {
  const isDisabled = combo.select.disabled;
  const defaultValue = combo.defaultValue ?? "all";
  combo.input.disabled = isDisabled;
  combo.input.setAttribute("aria-disabled", String(isDisabled));
  combo.input.placeholder = placeholder;
  combo.input.value = isDisabled ? "" : calendarSearchDisplayLabel(combo.select.selectedOptions[0]);
  combo.clear.hidden = isDisabled || combo.select.value === defaultValue;
  combo.toggle.disabled = isDisabled;
  combo.root.classList.toggle("is-disabled", isDisabled);
  renderCalendarComboboxOptions(combo);
}

function findCalendarSearchOption(selectEl, query) {
  const normalizedQuery = calendarSearchNormalize(query);
  if (!normalizedQuery) return selectEl.options[0] ?? null;
  const options = calendarSearchOptionList(selectEl);
  const exact = options.find((entry) => {
    return calendarSearchNormalize(entry.text) === normalizedQuery || calendarSearchNormalize(entry.plainText) === normalizedQuery;
  });
  if (exact) return exact.option;
  const partial = options.find((entry) => {
    return calendarSearchNormalize(entry.text).includes(normalizedQuery) || calendarSearchNormalize(entry.plainText).includes(normalizedQuery);
  });
  return partial?.option ?? null;
}

function selectCalendarSearchOption(selectEl, option) {
  if (!option || selectEl.value === option.value) return false;
  selectEl.value = option.value;
  selectEl.dispatchEvent(new Event("input", { bubbles: true }));
  return true;
}

function setCalendarComboboxOpen(combo, isOpen) {
  if (combo.input.disabled && isOpen) return;
  combo.root.classList.toggle("is-open", isOpen);
  combo.input.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) {
    combo.activeIndex = 0;
    renderCalendarComboboxOptions(combo);
  } else {
    combo.input.removeAttribute("aria-activedescendant");
  }
}

function closeCalendarCombobox(combo, restoreValue = true) {
  setCalendarComboboxOpen(combo, false);
  if (restoreValue) {
    const placeholder = combo.select.disabled ? combo.disabledPlaceholder : combo.placeholder;
    syncCalendarCombobox(combo, placeholder);
  }
}

function chooseCalendarComboboxOption(combo, option) {
  closeCalendarCombobox(combo, false);
  if (!selectCalendarSearchOption(combo.select, option)) {
    syncCalendarCombobox(combo, combo.placeholder);
  }
}

function moveCalendarComboboxActive(combo, direction) {
  const entries = calendarComboboxVisibleEntries(combo);
  if (!entries.length) return;
  combo.activeIndex = (combo.activeIndex + direction + entries.length) % entries.length;
  renderCalendarComboboxOptions(combo);
  combo.list.querySelector(".calendar-combobox-option.is-active")?.scrollIntoView({ block: "nearest" });
}

function selectCalendarComboboxActive(combo) {
  const activeButton = combo.list.querySelector(".calendar-combobox-option.is-active");
  const value = activeButton?.dataset.value;
  const option = value ? Array.from(combo.select.options).find((entry) => entry.value === value) : findCalendarSearchOption(combo.select, combo.input.value);
  chooseCalendarComboboxOption(combo, option);
}

function resetCalendarCombobox(combo) {
  chooseCalendarComboboxOption(combo, combo.select.options[0]);
}

function initializeCalendarCombobox(combo) {
  combo.input.addEventListener("focus", () => {
    setCalendarComboboxOpen(combo, true);
    if (combo.select.value === (combo.defaultValue ?? "all")) combo.input.value = "";
    renderCalendarComboboxOptions(combo);
  });
  combo.input.addEventListener("click", () => {
    setCalendarComboboxOpen(combo, true);
    if (combo.select.value === (combo.defaultValue ?? "all")) combo.input.value = "";
    renderCalendarComboboxOptions(combo);
  });
  combo.input.addEventListener("input", () => {
    combo.activeIndex = 0;
    setCalendarComboboxOpen(combo, true);
    renderCalendarComboboxOptions(combo);
  });
  combo.input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setCalendarComboboxOpen(combo, true);
      moveCalendarComboboxActive(combo, 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setCalendarComboboxOpen(combo, true);
      moveCalendarComboboxActive(combo, -1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      selectCalendarComboboxActive(combo);
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeCalendarCombobox(combo);
    }
  });
  combo.toggle.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });
  combo.toggle.addEventListener("click", () => {
    const shouldOpen = !combo.root.classList.contains("is-open");
    if (shouldOpen) combo.input.focus();
    setCalendarComboboxOpen(combo, shouldOpen);
    if (combo.root.classList.contains("is-open") && combo.select.value === (combo.defaultValue ?? "all")) combo.input.value = "";
    renderCalendarComboboxOptions(combo);
  });
  combo.clear.addEventListener("click", () => {
    resetCalendarCombobox(combo);
    combo.input.focus();
  });
  combo.list.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });
  combo.list.addEventListener("click", (event) => {
    const optionButton = event.target.closest(".calendar-combobox-option");
    if (!optionButton) return;
    const option = Array.from(combo.select.options).find((entry) => entry.value === optionButton.dataset.value);
    chooseCalendarComboboxOption(combo, option);
    combo.input.focus();
  });
  combo.root.addEventListener("focusout", () => {
    window.setTimeout(() => {
      if (!combo.root.contains(document.activeElement)) closeCalendarCombobox(combo);
    }, 120);
  });
}

function closeCalendarComboboxesExcept(activeCombo) {
  calendarComboboxes.forEach((combo) => {
    if (combo !== activeCombo) closeCalendarCombobox(combo);
  });
}

document.addEventListener("pointerdown", (event) => {
  calendarComboboxes.forEach((combo) => {
    if (!combo.root.contains(event.target)) closeCalendarCombobox(combo);
  });
});

calendarComboboxes.forEach((combo) => {
  combo.root.addEventListener("pointerdown", () => {
    closeCalendarComboboxesExcept(combo);
  });
});

calendarComboboxes.forEach(initializeCalendarCombobox);

function syncCalendarPlantFilterOptions() {
  const basePlants = calendarPlantFilterBasePlants();
  const previousClass = calendarPlantClassEl.value || "all";
  const previousVariety = calendarVarietyEl.value || "all";
  const classMap = new Map();

  basePlants.forEach((plant) => {
    const plantClass = calendarPlantClassForPlant(plant);
    if (!classMap.has(plantClass.id)) {
      classMap.set(plantClass.id, { ...plantClass, count: 0 });
    }
    classMap.get(plantClass.id).count += 1;
  });

  const classes = Array.from(classMap.values())
    .sort((a, b) => a.label.localeCompare(b.label));
  const presetOptions = calendarPlantSetPresets
    .map((preset) => ({
      ...preset,
      value: calendarPresetValue(preset.id),
      count: basePlants.filter((plant) => calendarPlantMatchesSet(plant, preset.id)).length
    }))
    .filter((preset) => preset.count > 0);
  const presetMap = new Map(presetOptions.map((preset) => [preset.value, preset]));
  const selectedPreset = presetMap.get(previousClass);
  const classStillAvailable = previousClass === "all" || classMap.has(previousClass) || Boolean(selectedPreset);
  const selectedClass = classStillAvailable ? previousClass : "all";
  calendarPlantClassEl.innerHTML = [
    `<option value="all">All plant groups (${basePlants.length})</option>`,
    ...presetOptions.map((preset) => `<option value="${escapeHtml(preset.value)}">Preset: ${escapeHtml(preset.label)} (${preset.count})</option>`),
    ...classes.map((plantClass) => `<option value="${escapeHtml(plantClass.id)}">${escapeHtml(plantClass.label)} (${plantClass.count})</option>`)
  ].join("");
  calendarPlantClassEl.value = selectedClass;
  syncCalendarCombobox(calendarPlantClassCombo, "Search groups or presets");

  const selectedPresetId = calendarPresetIdFromValue(selectedClass);
  const varietyPlants = selectedClass === "all" || selectedPresetId
    ? []
    : basePlants.filter((plant) => calendarPlantClassForPlant(plant).id === selectedClass);
  const varietyStillAvailable = previousVariety === "all" || varietyPlants.some((plant) => plant.id === previousVariety);
  const selectedVariety = varietyStillAvailable ? previousVariety : "all";
  calendarVarietyEl.disabled = selectedClass === "all" || Boolean(selectedPresetId) || varietyPlants.length === 0;
  calendarVarietyEl.innerHTML = selectedClass === "all" || selectedPresetId
    ? `<option value="all">${selectedPresetId ? "Choose an individual plant group first" : "Choose a plant group first"}</option>`
    : [
        `<option value="all">All ${calendarPlantClassForPlant(varietyPlants[0])?.plural ?? "varieties"} (${varietyPlants.length})</option>`,
        ...varietyPlants.map((plant) => `<option value="${escapeHtml(plant.id)}">${escapeHtml(plant.name)}</option>`)
      ].join("");
  calendarVarietyEl.value = selectedClass === "all" ? "all" : selectedVariety;
  syncCalendarCombobox(calendarVarietyCombo, calendarVarietyEl.disabled ? "Choose a plant group first" : "Search varieties");

  const canExpandVarieties = selectedClass !== "all" && calendarVarietyEl.value === "all" && varietyPlants.length > 1;
  calendarExpandVarietiesEl.disabled = !canExpandVarieties;
  if (!canExpandVarieties) calendarExpandVarietiesEl.checked = false;
  calendarExpandVarietiesEl.closest(".calendar-expand-control")?.classList.toggle("is-disabled", !canExpandVarieties);
}

function calendarWindow(frost, plant, action, method, season, anchor, startOffset, endOffset, note) {
  const anchorDate = anchor === "first" ? frost.firstFrost : frost.lastFrost;
  const start = addCalendarDays(anchorDate, startOffset);
  const end = addCalendarDays(anchorDate, endOffset);
  const plantClass = calendarPlantClassForPlant(plant);
  const timingClass = calendarClassForPlant(plant);
  return {
    plant,
    group: plantClass.plural,
    plantClass,
    timingClass,
    action,
    method,
    season,
    start: start <= end ? start : end,
    end: start <= end ? end : start,
    note
  };
}

function calendarWindowsForPlant(plant, frost) {
  const metrics = metricFor(plant);
  const identity = relationshipIdentity(plant);
  const daysToMaturity = clamp(Number(metrics.daysToMaturityMax) || 60, 35, 120);
  const fallDirectLead = clamp(daysToMaturity + 21, 45, 100);
  const fallTransplantLead = clamp(daysToMaturity + 35, 55, 110);
  const plantClass = calendarClassForPlant(plant);

  if (plantClass === "warm-transplant") {
    return [
      calendarWindow(frost, plant, "Start seeds indoors", "indoors", "spring", "last", -56, -42, "Warm-season crops need a head start before frost-free weather."),
      calendarWindow(frost, plant, "Transplant outside", "transplant", "spring", "last", 7, 28, "Wait for settled nights and warm soil before moving plants out.")
    ];
  }

  if (plantClass === "warm-direct") {
    const windows = [
      calendarWindow(frost, plant, "Direct sow or plant outside", "direct", "spring", "last", 7, 35, "Sow after frost risk is low and the soil has warmed.")
    ];
    if (calendarIdentityMatches(identity, calendarTermSets.shortIndoorWarm)) {
      windows.unshift(calendarWindow(frost, plant, "Optional indoor start", "indoors", "spring", "last", -28, -14, "Use for an earlier crop, then transplant gently after frost."));
    }
    return windows;
  }

  if (plantClass === "cool-direct") {
    return [
      calendarWindow(frost, plant, "Direct sow spring crop", "direct", "spring", "last", -42, 14, "Cool-season crops can usually start before the last frost in workable soil."),
      calendarWindow(frost, plant, "Direct sow fall crop", "direct", "fall", "first", -fallDirectLead, -35, "Count back from first frost so the crop can size up in cooler weather.")
    ];
  }

  if (plantClass === "cool-transplant") {
    return [
      calendarWindow(frost, plant, "Start seeds indoors", "indoors", "spring", "last", -70, -42, "Give cool-season transplants time to size up before spring planting."),
      calendarWindow(frost, plant, "Transplant spring crop", "transplant", "spring", "last", -28, 14, "Harden off seedlings and use row cover if a hard freeze threatens."),
      calendarWindow(frost, plant, "Start seeds for fall", "indoors", "fall", "first", -fallTransplantLead, -70, "Start fall brassicas and greens before summer heat fully passes."),
      calendarWindow(frost, plant, "Transplant fall crop", "transplant", "fall", "first", -63, -35, "Set plants out early enough to establish before short days and frost.")
    ];
  }

  if (plantClass === "potato") {
    return [
      calendarWindow(frost, plant, "Plant seed pieces", "direct", "spring", "last", -28, 14, "Plant into workable soil and hill as shoots grow.")
    ];
  }

  if (plantClass === "garlic") {
    return [
      calendarWindow(frost, plant, "Plant cloves", "direct", "fall", "first", -42, -14, "Plant in fall after heat fades so roots grow before winter.")
    ];
  }

  if (plantClass === "annual-flower") {
    return [
      calendarWindow(frost, plant, "Start seeds indoors", "indoors", "spring", "last", -42, -21, "Start indoors for earlier bloom where the season is short."),
      calendarWindow(frost, plant, "Sow or transplant outside", "direct", "spring", "last", 7, 35, "Plant after frost risk drops and soil is workable.")
    ];
  }

  if (plantClass === "tender-container") {
    return [
      calendarWindow(frost, plant, "Move or plant outside", "transplant", "spring", "last", 14, 56, "Keep tender plants protected until nights are reliably mild.")
    ];
  }

  if (plantClass === "woody") {
    return [
      calendarWindow(frost, plant, "Plant dormant or potted stock", "nursery", "spring", "last", -35, 21, "Plant while weather is cool, then water deeply through establishment."),
      calendarWindow(frost, plant, "Plant dormant or potted stock", "nursery", "fall", "first", -63, -28, "Fall planting works best while soil is warm and drought stress is lower.")
    ];
  }

  if (plantClass === "perennial") {
    return [
      calendarWindow(frost, plant, "Plant plugs or divisions", "nursery", "spring", "last", -21, 42, "Plant perennials in cool weather and keep roots evenly moist."),
      calendarWindow(frost, plant, "Plant plugs or divisions", "nursery", "fall", "first", -56, -28, "Give perennials several weeks to root before hard freezes.")
    ];
  }

  return [
    calendarWindow(frost, plant, "Plant nursery stock", "nursery", "spring", "last", -21, 35, "Use the profile and nursery directions to tune final timing.")
  ];
}

function buildCalendarEvents(frost) {
  return plants
    .filter((plant) => calendarPlantFitsZone(plant, frost.zoneNumber))
    .flatMap((plant) => calendarWindowsForPlant(plant, frost))
    .sort((a, b) => a.start - b.start || calendarMethodOrder[a.method] - calendarMethodOrder[b.method] || a.group.localeCompare(b.group));
}

function filterCalendarEvents({ includeSeason = true, includeMonth = true } = {}) {
  if (!calendarEvents.length) return [];
  const today = startOfCalendarDay(new Date());
  const nextEnd = addCalendarDays(today, 45);
  const selectedSeason = calendarSeasonEl.value;
  const selectedMethod = calendarMethodEl.value;
  return calendarEvents.filter((event) => {
    if (!calendarPlantMatchesFocusedFilters(event.plant)) return false;
    if (selectedMethod !== "all" && event.method !== selectedMethod) return false;
    if (includeSeason) {
      if (selectedSeason === "next" && !calendarRangeOverlaps(event.start, event.end, today, nextEnd)) return false;
      if ((selectedSeason === "spring" || selectedSeason === "fall") && event.season !== selectedSeason) return false;
    }
    if (includeMonth && calendarMonthFilter !== "") {
      const month = Number(calendarMonthFilter);
      const monthStart = new Date(calendarDisplayYear, month, 1);
      const monthEnd = startOfCalendarDay(new Date(calendarDisplayYear, month + 1, 0));
      if (!calendarRangeOverlaps(event.start, event.end, monthStart, monthEnd)) return false;
    }
    return true;
  });
}

function groupCalendarEvents(events) {
  const groups = new Map();
  events.forEach((event) => {
    const key = [
      event.action,
      event.method,
      event.season,
      calendarDateKey(event.start),
      calendarDateKey(event.end)
    ].join("|");
    if (!groups.has(key)) {
      groups.set(key, {
        ...event,
        plantMap: new Map(),
        notes: new Set(),
        timingClasses: new Set()
      });
    }
    const group = groups.get(key);
    group.plantMap.set(event.plant.id, event.plant);
    if (event.note) group.notes.add(event.note);
    group.timingClasses.add(event.timingClass ?? calendarClassForPlant(event.plant));
  });
  return Array.from(groups.values())
    .map(({ plantMap, notes, timingClasses, ...group }) => ({
      ...group,
      plants: Array.from(plantMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
      notes: Array.from(notes),
      timingClasses: Array.from(timingClasses)
    }))
    .sort((a, b) => a.start - b.start || calendarMethodOrder[a.method] - calendarMethodOrder[b.method] || a.action.localeCompare(b.action));
}

function averageCalendarDate(dates) {
  const averageTime = dates.reduce((sum, date) => sum + date.getTime(), 0) / Math.max(1, dates.length);
  return startOfCalendarDay(new Date(averageTime));
}

function averageCalendarClassEvents(events) {
  const groups = new Map();
  events.forEach((event) => {
    const key = [
      event.plantClass.id,
      event.action,
      event.method,
      event.season
    ].join("|");
    if (!groups.has(key)) {
      groups.set(key, {
        ...event,
        group: event.plantClass.plural,
        plants: [],
        starts: [],
        ends: []
      });
    }
    const group = groups.get(key);
    group.plants.push(event.plant);
    group.starts.push(event.start);
    group.ends.push(event.end);
  });

  return Array.from(groups.values())
    .map((group) => {
      const plantsForGroup = Array.from(
        new Map(group.plants.map((plant) => [plant.id, plant])).values()
      ).sort((a, b) => a.name.localeCompare(b.name));
      return {
        ...group,
        start: averageCalendarDate(group.starts),
        end: averageCalendarDate(group.ends),
        plants: plantsForGroup,
        isAverage: plantsForGroup.length > 1
      };
    })
    .sort((a, b) => a.start - b.start || calendarMethodOrder[a.method] - calendarMethodOrder[b.method] || a.group.localeCompare(b.group));
}

function calendarShowsVarietyRows() {
  return calendarVarietyEl.value !== "all" || (calendarPlantClassEl.value !== "all" && calendarExpandVarietiesEl.checked);
}

function calendarSoilTempLabel(group) {
  const timingClass = group.timingClass
    ?? (group.plants?.[0] ? calendarClassForPlant(group.plants[0]) : group.plant ? calendarClassForPlant(group.plant) : "nursery");
  return calendarSoilTempGuidance[timingClass] ?? calendarSoilTempGuidance.nursery;
}

function calendarPlantCountLabel(count) {
  return `${count} ${count === 1 ? "plant" : "plants"}`;
}

function calendarActionPlantSummary(group) {
  const formSummary = summarizeForms(group.plants.map((plant) => ({ plant })));
  const countLabel = calendarPlantCountLabel(group.plants.length);
  return formSummary ? `${countLabel} - ${formSummary}` : countLabel;
}

function calendarActionGuidance(group) {
  const notes = group.notes ?? [];
  const note = notes.length === 1
    ? notes[0]
    : "Check individual plant profiles for crop-specific timing tweaks.";
  const soilGuidance = (group.timingClasses ?? [])
    .map((timingClass) => calendarSoilTempGuidance[timingClass] ?? calendarSoilTempGuidance.nursery)
    .filter((label, index, labels) => labels.indexOf(label) === index);
  const soilNote = soilGuidance.length === 1
    ? soilGuidance[0]
    : "Soil and establishment checks vary across this group.";
  return `${note} ${soilNote}`;
}

function calendarTimingExplanation(events, today) {
  if (!events.length) return "No matching planting windows are scheduled for this zone and filter set.";
  const previous = groupCalendarEvents(events.filter((event) => event.end < today))
    .sort((a, b) => b.end - a.end)[0];
  const next = groupCalendarEvents(events.filter((event) => event.start > today))
    .sort((a, b) => a.start - b.start)[0];
  const details = [];
  if (previous) {
    details.push(`${previous.season === "fall" ? "Fall" : "Spring"} window closed ${formatCalendarDate(previous.end)}`);
  }
  if (next) {
    details.push(`next opportunity opens ${formatCalendarDate(next.start)}`);
  }
  if (!details.length) return "The current filter is between date windows; use soil temperature and the 10-day forecast before planting.";
  return `${details.join("; ")}. Use soil temperature and the 10-day forecast to tune the final date.`;
}

function calendarVisualEvents() {
  return filterCalendarEvents({ includeSeason: false, includeMonth: false });
}

function calendarUrgencyForRange(start, end) {
  const today = calendarToday();
  const weekEnd = addCalendarDays(today, 7);
  const soonEnd = addCalendarDays(today, 30);
  if (calendarRangeOverlaps(start, end, today, weekEnd)) return "active";
  if (start > today && start <= weekEnd) return "week";
  if (start > today && start <= soonEnd) return "soon";
  return "later";
}

function calendarGroupFormKey(group) {
  const counts = group.plants.reduce((summary, plant) => {
    const key = plantFormKey(plant);
    summary[key] = (summary[key] ?? 0) + 1;
    return summary;
  }, {});
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || formOrder.indexOf(a[0]) - formOrder.indexOf(b[0]))[0]?.[0] ?? "fruiting";
}

function calendarTimelineRows(events) {
  const rows = new Map();
  const showVarietyRows = calendarShowsVarietyRows();
  const bars = showVarietyRows
    ? events.map((event) => ({ ...event, group: event.plant.name, plants: [event.plant] }))
    : averageCalendarClassEvents(events);
  bars.forEach((group) => {
    const rowKey = showVarietyRows ? group.plants[0].id : group.plantClass.id;
    const rowLabel = showVarietyRows ? group.plants[0].name : group.group;
    if (!rows.has(rowKey)) {
      rows.set(rowKey, {
        label: rowLabel,
        plants: new Map(),
        bars: []
      });
    }
    const row = rows.get(rowKey);
    group.plants.forEach((plant) => row.plants.set(plant.id, plant));
    row.bars.push(group);
  });
  return Array.from(rows.values())
    .map((row) => ({
      ...row,
      plants: Array.from(row.plants.values()).sort((a, b) => a.name.localeCompare(b.name)),
      bars: row.bars.sort((a, b) => a.start - b.start || calendarMethodOrder[a.method] - calendarMethodOrder[b.method])
    }))
    .sort((a, b) => {
      const aStart = a.bars[0]?.start ?? calendarYearEnd();
      const bStart = b.bars[0]?.start ?? calendarYearEnd();
      return aStart - bStart || a.label.localeCompare(b.label);
    });
}

function calendarMonthsTouched(start, end) {
  const months = [];
  for (let month = 0; month < 12; month += 1) {
    const monthStart = new Date(calendarDisplayYear, month, 1);
    const monthEnd = startOfCalendarDay(new Date(calendarDisplayYear, month + 1, 0));
    if (calendarRangeOverlaps(start, end, monthStart, monthEnd)) months.push(month);
  }
  return months;
}

function calendarMonthRange(month) {
  return {
    start: startOfCalendarDay(new Date(calendarDisplayYear, month, 1)),
    end: startOfCalendarDay(new Date(calendarDisplayYear, month + 1, 0))
  };
}

function calendarGroupsForMonth(events, month) {
  const { start, end } = calendarMonthRange(month);
  return groupCalendarEvents(events.filter((event) => calendarRangeOverlaps(event.start, event.end, start, end)));
}

function calendarFocusMonth(events) {
  if (calendarMonthFilter !== "") return Number(calendarMonthFilter);
  const today = calendarToday();
  const currentMonth = today.getFullYear() === calendarDisplayYear ? today.getMonth() : 0;
  if (calendarGroupsForMonth(events, currentMonth).length > 0) return currentMonth;
  const nextGroup = groupCalendarEvents(events).find((group) => group.end >= today);
  if (nextGroup) return nextGroup.start.getMonth();
  return currentMonth;
}

function calendarCompactView() {
  return window.matchMedia("(max-width: 760px)").matches;
}

function calendarFrostOverlayHtml() {
  if (!calendarFrost) return "";
  const last = calendarPercentForDate(calendarFrost.lastFrost);
  const first = calendarPercentForDate(calendarFrost.firstFrost);
  const today = calendarTodayPercent();
  return `
    <span class="calendar-frost-band" style="left: ${last}%; width: ${Math.max(1, first - last)}%;"></span>
    <span class="calendar-frost-line calendar-frost-line-last" style="left: ${last}%;" title="Estimated last frost: ${formatCalendarDate(calendarFrost.lastFrost)}"></span>
    ${calendarFrost.isFrostFree ? "" : `<span class="calendar-frost-line calendar-frost-line-first" style="left: ${first}%;" title="Estimated first frost: ${formatCalendarDate(calendarFrost.firstFrost)}"></span>`}
    ${today === null ? "" : `<span class="calendar-today-line" style="left: ${today}%;" title="Today"><span>Today</span></span>`}
  `;
}

function handleCalendarMonthSelection(month) {
  calendarMonthFilter = month;
  calendarSeasonEl.value = "all";
  renderCalendar();
  trackEvent("filter_apply", {
    tool: "calendar",
    action: month === "" ? "show_all_months" : "month_select",
    month: month === "" ? "all" : calendarMonthLabels[Number(month)]
  });
  const target = calendarCompactView() ? ".calendar-mobile-plan" : ".calendar-timeline";
  document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderCalendarHeatmap(events) {
  if (!calendarFrost) {
    calendarHeatmapEl.innerHTML = "<p>Build a calendar to see monthly activity.</p>";
    return;
  }
  const groups = groupCalendarEvents(events);
  const counts = new Array(12).fill(0);
  groups.forEach((group) => {
    calendarMonthsTouched(group.start, group.end).forEach((month) => {
      counts[month] += 1;
    });
  });
  const maxCount = Math.max(1, ...counts);
  const allIsActive = calendarMonthFilter === "";
  const allButton = `
    <button
      type="button"
      class="calendar-heatmap-cell calendar-heatmap-all ${allIsActive ? "is-active" : ""}"
      data-calendar-heat-month=""
      style="--activity: 0.42"
      aria-pressed="${allIsActive}"
      title="Show all month details"
    >
      <span>All</span>
      <strong>${groups.length}</strong>
    </button>
  `;
  calendarHeatmapEl.innerHTML = [
    allButton,
    ...calendarMonthLabels.map((label, index) => {
    const count = counts[index];
    const intensity = count / maxCount;
    const isActive = calendarMonthFilter === String(index);
    const isEmpty = count === 0;
    return `
      <button
        type="button"
        class="calendar-heatmap-cell ${isActive ? "is-active" : ""} ${isEmpty ? "is-empty" : ""}"
        data-calendar-heat-month="${index}"
        style="--activity: ${intensity.toFixed(3)}"
        aria-pressed="${isActive}"
        title="Show ${label} detail"
        ${isEmpty ? "disabled aria-disabled=\"true\"" : ""}
      >
        <span>${label}</span>
        <strong>${count}</strong>
      </button>
    `;
    })
  ].join("");
  calendarHeatmapEl.querySelectorAll("[data-calendar-heat-month]").forEach((button) => {
    if (button.disabled) return;
    button.addEventListener("click", () => {
      handleCalendarMonthSelection(button.dataset.calendarHeatMonth ?? "");
    });
  });
}

function renderCalendarGantt(events) {
  if (!calendarFrost) {
    calendarGanttEl.innerHTML = "<p class=\"calendar-gantt-empty\">Build a calendar to see the year as planting bars.</p>";
    return;
  }
  const rows = calendarTimelineRows(events);
  const compact = calendarCompactView();
  const rowLimit = compact ? 18 : 64;
  const visibleRows = rows.slice(0, rowLimit);
  const showingVarietyRows = calendarShowsVarietyRows();
  if (!visibleRows.length) {
    calendarGanttEl.innerHTML = "<p class=\"calendar-gantt-empty\">No timeline rows match these filters.</p>";
    return;
  }
  const frostOverlay = calendarFrostOverlayHtml();
  calendarGanttEl.innerHTML = `
    <div class="calendar-gantt-scroll" role="region" aria-label="Year-long planting bars" tabindex="0">
      <div class="calendar-gantt-months" aria-hidden="true">
        <span></span>
        <div>${calendarMonthLabels.map((label) => `<b>${label}</b>`).join("")}</div>
      </div>
      <div class="calendar-gantt-rows">
        ${visibleRows.map((row) => {
          const formKey = calendarGroupFormKey({ plants: row.plants });
          return `
            <article class="calendar-gantt-row calendar-form-${escapeHtml(formKey)}">
              <div class="calendar-gantt-label">
                <strong>${escapeHtml(row.label)}</strong>
                <small>${row.plants.length} ${row.plants.length === 1 ? "plant" : showingVarietyRows ? "plants" : "varieties"} - ${calendarFormLabels[formKey] ?? "Plant"}</small>
              </div>
              <div class="calendar-gantt-track">
                ${frostOverlay}
                ${row.bars.map((bar) => {
                  const geometry = calendarBarGeometry(bar.start, bar.end);
                  const lane = Math.max(0, (calendarMethodOrder[bar.method] ?? 1) - 1);
                  const titleSuffix = bar.isAverage ? " - averaged variety window" : "";
                  return `
                    <span
                      class="calendar-gantt-bar calendar-method-${escapeHtml(bar.method)}"
                      style="left: ${geometry.left}%; width: ${geometry.width}%; --lane: ${lane};"
                      title="${escapeHtml(`${formatCalendarWindow(bar.start, bar.end)} - ${bar.action} - ${bar.plants.length} ${bar.plants.length === 1 ? "plant" : "varieties"}${titleSuffix}`)}"
                    >
                      <span>${escapeHtml(calendarMethodLabels[bar.method])}</span>
                    </span>
                  `;
                }).join("")}
              </div>
            </article>
          `;
        }).join("")}
      </div>
    </div>
    ${rows.length > visibleRows.length ? `<p class="calendar-limit-note">Showing ${visibleRows.length} of ${rows.length} timeline rows. Narrow the plant group, preset, or method to see a tighter year view.</p>` : ""}
  `;
}

function renderCalendarMobilePlan(events) {
  if (!calendarFrost) {
    calendarMobilePlanEl.innerHTML = "<p class=\"calendar-mobile-empty\">Build a calendar to see a shorter month plan here.</p>";
    return;
  }
  const focusMonth = calendarFocusMonth(events);
  const groups = calendarGroupsForMonth(events, focusMonth);
  const visibleGroups = groups.slice(0, 3);
  const focusLabel = calendarMonthFilter === "" ? "Month focus" : "Selected month";
  const monthName = calendarMonthLabels[focusMonth];
  const clearButton = calendarMonthFilter === ""
    ? ""
    : "<button type=\"button\" data-calendar-mobile-clear>All months</button>";

  if (!groups.length) {
    calendarMobilePlanEl.innerHTML = `
      <div class="calendar-mobile-focus-head">
        <div>
          <p class="eyebrow">${focusLabel}</p>
          <h3>${monthName} tasks</h3>
          <p>No action rows match this month and filter set.</p>
        </div>
        ${clearButton}
      </div>
    `;
  } else {
    calendarMobilePlanEl.innerHTML = `
      <div class="calendar-mobile-focus-head">
        <div>
          <p class="eyebrow">${focusLabel}</p>
          <h3>${monthName} tasks</h3>
          <p>${groups.length} action ${groups.length === 1 ? "row" : "rows"} for the current filters.</p>
        </div>
        ${clearButton}
      </div>
      <div class="calendar-mobile-actions">
        ${visibleGroups.map((group) => {
          const urgency = calendarUrgencyForRange(group.start, group.end);
          return `
            <article class="calendar-mobile-action calendar-form-${escapeHtml(calendarGroupFormKey(group))} calendar-urgency-${escapeHtml(urgency)}">
              <div>
                <span class="calendar-mobile-date">${formatCalendarWindow(group.start, group.end)}</span>
                <span class="calendar-method calendar-method-${escapeHtml(group.method)}">${calendarMethodLabels[group.method]}</span>
              </div>
              <h4>${escapeHtml(group.action)}</h4>
              <p>${escapeHtml(calendarActionPlantSummary(group))}</p>
              <small>${escapeHtml(calendarActionGuidance(group))}</small>
              ${renderCalendarPlantLinks(group.plants, 4)}
              ${renderCalendarSupplyLinks(group, 2)}
            </article>
          `;
        }).join("")}
      </div>
      ${groups.length > visibleGroups.length ? `<p class="calendar-limit-note">Showing ${visibleGroups.length} of ${groups.length} month action rows. Use the detail list below for the full month.</p>` : ""}
    `;
  }

  calendarMobilePlanEl.querySelector("[data-calendar-mobile-clear]")?.addEventListener("click", () => {
    calendarMonthFilter = "";
    renderCalendar();
    calendarMobilePlanEl.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function renderCalendarPlantLinks(plantsForGroup, limit = 4) {
  const visiblePlants = plantsForGroup.slice(0, limit);
  const hiddenCount = plantsForGroup.length - visiblePlants.length;
  return `
    <div class="calendar-plant-links">
      ${visiblePlants.map((plant) => `<a href="${plantPagePath(plant)}">${escapeHtml(plant.name)}</a>`).join("")}
      ${hiddenCount > 0 ? `<span>+${hiddenCount} more</span>` : ""}
    </div>
  `;
}

function renderCalendarGroup(group) {
  const urgency = calendarUrgencyForRange(group.start, group.end);
  const formKey = calendarGroupFormKey(group);
  return `
    <article class="calendar-event calendar-form-${escapeHtml(formKey)} calendar-urgency-${escapeHtml(urgency)}">
      <div class="calendar-event-date">
        <strong>${formatCalendarWindow(group.start, group.end)}</strong>
        <span>${group.season === "fall" ? "Fall" : "Spring"}</span>
      </div>
      <div class="calendar-event-main">
        <div class="calendar-event-title">
          <h3>${escapeHtml(group.action)}</h3>
          <div class="calendar-event-badges">
            <span class="calendar-urgency-badge calendar-urgency-badge-${escapeHtml(urgency)}">${calendarUrgencyLabels[urgency]}</span>
            <span class="calendar-method calendar-method-${escapeHtml(group.method)}">${calendarMethodLabels[group.method]}</span>
          </div>
        </div>
        <p>${escapeHtml(calendarActionPlantSummary(group))}</p>
        ${renderCalendarPlantLinks(group.plants, 8)}
        <small>${escapeHtml(calendarActionGuidance(group))}</small>
        ${renderCalendarSupplyLinks(group, 3)}
      </div>
    </article>
  `;
}

function renderCalendarNowPanel() {
  if (!calendarFrost) {
    calendarNowTitleEl.textContent = "Today in your zone";
    calendarNowSummaryEl.textContent = "Build a calendar to see what overlaps this week.";
    calendarNowListEl.innerHTML = "<p>Current planting windows will appear here after lookup.</p>";
    return;
  }
  const today = calendarToday();
  const weekEnd = addCalendarDays(today, 7);
  const baseEvents = calendarVisualEvents();
  const activeGroups = groupCalendarEvents(baseEvents.filter((event) => calendarRangeOverlaps(event.start, event.end, today, weekEnd)));
  const upcomingGroups = groupCalendarEvents(baseEvents.filter((event) => event.start > weekEnd)).slice(0, 4);
  const daysSinceLastFrost = Math.round((today - calendarFrost.lastFrost) / calendarDayMs);
  const daysToFirstFrost = Math.round((calendarFrost.firstFrost - today) / calendarDayMs);
  let frostNote = calendarFrost.isFrostFree
    ? "Frost is uncommon in this zone; use heat, rainfall, and nursery directions as the main timing checks."
    : `${daysSinceLastFrost >= 0 ? `${daysSinceLastFrost} days since estimated last frost` : `${Math.abs(daysSinceLastFrost)} days until estimated last frost`}; ${daysToFirstFrost >= 0 ? `${daysToFirstFrost} days until estimated first frost` : `${Math.abs(daysToFirstFrost)} days since estimated first frost`}.`;
  const timingNote = calendarTimingExplanation(baseEvents, today);
  calendarNowTitleEl.textContent = `${formatCalendarDate(today)} in zone ${calendarZoneData.zone}`;
  calendarNowSummaryEl.textContent = activeGroups.length
    ? `${activeGroups.length} planting ${activeGroups.length === 1 ? "action overlaps" : "actions overlap"} this week. ${frostNote}`
    : `No matching planting windows overlap this week. ${timingNote} ${frostNote}`;
  const groups = activeGroups.length ? activeGroups.slice(0, 3) : upcomingGroups.slice(0, 3);
  if (!groups.length) {
    calendarNowListEl.innerHTML = "<p>No current or upcoming windows match these filters.</p>";
    return;
  }
  calendarNowListEl.innerHTML = `
    ${groups.map((group) => {
      const urgency = calendarUrgencyForRange(group.start, group.end);
      return `
        <article class="calendar-now-item calendar-urgency-${escapeHtml(urgency)}">
          <strong>${calendarUrgencyLabels[urgency]}</strong>
          <span>${formatCalendarWindow(group.start, group.end)}</span>
          <p>${escapeHtml(group.action)}: ${escapeHtml(calendarPlantCountLabel(group.plants.length))}</p>
        </article>
      `;
    }).join("")}
  `;
}

function renderCalendarDashboard() {
  if (!calendarZoneData || !calendarFrost) {
    calendarZoneValueEl.textContent = "--";
    calendarTempValueEl.textContent = "USDA hardiness";
    calendarLastFrostEl.textContent = "--";
    calendarLastFrostNoteEl.textContent = "spring estimate";
    calendarFirstFrostEl.textContent = "--";
    calendarFirstFrostNoteEl.textContent = "fall estimate";
    calendarSeasonLengthEl.textContent = "--";
    return;
  }
  calendarZoneValueEl.textContent = calendarZoneData.zone;
  calendarTempValueEl.textContent = calendarZoneData.temperature_range ?? "USDA hardiness";
  calendarLastFrostEl.textContent = formatCalendarDate(calendarFrost.lastFrost);
  calendarLastFrostNoteEl.textContent = calendarFrost.isFrostFree ? "rare freeze" : formatFrostBand(calendarFrost.lastFrostBand);
  calendarFirstFrostEl.textContent = calendarFrost.isFrostFree ? "Rare" : formatCalendarDate(calendarFrost.firstFrost);
  calendarFirstFrostNoteEl.textContent = calendarFrost.isFrostFree ? "rare freeze" : formatFrostBand(calendarFrost.firstFrostBand);
  calendarSeasonLengthEl.textContent = calendarFrost.isFrostFree ? "Most year" : `${calendarFrost.seasonLength} days`;
}

function renderCalendar() {
  syncCalendarPlantFilterOptions();
  renderCalendarDashboard();
  if (!calendarFrost) {
    calendarEventsEl.innerHTML = "";
    calendarHeatmapEl.innerHTML = "<p>Build a calendar to see monthly activity.</p>";
    calendarMobilePlanEl.innerHTML = "<p class=\"calendar-mobile-empty\">Build a calendar to see a shorter month plan here.</p>";
    calendarGanttEl.innerHTML = "<p class=\"calendar-gantt-empty\">Build a calendar to see the year as planting bars.</p>";
    calendarVisualSummaryEl.textContent = "A horizontal view will appear after ZIP lookup.";
    calendarEmptyEl.hidden = true;
    renderCalendarNowPanel();
    return;
  }
  const visualEvents = calendarVisualEvents();
  const timelineRows = calendarTimelineRows(visualEvents);
  const plantFocusLabel = calendarSelectedPlantFocusLabel();
  const methodLabel = calendarMethodEl.selectedOptions[0]?.textContent ?? "selected methods";
  const chartModeNote = calendarShowsVarietyRows() ? "Variety rows are expanded." : "Group rows use averaged variety dates.";
  calendarVisualSummaryEl.textContent = `${timelineRows.length} chart rows for ${plantFocusLabel}, ${methodLabel.toLowerCase()}. ${chartModeNote} Today and frost dates stay fixed on the year.`;
  renderCalendarNowPanel();
  renderCalendarGantt(visualEvents);
  renderCalendarHeatmap(visualEvents);
  renderCalendarMobilePlan(visualEvents);
  const groups = groupCalendarEvents(filterCalendarEvents());
  const visibleGroups = groups.slice(0, 36);
  const seasonLabel = calendarSeasonEl.selectedOptions[0]?.textContent ?? "selected window";
  calendarResultsTitleEl.textContent = calendarMonthFilter === ""
    ? `${calendarDisplayYear} planting windows`
    : `${calendarMonthLabels[Number(calendarMonthFilter)]} detail`;
  calendarSummaryEl.textContent = `Showing ${groups.length} action rows for ${plantFocusLabel}, ${seasonLabel.toLowerCase()}, ${methodLabel.toLowerCase()}.`;
  calendarEventsEl.innerHTML = visibleGroups.map(renderCalendarGroup).join("")
    + (groups.length > visibleGroups.length
      ? `<p class="calendar-limit-note">Showing the first ${visibleGroups.length} action rows. Narrow the filters to see a tighter list.</p>`
      : "");
  calendarEmptyEl.hidden = groups.length > 0;
}

async function handleCalendarSubmit(event) {
  event.preventDefault();
  const zip = calendarZipEl.value.trim();
  if (!/^\d{5}$/.test(zip)) {
    calendarStatusEl.textContent = "Enter a five-digit U.S. ZIP code.";
    return;
  }
  calendarStatusEl.textContent = "Looking up your USDA hardiness zone...";
  try {
    const [zoneData] = await Promise.all([lookupZone(zip), ensureCoreData()]);
    calendarZoneData = zoneData;
    calendarDisplayYear = calendarPlanningYear(calendarZoneData);
    calendarFrost = estimateCalendarFrost(calendarZoneData, calendarDisplayYear);
    calendarEvents = buildCalendarEvents(calendarFrost);
    calendarMonthFilter = "";
    calendarStatusEl.textContent = `Zone ${calendarZoneData.zone} calendar ready. Use preset views, plant groups, and varieties to narrow the timeline.`;
    renderCalendar();
    trackEvent("zip_submit", {
      tool: "calendar",
      zone: calendarZoneData.zone
    });
    trackEvent("calendar_view", {
      source: "zip_submit",
      zone: calendarZoneData.zone,
      event_count: calendarEvents.length
    });
  } catch (error) {
    calendarZoneData = null;
    calendarFrost = null;
    calendarEvents = [];
    calendarStatusEl.textContent = "The zone lookup did not respond. Try again in a moment.";
    renderCalendar();
  }
}

function initializeZoneMap() {
  renderZoneMapRegions();
  renderZoneMapZoneButtons();
  renderZoneMapZoneDetail(zoneMapSelectedZone);
  initializeZoneMapPlantOverlayPicker();
  renderZoneMapPlants();
  updateZoneMapTransform();
  if (!document.getElementById("zone-map-view")?.hidden) ensureZoneMapLiveMap();
  zoneMapFormEl.addEventListener("submit", runZoneMapLookup);
  zoneMapZipEl.addEventListener("input", () => {
    zoneMapUseMatcherEl.disabled = true;
    zoneMapUseCalendarEl.disabled = true;
    zoneMapStatusEl.textContent = /^\d{5}$/.test(zoneMapZipEl.value.trim())
      ? "Ready to look up this ZIP."
      : "Enter a ZIP code to place your garden on the map.";
    renderZoneMapPlantOverlaySummary();
  });
  const handleZoneMapPlantOverlayChange = () => {
    setZoneMapPlantRangeOverlay(zoneMapPlantOverlaySelectEl.value, "picker");
  };
  zoneMapPlantOverlaySelectEl.addEventListener("input", handleZoneMapPlantOverlayChange);
  zoneMapPlantOverlaySelectEl.addEventListener("change", handleZoneMapPlantOverlayChange);
  zoneMapExpandEl.addEventListener("click", () => {
    const isOpening = !zoneMapCanvasEl.classList.contains("is-fullscreen");
    setZoneMapFullscreen(isOpening);
    trackEvent("zone_map_expand", { state: isOpening ? "open" : "closed" });
  });
  zoneMapCloseEl.addEventListener("click", () => {
    setZoneMapFullscreen(false);
    trackEvent("zone_map_expand", { state: "closed" });
  });
  zoneMapZoomInEl.addEventListener("click", () => {
    setZoneMapScale(zoneMapScale + 0.25);
    trackEvent("zone_map_zoom", { level: zoneMapScale });
  });
  zoneMapZoomOutEl.addEventListener("click", () => {
    setZoneMapScale(zoneMapScale - 0.25);
    trackEvent("zone_map_zoom", { level: zoneMapScale });
  });
  zoneMapResetEl.addEventListener("click", () => {
    resetZoneMapView();
    trackEvent("zone_map_zoom", { level: zoneMapScale, action: "reset" });
  });
  zoneMapImageStageEl.addEventListener("pointerdown", (event) => {
    if (!zoneMapCanvasEl.classList.contains("is-fullscreen") && zoneMapScale <= 1) return;
    zoneMapPointer = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      panX: zoneMapPanX,
      panY: zoneMapPanY
    };
    if (zoneMapImageStageEl.setPointerCapture) zoneMapImageStageEl.setPointerCapture(event.pointerId);
    zoneMapImageStageEl.style.cursor = "grabbing";
  });
  zoneMapImageStageEl.addEventListener("pointermove", (event) => {
    if (!zoneMapPointer || event.pointerId !== zoneMapPointer.id) return;
    zoneMapPanX = clamp(zoneMapPointer.panX + event.clientX - zoneMapPointer.x, -520, 520);
    zoneMapPanY = clamp(zoneMapPointer.panY + event.clientY - zoneMapPointer.y, -380, 380);
    updateZoneMapTransform();
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
    zoneMapImageStageEl.addEventListener(eventName, (event) => {
      if (!zoneMapPointer || event.pointerId !== zoneMapPointer.id) return;
      if (
        zoneMapImageStageEl.releasePointerCapture
        && (!zoneMapImageStageEl.hasPointerCapture || zoneMapImageStageEl.hasPointerCapture(event.pointerId))
      ) {
        zoneMapImageStageEl.releasePointerCapture(event.pointerId);
      }
      zoneMapPointer = null;
      updateZoneMapTransform();
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && zoneMapCanvasEl.classList.contains("is-fullscreen")) {
      setZoneMapFullscreen(false);
    }
  });
  zoneMapUseMatcherEl.addEventListener("click", () => {
    const zip = zoneMapZipEl.value.trim();
    if (!/^\d{5}$/.test(zip)) return;
    applyMatcherPlanParams({ ...matcherPlanParamsFromForm(), zip });
    setActiveView("matcher");
    const matcherUrl = matcherUrlForPlan(matcherPlanParamsFromForm());
    history.replaceState(null, "", `${matcherUrl.pathname}${matcherUrl.search}`);
    runMatcher({ writeUrl: true, scrollToResults: true });
  });
  zoneMapUseCalendarEl.addEventListener("click", async () => {
    const zip = zoneMapZipEl.value.trim();
    if (!/^\d{5}$/.test(zip)) return;
    await ensureCalendarReady();
    calendarZipEl.value = zip;
    setActiveView("calendar");
    history.replaceState(null, "", "#calendar");
    handleCalendarSubmit({ preventDefault() {} });
  });
}

function initializeCalendar() {
  let calendarResizeTimer = null;
  calendarFormEl.addEventListener("submit", handleCalendarSubmit);
  const handleCalendarPlantGroupChange = () => {
    calendarVarietyEl.value = "all";
    calendarExpandVarietiesEl.checked = false;
    calendarMonthFilter = "";
    renderCalendar();
    trackEvent("filter_apply", {
      tool: "calendar",
      action: "plant_group",
      value: calendarPlantClassEl.value
    });
  };
  const handleCalendarVarietyChange = () => {
    calendarMonthFilter = "";
    renderCalendar();
    trackEvent("filter_apply", {
      tool: "calendar",
      action: "variety",
      value: calendarVarietyEl.value === "all" ? "all" : "selected"
    });
  };
  calendarPlantClassEl.addEventListener("input", handleCalendarPlantGroupChange);
  calendarPlantClassEl.addEventListener("change", handleCalendarPlantGroupChange);
  calendarVarietyEl.addEventListener("input", handleCalendarVarietyChange);
  calendarVarietyEl.addEventListener("change", handleCalendarVarietyChange);
  calendarExpandVarietiesEl.addEventListener("input", () => {
    renderCalendar();
    trackEvent("filter_apply", {
      tool: "calendar",
      action: calendarExpandVarietiesEl.checked ? "expand_varieties" : "collapse_varieties"
    });
  });
  calendarPrintEl.addEventListener("click", () => {
    trackEvent("print_calendar", {
      zone: calendarZoneData?.zone
    });
    window.print();
  });
  [calendarSeasonEl, calendarMethodEl].forEach((control) => {
    control.addEventListener("input", () => {
      calendarMonthFilter = "";
      renderCalendar();
      trackEvent("filter_apply", {
        tool: "calendar",
        action: control === calendarSeasonEl ? "season" : "method",
        value: control.value
      });
    });
  });
  window.addEventListener("resize", () => {
    if (!calendarFrost) return;
    clearTimeout(calendarResizeTimer);
    calendarResizeTimer = setTimeout(renderCalendar, 180);
  });
  renderCalendar();
}

function renderScreenerPills(values, formatter = (value) => value, limit = 3) {
  const visible = values.slice(0, limit);
  const hiddenCount = values.length - visible.length;
  return `
    <span class="screener-pill-row">
      ${visible.map((value) => `<span class="screener-pill">${escapeHtml(formatter(value))}</span>`).join("")}
      ${hiddenCount > 0 ? `<span class="screener-pill is-muted">+${hiddenCount}</span>` : ""}
    </span>
  `;
}

function screenerSearchText(plant) {
  const metrics = metricFor(plant);
  const screening = screeningProfile(plant, metrics);
  return [
    plant.name,
    plant.type,
    plant.zones.join(" "),
    plant.sun.join(" "),
    plant.soils.join(" "),
    plant.water,
    plant.harvest,
    plant.notes,
    plant.query,
    partnerName(plant.partner),
    plantGroupLabel(plant),
    metrics.horizonLabel,
    metrics.dataMethod,
    metrics.display?.firstOutput,
    metrics.display?.fullOutput,
    metrics.display?.spacing,
    metrics.display?.plantingDepth,
    metrics.display?.plantingDepthNote,
    metrics.display?.containerMin,
    metrics.display?.containerNote,
    metrics.display?.matureSize,
    metrics.display?.output,
    metrics.display?.yieldLbs,
    metrics.display?.tenYearYieldLbs,
    metrics.yieldLbsMethod,
    metrics.display?.lifespan,
    metrics.display?.harvestWindow,
    metrics.display?.difficulty,
    metrics.display?.reliability,
    metrics.display?.confidence,
    metrics.deerResistanceLabel,
    metrics.deerResistanceNote,
    metrics.jugloneToleranceLabel,
    metrics.jugloneToleranceNote,
    screening.ph,
    screening.pollination,
    screening.support,
    screening.deer,
    screening.pestPressure,
    screening.diseasePressure,
    screening.chill,
    screening.heat,
    screening.storage,
    screening.warning,
    ...plant.goals.map(formatGoal),
    ...plant.traits
  ].join(" ").toLowerCase();
}

function plantMatchesScreener(plant) {
  const metrics = metricFor(plant);
  const query = screenerSearchEl.value.trim().toLowerCase();
  const zone = screenerZoneEl.value;
  const flag = screenerFlagEl.value;
  const deerFilter = screenerDeerEl?.value ?? "";
  const jugloneFilter = screenerJugloneEl?.value ?? "";
  const minYield = numberFromControl(screenerMinYieldEl);
  const minYieldSpace = numberFromControl(screenerMinYieldSpaceEl);
  const maxFirstOutput = numberFromControl(screenerMaxFirstOutputEl);
  const maxContainer = numberFromControl(screenerMaxContainerEl);
  const maxDifficulty = numberFromControl(screenerMaxDifficultyEl);
  const minReliability = numberFromControl(screenerMinReliabilityEl);
  const maxHeight = numberFromControl(screenerMaxHeightEl);
  const minDensity = numberFromControl(screenerMinDensityEl);

  if (query && !screenerSearchText(plant).includes(query)) return false;
  if (screenerTypeEl.value && plant.type !== screenerTypeEl.value) return false;
  if (zone) {
    const zoneValue = zoneToNumber(zone);
    if (zoneValue < zoneToNumber(plant.zones[0]) || zoneValue > zoneToNumber(plant.zones[1])) return false;
  }
  if (screenerSunEl.value && !plant.sun.includes(screenerSunEl.value)) return false;
  if (screenerSoilEl.value && !plant.soils.includes(screenerSoilEl.value)) return false;
  if (screenerWaterEl.value && plant.water !== screenerWaterEl.value) return false;
  if (screenerGoalEl.value && !goalMatchesPlant(plant, screenerGoalEl.value)) return false;
  if (screenerHorizonEl.value && metrics.horizonKey !== screenerHorizonEl.value) return false;
  if (screenerContainerEl.value) {
    const selectMaxContainer = Number(screenerContainerEl.value);
    if (!Number.isFinite(metrics.containerMinGallons) || metrics.containerMinGallons > selectMaxContainer) return false;
  }
  if (minYield !== null && (!Number.isFinite(yieldMidpoint(metrics)) || yieldMidpoint(metrics) < minYield)) return false;
  if (minYieldSpace !== null && (!Number.isFinite(yieldPer100SqFt(metrics)) || yieldPer100SqFt(metrics) < minYieldSpace)) return false;
  if (maxFirstOutput !== null && (!Number.isFinite(firstOutputYears(metrics)) || firstOutputYears(metrics) > maxFirstOutput)) return false;
  if (maxContainer !== null && (!Number.isFinite(metrics.containerMinGallons) || metrics.containerMinGallons > maxContainer)) return false;
  if (maxDifficulty !== null && (!Number.isFinite(metrics.difficultyScore) || metrics.difficultyScore > maxDifficulty)) return false;
  if (minReliability !== null && (!Number.isFinite(metrics.reliabilityScore) || metrics.reliabilityScore < minReliability)) return false;
  if (maxHeight !== null && (!Number.isFinite(matureHeightMidpoint(metrics)) || matureHeightMidpoint(metrics) > maxHeight)) return false;
  if (minDensity !== null && (!Number.isFinite(densityMidpoint(metrics)) || densityMidpoint(metrics) < minDensity)) return false;
  if (screenerConfidenceEl.value === "medium" && (confidenceRank[metrics.dataConfidence] ?? 0) < 2) return false;
  if (screenerConfidenceEl.value === "low" && metrics.dataConfidence !== "low") return false;
  if (screenerPartnerEl.value && plant.partner !== screenerPartnerEl.value) return false;
  if (flag === "native" && !hasNativeCue(plant)) return false;
  if ((flag === "low-water" || flag === "low-maintenance") && !hasLowWaterCue(plant)) return false;
  if (flag === "pairings" && relationshipCount(plant) === 0) return false;
  if (flag === "watchlist" && !screenerWatchlistIds.has(plant.id)) return false;
  if (deerFilter) {
    const deer = deerResistanceValue(metrics);
    if (deerFilter === "better" && !["rarely-damaged", "seldom-damaged"].includes(deer)) return false;
    if (deerFilter === "avoid-frequent" && deer === "frequently-damaged") return false;
    if (deerFilter === "rarely" && deer !== "rarely-damaged") return false;
  }
  if (jugloneFilter) {
    const juglone = jugloneToleranceValue(metrics);
    if (jugloneFilter === "tolerant" && juglone !== "tolerant") return false;
    if (jugloneFilter === "avoid-sensitive" && juglone === "sensitive") return false;
    if (jugloneFilter === "sensitive" && juglone !== "sensitive") return false;
  }
  return true;
}

function screenerSortValue(plant, key) {
  const metrics = metricFor(plant);
  if (key === "name") return plant.name.toLowerCase();
  if (key === "type") return plant.type.toLowerCase();
  if (key === "zone") return zoneToNumber(plant.zones[0]);
  if (key === "firstOutput") return firstOutputSortValue(metrics);
  if (key === "spacing") return spacingSortValue(metrics);
  if (key === "plantingDepth") return metrics.plantingDepthInMax ?? metrics.plantingDepthInMin ?? 999;
  if (key === "container") return metrics.containerMinGallons ?? 999;
  if (key === "output") return outputSortValue(metrics);
  if (key === "yieldPerSpace") return yieldPer100SqFt(metrics) ?? -1;
  if (key === "score") return reliabilityAdjustedYield(metrics) ?? difficultyAdjustedYield(metrics) ?? -1;
  if (key === "containerEfficiency") return containerEfficiency(metrics) ?? -1;
  if (key === "difficulty") return metrics.difficultyScore ?? 0;
  if (key === "reliability") return metrics.reliabilityScore ?? 0;
  if (key === "dataQuality") return (confidenceRank[metrics.dataConfidence] ?? 0) * 100 + (metrics.sourceKeys?.length ?? 0);
  if (key === "sun") return plant.sun.join(", ");
  if (key === "soil") return plant.soils.join(", ");
  if (key === "water") return waterRank[plant.water] ?? 0;
  if (key === "goals") return plant.goals.length;
  if (key === "harvest") return plant.harvest.toLowerCase();
  if (key === "traits") return plant.traits.join(", ").toLowerCase();
  if (key === "native") return hasNativeCue(plant) ? 1 : 0;
  if (key === "lowMaintenance") return hasLowWaterCue(plant) ? 1 : 0;
  if (key === "pairings") return relationshipCount(plant);
  if (key === "deer") return deerResistanceRank[deerResistanceValue(metrics)] ?? 0;
  if (key === "juglone") return jugloneToleranceRank[jugloneToleranceValue(metrics)] ?? 0;
  if (key === "screening") return screeningProfile(plant, metrics).warning;
  if (key === "partner") return partnerName(plant.partner).toLowerCase();
  return plant.name.toLowerCase();
}

function defaultScreenerDirection(key) {
  return ["goals", "native", "lowMaintenance", "pairings", "deer", "juglone", "output", "yieldPerSpace", "score", "containerEfficiency", "reliability", "dataQuality"].includes(key) ? "desc" : "asc";
}

function screenerSortIndicator(key, direction) {
  if (["name", "type", "harvest", "traits", "partner", "sun", "soil"].includes(key)) {
    return direction === "asc" ? "Asc A-Z" : "Desc Z-A";
  }
  if (key === "firstOutput") return direction === "asc" ? "Fast first" : "Slow first";
  if (key === "difficulty") return direction === "asc" ? "Easy first" : "Hard first";
  if (key === "container") return direction === "asc" ? "Small first" : "Large first";
  if (key === "plantingDepth") return direction === "asc" ? "Shallow first" : "Deep first";
  if (key === "deer") return direction === "asc" ? "Browse risk first" : "Deer-resistant first";
  if (key === "juglone") return direction === "asc" ? "Sensitive first" : "Walnut-fit first";
  return direction === "asc" ? "Low first" : "High first";
}

function sortScreenerPlants(entries) {
  return entries.sort((a, b) => {
    const aValue = screenerSortValue(a, screenerSort.key);
    const bValue = screenerSortValue(b, screenerSort.key);
    const direction = screenerSort.direction === "asc" ? 1 : -1;
    if (typeof aValue === "number" && typeof bValue === "number") {
      return (aValue - bValue) * direction || a.name.localeCompare(b.name);
    }
    return String(aValue).localeCompare(String(bValue)) * direction || a.name.localeCompare(b.name);
  });
}

function groupCounts(entries) {
  return entries.reduce((counts, plant) => {
    const label = plantGroupLabel(plant);
    counts.set(label, (counts.get(label) ?? 0) + 1);
    return counts;
  }, new Map());
}

function activeScreenerColumns() {
  const preset = screenerColumnPresetEl?.value || "core";
  return new Set(screenerColumnPresets[preset] ?? screenerColumnPresets.core);
}

function visibleScreenerColumnCount() {
  return activeScreenerColumns().size;
}

function updateScreenerColumnVisibility() {
  const active = activeScreenerColumns();
  document.querySelectorAll("[data-screener-col]").forEach((element) => {
    element.hidden = !active.has(element.dataset.screenerCol);
  });
}

function sortGroupedScreenerPlants(entries) {
  return [...entries].sort((a, b) => {
    const aGroup = plantGroupLabel(a);
    const bGroup = plantGroupLabel(b);
    const groupCompare = aGroup.localeCompare(bGroup);
    if (groupCompare !== 0) return groupCompare;
    return sortScreenerPlants([a, b])[0].id === a.id ? -1 : 1;
  });
}

function renderScreenerGroupedRows(entries, counts) {
  let currentGroup = "";
  return entries.map((plant) => {
    const group = plantGroupLabel(plant);
    const heading = group === currentGroup
      ? ""
      : `<tr class="screener-group-row"><td colspan="${visibleScreenerColumnCount()}"><strong>${escapeHtml(group)}</strong><span>${counts.get(group) ?? 0} ${(counts.get(group) ?? 0) === 1 ? "variety" : "varieties"}</span></td></tr>`;
    currentGroup = group;
    return `${heading}${renderScreenerRow(plant)}`;
  }).join("");
}

function updateScreenerSortUI() {
  screenerSortButtons.forEach((button) => {
    const isActive = button.dataset.screenerSort === screenerSort.key;
    const indicator = button.querySelector(".sort-indicator");
    const header = button.closest("th");
    if (indicator) indicator.textContent = isActive ? screenerSortIndicator(screenerSort.key, screenerSort.direction) : "";
    if (header) header.setAttribute("aria-sort", isActive ? (screenerSort.direction === "asc" ? "ascending" : "descending") : "none");
  });
}

function renderScreenerSourceCell(plant) {
  const sourceAction = sourceActionForPlant(plant);
  const showSourceLinks = Boolean(screenerShowSourceLinksEl?.checked);
  return `
    <span>${escapeHtml(partnerName(plant.partner))}</span>
    ${showSourceLinks && sourceAction
      ? `<a class="screener-source-link" href="${escapeHtml(sourceAction.href)}" target="_blank" rel="${sourceAction.rel}" data-partner-placement="screener_source">${escapeHtml(sourceAction.label)}</a>`
      : ""}
  `;
}

function renderScreenerScoreCell(metrics) {
  const yieldSpace = yieldPer100SqFt(metrics);
  const reliabilityYield = reliabilityAdjustedYield(metrics);
  const easyYield = difficultyAdjustedYield(metrics);
  const containerYield = containerEfficiency(metrics);
  return `
    <span class="screener-score-list">
      <span><strong>${escapeHtml(formatCompactNumber(yieldSpace))}</strong> lb/100 sq ft</span>
      <span>${escapeHtml(formatCompactNumber(reliabilityYield, 1))} reliability-adj.</span>
      <span>${escapeHtml(formatCompactNumber(easyYield, 1))} difficulty-adj.</span>
      <span>${escapeHtml(formatCompactNumber(containerYield, 2))} lb/gal</span>
    </span>
  `;
}

function renderScreenerDataCell(metrics) {
  const sourceCount = metrics.sourceKeys?.length ?? 0;
  const confidence = metrics.display?.confidence ?? sentenceCase(metrics.dataConfidence ?? "unknown");
  const method = metrics.dataMethod ? sentenceCase(String(metrics.dataMethod).replaceAll("-", " ")) : "Method not listed";
  const reviewed = metrics.lastReviewed ? `Reviewed ${metrics.lastReviewed}` : "Review date not listed";
  const tone = metrics.dataConfidence === "low" ? "is-warning" : "is-positive";
  return `
    <span class="screener-data-cell" title="${escapeHtml(`${method}. ${reviewed}. ${sourceCount} source${sourceCount === 1 ? "" : "s"}.`)}">
      <span class="screener-pill ${tone}">${escapeHtml(confidence)}</span>
      <span class="screener-metric-note">${sourceCount} source${sourceCount === 1 ? "" : "s"}</span>
      <span class="screener-metric-note">${escapeHtml(reviewed)}</span>
    </span>
  `;
}

function renderScreeningCueCell(plant, metrics) {
  const screening = screeningProfile(plant, metrics);
  return `
    <span class="screener-cue-list" title="Screening cues are compact planning flags. Verify cultivar-specific needs before buying or planting.">
      <span><strong>pH</strong> ${escapeHtml(screening.ph)}</span>
      <span><strong>Pollination</strong> ${escapeHtml(screening.pollination)}</span>
      <span><strong>Support</strong> ${escapeHtml(screening.support)}</span>
      <span><strong>Site risk</strong> deer ${escapeHtml(screening.deer)}, walnut ${escapeHtml(screening.juglone)}</span>
      <span><strong>Risk</strong> pests ${escapeHtml(screening.pestPressure)}, disease ${escapeHtml(screening.diseasePressure)}</span>
      <span><strong>Climate</strong> ${escapeHtml(screening.heat)}; ${escapeHtml(screening.chill)}</span>
      <span><strong>Use</strong> ${escapeHtml(screening.storage)}; ${escapeHtml(screening.warning)}</span>
    </span>
  `;
}

function renderScreenerRow(plant) {
  const metrics = metricFor(plant);
  const pairings = relationshipCount(plant);
  const native = hasNativeCue(plant);
  const lowWater = hasLowWaterCue(plant);
  const yieldSpace = yieldPer100SqFt(metrics);
  const isCompared = screenerCompareIds.has(plant.id);
  const isWatched = screenerWatchlistIds.has(plant.id);
  const difficultyTone = metrics.riskLevel === "lower"
    ? "is-positive"
    : metrics.riskLevel === "elevated"
      ? "is-warning"
      : "";
  return `
    <tr>
      <td class="screener-name-cell" data-label="Name" data-screener-col="name">
        <span class="screener-row-actions">
          <label>
            <input class="screener-compare-input" type="checkbox" value="${escapeHtml(plant.id)}" ${isCompared ? "checked" : ""} />
            Compare
          </label>
          <button class="screener-watch-button ${isWatched ? "is-active" : ""}" type="button" data-watch-plant="${escapeHtml(plant.id)}" aria-pressed="${isWatched ? "true" : "false"}" title="${isWatched ? "Remove from garden" : "Save to garden"}">${isWatched ? "In garden" : "Save to garden"}</button>
        </span>
        <a class="screener-plant-link" href="${plantPagePath(plant)}">${escapeHtml(plant.name)}</a>
        <span>${escapeHtml(plant.query ?? plant.id)}</span>
      </td>
      <td data-label="Type/form" data-screener-col="type">${escapeHtml(plant.type)}</td>
      <td data-label="Zone range" data-screener-col="zone"><strong>${escapeHtml(plant.zones[0])}-${escapeHtml(plant.zones[1])}</strong></td>
      <td data-label="First output" data-screener-col="firstOutput">
        <span class="screener-pill">${escapeHtml(metricDisplayValue(metrics.display?.firstOutput))}</span>
        <span class="screener-metric-note">${escapeHtml(metrics.horizonLabel ?? "")}</span>
      </td>
      <td data-label="Spacing" data-screener-col="spacing">
        ${escapeHtml(metricDisplayValue(metrics.display?.spacing))}
        <span class="screener-metric-note">${escapeHtml(metrics.display?.matureSize ?? "")}</span>
      </td>
      <td data-label="Planting depth" data-screener-col="plantingDepth">
        ${escapeHtml(metricDisplayValue(metrics.display?.plantingDepth))}
        <span class="screener-metric-note">${escapeHtml(metrics.display?.plantingDepthNote ?? "")}</span>
      </td>
      <td data-label="Container min" data-screener-col="container">
        <span class="screener-pill">${escapeHtml(metricDisplayValue(metrics.display?.containerMin))}</span>
        <span class="screener-metric-note">${escapeHtml(metrics.display?.containerNote ?? "")}</span>
      </td>
      <td data-label="Yield (lbs)" data-screener-col="yield">
        <strong>${escapeHtml(metricDisplayValue(metrics.display?.yieldLbs))}</strong>
        <span class="screener-metric-note">${escapeHtml(metrics.display?.harvestWindow ?? "")}</span>
      </td>
      <td data-label="Yield / 100 sq ft" data-screener-col="yieldPerSpace">
        <strong>${escapeHtml(formatCompactNumber(yieldSpace))}</strong>
        <span class="screener-metric-note">${escapeHtml(formatCompactNumber(densityMidpoint(metrics), 1))} plants / 100 sq ft</span>
      </td>
      <td data-label="Scores" data-screener-col="score">${renderScreenerScoreCell(metrics)}</td>
      <td data-label="Difficulty" data-screener-col="difficulty">
        <span class="screener-pill ${difficultyTone}">${escapeHtml(metrics.display?.difficulty ?? "-")}</span>
        <span class="screener-metric-note">Risk ${escapeHtml(metrics.riskLevel ?? "-")}</span>
      </td>
      <td data-label="Reliability" data-screener-col="reliability">
        <span class="screener-pill">${escapeHtml(metrics.display?.reliability ?? "-")}</span>
        <span class="screener-metric-note">${escapeHtml(metrics.display?.maintenance ?? "")} maintenance</span>
      </td>
      <td data-label="Data" data-screener-col="data">${renderScreenerDataCell(metrics)}</td>
      <td data-label="Sun" data-screener-col="sun">${renderScreenerPills(plant.sun, sentenceCase)}</td>
      <td data-label="Soil" data-screener-col="soil">${renderScreenerPills(plant.soils, sentenceCase)}</td>
      <td data-label="Water" data-screener-col="water"><span class="screener-pill water-${escapeHtml(plant.water)}">${escapeHtml(sentenceCase(plant.water))}</span></td>
      <td data-label="Goals" data-screener-col="goals">${renderScreenerPills(plant.goals, formatGoal, 2)}</td>
      <td data-label="Harvest" data-screener-col="harvest">${escapeHtml(plant.harvest)}</td>
      <td data-label="Traits" data-screener-col="traits">${renderScreenerPills(plant.traits, (value) => value, 2)}</td>
      <td data-label="Native flag" data-screener-col="native"><span class="screener-pill ${native ? "is-positive" : "is-muted"}">${native ? "Yes" : "-"}</span></td>
      <td data-label="Low water" data-screener-col="lowWater"><span class="screener-pill ${lowWater ? "is-positive" : "is-muted"}">${lowWater ? "Yes" : "-"}</span></td>
      <td data-label="Pairings" data-screener-col="pairings"><span class="screener-count" title="${pairings} plant ${pairings === 1 ? "pairing" : "pairings"}">${pairings}</span></td>
      <td data-label="Deer" data-screener-col="deer">${renderSiteRiskCell("deer", metrics)}</td>
      <td data-label="Walnut" data-screener-col="juglone">${renderSiteRiskCell("juglone", metrics)}</td>
      <td data-label="Screening cues" data-screener-col="screening">${renderScreeningCueCell(plant, metrics)}</td>
      <td data-label="Source" data-screener-col="source">${renderScreenerSourceCell(plant)}</td>
      <td class="screener-profile-cell" data-label="Profile" data-screener-col="profile"><a class="screener-profile-link" href="${plantPagePath(plant)}">View profile</a></td>
    </tr>
  `;
}

function screenerPortfolioPlants() {
  return Array.from(screenerWatchlistIds)
    .map(plantById)
    .filter(Boolean);
}

function screenerPortfolioEntries() {
  return screenerPortfolioPlants().map((plant) => ({
    plant,
    metrics: metricFor(plant)
  }));
}

function renderScreenerPortfolioStats(entries) {
  if (!entries.length) {
    return `
      <div>
        <strong>0</strong>
        <span>saved plants</span>
      </div>
      <div>
        <strong>-</strong>
        <span>est. lb/year</span>
      </div>
      <div>
        <strong>-</strong>
        <span>avg first output</span>
      </div>
      <div>
        <strong>-</strong>
        <span>avg reliability</span>
      </div>
      <div>
        <strong>-</strong>
        <span>density leader</span>
      </div>
    `;
  }
  const totalYield = sumNumber(entries.map(({ metrics }) => yieldMidpoint(metrics)));
  const averageFirst = averageNumber(entries.map(({ metrics }) => firstOutputYears(metrics)));
  const averageReliability = averageNumber(entries.map(({ metrics }) => metrics.reliabilityScore));
  const averageDifficulty = averageNumber(entries.map(({ metrics }) => metrics.difficultyScore));
  const densityLeader = bestByNumber(entries, ({ metrics }) => yieldPer100SqFt(metrics));
  return `
    <div>
      <strong>${entries.length}</strong>
      <span>saved plant${entries.length === 1 ? "" : "s"}</span>
    </div>
    <div>
      <strong>${escapeHtml(formatCompactNumber(totalYield, 1))}</strong>
      <span>est. lb/year, 1 each</span>
    </div>
    <div>
      <strong>${escapeHtml(formatCompactNumber(averageFirst, 1))}</strong>
      <span>avg years to first output</span>
    </div>
    <div>
      <strong>${escapeHtml(formatCompactNumber(averageReliability, 1))}/5</strong>
      <span>avg reliability; risk ${escapeHtml(formatCompactNumber(averageDifficulty, 1))}/5</span>
    </div>
    <div>
      <strong title="${escapeHtml(densityLeader?.entry.plant.name ?? "")}">${escapeHtml(densityLeader?.entry.plant.name ?? "-")}</strong>
      <span>${escapeHtml(formatCompactNumber(densityLeader?.value, 0))} lb / 100 sq ft leader</span>
    </div>
  `;
}

function renderScreenerPortfolioRow({ plant, metrics }) {
  const screening = screeningProfile(plant, metrics);
  const isCompared = screenerCompareIds.has(plant.id);
  const score = reliabilityAdjustedYield(metrics) ?? difficultyAdjustedYield(metrics);
  return `
    <tr>
      <td data-label="Compare">
        <label class="screener-portfolio-check">
          <input class="screener-portfolio-compare-input" type="checkbox" value="${escapeHtml(plant.id)}" ${isCompared ? "checked" : ""} />
          Compare
        </label>
      </td>
      <td class="screener-portfolio-name" data-label="Plant">
        <a href="${plantPagePath(plant)}">${escapeHtml(plant.name)}</a>
        <span>${escapeHtml(plant.type)}</span>
      </td>
      <td data-label="First output">
        <strong>${escapeHtml(metricDisplayValue(metrics.display?.firstOutput))}</strong>
        <span>${escapeHtml(metrics.horizonLabel ?? "")}</span>
      </td>
      <td data-label="Yield">
        <strong>${escapeHtml(metricDisplayValue(metrics.display?.yieldLbs))}</strong>
        <span>${escapeHtml(metrics.display?.harvestWindow ?? "")}</span>
      </td>
      <td data-label="Density">
        <strong>${escapeHtml(formatCompactNumber(yieldPer100SqFt(metrics)))}</strong>
        <span>lb / 100 sq ft</span>
      </td>
      <td data-label="Score">
        <strong>${escapeHtml(formatCompactNumber(score, 1))}</strong>
        <span>adjusted yield</span>
      </td>
      <td data-label="Container">
        <strong>${escapeHtml(metricDisplayValue(metrics.display?.containerMin))}</strong>
        <span>${escapeHtml(metrics.display?.containerNote ?? "")}</span>
      </td>
      <td data-label="Risk">
        <strong>${escapeHtml(metrics.display?.difficulty ?? "-")}</strong>
        <span>Reliability ${escapeHtml(metrics.display?.reliability ?? "-")}</span>
      </td>
      <td data-label="Site risk">
        <strong>${escapeHtml(deerResistanceLabel(metrics))}</strong>
        <span>Walnut: ${escapeHtml(jugloneToleranceLabel(metrics))}</span>
      </td>
      <td data-label="Data">${renderScreenerDataCell(metrics)}</td>
      <td data-label="Cue">
        <strong>${escapeHtml(screening.warning)}</strong>
        <span>${escapeHtml(screening.support)}; ${escapeHtml(screening.pollination)}</span>
      </td>
      <td data-label="Actions" class="screener-portfolio-action-cell">
        <a href="${plantPagePath(plant)}">Profile</a>
        <button type="button" data-portfolio-remove="${escapeHtml(plant.id)}">Remove</button>
      </td>
    </tr>
  `;
}

function renderScreenerPortfolioTable(entries) {
  if (!entries.length) {
    return `
      <div class="screener-portfolio-empty">
        <strong>No saved plants yet.</strong>
        <span>Use Save to garden on any Screener row to build a local portfolio for comparison.</span>
      </div>
    `;
  }
  return `
    <div class="screener-portfolio-table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">Compare</th>
            <th scope="col">Plant</th>
            <th scope="col">First output</th>
            <th scope="col">Yield</th>
            <th scope="col">Density</th>
            <th scope="col">Score</th>
            <th scope="col">Container</th>
            <th scope="col">Risk</th>
            <th scope="col">Site risk</th>
            <th scope="col">Data</th>
            <th scope="col">Cue</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${entries.map(renderScreenerPortfolioRow).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderScreenerPortfolioPanel() {
  if (!screenerPortfolioPanelEl || !screenerPortfolioStatsEl || !screenerPortfolioTableEl) return;
  const entries = screenerPortfolioEntries();
  const count = entries.length;
  if (screenerPortfolioCountEl) screenerPortfolioCountEl.textContent = String(count);
  if (screenerPortfolioTitleEl) {
    screenerPortfolioTitleEl.textContent = count
      ? `${count} saved plant${count === 1 ? "" : "s"}`
      : "Saved plant portfolio";
  }
  if (screenerPortfolioNoteEl) {
    screenerPortfolioNoteEl.textContent = count
      ? "Saved locally on this device. Portfolio numbers are estimates for quick comparison, not purchase or planting guarantees."
      : "Save plants from the table to compare the numbers that matter.";
  }
  screenerPortfolioStatsEl.innerHTML = renderScreenerPortfolioStats(entries);
  screenerPortfolioTableEl.innerHTML = renderScreenerPortfolioTable(entries);
  if (screenerPortfolioCompareEl) {
    screenerPortfolioCompareEl.disabled = count === 0;
    screenerPortfolioCompareEl.textContent = count > screenerCompareLimit
      ? `Compare first ${screenerCompareLimit}`
      : "Compare portfolio";
  }
  if (screenerPortfolioFilterEl) {
    screenerPortfolioFilterEl.disabled = count === 0;
    screenerPortfolioFilterEl.textContent = screenerFlagEl?.value === "watchlist" ? "Showing portfolio" : "Show portfolio";
  }
  if (screenerPortfolioExportEl) screenerPortfolioExportEl.disabled = count === 0;
  if (screenerPortfolioClearEl) screenerPortfolioClearEl.disabled = count === 0;
  syncScreenerCompareInputs();
}

function gardenPlannerQuantityForPlant(plantId) {
  const value = Number(gardenPlannerQuantities[plantId]);
  if (!Number.isFinite(value) || value < 1) return 1;
  return Math.round(clamp(value, 1, 999));
}

function normalizeGardenPlannerQuantities() {
  const normalized = {};
  screenerWatchlistIds.forEach((plantId) => {
    normalized[plantId] = gardenPlannerQuantityForPlant(plantId);
  });
  gardenPlannerQuantities = normalized;
}

function loadGardenPlannerQuantities() {
  try {
    const raw = localStorage.getItem(gardenPlannerQuantityStorageKey);
    const parsed = raw ? JSON.parse(raw) : {};
    gardenPlannerQuantities = Object.fromEntries(
      Object.entries(parsed)
        .filter(([plantId]) => plantById(plantId))
        .map(([plantId, value]) => [plantId, Math.round(clamp(Number(value), 1, 999))])
        .filter(([, value]) => Number.isFinite(value))
    );
  } catch {
    gardenPlannerQuantities = {};
  }
  normalizeGardenPlannerQuantities();
}

function saveGardenPlannerQuantities() {
  try {
    localStorage.setItem(gardenPlannerQuantityStorageKey, JSON.stringify(gardenPlannerQuantities));
  } catch {
    // Keep the in-memory planner usable even if storage is unavailable.
  }
}

function cleanGardenPlannerLayoutPosition(position) {
  if (!position || typeof position !== "object") return null;
  const x = Number(position.x);
  const y = Number(position.y);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return {
    x: clamp(x, 3, 97),
    y: clamp(y, 3, 97)
  };
}

function gardenPlannerLayoutInstanceId(plantId, index = 1) {
  return `${plantId}__${Math.max(1, Math.round(Number(index) || 1))}`;
}

function gardenPlannerLayoutPlantId(layoutId) {
  const match = String(layoutId ?? "").match(/^(.+)__(\d+)$/);
  return match ? match[1] : String(layoutId ?? "");
}

function gardenPlannerLayoutInstanceIndex(layoutId) {
  const match = String(layoutId ?? "").match(/^(.+)__(\d+)$/);
  return match ? Math.max(1, Math.round(Number(match[2]) || 1)) : 1;
}

function normalizeGardenPlannerLayoutId(layoutId) {
  const plantId = gardenPlannerLayoutPlantId(layoutId);
  if (!plantById(plantId)) return null;
  const index = gardenPlannerLayoutInstanceIndex(layoutId);
  return gardenPlannerLayoutInstanceId(plantId, index);
}

function gardenPlannerLayoutIdsForPlant(plantId) {
  const quantity = gardenPlannerQuantityForPlant(plantId);
  return Array.from({ length: quantity }, (_, index) => gardenPlannerLayoutInstanceId(plantId, index + 1));
}

function gardenPlannerLayoutIdIsActive(layoutId) {
  const normalizedId = normalizeGardenPlannerLayoutId(layoutId);
  if (!normalizedId) return false;
  const plantId = gardenPlannerLayoutPlantId(normalizedId);
  const index = gardenPlannerLayoutInstanceIndex(normalizedId);
  return screenerWatchlistIds.has(plantId) && index <= gardenPlannerQuantityForPlant(plantId);
}

function clearGardenPlannerLayoutForPlant(plantId) {
  Object.keys(gardenPlannerLayout).forEach((layoutId) => {
    if (gardenPlannerLayoutPlantId(layoutId) === plantId) delete gardenPlannerLayout[layoutId];
  });
  if (gardenPlannerSelectedLayoutId && gardenPlannerLayoutPlantId(gardenPlannerSelectedLayoutId) === plantId) {
    gardenPlannerSelectedLayoutId = null;
  }
}

function normalizeGardenPlannerLayout() {
  const normalized = {};
  screenerWatchlistIds.forEach((plantId) => {
    gardenPlannerLayoutIdsForPlant(plantId).forEach((layoutId, index) => {
      const legacyPosition = index === 0 ? cleanGardenPlannerLayoutPosition(gardenPlannerLayout[plantId]) : null;
      const position = cleanGardenPlannerLayoutPosition(gardenPlannerLayout[layoutId]) ?? legacyPosition;
      if (position) normalized[layoutId] = position;
    });
  });
  gardenPlannerLayout = normalized;
  if (gardenPlannerSelectedLayoutId && !gardenPlannerLayout[gardenPlannerSelectedLayoutId]) {
    gardenPlannerSelectedLayoutId = null;
  }
}

function loadGardenPlannerLayout() {
  try {
    const raw = localStorage.getItem(gardenPlannerLayoutStorageKey);
    const parsed = raw ? JSON.parse(raw) : {};
    gardenPlannerLayout = Object.fromEntries(
      Object.entries(parsed)
        .map(([layoutId, position]) => [normalizeGardenPlannerLayoutId(layoutId), cleanGardenPlannerLayoutPosition(position)])
        .filter(([layoutId, position]) => layoutId && position)
    );
  } catch {
    gardenPlannerLayout = {};
  }
  normalizeGardenPlannerLayout();
}

function saveGardenPlannerLayout() {
  try {
    localStorage.setItem(gardenPlannerLayoutStorageKey, JSON.stringify(gardenPlannerLayout));
  } catch {
    // Layout positions are local convenience data only.
  }
}

function setGardenPlannerLayoutPosition(layoutId, x, y, options = {}) {
  const normalizedId = normalizeGardenPlannerLayoutId(layoutId);
  if (!normalizedId || !gardenPlannerLayoutIdIsActive(normalizedId)) return false;
  const position = cleanGardenPlannerLayoutPosition({ x, y });
  if (!position) return false;
  const previous = cleanGardenPlannerLayoutPosition(gardenPlannerLayout[normalizedId]);
  const changed = !previous || Math.abs(previous.x - position.x) > 0.1 || Math.abs(previous.y - position.y) > 0.1;
  gardenPlannerLayout[normalizedId] = position;
  gardenPlannerSelectedLayoutId = normalizedId;
  saveGardenPlannerLayout();
  if (changed && options.render !== false) renderGardenPlannerSummarySections();
  return changed;
}

function removeGardenPlannerLayoutPosition(layoutId, options = {}) {
  const normalizedId = normalizeGardenPlannerLayoutId(layoutId);
  if (!normalizedId || !gardenPlannerLayout[normalizedId]) return false;
  delete gardenPlannerLayout[normalizedId];
  if (gardenPlannerSelectedLayoutId === normalizedId) gardenPlannerSelectedLayoutId = null;
  saveGardenPlannerLayout();
  if (options.render !== false) renderGardenPlannerSummarySections();
  return true;
}

function clearGardenPlannerLayout(options = {}) {
  gardenPlannerLayout = {};
  gardenPlannerSelectedLayoutId = null;
  saveGardenPlannerLayout();
  if (options.render !== false) renderGardenPlannerSummarySections();
}

function cleanGardenPlannerNumber(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return clamp(number, min, max);
}

function cleanGardenPlannerZone(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  return /^[2-9][ab]$|^1[01][ab]$/.test(normalized) ? normalized : "7b";
}

function populateGardenPlannerZoneOptions() {
  if (!gardenPlannerZoneEl || gardenPlannerZoneEl.options.length) return;
  const options = [];
  for (let zone = 2; zone <= 11; zone += 1) {
    ["a", "b"].forEach((half) => {
      const value = `${zone}${half}`;
      options.push(`<option value="${value}">Zone ${zone}${half}</option>`);
    });
  }
  gardenPlannerZoneEl.innerHTML = options.join("");
}

function loadGardenPlannerSettings() {
  try {
    const raw = localStorage.getItem(gardenPlannerSettingsStorageKey);
    const parsed = raw ? JSON.parse(raw) : {};
    gardenPlannerSettings = {
      zip: String(parsed.zip ?? "").replace(/\D+/g, "").slice(0, 5),
      zone: cleanGardenPlannerZone(parsed.zone),
      bedLength: cleanGardenPlannerNumber(parsed.bedLength, 8, 1, 200),
      bedWidth: cleanGardenPlannerNumber(parsed.bedWidth, 4, 1, 200),
      bedCount: Math.round(cleanGardenPlannerNumber(parsed.bedCount, 1, 1, 50)),
      sun: ["full", "partial", "shade"].includes(parsed.sun) ? parsed.sun : "full",
      soil: ["loam", "sandy", "clay"].includes(parsed.soil) ? parsed.soil : "loam",
      water: ["low", "medium", "high"].includes(parsed.water) ? parsed.water : "medium",
      mode: ["in-ground", "containers", "mixed"].includes(parsed.mode) ? parsed.mode : "in-ground",
      deerPressure: ["ignore", "deer-pressure"].includes(parsed.deerPressure) ? parsed.deerPressure : "ignore",
      walnut: ["ignore", "near-walnut"].includes(parsed.walnut) ? parsed.walnut : "ignore"
    };
  } catch {
    gardenPlannerSettings = {
      zip: "",
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
    };
  }
}

function saveGardenPlannerSettings() {
  try {
    localStorage.setItem(gardenPlannerSettingsStorageKey, JSON.stringify(gardenPlannerSettings));
  } catch {
    // Planner settings are nice to have; the UI still works without storage.
  }
}

function applyGardenPlannerSettingsToControls() {
  populateGardenPlannerZoneOptions();
  if (gardenPlannerZipEl) gardenPlannerZipEl.value = gardenPlannerSettings.zip;
  if (gardenPlannerZoneEl) gardenPlannerZoneEl.value = gardenPlannerSettings.zone;
  if (gardenPlannerBedLengthEl) gardenPlannerBedLengthEl.value = gardenPlannerSettings.bedLength;
  if (gardenPlannerBedWidthEl) gardenPlannerBedWidthEl.value = gardenPlannerSettings.bedWidth;
  if (gardenPlannerBedCountEl) gardenPlannerBedCountEl.value = gardenPlannerSettings.bedCount;
  if (gardenPlannerSunEl) gardenPlannerSunEl.value = gardenPlannerSettings.sun;
  if (gardenPlannerSoilEl) gardenPlannerSoilEl.value = gardenPlannerSettings.soil;
  if (gardenPlannerWaterEl) gardenPlannerWaterEl.value = gardenPlannerSettings.water;
  if (gardenPlannerModeEl) gardenPlannerModeEl.value = gardenPlannerSettings.mode;
  if (gardenPlannerDeerEl) gardenPlannerDeerEl.value = gardenPlannerSettings.deerPressure;
  if (gardenPlannerWalnutEl) gardenPlannerWalnutEl.value = gardenPlannerSettings.walnut;
}

function gardenPlannerSettingsFromControls() {
  return {
    zip: String(gardenPlannerZipEl?.value ?? "").replace(/\D+/g, "").slice(0, 5),
    zone: cleanGardenPlannerZone(gardenPlannerZoneEl?.value ?? gardenPlannerSettings.zone),
    bedLength: cleanGardenPlannerNumber(gardenPlannerBedLengthEl?.value, gardenPlannerSettings.bedLength, 1, 200),
    bedWidth: cleanGardenPlannerNumber(gardenPlannerBedWidthEl?.value, gardenPlannerSettings.bedWidth, 1, 200),
    bedCount: Math.round(cleanGardenPlannerNumber(gardenPlannerBedCountEl?.value, gardenPlannerSettings.bedCount, 1, 50)),
    sun: ["full", "partial", "shade"].includes(gardenPlannerSunEl?.value) ? gardenPlannerSunEl.value : gardenPlannerSettings.sun,
    soil: ["loam", "sandy", "clay"].includes(gardenPlannerSoilEl?.value) ? gardenPlannerSoilEl.value : gardenPlannerSettings.soil,
    water: ["low", "medium", "high"].includes(gardenPlannerWaterEl?.value) ? gardenPlannerWaterEl.value : gardenPlannerSettings.water,
    mode: ["in-ground", "containers", "mixed"].includes(gardenPlannerModeEl?.value) ? gardenPlannerModeEl.value : gardenPlannerSettings.mode,
    deerPressure: ["ignore", "deer-pressure"].includes(gardenPlannerDeerEl?.value) ? gardenPlannerDeerEl.value : gardenPlannerSettings.deerPressure,
    walnut: ["ignore", "near-walnut"].includes(gardenPlannerWalnutEl?.value) ? gardenPlannerWalnutEl.value : gardenPlannerSettings.walnut
  };
}

function syncGardenPlannerSettingsFromControls() {
  gardenPlannerSettings = gardenPlannerSettingsFromControls();
  saveGardenPlannerSettings();
  renderGardenPlannerSummarySections();
}

async function lookupGardenPlannerZip() {
  if (!gardenPlannerZipEl || !gardenPlannerSettingsStatusEl) return;
  syncGardenPlannerSettingsFromControls();
  const zip = gardenPlannerSettings.zip;
  if (!/^\d{5}$/.test(zip)) {
    gardenPlannerSettingsStatusEl.textContent = "Enter a five-digit ZIP or choose a zone directly.";
    return;
  }
  gardenPlannerSettingsStatusEl.textContent = "Looking up USDA zone...";
  try {
    const zoneData = await lookupZone(zip);
    gardenPlannerSettings = {
      ...gardenPlannerSettings,
      zip,
      zone: cleanGardenPlannerZone(zoneData.zone)
    };
    saveGardenPlannerSettings();
    applyGardenPlannerSettingsToControls();
    gardenPlannerSettingsStatusEl.textContent = `Using USDA zone ${gardenPlannerSettings.zone.toUpperCase()} for this garden plan.`;
    renderGardenPlannerSummarySections();
  } catch (error) {
    gardenPlannerSettingsStatusEl.textContent = "ZIP lookup did not complete. Choose a USDA zone directly for now.";
  }
}

function gardenPlannerTotalSqFt(settings = gardenPlannerSettings) {
  const length = cleanGardenPlannerNumber(settings.bedLength, 8, 1, 200);
  const width = cleanGardenPlannerNumber(settings.bedWidth, 4, 1, 200);
  const count = Math.round(cleanGardenPlannerNumber(settings.bedCount, 1, 1, 50));
  return length * width * count;
}

function gardenPlannerZoneNumber() {
  return zoneToNumber(gardenPlannerSettings.zone);
}

function gardenPlannerZoneData() {
  return { zone: gardenPlannerSettings.zone || "7b" };
}

function gardenPlannerSearchNormalize(value) {
  return String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function gardenPlannerPlantSearchText(plant) {
  return gardenPlannerSearchNormalize([
    plant.name,
    plant.id,
    plant.type,
    plant.query,
    plant.harvest,
    plant.notes,
    ...(plant.traits ?? []),
    ...(plant.goals ?? [])
  ].join(" "));
}

function gardenPlannerSearchScore(plant, terms, query) {
  const name = gardenPlannerSearchNormalize(plant.name);
  const type = gardenPlannerSearchNormalize(plant.type);
  const haystack = gardenPlannerPlantSearchText(plant);
  if (!terms.every((term) => haystack.includes(term))) return 0;
  let score = 1;
  if (name === query) score += 80;
  if (name.startsWith(query)) score += 44;
  if (name.includes(query)) score += 28;
  if (type.includes(query)) score += 12;
  terms.forEach((term) => {
    if (name.split(" ").some((part) => part.startsWith(term))) score += 10;
    if (type.split(" ").some((part) => part.startsWith(term))) score += 4;
  });
  return score;
}

function gardenPlannerSearchPlants(query) {
  const normalized = gardenPlannerSearchNormalize(query);
  if (!normalized) return [];
  const terms = normalized.split(" ").filter(Boolean);
  return plants
    .map((plant) => ({ plant, score: gardenPlannerSearchScore(plant, terms, normalized) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.plant.name.localeCompare(b.plant.name))
    .slice(0, 8)
    .map((entry) => entry.plant);
}

function renderGardenPlannerSearchResult(plant) {
  const saved = screenerWatchlistIds.has(plant.id);
  const metrics = metricFor(plant);
  const traits = (plant.traits ?? []).slice(0, 2);
  return `
    <article class="garden-planner-search-card">
      <div>
        <a href="${plantPagePath(plant)}">${escapeHtml(plant.name)}</a>
        <span>${escapeHtml(plant.type)} - zone ${escapeHtml(plant.zones[0])}-${escapeHtml(plant.zones[1])} - ${escapeHtml(metricDisplayValue(metrics.display?.firstOutput))}</span>
        ${traits.length ? `<p>${traits.map(escapeHtml).join("; ")}</p>` : ""}
      </div>
      <button
        type="button"
        data-garden-quick-add="${escapeHtml(plant.id)}"
        ${saved ? "disabled" : ""}
      >${saved ? "In garden" : "Save to garden"}</button>
    </article>
  `;
}

function renderGardenPlannerSearchResults() {
  if (!gardenPlannerSearchEl || !gardenPlannerSearchResultsEl) return;
  const query = gardenPlannerSearchEl.value.trim();
  if (!query) {
    gardenPlannerSearchResultsEl.innerHTML = `
      <div class="garden-planner-search-empty">
        <strong>Search plants to add them here.</strong>
        <span>Use the full listing when you want filters, sorting, and the complete database.</span>
      </div>
    `;
    return;
  }
  const results = gardenPlannerSearchPlants(query);
  if (!results.length) {
    gardenPlannerSearchResultsEl.innerHTML = `
      <div class="garden-planner-search-empty">
        <strong>No plants matched "${escapeHtml(query)}".</strong>
        <span>Try a simpler crop name, plant type, or use the full listing.</span>
      </div>
    `;
    return;
  }
  gardenPlannerSearchResultsEl.innerHTML = results.map(renderGardenPlannerSearchResult).join("");
}

function setGardenPlannerQuantity(plantId, quantity) {
  if (!screenerWatchlistIds.has(plantId)) return false;
  const nextQuantity = Math.round(clamp(Number(quantity), 1, 999));
  if (!Number.isFinite(nextQuantity)) return false;
  if (gardenPlannerQuantityForPlant(plantId) === nextQuantity) return false;
  gardenPlannerQuantities[plantId] = nextQuantity;
  normalizeGardenPlannerLayout();
  ensureGardenPlannerLayoutForPlant(plantId);
  saveGardenPlannerQuantities();
  saveGardenPlannerLayout();
  return true;
}

function gardenPlannerEntries() {
  normalizeGardenPlannerQuantities();
  normalizeGardenPlannerLayout();
  return screenerPortfolioEntries().map(({ plant, metrics }) => ({
    plant,
    metrics,
    quantity: gardenPlannerQuantityForPlant(plant.id)
  }));
}

function gardenEntryYield(entry) {
  const yieldValue = yieldMidpoint(entry.metrics);
  return Number.isFinite(yieldValue) ? yieldValue * entry.quantity : null;
}

function gardenEntrySpaceRange(entry) {
  const [minArea, maxArea] = spacingAreaRange(entry.metrics);
  if (!Number.isFinite(minArea) || !Number.isFinite(maxArea)) return [null, null];
  return [minArea * entry.quantity, maxArea * entry.quantity];
}

function gardenEntrySpace(entry) {
  const [minArea, maxArea] = gardenEntrySpaceRange(entry);
  return rangeAverage(minArea, maxArea);
}

function gardenEntrySpaceLabel(entry, digits = 1) {
  const [minArea, maxArea] = gardenEntrySpaceRange(entry);
  return formatCompactRange(minArea, maxArea, digits, " sq ft");
}

function gardenPlannerSpaceStats(entries) {
  const available = gardenPlannerTotalSqFt();
  const usedMin = sumNumber(entries.map((entry) => gardenEntrySpaceRange(entry)[0]));
  const usedMax = sumNumber(entries.map((entry) => gardenEntrySpaceRange(entry)[1]));
  const used = sumNumber(entries.map(gardenEntrySpace));
  const knownEntries = entries.filter((entry) => Number.isFinite(gardenEntrySpace(entry)));
  const unknownCount = entries.length - knownEntries.length;
  const percent = available > 0 && Number.isFinite(used) ? (used / available) * 100 : null;
  const percentMin = available > 0 && Number.isFinite(usedMin) ? (usedMin / available) * 100 : null;
  const percentMax = available > 0 && Number.isFinite(usedMax) ? (usedMax / available) * 100 : null;
  return { available, used, usedMin, usedMax, percent, percentMin, percentMax, unknownCount };
}

function gardenPlannerBedColor(index) {
  const palette = [
    "#2f6f4f",
    "#df7b4f",
    "#5470a8",
    "#b18b2f",
    "#5f9d7a",
    "#8b5fa3",
    "#9a5a3f",
    "#6b8d2f",
    "#3f8f93",
    "#b95d75",
    "#78613a",
    "#4f6f88"
  ];
  return palette[index % palette.length];
}

function gardenPlannerBedFootprintLabel() {
  const length = cleanGardenPlannerNumber(gardenPlannerSettings.bedLength, 8, 1, 200);
  const width = cleanGardenPlannerNumber(gardenPlannerSettings.bedWidth, 4, 1, 200);
  const count = Math.round(cleanGardenPlannerNumber(gardenPlannerSettings.bedCount, 1, 1, 50));
  return `${count} bed${count === 1 ? "" : "s"} at ${formatCompactNumber(length, 1)} x ${formatCompactNumber(width, 1)} ft each`;
}

function gardenPlannerBedDimensionPair(settings = gardenPlannerSettings) {
  const length = cleanGardenPlannerNumber(settings.bedLength, 8, 1, 200);
  const width = cleanGardenPlannerNumber(settings.bedWidth, 4, 1, 200);
  return [length, width].sort((a, b) => a - b);
}

function gardenPlannerBedSizeLabel(size) {
  return `${formatCompactNumber(size[0], 1)} x ${formatCompactNumber(size[1], 1)} ft`;
}

function gardenPlannerBedKitDistance(inputSize, kitSize) {
  const normalizedKitSize = [...kitSize].sort((a, b) => a - b);
  const edgeDistance = Math.hypot(inputSize[0] - normalizedKitSize[0], inputSize[1] - normalizedKitSize[1]);
  const inputArea = inputSize[0] * inputSize[1];
  const kitArea = normalizedKitSize[0] * normalizedKitSize[1];
  const areaDistance = Math.abs(inputArea - kitArea) / Math.max(inputArea, 1);
  return edgeDistance + (areaDistance * 0.2);
}

function closestGardenPlannerBedKit(settings = gardenPlannerSettings) {
  const inputSize = gardenPlannerBedDimensionPair(settings);
  let best = null;
  gardenPlannerBedKitProducts.forEach((product) => {
    product.sizes.forEach((size) => {
      const normalizedSize = [...size].sort((a, b) => a - b);
      const distance = gardenPlannerBedKitDistance(inputSize, normalizedSize);
      const exact = Math.abs(inputSize[0] - normalizedSize[0]) < 0.05 && Math.abs(inputSize[1] - normalizedSize[1]) < 0.05;
      const candidate = {
        product,
        size: normalizedSize,
        distance,
        exact
      };
      if (!best
        || candidate.distance < best.distance
        || (Math.abs(candidate.distance - best.distance) < 0.01 && product.priority < best.product.priority)) {
        best = candidate;
      }
    });
  });
  return best;
}

function renderGardenPlannerBedKitRecommendation() {
  const match = closestGardenPlannerBedKit();
  if (!match) return "";
  const currentSize = gardenPlannerBedDimensionPair();
  const count = Math.round(cleanGardenPlannerNumber(gardenPlannerSettings.bedCount, 1, 1, 50));
  const currentLabel = gardenPlannerBedSizeLabel(currentSize);
  const matchLabel = gardenPlannerBedSizeLabel(match.size);
  const sizeCopy = match.exact
    ? `${matchLabel} matches the bed size entered.`
    : `${matchLabel} is the closest listed kit size to the ${currentLabel} bed entered.`;
  const countCopy = count > 1
    ? `Shown per bed; plan on ${count} kit${count === 1 ? "" : "s"} for this layout.`
    : "Shown for one bed.";
  return `
    <aside class="garden-planner-bed-kit" aria-label="Raised bed kit recommendation">
      <div>
        <span>Raised bed option</span>
        <strong>${escapeHtml(match.product.name)}</strong>
        <p>${escapeHtml(sizeCopy)} ${escapeHtml(countCopy)}</p>
        <small>Product links may earn a commission; final dimensions and availability can vary.</small>
      </div>
      <a
        href="${escapeHtml(match.product.affiliateUrl)}"
        target="_blank"
        rel="sponsored noopener noreferrer"
        data-partner-placement="garden_planner_bed_size"
        data-product-id="${escapeHtml(match.product.id)}"
      >View ${escapeHtml(match.product.configuration)}</a>
    </aside>
  `;
}

const gardenPlannerGridUnitCandidatesFt = [1 / 3, 0.5, 1, 2, 3, 4, 5, 10, 20, 50, 100, 250];

function gardenPlannerGridUnitLabel(unitFt) {
  if (unitFt < 1) {
    const inches = unitFt * 12;
    return `${formatCompactNumber(inches, inches % 1 ? 1 : 0)} x ${formatCompactNumber(inches, inches % 1 ? 1 : 0)} in`;
  }
  return `${formatCompactNumber(unitFt, unitFt % 1 ? 1 : 0)} x ${formatCompactNumber(unitFt, unitFt % 1 ? 1 : 0)} ft`;
}

function gardenPlannerBedBlockArrangement(length, width, count) {
  if (count <= 1) return { columns: 1, rows: 1 };
  let best = { columns: count, rows: 1, score: Number.POSITIVE_INFINITY };
  for (let columns = 1; columns <= count; columns += 1) {
    const rows = Math.ceil(count / columns);
    const aspect = (columns * length) / Math.max(rows * width, 1);
    const emptySlots = columns * rows - count;
    const score = Math.abs(Math.log(Math.max(aspect, 0.1) / 1.8)) + (emptySlots / count) * 0.35;
    if (score < best.score) best = { columns, rows, score };
  }
  return { columns: best.columns, rows: best.rows };
}

function gardenPlannerBedGrid() {
  const length = cleanGardenPlannerNumber(gardenPlannerSettings.bedLength, 8, 1, 200);
  const width = cleanGardenPlannerNumber(gardenPlannerSettings.bedWidth, 4, 1, 200);
  const count = Math.round(cleanGardenPlannerNumber(gardenPlannerSettings.bedCount, 1, 1, 50));
  const arrangement = gardenPlannerBedBlockArrangement(length, width, count);
  const totalArea = length * width * count;
  const displayLength = count === 1 ? length : arrangement.columns * length;
  const displayWidth = count === 1 ? width : totalArea / Math.max(displayLength, 1);
  const unitFt = gardenPlannerGridUnitCandidatesFt.find((candidate) => {
    const columns = Math.ceil(displayLength / candidate);
    const rows = Math.ceil(displayWidth / candidate);
    return columns <= 64 && rows <= 44 && columns * rows <= 768;
  }) ?? gardenPlannerGridUnitCandidatesFt[gardenPlannerGridUnitCandidatesFt.length - 1];
  const columns = Math.max(1, Math.ceil(displayLength / unitFt));
  const rows = Math.max(1, Math.ceil(displayWidth / unitFt));
  const cellPx = clamp(Math.min(56, 1160 / columns, 620 / rows), 8, 56);
  const unitLabel = gardenPlannerGridUnitLabel(unitFt);
  const scaleText = count === 1
    ? `Scaled to a ${formatCompactNumber(length, 1)} x ${formatCompactNumber(width, 1)} ft bed.`
    : `Scaled to ${formatCompactNumber(totalArea, 1)} sq ft total across ${count} beds; paths and gaps are not included.`;
  return {
    columns,
    rows,
    cellCount: columns * rows,
    cellPx,
    minHeightPx: rows <= 1 ? 72 : rows <= 3 ? 112 : 150,
    aspect: columns / rows,
    unitLabel,
    scaleText,
    blockColumns: arrangement.columns,
    blockRows: arrangement.rows,
    cellTitle: `Each grid square represents about ${unitLabel}.`
  };
}

function gardenPlannerBedVisualData(entries, spaceStats) {
  const available = Number.isFinite(spaceStats.available) && spaceStats.available > 0 ? spaceStats.available : 0;
  const items = entries.flatMap((entry, entryIndex) => {
    const [minArea, maxArea] = spacingAreaRange(entry.metrics);
    const value = rangeAverage(minArea, maxArea);
    if (!Number.isFinite(value) || value <= 0) return [];
    return Array.from({ length: entry.quantity }, (_, instanceOffset) => ({
      entry,
      entryIndex,
      instanceIndex: instanceOffset + 1,
      instanceCount: entry.quantity,
      layoutId: gardenPlannerLayoutInstanceId(entry.plant.id, instanceOffset + 1),
      value,
      range: [minArea, maxArea],
      color: gardenPlannerBedColor(entryIndex),
      percent: available > 0 ? (value / available) * 100 : null
    }));
  })
    .sort((a, b) => b.value - a.value
      || a.entry.plant.name.localeCompare(b.entry.plant.name)
      || a.instanceIndex - b.instanceIndex);
  return { items };
}

function gardenPlannerPlantInitials(name) {
  const parts = String(name ?? "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function gardenPlannerDefaultLayoutPosition(index, total) {
  const count = Math.max(total, 1);
  const columns = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / columns);
  return {
    x: clamp((((index % columns) + 0.5) / columns) * 100, 10, 90),
    y: clamp(((Math.floor(index / columns) + 0.5) / rows) * 100, 12, 88)
  };
}

function gardenPlannerLayoutItemLabel(item) {
  if (!item) return "";
  return item.instanceCount > 1
    ? `${item.entry.plant.name} #${item.instanceIndex}`
    : item.entry.plant.name;
}

function gardenPlannerLayoutItemSpaceLabel(item, digits = 1) {
  const [minArea, maxArea] = item?.range ?? [null, null];
  return formatCompactRange(minArea, maxArea, digits, " sq ft");
}

function gardenPlannerSpaceRemainingLabel(spaceStats) {
  const remaining = Number.isFinite(spaceStats.used) ? spaceStats.available - spaceStats.used : null;
  const remainingMin = Number.isFinite(spaceStats.usedMin) ? spaceStats.available - spaceStats.usedMin : null;
  const remainingMax = Number.isFinite(spaceStats.usedMax) ? spaceStats.available - spaceStats.usedMax : null;
  if (Number.isFinite(remainingMin) && Number.isFinite(remainingMax)) {
    if (remainingMax >= 0) {
      return `${formatCompactRange(remainingMax, remainingMin, 1, " sq ft")} still open by spacing range.`;
    }
    if (remainingMin < 0) {
      return `${formatCompactRange(Math.abs(remainingMin), Math.abs(remainingMax), 1, " sq ft")} over the current bed budget.`;
    }
    return `Tight spacing fits, but wide spacing is ${formatCompactNumber(Math.abs(remainingMax), 1)} sq ft over budget.`;
  }
  if (Number.isFinite(remaining)) {
    return remaining >= 0
      ? `${formatCompactNumber(remaining, 1)} sq ft still open.`
      : `${formatCompactNumber(Math.abs(remaining), 1)} sq ft over the current bed budget.`;
  }
  return "No density-backed space total yet.";
}

function gardenPlannerLayoutGroups(items) {
  const groups = [];
  const groupMap = new Map();
  items.forEach((item, index) => {
    const plantId = item.entry.plant.id;
    if (!groupMap.has(plantId)) {
      const group = {
        entry: item.entry,
        plantId,
        color: item.color,
        items: [],
        firstIndex: index,
        minTotal: 0,
        maxTotal: 0,
        hasRange: false
      };
      groupMap.set(plantId, group);
      groups.push(group);
    }
    const group = groupMap.get(plantId);
    const [minArea, maxArea] = item.range ?? [];
    group.items.push({ item, index });
    if (Number.isFinite(minArea)) {
      group.minTotal += minArea;
      group.hasRange = true;
    }
    if (Number.isFinite(maxArea)) {
      group.maxTotal += maxArea;
      group.hasRange = true;
    }
  });
  groups.forEach((group) => {
    group.placedItems = group.items.filter(({ item }) => cleanGardenPlannerLayoutPosition(gardenPlannerLayout[item.layoutId]));
    group.unplacedItems = group.items.filter(({ item }) => !cleanGardenPlannerLayoutPosition(gardenPlannerLayout[item.layoutId]));
    group.firstUnplaced = group.unplacedItems[0] ?? null;
    group.isSelected = group.items.some(({ item }) => item.layoutId === gardenPlannerSelectedLayoutId);
    group.perPlantLabel = gardenPlannerLayoutItemSpaceLabel(group.items[0]?.item);
    group.totalLabel = group.hasRange
      ? formatCompactRange(group.minTotal, group.maxTotal, 1, " sq ft")
      : "Density pending";
  });
  return groups;
}

function ensureGardenPlannerLayoutForPlant(plantId) {
  const entries = gardenPlannerEntries();
  const spaceStats = gardenPlannerSpaceStats(entries);
  const visual = gardenPlannerBedVisualData(entries, spaceStats);
  let changed = false;
  visual.items.forEach((item, index) => {
    if (item.entry.plant.id !== plantId || gardenPlannerLayout[item.layoutId]) return;
    gardenPlannerLayout[item.layoutId] = gardenPlannerDefaultLayoutPosition(index, visual.items.length);
    changed = true;
  });
  if (changed) saveGardenPlannerLayout();
  return changed;
}

function gardenPlannerLayoutRadiusForValue(value, spaceStats, minRadius = 8, maxRadius = 42) {
  const available = Number.isFinite(spaceStats.available) && spaceStats.available > 0 ? spaceStats.available : 0;
  const area = Number.isFinite(value) && value > 0 ? value : 0;
  if (!available || !area) return minRadius;
  const radius = Math.sqrt((area / available) / Math.PI) * 100;
  return clamp(radius, minRadius, maxRadius);
}

function gardenPlannerLayoutRadii(item, spaceStats) {
  const [minArea, maxArea] = item.range ?? [item.value, item.value];
  return {
    min: gardenPlannerLayoutRadiusForValue(minArea, spaceStats, 5, 38),
    max: gardenPlannerLayoutRadiusForValue(maxArea, spaceStats, 8, 46)
  };
}

function gardenPlannerAutoLayoutDimensions() {
  const length = cleanGardenPlannerNumber(gardenPlannerSettings.bedLength, 8, 1, 200);
  const width = cleanGardenPlannerNumber(gardenPlannerSettings.bedWidth, 4, 1, 200);
  const count = Math.round(cleanGardenPlannerNumber(gardenPlannerSettings.bedCount, 1, 1, 50));
  const arrangement = gardenPlannerBedBlockArrangement(length, width, count);
  const totalArea = length * width * count;
  const displayLength = count === 1 ? length : arrangement.columns * length;
  const displayWidth = count === 1 ? width : totalArea / Math.max(displayLength, 1);
  return { displayLength, displayWidth, totalArea };
}

function gardenPlannerAutoLayoutArea(item, mode = "target") {
  const [minArea, maxArea] = item.range ?? [item.value, item.value];
  const fallback = Number.isFinite(item.value) && item.value > 0 ? item.value : null;
  if (mode === "min") return (Number.isFinite(minArea) && minArea > 0 ? minArea : fallback) ?? 1;
  if (mode === "max") return (Number.isFinite(maxArea) && maxArea > 0 ? maxArea : fallback) ?? 1;
  return rangeAverage(minArea, maxArea) ?? fallback ?? 1;
}

function gardenPlannerAutoLayoutRadiusFt(area, scale = 1) {
  const safeArea = Number.isFinite(area) && area > 0 ? area : 1;
  return Math.sqrt(safeArea / Math.PI) * scale;
}

function gardenPlannerAutoLayoutRelationshipScore(sourcePlant, targetPlant) {
  if (!sourcePlant || !targetPlant || sourcePlant.id === targetPlant.id) return 0;
  let score = 0;
  relationshipEntriesForPlant(sourcePlant).forEach(({ relationship, relatedPlants }) => {
    if (!relatedPlants.some((plant) => plant.id === targetPlant.id)) return;
    score += (gardenPlannerCompanionTypeRank[relationship.type] ?? 6)
      + (gardenPlannerCompanionStrengthRank[relationship.strength] ?? 4);
  });
  return score;
}

function gardenPlannerAutoLayoutPairScore(sourcePlant, targetPlant) {
  return Math.max(
    gardenPlannerAutoLayoutRelationshipScore(sourcePlant, targetPlant),
    gardenPlannerAutoLayoutRelationshipScore(targetPlant, sourcePlant)
  );
}

function gardenPlannerAutoLayoutPairKey(sourceId, targetId) {
  return [sourceId, targetId].sort().join("::");
}

function gardenPlannerAutoLayoutCachedPairScore(sourcePlant, targetPlant, pairScores) {
  const key = gardenPlannerAutoLayoutPairKey(sourcePlant.id, targetPlant.id);
  if (!pairScores.has(key)) {
    pairScores.set(key, gardenPlannerAutoLayoutPairScore(sourcePlant, targetPlant));
  }
  return pairScores.get(key);
}

function gardenPlannerAutoLayoutCandidatePoints(count, dimensions) {
  const aspect = clamp(dimensions.displayLength / Math.max(dimensions.displayWidth, 1), 0.35, 4);
  const columns = Math.round(clamp(Math.ceil(Math.sqrt(count * aspect) * 2.35), 4, 22));
  const rows = Math.round(clamp(Math.ceil(Math.sqrt(count / aspect) * 2.25), 3, 16));
  const points = [];
  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const stagger = row % 2 ? 0.18 : 0;
      const xPct = clamp(((column + 0.5 + stagger) / columns) * 100, 5, 95);
      const yPct = clamp(((row + 0.5) / rows) * 100, 6, 94);
      points.push({
        xPct,
        yPct,
        xFt: (xPct / 100) * dimensions.displayLength,
        yFt: (yPct / 100) * dimensions.displayWidth
      });
    }
  }
  return points;
}

function gardenPlannerAutoLayoutPointScore(item, point, placed, dimensions, pairScores) {
  const edgeClearanceFt = Math.min(
    point.xFt,
    dimensions.displayLength - point.xFt,
    point.yFt,
    dimensions.displayWidth - point.yFt
  );
  // Score practical garden-bed placement: avoid crowding first, then favor useful companion proximity.
  let score = Math.max(0, (item.collisionRadiusFt * 0.72) - edgeClearanceFt) * 16;

  placed.forEach((placedItem) => {
    const distance = Math.hypot(point.xFt - placedItem.xFt, point.yFt - placedItem.yFt);
    const minimumDistance = item.collisionRadiusFt + placedItem.collisionRadiusFt;
    if (distance < minimumDistance) {
      score += 520 + ((minimumDistance - distance) ** 2) * 80;
    } else {
      score += 2.4 / Math.max(distance, 0.5);
    }

    const relationshipScore = gardenPlannerAutoLayoutCachedPairScore(
      item.entry.plant,
      placedItem.item.entry.plant,
      pairScores
    );
    if (relationshipScore > 0) {
      const targetDistance = Math.max(item.targetRadiusFt + placedItem.targetRadiusFt, minimumDistance * 1.12, 1.25);
      const companionBand = Math.max(targetDistance * 2.2, 4);
      const closeness = Math.max(0, 1 - (Math.abs(distance - targetDistance) / companionBand));
      score -= relationshipScore * closeness * 0.52;
    }
  });

  return score;
}

function autoArrangeGardenPlannerLayout() {
  const entries = gardenPlannerEntries();
  const spaceStats = gardenPlannerSpaceStats(entries);
  const visual = gardenPlannerBedVisualData(entries, spaceStats);
  if (!visual.items.length) return 0;

  const dimensions = gardenPlannerAutoLayoutDimensions();
  const points = gardenPlannerAutoLayoutCandidatePoints(visual.items.length, dimensions);
  const items = visual.items
    .map((item) => {
      const minArea = gardenPlannerAutoLayoutArea(item, "min");
      const targetArea = gardenPlannerAutoLayoutArea(item);
      return {
        ...item,
        layoutArea: targetArea,
        collisionRadiusFt: gardenPlannerAutoLayoutRadiusFt(minArea, 0.92),
        targetRadiusFt: gardenPlannerAutoLayoutRadiusFt(targetArea)
      };
    })
    .sort((a, b) => b.layoutArea - a.layoutArea || a.entry.plant.name.localeCompare(b.entry.plant.name));
  const pairScores = new Map();

  const placed = [];
  items.forEach((item, itemIndex) => {
    let best = null;
    points.forEach((point, pointIndex) => {
      const score = gardenPlannerAutoLayoutPointScore(item, point, placed, dimensions, pairScores)
        + (Math.abs(point.xPct - 50) + Math.abs(point.yPct - 50)) * (itemIndex === 0 ? 0.015 : 0.002)
        + pointIndex * 0.0001;
      if (!best || score < best.score) best = { ...point, score };
    });
    if (!best) {
      const defaultPosition = gardenPlannerDefaultLayoutPosition(itemIndex, items.length);
      best = {
        xPct: defaultPosition.x,
        yPct: defaultPosition.y,
        xFt: (defaultPosition.x / 100) * dimensions.displayLength,
        yFt: (defaultPosition.y / 100) * dimensions.displayWidth,
        score: 0
      };
    }
    placed.push({
      item,
      xPct: best.xPct,
      yPct: best.yPct,
      xFt: best.xFt,
      yFt: best.yFt,
      collisionRadiusFt: item.collisionRadiusFt,
      targetRadiusFt: item.targetRadiusFt
    });
  });

  const arrangedIds = new Set(items.map((item) => item.layoutId));
  gardenPlannerLayout = Object.fromEntries(
    Object.entries(gardenPlannerLayout).filter(([layoutId]) => !arrangedIds.has(layoutId))
  );
  placed.forEach((placement) => {
    const position = cleanGardenPlannerLayoutPosition({ x: placement.xPct, y: placement.yPct });
    if (position) gardenPlannerLayout[placement.item.layoutId] = position;
  });
  saveGardenPlannerLayout();
  renderGardenPlannerSummarySections();
  return placed.length;
}

function renderGardenPlannerBedVisual(entries, spaceStats) {
  const visual = gardenPlannerBedVisualData(entries, spaceStats);
  const grid = gardenPlannerBedGrid();
  const percentLabel = formatCompactRange(spaceStats.percentMin, spaceStats.percentMax, 0, "%");
  const percent = Number.isFinite(spaceStats.percentMax) ? clamp(spaceStats.percentMax, 0, 100) : 0;
  const spaceRangeLabel = formatCompactRange(spaceStats.usedMin, spaceStats.usedMax, 1, " sq ft");
  const remainingLabel = gardenPlannerSpaceRemainingLabel(spaceStats);
  const isOver = Number.isFinite(spaceStats.percentMax) && spaceStats.percentMax > 100;
  const bedLabel = `${percentLabel} of planned bed space used. ${gardenPlannerBedFootprintLabel()}. ${grid.cellTitle}`;
  const positionedItems = visual.items
    .map((item) => ({
      ...item,
      position: cleanGardenPlannerLayoutPosition(gardenPlannerLayout[item.layoutId]),
      radii: gardenPlannerLayoutRadii(item, spaceStats)
    }))
    .filter((item) => item.position);
  const placedCount = positionedItems.length;
  const layoutCount = visual.items.length;
  const hasLayout = Object.keys(gardenPlannerLayout).length > 0;
  let selectedItem = positionedItems.find((item) => item.layoutId === gardenPlannerSelectedLayoutId);
  if (gardenPlannerSelectedLayoutId && !selectedItem) gardenPlannerSelectedLayoutId = null;
  const groups = gardenPlannerLayoutGroups(visual.items);
  return `
    <article class="garden-planner-space-card garden-planner-bed-card ${isOver ? "is-over" : ""}">
      <div class="garden-planner-space-card-head garden-planner-bed-card-head">
        <span>Interactive bed layout</span>
        <div class="garden-planner-bed-actions">
          <button
            type="button"
            class="garden-planner-bed-auto"
            data-garden-layout-auto
            ${layoutCount ? "" : "disabled"}
          >Auto arrange</button>
          <button
            type="button"
            class="garden-planner-bed-reset"
            data-garden-layout-reset
            ${hasLayout ? "" : "disabled"}
          >Reset layout</button>
        </div>
      </div>
      <div class="garden-planner-bed-summary">
        <div class="garden-planner-bed-summary-main">
          <span>Estimated use</span>
          <strong>${escapeHtml(spaceRangeLabel)}</strong>
          <small>${escapeHtml(percentLabel)} of ${escapeHtml(formatCompactNumber(spaceStats.available, 1))} sq ft planned</small>
        </div>
        <div class="garden-planner-bed-summary-meter">
          <div class="garden-planner-space-meter" aria-label="Estimated garden space used">
            <span style="--space-used: ${percent}%"></span>
          </div>
          <p>
            ${escapeHtml(remainingLabel)}
            ${spaceStats.unknownCount ? `${spaceStats.unknownCount} saved plant${spaceStats.unknownCount === 1 ? "" : "s"} lack density data.` : ""}
          </p>
        </div>
      </div>
      <div
        class="garden-planner-bed-canvas garden-planner-layout-board"
        style="--bed-columns: ${escapeHtml(grid.columns)}; --bed-rows: ${escapeHtml(grid.rows)}; --bed-cell-size: ${escapeHtml(formatCompactNumber(grid.cellPx, 1, ""))}px; --bed-min-height: ${escapeHtml(formatCompactNumber(grid.minHeightPx, 0, ""))}px; --bed-aspect: ${escapeHtml(formatCompactNumber(grid.aspect, 2, ""))}; --bed-block-columns: ${escapeHtml(grid.blockColumns)}; --bed-block-rows: ${escapeHtml(grid.blockRows)}"
        role="group"
        aria-label="${escapeHtml(bedLabel)}"
        data-garden-layout-board
      >
        ${Array.from({ length: grid.cellCount }).map(() => `
          <span
            class="garden-planner-bed-cell"
            title="${escapeHtml(grid.cellTitle)}"
            aria-hidden="true"
          ></span>
        `).join("")}
        ${positionedItems.map((item) => `
          <span
            class="garden-planner-bed-radius is-max"
            style="--bed-fill: ${escapeHtml(item.color)}; --marker-x: ${escapeHtml(formatCompactNumber(item.position.x, 2, ""))}%; --marker-y: ${escapeHtml(formatCompactNumber(item.position.y, 2, ""))}%; --marker-radius: ${escapeHtml(formatCompactNumber(item.radii.max, 2, ""))}%"
            aria-hidden="true"
            data-garden-layout-radius="${escapeHtml(item.layoutId)}"
          ></span>
          <span
            class="garden-planner-bed-radius is-min"
            style="--bed-fill: ${escapeHtml(item.color)}; --marker-x: ${escapeHtml(formatCompactNumber(item.position.x, 2, ""))}%; --marker-y: ${escapeHtml(formatCompactNumber(item.position.y, 2, ""))}%; --marker-radius: ${escapeHtml(formatCompactNumber(item.radii.min, 2, ""))}%"
            aria-hidden="true"
            data-garden-layout-radius="${escapeHtml(item.layoutId)}"
          ></span>
        `).join("")}
        ${positionedItems.map((item) => `
          <button
            type="button"
            class="garden-planner-bed-marker ${item.layoutId === gardenPlannerSelectedLayoutId ? "is-selected" : ""}"
            draggable="true"
            style="--bed-fill: ${escapeHtml(item.color)}; --marker-x: ${escapeHtml(formatCompactNumber(item.position.x, 2, ""))}%; --marker-y: ${escapeHtml(formatCompactNumber(item.position.y, 2, ""))}%"
            data-garden-layout-plant="${escapeHtml(item.entry.plant.id)}"
            data-garden-layout-id="${escapeHtml(item.layoutId)}"
            data-garden-layout-marker="${escapeHtml(item.layoutId)}"
            title="${escapeHtml(`${gardenPlannerLayoutItemLabel(item)}: ${gardenPlannerLayoutItemSpaceLabel(item)} spacing range`)}"
            aria-label="${escapeHtml(`Move ${gardenPlannerLayoutItemLabel(item)} in the bed layout`)}"
          >
            <span>${escapeHtml(gardenPlannerPlantInitials(item.entry.plant.name))}</span>
          </button>
        `).join("")}
        ${!placedCount ? `<div class="garden-planner-bed-hint">Open bed layout</div>` : ""}
      </div>
      <div class="garden-planner-bed-scale">
        <span>Grid: each square represents about ${escapeHtml(grid.unitLabel)}.</span>
        <span>Bed: ${escapeHtml(gardenPlannerBedFootprintLabel())}</span>
        <span>${escapeHtml(grid.scaleText)}</span>
        <span>${escapeHtml(placedCount)} of ${escapeHtml(layoutCount)} plant${layoutCount === 1 ? "" : "s"} placed</span>
      </div>
      ${selectedItem ? `
        <div class="garden-planner-bed-selection">
          <div>
            <span>Selected</span>
            <strong>${escapeHtml(gardenPlannerLayoutItemLabel(selectedItem))}</strong>
            <small>${escapeHtml(gardenPlannerLayoutItemSpaceLabel(selectedItem))} spacing range</small>
          </div>
          <button
            type="button"
            data-garden-layout-remove="${escapeHtml(selectedItem.layoutId)}"
          >Remove from bed</button>
        </div>
      ` : ""}
      ${visual.items.length ? `
        <div class="garden-planner-layout-palette" aria-label="Saved plants for the bed layout">
          ${groups.map((group) => {
            const firstUnplaced = group.firstUnplaced;
            const defaultPosition = firstUnplaced
              ? gardenPlannerDefaultLayoutPosition(firstUnplaced.index, visual.items.length)
              : null;
            return `
              <article
                class="garden-planner-layout-group ${group.isSelected ? "is-selected" : ""}"
                style="--bed-fill: ${escapeHtml(group.color)}"
              >
                <div class="garden-planner-layout-group-main">
                  <i class="garden-planner-layout-swatch" aria-hidden="true"></i>
                  <span>
                    <strong>${escapeHtml(group.entry.plant.name)}</strong>
                    <small>Qty ${escapeHtml(group.items.length)} - ${escapeHtml(group.placedItems.length)} placed - ${escapeHtml(group.perPlantLabel)} each</small>
                  </span>
                  <b>${escapeHtml(group.totalLabel)} total</b>
                </div>
                ${firstUnplaced ? `
                  <button
                    type="button"
                    class="garden-planner-layout-instance"
                    draggable="true"
                    style="--bed-fill: ${escapeHtml(group.color)}"
                    data-garden-layout-plant="${escapeHtml(firstUnplaced.item.entry.plant.id)}"
                    data-garden-layout-id="${escapeHtml(firstUnplaced.item.layoutId)}"
                    data-garden-layout-place="${escapeHtml(firstUnplaced.item.layoutId)}"
                    data-garden-layout-label="${escapeHtml(gardenPlannerPlantInitials(firstUnplaced.item.entry.plant.name))}"
                    data-default-x="${escapeHtml(formatCompactNumber(defaultPosition.x, 2, ""))}"
                    data-default-y="${escapeHtml(formatCompactNumber(defaultPosition.y, 2, ""))}"
                  >
                    <i aria-hidden="true"></i>
                    <span>Place next${group.unplacedItems.length > 1 ? ` (${group.unplacedItems.length} need spots)` : ""}</span>
                  </button>
                ` : `<small class="garden-planner-layout-status">All placed</small>`}
              </article>
            `;
          }).join("")}
        </div>
      ` : `
        <p>No density-backed plants are available for the bed visual yet.</p>
      `}
    </article>
  `;
}

function gardenPlannerPlantZoneFits(plant) {
  const zoneNumber = gardenPlannerZoneNumber();
  return Number.isFinite(zoneNumber) ? calendarPlantFitsZone(plant, zoneNumber) : true;
}

function gardenPlannerPlantSunFits(plant) {
  if (!gardenPlannerSettings.sun) return true;
  const sunValues = Array.isArray(plant.sun) ? plant.sun : [plant.sun].filter(Boolean);
  return sunValues.includes(gardenPlannerSettings.sun);
}

function gardenPlannerPlantSoilFits(plant) {
  if (!gardenPlannerSettings.soil) return true;
  const soilValues = Array.isArray(plant.soils) ? plant.soils : [plant.soil, plant.soils].filter(Boolean);
  return soilValues.includes(gardenPlannerSettings.soil);
}

function gardenPlannerPlantWaterFits(plant) {
  const siteWater = waterRank[gardenPlannerSettings.water] ?? waterRank.medium;
  const plantWater = waterRank[plant.water] ?? waterRank.medium;
  return plantWater <= siteWater;
}

function gardenPlannerContainerIssue(entry) {
  if (gardenPlannerSettings.mode !== "containers") return false;
  const suitability = entry.metrics.containerSuitability;
  const minGallons = Number(entry.metrics.containerMinGallons);
  return suitability === "poor" || (Number.isFinite(minGallons) && minGallons > 25);
}

function gardenPlannerDeerIssue(entry) {
  if (gardenPlannerSettings.deerPressure !== "deer-pressure") return false;
  return ["frequently-damaged", "occasionally-damaged"].includes(deerResistanceValue(entry.metrics));
}

function gardenPlannerWalnutIssue(entry) {
  if (gardenPlannerSettings.walnut !== "near-walnut") return false;
  return jugloneToleranceValue(entry.metrics) === "sensitive";
}

function gardenPlannerFitChecks(entry) {
  const issues = [];
  if (!gardenPlannerPlantZoneFits(entry.plant)) issues.push("zone");
  if (!gardenPlannerPlantSunFits(entry.plant)) issues.push("sun");
  if (!gardenPlannerPlantSoilFits(entry.plant)) issues.push("soil");
  if (!gardenPlannerPlantWaterFits(entry.plant)) issues.push("water");
  if (gardenPlannerContainerIssue(entry)) issues.push("container");
  if (gardenPlannerDeerIssue(entry)) issues.push("deer");
  if (gardenPlannerWalnutIssue(entry)) issues.push("walnut");
  return issues;
}

const gardenPlannerCompanionTypeRank = {
  companion: 60,
  guild: 34,
  understory: 30,
  pollination: 24,
  succession: 18
};

const gardenPlannerCompanionStrengthRank = {
  high: 18,
  medium: 10,
  low: 4
};

const gardenPlannerCompanionFamilyTerms = [
  "tomato",
  "pepper",
  "eggplant",
  "basil",
  "marigold",
  "calendula",
  "borage",
  "nasturtium",
  "dill",
  "cilantro",
  "yarrow",
  "chives",
  "garlic",
  "onion",
  "radish",
  "pea",
  "zinnia",
  "cosmos",
  "tithonia",
  "bean",
  "cucumber",
  "melon",
  "watermelon",
  "cantaloupe",
  "squash",
  "zucchini",
  "pumpkin",
  "corn",
  "lettuce",
  "spinach",
  "carrot",
  "milkweed",
  "coneflower",
  "rudbeckia",
  "goldenrod",
  "aster",
  "mountain mint"
];

function gardenPlannerCompanionNamedFamilyKey(plant) {
  const identity = relationshipIdentity(plant);
  return gardenPlannerCompanionFamilyTerms.find((term) => termMatchesIdentity(identity, term)) ?? null;
}

function gardenPlannerCompanionFamilyKey(plant) {
  return gardenPlannerCompanionNamedFamilyKey(plant) ?? plant.id;
}

function gardenPlannerCompanionFitDetails(plant) {
  const issues = [];
  let score = 0;
  if (gardenPlannerPlantZoneFits(plant)) score += 8;
  else issues.push("zone");
  if (gardenPlannerPlantSunFits(plant)) score += 8;
  else issues.push("sun");
  if (gardenPlannerPlantSoilFits(plant)) score += 4;
  else issues.push("soil");
  if (gardenPlannerPlantWaterFits(plant)) score += 4;
  else issues.push("water");
  return { score, issues };
}

function gardenPlannerFirstSentence(text) {
  const normalized = String(text ?? "").replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  const match = normalized.match(/^.{1,170}?[.!?](\s|$)/);
  if (match) return match[0].trim();
  return normalized.length > 170 ? `${normalized.slice(0, 167).trim()}...` : normalized;
}

function gardenPlannerShortList(values, limit = 2) {
  const names = values.filter(Boolean);
  if (names.length <= limit) return names.join(", ");
  return `${names.slice(0, limit).join(", ")} +${names.length - limit} more`;
}

function gardenPlannerCompanionCandidatesForRelationship(sourcePlant, relationship, relatedPlants) {
  if (relationship.plantMatch?.length) return relatedPlants;
  const isSource = matchesRelationshipTerms(
    sourcePlant,
    relationship.sourceMatch ?? [],
    relationship.sourceExclude ?? []
  );
  if (!isSource) return [];
  return plants.filter((candidate) => (
    candidate.id !== sourcePlant.id
    && matchesRelationshipTerms(candidate, relationship.targetMatch ?? [], relationship.targetExclude ?? [])
  ));
}

function gardenPlannerCompanionSuggestions(entries) {
  if (!entries.length || !plantRelationships.length) return [];
  const savedIds = new Set(entries.map((entry) => entry.plant.id));
  const savedFamilies = new Set(entries.map((entry) => gardenPlannerCompanionNamedFamilyKey(entry.plant)).filter(Boolean));
  const placedIds = new Set(
    Object.keys(gardenPlannerLayout)
      .map(gardenPlannerLayoutPlantId)
      .filter((plantId) => savedIds.has(plantId))
  );
  const suggestionsById = new Map();

  entries.forEach((entry) => {
    const sourcePlant = entry.plant;
    relationshipEntriesForPlant(sourcePlant).forEach(({ relationship, relatedPlants }) => {
      const typeScore = gardenPlannerCompanionTypeRank[relationship.type] ?? 0;
      if (!typeScore) return;
      const strengthScore = gardenPlannerCompanionStrengthRank[relationship.strength] ?? 6;
      const candidates = gardenPlannerCompanionCandidatesForRelationship(sourcePlant, relationship, relatedPlants);

      candidates.forEach((candidate) => {
        if (savedIds.has(candidate.id)) return;
        const candidateFamily = gardenPlannerCompanionNamedFamilyKey(candidate);
        if (candidateFamily && savedFamilies.has(candidateFamily)) return;
        const fit = gardenPlannerCompanionFitDetails(candidate);
        if (fit.issues.includes("zone") || fit.issues.includes("sun")) return;

        if (!suggestionsById.has(candidate.id)) {
          suggestionsById.set(candidate.id, {
            plant: candidate,
            score: 0,
            family: gardenPlannerCompanionFamilyKey(candidate),
            supports: new Map(),
            relationships: new Map(),
            fitIssues: new Set()
          });
        }

        const suggestion = suggestionsById.get(candidate.id);
        suggestion.supports.set(sourcePlant.id, sourcePlant.name);
        fit.issues.forEach((issue) => suggestion.fitIssues.add(issue));
        if (!suggestion.relationships.has(relationship.id)) {
          suggestion.relationships.set(relationship.id, relationship);
          suggestion.score += typeScore + strengthScore + fit.score;
        }
        if (placedIds.has(sourcePlant.id)) suggestion.score += 6;
      });
    });
  });

  const ranked = Array.from(suggestionsById.values())
    .map((suggestion) => {
      const type = suggestion.plant.type.toLowerCase();
      let score = suggestion.score + Math.min(suggestion.supports.size, 3) * 10 + suggestion.relationships.size * 4;
      if (type.includes("herb") || type.includes("flower")) score += 5;
      return {
        ...suggestion,
        score,
        supportNames: Array.from(suggestion.supports.values()),
        relationshipList: Array.from(suggestion.relationships.values()),
        fitIssueList: Array.from(suggestion.fitIssues)
      };
    })
    .sort((a, b) => b.score - a.score || a.plant.name.localeCompare(b.plant.name));

  const selected = [];
  const usedFamilies = new Set();
  ranked.forEach((suggestion) => {
    if (selected.length >= 5 || usedFamilies.has(suggestion.family)) return;
    selected.push(suggestion);
    usedFamilies.add(suggestion.family);
  });
  ranked.forEach((suggestion) => {
    if (selected.length >= 5 || selected.some((item) => item.plant.id === suggestion.plant.id)) return;
    selected.push(suggestion);
  });
  return selected;
}

function gardenPlannerCompanionLabel(suggestion) {
  const relationship = suggestion.relationshipList[0];
  return relationshipTypeLabels[relationship?.type] ?? sentenceCase(relationship?.type ?? "companion");
}

function renderGardenPlannerCompanions(entries) {
  const suggestions = gardenPlannerCompanionSuggestions(entries);
  if (!suggestions.length) return "";
  return `
    <div class="garden-planner-section-head">
      <div>
        <span>Companion ideas</span>
        <h2 id="garden-planner-companions-title">Good additions</h2>
      </div>
      <p>Based on saved plants and existing relationship notes. Use spacing and airflow as the final check.</p>
    </div>
    <div class="garden-planner-companion-list">
      ${suggestions.map((suggestion) => {
        const relationship = suggestion.relationshipList[0];
        const fitNote = suggestion.fitIssueList.length
          ? `Check ${suggestion.fitIssueList.join(" and ")} against settings.`
          : "Fits the selected zone and sun.";
        return `
          <article class="garden-planner-companion-card">
            <div class="garden-planner-companion-card-head">
              <span>${escapeHtml(gardenPlannerCompanionLabel(suggestion))}</span>
              <strong>${escapeHtml(suggestion.plant.name)}</strong>
            </div>
            <p>${escapeHtml(gardenPlannerFirstSentence(relationship?.note ?? relationship?.placement))}</p>
            <div class="garden-planner-companion-meta">
              <span>Works with ${escapeHtml(gardenPlannerShortList(suggestion.supportNames))}</span>
              <span>${escapeHtml(fitNote)}</span>
            </div>
            <div class="garden-planner-companion-actions">
              <button type="button" data-garden-companion-add="${escapeHtml(suggestion.plant.id)}">Save to garden</button>
              <a href="${plantPagePath(suggestion.plant)}">Profile</a>
            </div>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function weightedGardenAverage(entries, reader) {
  let totalWeight = 0;
  let total = 0;
  entries.forEach((entry) => {
    const value = reader(entry);
    if (!Number.isFinite(value)) return;
    total += value * entry.quantity;
    totalWeight += entry.quantity;
  });
  return totalWeight > 0 ? total / totalWeight : null;
}

function gardenPlannerRiskEntries(entries) {
  return entries.filter(({ plant, metrics }) => {
    const screening = screeningProfile(plant, metrics);
    return metrics.riskLevel === "elevated"
      || metrics.difficultyScore >= 4
      || screening.pestPressure === "Elevated"
      || screening.diseasePressure === "Elevated";
  });
}

function gardenPlannerStats(entries) {
  const totalPlants = sumNumber(entries.map((entry) => entry.quantity));
  const totalYield = sumNumber(entries.map(gardenEntryYield));
  const spaceStats = gardenPlannerSpaceStats(entries);
  const averageFirst = weightedGardenAverage(entries, ({ metrics }) => firstOutputYears(metrics));
  const riskCount = gardenPlannerRiskEntries(entries).length;
  const fitIssueCount = entries.filter((entry) => gardenPlannerFitChecks(entry).length).length;
  return {
    totalPlants,
    totalYield,
    totalSpaceMin: spaceStats.usedMin,
    totalSpaceMax: spaceStats.usedMax,
    spaceBudgetPercentMin: spaceStats.percentMin,
    spaceBudgetPercentMax: spaceStats.percentMax,
    averageFirst,
    riskCount,
    fitIssueCount
  };
}

function renderGardenPlannerStats(entries) {
  if (!entries.length) {
    return `
      <div>
        <strong>0</strong>
        <span>saved plants</span>
      </div>
      <div>
        <strong>-</strong>
        <span>plant count</span>
      </div>
      <div>
        <strong>-</strong>
        <span>est. lb/year</span>
      </div>
      <div>
        <strong>-</strong>
        <span>space budget</span>
      </div>
      <div>
        <strong>-</strong>
        <span>avg first output</span>
      </div>
      <div>
        <strong>-</strong>
        <span>risk watch</span>
      </div>
    `;
  }
  const stats = gardenPlannerStats(entries);
  return `
    <div>
      <strong>${entries.length}</strong>
      <span>saved variet${entries.length === 1 ? "y" : "ies"}</span>
    </div>
    <div>
      <strong>${escapeHtml(formatCompactNumber(stats.totalPlants, 0))}</strong>
      <span>plant count</span>
    </div>
    <div>
      <strong>${escapeHtml(formatCompactNumber(stats.totalYield, 1))}</strong>
      <span>est. lb/year or season</span>
    </div>
    <div>
      <strong>${escapeHtml(formatCompactRange(stats.totalSpaceMin, stats.totalSpaceMax, 1))}</strong>
      <span>sq ft range</span>
    </div>
    <div>
      <strong>${escapeHtml(formatCompactRange(stats.spaceBudgetPercentMin, stats.spaceBudgetPercentMax, 0, "%"))}</strong>
      <span>space budget used</span>
    </div>
    <div>
      <strong>${stats.fitIssueCount + stats.riskCount}</strong>
      <span>fit and risk checks</span>
    </div>
    <div>
      <strong>${escapeHtml(formatCompactNumber(stats.averageFirst, 1))}</strong>
      <span>avg years to first output</span>
    </div>
  `;
}

function gardenPlannerSignalCards(entries) {
  if (!entries.length) {
    return [{
      title: "No saved plants yet",
      text: "Save plants from the Screener to start a garden plan.",
      tone: "neutral"
    }];
  }
  const spaceStats = gardenPlannerSpaceStats(entries);
  const zoneMismatchEntries = entries.filter((entry) => !gardenPlannerPlantZoneFits(entry.plant));
  const sunMismatchEntries = entries.filter((entry) => !gardenPlannerPlantSunFits(entry.plant));
  const soilMismatchEntries = entries.filter((entry) => !gardenPlannerPlantSoilFits(entry.plant));
  const waterMismatchEntries = entries.filter((entry) => !gardenPlannerPlantWaterFits(entry.plant));
  const containerIssueEntries = entries.filter(gardenPlannerContainerIssue);
  const deerIssueEntries = entries.filter(gardenPlannerDeerIssue);
  const walnutIssueEntries = entries.filter(gardenPlannerWalnutIssue);
  const supportEntries = entries.filter(({ plant, metrics }) => {
    const support = screeningProfile(plant, metrics).support;
    return support && support !== "Usually none";
  });
  const pollinationEntries = entries.filter(({ plant, metrics }) => {
    const pollination = screeningProfile(plant, metrics).pollination;
    return ["Partner often needed", "Verify cultivar"].includes(pollination);
  });
  const highWaterEntries = entries.filter(({ plant }) => plant.water === "high");
  const annualEntries = entries.filter(({ plant }) => plant.type.includes("annual"));
  const perennialEntries = entries.filter(({ plant }) => !plant.type.includes("annual"));
  const riskEntries = gardenPlannerRiskEntries(entries);
  const cards = [];
  if (Number.isFinite(spaceStats.percentMax) && spaceStats.percentMax > 100) {
    cards.push({
      title: "Space over budget",
      text: `The saved quantities use about ${formatCompactRange(spaceStats.usedMin, spaceStats.usedMax, 1, " sq ft")} against ${formatCompactNumber(spaceStats.available, 1)} sq ft. Trim quantities or plan another bed.`,
      tone: "watch"
    });
  }
  if (zoneMismatchEntries.length) {
    cards.push({
      title: "Zone fit",
      text: `${zoneMismatchEntries.length} saved plant${zoneMismatchEntries.length === 1 ? "" : "s"} sit outside zone ${gardenPlannerSettings.zone.toUpperCase()} and need closer local verification.`,
      tone: "watch"
    });
  }
  if (sunMismatchEntries.length || soilMismatchEntries.length || waterMismatchEntries.length) {
    const parts = [
      sunMismatchEntries.length ? `${sunMismatchEntries.length} sun` : "",
      soilMismatchEntries.length ? `${soilMismatchEntries.length} soil` : "",
      waterMismatchEntries.length ? `${waterMismatchEntries.length} water` : ""
    ].filter(Boolean);
    cards.push({
      title: "Site fit",
      text: `Check ${parts.join(", ")} mismatch${parts.length === 1 ? "" : "es"} against the garden settings before planting.`,
      tone: "watch"
    });
  }
  if (containerIssueEntries.length) {
    cards.push({
      title: "Container fit",
      text: `${containerIssueEntries.length} saved plant${containerIssueEntries.length === 1 ? "" : "s"} look large for a container-only plan.`,
      tone: "watch"
    });
  }
  if (deerIssueEntries.length) {
    cards.push({
      title: "Deer pressure",
      text: `${deerIssueEntries.length} saved plant${deerIssueEntries.length === 1 ? " has" : "s have"} a higher deer-browse cue. Put protection or substitutions in the plan if deer are active.`,
      tone: "watch"
    });
  }
  if (walnutIssueEntries.length) {
    cards.push({
      title: "Black walnut",
      text: `${walnutIssueEntries.length} saved plant${walnutIssueEntries.length === 1 ? " is" : "s are"} flagged as juglone-sensitive. Keep them outside the walnut root zone or verify locally.`,
      tone: "watch"
    });
  }
  if (riskEntries.length) {
    cards.push({
      title: "Risk watch",
      text: `${riskEntries.length} saved plant${riskEntries.length === 1 ? "" : "s"} ${riskEntries.length === 1 ? "deserves" : "deserve"} closer pest, disease, or maintenance review.`,
      tone: "watch"
    });
  }
  if (supportEntries.length) {
    cards.push({
      title: "Support needs",
      text: `${supportEntries.length} plant${supportEntries.length === 1 ? " likely needs" : "s likely need"} staking, cages, or trellis space.`,
      tone: "neutral"
    });
  }
  if (pollinationEntries.length) {
    cards.push({
      title: "Pollination check",
      text: `${pollinationEntries.length} fruiting plant${pollinationEntries.length === 1 ? " may need" : "s may need"} a partner cultivar or cultivar-specific verification.`,
      tone: "neutral"
    });
  }
  if (highWaterEntries.length >= 2) {
    cards.push({
      title: "Water planning",
      text: `${highWaterEntries.length} high-water plant${highWaterEntries.length === 1 ? "" : "s"} are saved. Drip irrigation or mulch may matter more here.`,
      tone: "neutral"
    });
  }
  if (annualEntries.length && perennialEntries.length) {
    cards.push({
      title: "Good time mix",
      text: "The list includes quick annual crops and longer-term perennial structure.",
      tone: "positive"
    });
  } else if (!annualEntries.length && perennialEntries.length) {
    cards.push({
      title: "Slow-build list",
      text: "Most saved plants are longer-term. Add a quick crop if first-season harvest matters.",
      tone: "neutral"
    });
  }
  if (!cards.length) {
    cards.push({
      title: "Plan looks balanced",
      text: "No obvious support, water, pollination, or elevated risk signals stand out from the saved list.",
      tone: "positive"
    });
  }
  return cards.slice(0, 6);
}

function renderGardenPlannerSignals(entries) {
  const cards = gardenPlannerSignalCards(entries);
  return `
    <div class="garden-planner-section-head">
      <div>
        <span>Planning signals</span>
        <h2 id="garden-planner-warnings-title">What to check next</h2>
      </div>
    </div>
    <div class="garden-planner-warning-list">
      ${cards.map((card) => `
        <article class="garden-planner-warning is-${escapeHtml(card.tone)}">
          <strong>${escapeHtml(card.title)}</strong>
          <p>${escapeHtml(card.text)}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function renderGardenPlannerSpace(entries) {
  const spaceStats = gardenPlannerSpaceStats(entries);
  const leaders = entries
    .map((entry) => ({ entry, value: gardenEntrySpace(entry) }))
    .filter(({ value }) => Number.isFinite(value))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4);
  const showLeaders = leaders.length >= 3;
  return `
    <div class="garden-planner-section-head">
      <div>
        <span>Space budget</span>
        <h2 id="garden-planner-space-title">Bed capacity check</h2>
      </div>
      <p>${escapeHtml(formatCompactNumber(spaceStats.available, 1))} sq ft available from current settings.</p>
    </div>
    ${renderGardenPlannerBedKitRecommendation()}
    ${entries.length ? `
      <div class="garden-planner-space-grid">
        ${renderGardenPlannerBedVisual(entries, spaceStats)}
        ${showLeaders ? `
        <div class="garden-planner-space-summary-grid">
          <article class="garden-planner-space-card">
            <div class="garden-planner-space-card-head">
              <span>Largest space uses</span>
              <strong>${leaders.length ? `${leaders.length} plant${leaders.length === 1 ? "" : "s"}` : "-"}</strong>
            </div>
            <div class="garden-planner-space-list">
              ${leaders.length ? leaders.map(({ entry }) => `
                <span>
                  <strong>${escapeHtml(entry.plant.name)}</strong>
                  ${escapeHtml(gardenEntrySpaceLabel(entry))}
                </span>
              `).join("") : "<span>No density-backed space estimates yet.</span>"}
            </div>
          </article>
        </div>
        ` : ""}
      </div>
    ` : `
      <div class="garden-planner-empty">
        <strong>No space budget yet.</strong>
        <span>Save plants from the Screener to see how much bed space they are likely to use.</span>
      </div>
    `}
  `;
}

function gardenPlannerTimelineData(entries) {
  const zoneData = gardenPlannerZoneData();
  const year = calendarPlanningYear(zoneData);
  const frost = estimateCalendarFrost(zoneData, year);
  const savedIds = new Set(entries.map((entry) => entry.plant.id));
  const events = buildCalendarEvents(frost).filter((event) => savedIds.has(event.plant.id));
  return {
    frost,
    groups: groupCalendarEvents(events).slice(0, 10),
    outOfZoneCount: entries.filter((entry) => !calendarPlantFitsZone(entry.plant, frost.zoneNumber)).length
  };
}

function renderGardenPlannerTimeline(entries) {
  let timeline;
  try {
    timeline = gardenPlannerTimelineData(entries);
  } catch {
    timeline = null;
  }
  return `
    <div class="garden-planner-section-head">
      <div>
        <span>Planting timeline</span>
        <h2 id="garden-planner-timeline-title">Calendar from saved plants</h2>
      </div>
      <p>${escapeHtml(gardenPlannerSettings.zone.toUpperCase())} timing estimate for the current planning year.</p>
    </div>
    ${entries.length && timeline?.groups.length ? `
      <div class="garden-planner-timeline-list">
        ${timeline.groups.map((group) => `
          <article class="garden-planner-timeline-item">
            <div>
              <span class="garden-planner-timeline-date">${escapeHtml(formatCalendarWindow(group.start, group.end))}</span>
              <span class="garden-planner-timeline-method">${escapeHtml(calendarMethodLabels[group.method] ?? sentenceCase(group.method))}</span>
            </div>
            <h3>${escapeHtml(group.action)}</h3>
            <p>${escapeHtml(calendarActionGuidance(group))}</p>
            <div class="garden-planner-timeline-plants">
              ${group.plants.slice(0, 5).map((plant) => `<a href="${plantPagePath(plant)}">${escapeHtml(plant.name)}</a>`).join("")}
              ${group.plants.length > 5 ? `<span>+${group.plants.length - 5} more</span>` : ""}
            </div>
          </article>
        `).join("")}
      </div>
      ${timeline.outOfZoneCount ? `<p class="garden-planner-section-note">${timeline.outOfZoneCount} saved plant${timeline.outOfZoneCount === 1 ? "" : "s"} are outside this zone and are omitted from the timeline.</p>` : ""}
    ` : `
      <div class="garden-planner-empty">
        <strong>${entries.length ? "No zone-fit timing rows." : "No saved plants yet."}</strong>
        <span>${entries.length ? "Adjust the USDA zone or review saved plants that are outside the selected zone." : "Save plants from the Screener to build a planting timeline."}</span>
      </div>
    `}
  `;
}

function renderGardenPlannerCompare(entries) {
  if (!entries.length) return "";
  return `
    <div class="garden-planner-section-head">
      <div>
        <span>Compare mode</span>
        <h2 id="garden-planner-compare-title">Saved plant comparison</h2>
      </div>
      <p>Planner quantities are included so totals match the saved garden list.</p>
    </div>
    <div class="garden-planner-compare-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">Plant</th>
            <th scope="col">Qty</th>
            <th scope="col">Zone fit</th>
            <th scope="col">First output</th>
            <th scope="col">Yield total</th>
            <th scope="col">Space</th>
            <th scope="col">Yield / 100 sq ft</th>
            <th scope="col">Container</th>
            <th scope="col">Site risk</th>
            <th scope="col">Data</th>
            <th scope="col">Risk cue</th>
          </tr>
        </thead>
        <tbody>
          ${entries.map((entry) => {
            const { plant, metrics, quantity } = entry;
            const screening = screeningProfile(plant, metrics);
            const issues = gardenPlannerFitChecks(entry);
            return `
              <tr>
                <td data-label="Plant"><a href="${plantPagePath(plant)}">${escapeHtml(plant.name)}</a></td>
                <td data-label="Qty">${escapeHtml(quantity)}</td>
                <td data-label="Zone fit">${gardenPlannerPlantZoneFits(plant) ? "Fits" : "Check"} (${escapeHtml(plant.zones[0])}-${escapeHtml(plant.zones[1])})</td>
                <td data-label="First output">${escapeHtml(metricDisplayValue(metrics.display?.firstOutput))}</td>
                <td data-label="Yield total">${escapeHtml(formatCompactNumber(gardenEntryYield(entry), 1))} lb</td>
                <td data-label="Space">${escapeHtml(gardenEntrySpaceLabel(entry))}</td>
                <td data-label="Yield / 100 sq ft">${escapeHtml(formatCompactNumber(yieldPer100SqFt(metrics), 1))}</td>
                <td data-label="Container">${escapeHtml(metricDisplayValue(metrics.display?.containerMin))}</td>
                <td data-label="Site risk">${escapeHtml(deerResistanceLabel(metrics))}; walnut ${escapeHtml(jugloneToleranceLabel(metrics))}</td>
                <td data-label="Data">${escapeHtml(metrics.display?.confidence ?? metrics.dataConfidence ?? "-")}</td>
                <td data-label="Risk cue">${escapeHtml(issues.length ? `${issues.join(", ")} fit` : screening.warning)}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderGardenPlannerTableRow(entry) {
  const { plant, metrics, quantity } = entry;
  const screening = screeningProfile(plant, metrics);
  const yieldValue = gardenEntryYield(entry);
  return `
    <tr>
      <td class="garden-planner-name" data-label="Plant">
        <a href="${plantPagePath(plant)}">${escapeHtml(plant.name)}</a>
        <span>${escapeHtml(plant.type)} - zone ${escapeHtml(plant.zones[0])}-${escapeHtml(plant.zones[1])}</span>
      </td>
      <td data-label="Qty">
        <input
          class="garden-planner-quantity"
          type="number"
          min="1"
          max="999"
          step="1"
          value="${escapeHtml(quantity)}"
          aria-label="Quantity for ${escapeHtml(plant.name)}"
          data-garden-quantity="${escapeHtml(plant.id)}"
        />
      </td>
      <td data-label="First output">
        <strong>${escapeHtml(metricDisplayValue(metrics.display?.firstOutput))}</strong>
        <span>${escapeHtml(metrics.horizonLabel ?? "")}</span>
      </td>
      <td data-label="Est. yield">
        <strong>${escapeHtml(formatCompactNumber(yieldValue, 1))}</strong>
        <span>${escapeHtml(metricDisplayValue(metrics.display?.yieldLbs, "lb estimate unavailable"))}</span>
      </td>
      <td data-label="Est. space">
        <strong>${escapeHtml(gardenEntrySpaceLabel(entry))}</strong>
        <span>spacing range</span>
      </td>
      <td data-label="Sun / water">
        <strong>${escapeHtml(plant.sun.map(sentenceCase).join(", "))}</strong>
        <span>${escapeHtml(sentenceCase(plant.water))} water</span>
      </td>
      <td data-label="Risk">
        <strong>${escapeHtml(metrics.display?.difficulty ?? "-")}</strong>
        <span>Reliability ${escapeHtml(metrics.display?.reliability ?? "-")}</span>
      </td>
      <td data-label="Site risk">
        <strong>${escapeHtml(deerResistanceLabel(metrics))}</strong>
        <span>Walnut: ${escapeHtml(jugloneToleranceLabel(metrics))}</span>
      </td>
      <td data-label="Planning cue">
        <strong>${escapeHtml(screening.warning)}</strong>
        <span>${escapeHtml(screening.support)}; ${escapeHtml(screening.pollination)}</span>
      </td>
      <td data-label="Actions" class="garden-planner-action-cell">
        <a href="${plantPagePath(plant)}">Profile</a>
        <button type="button" data-garden-remove="${escapeHtml(plant.id)}">Remove</button>
      </td>
    </tr>
  `;
}

function renderGardenPlannerTable(entries) {
  if (!entries.length) {
    return `
      <div class="garden-planner-empty">
        <strong>No saved plants yet.</strong>
        <span>Start in the Screener and use Save to garden on the plants you want to compare.</span>
      </div>
    `;
  }
  return `
    <div class="garden-planner-section-head">
      <div>
        <span>Saved list</span>
        <h2 id="garden-planner-table-title">Plant quantities and numbers</h2>
      </div>
    </div>
    <div class="garden-planner-table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">Plant</th>
            <th scope="col">Qty</th>
            <th scope="col">First output</th>
            <th scope="col">Est. yield</th>
            <th scope="col">Est. space</th>
            <th scope="col">Sun / water</th>
            <th scope="col">Risk</th>
            <th scope="col">Site risk</th>
            <th scope="col">Planning cue</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${entries.map(renderGardenPlannerTableRow).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderGardenPlannerSupplies(entries) {
  if (!entries.length) return "";
  const products = productsForPlants(entries.map(({ plant }) => plant), 14);
  if (!products.length) return "";
  const categoryOrder = [
    "Site prep",
    "Soil",
    "Containers",
    "Propagation",
    "Timing",
    "Watering",
    "Support",
    "Protection",
    "Nutrition",
    "Tools",
    "Maintenance",
    "Planning"
  ];
  const grouped = new Map();
  products.forEach((product) => {
    const category = product.category || "Planning";
    if (!grouped.has(category)) grouped.set(category, []);
    grouped.get(category).push(product);
  });
  const categoryEntries = Array.from(grouped.entries())
    .sort(([categoryA], [categoryB]) => {
      const indexA = categoryOrder.indexOf(categoryA);
      const indexB = categoryOrder.indexOf(categoryB);
      return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB) || categoryA.localeCompare(categoryB);
    });
  return `
    <div class="garden-planner-section-head">
      <div>
        <span>Shopping list</span>
        <h2 id="garden-planner-supplies-title">Supplies by need</h2>
        <p>Product links may earn a commission and do not affect plant rankings.</p>
      </div>
    </div>
    <div class="garden-planner-supply-groups">
      ${categoryEntries.map(([category, categoryProducts]) => `
        <article class="garden-planner-supply-group">
          <h3>${escapeHtml(category)}</h3>
          <div class="garden-planner-supply-items">
            ${categoryProducts.map((product) => `
              <div class="garden-planner-supply-item">
                <div>
                  <strong>${escapeHtml(product.name)}</strong>
                  <span>${escapeHtml(product.timing ?? "Planning")} - ${escapeHtml(product.use ?? "")}</span>
                </div>
                ${productLink(product, "garden_planner_supply", "View")}
              </div>
            `).join("")}
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderGardenPlanner() {
  if (!gardenPlannerStatsEl || !gardenPlannerWarningsEl || !gardenPlannerTableEl || !gardenPlannerSuppliesEl) return;
  const entries = gardenPlannerEntries();
  renderGardenPlannerSummarySections(entries);
  gardenPlannerTableEl.innerHTML = renderGardenPlannerTable(entries);
  renderGardenPlannerSearchResults();
}

function renderGardenPlannerSummarySections(entries = gardenPlannerEntries()) {
  if (!gardenPlannerStatsEl || !gardenPlannerWarningsEl || !gardenPlannerSuppliesEl) return;
  if (!entries.length) gardenPlannerCompareOpen = false;
  gardenPlannerStatsEl.innerHTML = renderGardenPlannerStats(entries);
  gardenPlannerWarningsEl.innerHTML = renderGardenPlannerSignals(entries);
  if (gardenPlannerSpaceEl) gardenPlannerSpaceEl.innerHTML = renderGardenPlannerSpace(entries);
  if (gardenPlannerCompanionsEl) {
    const companionMarkup = renderGardenPlannerCompanions(entries);
    gardenPlannerCompanionsEl.innerHTML = companionMarkup;
    gardenPlannerCompanionsEl.hidden = !companionMarkup;
  }
  if (gardenPlannerTimelineEl) gardenPlannerTimelineEl.innerHTML = renderGardenPlannerTimeline(entries);
  if (gardenPlannerComparePanelEl) {
    const compareMarkup = gardenPlannerCompareOpen ? renderGardenPlannerCompare(entries) : "";
    gardenPlannerComparePanelEl.innerHTML = compareMarkup;
    gardenPlannerComparePanelEl.hidden = !compareMarkup;
  }
  const supplyMarkup = renderGardenPlannerSupplies(entries);
  gardenPlannerSuppliesEl.innerHTML = supplyMarkup;
  gardenPlannerSuppliesEl.hidden = !supplyMarkup;
  if (gardenPlannerCompareEl) {
    gardenPlannerCompareEl.disabled = entries.length === 0;
    gardenPlannerCompareEl.textContent = gardenPlannerCompareOpen ? "Hide comparison" : "Compare saved plants";
  }
  if (gardenPlannerExportEl) gardenPlannerExportEl.disabled = entries.length === 0;
  if (gardenPlannerPrintBedEl) gardenPlannerPrintBedEl.disabled = entries.length === 0;
  if (gardenPlannerClearEl) gardenPlannerClearEl.disabled = entries.length === 0;
  renderGardenPlannerSearchResults();
}

function gardenPlannerCsv(entries) {
  const headers = [
    "Plant",
    "Type",
    "Quantity",
    "Zone range",
    "First output",
    "Yield estimate",
    "Estimated yield total",
    "Estimated square feet min",
    "Estimated square feet max",
    "Estimated square feet midpoint",
    "Sun",
    "Water",
    "Difficulty",
    "Reliability",
    "Deer resistance",
    "Juglone / black walnut cue",
    "Planning cue",
    "Profile URL"
  ];
  const rows = entries.map((entry) => {
    const { plant, metrics, quantity } = entry;
    const screening = screeningProfile(plant, metrics);
    const [spaceMin, spaceMax] = gardenEntrySpaceRange(entry);
    return [
      plant.name,
      plant.type,
      quantity,
      `${plant.zones[0]}-${plant.zones[1]}`,
      metricDisplayValue(metrics.display?.firstOutput, ""),
      metricDisplayValue(metrics.display?.yieldLbs, ""),
      formatCompactNumber(gardenEntryYield(entry), 1, ""),
      formatCompactNumber(spaceMin, 1, ""),
      formatCompactNumber(spaceMax, 1, ""),
      formatCompactNumber(gardenEntrySpace(entry), 1, ""),
      plant.sun.map(sentenceCase).join("; "),
      sentenceCase(plant.water),
      metrics.display?.difficulty ?? "",
      metrics.display?.reliability ?? "",
      deerResistanceLabel(metrics),
      jugloneToleranceLabel(metrics),
      `${screening.warning}; ${screening.support}; ${screening.pollination}`,
      `${window.location.origin}${plantPagePath(plant)}`
    ];
  });
  return [headers, ...rows].map((row) => row.map(quoteCsvValue).join(",")).join("\n");
}

function exportGardenPlanner() {
  const entries = gardenPlannerEntries();
  if (!entries.length) return;
  const blob = new Blob([gardenPlannerCsv(entries)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `plantbyzip-garden-planner-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function cleanupGardenPlannerPrintMode() {
  document.body.classList.remove("garden-planner-print-mode");
  window.removeEventListener("afterprint", cleanupGardenPlannerPrintMode);
}

function exportGardenPlannerBedPdf() {
  if (!gardenPlannerEntries().length) return;
  document.body.classList.add("garden-planner-print-mode");
  window.addEventListener("afterprint", cleanupGardenPlannerPrintMode);
  requestAnimationFrame(() => {
    window.print();
    setTimeout(cleanupGardenPlannerPrintMode, 1200);
  });
}

function showScreenerTab() {
  setActiveView("screener");
  history.replaceState(null, "", "#screener");
}

function showGardenPlannerTab() {
  setActiveView("garden-planner");
  history.replaceState(null, "", "#garden-planner");
}

function gardenPlannerLayoutPositionFromPoint(board, clientX, clientY) {
  if (!board) return null;
  const rect = board.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  return cleanGardenPlannerLayoutPosition({
    x: ((clientX - rect.left) / rect.width) * 100,
    y: ((clientY - rect.top) / rect.height) * 100
  });
}

function updateGardenPlannerLayoutDomPosition(layoutId, position) {
  if (!gardenPlannerSpaceEl || !position) return;
  gardenPlannerSpaceEl.querySelectorAll("[data-garden-layout-marker], [data-garden-layout-radius]").forEach((element) => {
    if (element.dataset.gardenLayoutMarker !== layoutId && element.dataset.gardenLayoutRadius !== layoutId) return;
    element.style.setProperty("--marker-x", `${position.x}%`);
    element.style.setProperty("--marker-y", `${position.y}%`);
  });
}

function blurActiveGardenPlannerQuantityInput() {
  const activeElement = document.activeElement;
  if (activeElement?.classList?.contains("garden-planner-quantity")) activeElement.blur();
}

function gardenPlannerLayoutPointInsideBoard(board, clientX, clientY) {
  if (!board) return false;
  const rect = board.getBoundingClientRect();
  return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
}

function createGardenPlannerDragGhost(source, event) {
  const ghost = document.createElement("div");
  ghost.className = "garden-planner-bed-drag-ghost";
  ghost.style.setProperty("--bed-fill", source.style.getPropertyValue("--bed-fill") || "#2f6f4f");
  ghost.textContent = source.dataset.gardenLayoutLabel || "";
  document.body.append(ghost);
  moveGardenPlannerDragGhost(ghost, event);
  return ghost;
}

function moveGardenPlannerDragGhost(ghost, event) {
  if (!ghost) return;
  ghost.style.left = `${event.clientX}px`;
  ghost.style.top = `${event.clientY}px`;
}

function suppressGardenPlannerLayoutClickOnce() {
  gardenPlannerSuppressLayoutClick = true;
  setTimeout(() => {
    gardenPlannerSuppressLayoutClick = false;
  }, 0);
}

function handleGardenPlannerLayoutDragStart(event) {
  const source = event.target.closest("[data-garden-layout-plant]");
  if (!source || !gardenPlannerSpaceEl?.contains(source)) return;
  const layoutId = source.dataset.gardenLayoutId || source.dataset.gardenLayoutMarker || source.dataset.gardenLayoutPlace;
  if (!layoutId || !gardenPlannerLayoutIdIsActive(layoutId)) return;
  gardenPlannerLayoutDragId = normalizeGardenPlannerLayoutId(layoutId);
  source.classList.add("is-dragging");
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", gardenPlannerLayoutDragId);
  }
}

function handleGardenPlannerLayoutDragEnd(event) {
  const source = event.target.closest("[data-garden-layout-plant]");
  source?.classList.remove("is-dragging");
  gardenPlannerLayoutDragId = null;
}

function handleGardenPlannerLayoutDragOver(event) {
  if (!event.target.closest("[data-garden-layout-board]")) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
}

function handleGardenPlannerLayoutDrop(event) {
  const board = event.target.closest("[data-garden-layout-board]");
  if (!board) return;
  const layoutId = event.dataTransfer?.getData("text/plain") || gardenPlannerLayoutDragId;
  if (!layoutId) return;
  const position = gardenPlannerLayoutPositionFromPoint(board, event.clientX, event.clientY);
  if (!position) return;
  event.preventDefault();
  if (setGardenPlannerLayoutPosition(layoutId, position.x, position.y)) {
    trackEvent("filter_apply", {
      tool: "garden-planner",
      action: "bed_layout_drop",
      watchlist_count: screenerWatchlistIds.size
    });
  }
  gardenPlannerLayoutDragId = null;
}

function handleGardenPlannerLayoutPointerDown(event) {
  const marker = event.target.closest("[data-garden-layout-marker]");
  if (marker && gardenPlannerSpaceEl?.contains(marker)) {
    const board = marker.closest("[data-garden-layout-board]");
    const layoutId = marker.dataset.gardenLayoutMarker;
    if (!board || !layoutId) return;
    event.preventDefault();
    gardenPlannerLayoutPointerDrag = {
      board,
      layoutId,
      pointerId: event.pointerId,
      changed: false,
      source: "marker"
    };
    marker.classList.add("is-dragging");
    marker.setPointerCapture?.(event.pointerId);
    return;
  }
  const chip = event.target.closest("[data-garden-layout-place]");
  if (!chip || !gardenPlannerSpaceEl?.contains(chip)) return;
  const board = gardenPlannerSpaceEl.querySelector("[data-garden-layout-board]");
  const layoutId = chip.dataset.gardenLayoutPlace;
  if (!board || !layoutId) return;
  gardenPlannerLayoutPointerDrag = {
    board,
    chip,
    layoutId,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    defaultX: Number(chip.dataset.defaultX),
    defaultY: Number(chip.dataset.defaultY),
    changed: false,
    source: "chip"
  };
  chip.setPointerCapture?.(event.pointerId);
}

function handleGardenPlannerLayoutPointerMove(event) {
  const drag = gardenPlannerLayoutPointerDrag;
  if (!drag || drag.pointerId !== event.pointerId) return;
  if (drag.source === "chip") {
    const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
    if (distance < 4 && !drag.changed) return;
    drag.changed = true;
    drag.chip?.classList.add("is-dragging");
    if (!drag.ghost) drag.ghost = createGardenPlannerDragGhost(drag.chip, event);
    moveGardenPlannerDragGhost(drag.ghost, event);
    return;
  }
  const position = gardenPlannerLayoutPositionFromPoint(drag.board, event.clientX, event.clientY);
  if (!position) return;
  drag.changed = true;
  drag.position = position;
  updateGardenPlannerLayoutDomPosition(drag.layoutId, position);
}

function finishGardenPlannerLayoutPointerDrag(event) {
  const drag = gardenPlannerLayoutPointerDrag;
  if (!drag || drag.pointerId !== event.pointerId) return;
  const marker = gardenPlannerSpaceEl?.querySelector(`[data-garden-layout-marker="${drag.layoutId}"]`);
  marker?.classList.remove("is-dragging");
  drag.chip?.classList.remove("is-dragging");
  drag.ghost?.remove();
  gardenPlannerLayoutPointerDrag = null;
  let position = drag.position;
  let action = "bed_layout_move";
  if (drag.source === "chip") {
    action = drag.changed ? "bed_layout_drop" : "bed_layout_place";
    if (drag.changed) {
      suppressGardenPlannerLayoutClickOnce();
      if (!gardenPlannerLayoutPointInsideBoard(drag.board, event.clientX, event.clientY)) return;
      position = gardenPlannerLayoutPositionFromPoint(drag.board, event.clientX, event.clientY);
    } else {
      position = cleanGardenPlannerLayoutPosition({ x: drag.defaultX, y: drag.defaultY });
    }
  } else if (!drag.changed) {
    blurActiveGardenPlannerQuantityInput();
    gardenPlannerSelectedLayoutId = drag.layoutId;
    renderGardenPlannerSummarySections();
    trackEvent("filter_apply", {
      tool: "garden-planner",
      action: "bed_layout_select",
      watchlist_count: screenerWatchlistIds.size
    });
    return;
  }
  if (!position) return;
  if (drag.changed && drag.source !== "chip") suppressGardenPlannerLayoutClickOnce();
  if (setGardenPlannerLayoutPosition(drag.layoutId, position.x, position.y)) {
    trackEvent("filter_apply", {
      tool: "garden-planner",
      action,
      watchlist_count: screenerWatchlistIds.size
    });
  }
}

function handleGardenPlannerLayoutClick(event) {
  if (gardenPlannerSuppressLayoutClick) {
    gardenPlannerSuppressLayoutClick = false;
    return;
  }
  const resetButton = event.target.closest("[data-garden-layout-reset]");
  if (resetButton) {
    clearGardenPlannerLayout();
    trackEvent("filter_apply", {
      tool: "garden-planner",
      action: "bed_layout_reset",
      watchlist_count: screenerWatchlistIds.size
    });
    return;
  }
  const autoButton = event.target.closest("[data-garden-layout-auto]");
  if (autoButton) {
    const arrangedCount = autoArrangeGardenPlannerLayout();
    if (arrangedCount) {
      trackEvent("filter_apply", {
        tool: "garden-planner",
        action: "bed_layout_auto_arrange",
        watchlist_count: screenerWatchlistIds.size,
        arranged_count: arrangedCount
      });
    }
    return;
  }
  const removeLayoutButton = event.target.closest("[data-garden-layout-remove]");
  if (removeLayoutButton) {
    const removed = removeGardenPlannerLayoutPosition(removeLayoutButton.dataset.gardenLayoutRemove);
    if (removed) {
      trackEvent("filter_apply", {
        tool: "garden-planner",
        action: "bed_layout_remove_marker",
        watchlist_count: screenerWatchlistIds.size
      });
    }
    return;
  }
  const markerButton = event.target.closest("[data-garden-layout-marker]");
  if (markerButton && gardenPlannerSpaceEl?.contains(markerButton)) {
    const layoutId = normalizeGardenPlannerLayoutId(markerButton.dataset.gardenLayoutMarker);
    if (layoutId && gardenPlannerLayout[layoutId]) {
      blurActiveGardenPlannerQuantityInput();
      gardenPlannerSelectedLayoutId = layoutId;
      renderGardenPlannerSummarySections();
    }
    return;
  }
  const placeButton = event.target.closest("[data-garden-layout-place]");
  if (!placeButton) return;
  const layoutId = placeButton.dataset.gardenLayoutPlace;
  if (!layoutId || !gardenPlannerLayoutIdIsActive(layoutId)) return;
  const x = Number(placeButton.dataset.defaultX);
  const y = Number(placeButton.dataset.defaultY);
  if (setGardenPlannerLayoutPosition(layoutId, x, y)) {
    trackEvent("filter_apply", {
      tool: "garden-planner",
      action: "bed_layout_place",
      watchlist_count: screenerWatchlistIds.size
    });
  }
}

function compareGardenPlannerPlants() {
  if (!gardenPlannerEntries().length) return;
  gardenPlannerCompareOpen = !gardenPlannerCompareOpen;
  renderGardenPlannerSummarySections();
  requestAnimationFrame(() => {
    if (gardenPlannerCompareOpen) {
      gardenPlannerComparePanelEl?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

function clearGardenPlanner() {
  if (!screenerWatchlistIds.size) return;
  if (!window.confirm("Clear all plants from this local garden plan?")) return;
  screenerWatchlistIds = new Set();
  gardenPlannerQuantities = {};
  gardenPlannerLayout = {};
  gardenPlannerSelectedLayoutId = null;
  gardenPlannerCompareOpen = false;
  saveScreenerWatchlist();
  saveGardenPlannerQuantities();
  saveGardenPlannerLayout();
  if (screenerFlagEl?.value === "watchlist") screenerFlagEl.value = "";
  renderScreener();
  renderGardenPlanner();
}

function setScreenerPortfolioMembership(plantId, shouldSave) {
  const plant = plantById(plantId);
  if (!plant) return false;
  const wasSaved = screenerWatchlistIds.has(plantId);
  if (shouldSave) {
    screenerWatchlistIds.add(plantId);
    if (!gardenPlannerQuantities[plantId]) gardenPlannerQuantities[plantId] = 1;
  } else {
    screenerWatchlistIds.delete(plantId);
    delete gardenPlannerQuantities[plantId];
    clearGardenPlannerLayoutForPlant(plantId);
  }
  if (!screenerWatchlistIds.size) gardenPlannerCompareOpen = false;
  if (wasSaved === screenerWatchlistIds.has(plantId)) return false;
  saveScreenerWatchlist();
  saveGardenPlannerQuantities();
  saveGardenPlannerLayout();
  if (gardenPlannerInitialized) renderGardenPlanner();
  return true;
}

function syncScreenerCompareInputs() {
  document.querySelectorAll(".screener-compare-input, .screener-portfolio-compare-input").forEach((input) => {
    input.checked = screenerCompareIds.has(input.value);
    input.disabled = !input.checked && screenerCompareIds.size >= screenerCompareLimit;
  });
}

function setScreenerCompareMembership(plantId, shouldCompare) {
  if (!plantById(plantId)) return false;
  if (shouldCompare) {
    if (screenerCompareIds.size >= screenerCompareLimit && !screenerCompareIds.has(plantId)) return false;
    screenerCompareIds.add(plantId);
  } else {
    screenerCompareIds.delete(plantId);
  }
  return true;
}

function quoteCsvValue(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll("\"", "\"\"")}"`;
}

function screenerPortfolioCsv(entries) {
  const headers = [
    "Plant",
    "Type",
    "Zone range",
    "First output",
    "Yield lbs",
    "Yield per 100 sq ft",
    "Adjusted yield score",
    "Container min",
    "Difficulty",
    "Reliability",
    "Deer resistance",
    "Juglone / black walnut cue",
    "Data confidence",
    "Source count",
    "Planning cue",
    "Profile URL"
  ];
  const rows = entries.map(({ plant, metrics }) => {
    const screening = screeningProfile(plant, metrics);
    const score = reliabilityAdjustedYield(metrics) ?? difficultyAdjustedYield(metrics);
    return [
      plant.name,
      plant.type,
      `${plant.zones[0]}-${plant.zones[1]}`,
      metricDisplayValue(metrics.display?.firstOutput, ""),
      metricDisplayValue(metrics.display?.yieldLbs, ""),
      formatCompactNumber(yieldPer100SqFt(metrics), 1, ""),
      formatCompactNumber(score, 1, ""),
      metricDisplayValue(metrics.display?.containerMin, ""),
      metrics.display?.difficulty ?? "",
      metrics.display?.reliability ?? "",
      deerResistanceLabel(metrics),
      jugloneToleranceLabel(metrics),
      metrics.display?.confidence ?? metrics.dataConfidence ?? "",
      metrics.sourceKeys?.length ?? 0,
      `${screening.warning}; ${screening.support}; ${screening.pollination}`,
      `${window.location.origin}${plantPagePath(plant)}`
    ];
  });
  return [headers, ...rows].map((row) => row.map(quoteCsvValue).join(",")).join("\n");
}

function exportScreenerPortfolio() {
  const entries = screenerPortfolioEntries();
  if (!entries.length) return;
  const blob = new Blob([screenerPortfolioCsv(entries)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `plantbyzip-portfolio-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function screenerSupplyIntent() {
  const columnPreset = screenerColumnPresetEl?.value ?? "core";
  if (columnPreset === "container" || screenerContainerEl.value || screenerMaxContainerEl?.value) {
    return {
      kicker: "Container screen",
      title: "Container setup products",
      categories: ["Containers", "Soil", "Watering"],
      productIds: ["drainage-container", "container-potting-mix", "watering-wand", "hose-timer"]
    };
  }
  if (screenerWaterEl.value === "high" || screenerSoilEl.value === "sandy") {
    return {
      kicker: "Water screen",
      title: "Watering supplies for thirsty plantings",
      categories: ["Watering", "Soil"],
      productIds: ["drip-irrigation-kit", "hose-timer", "organic-mulch", "watering-wand"]
    };
  }
  if (screenerGoalEl.value === "fruit" || columnPreset === "yield") {
    return {
      kicker: "Yield screen",
      title: "Harvest and fruiting support",
      categories: ["Nutrition", "Maintenance", "Support", "Protection"],
      productIds: ["fruit-tree-fertilizer", "bypass-pruners", "bird-netting", "trellis-netting"]
    };
  }
  if (screenerGoalEl.value === "vegetables-herbs" || screenerTypeEl.value.includes("annual")) {
    return {
      kicker: "Annual crop screen",
      title: "Seed-starting and crop protection",
      categories: ["Propagation", "Protection", "Timing"],
      productIds: ["seed-starting-trays", "grow-light", "seedling-heat-mat", "soil-thermometer", "insect-netting"]
    };
  }
  if (screenerFlagEl.value === "native" || columnPreset === "ecology") {
    return {
      kicker: "Ecology screen",
      title: "Site-prep supplies for habitat beds",
      categories: ["Site prep", "Soil", "Tools"],
      productIds: ["soil-test-lab-mailer", "finished-compost", "organic-mulch", "hand-trowel"]
    };
  }
  return {
    kicker: "Matched supplies",
    title: "Useful supplies for this screen",
    categories: ["Site prep", "Tools", "Watering"],
    productIds: ["soil-test-lab-mailer", "garden-gloves", "hand-trowel", "watering-wand"]
  };
}

function screenerProductsForPlants(entries, limit = 4) {
  if (!affiliateProducts.length || !entries.length) return [];
  const intent = screenerSupplyIntent();
  const summaries = new Map();
  affiliateProducts.forEach((product, index) => {
    let score = intent.productIds.includes(product.id) ? 36 : 0;
    if (intent.categories.includes(product.category)) score += 18;
    entries.slice(0, 36).forEach((plant) => {
      score += productScoreForPlant(product, plant);
    });
    if (score <= 0) return;
    summaries.set(product.id, { ...product, score, index });
  });
  return Array.from(summaries.values())
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit);
}

function renderScreenerSupplyPanel(filtered) {
  if (!screenerSupplyPanelEl || !screenerSupplyListEl) return;
  const products = screenerProductsForPlants(filtered, 4);
  if (!products.length) {
    screenerSupplyPanelEl.hidden = true;
    return;
  }
  const intent = screenerSupplyIntent();
  screenerSupplyPanelEl.hidden = false;
  if (screenerSupplyKickerEl) screenerSupplyKickerEl.textContent = intent.kicker;
  if (screenerSupplyTitleEl) screenerSupplyTitleEl.textContent = intent.title;
  screenerSupplyListEl.innerHTML = products.map((product) => `
    <article class="screener-supply-card">
      <span>${escapeHtml(product.category)} &middot; ${escapeHtml(product.timing ?? "Planning")}</span>
      <strong>${escapeHtml(product.name)}</strong>
      <p>${escapeHtml(product.use ?? "")}</p>
      ${productLink(product, "screener_supply", "View")}
    </article>
  `).join("");
}

function plantById(id) {
  return plants.find((plant) => plant.id === id) ?? null;
}

function compareMetricRows(selectedPlants) {
  const rows = [
    ["Type", (plant) => plant.type],
    ["Zone range", (plant) => `${plant.zones[0]}-${plant.zones[1]}`],
    ["First output", (plant) => metricDisplayValue(metricFor(plant).display?.firstOutput)],
    ["Yield", (plant) => metricDisplayValue(metricFor(plant).display?.yieldLbs)],
    ["Yield / 100 sq ft", (plant) => formatCompactNumber(yieldPer100SqFt(metricFor(plant)))],
    ["Adjusted score", (plant) => formatCompactNumber(reliabilityAdjustedYield(metricFor(plant)) ?? difficultyAdjustedYield(metricFor(plant)), 1)],
    ["Payoff score", (plant) => formatCompactNumber(timeToPayoffScore(metricFor(plant)), 1)],
    ["Container min", (plant) => metricDisplayValue(metricFor(plant).display?.containerMin)],
    ["Difficulty", (plant) => metricFor(plant).display?.difficulty ?? "-"],
    ["Reliability", (plant) => metricFor(plant).display?.reliability ?? "-"],
    ["Data", (plant) => `${metricFor(plant).display?.confidence ?? "-"} - ${metricFor(plant).sourceKeys?.length ?? 0} sources`],
    ["Sun / water", (plant) => `${plant.sun.map(sentenceCase).join(", ")} / ${sentenceCase(plant.water)}`],
    ["pH cue", (plant) => screeningProfile(plant).ph],
    ["Pollination", (plant) => screeningProfile(plant).pollination],
    ["Support", (plant) => screeningProfile(plant).support],
    ["Deer", (plant) => deerResistanceLabel(metricFor(plant))],
    ["Black walnut", (plant) => jugloneToleranceLabel(metricFor(plant))],
    ["Planning cue", (plant) => screeningProfile(plant).warning],
    ["Pest/disease", (plant) => {
      const screening = screeningProfile(plant);
      return `${screening.pestPressure} / ${screening.diseasePressure}`;
    }]
  ];
  return rows.map(([label, reader]) => `
    <tr>
      <th scope="row">${escapeHtml(label)}</th>
      ${selectedPlants.map((plant) => `<td>${escapeHtml(reader(plant))}</td>`).join("")}
    </tr>
  `).join("");
}

function renderScreenerComparePanel() {
  if (!screenerComparePanelEl || !screenerCompareTableEl) return;
  const selectedPlants = Array.from(screenerCompareIds).map(plantById).filter(Boolean);
  screenerComparePanelEl.hidden = selectedPlants.length === 0;
  if (!selectedPlants.length) {
    screenerCompareTableEl.innerHTML = "";
    if (screenerCompareStatusEl) screenerCompareStatusEl.textContent = "Choose rows from the table to compare core metrics side by side.";
    syncScreenerCompareInputs();
    return;
  }
  if (screenerCompareTitleEl) {
    screenerCompareTitleEl.textContent = `${selectedPlants.length} selected for comparison`;
  }
  if (screenerCompareStatusEl) {
    screenerCompareStatusEl.textContent = selectedPlants.length >= screenerCompareLimit
      ? `Compare basket is full at ${screenerCompareLimit} plants.`
      : `Select up to ${screenerCompareLimit} plants.`;
  }
  screenerCompareTableEl.innerHTML = `
    <table>
      <thead>
        <tr>
          <th scope="col">Metric</th>
          ${selectedPlants.map((plant) => `<th scope="col"><a href="${plantPagePath(plant)}">${escapeHtml(plant.name)}</a></th>`).join("")}
        </tr>
      </thead>
      <tbody>${compareMetricRows(selectedPlants)}</tbody>
    </table>
  `;
  syncScreenerCompareInputs();
}

function loadScreenerWatchlist() {
  try {
    const raw = localStorage.getItem(screenerWatchlistStorageKey);
    const ids = raw ? JSON.parse(raw) : [];
    screenerWatchlistIds = new Set(Array.isArray(ids) ? ids.filter(plantById) : []);
  } catch {
    screenerWatchlistIds = new Set();
  }
}

function saveScreenerWatchlist() {
  try {
    localStorage.setItem(screenerWatchlistStorageKey, JSON.stringify(Array.from(screenerWatchlistIds)));
  } catch {
    // Keep the in-memory watchlist usable even if storage is unavailable.
  }
}

function renderScreener() {
  const matchingPlants = plants.filter(plantMatchesScreener);
  const filtered = screenerGroupedByType
    ? sortGroupedScreenerPlants(matchingPlants)
    : sortScreenerPlants(matchingPlants);
  screenerLastFiltered = filtered;
  const visible = filtered.slice(0, screenerVisibleLimit);
  const counts = groupCounts(filtered);
  screenerBodyEl.innerHTML = screenerGroupedByType
    ? renderScreenerGroupedRows(visible, counts)
    : visible.map(renderScreenerRow).join("");
  updateScreenerColumnVisibility();
  renderScreenerSupplyPanel(filtered);
  renderScreenerComparePanel();
  renderScreenerPortfolioPanel();
  screenerVisibleCountEl.textContent = String(filtered.length);
  screenerGroupTypeEl.classList.toggle("is-active", screenerGroupedByType);
  screenerGroupTypeEl.setAttribute("aria-pressed", String(screenerGroupedByType));
  if (filtered.length === 0) {
    screenerSummaryEl.textContent = "No plants match those filters.";
  } else if (filtered.length === plants.length && visible.length === filtered.length) {
    screenerSummaryEl.textContent = screenerGroupedByType
      ? `Showing all ${plants.length} plants in ${counts.size} type groups.`
      : `Showing all ${plants.length} plants.`;
  } else {
    screenerSummaryEl.textContent = screenerGroupedByType
      ? `Showing ${visible.length} of ${filtered.length} matching plants in ${counts.size} type groups.`
      : `Showing ${visible.length} of ${filtered.length} matching plants.`;
  }
  if (filtered.length > visible.length) {
    const remaining = filtered.length - visible.length;
    screenerMoreEl.hidden = false;
    screenerMoreEl.textContent = `Show more (${remaining} left)`;
  } else {
    screenerMoreEl.hidden = true;
  }
  screenerEmptyEl.hidden = filtered.length > 0;
  updateScreenerSortUI();
}

function addSelectOption(select, value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  select.append(option);
}

function applyInitialScreenerState() {
  Object.entries(screenerParamMap).forEach(([key, control]) => {
    const value = initialParams.get(key);
    if (value !== null && control) control.value = value;
  });
  const requestedScreen = initialParams.get("sscreen");
  if (requestedScreen && screenerSavedScreenEl && screenerSavedScreens[requestedScreen]) {
    screenerSavedScreenEl.value = requestedScreen;
  }
  const requestedSort = initialParams.get("ssort");
  const requestedDirection = initialParams.get("sdir");
  const sortKeys = new Set(screenerSortButtons.map((button) => button.dataset.screenerSort));
  if (requestedSort && sortKeys.has(requestedSort)) {
    screenerSort = {
      key: requestedSort,
      direction: requestedDirection === "desc" ? "desc" : "asc"
    };
  }
  screenerGroupedByType = initialParams.get("sgroup") === "type";
}

function writeScreenerUrl() {
  const params = new URLSearchParams(window.location.search);
  screenerParamKeys.forEach((key) => params.delete(key));
  params.delete("q");
  Object.entries(screenerParamMap).forEach(([key, control]) => {
    if (!control?.value) return;
    if (key === "sview" && control.value === "core") return;
    params.set(key, control.value);
  });
  if (screenerSavedScreenEl?.value) params.set("sscreen", screenerSavedScreenEl.value);
  if (screenerSort.key !== "name" || screenerSort.direction !== "asc") {
    params.set("ssort", screenerSort.key);
    params.set("sdir", screenerSort.direction);
  }
  if (screenerGroupedByType) {
    params.set("sgroup", "type");
  }
  const query = params.toString();
  history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}#screener`);
}

function activeScreenerFilterCount() {
  return screenerFilterEls.filter((control) => {
    if (!control?.value) return false;
    if (control === screenerColumnPresetEl && control.value === "core") return false;
    return true;
  }).length;
}

function handleScreenerFilterChange() {
  if (screenerSavedScreenEl) screenerSavedScreenEl.value = "";
  screenerVisibleLimit = screenerPageSize;
  writeScreenerUrl();
  renderScreener();
  trackEvent("filter_apply", {
    tool: "screener",
    action: "filter_change",
    filter_count: activeScreenerFilterCount()
  });
}

function clearScreenerRangeFilters() {
  screenerRangeEls.forEach((control) => {
    control.value = "";
  });
}

function clearScreenerBaseFilters() {
  [
    screenerSearchEl,
    screenerTypeEl,
    screenerZoneEl,
    screenerHorizonEl,
    screenerContainerEl,
    screenerSunEl,
    screenerSoilEl,
    screenerWaterEl,
    screenerGoalEl,
    screenerFlagEl,
    screenerDeerEl,
    screenerJugloneEl,
    screenerPartnerEl,
    screenerConfidenceEl
  ].filter(Boolean).forEach((control) => {
    control.value = "";
  });
  clearScreenerRangeFilters();
}

function setScreenerControlByParam(key, value) {
  const control = screenerParamMap[key];
  if (control) control.value = value;
}

function applyScreenerSavedScreen(screenId) {
  const screen = screenerSavedScreens[screenId];
  if (!screen) return;
  clearScreenerBaseFilters();
  screenerColumnPresetEl.value = screen.columnPreset ?? "core";
  Object.entries(screen.values ?? {}).forEach(([key, value]) => setScreenerControlByParam(key, value));
  Object.entries(screen.ranges ?? {}).forEach(([key, value]) => setScreenerControlByParam(key, value));
  screenerSort = screen.sort ?? { key: "name", direction: "asc" };
  screenerGroupedByType = false;
  screenerVisibleLimit = screenerPageSize;
  writeScreenerUrl();
  renderScreener();
  trackEvent("filter_apply", {
    tool: "screener",
    action: "saved_screen",
    screen: screenId,
    filter_count: activeScreenerFilterCount()
  });
}

function initializeGardenPlanner() {
  loadGardenPlannerQuantities();
  loadGardenPlannerLayout();
  loadGardenPlannerSettings();
  applyGardenPlannerSettingsToControls();
  if (gardenPlannerSettingsStatusEl) {
    gardenPlannerSettingsStatusEl.textContent = `Using USDA zone ${gardenPlannerSettings.zone.toUpperCase()} with ${formatCompactNumber(gardenPlannerTotalSqFt(), 1)} sq ft of planned bed space.`;
  }
  gardenPlannerSettingsFormEl?.addEventListener("input", (event) => {
    if (event.target === gardenPlannerZipEl) {
      gardenPlannerZipEl.value = gardenPlannerZipEl.value.replace(/\D+/g, "").slice(0, 5);
    }
    syncGardenPlannerSettingsFromControls();
    if (gardenPlannerSettingsStatusEl) {
      gardenPlannerSettingsStatusEl.textContent = `Using USDA zone ${gardenPlannerSettings.zone.toUpperCase()} with ${formatCompactNumber(gardenPlannerTotalSqFt(), 1)} sq ft of planned bed space.`;
    }
  });
  gardenPlannerSettingsFormEl?.addEventListener("change", () => {
    syncGardenPlannerSettingsFromControls();
    applyGardenPlannerSettingsToControls();
    if (gardenPlannerSettingsStatusEl) {
      gardenPlannerSettingsStatusEl.textContent = `Using USDA zone ${gardenPlannerSettings.zone.toUpperCase()} with ${formatCompactNumber(gardenPlannerTotalSqFt(), 1)} sq ft of planned bed space.`;
    }
  });
  gardenPlannerSettingsFormEl?.addEventListener("submit", (event) => {
    event.preventDefault();
    lookupGardenPlannerZip();
    trackEvent("filter_apply", {
      tool: "garden-planner",
      action: "settings_lookup"
    });
  });
  gardenPlannerOpenScreenerEl?.addEventListener("click", () => {
    showScreenerTab();
    trackEvent("tool_tab_view", { tool: "screener", source: "garden_planner_full_listing" });
  });
  gardenPlannerSearchEl?.addEventListener("input", () => {
    renderGardenPlannerSearchResults();
  });
  gardenPlannerSearchResultsEl?.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-garden-quick-add]");
    if (!addButton) return;
    const plantId = addButton.dataset.gardenQuickAdd;
    if (!plantId) return;
    const changed = setScreenerPortfolioMembership(plantId, true);
    if (changed) {
      renderScreener();
      renderGardenPlanner();
      trackEvent("filter_apply", {
        tool: "garden-planner",
        action: "quick_add",
        watchlist_count: screenerWatchlistIds.size
      });
    }
  });
  gardenPlannerCompanionsEl?.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-garden-companion-add]");
    if (!addButton) return;
    const plantId = addButton.dataset.gardenCompanionAdd;
    if (!plantId) return;
    const changed = setScreenerPortfolioMembership(plantId, true);
    if (changed) {
      renderScreener();
      renderGardenPlanner();
      trackEvent("filter_apply", {
        tool: "garden-planner",
        action: "companion_add",
        watchlist_count: screenerWatchlistIds.size
      });
    }
  });
  gardenPlannerSpaceEl?.addEventListener("dragstart", handleGardenPlannerLayoutDragStart);
  gardenPlannerSpaceEl?.addEventListener("dragend", handleGardenPlannerLayoutDragEnd);
  gardenPlannerSpaceEl?.addEventListener("dragover", handleGardenPlannerLayoutDragOver);
  gardenPlannerSpaceEl?.addEventListener("drop", handleGardenPlannerLayoutDrop);
  gardenPlannerSpaceEl?.addEventListener("pointerdown", handleGardenPlannerLayoutPointerDown);
  gardenPlannerSpaceEl?.addEventListener("click", handleGardenPlannerLayoutClick);
  window.addEventListener("pointermove", handleGardenPlannerLayoutPointerMove);
  window.addEventListener("pointerup", finishGardenPlannerLayoutPointerDrag);
  window.addEventListener("pointercancel", finishGardenPlannerLayoutPointerDrag);
  gardenPlannerCompareEl?.addEventListener("click", () => {
    compareGardenPlannerPlants();
    trackEvent("filter_apply", {
      tool: "garden-planner",
      action: "compare_saved",
      compare_open: gardenPlannerCompareOpen,
      watchlist_count: screenerWatchlistIds.size
    });
  });
  gardenPlannerExportEl?.addEventListener("click", () => {
    exportGardenPlanner();
    trackEvent("filter_apply", {
      tool: "garden-planner",
      action: "export",
      watchlist_count: screenerWatchlistIds.size
    });
  });
  gardenPlannerPrintBedEl?.addEventListener("click", () => {
    exportGardenPlannerBedPdf();
    trackEvent("filter_apply", {
      tool: "garden-planner",
      action: "export_bed_pdf",
      watchlist_count: screenerWatchlistIds.size
    });
  });
  gardenPlannerClearEl?.addEventListener("click", () => {
    clearGardenPlanner();
    trackEvent("filter_apply", {
      tool: "garden-planner",
      action: "clear"
    });
  });
  gardenPlannerTableEl?.addEventListener("input", (event) => {
    if (!event.target.classList.contains("garden-planner-quantity")) return;
    if (setGardenPlannerQuantity(event.target.dataset.gardenQuantity, event.target.value)) {
      renderGardenPlannerSummarySections();
    }
  });
  gardenPlannerTableEl?.addEventListener("change", (event) => {
    if (!event.target.classList.contains("garden-planner-quantity")) return;
    const plantId = event.target.dataset.gardenQuantity;
    setGardenPlannerQuantity(plantId, event.target.value);
    event.target.value = gardenPlannerQuantityForPlant(plantId);
    renderGardenPlannerSummarySections();
    trackEvent("filter_apply", {
      tool: "garden-planner",
      action: "quantity_change",
      watchlist_count: screenerWatchlistIds.size
    });
  });
  gardenPlannerTableEl?.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-garden-remove]");
    if (!removeButton) return;
    const plantId = removeButton.dataset.gardenRemove;
    setScreenerPortfolioMembership(plantId, false);
    if (screenerFlagEl?.value === "watchlist" && screenerWatchlistIds.size === 0) screenerFlagEl.value = "";
    renderScreener();
    renderGardenPlanner();
    trackEvent("filter_apply", {
      tool: "garden-planner",
      action: "remove",
      watchlist_count: screenerWatchlistIds.size
    });
  });
  renderGardenPlanner();
}

function initializeScreener() {
  loadScreenerWatchlist();
  loadGardenPlannerQuantities();
  loadGardenPlannerLayout();
  const typeCounts = plants.reduce((counts, plant) => {
    counts.set(plant.type, (counts.get(plant.type) ?? 0) + 1);
    return counts;
  }, new Map());
  Object.entries(screenerSavedScreens).forEach(([value, screen]) => {
    addSelectOption(screenerSavedScreenEl, value, screen.label);
  });
  [...typeCounts.keys()]
    .sort((a, b) => a.localeCompare(b))
    .forEach((type) => addSelectOption(screenerTypeEl, type, `${sentenceCase(type)} (${typeCounts.get(type)})`));
  Object.entries(goalLabels).forEach(([value, label]) => addSelectOption(screenerGoalEl, value, sentenceCase(label)));
  for (let zone = 2; zone <= 11; zone += 1) {
    ["a", "b"].forEach((suffix) => addSelectOption(screenerZoneEl, `${zone}${suffix}`, `Zone ${zone}${suffix}`));
  }
  Object.entries(partners)
    .sort((a, b) => partnerName(a[0]).localeCompare(partnerName(b[0])))
    .forEach(([value]) => addSelectOption(screenerPartnerEl, value, partnerName(value)));

  applyInitialScreenerState();
  screenerTypeCountEl.textContent = String(new Set(plants.map((plant) => plant.type)).size);
  screenerRelationCountEl.textContent = String(plants.filter((plant) => relationshipCount(plant) > 0).length);
  screenerFilterEls.forEach((control) => control.addEventListener("input", handleScreenerFilterChange));
  screenerSavedScreenEl?.addEventListener("input", () => {
    if (screenerSavedScreenEl.value) {
      applyScreenerSavedScreen(screenerSavedScreenEl.value);
    }
  });
  screenerShowSourceLinksEl?.addEventListener("input", () => {
    renderScreener();
    trackEvent("filter_apply", {
      tool: "screener",
      action: screenerShowSourceLinksEl.checked ? "show_source_links" : "hide_source_links",
      filter_count: activeScreenerFilterCount()
    });
  });
  screenerGroupTypeEl.addEventListener("click", () => {
    screenerGroupedByType = !screenerGroupedByType;
    screenerVisibleLimit = screenerPageSize;
    writeScreenerUrl();
    renderScreener();
    trackEvent("filter_apply", {
      tool: "screener",
      action: screenerGroupedByType ? "group_by_type" : "ungroup",
      filter_count: activeScreenerFilterCount()
    });
  });
  screenerMoreEl.addEventListener("click", () => {
    screenerVisibleLimit += screenerPageSize;
    renderScreener();
    trackEvent("filter_apply", {
      tool: "screener",
      action: "show_more",
      visible_count: screenerVisibleLimit
    });
  });
  screenerResetEl.addEventListener("click", () => {
    clearScreenerBaseFilters();
    if (screenerColumnPresetEl) screenerColumnPresetEl.value = "core";
    if (screenerSavedScreenEl) screenerSavedScreenEl.value = "";
    screenerSort = { key: "name", direction: "asc" };
    screenerGroupedByType = false;
    if (screenerShowSourceLinksEl) screenerShowSourceLinksEl.checked = false;
    screenerVisibleLimit = screenerPageSize;
    if (screenerTableWrapEl) screenerTableWrapEl.scrollLeft = 0;
    writeScreenerUrl();
    renderScreener();
    trackEvent("filter_apply", {
      tool: "screener",
      action: "reset",
      filter_count: 0
    });
  });
  screenerSortButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.screenerSort;
      screenerSort = {
        key,
        direction: screenerSort.key === key
          ? (screenerSort.direction === "asc" ? "desc" : "asc")
          : defaultScreenerDirection(key)
      };
      writeScreenerUrl();
      renderScreener();
      trackEvent("filter_apply", {
        tool: "screener",
        action: "sort",
        sort_key: screenerSort.key,
        sort_direction: screenerSort.direction
      });
    });
  });
  screenerBodyEl.addEventListener("change", (event) => {
    if (!event.target.classList.contains("screener-compare-input")) return;
    const plantId = event.target.value;
    const changed = setScreenerCompareMembership(plantId, event.target.checked);
    if (!changed) event.target.checked = false;
    renderScreenerComparePanel();
    renderScreenerPortfolioPanel();
    trackEvent("filter_apply", {
      tool: "screener",
      action: event.target.checked ? "compare_add" : "compare_remove",
      compare_count: screenerCompareIds.size
    });
  });
  screenerBodyEl.addEventListener("click", (event) => {
    const watchButton = event.target.closest("[data-watch-plant]");
    if (!watchButton) return;
    const plantId = watchButton.dataset.watchPlant;
    const shouldSave = !screenerWatchlistIds.has(plantId);
    setScreenerPortfolioMembership(plantId, shouldSave);
    renderScreener();
    trackEvent("filter_apply", {
      tool: "screener",
      action: screenerWatchlistIds.has(plantId) ? "portfolio_add" : "portfolio_remove",
      watchlist_count: screenerWatchlistIds.size
    });
  });
  screenerClearCompareEl?.addEventListener("click", () => {
    screenerCompareIds = new Set();
    renderScreener();
    trackEvent("filter_apply", {
      tool: "screener",
      action: "compare_clear"
    });
  });
  screenerPortfolioCompareEl?.addEventListener("click", () => {
    const portfolioIds = screenerPortfolioPlants().slice(0, screenerCompareLimit).map((plant) => plant.id);
    screenerCompareIds = new Set(portfolioIds);
    renderScreener();
    trackEvent("filter_apply", {
      tool: "screener",
      action: "portfolio_compare",
      compare_count: screenerCompareIds.size
    });
  });
  screenerPortfolioOpenPlannerEl?.addEventListener("click", () => {
    showGardenPlannerTab();
    trackEvent("tool_tab_view", { tool: "garden-planner", source: "screener_portfolio" });
  });
  screenerPortfolioFilterEl?.addEventListener("click", () => {
    if (!screenerWatchlistIds.size) return;
    screenerFlagEl.value = "watchlist";
    screenerVisibleLimit = screenerPageSize;
    writeScreenerUrl();
    renderScreener();
    trackEvent("filter_apply", {
      tool: "screener",
      action: "portfolio_filter",
      filter_count: activeScreenerFilterCount()
    });
  });
  screenerPortfolioExportEl?.addEventListener("click", () => {
    exportScreenerPortfolio();
    trackEvent("filter_apply", {
      tool: "screener",
      action: "portfolio_export",
      watchlist_count: screenerWatchlistIds.size
    });
  });
  screenerPortfolioClearEl?.addEventListener("click", () => {
    if (!screenerWatchlistIds.size) return;
    if (!window.confirm("Clear all plants from this local portfolio?")) return;
    screenerWatchlistIds = new Set();
    gardenPlannerQuantities = {};
    gardenPlannerLayout = {};
    gardenPlannerSelectedLayoutId = null;
    saveScreenerWatchlist();
    saveGardenPlannerQuantities();
    saveGardenPlannerLayout();
    if (screenerFlagEl.value === "watchlist") screenerFlagEl.value = "";
    writeScreenerUrl();
    renderScreener();
    if (gardenPlannerInitialized) renderGardenPlanner();
    trackEvent("filter_apply", {
      tool: "screener",
      action: "portfolio_clear"
    });
  });
  screenerPortfolioTableEl?.addEventListener("change", (event) => {
    if (!event.target.classList.contains("screener-portfolio-compare-input")) return;
    const changed = setScreenerCompareMembership(event.target.value, event.target.checked);
    if (!changed) event.target.checked = false;
    renderScreenerComparePanel();
    renderScreenerPortfolioPanel();
    trackEvent("filter_apply", {
      tool: "screener",
      action: event.target.checked ? "compare_add" : "compare_remove",
      compare_count: screenerCompareIds.size
    });
  });
  screenerPortfolioTableEl?.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-portfolio-remove]");
    if (!removeButton) return;
    const plantId = removeButton.dataset.portfolioRemove;
    setScreenerPortfolioMembership(plantId, false);
    if (screenerFlagEl.value === "watchlist" && screenerWatchlistIds.size === 0) screenerFlagEl.value = "";
    writeScreenerUrl();
    renderScreener();
    trackEvent("filter_apply", {
      tool: "screener",
      action: "portfolio_remove",
      watchlist_count: screenerWatchlistIds.size
    });
  });
  renderScreener();
}

function scoreBreakdown(plant, inputs) {
  const userZone = zoneToNumber(inputs.zone);
  const minZone = zoneToNumber(plant.zones[0]);
  const maxZone = zoneToNumber(plant.zones[1]);
  const details = [];
  let zoneScore = -120;
  let zoneFit = 0;
  let zoneLabel = "outside range";

  if (userZone >= minZone && userZone <= maxZone) {
    zoneScore = 80;
    zoneFit = 100;
    zoneLabel = "in range";
  } else {
    const distance = userZone < minZone ? minZone - userZone : userZone - maxZone;
    zoneScore = distance <= 0.5 ? 25 : -120;
    zoneFit = distance <= 0.5 ? 42 : 0;
    zoneLabel = distance <= 0.5 ? "borderline" : "poor fit";
  }
  details.push({ label: "Hardiness", value: zoneFit, score: zoneScore, note: `${plant.zones[0]}-${plant.zones[1]} (${zoneLabel})` });

  const goalFit = goalMatchesPlant(plant, inputs.goal);
  details.push({
    label: "Goal",
    value: goalFit ? 100 : 0,
    score: goalFit ? 34 : 0,
    note: goalFit ? `matches ${formatGoal(inputs.goal)}` : `better for ${formatGoalList(plant.goals)}`
  });

  let sunScore = -18;
  let sunFit = 0;
  let sunNote = `wants ${formatList(plant.sun)}`;
  if (plant.sun.includes(inputs.sun)) {
    sunScore = 22;
    sunFit = 100;
    sunNote = `takes ${inputs.sun}`;
  } else if (inputs.sun === "partial" && plant.sun.includes("full")) {
    sunScore = 4;
    sunFit = 45;
    sunNote = "borderline in partial sun";
  }
  details.push({ label: "Sun", value: sunFit, score: sunScore, note: sunNote });

  let soilScore = -14;
  let soilFit = 0;
  let soilNote = `prefers ${formatList(plant.soils)}`;
  if (plant.soils.includes(inputs.soil)) {
    soilScore = 16;
    soilFit = 100;
    soilNote = `handles ${inputs.soil}`;
  } else if (inputs.soil === "loam") {
    soilScore = 4;
    soilFit = 55;
    soilNote = "loam is a workable default";
  }
  details.push({ label: "Soil", value: soilFit, score: soilScore, note: soilNote });

  const selectedWater = waterRank[inputs.water];
  const plantWater = waterRank[plant.water];
  let waterScore = -(plantWater - selectedWater) * 18;
  let waterFit = 30;
  let waterNote = `${plant.water} water need`;
  if (plantWater === selectedWater) {
    waterScore = 16;
    waterFit = 100;
    waterNote = `matches ${inputs.water} water`;
  } else if (plantWater < selectedWater) {
    waterScore = 9;
    waterFit = 78;
    waterNote = "will not mind extra water";
  }
  details.push({ label: "Water", value: clamp(waterFit, 0, 100), score: waterScore, note: waterNote });

  const climateFit = climateFitForPlant(plant, inputs.climate);
  if (climateFit) {
    details.push({
      label: "Climate",
      value: climateFit.value,
      score: climateFit.score,
      note: climateFit.note
    });
  }

  let bonus = 0;
  if (plant.type.includes("annual") && inputs.goal === "vegetables-herbs") bonus += 8;
  if (plant.type.includes("fruit") && inputs.goal === "fruit") bonus += 6;
  if (plant.type.includes("perennial") && inputs.goal === "pollinators-wildlife") bonus += 5;
  if ((plant.type.includes("shrub") || plant.type.includes("vine") || plant.type.includes("grass")) && inputs.goal === "privacy-screening") bonus += 6;
  if (inputs.goal === "native-plants" && hasNativeCue(plant)) bonus += 5;
  if (bonus > 0) details.push({ label: "Use case", value: 100, score: bonus, note: "extra practical fit" });

  const score = details.reduce((sum, detail) => sum + detail.score, 0);
  return { score, details };
}

function scorePlant(plant, inputs) {
  return scoreBreakdown(plant, inputs).score;
}

function rankingScore(plant, inputs) {
  const base = scorePlant(plant, inputs);
  const userZone = zoneToNumber(inputs.zone);
  const minZone = zoneToNumber(plant.zones[0]);
  const maxZone = zoneToNumber(plant.zones[1]);
  const edgeMargin = userZone >= minZone && userZone <= maxZone ? Math.min(userZone - minZone, maxZone - userZone) : -4;
  const zoneCenter = (minZone + maxZone) / 2;
  const centerPenalty = Math.abs(userZone - zoneCenter) / 20;
  const conditionFit =
    (plant.sun.includes(inputs.sun) ? 0.28 : 0) +
    (plant.soils.includes(inputs.soil) ? 0.2 : 0) +
    (plant.water === inputs.water ? 0.2 : plant.water === "low" && inputs.water !== "low" ? 0.08 : 0);
  const goalSpecificity = inputs.goal === "native-plants"
    ? (hasNativeCue(plant) ? (plant.goals.includes("low-maintenance-natives") ? 0.18 : 0.1) : 0)
    : plant.goals[0] === inputs.goal ? 0.18 : plant.goals.includes(inputs.goal) ? 0.1 : 0;
  return base + clamp(edgeMargin, -4, 4) * 0.7 - centerPenalty + conditionFit + goalSpecificity;
}

function overallFit(score) {
  const percent = clamp(Math.round((score / 190) * 100), 0, 100);
  let label = "Weak";
  let tone = "weak";
  if (percent >= 92) {
    label = "Excellent";
    tone = "excellent";
  } else if (percent >= 82) {
    label = "Strong";
    tone = "strong";
  } else if (percent >= 68) {
    label = "Good";
    tone = "good";
  } else if (percent >= 52) {
    label = "Workable";
    tone = "workable";
  }
  return { percent, label, tone };
}

function sunLabel(value) {
  const labels = { full: "Full sun", partial: "Part sun", part: "Part sun", shade: "Shade" };
  return labels[value] ?? sentenceCase(value);
}

function cardSummaryText(plant) {
  const note = plant.notes?.trim();
  if (note) return note;
  const trait = plant.traits?.[0] ?? plant.type.toLowerCase();
  return `${plant.name} is worth comparing for ${trait}.`;
}

function zoneFactValue(plant, inputs) {
  const userZone = zoneToNumber(inputs.zone);
  const minZone = zoneToNumber(plant.zones[0]);
  const maxZone = zoneToNumber(plant.zones[1]);
  if (userZone >= minZone && userZone <= maxZone) return `${inputs.zone} in range`;
  const distance = userZone < minZone ? minZone - userZone : userZone - maxZone;
  return distance <= 0.5 ? `${inputs.zone} borderline` : `${inputs.zone} outside range`;
}

function sunFactValue(plant, inputs) {
  if (plant.sun.includes(inputs.sun)) return sunLabel(inputs.sun);
  return `Prefers ${plant.sun.map(sunLabel).join("/")}`;
}

function soilFactValue(plant, inputs) {
  if (plant.soils.includes(inputs.soil)) return `${sentenceCase(inputs.soil)} works`;
  return `Prefers ${formatList(plant.soils)}`;
}

function compactMetricValue(value) {
  return metricDisplayValue(value, "")
    .replace(/\s*\/plant\/year/g, "/yr")
    .replace(/\s*\/plant\/season/g, "/season")
    .replace(/\s*\/plant\/week/g, "/week")
    .replace(/\s+/g, " ")
    .trim();
}

function renderMatchFacts(plant, inputs, metrics) {
  const firstOutput = compactMetricValue(metrics.display?.firstOutput);
  const output = compactMetricValue(metrics.display?.yieldLbs) || compactMetricValue(metrics.display?.output);
  const facts = [
    { label: "Zone", value: zoneFactValue(plant, inputs) },
    { label: "Sun", value: sunFactValue(plant, inputs) },
    { label: "Soil", value: soilFactValue(plant, inputs) },
    firstOutput ? { label: "First", value: firstOutput } : null,
    output ? { label: "Output", value: output } : null
  ].filter(Boolean);

  return `
    <div class="match-facts" aria-label="Key match facts">
      ${facts
        .map((fact) => `<span class="match-fact"><b>${escapeHtml(fact.label)}</b>${escapeHtml(fact.value)}</span>`)
        .join("")}
    </div>
  `;
}

function renderFitRows(details) {
  return details
    .map((detail) => {
      const fitClass = detail.value >= 80 ? "good" : detail.value >= 40 ? "okay" : "weak";
      const fitText = detail.value >= 80 ? "strong fit" : detail.value >= 40 ? "workable" : "weak fit";
      return `
        <div class="fit-row ${fitClass}">
          <div class="fit-copy">
            <span>${detail.label}</span>
            <strong>${detail.note}</strong>
          </div>
          <div class="fit-meter" aria-hidden="true">
            <span class="fit-line"></span>
            <span class="fit-dot" style="left: ${detail.value}%"></span>
          </div>
          <em>${fitText}</em>
        </div>
      `;
    })
    .join("");
}

function renderZoneRange(plant, inputs) {
  const min = 2;
  const max = 11.5;
  const zoneStart = clamp(((zoneToNumber(plant.zones[0]) - min) / (max - min)) * 100, 0, 100);
  const zoneEnd = clamp(((zoneToNumber(plant.zones[1]) - min) / (max - min)) * 100, 0, 100);
  const userPoint = clamp(((zoneToNumber(inputs.zone) - min) / (max - min)) * 100, 0, 100);
  return `
    <div class="zone-range">
      <div class="range-track" aria-hidden="true">
        <span class="range-fit" style="left: ${zoneStart}%; width: ${Math.max(2, zoneEnd - zoneStart)}%"></span>
        <span class="range-pin" style="left: ${userPoint}%"></span>
      </div>
      <div class="range-labels">
        <span>Zone ${plant.zones[0]}</span>
        <strong>Your ${inputs.zone}</strong>
        <span>Zone ${plant.zones[1]}</span>
      </div>
    </div>
  `;
}

function createResultItem(entry, index, inputs) {
  const { plant, score } = entry;
  const metrics = metricFor(plant);
  const item = document.createElement("li");
  const kind = plantKind(plant);
  const artEntry = plantArtEntry(plant);
  const art = artEntry?.id ?? genericArt(plant);
  const hasImage = Boolean(artEntry?.image);
  const photoStyle = plantPhotoStyle(artEntry);
  const detailArt = hasImage
    ? `<figure class="detail-art ${art}" role="img" aria-label="${plant.name} botanical plate"${photoStyle}>
        <span>${plant.name}</span>
      </figure>`
    : "";
  item.className = `result-card ${index === 0 ? "top-card" : ""} ${kind}-card ${art}-art`;

  const breakdown = scoreBreakdown(plant, inputs);
  const fit = overallFit(score);
  const sourceAction = sourceActionForPlant(plant);
  const climateNotes = renderPlantClimateNotes(plant, inputs);
  item.innerHTML = `
    <figure class="plant-visual ${kind} ${art} ${hasImage ? "photo-plate" : ""}" aria-hidden="true"${photoStyle}>
      <span class="rank">${index + 1}</span>
      ${hasImage ? "" : `<span class="plant-visual-icon"></span>`}
    </figure>
    <div class="result-copy">
      <div class="result-title">
        <h3><a class="plant-name-link" href="${plantPagePath(plant)}">${plant.name}</a></h3>
        <span>${plant.type}</span>
      </div>
      <div class="overall-fit ${fit.tone}" style="--fit: ${fit.percent}%" aria-label="Overall fit ${fit.percent} percent, ${fit.label}">
        <div class="fit-ring" aria-hidden="true"><span>${fit.percent}</span></div>
        <div>
          <span>Overall fit</span>
          <strong>${fit.label}</strong>
        </div>
      </div>
      <p class="result-summary">${escapeHtml(cardSummaryText(plant))}</p>
      ${renderMatchFacts(plant, inputs, metrics)}
      <div class="trait-row">
        ${plant.traits.slice(0, 2).map((trait) => `<span>${trait}</span>`).join("")}
      </div>
    </div>
    <details class="plant-details ${hasImage ? "has-art" : ""}">
      <summary>
        <span>More data</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7.4 8.6 12 13.2l4.6-4.6L18 10l-6 6-6-6 1.4-1.4Z"></path>
        </svg>
      </summary>
      <div class="details-grid">
        ${detailArt}
        <div class="detail-panel">
          <h4>Fit breakdown</h4>
          <div class="fit-chart">
            ${renderFitRows(breakdown.details)}
          </div>
        </div>
        <div class="detail-panel">
          <h4>Plant data</h4>
          ${renderZoneRange(plant, inputs)}
          <dl class="plant-stats">
            <div><dt>Sun</dt><dd>${formatList(plant.sun)}</dd></div>
            <div><dt>Soil</dt><dd>${formatList(plant.soils)}</dd></div>
            <div><dt>Water</dt><dd>${plant.water}</dd></div>
            <div><dt>First output</dt><dd>${escapeHtml(metricDisplayValue(metrics.display?.firstOutput))}</dd></div>
            <div><dt>Spacing</dt><dd>${escapeHtml(metricDisplayValue(metrics.display?.spacing))}</dd></div>
            <div><dt>Yield return</dt><dd>${escapeHtml(metricDisplayValue(metrics.display?.yieldLbs))}</dd></div>
            <div><dt>Goals</dt><dd>${formatGoalList(plant.goals)}</dd></div>
          </dl>
        </div>
        ${climateNotes}
        ${renderRelationshipPanel(plant)}
        <p class="grow-note">${plant.notes}</p>
      </div>
    </details>
    <div class="card-actions">
      <a class="plant-page-action" href="${plantPagePath(plant)}">View plant page</a>
      ${sourceAction
        ? `<a class="plant-page-action" href="${escapeHtml(sourceAction.href)}" target="_blank" rel="${sourceAction.rel}" data-partner-placement="matcher_result_source">${escapeHtml(sourceAction.label)}</a>`
        : `<span class="nursery-placeholder">Source link coming soon</span>`}
    </div>
  `;
  return item;
}

function renderVisibleResults() {
  const visible = currentRanked.slice(0, visibleCount);
  resultsEl.replaceChildren(...visible.map((entry, index) => createResultItem(entry, index, currentInputs)));
  const shownText = currentRanked.length > visibleCount
    ? `Showing the strongest ${visibleCount} of ${currentRanked.length}.`
    : `${currentRanked.length} ranked matches found.`;
  statusEl.textContent = `${shownText} Top picks include ${summarizeForms(visible)}.`;
  if (currentRanked.length > visibleCount) {
    seeMoreEl.hidden = false;
    seeMoreEl.textContent = `See more results (${currentRanked.length - visibleCount} left)`;
  } else {
    seeMoreEl.hidden = true;
  }
}

function renderResults(zoneData, inputs) {
  const candidates = plants.filter((plant) => goalMatchesPlant(plant, inputs.goal));
  const ranked = candidates
    .map((plant) => ({ plant, score: scorePlant(plant, inputs), rankScore: rankingScore(plant, inputs) }))
    .sort((a, b) => b.rankScore - a.rankScore || b.score - a.score || a.plant.name.localeCompare(b.plant.name));

  titleEl.textContent = `Best ${formatGoal(inputs.goal)} matches for zone ${inputs.zone}.`;
  zoneNoteEl.textContent = localRealityNote(zoneData, inputs);
  climatePanelEl.innerHTML = renderClimatePanel(inputs);
  climatePanelEl.hidden = false;
  if (ranked.length === 0) {
    statusEl.textContent = "No plants matched that goal. Try a broader goal or loosen one growing condition.";
    resultsEl.replaceChildren();
    climatePanelEl.hidden = true;
    seeMoreEl.hidden = true;
    saveListEl.hidden = true;
    sharePlanEl.hidden = true;
    return;
  }

  currentRanked = ranked;
  currentInputs = inputs;
  visibleCount = Math.min(12, currentRanked.length);
  saveListEl.hidden = false;
  sharePlanEl.hidden = false;
  renderVisibleResults();
  trackEvent("tool_result_view", {
    tool: "matcher",
    zone: inputs.zone,
    goal: inputs.goal,
    sun: inputs.sun,
    soil: inputs.soil,
    water: inputs.water,
    result_count: ranked.length
  });
}

seeMoreEl.addEventListener("click", () => {
  visibleCount = Math.min(visibleCount + 12, currentRanked.length);
  renderVisibleResults();
  trackEvent("filter_apply", {
    tool: "matcher",
    action: "show_more",
    visible_count: visibleCount
  });
});

resultsEl.addEventListener("toggle", (event) => {
  const openedDetails = event.target;
  if (!(openedDetails instanceof HTMLDetailsElement) || !openedDetails.classList.contains("plant-details") || !openedDetails.open) return;
  resultsEl.querySelectorAll(".plant-details[open]").forEach((details) => {
    if (details !== openedDetails) details.open = false;
  });
}, true);

saveListEl.addEventListener("click", () => {
  if (!currentInputs || currentRanked.length === 0) return;
  saveCurrentPlan();
  saveListEl.textContent = "Plan saved";
  window.setTimeout(() => {
    saveListEl.textContent = "Save plan";
  }, 1800);
});

savedPlanDownloadEl.addEventListener("click", () => {
  if (!savedPlan) return;
  downloadTextFile(savedPlanText(savedPlan), savedPlanFileName(savedPlan));
  trackEvent("save_plan_download", {
    zone: savedPlan.zone,
    goal: savedPlan.goal
  });
});

savedPlanPrintEl.addEventListener("click", () => {
  if (!savedPlan) return;
  trackEvent("print_saved_plan", {
    zone: savedPlan.zone,
    goal: savedPlan.goal
  });
  window.print();
});

savedPlanClearEl.addEventListener("click", () => {
  safeStorageRemove(savedPlanStorageKey);
  renderSavedPlanPanel(null);
  trackEvent("save_plan_clear", {});
});

emailPlanFormEl.addEventListener("submit", submitEmailPlan);

zipEl.addEventListener("input", () => {
  const zip = zipEl.value.trim();
  clearTimeout(zoneLookupTimer);
  zonePreviewEl.hidden = true;
  zonePreviewEl.textContent = "";
  zonePreviewEl.classList.remove("is-error");
  if (!/^\d{5}$/.test(zip)) return;
  zonePreviewEl.hidden = false;
  zonePreviewEl.textContent = "Checking USDA zone...";
  zoneLookupTimer = setTimeout(async () => {
    try {
      const zoneData = await lookupZone(zip);
      zonePreviewEl.textContent = `Zone ${zoneData.zone} detected`;
      zonePreviewEl.classList.remove("is-error");
    } catch (error) {
      zonePreviewEl.textContent = "Zone lookup needs another try";
      zonePreviewEl.classList.add("is-error");
    }
  }, 350);
});

async function runMatcher({ writeUrl = true, scrollToResults = false } = {}) {
  const planParams = matcherPlanParamsFromForm();
  const zip = planParams.zip;

  if (!/^\d{5}$/.test(zip)) {
    zonePreviewEl.hidden = false;
    zonePreviewEl.textContent = "Enter a five-digit ZIP";
    zonePreviewEl.classList.add("is-error");
    statusEl.textContent = "Enter a five-digit U.S. ZIP code.";
    zipEl.focus();
    return false;
  }

  setLandingStarted(true);
  titleEl.textContent = "Building your plant list...";
  zoneNoteEl.textContent = "Checking the ZIP, estimating local climate context, and ranking plants against your goal.";
  zonePreviewEl.hidden = false;
  zonePreviewEl.textContent = "Looking up USDA zone...";
  zonePreviewEl.classList.remove("is-error");
  statusEl.textContent = "Looking up your USDA hardiness zone...";
  resultsEl.replaceChildren();
  climatePanelEl.hidden = true;
    seeMoreEl.hidden = true;
    saveListEl.hidden = true;
    sharePlanEl.hidden = true;

    try {
      setDataLoading("Loading plant data and USDA zone...");
      const [zoneData] = await Promise.all([lookupZone(zip), ensureCoreData()]);
      zonePreviewEl.textContent = `Zone ${zoneData.zone} detected`;
      const inputs = normalizedMatcherInputs(zoneData, planParams);
    currentPlanParams = planParams;
    trackEvent("zip_submit", {
      tool: "matcher",
      zone: inputs.zone,
      goal: inputs.goal,
      sun: inputs.sun,
      soil: inputs.soil,
      water: inputs.water
    });
    statusEl.textContent = planParams.soil === "not-sure" ? "Soil set to loam because you selected not sure." : "";
    if (writeUrl) writeMatcherUrl(planParams);
    renderResults(zoneData, inputs);
    if (scrollToResults) {
      document.querySelector(".results-band")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    return true;
  } catch (error) {
    titleEl.textContent = "The zone lookup did not respond.";
    zoneNoteEl.textContent = "Try again in a moment, or swap the lookup function to another USDA-zone provider.";
    statusEl.textContent = "No recommendations shown because hardiness zone is required for ranking.";
    zonePreviewEl.textContent = "Zone lookup needs another try";
    zonePreviewEl.classList.add("is-error");
    climatePanelEl.hidden = true;
    return false;
  }
}

sharePlanEl.addEventListener("click", async () => {
  if (!currentPlanParams) return;
  const originalText = sharePlanEl.textContent;
  const url = matcherUrlForPlan(currentPlanParams).toString();
  trackEvent("share_click", {
    method: "copy",
    placement: "matcher_plan",
    zone: currentInputs?.zone,
    goal: currentInputs?.goal
  });
  try {
    const status = await copyShareText(url);
    if (status) {
      sharePlanEl.textContent = status;
      setTimeout(() => {
        sharePlanEl.textContent = originalText;
      }, 1800);
    }
  } catch (error) {
    sharePlanEl.textContent = "Copy failed";
    setTimeout(() => {
      sharePlanEl.textContent = originalText;
    }, 1800);
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  runMatcher({ writeUrl: true, scrollToResults: true });
});

const initialSavedPlan = loadSavedPlan();
renderSavedPlanPanel(initialSavedPlan);
if (initialSavedPlan) {
  ensureCoreData()
    .then(() => renderSavedPlanPanel(initialSavedPlan))
    .catch(() => {
      if (savedPlanShoppingEl) {
        savedPlanShoppingEl.hidden = true;
        savedPlanShoppingEl.innerHTML = "";
      }
    });
}

if (initialWantsMatcher) {
  applyMatcherPlanParams({
    zip: initialParams.get("zip") ?? matcherDefaults.zip,
    sun: initialParams.get("sun") ?? matcherDefaults.sun,
    soil: initialParams.get("soil") ?? matcherDefaults.soil,
    water: initialParams.get("water") ?? matcherDefaults.water,
    goal: initialParams.get("goal") ?? matcherDefaults.goal
  });
  runMatcher({ writeUrl: false });
}
if (initialWantsZoneMap && /^\d{5}$/.test(initialParams.get("zip") ?? "")) {
  ensureZoneMapReady().then(() => {
    zoneMapZipEl.value = initialParams.get("zip");
    runZoneMapLookup();
  });
}
