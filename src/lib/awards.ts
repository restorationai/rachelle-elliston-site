// Awards + trust badges, short enough to read at a glance.
//
// WORDING BY KIND (Santino 2026-11-01): each award is worded to match its
// source, because AI search checks the claim against the page that gave it.
// A reader poll is "Voted ...", an editorial list is "Rated one of the best
// ... by Expertise.com", a judged award is "2024 ... Award Winner". The
// wording and the order (strongest first: poll, judged award, editorial
// list, auto-generated) are made ONCE, in scripts/award_wording.py, and
// written into brand.ts `awards` by scripts/ai_answers.py: each award
// carries kind, text, badge, sealTitle and sealSub. This file only reads
// them. An award without them (brand.ts not re-synced yet) gets its own
// name and year, never a "Voted" it may not have earned.
//
// Badges stay a couple of words (Santino 2026-10-12, Desert Valley):
// "Voted Best 2024", "Top Rated 2026", "2024 Winner".
import { brand } from "~/lib/brand";

export type Award = {
  name: string;
  year?: string | number;
  category?: string;
  organizer?: string;
  url?: string;
  image?: string;
  short?: string; // hand-set strip label, wins over the generated one
  kind?: "poll" | "judged" | "list" | "auto" | "other";
  text?: string; // full kind-correct line (hero, meta, schema, FAQ)
  badge?: string; // strip label
  sealTitle?: string;
  sealSub?: string;
  cardTitle?: string; // awards-section card title (source + year shown on their own line)
};

export const yearOfAward = (a: Award) =>
  String(a.year || "").match(/\d{4}/)?.[0] || String(a.name).match(/\b(19|20)\d{2}\b/)?.[0] || "";

/** The homepage awards section's H2 + one-line intro (scripts/award_wording.py
 * section_copy: from the award kinds, the strongest award's place, the
 * named sources). Empty when brand.ts has none yet. */
export function awardsSection(): { headline: string; intro: string } | null {
  const s = (brand as { awardsSection?: { headline: string; intro: string } | null }).awardsSection;
  return s && s.headline ? s : null;
}

const yearOf = (a: Award) =>
  String(a.year || "").match(/\d{4}/)?.[0] || String(a.name).match(/\b(19|20)\d{2}\b/)?.[0] || "";

const nameWithYear = (a: Award) => {
  const y = yearOf(a);
  const n = String(a.name).trim();
  return y && !n.includes(y) ? `${n} ${y}` : n;
};

/** Strongest first, as brand.ts stores them (scripts/award_wording.py). */
export function awards(): Award[] {
  return ((brand as { awards?: Award[] }).awards || []).filter((a) => a && a.name);
}

/** Seal in the proof section: { title, sub }. */
export function awardSeal(a: Award): { title: string; sub: string } {
  if (a.sealTitle) return { title: a.sealTitle, sub: a.sealSub || "" };
  return { title: nameWithYear(a), sub: [a.organizer, a.category].filter(Boolean).join(" · ") };
}

/** Strip label: "Voted Best 2024" / "Top Rated 2026" / "2024 Winner". */
export function awardBadge(a: Award): string {
  if (a.short) return shortBadge(a.short);
  if (a.badge) return a.badge;
  const y = yearOf(a);
  return y ? `${y} Award` : "Award";
}

/** Hero line and meta lead: the full kind-correct text. */
export function awardLine(a: Award): string {
  if (a.text) return a.text;
  const n = nameWithYear(a);
  return a.organizer && !n.toLowerCase().includes(a.organizer.toLowerCase()) ? `${n} (${a.organizer})` : n;
}

// Known long labels -> their short form. Anything else keeps at most three
// words after dropping filler ("Service", "Available", "Firm"...).
const SHORT: [RegExp, string][] = [
  [/locally owned/i, "Locally Owned"],
  [/family[- ]owned/i, "Family Owned"],
  [/veteran/i, "Veteran Owned"],
  [/woman|women/i, "Woman Owned"],
  [/24\s*\/\s*7|24 ?hours?/i, "24/7 Emergency"],
  [/iicrc/i, "IICRC Certified"],
  [/licen[cs]ed.*insured|insured.*licen[cs]ed|licen[cs]ed.*bonded/i, "Licensed & Insured"],
  [/free (estimate|inspection|quote)/i, "Free Estimates"],
  [/insurance (claim|billing)|bill(s|ing)? (your )?insurance|direct billing/i, "Insurance Billing"],
  [/financ/i, "Financing"],
];
const FILLER = new Set(["service", "services", "available", "firm", "company", "operated", "provider", "professionals", "team", "inc", "llc"]);

export function shortBadge(label: string): string {
  const s = String(label || "").trim();
  for (const [re, out] of SHORT) if (re.test(s)) return out;
  const words = s.split(/\s+/).filter((w) => !FILLER.has(w.toLowerCase().replace(/[^a-z]/g, "")));
  return words.slice(0, 3).join(" ");
}
