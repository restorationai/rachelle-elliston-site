// HOMEPAGE FAQ (Santino 2026-11-01). The questions are what customers in
// this client's market type when they are ready to hire (scripts/money_terms.py),
// always led by "Who is the best {trade} in {city}?". The answers use only
// facts on file: awards in their kind-correct wording (strongest first,
// source named), the Google rating and review count, years in business,
// license, 24/7, service area, insurance billing. Written to
// src/data/home-faq.json by scripts/ai_answers.py; never composed here.
//
// The live Google rating and review count are tokens ({{rating}},
// {{reviews}}) filled from brand.ts at build time, so the nightly review
// sync never has to rewrite this file. A sentence whose token has no value
// is dropped, never shown half-filled.
//
// The same list feeds the visible FAQ and the FAQPage JSON-LD, so the two
// are word for word identical.
import { brand } from "~/lib/brand";
import raw from "~/data/home-faq.json";

export type QA = { question: string; answer: string };

const TOKENS: Record<string, string> = {
  rating: String(brand.gbpRatingValue ?? "").trim(),
  reviews: String(brand.gbpReviewCount ?? "").trim(),
};

function fill(text: string): string {
  return text
    .split(/(?<=[.!?])\s+/)
    .filter((s) => [...s.matchAll(/\{\{(\w+)\}\}/g)].every((m) => TOKENS[m[1]] && TOKENS[m[1]] !== "0"))
    .map((s) => s.replace(/\{\{(\w+)\}\}/g, (_, k) => TOKENS[k]))
    .join(" ")
    .trim();
}

/** The data-driven homepage FAQ (these, and only these, go in FAQPage). */
export function homeFaq(): QA[] {
  return ((raw as QA[]) || [])
    .map((q) => ({ question: String(q.question || "").trim(), answer: fill(String(q.answer || "")) }))
    .filter((q) => q.question && q.answer);
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** The visible list: ours first, then the page's own FAQ entries that ask
 * something different (one FAQ section on the page, never two). */
export function visibleFaq(extra: QA[] = []): QA[] {
  const ours = homeFaq();
  const seen = new Set(ours.map((q) => norm(q.question)));
  const rest = (extra || []).filter((q) => q && q.question && !seen.has(norm(q.question)));
  return [...ours, ...rest];
}
