import type { Metadata } from "next";
import Link from "next/link";
import { Ship, CalendarCheck, Clock, Car, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { parseTour } from "@/lib/tour-helpers";
import { siteUrl } from "@/lib/business";
import TourCard from "@/components/site/TourCard";

export const dynamic = "force-dynamic";

const TITLE = "Cozumel Day Trip from Playa del Carmen — Ferry Guide & Tours";
const DESCRIPTION =
  "Planning a Cozumel day trip from Playa del Carmen? Here's how the ferry crossing works and how to book your snorkeling, diving or private boat tour online before you cross.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/playa-del-carmen" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/playa-del-carmen" },
};

const STEPS = [
  {
    icon: CalendarCheck,
    title: "Reserve your Cozumel tour first",
    body: "Book online before you cross so your spot and price are locked in — don't wait until you land to start looking.",
  },
  {
    icon: Ship,
    title: "Take the ferry from Playa del Carmen",
    body: "Ultramar and Winjet both run passenger ferries to Cozumel, crossing in about 45 minutes with frequent departures throughout the day. Check the current schedule and fares at the terminal or the ferry operator's site before you go.",
  },
  {
    icon: Car,
    title: "Head to Marina Cozumel ASIPONA",
    body: "A short taxi ride from the Cozumel ferry terminal downtown — tell the driver “Marina Cozumel ASIPONA.”",
  },
  {
    icon: Clock,
    title: "Plan your return crossing",
    body: "Pick a tour that leaves you comfortable time to get back to the ferry terminal before the last sailing back to Playa del Carmen.",
  },
];

const FAQS = [
  {
    question: "How long is the ferry ride from Playa del Carmen to Cozumel?",
    answer:
      "About 45 minutes each way. Ultramar and Winjet both operate the route with frequent departures throughout the day — check the current timetable at the terminal or the operator's website, since schedules can shift seasonally.",
  },
  {
    question: "Do I need to book the ferry and the tour separately?",
    answer:
      "Yes — the ferry ticket and your Cozumel tour are booked separately. We recommend reserving your tour with us online first, so it's already confirmed by the time you land in Cozumel.",
  },
  {
    question: "Is one day enough to see Cozumel's best snorkeling spots?",
    answer:
      "Yes. Our half-day snorkeling trips (around 4 hours) cover Palancar Reef, Colombia Reef and El Cielo in a single outing, leaving you time to catch an evening ferry back to Playa del Carmen.",
  },
  {
    question: "What time does the last ferry back to Playa del Carmen leave?",
    answer:
      "This varies by season and operator, so check the current schedule before you book your tour time. As a rule of thumb, build in at least an hour of buffer after your tour ends to get back to the ferry terminal.",
  },
  {
    question: "Can I book a private charter for a group day trip from Playa del Carmen?",
    answer:
      "Yes — our private catamaran and speedboat charters are a popular choice for groups crossing over for the day. Message us on WhatsApp with your group size and we'll help you plan the timing around the ferry.",
  },
];

export default async function PlayaDelCarmenPage() {
  const tours = await prisma.tour.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
  const parsedTours = tours.map(parseTour).filter((t) => t.durationMinutes >= 90);

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
      { "@type": "ListItem", position: 2, name: "Playa del Carmen Day Trip", item: `${url}/playa-del-carmen` },
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
        <Ship className="h-4 w-4" />
        Visiting from Playa del Carmen
      </span>
      <h1 className="font-display mt-2 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
        Your Cozumel day trip from Playa del Carmen, planned out
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-white/70">
        Cozumel is a quick ferry ride from Playa del Carmen — close enough for a full day of
        snorkeling, diving or a private boat charter without staying overnight. Here's exactly how
        to plan it, and the tours that fit the schedule.
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
          href="https://wa.me/529871052528?text=Hi!%20I%27m%20planning%20a%20day%20trip%20from%20Playa%20del%20Carmen%20and%20want%20to%20book%20a%20tour%20in%20Cozumel."
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

      {/* Tours that fit a day trip */}
      <div className="mt-16">
        <h2 className="font-display text-2xl font-bold tracking-tight text-white">
          Tours that fit a day-trip schedule
        </h2>
        <p className="mt-2 text-white/60">
          Half-day trips that leave room for the ferry over and back the same day.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {parsedTours.map((t) => (
            <TourCard key={t.id} tour={t} />
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-16 max-w-3xl">
        <h2 className="font-display text-2xl font-bold tracking-tight text-white">
          Playa del Carmen to Cozumel FAQ
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
