import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy",
  description: "Our cancellation, rescheduling and refund policy for tours booked online.",
};

const LAST_UPDATED = "November 11, 2026";

export default function CancellationPolicyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        Cancellation &amp; Refund Policy
      </h1>
      <p className="mt-2 text-sm text-white/50">Last updated: {LAST_UPDATED}</p>

      <div className="mt-10 space-y-10">
        <div className="rounded-2xl border border-border-soft bg-surface p-6">
          <p className="text-white/80">
            <strong className="text-white">Quick summary:</strong> cancel 48+ hours before your
            tour for a full refund. Cancel 24–48 hours before for a 50% refund. Cancellations
            inside 24 hours and no-shows aren&apos;t refundable. If <em>we</em> cancel because of
            weather or safety, you get a full refund or a free reschedule — your choice.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">If you need to cancel</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-white/70">
            <li>
              <strong className="text-white">48 hours or more</strong> before your tour&apos;s
              start time — full refund to your original payment method.
            </li>
            <li>
              <strong className="text-white">24–48 hours</strong> before — 50% refund.
            </li>
            <li>
              <strong className="text-white">Less than 24 hours</strong> before, or a no-show —
              no refund, since we&apos;ve already reserved your spot on the boat.
            </li>
          </ul>
          <p className="mt-3 text-white/70">
            To cancel or reschedule, message us on{" "}
            <a href="https://wa.me/529871052528" className="text-brand-ocean font-semibold">
              WhatsApp
            </a>{" "}
            or email{" "}
            <a href="mailto:info@maybetours.com" className="text-brand-ocean font-semibold">
              info@maybetours.com
            </a>{" "}
            with your booking reference as early as possible. Refunds are returned to the card
            used at checkout and can take 5–10 business days to appear, depending on your bank.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">If we need to cancel</h2>
          <p className="mt-3 text-white/70">
            Conditions in the open water can change fast. If our team determines a tour isn&apos;t
            safe to run — due to weather, sea conditions, or a mechanical issue — we&apos;ll
            contact you as soon as possible to either reschedule your tour for another available
            date at no extra cost, or issue a full refund. This is always your choice, and it
            never costs you anything extra.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">Rescheduling</h2>
          <p className="mt-3 text-white/70">
            Want to move your booking to a different date instead of cancelling? Message us at
            least 24 hours before your original tour time and we&apos;ll move it to another
            available date at no charge, subject to availability.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">Group &amp; private charter bookings</h2>
          <p className="mt-3 text-white/70">
            Private charters and large group bookings reserve an entire boat for your party, so
            the same windows above apply, but we may ask for more advance notice on groups of 8
            or more — this will be confirmed with you at the time of booking if it applies.
          </p>
        </div>
      </div>
    </section>
  );
}
