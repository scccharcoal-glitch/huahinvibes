"""
ดึงข้อมูล photo / editorial_summary / reviews จาก Google Places API
สำหรับ 80 ร้านส้มตำ/อีสาน ที่ import มาจาก Excel

วิธีใช้:
  export GOOGLE_MAPS_API_KEY="AIza..."
  python3 prisma/enrich-somtam.py

ผลลัพธ์: prisma/somtam-enriched.json
จากนั้นรัน: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/update-enriched.ts
"""

import os, re, json, time
import requests

EXCEL_PATH = os.path.join(os.path.dirname(__file__), "../../../Me/huahinvibes/Som_Tam_&_Isaan_food_20260611_053951.xlsx")
OUT_PATH   = os.path.join(os.path.dirname(__file__), "somtam-enriched.json")
API_KEY    = os.environ.get("GOOGLE_MAPS_API_KEY", "")

if not API_KEY:
    raise SystemExit("❌  กรุณา export GOOGLE_MAPS_API_KEY ก่อนรัน script")

try:
    import openpyxl
except ImportError:
    raise SystemExit("❌  pip install openpyxl")

# ---------------------------------------------------------------------------
# 1. อ่าน Excel — ดึง (name, place_id)
# ---------------------------------------------------------------------------
wb = openpyxl.load_workbook(EXCEL_PATH)
ws = wb.active

rows = []
for i, row in enumerate(ws.iter_rows(values_only=True)):
    if i == 0:
        continue
    name     = row[0]
    gmaps_url = str(row[9]) if row[9] else ""
    m = re.search(r'!19s([A-Za-z0-9_-]+)', gmaps_url)
    if not m:
        print(f"  [skip row {i+1}] ไม่พบ Place ID: {name}")
        continue
    rows.append({"name": name, "place_id": m.group(1)})

print(f"✓ โหลด {len(rows)} รายการจาก Excel")

# ---------------------------------------------------------------------------
# 2. เรียก Places Details API
# ---------------------------------------------------------------------------
FIELDS = "photos,editorial_summary,reviews,rating,user_ratings_total"

def places_details(place_id: str) -> dict:
    params = {
        "place_id": place_id,
        "fields":   FIELDS,
        "language": "th",
        "reviews_sort": "most_relevant",
        "key":      API_KEY,
    }
    r = requests.get(
        "https://maps.googleapis.com/maps/api/place/details/json",
        params=params, timeout=15
    )
    r.raise_for_status()
    return r.json()

def photo_direct_url(photo_ref: str, max_width: int = 800) -> str:
    """ติดตาม redirect ของ Places Photo API → ได้ lh3.googleusercontent.com URL"""
    params = {"photoreference": photo_ref, "maxwidth": max_width, "key": API_KEY}
    r = requests.get(
        "https://maps.googleapis.com/maps/api/place/photo",
        params=params, timeout=15, allow_redirects=True
    )
    # requests ติดตาม redirect อัตโนมัติ — คืน URL สุดท้าย
    return r.url

# ---------------------------------------------------------------------------
# 3. วน loop ดึงข้อมูล
# ---------------------------------------------------------------------------
enriched = []

for idx, item in enumerate(rows):
    name     = item["name"]
    place_id = item["place_id"]
    print(f"  [{idx+1}/{len(rows)}] {name}  ({place_id})")

    try:
        data   = places_details(place_id)
        result = data.get("result", {})
        status = data.get("status", "")

        if status != "OK":
            print(f"    ⚠️  status={status}, ข้ามไป")
            enriched.append({"place_id": place_id, "name": name, "error": status})
            time.sleep(0.3)
            continue

        # --- cover image ---
        cover_image = None
        photos = result.get("photos", [])
        if photos:
            ref = photos[0]["photo_reference"]
            cover_image = photo_direct_url(ref, max_width=800)

        # --- description ---
        description = result.get("editorial_summary", {}).get("overview") or None

        # --- reviews (เอา text ไม่เกิน 5 ข้อ) ---
        reviews_raw = result.get("reviews", [])
        reviews_json = [
            r.get("text", "").strip()
            for r in reviews_raw[:5]
            if r.get("text", "").strip()
        ]

        # --- rating & reviewCount ---
        rating       = result.get("rating")
        review_count = result.get("user_ratings_total")

        enriched.append({
            "place_id":     place_id,
            "name":         name,
            "coverImage":   cover_image,
            "description":  description,
            "reviewsJson":  json.dumps(reviews_json, ensure_ascii=False) if reviews_json else None,
            "rating":       rating,
            "reviewCount":  review_count,
        })

        has = []
        if cover_image:   has.append("📸 รูป")
        if description:   has.append("📝 desc")
        if reviews_json:  has.append(f"💬 {len(reviews_json)} รีวิว")
        if rating:        has.append(f"⭐ {rating}")
        print(f"    ✓  {' · '.join(has) or '(ไม่มีข้อมูล)'}")

    except Exception as e:
        print(f"    ❌  {e}")
        enriched.append({"place_id": place_id, "name": name, "error": str(e)})

    time.sleep(0.25)   # ไม่ให้เกิน rate-limit

# ---------------------------------------------------------------------------
# 4. บันทึก JSON
# ---------------------------------------------------------------------------
with open(OUT_PATH, "w", encoding="utf-8") as f:
    json.dump(enriched, f, ensure_ascii=False, indent=2)

ok    = sum(1 for e in enriched if "error" not in e)
error = len(enriched) - ok
print(f"\n✅  เสร็จ: {ok} รายการสำเร็จ, {error} รายการ error")
print(f"   ไฟล์: {OUT_PATH}")
print(f"\nขั้นตอนต่อไป:")
print(f"  npx ts-node --compiler-options '{{\"module\":\"CommonJS\"}}' prisma/update-enriched.ts")
