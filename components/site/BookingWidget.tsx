"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Minus, Plus, CalendarDays, ShieldCheck, Lock } from "lucide-react";
import { formatMXN } from "@/lib/utils";
import DatePickerCalendar from "./DatePickerCalendar";

type Props = {
  tourId: string;
  priceMXN: number;
  priceType: "PER_PERSON" | "FLAT_PER_BOAT";
  maxGroupSize: number;
  stripeEnabled: boolean;
};

export default function BookingWidget({
  tourId,
  priceMXN,
  priceType,
  maxGroupSize,
  stripeEnabled,
}: Props) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [partySize, setPartySize] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPrice = priceType === "PER_PERSON" ? priceMXN * partySize : priceMXN;
  const notEnoughSpots = date !== "" && remaining !== null && remaining < partySize;

  function handleSelectDate(value: string, dayRemaining: number) {
    setDate(value);
    setRemaining(dayRemaining);
    setCalendarOpen(false);
  }

  function adjustPartySize(delta: number) {
    setPartySize((prev) => Math.min(Math.max(prev + delta, 1), maxGroupSize));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!date) {
      setError("Please choose a date.");
      return;
    }
    if (notEnoughSpots) {
      setError("Not enough spots left on this date for your party size.");
      return;
    }
    if (!name || !email || !phone) {
      setError("Please fill in your name, email and phone.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tourId, date, partySize, name, email, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        router.push(`/booking/confirmation?bookingId=${data.bookingId}`);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form
      id="book"
      onSubmit={handleSubmit}
      className="border-border-soft bg-surface flex scroll-mt-24 flex-col gap-4 rounded-2xl border p-6 shadow-lg lg:sticky lg:top-24"
    >
      <div>
        <p className="text-brand-yellow text-2xl font-extrabold">{formatMXN(priceMXN)}</p>
        <p className="text-sm text-white/50">
          {priceType === "PER_PERSON" ? "per person" : "per private boat"}
        </p>
      </div>

      <div className="relative">
        <label className="mb-1 block text-sm font-semibold text-white">Date</label>
        <button
          type="button"
          onClick={() => setCalendarOpen((o) => !o)}
          className="border-border-strong focus:border-brand-ocean flex w-full items-center justify-between rounded-lg border bg-white/5 px-3 py-2.5 text-left text-base text-white outline-none transition"
        >
          <span className={date ? "font-semibold text-white" : "text-white/40"}>
            {date ? format(parseISO(date), "EEEE, MMM d, yyyy") : "Select a date"}
          </span>
          <CalendarDays className="text-brand-ocean h-4 w-4" />
        </button>

        {calendarOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setCalendarOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute left-0 right-0 top-full z-20 mt-2">
              <DatePickerCalendar
                tourId={tourId}
                partySize={partySize}
                selectedDate={date || null}
                onSelect={handleSelectDate}
              />
            </div>
          </>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold text-white">Party size</label>
        <div className="border-border-strong flex items-center justify-between rounded-lg border bg-white/5 px-3 py-1.5">
          <button
            type="button"
            onClick={() => adjustPartySize(-1)}
            disabled={partySize <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Decrease party size"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="text-base font-bold text-white">
            {partySize} {partySize === 1 ? "person" : "people"}
          </span>
          <button
            type="button"
            onClick={() => adjustPartySize(1)}
            disabled={partySize >= maxGroupSize}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Increase party size"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <span className="mt-1 block text-xs text-white/40">Max {maxGroupSize} people</span>
      </div>

      {date && remaining !== null && (
        <p
          className={`text-sm font-semibold ${notEnoughSpots ? "text-brand-red" : "text-brand-ocean"}`}
        >
          {notEnoughSpots
            ? "Sorry, not enough spots left on this date."
            : remaining <= 5
              ? `Only ${remaining} spots left on this date`
              : `${remaining} spots left on this date`}
        </p>
      )}

      <div className="h-px bg-white/10" />

      <label className="flex flex-col gap-1 text-sm font-semibold text-white">
        Full name
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-border-strong focus:border-brand-ocean rounded-lg border bg-white/5 px-3 py-2 text-base text-white outline-none placeholder:text-white/30"
          placeholder="Jane Doe"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-semibold text-white">
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-border-strong focus:border-brand-ocean rounded-lg border bg-white/5 px-3 py-2 text-base text-white outline-none placeholder:text-white/30"
          placeholder="jane@example.com"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-semibold text-white">
        Phone / WhatsApp
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border-border-strong focus:border-brand-ocean rounded-lg border bg-white/5 px-3 py-2 text-base text-white outline-none placeholder:text-white/30"
          placeholder="+1 555 123 4567"
        />
      </label>

      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-sm font-semibold text-white/60">Total</span>
        <span className="text-xl font-extrabold text-white">{formatMXN(totalPrice)}</span>
      </div>

      {error && <p className="text-brand-red text-sm font-semibold">{error}</p>}

      {!stripeEnabled && (
        <p className="bg-brand-yellow/10 text-brand-yellow rounded-lg px-3 py-2 text-xs">
          Online payments are being set up. Submitting will reserve your spot and our team will
          follow up to confirm payment.
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || notEnoughSpots}
        className="rounded-full bg-brand-red px-6 py-3.5 text-base font-bold text-white shadow-md transition hover:bg-brand-red/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Processing…" : stripeEnabled ? "Reserve & Pay" : "Reserve Now"}
      </button>

      <p className="text-center text-[11px] text-white/40">
        By booking, you agree to our{" "}
        <Link href="/terms" className="text-white/60 underline hover:text-white">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/cancellation-policy" className="text-white/60 underline hover:text-white">
          Cancellation Policy
        </Link>
        .
      </p>

      <div className="flex items-center justify-center gap-4 text-[11px] text-white/40">
        {stripeEnabled && (
          <span className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Secure checkout
          </span>
        )}
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3 w-3" />
          Instant confirmation
        </span>
      </div>
    </form>
  );
}
