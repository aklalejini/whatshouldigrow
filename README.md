# What Should I Grow

A single-page Astro proof of concept for ZIP-based plant recommendations. Visitors enter a ZIP code plus sun, soil, water, and a plain-English goal, then get ranked plant picks with concise reasons and nursery search links.

## What It Does

- Looks up USDA hardiness zone from ZIP with the free `https://phzmapi.org/{zip}.json` endpoint.
- Defaults "not sure" soil to loam.
- Filters by six goals: fruit, vegetables and herbs, pollinators and wildlife, curb appeal and color, privacy and screening, and low-maintenance natives.
- Summarizes the form mix in the ranked results, such as trees, shrubs, vines, vegetables, and flowers/herbs.
- Scores 219 hardcoded plants from `src/data/plants.json`.
- Shows 12 ranked recommendations per search.
- Expands each result into match bars, a hardiness-zone range marker, plant stats, and a short grower note.
- Adds `rel="nofollow sponsored noopener"` to outbound nursery links.
- Builds as a static site for Cloudflare Pages.

## Affiliate Setup

Replace the placeholders in `src/data/affiliatePartners.json` before launch:

- `starkbros.affiliateParam`: use your Stark Bro's affiliate tracking parameter.
- `raintree.affiliateParam`: use your Raintree Nursery affiliate tracking parameter.
- `amazon.affiliateParam`: replace `YOUR-AMAZON-ASSOCIATES-TAG` with your Associates tag, such as `tag=example-20`.

Each plant chooses one default partner and query in `src/data/plants.json`. The app builds a search URL so links remain resilient when product slugs change.

## Local Development

```bash
npm install
npm run dev
```

## Adding Plant Art

Plant artwork is driven by `src/data/plantArt.json`. Add one entry with:

- `id`: CSS-safe art key, such as `bee-balm`
- `source`: the PNG filename in your local Plant Photos folder
- `image`: the WebP filename that should be written to `public/plant-art`
- `match`: plant-name/id/query terms that should use that image
- optional `exclude`, `position`, and `plateBg`

Then run:

```bash
npm run art:import
```

The importer skips current files, converts only new or changed source images, resizes oversized art, and writes optimized WebP files. Use `python scripts/import_plant_art.py --source-dir "C:\path\to\photos"` if the photos are not in `~/OneDrive/Documents/Plant Photos`.

## Cloudflare Pages

Use these settings:

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: leave blank when deploying this repository directly
- Node version: 20 or newer

No database, login, server runtime, or Cloudflare adapter is required for this static build.

## Notes

The USDA Plant Hardiness Zone Map is the authority for zone definitions. `phzmapi.org` is isolated behind the `lookupZone` function in `src/pages/index.astro`, so swapping providers later is a small change.
