import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const cities = [
  {
    slug: "real-estate-hua-hin",
    name: "คู่มือซื้ออสังหาริมทรัพย์หัวหิน — ราคา ทำเล และโครงการแนะนำ",
    excerpt: "หัวหินคือทางเลือกยอดนิยมสำหรับนักลงทุนอสังหาฯ ทั้งชาวไทยและต่างชาติ ด้วยชายหาด ราคาที่จับต้องได้ และตลาดที่เติบโตต่อเนื่อง",
    coverImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
    tags: "real-estate,hua-hin,property,invest",
    city: "Hua Hin", cityTh: "หัวหิน", fazwazSlug: "hua-hin",
    content: `<p>หัวหินเป็นหนึ่งในตลาดอสังหาริมทรัพย์ที่ได้รับความนิยมมากที่สุดในประเทศไทย ด้วยความเป็นเมืองชายทะเลที่สงบ ใกล้กรุงเทพฯ เพียง 3.5 ชั่วโมง และมีสาธารณูปโภคครบครัน</p>
<h2>ราคาอสังหาริมทรัพย์หัวหิน</h2>
<ul>
  <li>คอนโดมิเนียม: ราคาเริ่มต้น 1.5–5 ล้านบาท</li>
  <li>บ้านเดี่ยว: 4–20 ล้านบาทขึ้นไป</li>
  <li>วิลล่าริมหาด: 15–100 ล้านบาท</li>
  <li>ที่ดิน: 5,000–50,000 บาท/ตร.ว. ขึ้นอยู่กับทำเล</li>
</ul>
<h2>ทำเลแนะนำในหัวหิน</h2>
<p><strong>ย่านใจกลางเมือง</strong> — เหมาะสำหรับนักลงทุนที่ต้องการ yield จากการปล่อยเช่าระยะสั้น ใกล้ตลาดนัด ร้านอาหาร และชายหาด</p>
<p><strong>โซน Bypass (ถนนเลี่ยงเมือง)</strong> — ราคาที่ดินยังไม่สูงมาก เหมาะสำหรับโครงการหมู่บ้านจัดสรร</p>
<p><strong>เขาตะเกียบ-ขาม</strong> — ธรรมชาติสวยงาม เหมาะสำหรับวิลล่าส่วนตัว</p>
<h2>ค้นหาอสังหาริมทรัพย์หัวหิน</h2>
<p>เรียกดูโครงการคอนโด บ้าน วิลล่า และที่ดินในหัวหินได้ที่ FazWaz — แพลตฟอร์มอสังหาฯ ชั้นนำของไทยที่มีรายการให้เลือกกว่า 10,000 โครงการ</p>
<p><a href="https://www.fazwaz.com/property-for-sale/thailand/hua-hin" target="_blank" rel="noopener sponsored" style="display:inline-block;background:linear-gradient(135deg,#b50062,#7f45a1);color:#fff;padding:12px 24px;border-radius:50px;font-weight:700;text-decoration:none;margin:8px 0;">ดูอสังหาริมทรัพย์ในหัวหิน →</a></p>`,
  },
  {
    slug: "real-estate-cha-am",
    name: "อสังหาริมทรัพย์ชะอำ — บ้าน คอนโด และที่ดิน ใกล้หาดชะอำ",
    excerpt: "ชะอำยังมีราคาที่ดินต่ำกว่าหัวหิน แต่มีศักยภาพการเติบโตสูง เหมาะสำหรับนักลงทุนระยะยาว",
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    tags: "real-estate,cha-am,property,invest",
    city: "Cha-Am", cityTh: "ชะอำ", fazwazSlug: "cha-am",
    content: `<p>ชะอำเป็นเมืองชายทะเลที่อยู่ระหว่างกรุงเทพฯ และหัวหิน มีหาดทรายยาวกว่า 10 กิโลเมตร และสภาพแวดล้อมที่เงียบสงบกว่าหัวหิน ทำให้ราคาอสังหาฯ ยังไม่พุ่งสูงเท่า</p>
<h2>ราคาอสังหาริมทรัพย์ชะอำ</h2>
<ul>
  <li>คอนโดริมหาด: 1–3 ล้านบาท</li>
  <li>บ้านเดี่ยว: 2.5–8 ล้านบาท</li>
  <li>ที่ดิน: 2,000–20,000 บาท/ตร.ว.</li>
</ul>
<h2>ทำไมต้องลงทุนที่ชะอำ?</h2>
<p>ชะอำอยู่ไม่ไกลจากโครงการรถไฟความเร็วสูงที่จะเชื่อมกรุงเทพฯ-หัวหิน ทำให้นักวิเคราะห์คาดว่าราคาที่ดินในพื้นที่จะปรับขึ้น 15–25% ในช่วง 3–5 ปีนี้</p>
<p><a href="https://www.fazwaz.com/property-for-sale/thailand/cha-am" target="_blank" rel="noopener sponsored" style="display:inline-block;background:linear-gradient(135deg,#b50062,#7f45a1);color:#fff;padding:12px 24px;border-radius:50px;font-weight:700;text-decoration:none;margin:8px 0;">ดูอสังหาริมทรัพย์ในชะอำ →</a></p>`,
  },
  {
    slug: "real-estate-pranburi",
    name: "อสังหาริมทรัพย์ปราณบุรี — สวรรค์ของนักลงทุนผู้ชื่นชอบธรรมชาติ",
    excerpt: "ปราณบุรีมีชายหาดที่เงียบสงบที่สุดของอ่าวไทย เหมาะสำหรับผู้ที่ต้องการบ้านพักตากอากาศหรือรีสอร์ทส่วนตัว",
    coverImage: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&q=80",
    tags: "real-estate,pranburi,property,invest",
    city: "Pranburi", cityTh: "ปราณบุรี", fazwazSlug: "pranburi",
    content: `<p>ปราณบุรีตั้งอยู่ห่างจากหัวหินไปทางใต้ประมาณ 30 กม. มีชายหาดเงียบสงบ น้ำทะเลใส และระบบนิเวศป่าชายเลนที่สมบูรณ์ เป็นที่นิยมของชาวต่างชาติที่ต้องการบ้านพักตากอากาศส่วนตัว</p>
<h2>ราคาอสังหาริมทรัพย์ปราณบุรี</h2>
<ul>
  <li>วิลล่าริมหาด: 8–30 ล้านบาท</li>
  <li>บ้านเดี่ยว: 3–10 ล้านบาท</li>
  <li>ที่ดิน: 3,000–30,000 บาท/ตร.ว.</li>
</ul>
<h2>ไฮไลต์ปราณบุรี</h2>
<p>หาดปราณบุรี, อุทยานแห่งชาติเขาสามร้อยยอด, และตลาดชุมชนชาวประมง — ทำให้ปราณบุรีเป็นทางเลือกยอดนิยมสำหรับผู้ที่ต้องการความเป็นส่วนตัวสูงสุด</p>
<p><a href="https://www.fazwaz.com/property-for-sale/thailand/pranburi" target="_blank" rel="noopener sponsored" style="display:inline-block;background:linear-gradient(135deg,#b50062,#7f45a1);color:#fff;padding:12px 24px;border-radius:50px;font-weight:700;text-decoration:none;margin:8px 0;">ดูอสังหาริมทรัพย์ในปราณบุรี →</a></p>`,
  },
  {
    slug: "real-estate-bangkok",
    name: "Bangkok Real Estate Guide — Condos in Sukhumvit, Sathorn and Asoke",
    excerpt: "Bangkok remains Thailand's largest and most liquid property market, with strong rental demand, global buyer interest, and prime condo opportunities across the city.",
    coverImage: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=1200&q=80",
    tags: "real-estate,bangkok,property,invest,condo",
    city: "Bangkok", cityTh: "กรุงเทพฯ", fazwazSlug: "bangkok",
    content: `<p>Bangkok is Thailand's most important real estate market and one of Southeast Asia's most active urban property hubs. The city combines deep rental demand, international business activity, excellent transport links, and a wide range of condo choices from entry-level units to luxury residences.</p>
<h2>Why Bangkok Property Stands Out</h2>
<ul>
  <li><strong>High liquidity:</strong> Bangkok has a large pool of local and foreign buyers, making quality condos easier to rent, resell, and compare.</li>
  <li><strong>Strong rental demand:</strong> Business travelers, expats, students, medical tourists, and long-stay visitors keep demand steady in central districts.</li>
  <li><strong>Excellent transport:</strong> BTS, MRT, Airport Rail Link, expressways, and expanding rail lines make transit-connected condos especially attractive.</li>
  <li><strong>Wide price range:</strong> Buyers can choose from affordable city-fringe condos to luxury branded residences in prime CBD locations.</li>
</ul>
<h2>Best Bangkok Areas to Consider</h2>
<ul>
  <li><strong>Sukhumvit:</strong> A lifestyle and expat corridor with strong condo demand around Asoke, Phrom Phong, Thong Lo, and Ekkamai.</li>
  <li><strong>Sathorn and Silom:</strong> Bangkok's classic CBD, popular with professionals and investors focused on long-term rental tenants.</li>
  <li><strong>Rama 9 and Phetchaburi:</strong> A fast-growing business zone with newer condos, offices, malls, and improving connectivity.</li>
  <li><strong>Lat Phrao and Ratchada:</strong> More accessible pricing, strong MRT access, and good appeal for local renters and first-time buyers.</li>
</ul>
<h2>Key Benefits for Buyers</h2>
<p>Bangkok property is attractive because it offers scale, convenience, and flexibility. Investors can target rental income, owner-occupiers can choose walkable neighborhoods near transit, and overseas buyers can focus on established condo buildings with proven demand.</p>
<p>For long-term value, the strongest opportunities are usually near mass transit, international schools, hospitals, office districts, lifestyle malls, and neighborhoods with limited future land supply.</p>
<p><a href="/real-estate" style="display:inline-block;background:linear-gradient(135deg,#b50062,#7f45a1);color:#fff;padding:12px 24px;border-radius:50px;font-weight:700;text-decoration:none;margin:8px 0;">View Bangkok properties for sale →</a></p>`,
  },
  {
    slug: "real-estate-koh-samui",
    name: "อสังหาริมทรัพย์เกาะสมุย — วิลล่า คอนโด และรีสอร์ทบนเกาะสวรรค์",
    excerpt: "เกาะสมุยมีตลาดอสังหาฯ ที่แข็งแกร่ง ดึงดูดนักลงทุนจากยุโรปและเอเชีย ด้วยโครงการวิลล่าหรูระดับโลก",
    coverImage: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1200&q=80",
    tags: "real-estate,koh-samui,samui,property,villa",
    city: "Koh Samui", cityTh: "เกาะสมุย", fazwazSlug: "koh-samui",
    content: `<p>เกาะสมุยเป็นตลาดวิลล่าหรูชั้นนำของเอเชียตะวันออกเฉียงใต้ ด้วยทิวทัศน์ทะเลและพระอาทิตย์ตกอันสวยงาม ดึงดูดผู้ซื้อจากยุโรป ออสเตรเลีย และรัสเซีย</p>
<h2>ประเภทอสังหาฯ ยอดนิยมในสมุย</h2>
<ul>
  <li>วิลล่า infinity pool ริมเขา: 10–80 ล้านบาท</li>
  <li>คอนโดริมหาด: 3–8 ล้านบาท</li>
  <li>รีสอร์ทขนาดเล็ก (6–12 ห้อง): 20–60 ล้านบาท</li>
</ul>
<h2>พื้นที่แนะนำ</h2>
<p>บางรัก, เชิงมน, ลิปะน้อย — เป็นทำเลที่ได้รับความนิยมจากชาวต่างชาติมากที่สุด</p>
<p><a href="https://www.fazwaz.com/property-for-sale/thailand/koh-samui" target="_blank" rel="noopener sponsored" style="display:inline-block;background:linear-gradient(135deg,#b50062,#7f45a1);color:#fff;padding:12px 24px;border-radius:50px;font-weight:700;text-decoration:none;margin:8px 0;">ดูอสังหาริมทรัพย์ในเกาะสมุย →</a></p>`,
  },
  {
    slug: "real-estate-phuket",
    name: "อสังหาริมทรัพย์ภูเก็ต — ตลาดวิลล่าและคอนโดอันดับหนึ่งของไทย",
    excerpt: "ภูเก็ตคือตลาดอสังหาฯ ต่างชาติที่ใหญ่ที่สุดในไทย มีผู้ซื้อกว่า 60 ประเทศ rental yield สูงถึง 8–10% ต่อปี",
    coverImage: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1200&q=80",
    tags: "real-estate,phuket,property,villa,invest",
    city: "Phuket", cityTh: "ภูเก็ต", fazwazSlug: "phuket",
    content: `<p>ภูเก็ตเป็นตลาดอสังหาริมทรัพย์ที่มีขนาดใหญ่ที่สุดในไทยในแง่ผู้ซื้อต่างชาติ โดย rental yield เฉลี่ยอยู่ที่ 6–10% ต่อปี ขึ้นอยู่กับทำเลและประเภทโครงการ</p>
<h2>พื้นที่แนะนำในภูเก็ต</h2>
<ul>
  <li><strong>กมลา-สุรินทร์</strong> — หาดสวย เงียบสงบ วิลล่าราคา 15–50 ล้านบาท</li>
  <li><strong>ป่าตอง</strong> — ย่านท่องเที่ยวหลัก ผลตอบแทนเช่าสูงสุด</li>
  <li><strong>ราไวย์-ไนหาร์น</strong> — ชุมชน expat เติบโตเร็ว</li>
  <li><strong>บางเทา-เลยะ</strong> — โครงการ luxury ใหม่ๆ เต็มพื้นที่</li>
</ul>
<h2>กฎหมายต่างชาติซื้ออสังหาฯ</h2>
<p>ชาวต่างชาติสามารถถือครองคอนโดได้ (Freehold) สูงสุด 49% ของโครงการ หรือเช่าระยะยาว (Leasehold) 30+30 ปี</p>
<p><a href="https://www.fazwaz.com/property-for-sale/thailand/phuket" target="_blank" rel="noopener sponsored" style="display:inline-block;background:linear-gradient(135deg,#b50062,#7f45a1);color:#fff;padding:12px 24px;border-radius:50px;font-weight:700;text-decoration:none;margin:8px 0;">ดูอสังหาริมทรัพย์ในภูเก็ต →</a></p>`,
  },
  {
    slug: "real-estate-chiang-mai",
    name: "อสังหาริมทรัพย์เชียงใหม่ — บ้านในเมือง คอนโดนิมมาน และวิลล่าบนดอย",
    excerpt: "เชียงใหม่ดึงดูด digital nomad และผู้เกษียณต่างชาติ ด้วยต้นทุนชีวิตต่ำ อากาศดี และชุมชนคนไทย-ต่างชาติที่แข็งแกร่ง",
    coverImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80",
    tags: "real-estate,chiang-mai,property,invest,expat",
    city: "Chiang Mai", cityTh: "เชียงใหม่", fazwazSlug: "chiang-mai",
    content: `<p>เชียงใหม่กลายเป็น hotspot ของ digital nomad และ remote worker จากทั่วโลก ตลาดอสังหาฯ ยังมีราคาเข้าถึงได้และมีศักยภาพ capital gain ดีในระยะยาว</p>
<h2>ย่านแนะนำในเชียงใหม่</h2>
<ul>
  <li><strong>นิมมานเหมินทร์</strong> — ย่าน trendy คาเฟ่ coworking คอนโด 1.5–4 ล้านบาท</li>
  <li><strong>เมืองเก่า</strong> — วัฒนธรรม บ้านเก่า อิงอารมณ์ ราคาแผ่นดินสูง</li>
  <li><strong>หางดง-สันกำแพง</strong> — บ้านเดี่ยวโครงการใหม่ ราคา 2–6 ล้านบาท</li>
  <li><strong>ดอยสุเทพ-ดอยอินทนนท์</strong> — วิลล่าบนดอย อากาศเย็นตลอดปี</li>
</ul>
<p><a href="https://www.fazwaz.com/property-for-sale/thailand/chiang-mai" target="_blank" rel="noopener sponsored" style="display:inline-block;background:linear-gradient(135deg,#b50062,#7f45a1);color:#fff;padding:12px 24px;border-radius:50px;font-weight:700;text-decoration:none;margin:8px 0;">ดูอสังหาริมทรัพย์ในเชียงใหม่ →</a></p>`,
  },
  {
    slug: "real-estate-pattaya",
    name: "อสังหาริมทรัพย์พัทยา — ตลาดคอนโดใหญ่อันดับ 2 ของไทย",
    excerpt: "พัทยามีคอนโดให้เลือกมากที่สุดในไทยรองจากกรุงเทพฯ ด้วยราคาเข้าถึงได้และ yield จากการเช่าระยะสั้นที่น่าสนใจ",
    coverImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
    tags: "real-estate,pattaya,property,condo,invest",
    city: "Pattaya", cityTh: "พัทยา", fazwazSlug: "pattaya",
    content: `<p>พัทยาเป็นตลาดคอนโดที่ใหญ่เป็นอันดับสองของประเทศไทย รองจากกรุงเทพฯ โดยมีโครงการแล้วเสร็จและกำลังสร้างกว่า 50,000 ยูนิตในปัจจุบัน</p>
<h2>ราคาคอนโดในพัทยา</h2>
<ul>
  <li>คอนโดระดับกลาง: 1.5–4 ล้านบาท</li>
  <li>คอนโดริมหาด: 3–10 ล้านบาท</li>
  <li>คอนโด luxury: 8–30 ล้านบาทขึ้นไป</li>
</ul>
<h2>ทำเลแนะนำ</h2>
<p><strong>จอมเทียน</strong> — หาดสวย เงียบกว่าพัทยากลาง เหมาะสำหรับผู้เกษียณ</p>
<p><strong>พัทยาเหนือ</strong> — ย่านใหม่ โครงการ luxury กำลังขยายตัว</p>
<p><strong>วงศ์อมาตย์</strong> — พื้นที่พรีเมียมสุดของพัทยา วิลล่าและคอนโดระดับสูง</p>
<p><a href="https://www.fazwaz.com/property-for-sale/thailand/pattaya" target="_blank" rel="noopener sponsored" style="display:inline-block;background:linear-gradient(135deg,#b50062,#7f45a1);color:#fff;padding:12px 24px;border-radius:50px;font-weight:700;text-decoration:none;margin:8px 0;">ดูอสังหาริมทรัพย์ในพัทยา →</a></p>`,
  },
  {
    slug: "real-estate-chonburi",
    name: "อสังหาริมทรัพย์ชลบุรี — EEC Hub ที่ดินทองแดงแห่งอนาคต",
    excerpt: "ชลบุรีอยู่ในโซน EEC (Eastern Economic Corridor) ราคาที่ดินพุ่งต่อเนื่อง เหมาะสำหรับนักลงทุนระยะยาวที่มองหา capital gain",
    coverImage: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=1200&q=80",
    tags: "real-estate,chonburi,eec,property,invest",
    city: "Chonburi", cityTh: "ชลบุรี", fazwazSlug: "chonburi",
    content: `<p>จังหวัดชลบุรีเป็นจุดยุทธศาสตร์ของโครงการ EEC (เขตพัฒนาพิเศษภาคตะวันออก) รัฐบาลลงทุนโครงสร้างพื้นฐานมหาศาล ทำให้ราคาอสังหาฯ ปรับขึ้นต่อเนื่อง</p>
<h2>ทำไมต้องลงทุนชลบุรี?</h2>
<ul>
  <li>โครงการ High-Speed Rail เชื่อม 3 สนามบิน (ดอนเมือง-สุวรรณภูมิ-อู่ตะเภา)</li>
  <li>นิคมอุตสาหกรรม 5G และ Digital Park Thailand</li>
  <li>ท่าเรือแหลมฉบัง ขยายระยะที่ 3 แล้วเสร็จ</li>
  <li>ราคาที่ดินยังต่ำกว่าพัทยา 30–50%</li>
</ul>
<h2>พื้นที่แนะนำในชลบุรี</h2>
<p>ศรีราชา, แหลมฉบัง, บ้านบึง — ย่านอุตสาหกรรมและที่อยู่อาศัยสำหรับ expat ที่ทำงานในนิคม</p>
<p><a href="https://www.fazwaz.com/property-for-sale/thailand/chonburi" target="_blank" rel="noopener sponsored" style="display:inline-block;background:linear-gradient(135deg,#b50062,#7f45a1);color:#fff;padding:12px 24px;border-radius:50px;font-weight:700;text-decoration:none;margin:8px 0;">ดูอสังหาริมทรัพย์ในชลบุรี →</a></p>`,
  },
];

async function main() {
  for (const c of cities) {
    const result = await prisma.place.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name, excerpt: c.excerpt, content: c.content,
        coverImage: c.coverImage, tags: c.tags,
        type: "BLOG", category: "real-estate", status: "published",
        publishedAt: new Date("2025-06-20"),
      },
      create: {
        name: c.name, slug: c.slug, excerpt: c.excerpt, content: c.content,
        coverImage: c.coverImage, tags: c.tags,
        type: "BLOG", category: "real-estate", status: "published",
        publishedAt: new Date("2025-06-20"),
      },
    });
    console.log(`✓ ${result.name.slice(0, 50)}...`);
  }
  console.log(`\nDone — ${cities.length} real estate posts created.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
