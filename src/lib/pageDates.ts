// rankai:page-dates (AI Search 2026-11-27). The date each page's CONTENT last really
// changed, from git history (scripts/page_dates.py writes src/data/page-dates.json on
// every sync-deploy). Schema dateModified, sitemap <lastmod> (astro.config.mjs) and the
// visible "Updated" line all read this one file, so they always agree. No file or no
// entry = no date (never the build date).
type PageDate = { modified: string; published: string };
const files = import.meta.glob("../data/page-dates.json", { eager: true, import: "default" }) as Record<string, Record<string, PageDate>>;
const MAP: Record<string, PageDate> = Object.values(files)[0] || {};

export function pagePath(url: string | undefined): string {
  let p = String(url || "/").replace(/^https?:\/\/[^/]+/, "").split(/[?#]/)[0] || "/";
  if (!p.startsWith("/")) p = "/" + p;
  if (!p.endsWith("/") && !/\.[a-z0-9]+$/i.test(p)) p += "/";
  return p;
}

export function pageDates(url: string | undefined): PageDate | undefined {
  return MAP[pagePath(url)];
}
