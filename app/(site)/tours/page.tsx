import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { parseTour } from "@/lib/tour-helpers";
import ToursFilter from "@/components/site/ToursFilter";

export const metadata: Metadata = {
  title: "Tours",
  description:
    "Browse all May-Be Tours Cozumel snorkeling, diving, private charter and watersports tours.",
};

// Tour prices/visibility are edited live from /admin/tours, so this page
// must never be statically cached — always render with fresh data.
export const dynamic = "force-dynamic";

export default async function ToursPage() {
  const tours = await prisma.tour.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
  const parsedTours = tours.map(parseTour);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">All Tours</h1>
        <p className="mt-2 text-white/60">
          From shared reef-hopping snorkel trips to fully private charters — find your Cozumel
          adventure.
        </p>
      </div>
      <ToursFilter tours={parsedTours} />
    </section>
  );
}
