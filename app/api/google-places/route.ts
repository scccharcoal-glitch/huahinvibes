import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const placeId = req.nextUrl.searchParams.get("placeId");

  if (!placeId) {
    return NextResponse.json({ error: "placeId is required" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    // Return mock data when API key is not set
    return NextResponse.json({
      name: "Place from Google Maps",
      address: "Hua Hin, Prachuap Khiri Khan 77110",
      phone: "032-000-000",
      website: null,
      lat: 12.5706,
      lng: 99.9576,
      rating: 4.5,
      reviewCount: 100,
      openingHours: "09:00–21:00",
      _note: "This is mock data. Set GOOGLE_MAPS_API_KEY in .env to fetch real data.",
    });
  }

  try {
    const fields = "name,formatted_address,formatted_phone_number,website,geometry,rating,user_ratings_total,opening_hours";
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    if (data.status !== "OK") {
      return NextResponse.json({ error: data.status }, { status: 400 });
    }

    const r = data.result;
    return NextResponse.json({
      name: r.name,
      address: r.formatted_address,
      phone: r.formatted_phone_number,
      website: r.website,
      lat: r.geometry?.location?.lat,
      lng: r.geometry?.location?.lng,
      rating: r.rating,
      reviewCount: r.user_ratings_total,
      openingHours: r.opening_hours?.weekday_text?.join(", "),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch from Google Maps" }, { status: 500 });
  }
}
