import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { getTourAvailability, computeTotalPrice, toDateOnly, PENDING_HOLD_MINUTES } from "@/lib/availability";
import { createBookingSchema } from "@/lib/validation";
import { sendBookingConfirmationEmail, sendAdminBookingAlert } from "@/lib/email";
import { formatDate } from "@/lib/utils";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = createBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid request" },
      { status: 400 }
    );
  }
  const { tourId, date, partySize, name, email, phone, notes } = parsed.data;

  const tour = await prisma.tour.findUnique({ where: { id: tourId } });
  if (!tour || !tour.active) {
    return NextResponse.json({ error: "Tour not found" }, { status: 404 });
  }

  if (partySize > tour.maxGroupSize) {
    return NextResponse.json(
      { error: `This tour allows a maximum of ${tour.maxGroupSize} people per booking.` },
      { status: 400 }
    );
  }

  const bookingDate = toDateOnly(date);
  if (bookingDate.getTime() < toDateOnly(new Date()).getTime()) {
    return NextResponse.json({ error: "Please choose a date in the future." }, { status: 400 });
  }

  const availability = await getTourAvailability(tourId, bookingDate);
  if (availability.blocked || availability.remaining < partySize) {
    return NextResponse.json(
      { error: "Sorry, this date no longer has enough availability." },
      { status: 409 }
    );
  }

  const totalPriceMXN = computeTotalPrice(tour, partySize);

  const customer = await prisma.customer.upsert({
    where: { email },
    update: { name, phone },
    create: { email, name, phone },
  });

  const expiresAt = new Date(Date.now() + PENDING_HOLD_MINUTES * 60 * 1000);

  const booking = await prisma.booking.create({
    data: {
      tourId,
      date: bookingDate,
      partySize,
      customerName: name,
      email,
      phone,
      totalPriceMXN,
      status: "PENDING_PAYMENT",
      paymentStatus: "UNPAID",
      source: "ONLINE",
      notes,
      expiresAt,
      customerId: customer.id,
    },
  });

  const stripe = getStripe();

  if (stripe) {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: tour.name,
              description: `${formatDate(bookingDate)} · Party of ${partySize}`,
            },
            unit_amount: Math.round(
              (tour.priceType === "PER_PERSON" ? tour.priceMXN : totalPriceMXN) * 100
            ),
          },
          quantity: tour.priceType === "PER_PERSON" ? partySize : 1,
        },
      ],
      success_url: `${SITE_URL}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/tours/${tour.slug}`,
      metadata: { bookingId: booking.id },
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ bookingId: booking.id, checkoutUrl: session.url });
  }

  // Stripe not configured yet — confirm the hold directly so the site still works end-to-end,
  // and flag it for manual payment follow-up.
  await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "CONFIRMED", paymentStatus: "UNPAID", expiresAt: null },
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
      source: "ONLINE",
    }),
  ]);

  return NextResponse.json({ bookingId: booking.id, checkoutUrl: null });
}
