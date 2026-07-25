import { prisma } from "@/lib/prisma";
import { cache } from "react";

export type NewsRow = {
  category: string;
  label: string;
  limit: number;
};

export type SponsorLink = {
  label: string;
  url: string;
};

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
  newsRows: NewsRow[];
  thRows: NewsRow[];
  sponsorLinks: SponsorLink[];
  customHeadHtml: string;
  customBodyHtml: string;
};

const DEFAULT_NEWS_ROWS: NewsRow[] = [
  { category: "thailand-news", label: "Latest Thailand News", limit: 4 },
];

const DEFAULT_TH_ROWS: NewsRow[] = [
  { category: "thailand-news-th", label: "ข่าวล่าสุด", limit: 4 },
  { category: "thailand-news", label: "Thailand News", limit: 4 },
];

const DEFAULT_CUSTOM_HEAD_HTML = `<!-- Default Statcounter code for huahinvibes.com
https://www.huahinvibes.com -->
<script type="text/javascript">
var sc_project=13338058; 
var sc_invisible=1; 
var sc_security="4d0535cb"; 
</script>
<script type="text/javascript"
src="https://www.statcounter.com/counter/counter.js"
async></script>
<!-- End of Statcounter Code -->`;

const DEFAULT_CUSTOM_BODY_HTML = `<noscript><div class="statcounter"><a title="Web Analytics"
href="https://statcounter.com/" target="_blank" rel="nofollow noopener noreferrer external"><img
class="statcounter"
src="https://c.statcounter.com/13338058/0/4d0535cb/1/"
alt="Web Analytics"
referrerPolicy="no-referrer-when-downgrade"></a></div></noscript>`;

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
  newsRows: DEFAULT_NEWS_ROWS,
  thRows: DEFAULT_TH_ROWS,
  sponsorLinks: [],
  customHeadHtml: DEFAULT_CUSTOM_HEAD_HTML,
  customBodyHtml: DEFAULT_CUSTOM_BODY_HTML,
};

function parseRows(raw: string | undefined, fallback: NewsRow[]): NewsRow[] {
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

function parseSponsorLinks(raw: string | undefined): SponsorLink[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        label: String(item?.label ?? "").trim(),
        url: String(item?.url ?? "").trim(),
      }))
      .filter((item) => item.label && item.url);
  } catch {
    return [];
  }
}

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
      newsRows:        parseRows(map["hp_news_rows"], DEFAULT_NEWS_ROWS),
      thRows:          parseRows(map["hp_th_rows"],   DEFAULT_TH_ROWS),
      sponsorLinks:    parseSponsorLinks(map["hp_sponsor_links"]),
      customHeadHtml:  map["hp_custom_head_html"] ?? DEFAULTS.customHeadHtml,
      customBodyHtml:  map["hp_custom_body_html"] ?? DEFAULTS.customBodyHtml,
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
  if (config.newsRows        !== undefined) updates.push({ key: "hp_news_rows",        value: JSON.stringify(config.newsRows) });
  if (config.thRows          !== undefined) updates.push({ key: "hp_th_rows",          value: JSON.stringify(config.thRows) });
  if (config.sponsorLinks    !== undefined) updates.push({ key: "hp_sponsor_links",    value: JSON.stringify(config.sponsorLinks) });
  if (config.customHeadHtml  !== undefined) updates.push({ key: "hp_custom_head_html", value: config.customHeadHtml });
  if (config.customBodyHtml  !== undefined) updates.push({ key: "hp_custom_body_html", value: config.customBodyHtml });

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
