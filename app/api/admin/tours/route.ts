import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const tours = await prisma.tour.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ tours });
}
