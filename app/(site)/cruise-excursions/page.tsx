import type { Metadata } from "next";
import Link from "next/link";
import { Anchor, Clock, ShieldCheck, CalendarCheck, ArrowRight, Car } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { parseTour } from "@/lib/tour-helpers";
import { formatDuration } from "@/lib/utils";
import { siteUrl } from "@/lib/business";
import TourCard from "@/components/site/TourCard";

export const dynamic = "force-dynamic";

const TITLE = "Cozumel Cruise Excursions — Book Before You Dock";
const DESCRIPTION =
  "Skip the cruise ship excursion desk markup. Book your Cozumel snorkeling, diving or private boat tour online in advance — a short taxi ride from Puerta Maya and the International Pier.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/cruise-excursions" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/cruise-excursions" },
};

const STEPS = [
  {
    icon: CalendarCheck,
    title: "Check your ship's port schedule",
    body: "Find your arrival and “all aboard” time — that's your real budget for the day.",
  },
  {
    icon: Clock,
    title: "Pick a tour that fits",
    body: "Jet ski and banana boat run 20–30 minutes. Snorkeling and private charters run 4–4.5 hours round trip. Match it to your window.",
  },
  {
    icon: CalendarCheck,
    title: "Book online before you dock",
    body: "Reserve and pay in advance so your spot is guaranteed the moment you walk off the ship — no waiting in line at an excursion desk.",
  },
  {
    icon: Car,
    title: "Taxi to Marina Cozumel ASIPONA",
    body: "It's about a 5–15 minute taxi ride from Puerta Maya or the International Pier. Tell the driver “Marina Cozumel ASIPONA.”",
  },
];

const FAQS = [
  {
    question: "Will I make it back to my ship on time?",
    answer:
      "Our tours are sized to fit comfortably inside a typical Cozumel port day. Tell us your “all aboard” time when you book or message us on WhatsApp, and we'll recommend a tour with a safe buffer — we never want you to miss your ship.",
  },
  {
    question: "Is it cheaper to book with you directly than through the cruise line's excursion desk?",
    answer:
      "Booking directly online means no cruise-line markup — you pay our listed price with no middleman fee, with secure checkout and instant confirmation.",
  },
  {
    question: "Do you pick up from the cruise pier?",
    answer:
      "Most of our tours depart from Marina Cozumel ASIPONA, a short taxi ride (about 5–15 minutes) from Puerta Maya and the International Pier. Our private catamaran charter includes transportation from the downtown/fiscal pier — check that tour's details.",
  },
  {
    question: "What if my ship docks at a different pier, or the schedule changes?",
    answer:
      "Message us on WhatsApp as soon as you know your dock time and pier — we'll help you figure out timing and the best taxi pickup point.",
  },
  {
    question: "What happens if I'm late because of the ship or traffic?",
    answer:
      "Message us on WhatsApp right away if you're running behind — we'll do what we can to adjust, though tours with fixed departure times can't always wait. Booking a tour with more buffer before your all-aboard time is the safest bet.",
  },
];

export default async function CruiseExcursionsPage() {
  const tours = await prisma.tour.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
  const parsedTours = tours.map(parseTour);
  const quickTours = parsedTours.filter((t) => t.durationMinutes <= 60);
  const halfDayTours = parsedTours.filter((t) => t.durationMinutes > 60);

  const url = siteUrl();
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: url },
      { "@type": "ListItem", position: 2, name: "Cruise Excursions", item: `${url}/cruise-excursions` },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <span className="text-brand-yellow inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
        <Anchor className="h-4 w-4" />
        Cruise Ship Guests
      </span>
      <h1 className="font-display mt-2 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
        Cozumel cruise excursions, booked before you even dock
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-white/70">
        Skip the line at the ship's excursion desk. We're a short taxi ride from Puerta Maya and
        the International Pier, our tours are sized to fit a normal port day, and booking online
        means your spot is confirmed before you walk off the gangway.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/tours"
          className="inline-flex items-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-brand-red/30 transition hover:bg-brand-red/90"
        >
          Browse Tours
          <ArrowRight className="h-4 w-4" />
        </Link>
        <a
          href="https://wa.me/529871052528?text=Hi!%20I%27m%20on%20a%20cruise%20ship%20and%20want%20to%20book%20a%20tour%20in%20Cozumel."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-7 py-3.5 text-base font-bold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/20"
        >
          Ask us on WhatsApp
        </a>
      </div>

      {/* Steps */}
      <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <div key={step.title} className="border-border-soft bg-surface rounded-2xl border p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
              <step.icon className="h-5 w-5 text-brand-yellow" />
            </div>
            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-white/40">Step {i + 1}</p>
            <h3 className="mt-1 font-bold text-white">{step.title}</h3>
            <p className="mt-2 text-sm text-white/60">{step.body}</p>
          </div>
        ))}
      </div>

      {/* Time budget guidance */}
      {quickTours.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white">
            Short on time? Quick add-ons (20–30 minutes)
          </h2>
          <p className="mt-2 text-white/60">
            Perfect if your port call is tight, or as a quick extra alongside another tour.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {quickTours.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>
        </div>
      )}

      {halfDayTours.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white">
            Full port day? Half-day tours ({formatDuration(halfDayTours[0]?.durationMinutes ?? 240)}+)
          </h2>
          <p className="mt-2 text-white/60">
            Best for ships docked 7+ hours — plenty of time for reef snorkeling or a private
            charter and a comfortable buffer before boarding.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {halfDayTours.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>
        </div>
      )}

      {/* Trust strip */}
      <div className="border-border-soft bg-surface mt-16 flex flex-col gap-4 rounded-2xl border p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-brand-yellow h-6 w-6 shrink-0" />
          <p className="text-sm text-white/80">
            Certified captains &amp; guides, secure online checkout, instant confirmation —
            booked directly with the local operator, no cruise-line markup.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 max-w-3xl">
        <h2 className="font-display text-2xl font-bold tracking-tight text-white">
          Cruise excursion FAQ
        </h2>
        <div className="mt-6 space-y-6">
          {FAQS.map((f) => (
            <div key={f.question} className="border-border-soft border-b pb-6">
              <h3 className="font-bold text-white">{f.question}</h3>
              <p className="mt-2 text-sm text-white/60">{f.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
