"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Waves, Users, Zap, Compass, Lock, RotateCcw, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn, formatMXN } from "@/lib/utils";
import type { TourWithParsedFields } from "@/lib/tour-helpers";

type QuizTour = Pick<
  TourWithParsedFields,
  "slug" | "name" | "shortDescription" | "priceMXN" | "priceType" | "heroImage"
>;

type Step = "start" | "group-size" | "privacy" | "snorkel-focus" | "ride-count" | "result";
type GroupSize = "small" | "big" | null;

type Option = { label: string; icon: LucideIcon; onClick: () => void };

const PRIVATE_TOUR_BY_GROUP_SIZE: Record<Exclude<GroupSize, null>, string> = {
  small: "private-snorkeling-speedboat-7",
  big: "private-snorkeling-up-to-12",
};

const STEP_PROGRESS: Record<Step, number> = {
  start: 1,
  "group-size": 2,
  privacy: 3,
  "snorkel-focus": 4,
  "ride-count": 3,
  result: 4,
};

export default function TourQuiz({ tours }: { tours: QuizTour[] }) {
  const [step, setStep] = useState<Step>("start");
  const [groupSize, setGroupSize] = useState<GroupSize>(null);
  const [resultSlug, setResultSlug] = useState<string | null>(null);

  function finish(slug: string) {
    setResultSlug(slug);
    setStep("result");
  }

  function chooseGroupSize(size: Exclude<GroupSize, null>) {
    setGroupSize(size);
    setStep("privacy");
  }

  function restart() {
    setStep("start");
    setGroupSize(null);
    setResultSlug(null);
  }

  const result = resultSlug ? tours.find((t) => t.slug === resultSlug) : null;
  const progress = STEP_PROGRESS[step];

  return (
    <section className="bg-surface-deep py-16 text-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-wide text-brand-yellow">
            Not sure where to start?
          </span>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Find your perfect tour in 10 seconds
          </h2>
        </div>

        <div className="mx-auto mt-4 flex w-fit items-center gap-1.5">
          {[1, 2, 3, 4].map((n) => (
            <span
              key={n}
              className={cn(
                "h-1.5 w-8 rounded-full transition",
                n <= progress ? "bg-brand-yellow" : "bg-white/20"
              )}
            />
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 sm:p-8">
          {step === "start" && (
            <QuizStep
              question="How do you want to explore the water?"
              options={[
                {
                  label: "Snorkel reefs & wildlife",
                  icon: Waves,
                  onClick: () => setStep("group-size"),
                },
                {
                  label: "Dive below the surface",
                  icon: Compass,
                  onClick: () => finish("shore-diving"),
                },
                {
                  label: "Ride something fast & fun",
                  icon: Zap,
                  onClick: () => setStep("ride-count"),
                },
              ]}
            />
          )}

          {step === "group-size" && (
            <QuizStep
              question="Who's coming with you?"
              options={[
                {
                  label: "Just me / my partner — happy to share a boat",
                  icon: Users,
                  onClick: () => setStep("snorkel-focus"),
                },
                {
                  label: "Small group (up to 7)",
                  icon: Users,
                  onClick: () => chooseGroupSize("small"),
                },
                {
                  label: "Bigger group (up to 12)",
                  icon: Users,
                  onClick: () => chooseGroupSize("big"),
                },
              ]}
              onBack={() => setStep("start")}
            />
          )}

          {step === "privacy" && groupSize && (
            <QuizStep
              question="Private charter or a shared boat?"
              options={[
                {
                  label: "Private — just our group",
                  icon: Lock,
                  onClick: () => finish(PRIVATE_TOUR_BY_GROUP_SIZE[groupSize]),
                },
                {
                  label: "Shared — happy to join other travelers",
                  icon: Users,
                  onClick: () => setStep("snorkel-focus"),
                },
              ]}
              onBack={() => setStep("group-size")}
            />
          )}

          {step === "snorkel-focus" && (
            <QuizStep
              question="What sounds better?"
              options={[
                {
                  label: "Reef-hopping: Palancar, Colombia & El Cielo",
                  icon: Waves,
                  onClick: () => finish("cozumel-snorkeling-palancar-colombia-el-cielo"),
                },
                {
                  label: "Stingrays, turtles & El Cielo on a big catamaran",
                  icon: Waves,
                  onClick: () => finish("catamaran-el-cielo-stingrays-turtles"),
                },
              ]}
              onBack={() => setStep(groupSize ? "privacy" : "group-size")}
            />
          )}

          {step === "ride-count" && (
            <QuizStep
              question="How many riders?"
              options={[
                {
                  label: "1–2 people, max speed",
                  icon: Zap,
                  onClick: () => finish("jet-ski"),
                },
                {
                  label: "A group, bouncing over the waves",
                  icon: Zap,
                  onClick: () => finish("banana-boat"),
                },
              ]}
              onBack={() => setStep("start")}
            />
          )}

          {step === "result" && result && (
            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
              {result.heroImage && (
                <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-44">
                  <Image src={result.heroImage} alt={result.name} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wide text-brand-yellow">
                  Your match
                </p>
                <h3 className="font-display mt-1 text-xl font-bold tracking-tight">{result.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-white/70">
                  {result.shortDescription}
                </p>
                <p className="mt-2 text-lg font-extrabold text-brand-yellow">
                  {formatMXN(result.priceMXN)}{" "}
                  <span className="text-xs font-normal text-white/60">
                    {result.priceType === "PER_PERSON" ? "per person" : "per boat"}
                  </span>
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-center gap-2">
                <Link
                  href={`/tours/${result.slug}#book`}
                  className="inline-flex items-center justify-center gap-1 rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-brand-red/90"
                >
                  Reserve Now <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={restart}
                  className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-white/60 hover:text-white"
                >
                  <RotateCcw className="h-3 w-3" /> Start over
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function QuizStep({
  question,
  options,
  onBack,
}: {
  question: string;
  options: Option[];
  onBack?: () => void;
}) {
  return (
    <div>
      <p className="text-center text-lg font-bold sm:text-left">{question}</p>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {options.map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={opt.onClick}
            className="flex flex-col items-center gap-2 rounded-xl bg-white/10 p-5 text-center text-sm font-semibold ring-1 ring-white/10 transition hover:bg-white/20 hover:ring-brand-yellow/50"
          >
            <opt.icon className="h-6 w-6 text-brand-yellow" />
            {opt.label}
          </button>
        ))}
      </div>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mt-4 text-xs font-semibold text-white/50 hover:text-white"
        >
          ← Back
        </button>
      )}
    </div>
  );
}
