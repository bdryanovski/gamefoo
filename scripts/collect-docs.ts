import {
  readdirSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  statSync,
} from "fs";
import { join, basename, dirname, relative, extname } from "path";

const SRC_DIR = "./src";
const API_DIR = "./docs/src/content/docs/api";
const GUIDES_DIR = "./docs/src/content/docs/guides";
const SIDEBAR_CACHE = "./docs/src/generated-sidebar.json";

interface DiscoveredFile {
  sourcePath: string;
  type: "readme" | "paired" | "standalone";
  pairedTs?: string;
  relativePath: string;
}

// ─── Utilities ──────────────────────────────────────────────────────────────

function toTitle(name: string): string {
  return name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function stripExistingFrontmatter(content: string): {
  frontmatter: Record<string, string>;
  body: string;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const frontmatter: Record<string, string> = {};
  match[1].split("\n").forEach((line) => {
    const [key, ...rest] = line.split(":");
    if (key && rest.length) frontmatter[key.trim()] = rest.join(":").trim();
  });

  return { frontmatter, body: match[2] };
}

function buildFrontmatter(fields: Record<string, string>): string {
  const lines = Object.entries(fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`);
  return `---\n${lines.join("\n")}\n---\n\n`;
}

// ─── Discovery ───────────────────────────────────────────────────────────────

function walk(dir: string, found: DiscoveredFile[] = []): DiscoveredFile[] {
  readdirSync(dir).forEach((file) => {
    const fullPath = join(dir, file);
    const rel = relative(SRC_DIR, fullPath);

    if (statSync(fullPath).isDirectory()) {
      walk(fullPath, found);
      return;
    }

    if (extname(file) !== ".md") return;

    const name = basename(file, ".md");
    const dirPath = dirname(fullPath);

    if (name.toLowerCase() === "readme") {
      found.push({ sourcePath: fullPath, type: "readme", relativePath: rel });
      return;
    }

    // Check if a matching .ts or .tsx file exists next to this .md
    const paired =
      existsSync(join(dirPath, `${name}.ts`)) ||
      existsSync(join(dirPath, `${name}.tsx`));

    found.push({
      sourcePath: fullPath,
      type: paired ? "paired" : "standalone",
      pairedTs: paired ? join(dirPath, `${name}.ts`) : undefined,
      relativePath: rel,
    });
  });

  return found;
}

// ─── Processors ──────────────────────────────────────────────────────────────

/**
 * README.md → becomes a module index page in /guides/{module}/index.md
 */
function processReadme(file: DiscoveredFile) {
  const moduleDir = dirname(relative(SRC_DIR, file.sourcePath));
  const raw = readFileSync(file.sourcePath, "utf-8");
  const { frontmatter, body } = stripExistingFrontmatter(raw);

  const moduleName =
    moduleDir === "." ? "Overview" : toTitle(basename(moduleDir));
  const outDir =
    moduleDir === "." ? GUIDES_DIR : join(GUIDES_DIR, slugify(moduleDir));
  ensureDir(outDir);

  const fm = buildFrontmatter({
    title: frontmatter.title || moduleName,
    description: frontmatter.description || "",
    sidebar_label: frontmatter.sidebar_label || moduleName,
  });

  writeFileSync(join(outDir, "index.md"), fm + body.trimStart());
  console.log(`📁 README → guides/${slugify(moduleDir)}/index.md`);
}

/**
 * UserService.md + UserService.ts → merged into /api/classes/user-service.md
 * Prepends your handwritten content above the TypeDoc output.
 */
function processPaired(file: DiscoveredFile) {
  const name = basename(file.sourcePath, ".md");
  const slug = slugify(name);

  // Find the TypeDoc-generated file for this module
  // TypeDoc outputs by module path — search api dir for matching filename
  const apiMatch =
    findInDir(API_DIR, `${slug}.md`) || findInDir(API_DIR, `${name}.md`);

  const handwritten = readFileSync(file.sourcePath, "utf-8");
  const { frontmatter, body: handwrittenBody } =
    stripExistingFrontmatter(handwritten);

  if (apiMatch) {
    // Merge: handwritten content appears as an "Overview" section above API docs
    const apiContent = readFileSync(apiMatch, "utf-8");
    const { body: apiBody } = stripExistingFrontmatter(apiContent);

    const merged =
      buildFrontmatter({
        title: frontmatter.title || toTitle(name),
        description: frontmatter.description || "",
      }) +
      `## Overview\n\n${handwrittenBody.trimStart()}\n\n---\n\n## API Reference\n\n${apiBody.trimStart()}`;

    writeFileSync(apiMatch, merged);
    console.log(`🔀 Merged handwritten + TypeDoc → ${relative(".", apiMatch)}`);
  } else {
    // No TypeDoc output yet — place it in guides as a standalone page
    processStandalone(file);
  }
}

/**
 * Standalone .md → copied into /guides/{module-path}/filename.md
 */
function processStandalone(file: DiscoveredFile) {
  const rel = relative(SRC_DIR, file.sourcePath);
  const moduleDir = dirname(rel);
  const name = basename(file.sourcePath, ".md");

  const raw = readFileSync(file.sourcePath, "utf-8");
  const { frontmatter, body } = stripExistingFrontmatter(raw);

  const outDir =
    moduleDir === "." ? GUIDES_DIR : join(GUIDES_DIR, slugify(moduleDir));
  ensureDir(outDir);

  const fm = buildFrontmatter({
    title: frontmatter.title || toTitle(name),
    description: frontmatter.description || "",
  });

  writeFileSync(join(outDir, `${slugify(name)}.md`), fm + body.trimStart());
  console.log(
    `📄 Standalone → guides/${slugify(moduleDir)}/${slugify(name)}.md`,
  );
}

// ─── Sidebar Generator ───────────────────────────────────────────────────────

/**
 * Generates a complete Starlight sidebar config from the final content tree.
 * Saved to a JSON file that astro.config.mjs imports dynamically.
 */
function generateSidebar() {
  const sidebar = [];

  // Guides section — built from discovered handwritten docs
  if (existsSync(GUIDES_DIR)) {
    const guideItems = buildSidebarSection(GUIDES_DIR, "/guides");
    if (guideItems.length) {
      sidebar.push({ label: "📖 Guides", items: guideItems, collapsed: false });
    }
  }

  // API section — built from TypeDoc output
  if (existsSync(API_DIR)) {
    const apiItems = buildSidebarSection(API_DIR, "/api");
    if (apiItems.length) {
      sidebar.push({
        label: "⚙️ API Reference",
        items: apiItems,
        collapsed: false,
      });
    }
  }

  writeFileSync(SIDEBAR_CACHE, JSON.stringify(sidebar, null, 2));
  console.log("✅ Sidebar config written to", SIDEBAR_CACHE);
  return sidebar;
}

function buildSidebarSection(dir: string, urlBase: string) {
  const items: object[] = [];

  readdirSync(dir).forEach((entry) => {
    const fullPath = join(dir, entry);

    if (statSync(fullPath).isDirectory()) {
      const children = buildSidebarSection(fullPath, `${urlBase}/${entry}`);
      if (children.length) {
        items.push({ label: toTitle(entry), items: children, collapsed: true });
      }
    } else if (entry.endsWith(".md")) {
      const name = basename(entry, ".md");
      const label = name === "index" ? "→ Overview" : toTitle(name);
      items.push({ label, link: `${urlBase}/${name === "index" ? "" : name}` });
    }
  });

  // Always put index/overview first
  return items.sort((a: any, b: any) =>
    a.label === "→ Overview" ? -1 : b.label === "→ Overview" ? 1 : 0,
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function findInDir(dir: string, filename: string): string | null {
  if (!existsSync(dir)) return null;

  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      const found = findInDir(fullPath, filename);
      if (found) return found;
    } else if (entry.toLowerCase() === filename.toLowerCase()) {
      return fullPath;
    }
  }
  return null;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  console.log("🔍 Scanning src/ for markdown files...\n");
  const files = walk(SRC_DIR);

  if (!files.length) {
    console.log("No markdown files found in src/");
  }

  files.forEach((file) => {
    switch (file.type) {
      case "readme":
        processReadme(file);
        break;
      case "paired":
        processPaired(file);
        break;
      case "standalone":
        processStandalone(file);
        break;
    }
  });

  console.log("\n🗺  Generating sidebar...");
  generateSidebar();
  console.log("\n✅ Done\n");
}

main();
