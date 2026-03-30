/**
 * Copy public/data/unidades.json -> dist/data/unidades.json without a full Vite build.
 * Use after editing the JSON when testing `vite preview` or a static dist/ server.
 */
import { copyFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "public", "data", "unidades.json");
const dest = join(root, "dist", "data", "unidades.json");

if (!existsSync(src)) {
  console.error("Missing:", src);
  process.exit(1);
}
mkdirSync(dirname(dest), { recursive: true });
copyFileSync(src, dest);
console.log("OK:", dest);
