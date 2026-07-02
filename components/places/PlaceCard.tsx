import Link from "next/link";
import { Star, MapPin, Phone, Clock } from "lucide-react";
import { type Place } from "@prisma/client";
import { getPriceSymbol } from "@/lib/places";
import { getPlaceHref } from "@/lib/slug";
import SafeImage from "@/components/SafeImage";

function routeForPlace(place: Place): string {
  return getPlaceHref(place.slug);
}

function typeBadgeColor(type: string) {
  if (type === "RESTAURANT") return "bg-primary/90";
  if (type === "HOTEL") return "bg-secondary/90";
  if (type === "ATTRACTION") return "bg-amber-600/90";
  return "bg-gray-600/90";
}

export default function PlaceCard({ place }: { place: Place }) {
  const href = routeForPlace(place);
  const tags = place.tags?.split(",").filter(Boolean) ?? [];

  return (
    <article className="place-card group bg-card rounded-2xl overflow-hidden border border-border">
      <Link href={href}>
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-muted">
          {place.coverImage ? (
            <SafeImage
              src={place.coverImage}
              alt={place.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-accent text-muted-foreground text-sm">
              No image
            </div>
          )}
          {/* Badge */}
          <div className="absolute top-3 left-3">
            <span className={`${typeBadgeColor(place.type)} text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md`}>
              {tags[0] ?? place.type.toLowerCase()}
            </span>
          </div>
          {/* Rating */}
          {place.rating && place.rating > 0 && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-foreground">{place.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
            {place.name}
          </h3>

          {place.area && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              {place.address ?? place.area}
            </p>
          )}

          {place.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{place.description}</p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              {place.priceRange && (
                <span className="text-primary font-bold text-base">{getPriceSymbol(place.priceRange)}</span>
              )}
              {place.openingHours && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {place.openingHours}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {place.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {place.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
