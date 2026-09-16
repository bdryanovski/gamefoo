import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import multer from 'multer';
import { existsSync, mkdirSync, readdirSync, rmSync, unlinkSync } from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

export interface ApiAppOptions {
  publicDir: string;
}

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

const SAFE_ID = /^[A-Za-z0-9_-]{1,128}$/;

function isValidFilename(name: string): boolean {
  return (
    name.length > 0 &&
    name.length <= 255 &&
    !name.includes('/') &&
    !name.includes('\\') &&
    name !== '.' &&
    name !== '..'
  );
}

function projectId(req: Request, res: Response): string | null {
  const id = req.params.id;
  if (typeof id !== 'string' || !SAFE_ID.test(id)) {
    res.status(400).json({ error: 'Invalid project id' });
    return null;
  }
  return id;
}

export function createApiApp(options: ApiAppOptions): Express {
  const uploadsDir = path.join(options.publicDir, 'uploads');
  const projectsDir = path.join(options.publicDir, 'projects');
  const exportsDir = path.join(options.publicDir, 'exports');

  for (const dir of [uploadsDir, projectsDir, exportsDir]) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  const app = express();
  app.use('/api', express.json({ limit: '256mb' }));

  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 256 * 1024 * 1024 },
  });

  app.post('/api/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }

    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}_${safeName}`;
    await fsp.writeFile(path.join(uploadsDir, filename), file.buffer);
    res.json({ path: `/uploads/${filename}`, name: file.originalname });
  });

  app.get('/api/projects', async (_req, res) => {
    const projects: ProjectSummary[] = [];

    for (const file of readdirSync(projectsDir)) {
      if (!file.endsWith('.json')) {
        continue;
      }
      try {
        const raw = await fsp.readFile(path.join(projectsDir, file), 'utf8');
        const data = JSON.parse(raw) as ProjectFile;
        projects.push({
          id: file.replace(/\.json$/, ''),
          name: data.projectName || 'Untitled',
          kind: data.kind || 'sprite',
          lastModified: data.lastModified || '',
          spriteCount: data.sprites?.length ?? 0,
          animCount: data.animations?.length ?? 0,
          imageName: data.images?.[0]?.name || data.imageData?.name || '',
        });
      } catch {
        /* skip corrupt files */
      }
    }

    projects.sort((a, b) => b.lastModified.localeCompare(a.lastModified));
    res.json(projects);
  });

  app.get('/api/projects/:id', async (req, res) => {
    const id = projectId(req, res);
    if (!id) return;

    const filepath = path.join(projectsDir, `${id}.json`);
    if (existsSync(filepath)) {
      res.sendFile(filepath);
      return;
    }
    res.status(404).json({ error: 'Not found' });
  });

  app.post('/api/projects/:id', async (req, res) => {
    const id = projectId(req, res);
    if (!id) return;

    const body = req.body;
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      res.status(400).json({ error: 'Invalid project payload' });
      return;
    }

    body.lastModified = new Date().toISOString();
    await fsp.writeFile(path.join(projectsDir, `${id}.json`), JSON.stringify(body, null, 2));
    res.json({ ok: true, id });
  });

  app.delete('/api/projects/:id', (req, res) => {
    const id = projectId(req, res);
    if (!id) return;

    const filepath = path.join(projectsDir, `${id}.json`);
    if (existsSync(filepath)) {
      unlinkSync(filepath);
    }
    const exportDir = path.join(exportsDir, id);
    if (existsSync(exportDir)) {
      rmSync(exportDir, { recursive: true });
    }
    res.json({ ok: true });
  });

  app.post('/api/projects/:id/export', async (req, res) => {
    const id = projectId(req, res);
    if (!id) return;

    const files = req.body?.files;
    if (typeof files !== 'object' || files === null || Array.isArray(files)) {
      res.status(400).json({ error: 'Invalid export payload' });
      return;
    }
    for (const filename of Object.keys(files)) {
      if (!isValidFilename(filename)) {
        res.status(400).json({ error: `Invalid filename: ${filename}` });
        return;
      }
    }

    const dir = path.join(exportsDir, id);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    const saved: Record<string, string> = {};
    for (const [filename, content] of Object.entries(files)) {
      await fsp.writeFile(path.join(dir, filename), JSON.stringify(content, null, 2));
      saved[filename] = `/exports/${id}/${filename}`;
    }
    res.json({ ok: true, files: saved });
  });

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  app.use('/uploads', express.static(uploadsDir));
  app.use('/projects', express.static(projectsDir));
  app.use('/exports', express.static(exportsDir));

  app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ error: `${err.code}: ${err.message}` });
      return;
    }
    if (err instanceof SyntaxError) {
      const status = (err as { status?: unknown }).status;
      if (typeof status === 'number') {
        res.status(status).json({ error: err.message });
        return;
      }
    }
    next(err);
  });

  return app;
}
