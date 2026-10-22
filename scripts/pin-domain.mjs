/**
 * Points the canonical domain at the newest production deployment.
 *
 * Vercel auto-assigns <project>-<team>.vercel.app to every new deployment, but
 * a manually created alias (akhil-arvapalli.vercel.app) stays pinned to
 * whichever deployment it was set on. This re-points it after each deploy.
 *
 * Usage:
 *   node scripts/pin-domain.mjs            # alias the latest deployment
 *   node scripts/pin-domain.mjs --check     # report only, change nothing
 */
import { execFileSync } from "node:child_process";

const ALIAS = "akhil-arvapalli.vercel.app";
const SCOPE = "akhil-arvapallis-projects";
const PROJECT = "akhil-arvapalli";
const checkOnly = process.argv.includes("--check");

const vercel = (args) =>
  execFileSync("npx", ["vercel", ...args], { encoding: "utf8", shell: true, maxBuffer: 32 * 1024 * 1024 });

/** The newest Ready production deployment for the project. */
function latestDeployment() {
  const out = vercel(["ls", PROJECT, "--scope", SCOPE, "--format", "json"]);
  const deployments = JSON.parse(out).deployments ?? [];
  const ready = deployments
    .filter((d) => d.target === "production" && d.state === "READY")
    .sort((a, b) => b.created - a.created);
  if (!ready.length) throw new Error("no ready production deployment found");
  return ready[0].url;
}

/** The deployment the alias currently points at. */
function currentTarget() {
  const out = vercel(["api", "/v4/aliases", "--scope", SCOPE]);
  const aliases = JSON.parse(out).aliases ?? [];
  const hit = aliases.find((a) => a.alias === ALIAS);
  return hit?.deployment?.url ?? null;
}

const latest = latestDeployment();
const current = currentTarget();

if (current === latest) {
  console.log(`${ALIAS} is already on the latest deployment (${latest}).`);
  process.exit(0);
}

if (checkOnly) {
  console.log(`${ALIAS} points at ${current ?? "(nothing)"}.`);
  console.log(`latest deployment is ${latest}.`);
  process.exit(current === latest ? 0 : 1);
}

console.log(`re-pointing ${ALIAS}`);
console.log(`  from ${current ?? "(nothing)"}`);
console.log(`  to   ${latest}`);
vercel(["alias", "set", latest, ALIAS, "--scope", SCOPE]);
console.log("done");
