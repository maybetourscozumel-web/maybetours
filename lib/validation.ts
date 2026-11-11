import { z } from "zod";

export const createBookingSchema = z.object({
  tourId: z.string().min(1),
  date: z.string().min(1), // YYYY-MM-DD
  partySize: z.number().int().min(1).max(50),
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().min(5).max(40),
  notes: z.string().max(1000).optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

export const manualBookingSchema = createBookingSchema.extend({
  paymentStatus: z.enum(["UNPAID", "PAID_MANUAL"]).default("UNPAID"),
});

export const updateBookingSchema = z.object({
  date: z.string().optional(),
  partySize: z.number().int().min(1).max(50).optional(),
  status: z.enum(["PENDING_PAYMENT", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"]).optional(),
  paymentStatus: z.enum(["UNPAID", "PAID_ONLINE", "PAID_MANUAL", "REFUNDED"]).optional(),
  customerName: z.string().min(1).max(200).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(5).max(40).optional(),
  notes: z.string().max(1000).nullable().optional(),
});

export const blackoutSchema = z.object({
  date: z.string().min(1),
  tourId: z.string().nullable().optional(),
  reason: z.string().max(200).optional(),
});

export const tourUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  shortDescription: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  priceMXN: z.number().int().min(0).optional(),
  dailyCapacity: z.number().int().min(1).optional(),
  maxGroupSize: z.number().int().min(1).optional(),
  active: z.boolean().optional(),
});
