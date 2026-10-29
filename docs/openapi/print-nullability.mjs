import s from "./core-schemas.json" with { type: "json" };

const paths = process.argv.slice(2);

for (const path of paths) {
  const entry = s[path];
  if (entry) {
    console.log(`\n=== ${path} ===`);
    const props = entry.schema?.properties ?? {};
    for (const [k, prop] of Object.entries(props)) {
      const type = Array.isArray(prop.type) ? prop.type.join("|") : prop.type;
      const nullable = prop.nullable ? "nullable" : "";
      const desc = prop.description
        ? ` — ${prop.description.slice(0, 70)}`
        : "";
      console.log(`  ${k}: ${type} ${nullable}${desc}`);
    }
  } else {
    console.log(`\n=== ${path} (NOT FOUND) ===`);
  }
}
