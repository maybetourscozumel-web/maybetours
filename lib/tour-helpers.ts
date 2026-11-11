import type { Tour } from "@prisma/client";

export type TourWithParsedFields = Omit<Tour, "included" | "excluded" | "highlights"> & {
  included: string[];
  excluded: string[];
  highlights: string[];
};

export function parseTour(tour: Tour): TourWithParsedFields {
  return {
    ...tour,
    included: safeParseArray(tour.included),
    excluded: safeParseArray(tour.excluded),
    highlights: safeParseArray(tour.highlights),
  };
}

function safeParseArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const CATEGORY_LABELS: Record<string, string> = {
  SNORKELING: "Snorkeling",
  DIVING: "Diving",
  WATERSPORT: "Watersport",
  PRIVATE: "Private Charter",
};

export type FAQItem = { question: string; answer: string };

/** Generic but tour-accurate FAQ content, built from the tour's own data. */
export function buildTourFAQs(tour: TourWithParsedFields): FAQItem[] {
  const isWatersport = tour.category === "WATERSPORT";
  const isDiving = tour.category === "DIVING";
  const faqs: FAQItem[] = [];

  faqs.push({
    question: "What's included?",
    answer: tour.included.join(", ") + ".",
  });

  if (tour.excluded.length > 0) {
    faqs.push({
      question: "What's not included?",
      answer: tour.excluded.join(", ") + ".",
    });
  }

  faqs.push({
    question: "Do I need to know how to swim?",
    answer: isWatersport
      ? "No swimming skills needed — life jackets are provided and our crew will brief you before you start."
      : isDiving
        ? "No prior diving experience is required for this shore dive — you'll get a short theory class and practice session before heading in, with personalized instructor attention throughout."
        : "Basic comfort in the water helps, but you don't need to be a strong swimmer — life jackets are provided and our guides stay with the group the whole time.",
  });

  faqs.push({
    question: "What should I bring?",
    answer: isDiving
      ? "Just your swimsuit, a towel, and reef-safe sunscreen — diving equipment is included. A change of clothes for after is a good idea too."
      : "Swimsuit (worn under your clothes), a towel, reef-safe sunscreen, and a light layer for the boat ride. Cash is handy for tips or souvenirs.",
  });

  faqs.push({
    question: "Where do we meet?",
    answer: `${tour.meetingPoint}. We recommend arriving about 15 minutes before your departure time.`,
  });

  faqs.push({
    question: "What if the weather is bad?",
    answer:
      "Safety comes first. If conditions aren't safe to go out, our team will reach out to reschedule your tour. If you have questions before your trip, message us anytime on WhatsApp.",
  });

  if (tour.excluded.some((e) => /tip/i.test(e))) {
    faqs.push({
      question: "Is gratuity included?",
      answer:
        "Gratuities aren't included in the price — tipping your captain and guide is always appreciated but entirely optional.",
    });
  }

  faqs.push({
    question: "Can kids join?",
    answer:
      "Children are welcome on most tours. If you're traveling with young kids or non-swimmers, message us on WhatsApp first so we can recommend the best option and confirm life jacket sizes.",
  });

  return faqs;
}
