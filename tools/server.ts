import express from "express";
import multer from "multer";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  unlinkSync,
} from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "public");
const uploadsDir = path.join(publicDir, "uploads");
const projectsDir = path.join(publicDir, "projects");
const exportsDir = path.join(publicDir, "exports");
const distDir = path.resolve(__dirname, "dist");

for (const dir of [uploadsDir, projectsDir, exportsDir]) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

const app = express();
app.use(express.json({ limit: "256mb" }));

const upload = multer({ storage: multer.memoryStorage() });

interface ProjectSummary {
  id: string;
  name: string;
  kind: string;
  lastModified: string;
  spriteCount: number;
  animCount: number;
  imageName: string;
}

interface ProjectFile {
  projectName?: string;
  kind?: string;
  lastModified?: string;
  sprites?: unknown[];
  animations?: unknown[];
  imageData?: { name?: string };
  images?: Array<{ name?: string }>;
  map?: { screens?: Record<string, unknown> };
}

// ── Upload image ────────────────────────────────────────
app.post("/api/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: "No file provided" });
    return;
  }

  const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filename = `${Date.now()}_${safeName}`;
  await fsp.writeFile(path.join(uploadsDir, filename), file.buffer);
  res.json({ path: `/uploads/${filename}`, name: file.originalname });
});

// ── List projects ───────────────────────────────────────
app.get("/api/projects", async (_req, res) => {
  const projects: ProjectSummary[] = [];

  if (existsSync(projectsDir)) {
    for (const file of readdirSync(projectsDir)) {
      if (!file.endsWith(".json")) continue;
      try {
        const raw = await fsp.readFile(
          path.join(projectsDir, file),
          "utf8",
        );
        const data = JSON.parse(raw) as ProjectFile;
        projects.push({
          id: file.replace(/\.json$/, ""),
          name: data.projectName || "Untitled",
          kind: data.kind || "sprite",
          lastModified: data.lastModified || "",
          spriteCount: data.sprites?.length ?? 0,
          animCount: data.animations?.length ?? 0,
          imageName:
            data.images?.[0]?.name || data.imageData?.name || "",
        });
      } catch {
        /* skip corrupt files */
      }
    }
  }

  projects.sort((a, b) => b.lastModified.localeCompare(a.lastModified));
  res.json(projects);
});

// ── Project CRUD ────────────────────────────────────────
app.get("/api/projects/:id", async (req, res) => {
  const filepath = path.join(projectsDir, `${req.params.id}.json`);
  if (existsSync(filepath)) {
    res.sendFile(filepath);
    return;
  }
  res.status(404).json({ error: "Not found" });
});

app.post("/api/projects/:id", async (req, res) => {
  const body = req.body as Record<string, unknown> & { lastModified?: string };
  body.lastModified = new Date().toISOString();
  await fsp.writeFile(
    path.join(projectsDir, `${req.params.id}.json`),
    JSON.stringify(body, null, 2),
  );
  res.json({ ok: true, id: req.params.id });
});

app.delete("/api/projects/:id", (req, res) => {
  const filepath = path.join(projectsDir, `${req.params.id}.json`);
  if (existsSync(filepath)) unlinkSync(filepath);
  const exportDir = path.join(exportsDir, req.params.id);
  if (existsSync(exportDir)) rmSync(exportDir, { recursive: true });
  res.json({ ok: true });
});

// ── Export project files ────────────────────────────────
app.post("/api/projects/:id/export", async (req, res) => {
  const id = req.params.id;
  const dir = path.join(exportsDir, id);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const files = (req.body?.files ?? {}) as Record<string, unknown>;
  const saved: Record<string, string> = {};
  for (const [filename, content] of Object.entries(files)) {
    await fsp.writeFile(
      path.join(dir, filename),
      JSON.stringify(content, null, 2),
    );
    saved[filename] = `/exports/${id}/${filename}`;
  }
  res.json({ ok: true, files: saved });
});

// ── Static files & SPA fallback ─────────────────────────
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  next();
});
app.use(express.static(publicDir));
app.use(express.static(distDir));
app.use((_req, res) => {
  const index = path.join(distDir, "index.html");
  if (existsSync(index)) {
    res.sendFile(index);
    return;
  }
  res
    .status(404)
    .send(
      "Not Found — run `pnpm build` to produce the frontend, or use `pnpm dev`.",
    );
});

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  console.log(`🔧 GameFoo Dev Tools API running at http://localhost:${port}`);
  console.log(
    `🔧 Dev UI: http://localhost:5173 (pnpm dev) · Built UI: http://localhost:${port} (pnpm start)`,
  );
});
