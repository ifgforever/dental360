// Creates or updates one Healthchecks.io check per TV listed in config.js → monitor.screens,
// with the right alert timing and all your alert channels (email, SMS, apps) attached.
// Safe to run again any time: existing checks are matched by name and updated.
// Usage: HEALTHCHECKS_API_KEY=... node scripts/setup-monitoring.mjs
// (Runs from the "Set up TV monitoring" workflow, which reads the key from a repo secret.)
import { readFileSync } from "node:fs";

const key = process.env.HEALTHCHECKS_API_KEY;
const api = process.env.HEALTHCHECKS_API_URL || "https://healthchecks.io/api/v3";
if (!key) { console.error("Missing HEALTHCHECKS_API_KEY. Add it under repo Settings → Secrets and variables → Actions."); process.exit(1); }

const win = {}; new Function("window", readFileSync(new URL("../config.js", import.meta.url), "utf8"))(win);
const M = win.SIGNAGE.monitor || {}, B = win.SIGNAGE.business || {};
const screens = M.screens || [];
if (!screens.length) { console.log("No screens listed in config.js → monitor.screens. Nothing to do."); process.exit(0); }
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9_-]+/g, "-").slice(0, 100);

let failed = 0;
for (const sc of screens) {
  const body = {
    name: sc.name || sc.screen, slug: slug(sc.screen), tags: "tv " + slug(B.office || "office"),
    desc: `Lobby signage TV. Address: ...?screen=${slug(sc.screen)}`,
    timeout: Math.max(60, (M.everyMinutes || 5) * 60),
    grace: Math.max(60, ((M.alertAfterMinutes || 15) - (M.everyMinutes || 5)) * 60),
    channels: "*", unique: ["slug"]
  };
  const r = await fetch(`${api}/checks/`, { method: "POST", headers: { "X-Api-Key": key, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (r.status === 201) console.log(`created  ${body.slug}  (${body.name})`);
  else if (r.status === 200) console.log(`updated  ${body.slug}  (${body.name})  status: ${j.status}`);
  else { failed++; console.log(`FAILED   ${body.slug}: HTTP ${r.status} ${j.error || ""}`); }
}
process.exit(failed ? 1 : 0);
