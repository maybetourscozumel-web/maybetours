import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const tours = await prisma.tour.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } });

  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/tours`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/cruise-excursions`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/playa-del-carmen`, changeFrequency: "monthly", priority: 0.8 },
    ...tours.map((t) => ({
      url: `${siteUrl}/tours/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
