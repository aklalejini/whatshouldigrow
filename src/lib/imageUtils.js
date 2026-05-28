export const PLANT_PHOTO_WIDTHS = [480, 800, 1200];
export const BLOG_IMAGE_WIDTHS = [640, 1200, 1600];
export const MAP_IMAGE_WIDTHS = [1200, 2000, 3000];

export function optimizedImagePath(src, width, format = "webp") {
  return `/optimized/${src.replace(/^\//, "").replace(/\.[^.]+$/, `-${width}.${format}`)}`;
}

export function optimizedSrcset(src, widths, format = "webp") {
  return widths
    .map((width) => `${optimizedImagePath(src, width, format)} ${width}w`)
    .join(", ");
}
