import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { manualBookingSchema } from "@/lib/validation";
import { getTourAvailability, computeTotalPrice, toDateOnly } from "@/lib/availability";
import { sendBookingConfirmationEmail, sendAdminBookingAlert } from "@/lib/email";
import { formatDate } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const from = params.get("from");
  const to = params.get("to");
  const tourId = params.get("tourId");
  const status = params.get("status");
  const q = params.get("q");

  const where: Prisma.BookingWhereInput = {};

  if (from || to) {
    where.date = {};
    if (from) where.date.gte = toDateOnly(from);
    if (to) where.date.lte = toDateOnly(to);
  }
  if (tourId) where.tourId = tourId;
  if (status) where.status = status as Prisma.BookingWhereInput["status"];
  if (q) {
    where.OR = [
      { customerName: { contains: q } },
      { email: { contains: q } },
      { phone: { contains: q } },
    ];
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: { tour: { select: { name: true, slug: true } } },
    orderBy: { date: "asc" },
  });

  return NextResponse.json({ bookings });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = manualBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid request" },
      { status: 400 }
    );
  }
  const { tourId, date, partySize, name, email, phone, notes, paymentStatus } = parsed.data;

  const tour = await prisma.tour.findUnique({ where: { id: tourId } });
  if (!tour) {
    return NextResponse.json({ error: "Tour not found" }, { status: 404 });
  }

  const bookingDate = toDateOnly(date);
  const availability = await getTourAvailability(tourId, bookingDate);
  if (availability.blocked || availability.remaining < partySize) {
    return NextResponse.json(
      { error: "Not enough availability on this date." },
      { status: 409 }
    );
  }

  const totalPriceMXN = computeTotalPrice(tour, partySize);

  const customer = await prisma.customer.upsert({
    where: { email },
    update: { name, phone },
    create: { email, name, phone },
  });

  const booking = await prisma.booking.create({
    data: {
      tourId,
      date: bookingDate,
      partySize,
      customerName: name,
      email,
      phone,
      totalPriceMXN,
      status: "CONFIRMED",
      paymentStatus,
      source: "MANUAL",
      notes,
      customerId: customer.id,
    },
  });

  await Promise.all([
    sendBookingConfirmationEmail({
      to: email,
      customerName: name,
      tourName: tour.name,
      date: formatDate(bookingDate),
      partySize,
      totalPriceMXN,
      bookingId: booking.id,
    }),
    sendAdminBookingAlert({
      tourName: tour.name,
      date: formatDate(bookingDate),
      partySize,
      customerName: name,
      email,
      phone,
      totalPriceMXN,
      source: "MANUAL",
    }),
  ]);

  return NextResponse.json({ booking });
}
