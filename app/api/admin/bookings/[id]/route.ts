import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateBookingSchema } from "@/lib/validation";
import { toDateOnly } from "@/lib/availability";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid request" },
      { status: 400 }
    );
  }

  const { date, ...rest } = parsed.data;

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      ...rest,
      ...(date ? { date: toDateOnly(date) } : {}),
    },
    include: { tour: { select: { name: true, slug: true } } },
  });

  return NextResponse.json({ booking });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const booking = await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
  return NextResponse.json({ booking });
}
