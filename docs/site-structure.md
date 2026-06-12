# Plant by ZIP Site Structure

This is a high-level reference for how Plant by ZIP is organized, how data moves through the site, and where the main user-facing experiences live.

## Route Map

```mermaid
flowchart TD
  user["Visitor"] --> home["/ homepage app"]

  home --> matcher["Plant matcher tab"]
  home --> calendarTab["Calendar tab"]
  home --> zoneMap["Zone map tab"]
  home --> screener["Screener tab"]
  home --> blogTab["Blog tab preview/search"]

  home --> hubs["Crawlable hub pages"]
  hubs --> hubGeneric["/[hub]/"]
  hubGeneric --> calendarHub["/planting-calendar/"]
  hubGeneric --> nativeHub["/native-plants/"]
  hubGeneric --> fruitHub["/fruit-trees/"]
  hubGeneric --> privacyHub["/privacy-shrubs/"]
  hubGeneric --> lowWaterHub["/low-water-plants/"]

  hubs --> zonePages["Zone/intent landing pages"]
  zonePages --> calendarZone["/planting-calendar/[zone]/"]
  zonePages --> plantNowZone["/what-to-plant-now/[zone]/"]
  zonePages --> fruitZone["/fruit-trees/[zone]/"]
  zonePages --> nativeZone["/native-plants/[zone]/"]

  home --> plantProfiles["/plants/[id]/ plant profiles"]
  hubs --> plantProfiles
  zonePages --> plantProfiles
  blogTab --> blogIndex["/blog/"]
  blogIndex --> articles["/blog/[slug]/"]
  articles --> home
  articles --> plantProfiles

  home --> trust["Trust pages"]
  trust --> about["/about/"]
  trust --> methodology["/methodology/"]

  sitemap["/sitemap.xml"] --> home
  sitemap --> hubs
  sitemap --> zonePages
  sitemap --> plantProfiles
  sitemap --> articles
  robots["/robots.txt"] --> sitemap
```

## Source Files And Responsibilities

```mermaid
flowchart LR
  subgraph data["Structured Data"]
    plants["src/data/plants.json<br/>core plant records"]
    metrics["src/data/plantMetrics.json<br/>yield, spacing, depth, timing"]
    sources["src/data/plantMetricSources.json<br/>source references"]
    relationships["src/data/plantRelationships.json<br/>companions, conflicts, pairings"]
    art["src/data/plantArt.json<br/>botanical card art mapping"]
    photos["src/data/plantPhotos.json<br/>profile photo metadata"]
    checklist["src/lib/plantChecklist.js<br/>profile checklist builder"]
    partners["src/data/affiliatePartners.json<br/>partner/search config"]
  end

  subgraph content["Editorial Content"]
    blogMd["src/content/blog/*.md"]
    contentConfig["src/content.config.ts"]
  end

  subgraph libs["Shared Utilities"]
    plantUtils["src/lib/plantUtils.js"]
    checklistLib["src/lib/plantChecklist.js"]
    hubData["src/lib/hubData.js"]
    zoneData["src/lib/zonePageData.js"]
    siteConfig["src/lib/site.ts"]
  end

  subgraph pages["Astro Pages"]
    index["src/pages/index.astro"]
    plantRoute["src/pages/plants/[id].astro"]
    hubRoute["src/pages/[hub].astro"]
    zoneRoutes["zone routes:<br/>planting-calendar/[zone]<br/>what-to-plant-now/[zone]<br/>fruit-trees/[zone]<br/>native-plants/[zone]"]
    blogRoutes["src/pages/blog/*.astro"]
    trustRoutes["about + methodology"]
    seoRoutes["sitemap.xml.ts + robots.txt.ts"]
  end

  data --> libs
  data --> pages
  content --> blogRoutes
  contentConfig --> blogRoutes
  libs --> pages
  pages --> dist["dist/ static site"]
```

## Homepage App Flow

The homepage is the main interactive app. It ships plant data and helper data into browser-side JavaScript, then updates the UI without a server.

```mermaid
sequenceDiagram
  participant U as Visitor
  participant H as Homepage JS
  participant PHZM as phzmapi.org
  participant D as Embedded plant data
  participant GA as GA4/dataLayer

  U->>H: Enter ZIP + sun/soil/water/goal
  H->>PHZM: Fetch USDA hardiness zone for ZIP
  PHZM-->>H: Zone + coordinates/climate context
  H->>D: Score plants against zone, site inputs, goals, traits, metrics
  D-->>H: Ranked matches + reasons
  H-->>U: Render results, climate panel, related links
  H->>GA: zip_submit + tool_result_view events without storing ZIP

  U->>H: Switch to Calendar
  H->>D: Build frost-aware windows from plant data
  H-->>U: Gantt chart, filters, plant groups, variety expansion
  H->>GA: calendar_view/filter events

  U->>H: Switch to Screener
  H->>D: Filter/sort/group table
  H-->>U: Table rows + CSV export

  U->>H: Switch to Zone Map
  H->>PHZM: Optional ZIP lookup
  H->>H: Load Leaflet/Esri/vector zone layers on demand
  H-->>U: Hardiness overlays, pin, plant fit overlay, tooltips
```

## Plant Profile Flow

Each plant profile is statically generated from `plants.json`. The page combines core plant data with metrics, art, real photos, relationships, checklist items, source methodology, and share/print/partner actions.

```mermaid
flowchart TD
  plants["plants.json"] --> staticPaths["getStaticPaths() creates /plants/[id]/"]
  staticPaths --> profile["plants/[id].astro"]

  metrics["plantMetrics.json"] --> profile
  metricSources["plantMetricSources.json"] --> profile
  relationships["plantRelationships.json"] --> profile
  art["plantArt.json + public/plant-art"] --> profile
  photos["plantPhotos.json + public/plant-photos"] --> profile
  checklist["plantChecklist.js"] --> profile
  partners["affiliatePartners.json"] --> profile
  utilities["plantUtils.js + plantChecklist.js + hubData.js"] --> profile

  profile --> seo["SEO metadata + JSON-LD"]
  profile --> hero["Hero botanical art"]
  profile --> details["Growing profile + quantitative profile"]
  profile --> photosUi["What it looks like in the garden"]
  profile --> relationshipsUi["Comparable plants + pairings"]
  profile --> checklistUi["Planting checklist"]
  profile --> actions["Save, print, share, partner/source links"]
  profile --> analytics["plant_profile_view, print_profile, share_click, outbound_partner_click"]
```

## Crawlable SEO Architecture

The site avoids thin ZIP fan-out pages. Instead, it exposes database-backed pages where the content is meaningfully different: hubs, zones, seasonal pages, plant profiles, and articles.

```mermaid
flowchart TD
  sitemap["sitemap.xml"] --> staticPages["Static pages"]
  staticPages --> homepage["Homepage tool"]
  staticPages --> hubs["Goal hubs"]
  staticPages --> zoneIntent["Zone/season/intent pages"]
  staticPages --> plantProfiles["plant profiles"]
  staticPages --> blog["Blog articles"]
  staticPages --> trust["About + methodology"]

  hubs --> profileLinks["Profile internal links"]
  zoneIntent --> profileLinks
  blog --> profileLinks
  homepage --> profileLinks

  profileLinks --> plantProfiles
  plantProfiles --> relatedHubs["Related planning guides"]
  relatedHubs --> hubs
  relatedHubs --> zoneIntent
```

## Analytics And Events

```mermaid
flowchart LR
  pages["Astro pages"] --> analyticsComponent["AnalyticsEvents.astro"]
  analyticsComponent --> gtag["gtag.js<br/>G-9GSPS08EDD"]
  analyticsComponent --> dataLayer["window.dataLayer"]
  analyticsComponent --> helper["window.plantByZipTrack()"]

  helper --> events["Custom events"]
  events --> zipSubmit["zip_submit"]
  events --> resultView["tool_result_view"]
  events --> calendarView["calendar_view"]
  events --> filterApply["filter_apply"]
  events --> profileView["plant_profile_view"]
  events --> shareClick["share_click"]
  events --> printProfile["print_profile"]
  events --> outboundClick["outbound_partner_click"]

  helper --> privacy["Privacy guard:<br/>drops ZIP/email/postal params"]
```

## Build And Deployment

```mermaid
flowchart LR
  repo["GitHub repo<br/>aklalejini/whatshouldigrow"] --> cloudflare["Cloudflare Pages"]
  cloudflare --> build["Astro build"]
  build --> dist["dist/ static output"]
  dist --> pagesDev["whatshouldigrow.pages.dev"]
  dist --> prodA["plantbyzip.com"]
  dist --> prodB["www.plantbyzip.com"]

  local["Local dev"] --> command["npm run dev / astro dev"]
  local --> localBuild["astro build"]
  localBuild --> dist
```

## Mental Model

Plant by ZIP is a static Astro site with one rich client-side app on the homepage. The database lives in JSON files. Astro turns that database into crawlable pages at build time, while the homepage uses the same database in the browser to power personalized ZIP matching, the planting calendar, the zone map, and the screener.

The main growth architecture is:

- `plants.json` is the canonical plant inventory.
- `plantMetrics.json`, `plantRelationships.json`, `plantPhotos.json`, and checklist data enrich each plant.
- `/plants/[id]/` is the deepest per-plant decision page.
- Hub and zone pages expose useful database slices for search engines.
- Blog articles provide editorial guidance and link back into tools/profiles.
- The homepage remains the personalized decision engine.
