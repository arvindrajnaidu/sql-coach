#!/usr/bin/env node
// Lists what each translation is missing compared to English.
//   node scripts/check-locales.js        (all languages)
//   node scripts/check-locales.js hi     (one language)
// Also warns when a translation drops a {placeholder} or changes the number of hints/options.
const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..", "locales");
const en = JSON.parse(fs.readFileSync(path.join(dir, "en.json"), "utf8"));
const langs = JSON.parse(fs.readFileSync(path.join(dir, "languages.json"), "utf8"))
  .map((l) => l.code).filter((c) => c !== "en");
const only = process.argv[2];

function walk(a, b, p, out) {
  if (typeof a === "string") {
    if (b === undefined) out.missing.push(p);
    else if (typeof b !== "string") out.problems.push(`${p}: should be text`);
    else {
      const ph = (s) => (s.match(/\{\w+\}/g) || []).sort().join(",");
      if (ph(a) !== ph(b)) out.problems.push(`${p}: placeholders should be ${ph(a) || "none"}, found ${ph(b) || "none"}`);
    }
    return;
  }
  if (Array.isArray(a)) {
    if (b === undefined) return out.missing.push(p);
    if (!Array.isArray(b) || b.length !== a.length) return out.problems.push(`${p}: should be a list of ${a.length}`);
    a.forEach((v, i) => walk(v, b[i], `${p}[${i}]`, out));
    return;
  }
  if (a && typeof a === "object") {
    if (b === undefined) return out.missing.push(p);
    for (const k of Object.keys(a)) walk(a[k], b[k], p ? `${p}.${k}` : k, out);
    if (b && typeof b === "object" && !Array.isArray(b)) {
      for (const k of Object.keys(b)) if (!(k in a)) out.problems.push(`${p ? p + "." : ""}${k}: unknown key (typo?), the app never reads it`);
    }
  }
}

let bad = false;
for (const code of only ? [only] : langs) {
  const file = path.join(dir, `${code}.json`);
  if (!fs.existsSync(file)) { console.log(`${code}: locales/${code}.json not found`); bad = true; continue; }
  const out = { missing: [], problems: [] };
  walk(en, JSON.parse(fs.readFileSync(file, "utf8")), "", out);
  console.log(`\n${code}: ${out.missing.length} missing (English is shown for these), ${out.problems.length} problems`);
  out.missing.forEach((m) => console.log("  missing  " + m));
  out.problems.forEach((m) => console.log("  PROBLEM  " + m));
  if (out.problems.length) bad = true;
}
if (!langs.length && !only) console.log("Only English is listed in locales/languages.json.");
process.exit(bad ? 1 : 0);
