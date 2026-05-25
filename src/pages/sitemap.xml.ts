import { getCollection } from "astro:content";
import plants from "../data/plants.json";
import { HUB_PAGES, TRUST_PAGES } from "../lib/hubData";
import { siteUrl } from "../lib/site";
import { plantUrl } from "../lib/plantUtils";

export async function GET() {
  const posts = await getCollection("blog");
  const urls = [
    { loc: siteUrl("/"), priority: "1.0" },
    ...HUB_PAGES.map((hub) => ({
      loc: siteUrl(hub.path),
      priority: hub.slug === "planting-calendar" ? "0.9" : "0.85"
    })),
    ...TRUST_PAGES.map((page) => ({
      loc: siteUrl(page.path),
      priority: "0.6"
    })),
    { loc: siteUrl("/blog/"), priority: "0.8" },
    ...posts.map((post) => ({
      loc: siteUrl(`/blog/${post.data.slug}/`),
      lastmod: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
      priority: "0.8"
    })),
    ...plants.map((plant) => ({
      loc: siteUrl(plantUrl(plant)),
      priority: "0.7"
    }))
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
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
