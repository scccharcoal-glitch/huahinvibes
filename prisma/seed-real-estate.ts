import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const cities = [
  {
    slug: "real-estate-hua-hin",
    name: "Hua Hin Real Estate Guide — Beach Condos, Pool Villas and Retirement Homes",
    excerpt: "Hua Hin is one of Thailand's most popular coastal property markets, offering beach living, strong lifestyle appeal, Bangkok access, and long-term residential demand.",
    coverImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
    tags: "real-estate,hua-hin,property,invest",
    city: "Hua Hin", cityTh: "หัวหิน", fazwazSlug: "hua-hin",
    content: `<p>Hua Hin is one of Thailand's most established coastal property markets, combining beach-town charm with practical everyday services. It is popular with Thai buyers, expats, retirees, remote workers, and Bangkok residents looking for a second home by the sea.</p>
<h2>Why Buy Property in Hua Hin?</h2>
<ul>
  <li><strong>Established coastal market:</strong> Hua Hin has a long track record as a trusted beach destination, which helps support both lifestyle demand and resale confidence.</li>
  <li><strong>Close to Bangkok:</strong> The city is reachable by road and rail, making it practical for weekend homes, retirement plans, and hybrid work lifestyles.</li>
  <li><strong>Strong lifestyle infrastructure:</strong> Hospitals, shopping malls, international schools, golf courses, restaurants, beach clubs, and local markets make daily living convenient.</li>
  <li><strong>Wide property choice:</strong> Buyers can choose from beachfront condos, pool villas, gated communities, land plots, and luxury sea-view homes.</li>
</ul>
<h2>What Makes Hua Hin a Good Place to Live?</h2>
<p>Hua Hin is quieter than Bangkok and less hectic than many island destinations, but it still has enough infrastructure for comfortable year-round living. Residents can enjoy morning beach walks, international dining, golf, fitness clubs, fresh markets, hospitals, and easy day trips along the Gulf Coast.</p>
<p>For retirees and families, Hua Hin offers a balanced lifestyle: coastal calm, reliable services, and an active international community. For Bangkok-based buyers, it works well as a weekend home or future retirement base without feeling isolated.</p>
<h2>Best Areas to Consider in Hua Hin</h2>
<ul>
  <li><strong>Central Hua Hin:</strong> Best for convenience, restaurants, shopping, beach access, and short-term rental appeal.</li>
  <li><strong>Khao Takiab:</strong> Popular for condos, sea views, cafes, and a more relaxed beach neighborhood feel.</li>
  <li><strong>Hua Hin West and bypass areas:</strong> Good for pool villas, gated communities, larger homes, and better land value.</li>
  <li><strong>Black Mountain and golf zones:</strong> Attractive for buyers who want space, views, golf access, and quiet residential living.</li>
</ul>
<h2>Best Property Types in Hua Hin</h2>
<ul>
  <li><strong>Beach condos:</strong> Easy to maintain and popular with weekend buyers and rental-focused investors.</li>
  <li><strong>Pool villas:</strong> A strong choice for families, retirees, and buyers who want privacy and outdoor living.</li>
  <li><strong>Luxury villas:</strong> Best suited to buyers looking for larger plots, mountain views, sea views, or premium lifestyle homes.</li>
  <li><strong>Land plots:</strong> Useful for custom homes and long-term development in expanding residential areas.</li>
</ul>
<h2>Key Highlights of Hua Hin</h2>
<p>Hua Hin Beach, Khao Takiab, Cicada Market, Bluport, Market Village, golf courses, international restaurants, hospitals, and easy Bangkok access are the main reasons buyers continue to choose Hua Hin. It is one of Thailand's strongest lifestyle property markets for people who want comfort, convenience, and a coastal setting.</p>
<p><a href="/real-estate" style="display:inline-block;background:linear-gradient(135deg,#b50062,#7f45a1);color:#fff;padding:12px 24px;border-radius:50px;font-weight:700;text-decoration:none;margin:8px 0;">View Hua Hin properties for sale →</a></p>`,
  },
  {
    slug: "real-estate-cha-am",
    name: "Cha-Am Real Estate Guide — Beach Condos, Homes and Land Near Hua Hin",
    excerpt: "Cha-Am offers relaxed beach living, better-value property prices, and long-term growth potential between Bangkok and Hua Hin.",
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    tags: "real-estate,cha-am,property,invest",
    city: "Cha-Am", cityTh: "ชะอำ", fazwazSlug: "cha-am",
    content: `<p>Cha-Am is a relaxed beach town located between Bangkok and Hua Hin, known for its long coastline, family-friendly atmosphere, and more accessible property prices compared with the busiest parts of Hua Hin.</p>
<h2>Why Buy Property in Cha-Am?</h2>
<ul>
  <li><strong>Good value near the beach:</strong> Cha-Am often offers more space and lower entry prices than prime Hua Hin beach locations.</li>
  <li><strong>Easy weekend access:</strong> The town is convenient for Bangkok buyers who want a second home or weekend escape by the sea.</li>
  <li><strong>Long coastline:</strong> Cha-Am has wide beaches, beachfront condos, family resorts, seafood restaurants, and quiet residential pockets.</li>
  <li><strong>Growth potential:</strong> As the Bangkok-Hua Hin corridor improves, Cha-Am is well positioned for long-term property interest.</li>
</ul>
<h2>What Makes Cha-Am a Good Place to Live?</h2>
<p>Cha-Am is ideal for people who want a slower seaside lifestyle without being too far from city convenience. It is quieter than central Hua Hin, but residents can still reach Hua Hin's hospitals, shopping centers, golf courses, restaurants, and international services within a short drive.</p>
<p>For families, retirees, remote workers, and weekend-home buyers, Cha-Am offers an easy rhythm: morning beach walks, local seafood, calm neighborhoods, and enough everyday services for comfortable long-term living.</p>
<h2>Best Property Types in Cha-Am</h2>
<ul>
  <li><strong>Beachfront condos:</strong> Popular for weekend stays, rental potential, and easy lock-and-leave ownership.</li>
  <li><strong>Pool villas:</strong> A good fit for families or retirees who want privacy and outdoor living.</li>
  <li><strong>Land plots:</strong> Interesting for custom homes, boutique villas, or long-term development opportunities.</li>
  <li><strong>Affordable houses:</strong> Useful for buyers who want more space than a condo at a lower budget than central Hua Hin.</li>
</ul>
<h2>Key Highlights of Cha-Am</h2>
<p>Cha-Am Beach, seafood restaurants, family resorts, easy road access from Bangkok, and proximity to Hua Hin make Cha-Am one of the most practical coastal property markets in the region. It is a strong choice for buyers who want beach access, everyday comfort, and value for money.</p>
<p><a href="/real-estate" style="display:inline-block;background:linear-gradient(135deg,#b50062,#7f45a1);color:#fff;padding:12px 24px;border-radius:50px;font-weight:700;text-decoration:none;margin:8px 0;">View Cha-Am properties for sale →</a></p>`,
  },
  {
    slug: "real-estate-pranburi",
    name: "Pranburi Real Estate Guide — Peaceful Beach Homes Near Hua Hin",
    excerpt: "Pranburi is a quiet coastal alternative to Hua Hin, ideal for buyers who want nature, privacy, beach access, and a slower lifestyle within reach of Bangkok.",
    coverImage: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&q=80",
    tags: "real-estate,pranburi,property,invest",
    city: "Pranburi", cityTh: "ปราณบุรี", fazwazSlug: "pranburi",
    content: `<p>Pranburi sits just south of Hua Hin and offers a calmer, more nature-focused lifestyle than the busier resort towns nearby. It is known for quiet beaches, mountain views, mangrove forests, local seafood communities, and a more relaxed pace of living.</p>
<h2>Why Buy Property in Pranburi?</h2>
<ul>
  <li><strong>Peace and privacy:</strong> Pranburi is less crowded than central Hua Hin, making it attractive for buyers who want space, calm surroundings, and a more private home environment.</li>
  <li><strong>Nature-led lifestyle:</strong> Beaches, mangroves, mountains, and Sam Roi Yot National Park are all close by, giving residents easy access to outdoor living.</li>
  <li><strong>Better value than prime Hua Hin:</strong> Property prices can be more approachable than the most central Hua Hin beach zones, especially for villas, land, and larger homes.</li>
  <li><strong>Long-term potential:</strong> As buyers look beyond crowded resort areas, Pranburi has room to grow while still keeping its quiet coastal identity.</li>
</ul>
<h2>What Makes Pranburi a Good Place to Live?</h2>
<p>Living in Pranburi suits people who prefer slower days, open space, and a stronger connection to nature. It is close enough to Hua Hin for hospitals, shopping, restaurants, golf, and international-standard services, but far enough away to feel more peaceful.</p>
<p>For retirees, remote workers, families, and second-home buyers, Pranburi can offer a balanced lifestyle: quiet beaches in the morning, local seafood markets, cycling routes, national parks, and weekend access to Hua Hin without living in the middle of the busiest areas.</p>
<h2>Best Property Types in Pranburi</h2>
<ul>
  <li><strong>Pool villas:</strong> Popular with lifestyle buyers who want privacy, outdoor space, and a holiday-home feel.</li>
  <li><strong>Beach-area homes:</strong> Attractive for buyers who want easy access to the coast without the density of central resort zones.</li>
  <li><strong>Land plots:</strong> Interesting for long-term buyers who want to build custom homes or boutique hospitality projects.</li>
  <li><strong>Retirement homes:</strong> A strong fit for people who value calm neighborhoods, nature, and proximity to Hua Hin services.</li>
</ul>
<h2>Key Highlights of Pranburi</h2>
<p>Pranburi Beach, Pak Nam Pran, the mangrove forest, Khao Kalok, and Sam Roi Yot National Park are the major lifestyle anchors. Together they make Pranburi one of the best choices near Hua Hin for buyers who want natural surroundings and a quieter coastal community.</p>
<p><a href="/real-estate" style="display:inline-block;background:linear-gradient(135deg,#b50062,#7f45a1);color:#fff;padding:12px 24px;border-radius:50px;font-weight:700;text-decoration:none;margin:8px 0;">View Pranburi properties for sale →</a></p>`,
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
    name: "Pattaya Real Estate Guide — Beach Condos, Investment Homes and City Living",
    excerpt: "Pattaya is one of Thailand's most active coastal property markets, offering affordable condos, rental demand, beach lifestyle, and easy access from Bangkok.",
    coverImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
    tags: "real-estate,pattaya,property,condo,invest",
    city: "Pattaya", cityTh: "พัทยา", fazwazSlug: "pattaya",
    content: `<p>Pattaya is one of Thailand's largest and most active coastal property markets, with a deep condo supply, strong tourism demand, international residents, and improving transport links to Bangkok and the Eastern Economic Corridor.</p>
<h2>Why Buy Property in Pattaya?</h2>
<ul>
  <li><strong>Large condo market:</strong> Pattaya has one of the widest selections of condos in Thailand, from affordable studios to luxury beachfront residences.</li>
  <li><strong>Strong rental appeal:</strong> Tourism, expats, digital nomads, retirees, and EEC professionals create demand for both short-stay and long-stay rentals.</li>
  <li><strong>Easy Bangkok access:</strong> Pattaya is reachable from Bangkok by road and is supported by nearby U-Tapao Airport and regional infrastructure upgrades.</li>
  <li><strong>Good entry prices:</strong> Compared with prime Bangkok or Phuket, Pattaya can offer lower entry points for buyers who want coastal property.</li>
</ul>
<h2>What Makes Pattaya a Good Place to Live?</h2>
<p>Pattaya offers a more urban coastal lifestyle than many Thai beach towns. Residents have access to international restaurants, shopping malls, hospitals, marinas, golf courses, beach clubs, fitness centers, and nightlife, while still being close enough to Bangkok for weekend travel.</p>
<p>For retirees, remote workers, investors, and second-home buyers, Pattaya is practical because it combines everyday convenience with beach access. It is busier than Hua Hin or Pranburi, but that activity also supports services, transport, entertainment, and rental demand.</p>
<h2>Best Areas to Consider in Pattaya</h2>
<ul>
  <li><strong>Jomtien:</strong> Popular for beach condos, a calmer atmosphere, family living, and long-stay rentals.</li>
  <li><strong>Wong Amat:</strong> One of Pattaya's premium coastal zones, known for high-end condos and quieter beachfront living.</li>
  <li><strong>Central Pattaya:</strong> Best for nightlife, shopping, restaurants, and high convenience, especially for short-stay demand.</li>
  <li><strong>Pratumnak:</strong> A balanced hillside area between Pattaya and Jomtien, popular with expats and condo buyers.</li>
</ul>
<h2>Best Property Types in Pattaya</h2>
<ul>
  <li><strong>Affordable condos:</strong> Good for first-time investors and buyers seeking lower entry prices.</li>
  <li><strong>Beachfront condos:</strong> Attractive for lifestyle buyers and rental-focused investors.</li>
  <li><strong>Pool villas:</strong> Popular with families, retirees, and buyers who want privacy and space.</li>
  <li><strong>Luxury residences:</strong> Best in premium areas such as Wong Amat, Pratumnak, and select beachfront projects.</li>
</ul>
<h2>Key Highlights of Pattaya</h2>
<p>Pattaya Beach, Jomtien Beach, Terminal 21, Central Pattaya, marinas, golf courses, international hospitals, and the Eastern Economic Corridor make Pattaya one of Thailand's most dynamic property markets. It is a strong choice for buyers who want coastal living with city-level convenience.</p>
<p><a href="/real-estate" style="display:inline-block;background:linear-gradient(135deg,#b50062,#7f45a1);color:#fff;padding:12px 24px;border-radius:50px;font-weight:700;text-decoration:none;margin:8px 0;">View Pattaya properties for sale →</a></p>`,
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
