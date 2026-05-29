export function isPublicImageUrl(src?: string | null): src is string {
  return typeof src === "string" && /^https?:\/\//i.test(src);
}
