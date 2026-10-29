/**
 * Write the mechanical parts of tmdbkit's read operations from `operations.ts` and the vendored OpenAPI spec: each op file (input schema + `Fetcher`) and its spec, plus every domain's `index.ts`. Op and spec files are **only created, never overwritten**: once written they're hand-owned like the rest of the source. Index files are always regenerated, since they only list what exists.
 *
 * Run: `node scripts/codegen/scaffold.ts [domain …]`, then `vp check --fix`.
 *
 * Input rules (docs/plan.md, Phase 3 conventions): path params are top-level (`tmdbId` for `*_id` integers, `ordinal` for season/episode numbers, encoded strings otherwise); required query params are top-level too, the rest go under `params`; dotted range params group into `{ gte, lte }`; AND/OR list params take an array (comma = AND) or a `|`-joined string (OR); `appendToResponse` is a picklist array of at most 20.
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync
} from "node:fs";
import { dirname, join, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { operations, type Operation } from "./operations.ts";

interface Param {
  name: string;
  in: `path` | `query`;
  required?: boolean;
  description?: string;
  schema: { type?: string; format?: string; enum?: Array<string | number> };
}

const repo = join(dirname(fileURLToPath(import.meta.url)), `..`, `..`);
const src = join(repo, `packages`, `tmdbkit`, `src`);
const spec = JSON.parse(
  readFileSync(join(repo, `docs`, `openapi`, `tmdb-api-v3.json`), `utf8`)
) as {
  paths: Record<string, { get: { parameters?: Param[] } }>;
};

const camel = (name: string): string =>
  name.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());
const pascal = (name: string): string =>
  name.charAt(0).toUpperCase() + name.slice(1);
const ignored = new Set([
  `session_id`,
  `guest_session_id`,
  `append_to_response`
]);
const isList = (p: Param): boolean =>
  (p.description ?? ``).includes("comma (`AND`) or pipe (`OR`)");

const doc = (p: Param, indent: string): string => {
  const text = (p.description ?? ``).replace(/\s+/g, ` `).trim();
  return text
    ? `${indent}/** ${text.charAt(0).toUpperCase()}${text.slice(1)} */\n`
    : ``;
};

const scalar = (p: Param, imports: Set<string>): string => {
  const { type, format, enum: values } = p.schema;
  if (values)
    return `v.picklist([${values.map((x) => JSON.stringify(x)).join(`, `)}])`;
  if (type === `integer`) {
    imports.add(`integer`);
    return `integer`;
  }
  if (type === `number`) return `v.number()`;
  if (type === `boolean`) return `v.boolean()`;
  if (format === `date`) {
    imports.add(`isoDate`);
    return `isoDate`;
  }
  return `v.string()`;
};

const queryValue = (p: Param, imports: Set<string>): string => {
  const item = scalar(p, imports);
  return isList(p)
    ? `v.union([v.string(), v.array(${item === `v.string()` ? `v.string()` : item})])`
    : item;
};

const pathValue = (
  p: Param,
  imports: Set<string>
): { schema: string; isString: boolean } => {
  if (p.schema.enum) return { schema: scalar(p, imports), isString: true };
  if (p.schema.type === `integer`) {
    const ord = /^(season|episode)_number$/.test(p.name);
    imports.add(ord ? `ordinal` : `tmdbId`);
    return { schema: ord ? `ordinal` : `tmdbId`, isString: false };
  }
  return { schema: `v.string()`, isString: true };
};

const opFile = (op: Operation): string => {
  const params = spec.paths[op.path].get.parameters ?? [];
  const imports = new Set<string>();
  const pathParams = params.filter((p) => p.in === `path`);
  const query = params.filter((p) => p.in === `query` && !ignored.has(p.name));
  const required = query.filter((p) => p.required);
  const optional = query.filter((p) => !p.required);

  // Group dotted range params (`vote_average.gte`) under their base name; a base that is also a plain param (`certification`) takes either.
  const groups = new Map<string, Param[]>();
  const plain: Param[] = [];
  for (const p of optional) {
    const [base, bound] = p.name.split(`.`);
    if (bound) groups.set(base, [...(groups.get(base) ?? []), p]);
    else plain.push(p);
  }

  const lines: string[] = [];
  const pathSegments: Record<string, string> = {};
  for (const p of pathParams) {
    const { schema, isString } = pathValue(p, imports);
    lines.push(`${doc(p, `  `)}  ${camel(p.name)}: ${schema},`);
    pathSegments[p.name] = isString
      ? `\${encodeURIComponent(${camel(p.name)})}`
      : `\${${camel(p.name)}}`;
  }
  for (const p of required)
    lines.push(`${doc(p, `  `)}  ${camel(p.name)}: ${queryValue(p, imports)},`);

  const optionalLines: string[] = [];
  for (const p of plain) {
    const range = groups.get(p.name);
    const value = queryValue(p, imports);
    if (range) {
      const bounds = range
        .map((r) => `${camel(r.name.split(`.`)[1])}: ${queryValue(r, imports)}`)
        .join(`, `);
      optionalLines.push(
        `${doc(p, `        `)}        ${camel(p.name)}: v.union([${value}, v.partial(v.object({ ${bounds} }))]),`
      );
      groups.delete(p.name);
    } else {
      optionalLines.push(
        `${doc(p, `        `)}        ${camel(p.name)}: ${value},`
      );
    }
  }
  for (const [base, range] of groups) {
    const bounds = range
      .map(
        (r) =>
          `${doc(r, `          `)}          ${camel(r.name.split(`.`)[1])}: ${queryValue(r, imports)}`
      )
      .join(`,\n`);
    optionalLines.push(
      `        ${camel(base)}: v.partial(v.object({\n${bounds}\n        })),`
    );
  }
  if (op.appendable) {
    optionalLines.push(
      `        /** Fetch these related resources in the same request; each comes back under its own key. At most 20. */\n        appendToResponse: v.pipe(v.array(v.picklist([${op.appendable.map((a) => `\`${a}\``).join(`, `)}])), v.maxLength(20)),`
    );
  }
  if (optionalLines.length > 0) {
    lines.push(
      `  params: v.exactOptional(\n    v.partial(\n      v.object({\n${optionalLines.join(`\n`)}\n      })\n    )\n  ),`
    );
  }

  const route = op.path
    .replace(/^\/3/, ``)
    .replace(/\{([a-z_]+)\}/g, (_, name: string) => pathSegments[name]);
  const typeName = pascal(op.output);
  const typeFrom = posix.relative(op.domain, op.outputFrom);
  const typeImport = `${typeFrom.startsWith(`.`) ? typeFrom : `./${typeFrom}`}.js`;
  const header = `/**\n * ### [${op.title}](https://developer.themoviedb.org/reference/${op.docs})\n *\n * **GET** \`${op.path.replace(/^\/3/, ``)}\`\n */`;
  const validations = [...imports].sort();
  const validationImports = [
    ...(validations.some((x) => x !== `isoDate`)
      ? [
          `import { ${validations.filter((x) => x !== `isoDate`).join(`, `)} } from "../validations/integer.js";`
        ]
      : []),
    ...(imports.has(`isoDate`)
      ? [`import { isoDate } from "../validations/isoDate.js";`]
      : [])
  ];

  if (lines.length === 0) {
    return `import { get, type Fetcher } from "../requests/methods.js";\nimport type { ${typeName} } from "${typeImport}";\n\n${header}\nexport const ${op.name}: Fetcher<null, ${typeName}> = async (options) =>\n  get(\`${route}\`, undefined, options);\n`;
  }

  const destructure = [
    ...pathParams.map((p) => camel(p.name)),
    ...required.map((p) => camel(p.name)),
    ...(optionalLines.length > 0 ? [`params`] : [])
  ];
  const queryArg =
    required.length > 0
      ? `{ ${optionalLines.length > 0 ? `...params, ` : ``}${required.map((p) => camel(p.name)).join(`, `)} }`
      : optionalLines.length > 0
        ? `params`
        : `undefined`;
  return [
    `import * as v from "valibot";`,
    `import { get, type Fetcher } from "../requests/methods.js";`,
    ...validationImports,
    `import type { ${typeName} } from "${typeImport}";`,
    ``,
    `export const ${op.name}Schema = v.object({\n${lines.join(`\n`)}\n});`,
    ``,
    header,
    `export const ${op.name}: Fetcher<typeof ${op.name}Schema, ${typeName}> = async (\n  { ${destructure.join(`, `)} },\n  options\n) => get(\`${route}\`, ${queryArg}, options);`,
    ``
  ].join(`\n`);
};

const specFile = (op: Operation): string => {
  const params = spec.paths[op.path].get.parameters ?? [];
  const hasInput =
    params.some(
      (p) => p.in === `path` || (p.in === `query` && !ignored.has(p.name))
    ) || Boolean(op.appendable);
  const required = params
    .filter((p) => p.in === `query` && p.required)
    .map((p) => camel(p.name));
  const hasParams =
    params.some(
      (p) => p.in === `query` && !p.required && !ignored.has(p.name)
    ) || Boolean(op.appendable);
  const schemaName = `${op.output}Schema`;
  const typeFrom = posix.relative(op.domain, op.outputFrom);
  const schemaImport = `${typeFrom.startsWith(`.`) ? `../${typeFrom}` : `../${typeFrom}`}.js`;
  const route = op.path.replace(/^\/3/, ``);
  const mswRoute = route.replace(
    /\{([a-z_]+)\}/g,
    (_, name: string) => `:${camel(name)}`
  );
  const expectedPath = `/3${route.replace(/\{([a-z_]+)\}/g, (_, name: string) => `\${config.${camel(name)}}`)}`;
  const queryParts = [
    ...(hasParams ? [`...config.params`] : []),
    ...required.map((r) => `${r}: config.${r}`)
  ];
  const fixtureTest = op.fixture
    ? `\ndescribe(\`${schemaName}\`, () => {\n  // Real responses (fixtures/${op.fixture}) are what catch a wrong nullability; generated mocks only ever match the schema.\n  it.each(fixtures(\`${op.fixture}\`))(\`accepts TMDB's recorded response: $label\`, ({ body }) => {\n    const result = v.safeParse(${schemaName}, body);\n    // On failure the diff shows Valibot's summary of every issue.
    expect(result.issues && v.summarize(result.issues)).toBeUndefined();\n  });\n});\n`
    : `\n// No recorded fixture: the \`latest\` endpoints return whatever was created last, which may be adult content. The response shares ${schemaName} with the details endpoint, whose fixtures are checked there.\n`;
  return [
    ...(op.fixture ? [`import * as v from "valibot";`] : []),
    `import { describe, it, expect } from "vite-plus/test";`,
    `import { mockUtils } from "#mocks";`,
    `import { ${[...(op.fixture ? [`fixtures`] : []), ...(hasInput ? [`expectedQuery`] : [])].join(`, `) || `expectedQuery`} } from "#fixtures";`,
    `import { toValidated } from "../../requests/toValidated.js";`,
    `import { ${op.name}${hasInput ? `, ${op.name}Schema` : ``} } from "../${op.name}.js";`,
    `import { ${schemaName} } from "${schemaImport}";`,
    ``,
    `describe(\`${op.name}\`, { repeats: 5 }, () => {`,
    `  const { ${hasInput ? `config, ` : ``}expected, requests } = mockUtils.request.get(\n    \`${mswRoute}\`,\n    ${hasInput ? `${op.name}Schema` : `null`},\n    ${schemaName}\n  );`,
    ``,
    `  it(\`sends GET ${route} and resolves the validated response\`, async () => {`,
    `    await expect(\n      toValidated(${op.name}, ${hasInput ? `${op.name}Schema` : `null`}, ${schemaName})(${hasInput ? `config` : ``})\n    ).resolves.toEqual(expected);`,
    `    const sent = new URL(requests.at(-1)?.url ?? \`\`);`,
    `    expect(decodeURIComponent(sent.pathname)).toBe(\`${hasInput ? expectedPath : `/3${route}`}\`);`,
    ...(hasInput
      ? [
          `    expect(Object.fromEntries(sent.searchParams)).toEqual(\n      expectedQuery({ ${queryParts.join(`, `)} })\n    );`
        ]
      : []),
    `  });`,
    `});`,
    fixtureTest
  ].join(`\n`);
};

const write = (file: string, content: string): boolean => {
  if (existsSync(file)) return false;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
  return true;
};

const domains = process.argv.slice(2);
const selected = operations.filter(
  (op) => domains.length === 0 || domains.includes(op.domain)
);
let created = 0;
for (const op of selected) {
  if (write(join(src, op.domain, `${op.name}.ts`), opFile(op))) created++;
  if (
    write(join(src, op.domain, `__tests__`, `${op.name}.spec.ts`), specFile(op))
  )
    created++;
}

// Index files list what exists, so they are always regenerated.
const listModules = (dir: string): string[] =>
  existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => f.endsWith(`.ts`) && f !== `index.ts`)
        .map((f) => f.replace(/\.ts$/, ``))
        .sort()
    : [];
const domainDirs = [...new Set(operations.map((op) => op.domain))].filter((d) =>
  existsSync(join(src, d))
);
for (const domain of domainDirs) {
  const types = listModules(join(src, domain, `types`));
  if (types.length > 0) {
    writeFileSync(
      join(src, domain, `types`, `index.ts`),
      `${types.map((t) => `export * from "./${t}.js";`).join(`\n`)}\n`
    );
  }
  const ops = listModules(join(src, domain));
  writeFileSync(
    join(src, domain, `index.ts`),
    `${[...ops.map((o) => `export * from "./${o}.js";`), ...(types.length > 0 ? [`export * from "./types/index.js";`] : [])].join(`\n`)}\n`
  );
}
const shared = listModules(join(src, `types`));
writeFileSync(
  join(src, `types`, `index.ts`),
  `${shared.map((t) => `export * from "./${t}.js";`).join(`\n`)}\n`
);
writeFileSync(
  join(src, `index.ts`),
  `/**\n * @saeris/tmdbkit — a type-safe client for the TMDB v3 API.\n */\n\n${[...domainDirs.sort(), `requests`, `types`, `validations`].map((d) => `export * from "./${d}/index.js";`).join(`\n`)}\n`
);
console.log(
  `Created ${created} files for ${selected.length} operations; regenerated ${domainDirs.length} domain indexes.`
);
