import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { blackoutSchema } from "@/lib/validation";
import { toDateOnly } from "@/lib/availability";

export async function GET() {
  const blackouts = await prisma.dateBlock.findMany({
    include: { tour: { select: { name: true } } },
    orderBy: { date: "asc" },
  });
  return NextResponse.json({ blackouts });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = blackoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid request" },
      { status: 400 }
    );
  }
  const { date, tourId, reason } = parsed.data;
  const blackout = await prisma.dateBlock.create({
    data: { date: toDateOnly(date), tourId: tourId || null, reason },
  });
  return NextResponse.json({ blackout });
}
