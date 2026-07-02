export function decodeSlug(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function normalizeSlug(value: string) {
  return decodeSlug(value)
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^\u0E00-\u0E7Fa-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function makeSlug(slugOrName: string, fallback = "post") {
  return normalizeSlug(slugOrName) || fallback;
}

export function encodeSlug(value: string) {
  return encodeURIComponent(decodeSlug(value));
}

export function getBlogHref(slug: string) {
  return `/blog/${encodeSlug(slug)}`;
}

export function getPlaceHref(slug: string) {
  return `/place/${encodeSlug(slug)}`;
}
