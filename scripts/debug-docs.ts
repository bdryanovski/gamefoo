import { readdirSync, readFileSync, statSync, existsSync } from "fs";
import { join } from "path";

const PATHS = [
  "./docs/src/content/docs/api",
  "./docs/src/content/docs/guides",
  "./docs/src/generated-sidebar.json",
];

console.log("\n📂 Checking paths...\n");
PATHS.forEach((p) => {
  const exists = existsSync(p);
  console.log(`${exists ? "✅" : "❌"} ${p}`);
});

console.log("\n📄 Files in api/:\n");
function walk(dir: string, depth = 0) {
  if (!existsSync(dir)) {
    console.log("  (directory missing)");
    return;
  }
  readdirSync(dir).forEach((f) => {
    const full = join(dir, f);
    const isDir = statSync(full).isDirectory();
    console.log("  ".repeat(depth) + (isDir ? "📁" : "📄") + " " + f);
    if (isDir) walk(full, depth + 1);
  });
}
walk("./docs/src/content/docs/api");

console.log("\n🗂  Sidebar JSON content:\n");
const sidebarPath = "./docs/src/generated-sidebar.json";
if (existsSync(sidebarPath)) {
  console.log(readFileSync(sidebarPath, "utf-8"));
} else {
  console.log("❌ File missing");
}

console.log("\n🔍 Sample file frontmatter check:\n");
function checkFrontmatter(dir: string) {
  if (!existsSync(dir)) return;
  readdirSync(dir).forEach((f) => {
    const full = join(dir, f);
    if (statSync(full).isDirectory()) {
      checkFrontmatter(full);
      return;
    }
    if (!f.endsWith(".md")) return;
    const content = readFileSync(full, "utf-8");
    const hasFrontmatter = content.startsWith("---");
    console.log(
      `${hasFrontmatter ? "✅" : "❌"} ${full.replace("./docs/src/content/docs/", "")}`,
    );
    if (!hasFrontmatter) {
      console.log(
        "   First 100 chars:",
        content.slice(0, 100).replace(/\n/g, "\\n"),
      );
    }
  });
}
checkFrontmatter("./docs/src/content/docs/api");
