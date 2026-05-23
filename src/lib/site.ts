export const SITE_NAME = "Plant by ZIP";
export const SITE_URL = "https://plantbyzip.com";
export const SITE_DESCRIPTION =
  "A ZIP-based plant matcher and practical gardening guide for choosing plants that fit your light, soil, water, and goals.";
export const DEFAULT_SOCIAL_IMAGE = "/blog/garden-beds-hero.jpg";

export function siteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
