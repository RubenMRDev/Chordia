/**
 * Real figures from the bundled catalogue, derived from
 * `public/songs/catalog.json`, so the home page can state them without
 * downloading 568 KB of song index to render one section.
 *
 * Regenerate alongside the catalogue itself (`npm run songs`).
 * Generated from catalog.json dated 2026-08-20.
 */

export const CATALOG_TOTAL = 759;

export const CATALOG_COMPOSERS = 105;

/** The most represented composers, anonymous and traditional pieces aside. */
export const TOP_COMPOSERS: readonly { name: string; pieces: number }[] = [
  { name: "Johann Sebastian Bach", pieces: 124 },
  { name: "Franz Schubert", pieces: 49 },
  { name: "Frederic Chopin", pieces: 47 },
  { name: "Ludwig van Beethoven", pieces: 43 },
  { name: "Wolfgang Amadeus Mozart", pieces: 33 },
  { name: "Anton Diabelli", pieces: 32 },
  { name: "Robert Schumann", pieces: 31 },
  { name: "Carl Czerny", pieces: 29 },
  { name: "Georg Friedrich Handel", pieces: 23 },
  { name: "Giuseppe Verdi", pieces: 19 },
  { name: "Johann Friedrich Burgmuller", pieces: 19 },
  { name: "Scott Joplin", pieces: 19 },
];

export const TOP_STYLES: readonly { name: string; pieces: number }[] = [
  { name: "Romantic", pieces: 267 },
  { name: "Classical", pieces: 158 },
  { name: "Baroque", pieces: 150 },
  { name: "Traditional", pieces: 68 },
  { name: "Song", pieces: 23 },
  { name: "Jazz", pieces: 23 },
];

/** Difficulty is relative: the catalogue is split into five equal bands. */
export const DIFFICULTY_BANDS = 5;
