// Pure text helpers for SERVICE REGION (Santino 2026-11-19). No imports, so
// they can be tested outside Astro. The Python mirror is region_headline /
// region_sentence in scripts/service_region.py; tests/test_service_region.py
// runs the same cases through both and asserts they agree.
//
// Generated content (home.md, services/*.md) names the home city in its h1,
// title and meta ("24/7 Water Damage Restoration in Carlsbad, CA"). A client
// that serves a whole region should not have every region-wide page say one
// city, so the template rewrites the city phrase at render time instead of
// editing every content file. Empty region (or no city) = text unchanged.

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// "Carlsbad" or "Carlsbad, CA" (state optional, whole word).
const placeRe = (city: string, state: string) =>
  state ? `${esc(city)}(?:,\\s*${esc(state)}\\b)?` : esc(city);

const skip = (text: string, city: string, region: string) =>
  !region || !city || text.toLowerCase().includes(region.toLowerCase());

/**
 * Headline / title tail: "X in {city}[, ST]" at the END of the text, or just
 * before a " | Brand" suffix, becomes "X in {region}". Anything else (a city
 * in the middle of a headline) is left alone.
 */
export function regionHeadlineFor(text: string, city: string, state: string, region: string): string {
  const t = String(text ?? "");
  if (skip(t, city, region)) return t;
  const re = new RegExp(`\\b(in|In) ${placeRe(city, state)}(?=\\s*(?:\\||$))`);
  return t.replace(re, (_m, w: string) => `${w} ${region}`);
}

/**
 * Sentence (meta description): the FIRST "in {city}[, ST] and (the)
 * surrounding area(s)/communities/cities" becomes "across {region}";
 * otherwise the first "in {city}[, ST]" that ends a phrase (end, punctuation
 * or " | ") becomes "in {region}". "in Carlsbad, Oceanside and Vista" (a list
 * of places) is never touched.
 */
export function regionSentenceFor(text: string, city: string, state: string, region: string): string {
  const t = String(text ?? "");
  if (skip(t, city, region)) return t;
  const place = placeRe(city, state);
  const around = new RegExp(
    `\\b(in|In) ${place} and (?:the )?surrounding (?:areas?|communities|cities|region|neighborhoods)\\b`);
  if (around.test(t)) {
    return t.replace(around, (_m, w: string) => `${w === "In" ? "Across" : "across"} ${region}`);
  }
  const plain = new RegExp(`\\b(in|In) ${place}(?=$|[.!?|:;)]|,(?!\\s*[A-Z][a-z])|\\s+[|\\-])`);
  return t.replace(plain, (_m, w: string) => `${w} ${region}`);
}
