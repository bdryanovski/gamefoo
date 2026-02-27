// scripts/fix-api-frontmatter.ts
import {
  readdirSync,
  readFileSync,
  writeFileSync,
  statSync,
  existsSync,
} from "fs";
import { join, basename } from "path";

const API_DIR = "./docs/src/content/docs/api";

function sanitizeTitle(title: string): string {
  return (
    title
      // Remove markdown escape backslashes: \< \> \| etc.
      .replace(/\\(.)/g, "$1")
      // Remove markdown bold/italic
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      // Collapse extra whitespace
      .trim()
  );
}

function toTitle(filePath: string): string {
  const name = basename(filePath, ".md");
  if (name.toLowerCase() === "readme") return "API Overview";
  return name
    .replace(/^(class|interface|type-alias|function|enum)\./i, "")
    .replace(/[-_.]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function extractTitleFromContent(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? sanitizeTitle(match[1].trim()) : null;
}

// Use single-quoted YAML — no escape sequences allowed inside, just double any single quotes
function yamlSingleQuote(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function processFile(filePath: string) {
  let content = readFileSync(filePath, "utf-8");

  if (content.startsWith("---")) {
    const hasTitle = /^title:/m.test(content.split("---")[1] || "");
    if (hasTitle) return;

    content = content.replace(
      "---\n",
      `---\ntitle: ${yamlSingleQuote(toTitle(filePath))}\n`,
    );
    writeFileSync(filePath, content);
    console.log(`✓ Injected title: ${basename(filePath)}`);
    return;
  }

  const extractedTitle = extractTitleFromContent(content);
  const title = extractedTitle || toTitle(filePath);
  const bodyWithoutH1 = content.replace(/^#\s+.+\n\n?/, "");
  const frontmatter = `---\ntitle: ${yamlSingleQuote(title)}\n---\n\n`;

  writeFileSync(filePath, frontmatter + bodyWithoutH1);
  console.log(`✓ Added frontmatter: ${basename(filePath)} → ${title}`);
}

function walk(dir: string) {
  if (!existsSync(dir)) {
    console.error(`❌ Directory not found: ${dir}`);
    process.exit(1);
  }
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
console.log("\n✅ All API frontmatter patched\n");
