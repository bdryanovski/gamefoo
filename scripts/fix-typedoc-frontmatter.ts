import { readdirSync, readFileSync, writeFileSync, statSync } from "fs";
import { join, basename } from "path";

const API_DIR = "./docs/src/content/docs/api";

function toTitle(filename: string): string {
  return basename(filename, ".md")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function processFile(filePath: string) {
  let content = readFileSync(filePath, "utf-8");

  // TypeDoc markdown plugin adds its own header, strip it and inject frontmatter
  const hasFrontmatter = content.startsWith("---");
  if (!hasFrontmatter) {
    const title = toTitle(filePath);
    const frontmatter = `---\ntitle: ${title}\n---\n\n`;
    content = frontmatter + content;
    writeFileSync(filePath, content);
    console.log(`✓ Fixed frontmatter: ${basename(filePath)}`);
  }
}

function walk(dir: string) {
  readdirSync(dir).forEach((file) => {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith(".md")) {
      processFile(fullPath);
    }
  });
}

walk(API_DIR);
console.log("✅ Frontmatter processing complete");
