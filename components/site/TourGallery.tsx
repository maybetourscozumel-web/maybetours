"use client";

import { useState } from "react";
import Image from "next/image";
import { Images } from "lucide-react";
import { cn } from "@/lib/utils";
import Lightbox from "./Lightbox";

export default function TourGallery({
  photos,
  name,
  categoryLabel,
  gradient,
}: {
  photos: string[];
  name: string;
  categoryLabel: string;
  gradient: string;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const TitleBlock = (
    <div className="relative">
      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-brand-navy">
        {categoryLabel}
      </span>
      <h1 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm sm:text-4xl">
        {name}
      </h1>
    </div>
  );

  if (photos.length <= 1) {
    return (
      <div
        className={cn(
          "relative mb-10 flex h-56 items-end overflow-hidden rounded-2xl bg-gradient-to-br p-6 sm:h-72 sm:p-10",
          gradient
        )}
      >
        {photos[0] && (
          <>
            <Image
              src={photos[0]}
              alt={name}
              fill
              priority
              sizes="(min-width: 1024px) 1152px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          </>
        )}
        {TitleBlock}
      </div>
    );
  }

  return (
    <div className="mb-10">
      {/* Mobile: single tappable image + photo count badge */}
      <button
        type="button"
        onClick={() => setLightboxIndex(0)}
        className={cn(
          "relative flex h-64 w-full items-end overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-left sm:hidden",
          gradient
        )}
      >
        <Image src={photos[0]} alt={name} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        {TitleBlock}
        <span className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-black/50 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
          <Images className="h-3.5 w-3.5" /> {photos.length} photos
        </span>
      </button>

      {/* Desktop: Airbnb-style 5-photo grid */}
      <div className="relative hidden sm:grid sm:h-[420px] sm:grid-cols-4 sm:grid-rows-2 sm:gap-2 sm:overflow-hidden sm:rounded-2xl">
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          className={cn(
            "group relative col-span-2 row-span-2 flex items-end overflow-hidden bg-gradient-to-br p-8 text-left",
            gradient
          )}
        >
          <Image
            src={photos[0]}
            alt={name}
            fill
            priority
            sizes="50vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          {TitleBlock}
        </button>
        {photos.slice(1, 5).map((photo, i) => (
          <button
            key={photo}
            type="button"
            onClick={() => setLightboxIndex(i + 1)}
            className="bg-surface group relative overflow-hidden"
          >
            <Image
              src={photo}
              alt={`${name} — photo ${i + 2}`}
              fill
              sizes="25vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          </button>
        ))}
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-brand-navy shadow-md transition hover:bg-brand-sand"
        >
          <Images className="h-3.5 w-3.5" /> Show all {photos.length} photos
        </button>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          alt={name}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
