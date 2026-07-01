import { prisma } from "@/lib/prisma";
import { cache } from "react";

export type HomepageConfig = {
  showNews: boolean;
  showRealestate: boolean;
  showBlog: boolean;
  showFeatured: boolean;
  showCategories: boolean;
  newsCategory: string;
  blogCategory: string;
  newsLimit: number;
  blogLimit: number;
  featuredLimit: number;
};

const DEFAULTS: HomepageConfig = {
  showNews: true,
  showRealestate: true,
  showBlog: true,
  showFeatured: true,
  showCategories: true,
  newsCategory: "thailand-news",
  blogCategory: "",
  newsLimit: 10,
  blogLimit: 6,
  featuredLimit: 6,
};

export const getHomepageConfig = cache(async (): Promise<HomepageConfig> => {
  try {
    const rows = await prisma.siteConfig.findMany({
      where: { key: { startsWith: "hp_" } },
    });
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return {
      showNews:        map["hp_show_news"]        !== "false",
      showRealestate:  map["hp_show_realestate"]  !== "false",
      showBlog:        map["hp_show_blog"]         !== "false",
      showFeatured:    map["hp_show_featured"]     !== "false",
      showCategories:  map["hp_show_categories"]   !== "false",
      newsCategory:    map["hp_news_category"]     ?? DEFAULTS.newsCategory,
      blogCategory:    map["hp_blog_category"]     ?? DEFAULTS.blogCategory,
      newsLimit:       parseInt(map["hp_news_limit"]     ?? "10"),
      blogLimit:       parseInt(map["hp_blog_limit"]     ?? "6"),
      featuredLimit:   parseInt(map["hp_featured_limit"] ?? "6"),
    };
  } catch {
    return DEFAULTS;
  }
});

export async function saveHomepageConfig(config: Partial<HomepageConfig>) {
  const updates: { key: string; value: string }[] = [];
  if (config.showNews        !== undefined) updates.push({ key: "hp_show_news",        value: String(config.showNews) });
  if (config.showRealestate  !== undefined) updates.push({ key: "hp_show_realestate",  value: String(config.showRealestate) });
  if (config.showBlog        !== undefined) updates.push({ key: "hp_show_blog",        value: String(config.showBlog) });
  if (config.showFeatured    !== undefined) updates.push({ key: "hp_show_featured",    value: String(config.showFeatured) });
  if (config.showCategories  !== undefined) updates.push({ key: "hp_show_categories",  value: String(config.showCategories) });
  if (config.newsCategory    !== undefined) updates.push({ key: "hp_news_category",    value: config.newsCategory });
  if (config.blogCategory    !== undefined) updates.push({ key: "hp_blog_category",    value: config.blogCategory });
  if (config.newsLimit       !== undefined) updates.push({ key: "hp_news_limit",       value: String(config.newsLimit) });
  if (config.blogLimit       !== undefined) updates.push({ key: "hp_blog_limit",       value: String(config.blogLimit) });
  if (config.featuredLimit   !== undefined) updates.push({ key: "hp_featured_limit",   value: String(config.featuredLimit) });

  await Promise.all(
    updates.map((u) =>
      prisma.siteConfig.upsert({
        where: { key: u.key },
        update: { value: u.value },
        create: { key: u.key, value: u.value },
      })
    )
  );
}
