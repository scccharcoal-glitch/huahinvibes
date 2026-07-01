export type NewsItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  image?: string;
  category?: string;
  source?: string;
};

function extractTag(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`, 'i');
  return (xml.match(re)?.[1] ?? '').trim();
}

function parseItems(xml: string, source: string): NewsItem[] {
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  return blocks.slice(0, 12).map((item) => {
    const title = extractTag(item, 'title');
    const rawLink = extractTag(item, 'link');
    const link = rawLink || (item.match(/<link>(.*?)<\/link>/)?.[1] ?? '');
    const description = extractTag(item, 'description')
      .replace(/<[^>]+>/g, '')
      .replace(/&[a-z]+;/g, ' ')
      .slice(0, 180);
    const pubDate = extractTag(item, 'pubDate') || extractTag(item, 'dc:date');
    const category = extractTag(item, 'category');

    // image: try media:content, enclosure, og:image in description html
    let image =
      item.match(/media:content[^>]+url="([^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i)?.[1] ??
      item.match(/<enclosure[^>]+url="([^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i)?.[1] ??
      item.match(/<img[^>]+src="([^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i)?.[1] ??
      item.match(/url="([^"]+\.(?:jpg|jpeg|png|webp)[^"]*)"/i)?.[1];

    return { title, link, description, pubDate, image, category, source };
  }).filter((n) => n.title && n.link);
}

async function fetchRss(url: string, source: string): Promise<NewsItem[]> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 1800 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HuaHinVibes/1.0; +https://www.huahinvibes.com)' },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseItems(xml, source);
  } catch {
    return [];
  }
}

export async function fetchThailandNewsEn(): Promise<NewsItem[]> {
  // Bangkok Post top stories RSS
  const items = await fetchRss(
    'https://www.bangkokpost.com/rss/data/topstories.xml',
    'Bangkok Post'
  );
  if (items.length > 0) return items;
  // Fallback: Thaiger
  return fetchRss('https://thethaiger.com/feed', 'The Thaiger');
}

export async function fetchThailandNewsTh(): Promise<NewsItem[]> {
  // Thairath Thai RSS
  const items = await fetchRss('https://www.thairath.co.th/rss/news.xml', 'ไทยรัฐ');
  if (items.length > 0) return items;
  // Fallback: Sanook
  return fetchRss('https://www.sanook.com/news/rss/', 'สนุก! ข่าว');
}

export function timeAgo(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} นาทีที่แล้ว`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} ชั่วโมงที่แล้ว`;
    return `${Math.floor(hrs / 24)} วันที่แล้ว`;
  } catch {
    return dateStr;
  }
}

export function timeAgoEn(dateStr: string): string {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} minutes ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hours ago`;
    return `${Math.floor(hrs / 24)} days ago`;
  } catch {
    return dateStr;
  }
}
