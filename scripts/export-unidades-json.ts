/**
 * One-time export: writes data/unidades_seed.json from current mock-data.
 * Run: npx tsx scripts/export-unidades-json.ts
 */
import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { unidades } from "../src/lib/mock-data";

const __dirname = dirname(fileURLToPath(import.meta.url));
const seed = join(__dirname, "..", "data", "unidades_seed.json");
const pub = join(__dirname, "..", "public", "data", "unidades.json");
mkdirSync(dirname(seed), { recursive: true });
mkdirSync(dirname(pub), { recursive: true });
const body = JSON.stringify(unidades, null, 2);
writeFileSync(seed, body, "utf-8");
writeFileSync(pub, body, "utf-8");
console.log("Wrote", seed, "&", pub, `(${unidades.length} rows)`);
