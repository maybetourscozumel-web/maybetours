// Extra real photos per tour (beyond the hero image), curated from the
// client's upload folder. Tours not listed here (jet-ski, banana-boat) have
// no additional usable photos yet — they fall back to the hero image alone.
const slugs = [
  "cozumel-snorkeling-palancar-colombia-el-cielo",
  "shore-diving",
  "el-cielo-private-catamaran",
  "catamaran-el-cielo-stingrays-turtles",
  "private-snorkeling-speedboat-7",
  "private-snorkeling-up-to-12",
] as const;

const PHOTOS_PER_TOUR = 4;

export const TOUR_GALLERY: Record<string, string[]> = Object.fromEntries(
  slugs.map((slug) => [
    slug,
    Array.from(
      { length: PHOTOS_PER_TOUR },
      (_, i) => `/tours/gallery/${slug}/${i + 1}.jpg`
    ),
  ])
);

/** Hero image first, followed by any extra curated photos for that tour. */
export function getTourPhotos(slug: string, heroImage: string | null): string[] {
  const extra = TOUR_GALLERY[slug] ?? [];
  return heroImage ? [heroImage, ...extra] : extra;
}
