import { NextRequest, NextResponse } from "next/server";
import { getTourMonthAvailability } from "@/lib/availability";

export async function GET(request: NextRequest) {
  const tourId = request.nextUrl.searchParams.get("tourId");
  const month = request.nextUrl.searchParams.get("month"); // YYYY-MM

  if (!tourId || !month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json(
      { error: "tourId and month (YYYY-MM) are required" },
      { status: 400 }
    );
  }

  const [year, m] = month.split("-").map(Number);

  try {
    const days = await getTourMonthAvailability(tourId, year, m);
    return NextResponse.json({ days });
  } catch {
    return NextResponse.json({ error: "Tour not found" }, { status: 404 });
  }
}
