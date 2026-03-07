import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const workspace = import.meta.dir;
const tmpDir = join(workspace, ".tmp");
const artifactsDir = join(workspace, "artifacts");

async function run(command: string[], cwd: string): Promise<void> {
  const [cmd, ...args] = command;
  const proc = Bun.spawn({
    cmd: [cmd, ...args],
    cwd,
    stdout: "inherit",
    stderr: "inherit",
  });
  const code = await proc.exited;
  if (code !== 0) {
    throw new Error(`Command failed (${code}): ${command.join(" ")}`);
  }
}

async function setupFixture(name: string, importPath: string, tarballPath: string): Promise<string> {
  const dir = join(tmpDir, name);
  await mkdir(dir, { recursive: true });

  const pkg = {
    name: `publish-test-${name}`,
    private: true,
    type: "module",
    scripts: {
      build: "bun build ./index.ts --target browser --outfile ./bundle.js",
      run: "bun run ./index.ts",
    },
    dependencies: {
      "@dryanovski/gamefoo": `file:${tarballPath}`,
    },
  };

  const source = `
import { Engine, HealthKit, Input, Monitor, log } from "${importPath}";

const checks = [
  typeof Engine === "function",
  typeof HealthKit === "function",
  typeof Input === "function",
  typeof Monitor === "function",
  typeof log === "function",
];

if (!checks.every(Boolean)) {
  throw new Error("One or more expected exports are missing.");
}

console.log("ok:${name}");
`;

  await writeFile(join(dir, "package.json"), `${JSON.stringify(pkg, null, 2)}\n`);
  await writeFile(join(dir, "index.ts"), source.trimStart());
  return dir;
}

async function main(): Promise<void> {
  await rm(tmpDir, { recursive: true, force: true });
  await rm(artifactsDir, { recursive: true, force: true });
  await mkdir(tmpDir, { recursive: true });
  await mkdir(artifactsDir, { recursive: true });

  await run(["bun", "run", "build"], root);
  await run(["bun", "pm", "pack", "--ignore-scripts", "--destination", artifactsDir], root);

  const files = await readdir(artifactsDir);
  const tarball = files.find((file) => file.endsWith(".tgz"));
  if (!tarball) {
    throw new Error("No tarball was created.");
  }
  const tarballPath = join(artifactsDir, tarball);

  const compiledDir = await setupFixture("compiled", "@dryanovski/gamefoo", tarballPath);
  await run(["bun", "install"], compiledDir);
  await run(["bun", "run", "build"], compiledDir);
  await run(["bun", "run", "run"], compiledDir);

  const sourceDir = await setupFixture("source", "@dryanovski/gamefoo/source", tarballPath);
  await run(["bun", "install"], sourceDir);
  await run(["bun", "run", "build"], sourceDir);
  await run(["bun", "run", "run"], sourceDir);

  console.log("publish-test: all checks passed");
}

await main();
