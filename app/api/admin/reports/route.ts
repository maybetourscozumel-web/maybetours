import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toDateOnly } from "@/lib/availability";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const days = Number(params.get("days") || 30);

  const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const bookings = await prisma.booking.findMany({
    where: {
      status: { in: ["CONFIRMED", "COMPLETED"] },
      date: { gte: toDateOnly(from) },
    },
    include: { tour: { select: { name: true, dailyCapacity: true } } },
  });

  const revenueByDate = new Map<string, number>();
  const occupancyByTour = new Map<string, { booked: number; capacityDays: number; name: string }>();

  for (const b of bookings) {
    const key = b.date.toISOString().slice(0, 10);
    revenueByDate.set(key, (revenueByDate.get(key) ?? 0) + b.totalPriceMXN);

    const entry = occupancyByTour.get(b.tourId) ?? {
      booked: 0,
      capacityDays: 0,
      name: b.tour.name,
    };
    entry.booked += b.partySize;
    occupancyByTour.set(b.tourId, entry);
  }

  const revenueSeries = Array.from(revenueByDate.entries())
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, revenue]) => ({ date, revenue }));

  const tours = await prisma.tour.findMany({ where: { active: true } });
  const occupancy = tours.map((t) => {
    const entry = occupancyByTour.get(t.id);
    const totalCapacity = t.dailyCapacity * days;
    const booked = entry?.booked ?? 0;
    return {
      tourName: t.name,
      booked,
      occupancyPct: totalCapacity > 0 ? Math.round((booked / totalCapacity) * 100) : 0,
    };
  });

  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPriceMXN, 0);
  const totalBookings = bookings.length;
  const totalGuests = bookings.reduce((sum, b) => sum + b.partySize, 0);

  return NextResponse.json({
    revenueSeries,
    occupancy,
    totals: { totalRevenue, totalBookings, totalGuests },
  });
}
