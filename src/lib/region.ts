// SERVICE REGION (Santino 2026-11-19, RestoFirst/Tyler: "our website needs
// to just be all inclusive to Southern California... this looks like we only
// do stuff in Carlsbad").
//
// A client that serves more than one metro sets brand.serviceRegion
// ("Southern California"). Every REGION-WIDE surface then names the region
// instead of the home city: homepage hero/title/meta, /services/ pages,
// /emergency/, footer, top bar, estimate form, "see all services" links,
// recent work, case studies, the homepage proof heading.
// Never changed: CITY pages (/service-areas/..., /locations/...) and the
// business ADDRESS (NAP, schema PostalAddress, "Office: City, ST").
// Empty serviceRegion = every value below is today's city wording exactly.
//
// Set it with: python3 scripts/service_region.py set --slug S --region "..."
// Fields are read loosely so a site whose brand.ts predates them still builds.
import { brand } from "~/lib/brand";
import { regionHeadlineFor, regionSentenceFor } from "~/lib/regionText";

const B = brand as unknown as Record<string, unknown>;
const str = (v: unknown) => {
  const s = String(v ?? "").trim();
  return s.includes("{{") ? "" : s;
};

const city = str(brand.primaryCity);
const state = str(brand.primaryState);

/** "Southern California", or "" for a single-metro client. */
export const serviceRegion = str(B.serviceRegion);
/** Optional longer line ("Los Angeles, Orange, ... counties"); only with a region. */
export const serviceRegionDetail = serviceRegion ? str(B.serviceRegionDetail) : "";
/** Region-wide place, short form: "Southern California", else "Carlsbad". */
export const areaName = serviceRegion || city;
/** Region-wide place, long form: "Southern California", else "Carlsbad, CA". */
export const areaPlace = serviceRegion || [city, state].filter(Boolean).join(", ");
/** The physical office: the ADDRESS pair, never the marketing city. */
export const officeCity = str(brand.addressCity) || city;
export const officeState = str(brand.addressState) || state;
/** MULTI-MARKET (Santino 2026-11-19, Legacy): the region IS the office-market
 *  list ("Denver, Tampa, Fort Myers & Chicago", service_region.py markets),
 *  so home and service region are the same list of places. */
export const multiMarket = !!serviceRegion && serviceRegion === str(B.homeRegion)
  && /,|&/.test(serviceRegion.replace(/,\s*[A-Z]{2}$/, ""));
/** "our Carlsbad office", or "our local offices" for a multi-market client. */
export const officeFrom = multiMarket ? "our local offices" : `our ${officeCity} office`;
/** Footer office label: "Office", or "Main office" for a multi-market client. */
export const officeLabel = multiMarket ? "Main office" : "Office";

/** h1/title "... in Carlsbad, CA" -> "... in Southern California" (region set only). */
export const regionHeadline = (text: string) => regionHeadlineFor(text, city, state, serviceRegion);
/** meta "... in Carlsbad and surrounding areas." -> "... across Southern California." */
export const regionSentence = (text: string) => regionSentenceFor(text, city, state, serviceRegion);

/** MULTI-OFFICE (Santino 2026-11-21, Legacy / Dry 1 Out): an office's own
 *  page and the city pages it serves name THAT office's local region
 *  ("Tampa Bay"), not the site-wide market list. The office's region comes
 *  from the offices collection (plan-input brand.office_regions, written by
 *  office_pages.py); brand.mainOfficeRegion covers the main office's city
 *  pages. Pages set Astro.locals.servingOffice / pageRegion; every other page
 *  (homepage, /services/, /emergency/) keeps areaPlace. Empty = unchanged. */
export const mainOfficeRegion = str(B.mainOfficeRegion);
export function pageRegion(locals: unknown): string {
  const L = (locals || {}) as { servingOffice?: { region?: string | null } | null; pageRegion?: string };
  return str(L.servingOffice?.region) || str(L.pageRegion);
}
/** areaPlace, or this page's office region when it has one. */
export const pageAreaPlace = (locals: unknown) => pageRegion(locals) || areaPlace;
/** serviceRegion, or this page's office region when it has one. */
export const pageServiceRegion = (locals: unknown) => pageRegion(locals) || serviceRegion;
