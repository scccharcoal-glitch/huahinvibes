"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type PlacePin = {
  id: string;
  name: string;
  slug: string;
  lat: number;
  lng: number;
  rank: number;
  rating?: number | null;
};

function createNumberedIcon(rank: number) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:32px;height:32px;border-radius:50%;
      background:linear-gradient(135deg,#b50062,#7f45a1);
      color:#fff;font-weight:800;font-size:14px;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      border:2px solid #fff;
    ">${rank}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  });
}

function FitBounds({ places }: { places: PlacePin[] }) {
  const map = useMap();
  useEffect(() => {
    if (places.length === 0) return;
    if (places.length === 1) {
      map.setView([places[0].lat, places[0].lng], 14);
      return;
    }
    const bounds = L.latLngBounds(places.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, places]);
  return null;
}

export default function RankedPlacesMap({ places }: { places: PlacePin[] }) {
  if (places.length === 0) return null;

  const center: [number, number] = [places[0].lat, places[0].lng];

  return (
    <div className="w-full h-80 md:h-96 rounded-2xl overflow-hidden border border-border shadow-sm">
      <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds places={places} />
        {places.map((place) => (
          <Marker key={place.id} position={[place.lat, place.lng]} icon={createNumberedIcon(place.rank)}>
            <Popup>
              <div className="text-sm font-bold mb-0.5">#{place.rank} {place.name}</div>
              {place.rating && place.rating > 0 && (
                <div className="text-xs text-amber-600">⭐ {place.rating.toFixed(1)}</div>
              )}
              <a href={`/place/${place.slug}`} className="text-xs text-blue-600 underline mt-1 block">
                View Details →
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
