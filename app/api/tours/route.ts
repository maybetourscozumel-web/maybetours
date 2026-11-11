import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseTour } from "@/lib/tour-helpers";

// Public, read-only tour list — powers client-side pages (like /saved) that
// need tour data without a per-page server fetch.
export async function GET() {
  const tours = await prisma.tour.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ tours: tours.map(parseTour) });
}
