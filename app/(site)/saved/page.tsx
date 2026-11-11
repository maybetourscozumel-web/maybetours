"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useFavorites } from "@/lib/hooks/useFavorites";
import TourCard from "@/components/site/TourCard";
import type { TourWithParsedFields } from "@/lib/tour-helpers";

export default function SavedToursPage() {
  const { saved, hydrated } = useFavorites();
  const [tours, setTours] = useState<TourWithParsedFields[] | null>(null);

  useEffect(() => {
    fetch("/api/tours")
      .then((res) => res.json())
      .then((data: { tours: TourWithParsedFields[] }) => setTours(data.tours))
      .catch(() => setTours([]));
  }, []);

  const savedTours = tours?.filter((t) => saved.includes(t.slug)) ?? [];
  const loading = !hydrated || tours === null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 flex items-center gap-3">
        <Heart className="fill-brand-red text-brand-red h-7 w-7" />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Saved Tours</h1>
          <p className="mt-1 text-white/60">Tours you&apos;ve bookmarked to compare or book later.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : savedTours.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 py-20 text-center flex flex-col items-center gap-4">
          <Heart className="h-10 w-10 text-white/20" />
          <div>
            <p className="font-bold text-white">No saved tours yet</p>
            <p className="mt-1 text-sm text-white/50">
              Tap the heart on any tour to save it here for later.
            </p>
          </div>
          <Link
            href="/tours"
            className="mt-2 inline-flex items-center gap-1 rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-red/90"
          >
            Browse Tours <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {savedTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      )}
    </section>
  );
}
