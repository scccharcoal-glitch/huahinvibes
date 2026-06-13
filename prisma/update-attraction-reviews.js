const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const REVIEWS = {
  "Hua Hin Night Market": [
    "A vibrant night market full of life — street food, grilled meats, fresh seafood, and handmade souvenirs all in one place. A must-visit every evening.",
    "The atmosphere here after dark is electric. Grab a fresh coconut, browse the stalls, and enjoy some of the best street food in Hua Hin.",
    "Perfect for an evening stroll. The variety of food is incredible — from pad thai to rotis to grilled corn. Very affordable and very fun.",
    "One of Hua Hin's great traditions. Locals and tourists mix happily, the smells are wonderful, and the prices are very reasonable.",
    "Don't miss the seafood skewers and mango sticky rice. The market runs until late and the energy never drops. Highly recommended.",
  ],
  "Khao Takiab Temple (Monkey Mountain)": [
    "An unforgettable experience — climb the hill, visit the temple, and be greeted by hundreds of friendly monkeys. The sea views from the top are spectacular.",
    "The temple on the hilltop is beautiful and the monkeys are a delight (just watch your snacks!). Sunrise here is absolutely stunning.",
    "One of the most iconic sights near Hua Hin. The hike is easy and the reward — panoramic views and a peaceful temple — is well worth it.",
    "Brilliant combination of nature, wildlife, and culture. The monkeys are bold but entertaining. Bring a banana and enjoy the show!",
    "A wonderful half-day outing from Hua Hin. The temple architecture is lovely and the views over the Gulf of Thailand are breathtaking.",
  ],
  "Pranburi Forest Park & Mangroves": [
    "A serene natural escape just south of Hua Hin. The mangrove boardwalk is magical at sunrise, and birdwatching here is exceptional.",
    "Beautifully preserved mangrove forest with well-maintained walking trails. Peaceful, green, and wonderfully different from the beach.",
    "A hidden gem near Hua Hin. The boardwalk winds through ancient mangroves and the silence is deeply restorative. Perfect for nature lovers.",
    "We spotted kingfishers, herons, and monitor lizards on our morning walk. The forest is pristine and the guides are very knowledgeable.",
    "A must for anyone who loves the natural world. The mangroves here are in excellent condition and the atmosphere is truly special.",
  ],
  "หาดหัวหิน": [
    "The iconic beach that put Hua Hin on the map. Long, wide, and clean with gentle waves — perfect for a lazy afternoon by the sea.",
    "Hua Hin Beach is everything you would want from a Thai beach: warm water, golden sand, and beautiful sunsets. A timeless classic.",
    "The beach is well-kept and there is plenty of space even in high season. Rent a deckchair, order a cold coconut, and relax.",
    "Wonderful for early morning walks when the light is soft and the beach is quiet. One of the most beautiful stretches of coast in Thailand.",
    "Great for families — the water is calm and shallow near the shore. Plenty of restaurants and cafes just steps from the sand.",
  ],
  "Wat Huay Mongkol Temple": [
    "Home to a gigantic statue of Luang Phor Thuad, one of Thailand's most revered monks. The scale is breathtaking and the spiritual atmosphere is profound.",
    "A deeply moving experience. The massive statue dominates the landscape and the surrounding temple complex is beautifully maintained.",
    "One of the most impressive Buddhist sites near Hua Hin. Pilgrims come from all over Thailand to pay their respects — truly humbling to witness.",
    "Worth every minute of the drive from Hua Hin. The golden statue against the blue sky is an extraordinary sight. Very peaceful and well-organized.",
    "A place of real spiritual significance. The temple grounds are lush and well-tended, and the giant statue is simply awe-inspiring.",
  ],
  "Pa La-U Waterfall": [
    "A stunning multi-tiered waterfall hidden deep in the jungle. The hike is refreshing and the pools at each level are perfect for a swim.",
    "One of western Thailand's most beautiful natural attractions. Crystal-clear water cascading through dense rainforest — absolutely magical.",
    "The drive through the jungle is half the adventure. The waterfall itself is magnificent, especially after the rainy season. Bring good shoes!",
    "We spent a whole morning exploring the different tiers. Butterflies everywhere, birdsong filling the air, and cool clean water to swim in.",
    "A world away from the beach crowds. Pa La-U is wild, beautiful, and wonderfully unspoiled. A genuine highlight of any Hua Hin trip.",
  ],
  "Hua Hin Artists Village": [
    "A charming creative enclave with galleries, open-air studios, and artisan workshops. A peaceful escape and a great place to find unique local art.",
    "Delightful afternoon spent browsing the galleries and watching artists at work. The garden cafe is lovely and the atmosphere is very relaxed.",
    "A hidden gem in Hua Hin. Original sculptures, paintings, and ceramics — all made by local artists. The perfect place to find a meaningful souvenir.",
    "We joined a pottery class and had a fantastic time. The teachers are passionate and patient. Highly recommended for a different kind of Hua Hin experience.",
    "Beautiful gardens, creative energy, and genuinely talented artists. A wonderful contrast to the busier parts of Hua Hin town.",
  ],
  "Hua Hin Temple (Wat Hua Hin)": [
    "A beautiful, peaceful temple right in the heart of Hua Hin town. Intricate architecture, golden Buddhas, and a wonderfully serene atmosphere.",
    "Well worth a visit even if you are only passing through. The temple is immaculately maintained and the monks are welcoming to respectful visitors.",
    "A lovely spot to pause and reflect during a busy day of sightseeing. The temple grounds are shaded and beautifully kept.",
    "One of the most attractive temples in Hua Hin — great photo opportunities and a real sense of spiritual calm throughout the complex.",
    "A genuine piece of local culture in a convenient central location. Dress respectfully and take your time exploring the different shrines.",
  ],
  "Maruekatayawan Palace": [
    "An extraordinary teak wood palace built on stilts over the sea. The golden-yellow buildings and sea breezes create an utterly unique atmosphere.",
    "One of Thailand's most distinctive royal residences. Walking through the elevated corridors with ocean views on both sides is truly magical.",
    "Beautifully restored and impeccably maintained. The palace tells a fascinating story of Thai royalty and early 20th-century craftsmanship.",
    "The architecture alone is worth the trip — hundreds of thousands of golden teak pillars, elegant pavilions, and stunning coastal views.",
    "A serene and photogenic slice of Thai history. Peaceful, uncrowded, and genuinely beautiful. One of our favourite stops near Hua Hin.",
  ],
  "Khao Hin Lek Fai Scenic Viewpoint": [
    "Spectacular 360-degree views over Hua Hin town and the Gulf of Thailand. Sunset here is absolutely breathtaking — arrive early for the best spot.",
    "A short but rewarding drive up the hill rewards you with panoramic views of the whole coastline. One of Hua Hin's best-kept secrets.",
    "The deer park at the top adds a charming touch. Kids love seeing the animals, and the views are genuinely spectacular at any time of day.",
    "Great place to orientate yourself when first arriving in Hua Hin. The elevated perspective gives you a wonderful sense of the whole area.",
    "Magical at golden hour. Pack a picnic, find a spot on the rocks, and watch the sun sink over the Gulf of Thailand. Unforgettable.",
  ],
};

async function main() {
  let updated = 0;
  for (const [name, reviews] of Object.entries(REVIEWS)) {
    const place = await prisma.place.findFirst({
      where: { type: "ATTRACTION", name },
    });
    if (!place) {
      console.log("  Not found:", name);
      continue;
    }
    await prisma.place.update({
      where: { id: place.id },
      data: { reviewsJson: JSON.stringify(reviews) },
    });
    console.log("  Added", reviews.length, "reviews ->", name);
    updated++;
  }
  console.log("\nTotal updated:", updated);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
