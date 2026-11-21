// Single source of truth for the business's name/address/phone (NAP) and
// other facts reused across page metadata, JSON-LD structured data, and UI
// (footer, header, WhatsApp links). Keeping this in one place means an SEO
// schema and the footer can never silently drift apart.

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export const BUSINESS = {
  name: "May-Be Tours Cozumel",
  description:
    "Snorkeling, diving and watersports tours in Cozumel, Mexico — Palancar Reef, El Cielo, private catamaran charters, jet ski and more. A short taxi ride from the Cozumel cruise piers, and a quick ferry crossing from Playa del Carmen.",
  telephone: "+529873043584",
  whatsappDisplay: "+52 987 105 2528",
  whatsappNumber: "529871052528",
  email: "info@maybetours.com",
  address: {
    streetAddress: "Carr. Costera Sur Km 6.5, Zona Hotelera Sur, Marina Cozumel ASIPONA",
    addressLocality: "Cozumel",
    addressRegion: "Quintana Roo",
    postalCode: "77675",
    addressCountry: "MX",
  },
  addressFull: "Marina Cozumel ASIPONA, Carr. Costera Sur Km 6.5, Zona Hotelera Sur, 77675 Cozumel, Q.Roo",
  openingHours: "Mo-Su 09:00-17:00",
  openingHoursDisplay: "Open daily, 9:00 AM – 5:00 PM",
  rating: { value: "4.2", count: "107" },
  // Each becomes a schema.org `sameAs` entry — a trust signal search engines
  // use to connect this site to the business's other verified listings.
  sameAs: [
    "https://www.facebook.com/maybetourscozumel",
    "https://www.instagram.com/maybetourscozumel/",
    "https://www.tripadvisor.com/Attraction_Review-g150809-d17780443-Reviews-MayBe_Tours_Cozumel-Cozumel_Yucatan_Peninsula.html",
    "https://share.google/YMJU6bXJm6TTDMr3g",
  ] as string[],
  socials: {
    facebook: "https://www.facebook.com/maybetourscozumel",
    instagram: "https://www.instagram.com/maybetourscozumel/",
    tripadvisor:
      "https://www.tripadvisor.com/Attraction_Review-g150809-d17780443-Reviews-MayBe_Tours_Cozumel-Cozumel_Yucatan_Peninsula.html",
    googleBusiness: "https://share.google/YMJU6bXJm6TTDMr3g",
  },
} as const;

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${BUSINESS.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
