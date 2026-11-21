// Brand config — hydrated at scaffold time by build_site.py from
// plan-input.json and the client record. All {{TOKENS}} are replaced
// by the scaffold step; this file should not be hand-edited after that.

export const brand = {
  slug: "rachelle-elliston",
  displayName: "Desert Valley Restoration",
  shortName: "Desert Valley Restoration",
  legalName: "Desert Valley Contracting Inc",
  // Registered DBA / trade name — filled by rename_site_sync.py the moment
  // the state approves the client's DBA filing (empty until then). When set,
  // the footer carries the "[legal] doing business as [DBA]" line and schema
  // declares it as the business name, so Google/BrightLocal find the new
  // name corroborated on the site before and during the GBP rename.
  dbaName: "Desert Valley Restoration",
  // Brand name as text beside the header logo (Santino 2026-11-21): set
  // ONLY by the rename flow (header_name_rollout.py) from the Citations
  // Building stage on. false = logo only.
  headerName: true,
  domain: "desertvalleyrestoration.com",
  canonicalUrl: "https://desertvalleyrestoration.com",
  phone: "(702) 633-5033",
  phoneRaw: "+17026335033",
  hideMobileHeaderCall: false,
  // Sitewide call-tracking number (2026-08-24). When BOTH fields are set,
  // a tiny inline script in BaseLayout swaps every visible phone mention
  // and tel: link to this number AFTER the page renders. The HTML source,
  // the JSON-LD in schema.ts, and anything crawlers/citation-checkers read
  // keep the canonical NAP number above — humans dial the tracked line,
  // Google sees consistent NAP. Empty = feature off (default at scaffold;
  // filled by the call-tracking provisioning step).
  trackingPhone: "(725) 500-0975",
  trackingPhoneRaw: "+17255000975",
  email: "relliston@desertvalleyco.com",
  hours: "24/7",
  // AVAILABILITY 24/7 (Santino 2026-11-21, scripts/availability.py): calls are
  // answered 24/7 (the AI receptionist), every trade, default true; false only
  // when the client said not to. Separate from the emergency-SERVICE rule
  // (emergency_policy.py, the `hours` gate above). openingHoursSpec = the
  // schema hours (scripts/schema_hours.py): 24/7 when available, else the
  // real Google hours, else none.
  available247: true,
  openingHoursSpec: [{"days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], "opens": "00:00", "closes": "23:59"}] as { days: string[]; opens: string; closes: string }[],
  foundedYear: "2000",
  primaryCity: "North Las Vegas",
  primaryState: "NV",
  // primaryCity/primaryState = the #1 MARKETING city (headlines, coverage
  // copy). addressCity/addressState = where the business PHYSICALLY is.
  // They are usually the same and often diverge (DISS: Farrell PA office,
  // Youngstown OH target) — only the address pair may go in a PostalAddress.
  addressCity: "North Las Vegas",
  addressState: "NV",
  streetAddress: "3808 N Octagon Rd Ste 2",
  postalCode: "89030",
  lat: "36.2005191",
  lng: "-115.1214745",
  placeId: "ChIJHe5ukQHCyIARitorWulYy8U",
  googleCid: "",
  imagesBase: "https://images.desertvalleyrestoration.com",
  googleMapsApiKey: "",
  // Analytics — set post-scaffold (scripts/analytics_set.py / create_ga4.py); no-op if empty
  ga4MeasurementId: "",
  clarityProjectId: "",
  logoUrl: "/images/logo.png",
  licenseNumbers: ["0072652-B & B6"] as string[],
  licenseAuthority: "",
  // State license-verification page — the footer links the license number here.
  licenseLookupUrl: "https://www.nvcontractorsboard.com/",
  licenseType: "",
  // Operator-confirmed "licensed & insured" attestation from plan-input.json —
  // lets the TrustStrip show the badge before a license number is on file.
  licensedInsuredAttested: true as boolean,
  certifications: ["IICRC Certified Firm", "IICRC AMRT (Mold)", "OSHA Trained", "IICRC FSRT (Fire & Smoke)", "IICRC WRT (Water)", "IICRC ASD (Structural Drying)", "EPA Lead-Safe Certified"] as string[],
  trustBadges: ["IICRC Certified Firm", "Licensed & Insured", "24/7 Emergency Service", "Locally Owned & Operated"] as string[],
  jobPhotos: [] as string[],
  sameAsUrls: ["https://www.facebook.com/DesertValleyContractor/", "https://www.instagram.com/desertvalleycontractinginc/", "https://www.linkedin.com/company/desert-valley-contracting-inc.", "https://maps.google.com/maps?cid=14252583205007514250", "https://www.bbb.org/us/nv/north-las-vegas/profile/fire-water-damage-restoration/desert-valley-contracting-inc-1086-78265", "https://www.facebook.com/pages/desert-valley-painting-drywall/112174692178938", "https://homeguide.com/nv/north-las-vegas/water-damage-restoration/desert-valley-contracting-inc-z30PG1i5H"] as string[],
  awards: [{"name": "Quality Business Awards Best Home Renovations in North Las Vegas", "year": "2024", "organizer": "Quality Business Awards", "url": "https://qualitybusinessawards.com/2024/the-best-Home-Renovations-in-North-Las-Vegas/desert-valley-contracting-2/", "image": "/images/badges/quality-business-awards-2024.jpg", "kind": "judged", "text": "2024 Quality Business Award Winner, Best Home Renovations in North Las Vegas", "badge": "2024 Winner", "sealTitle": "2024 Quality Business Award Winner", "sealSub": "Best Home Renovations in North Las Vegas", "cardTitle": "Quality Business Award Winner, Best Home Renovations in North Las Vegas"}, {"name": "BusinessRate Best of 2026", "year": 2026, "category": "Contractor, North Las Vegas", "organizer": "BusinessRate", "kind": "auto", "text": "Rated Best of 2026 by BusinessRate (Contractor, North Las Vegas)", "badge": "Top Rated 2026", "sealTitle": "Rated Best of 2026", "sealSub": "BusinessRate \u00b7 Contractor, North Las Vegas", "cardTitle": "Rated Best of 2026 (Contractor, North Las Vegas)"}] as { name: string; year?: string | number; category?: string; organizer?: string; url?: string; image?: string; short?: string; kind?: string; text?: string; badge?: string; sealTitle?: string; sealSub?: string; cardTitle?: string }[],
  awardsSection: {"headline": "Award-Winning Restoration Company in North Las Vegas", "intro": "Recognition from the Quality Business Awards and BusinessRate."} as { headline: string; intro: string },
  // GBP rating fields — synced from the live Google Business Profile by
  // scripts/sync_brand_reviews.py; never hand-edited (real ratings only).
  gbpRatingValue: "4.5",
  gbpReviewCount: "106",
  gbpReviews: [
    { author: "Kevin", rating: 5, text: "I retained Desert Valley Contracting to repair and remodel our newly purchased property in LV. We live out of state and the project manager, Rudy, kept me updated all along. He also shared photos of the work in progress and addressed anything that we needed. It was great working with them on this…", when: "November 2026" },
    { author: "Barbara", rating: 4, text: "We had major interior water damage and they did a good job boxing everything up, removing damaged drywall and cabinets, cleanup, etc. We are going to have them continue with the restoration of the interior.", when: "November 2026" },
    { author: "Wendy", rating: 5, text: "Had a good experience with each team.", when: "November 2026" },
    { author: "John", rating: 5, text: "Desert Valley did an outstanding job with our bathroom construction.", when: "November 2026" },
    { author: "Karen", rating: 5, text: "Fast, efficient, listen to our concerns and worked within our budget. All departments were very professional!", when: "November 2026" },
    { author: "Rafael", rating: 5, text: "Good work & customer service. Reasonably priced.", when: "November 2026" },
  ] as { author: string; rating: number; text: string; when: string }[],
  tagline: "24/7 restoration services in North Las Vegas, NV.",
  ctaLabel: "24/7 Emergency Line",
  // Vertical trade-identity copy — resolved at scaffold time from
  // templates/{vertical}/vertical-tokens.json (see scripts/verticals.py).
  // Components must use these instead of hardcoding a trade phrase.
  // vertical gates layout too: restoration is call-first, so the homepage
  // hero renders NO estimate form there (Santino 2026-09-11).
  vertical: "restoration",
  tradeNoun: "restoration",
  specialistPhrase: "Damage Restoration Specialists",
  announcementSuffix: "24/7 Emergency Response",
  homeAboutBlurb: "Desert Valley Restoration serves North Las Vegas and the surrounding NV area with professional damage restoration for homes and businesses. From the first emergency call to the final walkthrough, our team manages the entire recovery — and we answer the phone 24/7, so help is on the way the moment something goes wrong.",
} as const;

export const entityId = `${brand.canonicalUrl}/#identity`;
