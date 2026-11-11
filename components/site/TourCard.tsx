"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Clock, Users } from "lucide-react";
import { formatMXN, formatDuration, cn } from "@/lib/utils";
import { CATEGORY_LABELS, type TourWithParsedFields } from "@/lib/tour-helpers";
import { useFavorites } from "@/lib/hooks/useFavorites";

const CATEGORY_GRADIENTS: Record<string, string> = {
  SNORKELING: "from-brand-ocean to-brand-navy",
  DIVING: "from-brand-navy to-black",
  WATERSPORT: "from-brand-yellow to-brand-red",
  PRIVATE: "from-brand-red to-brand-navy",
};

const TILT_MAX_DEG = 7;

export default function TourCard({ tour }: { tour: TourWithParsedFields }) {
  const { isSaved, toggle, hydrated } = useFavorites();
  const saved = hydrated && isSaved(tour.slug);
  const cardRef = useRef<HTMLAnchorElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * TILT_MAX_DEG).toFixed(2)}deg) rotateY(${(px * TILT_MAX_DEG).toFixed(2)}deg) translateY(-4px)`;
  }

  function handleMouseLeave() {
    const el = cardRef.current;
    if (el) el.style.transform = "";
  }

  return (
    <Link
      ref={cardRef}
      href={`/tours/${tour.slug}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group border-border-soft bg-surface flex flex-col overflow-hidden rounded-2xl border shadow-sm [transition:transform_0.15s_ease-out,box-shadow_0.3s_ease] hover:shadow-xl hover:shadow-black/30"
    >
      <div
        className={cn(
          "relative flex h-44 items-end overflow-hidden bg-gradient-to-br p-4",
          CATEGORY_GRADIENTS[tour.category] ?? "from-brand-ocean to-brand-navy"
        )}
      >
        {tour.heroImage && (
          <>
            <Image
              src={tour.heroImage}
              alt={tour.name}
              fill
              sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          </>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-brand-navy">
          {CATEGORY_LABELS[tour.category] ?? tour.category}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle(tour.slug);
          }}
          aria-label={saved ? "Remove from saved tours" : "Save this tour"}
          aria-pressed={saved}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-sm transition hover:scale-110 hover:bg-white"
        >
          <Heart className={cn("h-4 w-4", saved && "fill-brand-red text-brand-red")} />
        </button>
        {tour.isPrivate && (
          <span className="absolute right-4 top-14 rounded-full bg-brand-yellow px-3 py-1 text-xs font-bold text-brand-navy">
            Private
          </span>
        )}
        <h3 className="text-xl font-extrabold leading-tight text-white drop-shadow-sm">
          {tour.name}
        </h3>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="line-clamp-2 text-sm text-white/60">{tour.shortDescription}</p>

        <div className="border-border-soft mt-auto flex items-end justify-between border-t pt-3">
          <div className="flex flex-col gap-1.5 text-xs font-medium text-white/60">
            <span className="flex items-center gap-1.5">
              <Clock className="text-brand-ocean h-3.5 w-3.5 shrink-0" />
              {formatDuration(tour.durationMinutes)}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="text-brand-ocean h-3.5 w-3.5 shrink-0" />
              Up to {tour.maxGroupSize} people
            </span>
          </div>
          <div className="text-right">
            <p className="text-brand-yellow text-lg font-extrabold">
              {formatMXN(tour.priceMXN)}
            </p>
            <p className="text-xs text-white/50">
              {tour.priceType === "PER_PERSON" ? "per person" : "per boat"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
