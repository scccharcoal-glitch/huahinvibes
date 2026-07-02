# Hua Hin Vibes

Next.js App Router project for a Hua Hin travel guide with restaurants, hotels, attractions, blog posts, admin-managed places, and Programmatic SEO landing pages.

## Local Development

```bash
npm install --legacy-peer-deps
npm run dev
```

Open `http://localhost:3000`.

For a production-like cache test:

```bash
npm run build
npm start
```

## Programmatic SEO

The generic long-tail landing page route is:

```text
app/[location]/[q]/page.tsx
```

Example URLs:

```text
/hua-hin/restaurants
/hua-hin/somtam
/khao-takiab/seafood
/cha-am/hotels
```

Important behavior:

- `params` is awaited before reading `location` and `q`.
- URL params are decoded with `decodeURIComponent`.
- `generateMetadata` creates SEO title and description dynamically.
- `generateStaticParams` pre-renders a limited number of location/query combinations.
- `revalidate = 86400` enables ISR every 24 hours.
- Result data is fetched through `getCachedData`, which wraps `searchData` with React `cache()`.

Data helpers live in:

```text
lib/places.ts
```

The pSEO page reads from the Prisma database. Google Places should be used to enrich/admin-import data into the database, not as a live fetch on every SEO page view.

## Sitemap

Dynamic sitemap is handled by:

```text
app/sitemap.ts
```

It includes:

- Static pages
- Restaurant pSEO pages
- Hotel pSEO pages
- Attraction pSEO pages
- Generic long-tail pages from `/[location]/[q]`
- Individual place pages
- Blog pages

After deployment, submit this URL in Google Search Console:

```text
https://yourdomain.com/sitemap.xml
```

## Environment Variables

Set these in local `.env` and in Vercel.

```text
DATABASE_URL=
DATABASE_URL_UNPOOLED=
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
GOOGLE_MAPS_API_KEY=
```

`NEXT_PUBLIC_BASE_URL` is required so the sitemap generates correct production URLs.

`GOOGLE_MAPS_API_KEY` is used by the admin Google Place ID auto-fill route:

```text
app/api/google-places/route.ts
```

## Agoda Hotel Import

Agoda partner hotel data can be imported into the `Place` table as hotel drafts.

1. Copy the example file:

```bash
cp prisma/agoda-hotels.example.json prisma/agoda-hotels.json
```

2. Paste the Agoda hotel export into `prisma/agoda-hotels.json`.

3. Run the database migration once so hotels can store `agodaHotelId`:

```bash
npm run db:migrate
```

4. Import or update hotels:

```bash
npm run import:agoda:hotels
```

The importer uses `agodaHotelId` to prevent duplicate hotels. New Agoda hotels are saved as drafts first so they can be checked in the admin before publishing.

## Vercel Notes

Recommended install command:

```bash
npm install --legacy-peer-deps
```

Make sure the Vercel project has:

- Correct production domain in `NEXT_PUBLIC_BASE_URL`
- Database connection variables
- Google Maps API key if using the admin auto-fill feature

## Useful Commands

```bash
npm run lint
npm run build
npm run start
npm run db:migrate
npm run seed
```
