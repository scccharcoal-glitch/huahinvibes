-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "content" TEXT,
    "excerpt" TEXT,
    "address" TEXT,
    "area" TEXT,
    "lat" REAL,
    "lng" REAL,
    "googlePlaceId" TEXT,
    "cuisine" TEXT,
    "priceRange" TEXT,
    "openingHours" TEXT,
    "hotelType" TEXT,
    "starRating" INTEGER,
    "category" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "email" TEXT,
    "bookingUrl" TEXT,
    "coverImage" TEXT,
    "images" TEXT,
    "seoTitle" TEXT,
    "seoDesc" TEXT,
    "tags" TEXT,
    "rating" REAL DEFAULT 0,
    "reviewCount" INTEGER DEFAULT 0,
    "viewCount" INTEGER DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Place_slug_key" ON "Place"("slug");

-- CreateIndex
CREATE INDEX "Place_type_status_idx" ON "Place"("type", "status");

-- CreateIndex
CREATE INDEX "Place_area_idx" ON "Place"("area");

-- CreateIndex
CREATE INDEX "Place_slug_idx" ON "Place"("slug");
