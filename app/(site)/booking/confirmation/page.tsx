import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { formatDate, formatMXN } from "@/lib/utils";
import { CheckCircle2, Clock } from "lucide-react";
import ConfettiBurst from "@/components/site/ConfettiBurst";

type Props = {
  searchParams: Promise<{ session_id?: string; bookingId?: string }>;
};

export default async function ConfirmationPage({ searchParams }: Props) {
  const { session_id, bookingId } = await searchParams;

  let resolvedBookingId = bookingId;

  if (session_id) {
    const stripe = getStripe();
    if (stripe) {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      resolvedBookingId = session.metadata?.bookingId;
    }
  }

  const booking = resolvedBookingId
    ? await prisma.booking.findUnique({
        where: { id: resolvedBookingId },
        include: { tour: true },
      })
    : null;

  if (!booking) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-extrabold text-white">We couldn&apos;t find that booking</h1>
        <p className="mt-3 text-white/60">
          If you just paid, give it a moment and refresh, or contact us on WhatsApp and we&apos;ll
          confirm manually.
        </p>
        <Link href="/tours" className="text-brand-ocean mt-6 inline-block font-semibold">
          ← Back to tours
        </Link>
      </div>
    );
  }

  const isConfirmed = booking.status === "CONFIRMED";

  return (
    <div className="mx-auto max-w-xl px-4 py-20 sm:px-6">
      {isConfirmed && <ConfettiBurst />}
      <div className="flex flex-col items-center text-center">
        {isConfirmed ? (
          <CheckCircle2 className="animate-pop-in text-brand-ocean h-14 w-14" />
        ) : (
          <Clock className="text-brand-yellow h-14 w-14" />
        )}
        <h1 className="mt-4 text-3xl font-extrabold text-white">
          {isConfirmed ? "Booking Confirmed!" : "Booking Received"}
        </h1>
        <p className="mt-2 text-white/60">
          {isConfirmed
            ? "We've sent a confirmation email with all the details."
            : "We're finalizing your payment — you'll get a confirmation email shortly."}
        </p>
      </div>

      <div className="border-border-soft bg-surface mt-8 rounded-2xl border p-6 shadow-sm">
        <h2 className="text-lg font-bold text-white">{booking.tour.name}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-white/50">Date</dt>
            <dd className="font-semibold text-white">{formatDate(booking.date)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-white/50">Party size</dt>
            <dd className="font-semibold text-white">{booking.partySize}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-white/50">Total</dt>
            <dd className="font-semibold text-white">{formatMXN(booking.totalPriceMXN)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-white/50">Booking reference</dt>
            <dd className="font-mono text-xs font-semibold text-white">{booking.id}</dd>
          </div>
        </dl>
      </div>

      <p className="mt-6 text-center text-sm text-white/60">
        Questions? WhatsApp us at{" "}
        <a href="https://wa.me/529871052528" className="text-brand-ocean font-semibold">
          +52 987 105 2528
        </a>
      </p>
    </div>
  );
}
