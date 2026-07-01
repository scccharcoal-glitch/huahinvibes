import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const posts = [
  // ─── English Thailand News ──────────────────────────────────────────────────
  {
    name: "Thailand Tourism Hits Record 35 Million Visitors in 2025",
    slug: "thailand-tourism-record-35-million-2025",
    type: "BLOG",
    category: "thailand-news",
    status: "published",
    excerpt:
      "Thailand welcomed a record-breaking 35 million international tourists in 2025, surpassing pre-pandemic levels for the first time.",
    content: `<p>Thailand has achieved a landmark milestone in its tourism sector, welcoming over 35 million international visitors in 2025 — the highest number ever recorded and a significant recovery from the pandemic years.</p>
<p>The Tourism Authority of Thailand (TAT) confirmed the figures, noting that top source markets included China, Malaysia, India, South Korea, and the United Kingdom. Beach destinations such as Phuket, Koh Samui, and Hua Hin saw particularly strong bookings throughout the year.</p>
<h2>Hua Hin Leads Domestic Growth</h2>
<p>Hua Hin, Thailand's most beloved coastal destination, recorded a 28% increase in domestic tourists compared to 2024. The city's mix of royal heritage, pristine beaches, and world-class golf courses continues to attract visitors from Bangkok seeking a quick getaway.</p>
<p>New hotel openings and improved road infrastructure have also contributed to the city's rising popularity among both Thai and international travelers.</p>`,
    coverImage:
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80",
    tags: "tourism,thailand,travel,2025",
    publishedAt: new Date("2025-06-15"),
  },
  {
    name: "Hua Hin Named Best Beach Town in Thailand by Lonely Planet 2025",
    slug: "hua-hin-best-beach-town-lonely-planet-2025",
    type: "BLOG",
    category: "thailand-news",
    status: "published",
    excerpt:
      "Lonely Planet has recognized Hua Hin as Thailand's best beach town for 2025, praising its blend of royal heritage and modern amenities.",
    content: `<p>Hua Hin has earned the prestigious title of Thailand's Best Beach Town 2025 from Lonely Planet, one of the world's most trusted travel guides. The award highlights the town's unique combination of royal heritage, pristine beaches, vibrant night markets, and a growing culinary scene.</p>
<h2>Why Hua Hin Stands Out</h2>
<p>Unlike the party-focused islands of southern Thailand, Hua Hin offers a more relaxed atmosphere that appeals to families, couples, and retirees alike. The town's proximity to Bangkok — just 3.5 hours by train — makes it a perfect weekend escape.</p>
<p>Lonely Planet's editors praised the Cicada Market, the Hua Hin Night Market, and the stunning Khao Takiab beach among the town's top highlights.</p>`,
    coverImage:
      "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=1200&q=80",
    tags: "hua-hin,beach,award,travel",
    publishedAt: new Date("2025-06-10"),
  },
  {
    name: "Thailand Launches New 10-Year Visa for Remote Workers and Retirees",
    slug: "thailand-10-year-visa-remote-workers-retirees",
    type: "BLOG",
    category: "thailand-news",
    status: "published",
    excerpt:
      "Thailand introduces a new 10-year long-term resident visa targeting wealthy expats, remote workers, and retirees seeking to live in the Kingdom.",
    content: `<p>The Thai government has officially launched the Long-Term Resident (LTR) visa, a new 10-year residency option designed to attract high-income foreigners, digital nomads, and retirees to the Kingdom.</p>
<h2>Who Qualifies?</h2>
<p>Applicants must fall into one of four categories: wealthy global citizens, wealthy pensioners, work-from-Thailand professionals, or highly-skilled professionals. Each category has specific income and investment requirements.</p>
<h2>Benefits of the LTR Visa</h2>
<ul>
  <li>10-year renewable visa</li>
  <li>Work permit included for professionals</li>
  <li>Fast-track immigration service</li>
  <li>50% personal income tax reduction for qualifying expats</li>
</ul>
<p>Popular destinations for LTR visa holders include Bangkok, Chiang Mai, Phuket, and Hua Hin, where a growing expat community already calls home.</p>`,
    coverImage:
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&q=80",
    tags: "visa,expat,retirement,thailand",
    publishedAt: new Date("2025-06-05"),
  },
  {
    name: "Bangkok to Hua Hin High-Speed Rail Project Gets Green Light",
    slug: "bangkok-hua-hin-high-speed-rail-approved",
    type: "BLOG",
    category: "thailand-news",
    status: "published",
    excerpt:
      "The Cabinet has approved the Bangkok–Hua Hin high-speed rail project that will cut travel time from 3.5 hours to just 90 minutes.",
    content: `<p>Thailand's Cabinet has given the green light to a long-awaited high-speed rail project connecting Bangkok to Hua Hin, promising to slash journey times from the current 3.5 hours to just 90 minutes.</p>
<p>The project, estimated at 80 billion baht, is expected to break ground in late 2025 with completion targeted for 2029. The line will serve as an extension of the existing Southern rail corridor and include stops at Phetchaburi and Pranburi.</p>
<h2>Impact on Hua Hin Real Estate</h2>
<p>Property analysts predict the project will significantly boost real estate values along the Hua Hin corridor, with some estimates suggesting price increases of 20–30% in key areas once construction begins.</p>`,
    coverImage:
      "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1200&q=80",
    tags: "train,infrastructure,hua-hin,bangkok",
    publishedAt: new Date("2025-05-28"),
  },

  // ─── Thai Language News ─────────────────────────────────────────────────────
  {
    name: 'หัวหิน คว้ารางวัล "เมืองท่องเที่ยวยั่งยืน" ระดับนานาชาติ ปี 2568',
    slug: "hua-hin-sustainable-tourism-award-2568",
    type: "BLOG",
    category: "thailand-news-th",
    status: "published",
    excerpt:
      "หัวหินคว้ารางวัลเมืองท่องเที่ยวยั่งยืนระดับนานาชาติ จากการพัฒนาการท่องเที่ยวที่คำนึงถึงสิ่งแวดล้อมและชุมชนท้องถิ่น",
    content: `<p>เมืองหัวหิน จังหวัดประจวบคีรีขันธ์ คว้ารางวัล "เมืองท่องเที่ยวยั่งยืน" จากองค์กรการท่องเที่ยวโลก (UNWTO) ประจำปี 2568 สะท้อนความสำเร็จในการพัฒนาการท่องเที่ยวที่สมดุลระหว่างเศรษฐกิจ สังคม และสิ่งแวดล้อม</p>
<h2>ความโดดเด่นของหัวหิน</h2>
<p>คณะกรรมการ UNWTO ยกย่องหัวหินในด้านการอนุรักษ์ชายหาดและระบบนิเวศทางทะเล การพัฒนาตลาดชุมชน อย่างตลาดซิกาดา และตลาดนัดกลางคืน ที่สร้างรายได้ให้แก่ผู้ประกอบการท้องถิ่น</p>
<p>นอกจากนี้ยังมีโครงการ "หัวหินสะอาด" ที่ลดขยะพลาสติกบนชายหาดได้กว่า 60% ในช่วง 3 ปีที่ผ่านมา</p>`,
    coverImage:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    tags: "หัวหิน,ท่องเที่ยว,รางวัล,ยั่งยืน",
    publishedAt: new Date("2025-06-12"),
  },
  {
    name: 'ททท. เปิดตัวแคมเปญ "เที่ยวหัวหินฤดูฝน" ดึงนักท่องเที่ยวไทย-ต่างชาติ',
    slug: "tat-hua-hin-rainy-season-campaign-2568",
    type: "BLOG",
    category: "thailand-news-th",
    status: "published",
    excerpt:
      "การท่องเที่ยวแห่งประเทศไทย (ททท.) เปิดตัวแคมเปญส่งเสริมการท่องเที่ยวหัวหินช่วงฤดูฝน ชูจุดเด่นธรรมชาติสีเขียว อาหารทะเล และที่พักราคาดี",
    content: `<p>การท่องเที่ยวแห่งประเทศไทย (ททท.) สำนักงานประจวบคีรีขันธ์ เปิดตัวแคมเปญ "เที่ยวหัวหินฤดูฝน เขียวขจีทุกมุมมอง" เพื่อกระตุ้นการท่องเที่ยวในช่วง Low Season ระหว่างเดือนพฤษภาคมถึงตุลาคม</p>
<h2>ไฮไลต์แคมเปญ</h2>
<ul>
  <li>โปรโมชั่นที่พักลดสูงสุด 40% จากโรงแรมชั้นนำกว่า 50 แห่ง</li>
  <li>แพ็คเกจทัวร์เที่ยวธรรมชาติ เขาสามร้อยยอด และอุทยานแห่งชาติกุยบุรี</li>
  <li>เทศกาลอาหารทะเลหัวหิน ณ ถนนเดชาสำราญ</li>
  <li>กิจกรรมปลูกป่าชายเลนริมอ่าว</li>
</ul>
<p>ช่วงฤดูฝนถือเป็นโอกาสดีสำหรับนักท่องเที่ยวที่ต้องการความเงียบสงบและราคาที่จับต้องได้มากขึ้น</p>`,
    coverImage:
      "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=1200&q=80",
    tags: "ททท,หัวหิน,ท่องเที่ยว,ฤดูฝน",
    publishedAt: new Date("2025-06-08"),
  },
  {
    name: "ราคาที่ดินหัวหินพุ่ง 25% หลังข่าวรถไฟความเร็วสูงกรุงเทพฯ-หัวหิน",
    slug: "hua-hin-land-price-surge-high-speed-rail",
    type: "BLOG",
    category: "thailand-news-th",
    status: "published",
    excerpt:
      "ราคาที่ดินในหัวหินและพื้นที่ใกล้เคียงพุ่งสูงขึ้น 25% หลังรัฐบาลอนุมัติโครงการรถไฟความเร็วสูงกรุงเทพฯ-หัวหิน",
    content: `<p>นักวิเคราะห์อสังหาริมทรัพย์รายงานว่า ราคาที่ดินในอำเภอหัวหินและพื้นที่โดยรอบปรับตัวสูงขึ้นเฉลี่ย 25% ในช่วง 3 เดือนที่ผ่านมา หลังจากคณะรัฐมนตรีอนุมัติโครงการก่อสร้างรถไฟความเร็วสูงเชื่อมกรุงเทพฯ-หัวหิน</p>
<h2>พื้นที่ที่ราคาพุ่งแรงที่สุด</h2>
<ul>
  <li>บริเวณถนนเพชรเกษม ราคาเพิ่มขึ้น 30%</li>
  <li>โซนหัวหิน Bypass ราคาเพิ่มขึ้น 22%</li>
  <li>ปราณบุรีและสามร้อยยอด ราคาเพิ่มขึ้น 18%</li>
</ul>
<p>ผู้เชี่ยวชาญแนะนำว่านี่คือโอกาสสำหรับนักลงทุนระยะยาว แต่ควรศึกษาข้อมูลโครงการรถไฟให้ชัดเจนก่อนตัดสินใจ</p>`,
    coverImage:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80",
    tags: "อสังหา,หัวหิน,ที่ดิน,รถไฟ",
    publishedAt: new Date("2025-06-01"),
  },
];

async function main() {
  for (const post of posts) {
    const result = await prisma.place.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
    console.log(`✓ ${result.name}`);
  }
  console.log(`\nDone — ${posts.length} posts created/updated.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
