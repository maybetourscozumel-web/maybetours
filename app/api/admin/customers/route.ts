import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const customers = await prisma.customer.findMany({
    include: {
      bookings: {
        where: { status: { in: ["CONFIRMED", "COMPLETED"] } },
        select: { id: true, totalPriceMXN: true, date: true, tour: { select: { name: true } } },
        orderBy: { date: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const shaped = customers.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    notes: c.notes,
    bookingCount: c.bookings.length,
    totalSpentMXN: c.bookings.reduce((sum, b) => sum + b.totalPriceMXN, 0),
    lastBooking: c.bookings[0]
      ? { date: c.bookings[0].date, tourName: c.bookings[0].tour.name }
      : null,
  }));

  return NextResponse.json({ customers: shaped });
}
