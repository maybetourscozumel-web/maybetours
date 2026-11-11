import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { sendBookingConfirmationEmail, sendAdminBookingAlert } from "@/lib/email";
import { formatDate } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature ?? "", webhookSecret);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    if (!bookingId) {
      return NextResponse.json({ received: true });
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CONFIRMED", paymentStatus: "PAID_ONLINE", expiresAt: null },
      include: { tour: true },
    });

    await Promise.all([
      sendBookingConfirmationEmail({
        to: booking.email,
        customerName: booking.customerName,
        tourName: booking.tour.name,
        date: formatDate(booking.date),
        partySize: booking.partySize,
        totalPriceMXN: booking.totalPriceMXN,
        bookingId: booking.id,
      }),
      sendAdminBookingAlert({
        tourName: booking.tour.name,
        date: formatDate(booking.date),
        partySize: booking.partySize,
        customerName: booking.customerName,
        email: booking.email,
        phone: booking.phone,
        totalPriceMXN: booking.totalPriceMXN,
        source: "ONLINE",
      }),
    ]);
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      await prisma.booking
        .update({
          where: { id: bookingId },
          data: { status: "CANCELLED" },
        })
        .catch(() => {});
    }
  }

  return NextResponse.json({ received: true });
}
