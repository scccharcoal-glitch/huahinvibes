-- Add Agoda hotel ID for affiliate imports and deduplication.
ALTER TABLE "Place" ADD COLUMN "agodaHotelId" TEXT;

-- Optional unique index allows many non-Agoda places while preventing duplicate Agoda hotels.
CREATE UNIQUE INDEX "Place_agodaHotelId_key" ON "Place"("agodaHotelId");
