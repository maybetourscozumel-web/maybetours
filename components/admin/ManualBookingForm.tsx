"use client";

import { useState } from "react";
import { formatMXN } from "@/lib/utils";

type TourOption = {
  id: string;
  name: string;
  priceMXN: number;
  priceType: "PER_PERSON" | "FLAT_PER_BOAT";
  maxGroupSize: number;
};

type Props = {
  tours: TourOption[];
  defaultDate: string;
  onCreated: () => void;
  onCancel: () => void;
};

export default function ManualBookingForm({ tours, defaultDate, onCreated, onCancel }: Props) {
  const [tourId, setTourId] = useState(tours[0]?.id ?? "");
  const [date, setDate] = useState(defaultDate);
  const [partySize, setPartySize] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"UNPAID" | "PAID_MANUAL">("PAID_MANUAL");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const selectedTour = tours.find((t) => t.id === tourId);
  const total = selectedTour
    ? selectedTour.priceType === "PER_PERSON"
      ? selectedTour.priceMXN * partySize
      : selectedTour.priceMXN
    : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId,
          date,
          partySize,
          name,
          email,
          phone,
          notes: notes || undefined,
          paymentStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create booking.");
        setSubmitting(false);
        return;
      }
      onCreated();
    } catch {
      setError("Could not create booking.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-xs font-semibold text-white">
        Tour
        <select
          value={tourId}
          onChange={(e) => setTourId(e.target.value)}
          className="rounded-lg border border-border-strong bg-white/5 px-3 py-2 text-sm text-white"
        >
          {tours.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-xs font-semibold text-white">
          Date
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-border-strong bg-white/5 px-3 py-2 text-sm text-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-white">
          Party size
          <input
            type="number"
            min={1}
            max={selectedTour?.maxGroupSize ?? 50}
            value={partySize}
            onChange={(e) => setPartySize(Number(e.target.value) || 1)}
            className="rounded-lg border border-border-strong bg-white/5 px-3 py-2 text-sm text-white"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs font-semibold text-white">
        Customer name
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-border-strong bg-white/5 px-3 py-2 text-sm text-white"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-xs font-semibold text-white">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-border-strong bg-white/5 px-3 py-2 text-sm text-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-white">
          Phone
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-lg border border-border-strong bg-white/5 px-3 py-2 text-sm text-white"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs font-semibold text-white">
        Notes (optional)
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="rounded-lg border border-border-strong bg-white/5 px-3 py-2 text-sm text-white"
        />
      </label>

      <label className="flex flex-col gap-1 text-xs font-semibold text-white">
        Payment
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value as "UNPAID" | "PAID_MANUAL")}
          className="rounded-lg border border-border-strong bg-white/5 px-3 py-2 text-sm text-white"
        >
          <option value="PAID_MANUAL">Paid (cash/card in person)</option>
          <option value="UNPAID">Unpaid / pay on arrival</option>
        </select>
      </label>

      <div className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 text-sm font-bold text-white">
        <span>Total</span>
        <span>{formatMXN(total)}</span>
      </div>

      {error && <p className="text-brand-red text-xs font-semibold">{error}</p>}

      <div className="mt-1 flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="border-border-strong flex-1 rounded-full border px-4 py-2 text-sm font-semibold text-white/70"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-full bg-brand-red px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Add Booking"}
        </button>
      </div>
    </form>
  );
}
