/**
 * Summarise the recorded fixtures into `packages/tmdbkit/fixtures/shapes.json`: for every operation, every field path (array items as `[]`) with the value kinds observed across all of its samples, and how often the key was absent from the objects that could have held it. This is the evidence schema authors read instead of the raw fixtures: a field that was ever `null` is `v.nullable`, one that was ever absent is `v.exactOptional`, and `""` is listed separately because TMDB uses it for "unknown" (dates, overviews), never `null`.
 *
 * Run: `yarn fixtures:shapes` (`yarn fixtures:record` runs it too).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
type Kind =
  | `null`
  | `boolean`
  | `integer`
  | `number`
  | `string`
  | `empty-string`
  | `object`
  | `array`
  | `empty-array`;

interface Accumulated {
  kinds: Set<Kind>;
  /** Objects at the parent path that lacked this key. */
  missing: number;
  /** Objects seen at the parent path. */
  parents: number;
}

const root = join(
  dirname(fileURLToPath(import.meta.url)),
  `..`,
  `packages`,
  `tmdbkit`,
  `fixtures`
);
const manifest = JSON.parse(
  readFileSync(join(root, `manifest.json`), `utf8`)
) as {
  entries: Array<{ operation: string; file: string; status: number }>;
};

const kindOf = (value: Json): Kind => {
  if (value === null) return `null`;
  if (Array.isArray(value)) return value.length === 0 ? `empty-array` : `array`;
  if (typeof value === `number`)
    return Number.isInteger(value) ? `integer` : `number`;
  if (typeof value === `string`)
    return value === `` ? `empty-string` : `string`;
  return typeof value === `boolean` ? `boolean` : `object`;
};

/** The object path a key lives in: `a.b` → `a`, `a[].b` → `a[]`, `b` → `` (the root). Array-item paths (`a[]`) have no parent object. */
const parentOf = (path: string): string | null => {
  if (path.endsWith(`[]`)) return null;
  const dot = path.lastIndexOf(`.`);
  return dot === -1 ? `` : path.slice(0, dot);
};

const accumulated: Record<string, Record<string, Accumulated>> = {};
/** Per operation, each sample's key counts and object counts, kept so presence is computed over every key the operation ever showed. */
const samples: Record<
  string,
  Array<{ seen: Record<string, number>; objectsAt: Record<string, number> }>
> = {};

for (const { operation, file, status } of manifest.entries) {
  if (status !== 200) continue;
  const acc = (accumulated[operation] ??= {});
  const seen: Record<string, number> = {};
  const objectsAt: Record<string, number> = {};
  (samples[operation] ??= []).push({ seen, objectsAt });

  const visit = (value: Json, path: string): void => {
    if (path !== ``) {
      (acc[path] ??= { kinds: new Set(), missing: 0, parents: 0 }).kinds.add(
        kindOf(value)
      );
      seen[path] = (seen[path] ?? 0) + 1;
    }
    if (Array.isArray(value)) {
      for (const item of value) visit(item, `${path}[]`);
    } else if (value !== null && typeof value === `object`) {
      objectsAt[path] = (objectsAt[path] ?? 0) + 1;
      for (const [key, child] of Object.entries(value))
        visit(child, path ? `${path}.${key}` : key);
    }
  };
  visit(JSON.parse(readFileSync(join(root, file), `utf8`)) as Json, ``);
}

// Presence, once every key is known: in each sample, a key is missing from each object at its parent path that didn't hold it. An empty array has no objects, so it can't make its items' keys look optional.
for (const [operation, fields] of Object.entries(accumulated)) {
  for (const { seen, objectsAt } of samples[operation]) {
    for (const [path, field] of Object.entries(fields)) {
      const parent = parentOf(path);
      if (parent === null) continue;
      const parents = objectsAt[parent] ?? 0;
      field.parents += parents;
      field.missing += parents - (seen[path] ?? 0);
    }
  }
}

const shapes: Record<
  string,
  {
    samples: number;
    fields: Record<string, { kinds: Kind[]; missing?: string }>;
  }
> = {};
for (const [operation, fields] of Object.entries(accumulated)) {
  shapes[operation] = {
    samples: manifest.entries.filter(
      (e) => e.operation === operation && e.status === 200
    ).length,
    fields: Object.fromEntries(
      Object.entries(fields).map(([path, { kinds, missing, parents }]) => [
        path,
        missing > 0
          ? { kinds: [...kinds].sort(), missing: `${missing}/${parents}` }
          : { kinds: [...kinds].sort() }
      ])
    )
  };
}

writeFileSync(
  join(root, `shapes.json`),
  `${JSON.stringify(shapes, null, 1)}\n`
);
console.log(`Wrote shapes for ${Object.keys(shapes).length} operations`);
