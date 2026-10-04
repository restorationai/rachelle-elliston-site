// hide-unwritten.mjs: keep unwritten pages off the live site (Santino 2026-10-04).
//
// New pages are planned and committed as placeholders ("Placeholder content
// for ...") and the nightly render sweep writes them ~50 per site per night.
// Until then they were PUBLISHED: ~770 placeholder pages were live across 28
// sites, in the sitemap Google reads. This runs before `astro build` on
// Cloudflare Pages only (CF_PAGES is set there) and, in that throwaway build
// checkout:
//   1. removes every content page whose body is still the placeholder,
//   2. drops links to those pages from internal_links and page bodies
//      (body links point at the parent page instead),
//   3. adds temporary 302s from each hidden URL to its parent page, so any
//      link we missed or an old crawl lands somewhere real.
// A page appears on the next deploy after it is written. Nothing in the
// monorepo is touched; locally this is a no-op unless HIDE_UNWRITTEN=1.
import fs from "node:fs";
import path from "node:path";

if (!process.env.CF_PAGES && !process.env.HIDE_UNWRITTEN) process.exit(0);

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "src", "content");
const PLACEHOLDER = /<!-- Page body not yet generated|^Placeholder content for /m;

const read = (f) => fs.readFileSync(f, "utf8");
const split = (raw) => {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  return m ? { fm: m[1], body: m[2] } : { fm: "", body: raw };
};
const fmVal = (fm, key) => {
  const m = fm.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+?)["']?\\s*$`, "m"));
  return m ? m[1].trim() : "";
};
const mdFiles = (dir) =>
  fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => path.join(dir, f)) : [];

const hidden = new Map(); // url -> parent url
const toDelete = [];
const plan = [];
for (const f of mdFiles(path.join(CONTENT, "services"))) {
  const { fm, body } = split(read(f));
  if (!PLACEHOLDER.test(body)) continue;
  const s = fmVal(fm, "service_slug") || path.basename(f, ".md");
  plan.push({ f, url: `/services/${s}/`, parent: "/services/" });
}
// City hubs stay up (their service list and breadcrumbs are real and other
// pages link to them); only the placeholder paragraph is removed.
let blanked = 0;
for (const f of mdFiles(path.join(CONTENT, "serviceAreas"))) {
  const raw = read(f);
  const { body } = split(raw);
  if (!PLACEHOLDER.test(body)) continue;
  const cleaned = body
    .replace(/<!-- Page body not yet generated[\s\S]*?-->\s*/g, "")
    .replace(/^Placeholder content for .*$/gm, "")
    .trim();
  fs.writeFileSync(f, raw.slice(0, raw.length - body.length) + (cleaned ? cleaned + "\n" : ""));
  blanked++;
}
for (const f of mdFiles(path.join(CONTENT, "locations"))) {
  const { fm, body } = split(read(f));
  if (!PLACEHOLDER.test(body)) continue;
  const [a0, s0] = path.basename(f, ".md").split("__");
  const a = fmVal(fm, "area_slug") || a0;
  const s = fmVal(fm, "service_slug") || s0;
  plan.push({ f, url: `/service-areas/${a}/${s}/`, parent: `/services/${s}/`, area: `/service-areas/${a}/` });
}
for (const f of mdFiles(path.join(CONTENT, "blog"))) {
  const { body } = split(read(f));
  if (!PLACEHOLDER.test(body)) continue;
  plan.push({ f, url: `/blog/${path.basename(f, ".md")}/`, parent: "/blog/" });
}
for (const p of plan) hidden.set(p.url, p.parent);
// a location's parent service page may itself be hidden: fall back to its area, then the hub
for (const p of plan) {
  if (!p.area) continue;
  let parent = p.parent;
  if (hidden.has(parent)) parent = p.area;
  hidden.set(p.url, parent);
}
for (const p of plan) toDelete.push(p.f);

if (!plan.length) {
  console.log(`hide-unwritten: nothing hidden (${blanked} city hub placeholder paragraph(s) removed)`);
  process.exit(0);
}

for (const f of toDelete) fs.rmSync(f);

// scrub links on the pages that remain
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? walk(path.join(dir, d.name)) : d.name.endsWith(".md") ? [path.join(dir, d.name)] : []);
let scrubbed = 0;
for (const f of walk(CONTENT)) {
  const raw = read(f);
  let out = raw.replace(/^internal_links:\s*(\[.*\])\s*$/m, (line, arr) => {
    try {
      const all = JSON.parse(arr);
      const kept = all.filter((u) => !hidden.has(u));
      return kept.length === all.length ? line : `internal_links: ${JSON.stringify(kept)}`;
    } catch {
      return line;
    }
  });
  out = out.replace(/\]\((\/[^)\s#?]+\/?)([#?][^)]*)?\)/g, (m, u, tail) => {
    const key = u.endsWith("/") ? u : `${u}/`;
    return hidden.has(key) ? `](${hidden.get(key)})` : m;
  });
  if (out !== raw) {
    fs.writeFileSync(f, out);
    scrubbed++;
  }
}

// temporary redirects (302: the page is coming, do not transfer it)
const red = path.join(ROOT, "public", "_redirects");
const lines = ["", "# hide-unwritten (build-time): pages not written yet"];
for (const [u, parent] of hidden) {
  lines.push(`${u} ${parent} 302`);
  lines.push(`${u.replace(/\/$/, "")} ${parent} 302`);
}
fs.mkdirSync(path.dirname(red), { recursive: true });
fs.appendFileSync(red, lines.join("\n") + "\n");

console.log(`hide-unwritten: hid ${plan.length} unwritten page(s), removed ${blanked} city hub placeholder paragraph(s), scrubbed links on ${scrubbed} page(s)`);
