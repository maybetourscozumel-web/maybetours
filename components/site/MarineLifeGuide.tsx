"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Creature = {
  id: string;
  name: string;
  image: string;
  fact: string;
  spotAt: string;
  tourSlugs: string[];
};

const CREATURES: Creature[] = [
  {
    id: "turtles",
    name: "Sea Turtles",
    image: "/gallery/palancar-reef.jpg",
    fact: "Cozumel's reefs are a feeding ground for green and hawksbill sea turtles. They can hold their breath for hours while resting on the reef — keep a respectful distance and never touch.",
    spotAt: "Palancar Reef & El Cielo",
    tourSlugs: [
      "cozumel-snorkeling-palancar-colombia-el-cielo",
      "catamaran-el-cielo-stingrays-turtles",
      "el-cielo-private-catamaran",
    ],
  },
  {
    id: "starfish",
    name: "Cushion Sea Stars",
    image: "/tours/catamaran-turtles-hero.jpg",
    fact: "El Cielo's shallow, sandy flats are famous for cushion sea stars resting in crystal-clear water. They're a protected part of the marine park — look, but please don't lift them out of the water.",
    spotAt: "El Cielo",
    tourSlugs: [
      "cozumel-snorkeling-palancar-colombia-el-cielo",
      "el-cielo-private-catamaran",
      "catamaran-el-cielo-stingrays-turtles",
    ],
  },
  {
    id: "rays",
    name: "Southern Stingrays",
    image: "/tours/el-cielo-private-hero.jpg",
    fact: "Southern stingrays glide gracefully along the sandy sea floor, often half-buried as camouflage. They're naturally calm and non-aggressive when left undisturbed.",
    spotAt: "El Cielo & surrounding flats",
    tourSlugs: ["catamaran-el-cielo-stingrays-turtles", "el-cielo-private-catamaran"],
  },
  {
    id: "reef",
    name: "Reef Fish & Coral",
    image: "/tours/shore-diving-hero.jpg",
    fact: "Cozumel sits on the Mesoamerican Reef — the second-largest barrier reef system on Earth. Expect parrotfish, angelfish, sergeant majors and vibrant coral formations just below the surface.",
    spotAt: "Palancar & Colombia Reef",
    tourSlugs: ["cozumel-snorkeling-palancar-colombia-el-cielo", "shore-diving"],
  },
];

export default function MarineLifeGuide() {
  const [active, setActive] = useState(0);
  const creature = CREATURES[active];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10 max-w-2xl">
        <span className="text-brand-yellow text-sm font-bold uppercase tracking-wide">
          Field Guide
        </span>
        <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          What you&apos;ll see underwater
        </h2>
        <p className="mt-2 text-white/60">
          Cozumel&apos;s marine park is one of the richest reef systems in the Caribbean. Tap a
          creature to learn more — and see which tour gets you there.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
        <div className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          {CREATURES.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left transition lg:shrink",
                i === active
                  ? "border-brand-red bg-brand-red/10 shadow-sm"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              )}
            >
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <Image src={c.image} alt="" fill className="object-cover" />
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-sm font-bold lg:whitespace-normal",
                  i === active ? "text-brand-red" : "text-white"
                )}
              >
                {c.name}
              </span>
            </button>
          ))}
        </div>

        <div className="border-border-soft bg-surface grid grid-cols-1 overflow-hidden rounded-2xl border shadow-sm sm:grid-cols-2">
          <div className="relative h-64 sm:h-full">
            <Image
              key={creature.image}
              src={creature.image}
              alt={creature.name}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-3 p-6 sm:p-8">
            <span className="bg-brand-yellow w-fit rounded-full px-3 py-1 text-xs font-bold text-brand-navy">
              {creature.spotAt}
            </span>
            <h3 className="font-display text-2xl font-bold tracking-tight text-white">
              {creature.name}
            </h3>
            <p className="text-sm leading-relaxed text-white/65">{creature.fact}</p>
            <Link
              href={`/tours/${creature.tourSlugs[0]}`}
              className="text-brand-yellow mt-2 inline-flex w-fit items-center gap-1 text-sm font-bold hover:text-white"
            >
              See this on a tour <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
