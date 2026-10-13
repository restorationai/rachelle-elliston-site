// Awards + trust badges, short enough to read at a glance.
//
// Santino 2026-10-12 (Desert Valley): the strip under the hero showed
// "Quality Business Awards Best Home Renovations in North Las Vegas 2024
// Winner". Badges are a couple of words, never a sentence: the award becomes
// "Voted Best of 2024" in the strip, and its full name lives in the hero
// award line, the schema (award) and llms.txt, where AI search reads it.
import { brand } from "~/lib/brand";

export type Award = {
  name: string;
  year?: string | number;
  category?: string;
  organizer?: string;
  url?: string;
  short?: string; // hand-set strip label, wins over the generated one
};

export function awards(): Award[] {
  return ((brand as { awards?: Award[] }).awards || []).filter((a) => a && a.name);
}

/** Strip label: "Voted Best of 2024". */
export function awardBadge(a: Award): string {
  if (a.short) return shortBadge(a.short);
  const year = String(a.year || "").match(/\d{4}/)?.[0]
    || String(a.name).match(/\b(19|20)\d{2}\b/)?.[0] || "";
  return year ? `Voted Best of ${year}` : "Award Winner";
}

/** Hero line: "Best Home Renovations in North Las Vegas · 2024 Winner". */
export function awardLine(a: Award): string {
  let title = String(a.name).trim();
  if (a.organizer && title.toLowerCase().startsWith(a.organizer.toLowerCase())) {
    title = title.slice(a.organizer.length).trim();
  }
  const year = String(a.year || "").match(/\d{4}/)?.[0] || "";
  if (year && !title.includes(year)) title = `${title} · ${year} Winner`;
  return title;
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
