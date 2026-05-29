import type { Place } from "@prisma/client";

const DEFAULT_INDEXNOW_KEY = "8b7c6d5e4f3a2910b1c2d3e4f5a6b7c8";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.huahinvibes.com")
    .replace("https://huahinvibes.com", "https://www.huahinvibes.com")
    .replace(/\/$/, "");
}

function getIndexNowKey() {
  return process.env.INDEXNOW_KEY ?? DEFAULT_INDEXNOW_KEY;
}

export function getPlacePublicPath(place: Pick<Place, "type" | "slug">) {
  return place.type === "BLOG" ? `/blog/${place.slug}` : `/place/${place.slug}`;
}

export async function submitUrlToIndexNow(pathOrUrl: string) {
  const baseUrl = getBaseUrl();
  const key = getIndexNowKey();
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : `${baseUrl}${pathOrUrl}`;
  const keyLocation = `${baseUrl}/${key}.txt`;
  const endpoint = new URL(INDEXNOW_ENDPOINT);

  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("key", key);
  endpoint.searchParams.set("keyLocation", keyLocation);

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      console.warn(`IndexNow rejected ${url}: ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    console.warn(`IndexNow submit failed for ${url}`, err);
  }
}

export async function submitPlaceToIndexNow(place: Pick<Place, "type" | "slug" | "status">) {
  if (place.status !== "published") return;
  await submitUrlToIndexNow(getPlacePublicPath(place));
}
