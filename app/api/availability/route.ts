import { NextRequest, NextResponse } from "next/server";
import { getTourAvailability } from "@/lib/availability";

export async function GET(request: NextRequest) {
  const tourId = request.nextUrl.searchParams.get("tourId");
  const date = request.nextUrl.searchParams.get("date");

  if (!tourId || !date) {
    return NextResponse.json({ error: "tourId and date are required" }, { status: 400 });
  }

  try {
    const availability = await getTourAvailability(tourId, date);
    return NextResponse.json(availability);
  } catch {
    return NextResponse.json({ error: "Tour not found" }, { status: 404 });
  }
}
