"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Loader2 } from "lucide-react";
import { AREAS } from "@/lib/places";

interface Props {
  cuisine: string;
  currentArea: string;
}

function getNearestArea(lat: number, lng: number) {
  let nearest = AREAS[0];
  let minDist = Infinity;
  for (const area of AREAS) {
    const d = Math.sqrt(Math.pow(area.lat - lat, 2) + Math.pow(area.lng - lng, 2));
    if (d < minDist) { minDist = d; nearest = area; }
  }
  return nearest;
}

export default function NearMeRedirect({ cuisine, currentArea }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [found, setFound]   = useState("");

  function handleNearMe() {
    setError("");
    setLoading(true);

    if (!navigator.geolocation) {
      setError("เบราว์เซอร์นี้ไม่รองรับ GPS");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const nearest = getNearestArea(latitude, longitude);
        setLoading(false);

        if (nearest.value === currentArea) {
          setFound(`คุณอยู่ใกล้ ${nearest.label} อยู่แล้ว ✓`);
          return;
        }

        setFound(`กำลังพาไป ${nearest.label}…`);
        router.push(`/restaurants/${cuisine}/${nearest.value}`);
      },
      () => {
        setLoading(false);
        setError("ไม่สามารถดึง GPS ได้ กรุณาอนุญาตให้เข้าถึงตำแหน่ง");
      },
      { timeout: 8000 }
    );
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        onClick={handleNearMe}
        disabled={loading}
        className="flex items-center gap-2 border-2 border-secondary text-secondary px-4 py-2 rounded-full text-sm font-bold hover:bg-secondary hover:text-white transition-all disabled:opacity-60"
      >
        {loading
          ? <><Loader2 className="w-4 h-4 animate-spin" /> กำลังค้นหา…</>
          : <><MapPin className="w-4 h-4" /> ใกล้ฉัน</>
        }
      </button>

      {found && (
        <span className="text-sm text-green-600 font-medium flex items-center gap-1">
          📍 {found}
        </span>
      )}
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
}
