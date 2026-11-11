"use client";

import { useMemo, useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
  parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { cn, formatMXN } from "@/lib/utils";
import ManualBookingForm from "./ManualBookingForm";

export type CalendarBooking = {
  id: string;
  date: string; // ISO
  tourId: string;
  tourName: string;
  customerName: string;
  partySize: number;
  status: string;
  totalPriceMXN: number;
};

type TourOption = {
  id: string;
  name: string;
  priceMXN: number;
  priceType: "PER_PERSON" | "FLAT_PER_BOAT";
  maxGroupSize: number;
};

const STATUS_DOT: Record<string, string> = {
  CONFIRMED: "bg-brand-ocean",
  PENDING_PAYMENT: "bg-brand-yellow",
  COMPLETED: "bg-white/30",
  CANCELLED: "bg-white/15",
  NO_SHOW: "bg-brand-red",
};

export default function CalendarMonth({
  month,
  bookings,
  tours,
  onMonthChange,
  onRefresh,
}: {
  month: Date;
  bookings: CalendarBooking[];
  tours: TourOption[];
  onMonthChange: (month: Date) => void;
  onRefresh: () => void;
}) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month));
    const end = endOfWeek(endOfMonth(month));
    return eachDayOfInterval({ start, end });
  }, [month]);

  const bookingsByDay = useMemo(() => {
    const map = new Map<string, CalendarBooking[]>();
    for (const b of bookings) {
      const key = b.date.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(b);
    }
    return map;
  }, [bookings]);

  const selectedBookings = selectedDay ? (bookingsByDay.get(selectedDay) ?? []) : [];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
      <div className="border-border-soft bg-surface rounded-xl border p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">{format(month, "MMMM yyyy")}</h2>
          <div className="flex gap-1">
            <button
              onClick={() => onMonthChange(subMonths(month, 1))}
              className="rounded-full p-1.5 text-white hover:bg-white/10"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => onMonthChange(addMonths(month, 1))}
              className="rounded-full p-1.5 text-white hover:bg-white/10"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-white/40">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const dayBookings = bookingsByDay.get(key) ?? [];
            const guests = dayBookings.reduce((sum, b) => sum + b.partySize, 0);
            const inMonth = isSameMonth(day, month);
            const selected = selectedDay === key;

            return (
              <button
                key={key}
                onClick={() => setSelectedDay(key)}
                className={cn(
                  "flex min-h-20 flex-col items-start rounded-lg border p-1.5 text-left text-xs text-white transition",
                  inMonth ? "bg-white/5" : "bg-white/[0.02] text-white/30",
                  selected ? "border-brand-red ring-brand-red ring-1" : "border-white/10",
                  isToday(day) && !selected && "border-brand-ocean"
                )}
              >
                <span className={cn("font-semibold", isToday(day) && "text-brand-ocean")}>
                  {format(day, "d")}
                </span>
                {dayBookings.length > 0 && (
                  <div className="mt-1 flex w-full flex-col gap-0.5">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-white">
                      <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[dayBookings[0].status] ?? "bg-white/30")} />
                      {dayBookings.length} booking{dayBookings.length > 1 ? "s" : ""}
                    </span>
                    <span className="text-[11px] text-white/40">{guests} guests</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-border-soft bg-surface rounded-xl border p-4 shadow-sm">
        {selectedDay ? (
          <>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-bold text-white">
                {format(parseISO(selectedDay), "EEEE, MMM d")}
              </h3>
              <button
                onClick={() => setShowForm((s) => !s)}
                className="flex items-center gap-1 rounded-full bg-brand-red px-3 py-1.5 text-xs font-bold text-white"
              >
                {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                {showForm ? "Close" : "Add Booking"}
              </button>
            </div>

            {showForm && (
              <div className="border-border-soft mb-4 rounded-lg border p-3">
                <ManualBookingForm
                  tours={tours}
                  defaultDate={selectedDay}
                  onCreated={() => {
                    setShowForm(false);
                    onRefresh();
                  }}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            )}

            {selectedBookings.length === 0 ? (
              <p className="py-6 text-center text-sm text-white/40">No bookings this day.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {selectedBookings.map((b) => (
                  <li key={b.id} className="border-border-soft rounded-lg border p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-white">{b.tourName}</p>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold text-white",
                          STATUS_DOT[b.status] ?? "bg-white/30"
                        )}
                      >
                        {b.status}
                      </span>
                    </div>
                    <p className="mt-1 text-white/60">
                      {b.customerName} · {b.partySize} guests
                    </p>
                    <p className="text-white/40">{formatMXN(b.totalPriceMXN)}</p>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <p className="py-10 text-center text-sm text-white/40">
            Select a day to see bookings and add a new one.
          </p>
        )}
      </div>
    </div>
  );
}
