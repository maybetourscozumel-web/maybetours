"use client";

import { useEffect, useState, useCallback } from "react";
import { startOfMonth, endOfMonth, format } from "date-fns";
import CalendarMonth, { type CalendarBooking } from "@/components/admin/CalendarMonth";

type TourOption = {
  id: string;
  name: string;
  priceMXN: number;
  priceType: "PER_PERSON" | "FLAT_PER_BOAT";
  maxGroupSize: number;
};

export default function AdminCalendarPage() {
  const [month, setMonth] = useState(() => new Date());
  const [bookings, setBookings] = useState<CalendarBooking[]>([]);
  const [tours, setTours] = useState<TourOption[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    const from = format(startOfMonth(month), "yyyy-MM-dd");
    const to = format(endOfMonth(month), "yyyy-MM-dd");
    const res = await fetch(`/api/admin/bookings?from=${from}&to=${to}`);
    const data = await res.json();
    setBookings(
      (data.bookings ?? [])
        .filter((b: { status: string }) => b.status !== "CANCELLED")
        .map((b: { id: string; date: string; tourId: string; tour: { name: string }; customerName: string; partySize: number; status: string; totalPriceMXN: number }) => ({
          id: b.id,
          date: b.date,
          tourId: b.tourId,
          tourName: b.tour.name,
          customerName: b.customerName,
          partySize: b.partySize,
          status: b.status,
          totalPriceMXN: b.totalPriceMXN,
        }))
    );
    setLoading(false);
  }, [month]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional fetch-on-mount/month-change
    loadBookings();
  }, [loadBookings]);

  useEffect(() => {
    fetch("/api/admin/tours")
      .then((r) => r.json())
      .then((data) => setTours(data.tours ?? []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-white">Calendar</h1>
      <p className="mt-1 text-sm text-white/50">
        Bookings &amp; availability across all tours.
      </p>

      <div className="mt-6">
        {loading && bookings.length === 0 ? (
          <p className="text-sm text-white/40">Loading…</p>
        ) : (
          <CalendarMonth
            month={month}
            bookings={bookings}
            tours={tours}
            onMonthChange={setMonth}
            onRefresh={loadBookings}
          />
        )}
      </div>
    </div>
  );
}
