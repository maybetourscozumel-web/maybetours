import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { tourUpdateSchema } from "@/lib/validation";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = tourUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid request" },
      { status: 400 }
    );
  }

  const tour = await prisma.tour.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ tour });
}
