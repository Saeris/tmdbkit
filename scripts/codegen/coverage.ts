/**
 * Print the README's "API Coverage" tables: every implemented operation from `operations.ts`, grouped by domain, then the session-scoped operations the spec has that tmdbkit doesn't implement yet.
 *
 * Run: `node scripts/codegen/coverage.ts > coverage.md`, then replace what sits between the coverage markers in `packages/tmdbkit/README.md` with the output (minus its first, summary line).
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { operations } from "./operations.ts";

const repo = join(dirname(fileURLToPath(import.meta.url)), `..`, `..`);
const spec = JSON.parse(
  readFileSync(join(repo, `docs`, `openapi`, `tmdb-api-v3.json`), `utf8`)
) as {
  paths: Record<
    string,
    Record<string, { operationId: string; summary?: string }>
  >;
};

const titles: Record<string, string> = {
  configuration: `Configuration`,
  certification: `Certifications`,
  genre: `Genres`,
  "watch-providers": `Watch Providers`,
  movie: `Movies`,
  tv: `TV Series, Seasons & Episodes`,
  person: `People`,
  collection: `Collections`,
  company: `Companies`,
  network: `Networks`,
  keyword: `Keywords`,
  credit: `Credits`,
  review: `Reviews`,
  list: `Lists`,
  search: `Search`,
  discover: `Discover`,
  find: `Find`,
  trending: `Trending`
};

const lines: string[] = [];
for (const [domain, title] of Object.entries(titles)) {
  const ops = operations.filter((op) => op.domain === domain);
  lines.push(`#### ${title}`, ``, `| Operation | Endpoint |`, `| --- | --- |`);
  for (const op of ops) {
    lines.push(
      `| [\`${op.name}\`](https://developer.themoviedb.org/reference/${op.docs}) | \`GET ${op.path.replace(/^\/3/, ``)}\` |`
    );
  }
  lines.push(``);
}

const implemented = new Set(operations.map((op) => op.path));
const missing: string[] = [];
for (const [path, methods] of Object.entries(spec.paths)) {
  for (const method of Object.keys(methods)) {
    if (method === `get` && implemented.has(path)) continue;
    missing.push(`\`${method.toUpperCase()} ${path.replace(/^\/3/, ``)}\``);
  }
}
lines.push(
  `#### Not yet implemented`,
  ``,
  `The ${missing.length} session-scoped operations (authentication, account, ratings, list editing, guest sessions and account states) need a user session and are planned for a later release: ${missing.join(`, `)}.`
);

console.log(`${operations.length} implemented, ${missing.length} not yet`);
console.log(lines.join(`\n`));
