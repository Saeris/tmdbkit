import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { toCamelKeys } from "../utils/toCamelKeys.js";
import { toSnakeCase } from "../utils/toSnakeCase.js";
import manifestJson from "../../fixtures/manifest.json" with { type: "json" };

const root = join(
  dirname(fileURLToPath(import.meta.url)),
  `..`,
  `..`,
  `fixtures`
);

interface ManifestEntry {
  operation: string;
  label: string;
  status: number;
  file: string;
}

const manifest = (manifestJson as { entries: ManifestEntry[] }).entries;

/**
 * Every successful response recorded for a fixture operation (see `scripts/record-fixtures.ts`), camelCased the way tmdbkit's request layer delivers them. Throws when there are none, so a spec can't silently check nothing.
 */
export const fixtures = (
  operation: string
): Array<{ label: string; body: unknown }> => {
  const found = manifest
    .filter((entry) => entry.operation === operation && entry.status === 200)
    .map(({ label, file }) => ({
      label,
      body: toCamelKeys(
        JSON.parse(readFileSync(join(root, file), `utf8`)) as object
      )
    }));
  if (found.length === 0) {
    throw new Error(`No recorded fixtures for "${operation}"`);
  }
  return found;
};

/** Query values are primitives or arrays of them; anything else is a bug in the spec's input schema. */
const wire = (value: unknown): string => {
  if (Array.isArray(value)) return value.map(wire).join(`,`);
  if (
    typeof value === `string` ||
    typeof value === `number` ||
    typeof value === `boolean`
  ) {
    return String(value);
  }
  throw new Error(`Unexpected query value: ${JSON.stringify(value)}`);
};

/**
 * The query params a spec expects on the wire for the `params` it passed: snake_cased keys, comma-joined arrays and dotted ranges. Written apart from `addParams` so a spec checks the request layer instead of calling it.
 */
export const expectedQuery = (
  params: Record<string, unknown> | undefined
): Record<string, string> => {
  const query: Record<string, string> = {};
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined || value === null) continue;
    if (typeof value === `object` && !Array.isArray(value)) {
      for (const [bound, limit] of Object.entries(value)) {
        if (limit !== undefined && limit !== null) {
          query[`${toSnakeCase(key)}.${bound}`] = wire(limit);
        }
      }
    } else {
      query[toSnakeCase(key)] = wire(value);
    }
  }
  return query;
};
