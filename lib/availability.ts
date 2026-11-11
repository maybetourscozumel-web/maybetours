import { prisma } from "./prisma";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Normalizes any date/string to a UTC midnight Date (tours are booked by day, not time). */
export function toDateOnly(d: Date | string): Date {
  const date = new Date(d);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export type AvailabilityResult = {
  remaining: number;
  soldOut: boolean;
  blocked: boolean;
  dailyCapacity: number;
  maxGroupSize: number;
};

/**
 * Remaining inventory for a tour on a given date.
 * Shared tours: dailyCapacity minus the party sizes of CONFIRMED and
 * still-live PENDING_PAYMENT bookings (expired holds are excluded so
 * abandoned Stripe checkouts don't permanently eat capacity).
 * Private (whole-boat) tours: any live booking that date takes the whole day.
 */
export async function getTourAvailability(
  tourId: string,
  date: Date | string
): Promise<AvailabilityResult> {
  const day = toDateOnly(date);
  const nextDay = new Date(day.getTime() + DAY_MS);
  const now = new Date();

  const tour = await prisma.tour.findUniqueOrThrow({ where: { id: tourId } });

  const blocked = await prisma.dateBlock.findFirst({
    where: {
      date: { gte: day, lt: nextDay },
      OR: [{ tourId }, { tourId: null }],
    },
  });

  if (blocked) {
    return {
      remaining: 0,
      soldOut: true,
      blocked: true,
      dailyCapacity: tour.dailyCapacity,
      maxGroupSize: tour.maxGroupSize,
    };
  }

  const liveBookings = await prisma.booking.findMany({
    where: {
      tourId,
      date: { gte: day, lt: nextDay },
      OR: [
        { status: "CONFIRMED" },
        {
          status: "PENDING_PAYMENT",
          OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
        },
      ],
    },
    select: { partySize: true },
  });

  if (tour.isPrivate) {
    const taken = liveBookings.length > 0;
    return {
      remaining: taken ? 0 : tour.maxGroupSize,
      soldOut: taken,
      blocked: false,
      dailyCapacity: tour.dailyCapacity,
      maxGroupSize: tour.maxGroupSize,
    };
  }

  const used = liveBookings.reduce((sum, b) => sum + b.partySize, 0);
  const remaining = Math.max(0, tour.dailyCapacity - used);
  return {
    remaining,
    soldOut: remaining <= 0,
    blocked: false,
    dailyCapacity: tour.dailyCapacity,
    maxGroupSize: tour.maxGroupSize,
  };
}

export type DayAvailability = {
  date: string; // YYYY-MM-DD
  remaining: number;
  soldOut: boolean;
  blocked: boolean;
};

/**
 * Availability for every day in a given month in one pass — powers the
 * booking calendar so visitors can see sold-out/blocked days at a glance
 * instead of guessing a date and getting rejected after filling in the form.
 */
export async function getTourMonthAvailability(
  tourId: string,
  year: number,
  month: number // 1-indexed
): Promise<DayAvailability[]> {
  const monthStart = new Date(Date.UTC(year, month - 1, 1));
  const monthEnd = new Date(Date.UTC(year, month, 1));
  const now = new Date();

  const tour = await prisma.tour.findUniqueOrThrow({ where: { id: tourId } });

  const [blocks, bookings] = await Promise.all([
    prisma.dateBlock.findMany({
      where: {
        date: { gte: monthStart, lt: monthEnd },
        OR: [{ tourId }, { tourId: null }],
      },
      select: { date: true },
    }),
    prisma.booking.findMany({
      where: {
        tourId,
        date: { gte: monthStart, lt: monthEnd },
        OR: [
          { status: "CONFIRMED" },
          { status: "PENDING_PAYMENT", OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
        ],
      },
      select: { date: true, partySize: true },
    }),
  ]);

  const blockedDays = new Set(blocks.map((b) => toDateOnly(b.date).toISOString().slice(0, 10)));
  const byDay = new Map<string, { count: number; party: number }>();
  for (const b of bookings) {
    const key = toDateOnly(b.date).toISOString().slice(0, 10);
    const entry = byDay.get(key) ?? { count: 0, party: 0 };
    entry.count += 1;
    entry.party += b.partySize;
    byDay.set(key, entry);
  }

  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const days: DayAvailability[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const key = new Date(Date.UTC(year, month - 1, d)).toISOString().slice(0, 10);
    const blocked = blockedDays.has(key);
    const usage = byDay.get(key) ?? { count: 0, party: 0 };

    if (blocked) {
      days.push({ date: key, remaining: 0, soldOut: true, blocked: true });
    } else if (tour.isPrivate) {
      const taken = usage.count > 0;
      days.push({
        date: key,
        remaining: taken ? 0 : tour.maxGroupSize,
        soldOut: taken,
        blocked: false,
      });
    } else {
      const remaining = Math.max(0, tour.dailyCapacity - usage.party);
      days.push({ date: key, remaining, soldOut: remaining <= 0, blocked: false });
    }
  }

  return days;
}

export function computeTotalPrice(
  tour: { priceType: string; priceMXN: number },
  partySize: number
): number {
  return tour.priceType === "PER_PERSON" ? tour.priceMXN * partySize : tour.priceMXN;
}

/** How long an online booking is held as PENDING_PAYMENT before it's released. */
export const PENDING_HOLD_MINUTES = 30;
