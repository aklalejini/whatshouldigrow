export const SITE_NAME = "Plant by ZIP";
export const SITE_URL = "https://plantbyzip.com";
export const SITE_DESCRIPTION =
  "A ZIP-based plant matcher, planting calendar, and practical gardening guide for choosing plants that fit your light, soil, water, and goals.";
export const DEFAULT_SOCIAL_IMAGE = "/blog/fruit-tree-apple-hero.jpg";
export const SITE_LASTMOD = "2026-06-12";

export function siteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
