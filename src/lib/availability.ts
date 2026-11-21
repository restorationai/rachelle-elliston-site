// AVAILABILITY 24/7 (Santino 2026-11-21, rank-ai scripts/availability.py):
// every client's calls are answered 24/7 (the AI receptionist), so the call
// buttons say so: "Available 24/7. Call now" in the hero button label
// (unless the label already says 24/7), "Call 24/7" on the sticky mobile bar
// and the CTA banners, "Calls answered 24/7" under the footer phone (only
// where the site carries no 24/7 emergency copy already). brand.available247
// = false (the client said not to) turns every one of these off. Separate
// from the emergency-SERVICE rule (brand.hours / emergency_policy.py).
import { brand } from "./brand";

const b = brand as { available247?: boolean; ctaLabel?: string; hours?: string };
const SAYS_247 = /24\s*[\/x-]?\s*7|24 ?hours/i;

export const available247 = b.available247 !== false;
/** The site already carries 24/7 emergency copy (restoration, 24/7 plumbing). */
export const emergency247 = SAYS_247.test(String(b.hours || ""));
export const heroCtaLabel =
  available247 && !SAYS_247.test(String(b.ctaLabel || "")) ? "Available 24/7. Call now" : String(b.ctaLabel || "");
export const callNowLabel = available247 ? "Call 24/7" : "Call Now";
export const callShortLabel = available247 ? "Call 24/7:" : "Call";
export const footerAvailability = available247 && !emergency247 ? "Calls answered 24/7" : "";
