// Real tour catalog for May-Be Tours Cozumel.
//
// `maxGroupSize` = largest party size allowed on a single booking.
// `dailyCapacity` = total inventory available per calendar date (summed
// across all bookings that day). For the main boat tours these are equal
// to the boat's seating since there's one trip/day. For short add-ons
// (jet ski, banana boat) that run many short sessions per day, we size
// dailyCapacity well above a single ride's headcount so the booking
// widget doesn't falsely show the whole day as sold out after one small
// group books. These are estimates — adjust them in /admin/tours to match
// real fleet size and schedule.

export type SeedTour = {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  durationMinutes: number;
  maxGroupSize: number;
  dailyCapacity: number;
  priceMXN: number;
  priceType: "PER_PERSON" | "FLAT_PER_BOAT";
  isPrivate: boolean;
  category: "SNORKELING" | "DIVING" | "WATERSPORT" | "PRIVATE";
  included: string[];
  excluded: string[];
  highlights: string[];
  meetingPoint: string;
  heroImage?: string;
  sortOrder: number;
};

const MARINA_MEETING_POINT =
  "Marina Cozumel ASIPONA, Carr. Costera Sur Km 6.5, Zona Hotelera Sur, 77675 Cozumel, Q.Roo";

export const seedTours: SeedTour[] = [
  {
    slug: "cozumel-snorkeling-palancar-colombia-el-cielo",
    name: "Cozumel Snorkeling Tour — Palancar, Colombia & El Cielo",
    shortDescription:
      "Our classic reef-hopping snorkel trip to three of Cozumel's most famous spots.",
    description:
      "A snorkeling experience visiting some of Cozumel's most popular marine areas, including Palancar Reef, Colombia Reef and the shallow turquoise flats of El Cielo. Cruise aboard a shaded boat with a certified captain and guide, with drinks and a snack included.",
    durationMinutes: 240,
    maxGroupSize: 14,
    dailyCapacity: 14,
    priceMXN: 1060,
    priceType: "PER_PERSON",
    isPrivate: false,
    category: "SNORKELING",
    included: [
      "Sanitized snorkeling equipment",
      "Life jacket",
      "Fins, mask & snorkel",
      "Snack",
      "Unlimited water & juices",
      "2 beers per person",
      "Certified captain & guide",
      "Shaded boat",
    ],
    excluded: ["Tips"],
    highlights: ["Palancar Reef", "Colombia Reef", "El Cielo starfish flats"],
    meetingPoint: MARINA_MEETING_POINT,
    heroImage: "/tours/cozumel-snorkeling-hero.jpg",
    sortOrder: 1,
  },
  {
    slug: "shore-diving",
    name: "Shore Diving at Villa Blanca Reef",
    shortDescription:
      "Beginner-friendly shore dive with a short theory class and ~55 minutes underwater.",
    description:
      "A beginner-friendly shore diving experience including a short theory class, a practice session, and approximately 55 minutes of diving at Villa Blanca Reef. Great first-dive experience with personalized instructor attention.",
    durationMinutes: 90,
    maxGroupSize: 6,
    dailyCapacity: 18,
    priceMXN: 1500,
    priceType: "PER_PERSON",
    isPrivate: false,
    category: "DIVING",
    included: [
      "Diving equipment",
      "Personalized instructor attention",
      "Access to showers",
      "Restrooms",
    ],
    excluded: ["Transportation"],
    highlights: ["Villa Blanca Reef", "Theory class + practice session", "~55 min dive"],
    meetingPoint: MARINA_MEETING_POINT,
    heroImage: "/tours/shore-diving-hero.jpg",
    sortOrder: 2,
  },
  {
    slug: "el-cielo-private-catamaran",
    name: "El Cielo at Your Own Pace — Private Catamaran",
    shortDescription: "Reserve the catamaran exclusively for your group and set your own pace.",
    description:
      "Enjoy El Cielo and the surrounding reefs at your own pace aboard a private catamaran. Includes turtle watching, coral reefs, the El Cielo / starfish area and El Cielito, plus snorkeling, drinks and snacks. Transportation from the downtown/fiscal pier to the marina is included.",
    durationMinutes: 270,
    maxGroupSize: 17,
    dailyCapacity: 17,
    priceMXN: 18599,
    priceType: "FLAT_PER_BOAT",
    isPrivate: true,
    category: "PRIVATE",
    included: [
      "Sanitized snorkeling equipment",
      "Snacks & drinks",
      "Certified captain & guide",
      "Transportation from the downtown/fiscal pier to the marina",
    ],
    excluded: ["Transportation back to the fiscal pier", "Tips"],
    highlights: ["Turtle watching", "Coral reefs", "El Cielo & El Cielito"],
    meetingPoint: MARINA_MEETING_POINT,
    heroImage: "/tours/el-cielo-private-hero.jpg",
    sortOrder: 3,
  },
  {
    slug: "catamaran-el-cielo-stingrays-turtles",
    name: "Catamaran — El Cielo, Stingrays & Turtle Watching",
    shortDescription: "Our biggest group catamaran trip covering Palancar, Colombia & El Cielo.",
    description:
      "A full catamaran day covering snorkeling at Palancar and Colombia reefs plus the El Cielo starfish area, with great chances to spot stingrays and turtles. Snack and unlimited drinks included on board.",
    durationMinutes: 270,
    maxGroupSize: 23,
    dailyCapacity: 23,
    priceMXN: 1350,
    priceType: "PER_PERSON",
    isPrivate: false,
    category: "SNORKELING",
    included: [
      "Snorkeling equipment",
      "Snorkeling at Palancar",
      "Snorkeling at Colombia",
      "El Cielo / starfish area",
      "Snack onboard",
      "Unlimited water & juices",
      "2 beers per person",
    ],
    excluded: ["Food at the beach club"],
    highlights: ["Stingrays", "Sea turtles", "Palancar & Colombia reefs"],
    meetingPoint: MARINA_MEETING_POINT,
    heroImage: "/tours/catamaran-turtles-hero.jpg",
    sortOrder: 4,
  },
  {
    slug: "jet-ski",
    name: "Jet Ski",
    shortDescription: "25–30 minutes of jet ski fun for up to 2 riders.",
    description:
      "Rent a jet ski for an adrenaline-filled 25–30 minute ride along the Cozumel coastline. Seats up to 2 riders per jet ski.",
    durationMinutes: 30,
    maxGroupSize: 2,
    dailyCapacity: 20,
    priceMXN: 1400,
    priceType: "FLAT_PER_BOAT",
    isPrivate: false,
    category: "WATERSPORT",
    included: ["Jet ski rental"],
    excluded: ["Transportation"],
    highlights: ["25–30 min ride", "Up to 2 riders per jet ski"],
    meetingPoint: MARINA_MEETING_POINT,
    heroImage: "/tours/jet-ski-hero.jpg",
    sortOrder: 5,
  },
  {
    slug: "banana-boat",
    name: "Banana Boat",
    shortDescription: "A fun, bouncy 15–20 minute ride for groups up to 8.",
    description:
      "Hop on the banana boat for a fun, bouncy 15–20 minute ride, great for groups and families. Can be combined with beach club access, parasailing, jet ski or El Cielo add-ons — just ask.",
    durationMinutes: 20,
    maxGroupSize: 8,
    dailyCapacity: 48,
    priceMXN: 400,
    priceType: "PER_PERSON",
    isPrivate: false,
    category: "WATERSPORT",
    included: ["Banana boat activity"],
    excluded: ["Transportation"],
    highlights: ["15–20 min ride", "Great for groups & families"],
    meetingPoint: MARINA_MEETING_POINT,
    heroImage: "/tours/banana-boat-hero.jpg",
    sortOrder: 6,
  },
  {
    slug: "private-snorkeling-speedboat-7",
    name: "Private Snorkeling Tour — Speedboat (up to 7)",
    shortDescription: "Your own speedboat and crew for up to 7 people, with ceviche & guacamole.",
    description:
      "A fully private snorkeling charter aboard a speedboat for up to 7 guests, visiting Palancar, Colombia, El Cielo and El Cielito. Includes fresh fish ceviche, guacamole, and drinks.",
    durationMinutes: 240,
    maxGroupSize: 7,
    dailyCapacity: 7,
    priceMXN: 7500,
    priceType: "FLAT_PER_BOAT",
    isPrivate: true,
    category: "PRIVATE",
    included: [
      "Sanitized snorkeling equipment",
      "Fish ceviche & guacamole",
      "Unlimited water & juices",
      "2 beers per person",
      "Certified captain & guide",
      "Shaded boat",
    ],
    excluded: ["Tips"],
    highlights: ["Palancar → Colombia → El Cielo → El Cielito", "Private speedboat charter"],
    meetingPoint: MARINA_MEETING_POINT,
    heroImage: "/tours/private-speedboat-hero.jpg",
    sortOrder: 7,
  },
  {
    slug: "private-snorkeling-up-to-12",
    name: "Private Snorkeling Tour — Up to 12 People",
    shortDescription: "A private boat charter for bigger groups, up to 12 people.",
    description:
      "A fully private snorkeling charter for groups up to 12, visiting Palancar, Colombia, El Cielo and El Cielito. Includes fresh fish ceviche, guacamole, and drinks.",
    durationMinutes: 240,
    maxGroupSize: 12,
    dailyCapacity: 12,
    priceMXN: 11000,
    priceType: "FLAT_PER_BOAT",
    isPrivate: true,
    category: "PRIVATE",
    included: [
      "Sanitized snorkeling equipment",
      "Fish ceviche & guacamole",
      "Unlimited water & juices",
      "2 beers per person",
      "Certified captain & guide",
      "Shaded boat",
    ],
    excluded: ["Tips"],
    highlights: ["Palancar → Colombia → El Cielo → El Cielito", "Private charter for bigger groups"],
    meetingPoint: MARINA_MEETING_POINT,
    heroImage: "/tours/private-12-hero.jpg",
    sortOrder: 8,
  },
];
