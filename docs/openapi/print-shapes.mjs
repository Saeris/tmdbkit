import s from "./core-schemas.json" with { type: "json" };

function shape(schema, depth = 0, max = 2) {
  const pad = "  ".repeat(depth);
  if (!schema) return `${pad}(none)\n`;
  if (schema.$ref) return `${pad + schema.$ref}\n`;
  if (schema.type === "object" && schema.properties) {
    let out = "";
    for (const [k, v] of Object.entries(schema.properties)) {
      let t = v.type || "obj";
      if (v.$ref) t = v.$ref.split("/").pop();
      if (v.type === "array") {
        t = `array<${v.items?.type || v.items?.$ref?.split("/").pop() || "?"}>`;
      }
      out += `${pad + k}: ${t}\n`;
      if (depth < max && v.type === "object" && v.properties) {
        out += shape(v, depth + 1, max);
      }
      if (
        depth < max &&
        v.type === "array" &&
        v.items?.type === "object" &&
        v.items.properties
      ) {
        out += `${pad}  [${k} item]\n${shape(v.items, depth + 1, max)}`;
      }
    }
    return out;
  }
  return `${pad + (schema.type || "any")}\n`;
}

for (const [p, info] of Object.entries(s)) {
  console.log(`=== ${p} ===`);
  console.log(
    `params: ${(info.params || []).map((x) => x.name + (x.required ? "*" : "")).join(", ")}`
  );
  console.log(shape(info.schema));
  console.log();
}
