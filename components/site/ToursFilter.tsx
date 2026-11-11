"use client";

import { useMemo, useState } from "react";
import TourCard from "./TourCard";
import { CATEGORY_LABELS, type TourWithParsedFields } from "@/lib/tour-helpers";
import { cn } from "@/lib/utils";

const CATEGORY_ORDER = ["SNORKELING", "DIVING", "WATERSPORT", "PRIVATE"];

export default function ToursFilter({ tours }: { tours: TourWithParsedFields[] }) {
  const [active, setActive] = useState<string>("ALL");

  const availableCategories = useMemo(
    () => CATEGORY_ORDER.filter((cat) => tours.some((t) => t.category === cat)),
    [tours]
  );

  const filtered = active === "ALL" ? tours : tours.filter((t) => t.category === active);

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        <FilterChip
          label={`All tours (${tours.length})`}
          active={active === "ALL"}
          onClick={() => setActive("ALL")}
        />
        {availableCategories.map((cat) => {
          const count = tours.filter((t) => t.category === cat).length;
          return (
            <FilterChip
              key={cat}
              label={`${CATEGORY_LABELS[cat] ?? cat} (${count})`}
              active={active === cat}
              onClick={() => setActive(cat)}
            />
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-white/50">
          No tours in this category right now.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      )}
    </>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-semibold transition",
        active
          ? "bg-brand-red text-white"
          : "bg-white/10 text-white hover:bg-white/15"
      )}
    >
      {label}
    </button>
  );
}
