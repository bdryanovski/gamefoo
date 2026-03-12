import index from "./index.html";
import { existsSync, readdirSync, mkdirSync, unlinkSync, rmSync } from "node:fs";

for (const dir of ["./public/uploads", "./public/projects", "./public/exports"]) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function handleAPI(req: Request, path: string): Promise<Response> {
  // ── Upload image ────────────────────────────────────────
  if (path === "/api/upload" && req.method === "POST") {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return json({ error: "No file provided" }, 400);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filename = `${Date.now()}_${safeName}`;
    await Bun.write(`./public/uploads/${filename}`, file);
    return json({ path: `/uploads/${filename}`, name: file.name });
  }

  // ── List projects ───────────────────────────────────────
  if (path === "/api/projects" && req.method === "GET") {
    const projects: Array<{
      id: string;
      name: string;
      lastModified: string;
      spriteCount: number;
      animCount: number;
      imageName: string;
    }> = [];

    const dir = "./public/projects";
    if (existsSync(dir)) {
      for (const file of readdirSync(dir)) {
        if (!file.endsWith(".json")) continue;
        try {
          const data = await Bun.file(`${dir}/${file}`).json();
          projects.push({
            id: file.replace(".json", ""),
            name: data.projectName || "Untitled",
            lastModified: data.lastModified || "",
            spriteCount: data.sprites?.length ?? 0,
            animCount: data.animations?.length ?? 0,
            imageName: data.imageData?.name || "",
          });
        } catch { /* skip corrupt files */ }
      }
    }

    projects.sort((a, b) => b.lastModified.localeCompare(a.lastModified));
    return json(projects);
  }

  // ── Project CRUD ────────────────────────────────────────
  const projectMatch = path.match(/^\/api\/projects\/([\w-]+)$/);
  if (projectMatch) {
    const id = projectMatch[1]!;

    if (req.method === "GET") {
      const file = Bun.file(`./public/projects/${id}.json`);
      if (await file.exists()) {
        return new Response(file, {
          headers: { "Content-Type": "application/json" },
        });
      }
      return json({ error: "Not found" }, 404);
    }

    if (req.method === "POST") {
      const body = await req.json();
      body.lastModified = new Date().toISOString();
      await Bun.write(
        `./public/projects/${id}.json`,
        JSON.stringify(body, null, 2),
      );
      return json({ ok: true, id });
    }

    if (req.method === "DELETE") {
      const filepath = `./public/projects/${id}.json`;
      if (existsSync(filepath)) unlinkSync(filepath);
      const exportDir = `./public/exports/${id}`;
      if (existsSync(exportDir)) rmSync(exportDir, { recursive: true });
      return json({ ok: true });
    }
  }

  // ── Export project files ────────────────────────────────
  const exportMatch = path.match(/^\/api\/projects\/([\w-]+)\/export$/);
  if (exportMatch && req.method === "POST") {
    const id = exportMatch[1]!;
    const body = await req.json();
    const dir = `./public/exports/${id}`;
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    const saved: Record<string, string> = {};
    for (const [filename, content] of Object.entries(
      body.files as Record<string, unknown>,
    )) {
      await Bun.write(`${dir}/${filename}`, JSON.stringify(content, null, 2));
      saved[filename] = `/exports/${id}/${filename}`;
    }
    return json({ ok: true, files: saved });
  }

  return json({ error: "Not found" }, 404);
}

const server = Bun.serve({
  port: 3001,
  routes: {
    "/": index,
  },
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname;

    if (path.startsWith("/api/")) {
      return handleAPI(req, path);
    }

    const file = Bun.file(`./public${path}`);
    if (await file.exists()) {
      return new Response(file);
    }

    return new Response("Not Found", { status: 404 });
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log(`🔧 GameFoo Dev Tools running at ${server.url}`);
