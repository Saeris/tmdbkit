/**
 * Print a Valibot draft for a recorded response (or one object inside it), straight from the evidence in `fixtures/shapes.json`. It is the starting point for hand-written schemas, not their source: a person still decides names, shared entities and docs.
 *
 * Run: `node scripts/codegen/draft.ts <operation> [path]`, e.g. `node scripts/codegen/draft.ts movie-details` or `… movie-credits cast[]`.
 *
 * Mapping: a kind set containing `null` → `v.nullable(…)`; a key ever absent → `v.exactOptional(…)`; integer-only numbers → `v.number()` with a `// integer` note; `""` alongside strings stays `v.string()` (noted, since TMDB uses `""` for "unknown"); keys that are ISO 3166-1 country codes collapse into `v.record(v.string(), …)`.
 */
import shapesJson from "../../packages/tmdbkit/fixtures/shapes.json" with { type: "json" };

interface FieldShape {
  kinds: string[];
  missing?: string;
}

const shapes = shapesJson as Record<
  string,
  { samples: number; fields: Record<string, FieldShape> }
>;

const [operation, base = ``] = process.argv.slice(2);
const op = operation ? shapes[operation] : undefined;
if (!operation || !op) {
  console.error(
    `Usage: draft.ts <operation> [path]\nOperations: ${Object.keys(shapes).join(`, `)}`
  );
  process.exit(1);
}

const camel = (key: string): string =>
  key.replace(/_([a-zA-Z])/g, (_, c: string) => c.toUpperCase());
/** TMDB keys are lower snake_case, so an all-capitals two-letter segment is a country code: a record key, not a field. */
const recordKey = /^[A-Z]{2}(-[A-Z0-9]{1,3})?$/;
const normalise = (path: string): string =>
  path
    .split(`.`)
    .map((segment) =>
      recordKey.test(segment.replace(/\[\]$/, ``))
        ? `{}${segment.endsWith(`[]`) ? `[]` : ``}`
        : segment
    )
    .join(`.`);

// Merge fields whose paths differ only by record keys (results.AE.buy[] and results.AL.buy[] → results.{}.buy[]).
const fields: Record<
  string,
  { kinds: Set<string>; missing: number; total: number }
> = {};
for (const [path, shape] of Object.entries(op.fields)) {
  const key = normalise(path);
  const field = (fields[key] ??= { kinds: new Set(), missing: 0, total: 0 });
  for (const kind of shape.kinds) field.kinds.add(kind);
  const [missing, total] = (shape.missing ?? `0/0`).split(`/`).map(Number);
  field.missing += missing;
  field.total += total;
}

const childrenOf = (parent: string): string[] =>
  Object.keys(fields).filter((path) => {
    if (path === parent) return false;
    const prefix = parent === `` ? `` : `${parent}.`;
    if (!path.startsWith(prefix)) return false;
    const rest = path.slice(prefix.length);
    return rest !== `` && !rest.includes(`.`) && !rest.endsWith(`[]`);
  });

const indent = (depth: number): string => `  `.repeat(depth);

const render = (path: string, depth: number): string => {
  const field = fields[path];
  // The root has no recorded kind: it is an array when its items (`[]`) were recorded, else an object.
  const kinds = field
    ? [...field.kinds]
    : path === `` && `[]` in fields
      ? [`array`]
      : [`object`];
  const nullable = kinds.includes(`null`);
  const solid = kinds.filter((k) => k !== `null`);
  // Only ever null: no evidence of the real type, so say so instead of letting a vacuous `[].every(…)` below pick one.
  if (solid.length === 0) return `v.null() /* only ever null: type unknown */`;
  let schema: string;
  let note = ``;
  if (solid.some((k) => k === `object`)) {
    const keys = childrenOf(path);
    const record =
      keys.length > 0 && keys.every((k) => k.endsWith(`.{}`) || k === `{}`);
    if (record) {
      schema = `v.record(v.string(), ${render(path === `` ? `{}` : `${path}.{}`, depth)})`;
    } else {
      const body = keys
        .map((key) => {
          const name = key.slice(key.lastIndexOf(`.`) + 1);
          const child = fields[key];
          const optional = child && child.missing > 0;
          const inner = render(key, depth + 1);
          const value = optional ? `v.exactOptional(${inner})` : inner;
          const evidence = optional
            ? ` // absent ${child.missing}/${child.total}`
            : ``;
          return `${indent(depth + 1)}${camel(name)}: ${value},${evidence}`;
        })
        .join(`\n`);
      schema = `v.object({\n${body}\n${indent(depth)}})`;
    }
  } else if (solid.some((k) => k === `array` || k === `empty-array`)) {
    schema = solid.includes(`array`)
      ? `v.array(${render(`${path}[]`, depth)})`
      : `v.array(v.unknown() /* only ever [] */)`;
  } else if (
    solid.length > 1 &&
    solid.some((k) => k === `string` || k === `empty-string`) &&
    solid.some((k) => k === `integer` || k === `number` || k === `boolean`)
  ) {
    schema = `v.union([${[...new Set(solid.map((k) => (k === `empty-string` ? `string` : k === `integer` ? `number` : k)))].map((k) => `v.${k}()`).join(`, `)}])`;
  } else if (solid.every((k) => k === `integer`)) {
    schema = `v.number()`;
    note = ` /* integer */`;
  } else if (solid.every((k) => k === `integer` || k === `number`)) {
    schema = `v.number()`;
  } else if (solid.every((k) => k === `string` || k === `empty-string`)) {
    schema = `v.string()`;
    if (solid.includes(`empty-string`))
      note = solid.includes(`string`)
        ? ` /* "" seen */`
        : ` /* only ever "" */`;
  } else if (solid.every((k) => k === `boolean`)) {
    schema = `v.boolean()`;
  } else {
    schema =
      solid.length === 0
        ? `v.null() /* only ever null */`
        : `v.unknown() /* ${solid.join(`|`)} */`;
  }
  return nullable && solid.length > 0
    ? `v.nullable(${schema})${note}`
    : `${schema}${note}`;
};

console.log(
  `// ${operation}${base ? ` @ ${base}` : ``} (${op.samples} sample${op.samples === 1 ? `` : `s`})`
);
console.log(render(normalise(base), 0));
