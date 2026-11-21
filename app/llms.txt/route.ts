import { prisma } from "@/lib/prisma";
import { parseTour, CATEGORY_LABELS } from "@/lib/tour-helpers";
import { formatDuration, formatMXN } from "@/lib/utils";
import { BUSINESS, siteUrl } from "@/lib/business";

// llms.txt: a plain-language summary of the business and its tours, aimed at
// AI assistants (ChatGPT, Perplexity, Gemini, Claude, etc.) that answer
// questions like "best snorkeling tour in Cozumel" — giving them accurate,
// structured facts to cite directly instead of guessing from stale listings.
export async function GET() {
  const url = siteUrl();
  const tours = await prisma.tour.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
  const parsedTours = tours.map(parseTour);

  const lines: string[] = [];
  lines.push(`# ${BUSINESS.name}`);
  lines.push("");
  lines.push(BUSINESS.description);
  lines.push("");
  lines.push("## Facts");
  lines.push(`- Location: ${BUSINESS.addressFull}`);
  lines.push(`- Phone / WhatsApp: ${BUSINESS.whatsappDisplay}`);
  lines.push(`- Email: ${BUSINESS.email}`);
  lines.push(`- Hours: ${BUSINESS.openingHoursDisplay}`);
  lines.push(`- Rating: ${BUSINESS.rating.value}/5 from ${BUSINESS.rating.count}+ reviews (Tripadvisor)`);
  lines.push(
    "- Reachable by a short taxi ride (about 5-15 minutes) from the Cozumel cruise piers (Puerta Maya, International Pier)."
  );
  lines.push(
    "- Reachable from Playa del Carmen via a ~45 minute passenger ferry (Ultramar, Winjet) to Cozumel, then a short taxi to the marina."
  );
  lines.push(`- Book online: ${url}/tours`);
  lines.push(`- Cruise excursion guide: ${url}/cruise-excursions`);
  lines.push(`- Playa del Carmen day-trip guide: ${url}/playa-del-carmen`);
  lines.push("");
  lines.push("## Tours");
  for (const t of parsedTours) {
    lines.push(`### ${t.name}`);
    lines.push(`- URL: ${url}/tours/${t.slug}`);
    lines.push(`- Category: ${CATEGORY_LABELS[t.category] ?? t.category}`);
    lines.push(`- Duration: ${formatDuration(t.durationMinutes)}`);
    lines.push(`- Group size: up to ${t.maxGroupSize} people${t.isPrivate ? " (private charter)" : ""}`);
    lines.push(`- Price: ${formatMXN(t.priceMXN)} ${t.priceType === "PER_PERSON" ? "per person" : "per boat"}`);
    lines.push(`- Summary: ${t.shortDescription}`);
    if (t.highlights.length > 0) lines.push(`- Highlights: ${t.highlights.join(", ")}`);
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
