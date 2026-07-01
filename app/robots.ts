import { MetadataRoute } from "next";

const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL ?? "https://www.huahinvibes.com")
  .replace("https://huahinvibes.com", "https://www.huahinvibes.com")
  .replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
