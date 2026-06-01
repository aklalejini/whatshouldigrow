import { getCollection } from "astro:content";
import plants from "../data/plants.json";
import plantMetrics from "../data/plantMetrics.json";
import plantPhotos from "../data/plantPhotos.json";
import { GARDEN_PLAN_TEMPLATES } from "../lib/gardenPlanTemplates";
import { HUB_PAGES, TRUST_PAGES } from "../lib/hubData";
import { SITE_LASTMOD, siteUrl } from "../lib/site";
import { goalGroups, typeGroups, zoneGroups } from "../lib/plantDirectory";
import { plantUrl } from "../lib/plantUtils";
import { ZONE_PAGE_TARGETS } from "../lib/zonePageData";

function escapeXml(value: string) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getCollection("blog");
  const photoById = new Map(plantPhotos.map((entry) => [entry.id, entry]));
  const urls = [
    { loc: siteUrl("/"), lastmod: SITE_LASTMOD, priority: "1.0" },
    ...HUB_PAGES.map((hub) => ({
      loc: siteUrl(hub.path),
      lastmod: SITE_LASTMOD,
      priority: hub.slug === "planting-calendar" ? "0.9" : "0.85"
    })),
    ...ZONE_PAGE_TARGETS.map((page) => ({
      loc: siteUrl(page.path),
      lastmod: SITE_LASTMOD,
      priority: "0.82"
    })),
    { loc: siteUrl("/garden-plans/"), lastmod: SITE_LASTMOD, priority: "0.84" },
    ...GARDEN_PLAN_TEMPLATES.map((template) => ({
      loc: siteUrl(template.path),
      lastmod: SITE_LASTMOD,
      priority: "0.83"
    })),
    { loc: siteUrl("/plants/"), lastmod: SITE_LASTMOD, priority: "0.86" },
    ...goalGroups(plants).map((group) => ({
      loc: siteUrl(`/plants/goal/${group.slug}/`),
      lastmod: SITE_LASTMOD,
      priority: "0.76"
    })),
    ...typeGroups(plants).map((group) => ({
      loc: siteUrl(`/plants/type/${group.slug}/`),
      lastmod: SITE_LASTMOD,
      priority: "0.74"
    })),
    ...zoneGroups(plants).map((group) => ({
      loc: siteUrl(`/plants/zone/${group.slug}/`),
      lastmod: SITE_LASTMOD,
      priority: "0.74"
    })),
    ...TRUST_PAGES.map((page) => ({
      loc: siteUrl(page.path),
      lastmod: SITE_LASTMOD,
      priority: "0.6"
    })),
    { loc: siteUrl("/blog/"), lastmod: SITE_LASTMOD, priority: "0.8" },
    ...posts.map((post) => ({
      loc: siteUrl(`/blog/${post.data.slug}/`),
      lastmod: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
      images: post.data.heroImage ? [{
        loc: siteUrl(post.data.heroImage),
        title: post.data.title,
        caption: post.data.heroAlt
      }] : [],
      priority: "0.8"
    })),
    ...plants.map((plant) => {
      const photo = photoById.get(plant.id);
      return {
        loc: siteUrl(plantUrl(plant)),
        lastmod: plantMetrics[plant.id]?.lastReviewed ?? SITE_LASTMOD,
        images: photo?.primary?.src ? [{
          loc: siteUrl(photo.primary.src),
          title: plant.name,
          caption: photo.primary.caption ?? photo.primary.alt ?? plant.notes
        }] : [],
        priority: "0.7"
      };
    })
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    ${url.lastmod ? `<lastmod>${escapeXml(url.lastmod)}</lastmod>` : ""}
    ${(url.images ?? []).map((image) => `<image:image>
      <image:loc>${escapeXml(image.loc)}</image:loc>
      ${image.title ? `<image:title>${escapeXml(image.title)}</image:title>` : ""}
      ${image.caption ? `<image:caption>${escapeXml(image.caption)}</image:caption>` : ""}
    </image:image>`).join("\n    ")}
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
}
