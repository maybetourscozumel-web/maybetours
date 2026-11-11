import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parseTour, CATEGORY_LABELS, buildTourFAQs } from "@/lib/tour-helpers";
import { getTourPhotos } from "@/lib/tour-gallery";
import { formatDuration } from "@/lib/utils";
import { stripeEnabled } from "@/lib/stripe";
import BookingWidget from "@/components/site/BookingWidget";
import MobileBookBar from "@/components/site/MobileBookBar";
import FAQAccordion from "@/components/site/FAQAccordion";
import TourGallery from "@/components/site/TourGallery";
import LocationMap from "@/components/site/LocationMap";
import TourCard from "@/components/site/TourCard";
import { Check, X, ChevronLeft, MapPin } from "lucide-react";

// Prices, availability and visibility are edited live from /admin/tours and
// change with every booking, so this page must never be statically cached.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = await prisma.tour.findUnique({ where: { slug } });
  if (!tour) return {};
  return {
    title: tour.name,
    description: tour.shortDescription,
  };
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  SNORKELING: "from-brand-ocean to-brand-navy",
  DIVING: "from-brand-navy to-black",
  WATERSPORT: "from-brand-yellow to-brand-red",
  PRIVATE: "from-brand-red to-brand-navy",
};

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params;
  const tour = await prisma.tour.findUnique({ where: { slug } });
  if (!tour || !tour.active) notFound();

  const parsed = parseTour(tour);

  const otherTours = await prisma.tour.findMany({
    where: { active: true, id: { not: tour.id } },
    orderBy: { sortOrder: "asc" },
  });
  const relatedTours = otherTours
    .map(parseTour)
    .sort((a, b) => Number(a.category !== parsed.category) - Number(b.category !== parsed.category))
    .slice(0, 3);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: parsed.name,
    description: parsed.shortDescription,
    image: parsed.heroImage ? `${siteUrl}${parsed.heroImage}` : undefined,
    brand: { "@type": "Brand", name: "May-Be Tours Cozumel" },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/tours/${parsed.slug}`,
      priceCurrency: "MXN",
      price: parsed.priceMXN,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:pb-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <Link
        href="/tours"
        className="text-brand-ocean mb-4 inline-flex items-center gap-1 text-sm font-semibold hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to tours
      </Link>
      <TourGallery
        photos={getTourPhotos(parsed.slug, parsed.heroImage)}
        name={parsed.name}
        categoryLabel={CATEGORY_LABELS[parsed.category] ?? parsed.category}
        gradient={CATEGORY_GRADIENTS[parsed.category] ?? "from-brand-ocean to-brand-navy"}
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-6 border-b border-white/10 pb-6 text-sm text-white/60">
            <span>
              <span className="font-bold text-white">Duration: </span>
              {formatDuration(parsed.durationMinutes)}
            </span>
            <span>
              <span className="font-bold text-white">Group size: </span>
              Up to {parsed.maxGroupSize} people
            </span>
            <span>
              <span className="font-bold text-white">Meeting point: </span>
              {parsed.meetingPoint}
            </span>
          </div>

          <p className="mt-6 text-base leading-relaxed text-white/75">{parsed.description}</p>

          {parsed.highlights.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-bold text-white">Highlights</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {parsed.highlights.map((h) => (
                  <span
                    key={h}
                    className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-medium text-white"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <h2 className="text-lg font-bold text-white">Included</h2>
              <ul className="mt-3 space-y-2">
                {parsed.included.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-white/75">
                    <Check className="text-brand-ocean mt-0.5 h-4 w-4 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Not Included</h2>
              <ul className="mt-3 space-y-2">
                {parsed.excluded.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-white/75">
                    <X className="text-brand-red mt-0.5 h-4 w-4 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
              <MapPin className="text-brand-red h-4 w-4" />
              Meeting Point
            </h2>
            <p className="mt-2 text-sm text-white/60">{parsed.meetingPoint}</p>
            <div className="border-border-soft mt-4 overflow-hidden rounded-2xl border">
              <LocationMap query={parsed.meetingPoint} className="h-64 w-full" />
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-lg font-bold text-white">Frequently Asked Questions</h2>
            <div className="mt-4">
              <FAQAccordion items={buildTourFAQs(parsed)} />
            </div>
          </div>
        </div>

        <div>
          <BookingWidget
            tourId={parsed.id}
            priceMXN={parsed.priceMXN}
            priceType={parsed.priceType as "PER_PERSON" | "FLAT_PER_BOAT"}
            maxGroupSize={parsed.maxGroupSize}
            stripeEnabled={stripeEnabled}
          />
        </div>
      </div>

      {relatedTours.length > 0 && (
        <div className="mt-16 border-t border-white/10 pt-12">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white">
            You might also like
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {relatedTours.map((t) => (
              <TourCard key={t.id} tour={t} />
            ))}
          </div>
        </div>
      )}

      <MobileBookBar priceMXN={parsed.priceMXN} priceType={parsed.priceType as "PER_PERSON" | "FLAT_PER_BOAT"} />
    </div>
  );
}
