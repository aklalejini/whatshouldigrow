export const SITE_NAME = "What Should I Grow";
export const SITE_URL = "https://whatshouldigrow.pages.dev";
export const SITE_DESCRIPTION =
  "A ZIP-based plant matcher and practical gardening guide for choosing plants that fit your light, soil, water, and goals.";
export const DEFAULT_SOCIAL_IMAGE = "/blog/right-plant-right-place-hero.jpg";

export function siteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
