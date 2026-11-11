import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShieldCheck,
  MapPin,
  Waves,
  Compass,
  CalendarCheck,
  Anchor,
  ArrowRight,
  Users,
  CalendarDays,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { parseTour } from "@/lib/tour-helpers";
import { cn } from "@/lib/utils";
import TourCard from "@/components/site/TourCard";
import TourQuiz from "@/components/site/TourQuiz";
import MarineLifeGuide from "@/components/site/MarineLifeGuide";
import Reveal from "@/components/site/Reveal";
import CountUp from "@/components/site/CountUp";

// Tour prices/visibility are edited live from /admin/tours, so this page
// must never be statically cached — always render with fresh data.
export const dynamic = "force-dynamic";

const STATS = [
  {
    icon: Star,
    target: 4.2,
    decimals: 1,
    suffix: "/5",
    label: "Tripadvisor rating",
    sub: "107+ reviews",
  },
  {
    icon: Compass,
    target: 8,
    decimals: 0,
    suffix: "",
    label: "Tours & experiences",
    sub: "Reef to open water",
  },
  {
    icon: ShieldCheck,
    target: 100,
    decimals: 0,
    suffix: "%",
    label: "Certified crew",
    sub: "Captains & guides",
  },
  {
    icon: CalendarDays,
    target: 7,
    decimals: 0,
    suffix: " days",
    label: "A week",
    sub: "9 AM – 5 PM",
  },
];

const STEPS = [
  {
    icon: Compass,
    title: "Choose your tour",
    body: "Reef snorkeling, shore diving, private catamarans or watersports — pick the trip that fits your group.",
  },
  {
    icon: CalendarCheck,
    title: "Reserve & pay online",
    body: "Pick a date, see live availability, and pay securely in a few taps. No phone tag required.",
  },
  {
    icon: Anchor,
    title: "Meet us at the marina",
    body: "Show up at Marina Cozumel ASIPONA at your departure time — our crew takes care of the rest.",
  },
];

const GALLERY_IMAGES = [
  {
    src: "/gallery/palancar-reef.jpg",
    alt: "Snorkeler exploring Palancar Reef",
    span: "sm:col-span-2 sm:row-span-2",
  },
  {
    src: "/gallery/captain-at-helm.jpg",
    alt: "Captain steering the boat",
    span: "sm:row-span-2",
  },
  { src: "/gallery/snorkel-ready.jpg", alt: "Guest geared up to snorkel off the boat" },
  { src: "/gallery/guide-briefing.jpg", alt: "May-Be Tours guide briefing the group" },
  {
    src: "/gallery/team-sign.jpg",
    alt: "May-Be Tours team with dive gear",
    span: "sm:col-span-2",
  },
  { src: "/gallery/family-boat.jpg", alt: "Family enjoying the boat trip" },
];

export default async function HomePage() {
  const tours = await prisma.tour.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
  const parsedTours = tours.map(parseTour);
  const featured = parsedTours.slice(0, 6);

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "May-Be Tours Cozumel",
    description:
      "Snorkeling, diving and watersports tours in Cozumel, Mexico — Palancar Reef, El Cielo, private catamaran charters, jet ski and more.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    image: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/brand/boat-hero.webp`,
    telephone: "+52-987-304-3584",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Carr. Costera Sur Km 6.5, Zona Hotelera Sur, Marina Cozumel ASIPONA",
      addressLocality: "Cozumel",
      addressRegion: "Quintana Roo",
      postalCode: "77675",
      addressCountry: "MX",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.2",
      reviewCount: "107",
      bestRating: "5",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden bg-brand-navy">
        <div className="absolute inset-0">
          <Image
            src="/brand/boat-hero.webp"
            alt="May-Be Tours boat in the waters of Cozumel"
            fill
            priority
            className="animate-ken-burns object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/70 to-brand-navy/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/70 via-brand-navy/10 to-transparent" />
        </div>
        <div className="animate-float-blob pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-yellow/20 blur-3xl" />
        <div
          className="animate-float-blob pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-brand-ocean/30 blur-3xl"
          style={{ animationDelay: "-5s" }}
        />

        <div className="relative mx-auto flex min-h-[640px] max-w-6xl flex-col items-start justify-end px-4 pb-28 pt-36 sm:min-h-[85vh] sm:px-6">
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white ring-1 ring-white/25 backdrop-blur">
            <Waves className="h-3.5 w-3.5 text-brand-yellow" />
            Cozumel, Quintana Roo, México
          </span>
          <h1
            className="animate-fade-up font-display mt-5 max-w-2xl text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl"
            style={{ animationDelay: "0.1s" }}
          >
            Snorkel Cozumel&apos;s best reefs
          </h1>
          <p
            className="animate-fade-up mt-5 max-w-xl text-lg text-white/85 sm:text-xl"
            style={{ animationDelay: "0.2s" }}
          >
            Palancar, Colombia &amp; El Cielo — crystal-clear water, sea turtles, and local
            guides. Reserve your spot online in minutes.
          </p>
          <div
            className="animate-fade-up mt-9 flex flex-wrap gap-4"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href="/tours"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-brand-red/30 transition hover:bg-brand-red/90"
            >
              Browse Tours
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <a
              href="https://wa.me/529871052528"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-7 py-3.5 text-base font-bold text-white ring-1 ring-white/40 backdrop-blur transition hover:bg-white/20"
            >
              WhatsApp Us
            </a>
          </div>

          <div
            className="animate-fade-up mt-12 flex flex-wrap gap-3"
            style={{ animationDelay: "0.4s" }}
          >
            {[
              { icon: Star, text: "4.2/5 · 107+ reviews" },
              { icon: ShieldCheck, text: "Certified captains & guides" },
              { icon: MapPin, text: "Marina Cozumel ASIPONA" },
            ].map((chip) => (
              <span
                key={chip.text}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 ring-1 ring-white/20 backdrop-blur"
              >
                <chip.icon className="h-4 w-4 text-brand-yellow" />
                {chip.text}
              </span>
            ))}
          </div>
        </div>

        <svg
          className="text-surface-deep relative block w-full"
          viewBox="0 0 1440 80"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 40C240 80 480 0 720 24C960 48 1200 80 1440 32V80H0V40Z"
            fill="currentColor"
          />
        </svg>
      </section>

      {/* Stats */}
      <section className="bg-surface-deep">
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 80}>
                <div className="flex flex-col gap-2 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                  <stat.icon className="text-brand-yellow h-5 w-5" />
                  <p className="font-display text-2xl font-bold text-white sm:text-3xl">
                    <CountUp target={stat.target} decimals={stat.decimals} suffix={stat.suffix} />
                  </p>
                  <p className="text-sm font-semibold text-white/80">{stat.label}</p>
                  <p className="text-xs text-white/50">{stat.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <TourQuiz tours={parsedTours} />

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-brand-yellow text-sm font-bold uppercase tracking-wide">
            How it works
          </span>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Booking your tour takes three steps
          </h2>
        </div>
        <div className="relative mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div
            className="absolute left-0 right-0 top-7 hidden h-px bg-white/10 sm:block"
            aria-hidden="true"
          />
          {STEPS.map((step, i) => (
            <Reveal
              key={step.title}
              delay={i * 120}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white shadow-md ring-1 ring-white/15 backdrop-blur">
                <step.icon className="h-6 w-6 text-white" />
                <span className="bg-brand-yellow absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-brand-navy">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">{step.title}</h3>
              <p className="mt-2 max-w-xs text-sm text-white/60">{step.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Tours grid */}
      <section id="tours" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="text-brand-yellow text-sm font-bold uppercase tracking-wide">
              Our Tours
            </span>
            <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pick your adventure
            </h2>
            <p className="mt-2 text-white/60">
              Shared boat trips, private charters, and watersports — something for every group.
            </p>
          </div>
          <Link
            href="/tours"
            className="hover:text-brand-yellow hidden items-center gap-1 text-sm font-bold text-white/80 sm:flex"
          >
            View all tours <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((tour, i) => (
            <Reveal key={tour.id} delay={(i % 3) * 80}>
              <TourCard tour={tour} />
            </Reveal>
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/tours"
            className="text-brand-yellow inline-flex items-center gap-1 text-sm font-bold"
          >
            View all tours <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <MarineLifeGuide />

      {/* Gallery */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10">
          <span className="text-brand-yellow text-sm font-bold uppercase tracking-wide">
            On the Water
          </span>
          <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Real moments from recent trips
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 sm:[grid-auto-rows:160px] md:sm:[grid-auto-rows:190px]">
          {GALLERY_IMAGES.map((img, i) => (
            <Reveal
              key={img.src}
              delay={i * 60}
              className={cn(
                "bg-surface group relative aspect-square overflow-hidden rounded-xl sm:aspect-auto",
                img.span
              )}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 640px) 50vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            </Reveal>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-surface-deep py-20 text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 md:grid-cols-2 md:items-center">
          <Reveal className="relative">
            <div className="relative h-72 overflow-hidden rounded-3xl sm:h-96">
              <Image
                src="/brand/storefront.jpg"
                alt="May-Be Tours Cozumel storefront at Marina Cozumel"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl sm:-right-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-yellow/20">
                <Users className="h-5 w-5 text-brand-navy" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-brand-navy">Local, family-run crew</p>
                <p className="text-xs text-black/50">Based at Marina Cozumel</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <span className="text-sm font-bold uppercase tracking-wide text-brand-yellow">
              About Us
            </span>
            <h2 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Creating memories out of fun
            </h2>
            <p className="mt-4 text-white/80">
              May-Be Tours Cozumel has been taking locals and visitors out onto the reefs of
              Cozumel&apos;s Marine Park for years. Our certified captains and guides know exactly
              where the turtles, rays and reef fish are hiding — and how to keep every trip safe,
              relaxed and fun.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                "Sanitized snorkeling equipment on every trip",
                "Shaded boats with unlimited water, juice & snacks",
                "Official partner, Cozumel Tours",
                "Certified captains & local guides",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-white/5 p-3 ring-1 ring-white/10"
                >
                  <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-yellow" />
                  <span className="text-sm text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-background relative overflow-hidden">
        <Reveal className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready for your Cozumel adventure?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            Check live availability and reserve your tour online in minutes — or reach out on
            WhatsApp if you have questions first.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/tours"
              className="inline-flex items-center gap-2 rounded-full bg-brand-red px-7 py-3.5 text-base font-bold text-white shadow-lg shadow-brand-red/20 transition hover:bg-brand-red/90"
            >
              Browse Tours
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://wa.me/529871052528"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-7 py-3.5 text-base font-bold text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/20"
            >
              WhatsApp Us
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
