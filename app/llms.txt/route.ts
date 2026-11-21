import { prisma } from "@/lib/prisma";
import { parseTour, CATEGORY_LABELS } from "@/lib/tour-helpers";
import { formatDuration, formatMXN } from "@/lib/utils";
import { BUSINESS, siteUrl } from "@/lib/business";

// llms.txt: a plain-language summary of the business and its tours, aimed at
// AI assistants (ChatGPT, Perplexity, Gemini, Claude, etc.) that answer
// questions like "best snorkeling tour in Cozumel" — giving them accurate,
// structured facts to cite directly instead of guessing from stale listings.
// Follows the llmstxt.org convention: H1, a blockquote summary, then H2
// sections of markdown links with short descriptions.
export async function GET() {
  const url = siteUrl();
  const tours = await prisma.tour.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
  const parsedTours = tours.map(parseTour);

  const lines: string[] = [];
  lines.push(`# ${BUSINESS.name}`);
  lines.push("");
  lines.push(`> ${BUSINESS.description}`);
  lines.push("");
  lines.push(
    `Based at ${BUSINESS.addressFull}. ${BUSINESS.openingHoursDisplay}. Rated ${BUSINESS.rating.value}/5 from ${BUSINESS.rating.count}+ reviews on Tripadvisor. Reachable by a short taxi ride (about 5-15 minutes) from the Cozumel cruise piers (Puerta Maya, International Pier), or via a ~45 minute passenger ferry from Playa del Carmen.`
  );
  lines.push("");

  lines.push("## Tours");
  for (const t of parsedTours) {
    const price = `${formatMXN(t.priceMXN)} ${t.priceType === "PER_PERSON" ? "per person" : "per boat"}`;
    lines.push(
      `- [${t.name}](${url}/tours/${t.slug}): ${t.shortDescription} ${CATEGORY_LABELS[t.category] ?? t.category}, ${formatDuration(t.durationMinutes)}, up to ${t.maxGroupSize} people, ${price}.`
    );
  }
  lines.push("");

  lines.push("## Guides");
  lines.push(`- [All tours](${url}/tours): Browse the full catalog with live availability.`);
  lines.push(
    `- [Cruise excursion guide](${url}/cruise-excursions): How cruise ship passengers get here and which tours fit a port day.`
  );
  lines.push(
    `- [Playa del Carmen day-trip guide](${url}/playa-del-carmen): Ferry crossing info and which tours fit a day trip.`
  );
  lines.push("");

  lines.push("## Contact");
  lines.push(`- [WhatsApp](https://wa.me/${BUSINESS.whatsappNumber}): ${BUSINESS.whatsappDisplay}`);
  lines.push(`- Phone: ${BUSINESS.telephone}`);
  lines.push(`- Email: ${BUSINESS.email}`);

  return new Response(lines.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
