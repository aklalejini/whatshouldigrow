export const PLANT_PHOTO_WIDTHS = [480, 800, 1200];
export const BLOG_IMAGE_WIDTHS = [640, 1200, 1600];
export const MAP_IMAGE_WIDTHS = [1200, 2000, 3000];

export function versionedImagePath(src, version) {
  if (!src || version === undefined || version === null || version === "") return src;
  const separator = src.includes("?") ? "&" : "?";
  return `${src}${separator}v=${encodeURIComponent(String(version))}`;
}

export function optimizedImagePath(src, width, format = "webp", version) {
  const optimizedPath = `/optimized/${src.replace(/^\//, "").replace(/\.[^.]+$/, `-${width}.${format}`)}`;
  return versionedImagePath(optimizedPath, version);
}

export function optimizedSrcset(src, widths, format = "webp", version) {
  return widths
    .map((width) => `${optimizedImagePath(src, width, format, version)} ${width}w`)
    .join(", ");
}
