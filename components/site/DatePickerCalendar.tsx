"use client";

import { useEffect, useMemo, useState } from "react";
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
  isBefore,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DayAvailability } from "@/lib/availability";

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function monthKey(month: Date) {
  return format(month, "yyyy-MM");
}

export default function DatePickerCalendar({
  tourId,
  partySize,
  selectedDate,
  onSelect,
}: {
  tourId: string;
  partySize: number;
  selectedDate: string | null;
  onSelect: (date: string, remaining: number) => void;
}) {
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [cache, setCache] = useState<Record<string, Record<string, DayAvailability>>>({});
  const [loading, setLoading] = useState(false);

  const todayStart = useMemo(() => startOfMonth(new Date()), []);
  const key = monthKey(month);
  const monthData = cache[key];

  useEffect(() => {
    if (cache[key]) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-month-change, not derived state
    setLoading(true);
    fetch(`/api/availability/month?tourId=${tourId}&month=${key}`)
      .then((res) => res.json())
      .then((data: { days: DayAvailability[] }) => {
        if (cancelled) return;
        const byDate: Record<string, DayAvailability> = {};
        for (const d of data.days) byDate[d.date] = d;
        setCache((prev) => ({ ...prev, [key]: byDate }));
      })
      .catch(() => {
        if (!cancelled) setCache((prev) => ({ ...prev, [key]: {} }));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [key, tourId, cache]);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month));
    const end = endOfWeek(endOfMonth(month));
    return eachDayOfInterval({ start, end });
  }, [month]);

  return (
    <div className="bg-surface-hover border-border-strong rounded-xl border p-3 shadow-xl">
      <div className="mb-2 flex items-center justify-between px-1">
        <p className="text-sm font-bold text-white">{format(month, "MMMM yyyy")}</p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setMonth((m) => subMonths(m, 1))}
            disabled={!isBefore(todayStart, month)}
            className="rounded-full p-1 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setMonth((m) => addMonths(m, 1))}
            className="rounded-full p-1 text-white transition hover:bg-white/10"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-white/40">
        {WEEKDAY_LABELS.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const inMonth = isSameMonth(day, month);
          const isPast = isBefore(day, new Date(new Date().setHours(0, 0, 0, 0)));
          const info = monthData?.[dateKey];
          const fitsParty = info ? info.remaining >= partySize : undefined;
          const unavailable = isPast || info?.soldOut;
          const limited = !unavailable && info && !fitsParty;
          const selected = selectedDate === dateKey;

          return (
            <button
              key={dateKey}
              type="button"
              disabled={!inMonth || isPast || info?.soldOut || loading}
              onClick={() => info && onSelect(dateKey, info.remaining)}
              title={
                info?.blocked
                  ? "Unavailable"
                  : info?.soldOut
                    ? "Sold out"
                    : limited
                      ? `Only ${info?.remaining} spot${info?.remaining === 1 ? "" : "s"} left`
                      : undefined
              }
              className={cn(
                "relative flex aspect-square items-center justify-center rounded-lg text-xs font-semibold transition",
                !inMonth && "invisible",
                inMonth && !isPast && !unavailable && "text-white hover:bg-white/10",
                isPast && "text-white/20",
                unavailable && !isPast && "cursor-not-allowed text-white/30 line-through",
                limited && "bg-brand-yellow/20 text-white",
                selected && "bg-brand-red text-white hover:bg-brand-red",
                isToday(day) && !selected && "ring-brand-ocean/60 ring-1"
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/10 px-1 pt-2 text-[11px] text-white/50">
        <span className="flex items-center gap-1.5">
          <span className="ring-brand-ocean/40 h-2 w-2 rounded-full bg-white/10 ring-1" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="bg-brand-yellow/60 h-2 w-2 rounded-full" />
          Limited spots
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          Unavailable
        </span>
      </div>
    </div>
  );
}
