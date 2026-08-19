import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PROJECTS, routeOf } from "./projects.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const site = join(root, "site");
const pagesBase = normalizeBase(process.env.PAGES_BASE || "/");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const npx = process.platform === "win32" ? "npx.cmd" : "npx";

function normalizeBase(value) {
  if (!value || value === "/") return "/";
  const withSlash = value.endsWith("/") ? value : `${value}/`;
  return withSlash.startsWith("/") ? withSlash : `/${withSlash}`;
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} falhou em ${cwd}`);
  }
}

function ensureNpm(dir) {
  run(npm, ["install"], dir);
}

rmSync(site, { recursive: true, force: true });
mkdirSync(site, { recursive: true });

cpSync(join(root, "home"), site, { recursive: true });
cpSync(join(root, "imagens"), join(site, "imagens"), { recursive: true });
writeFileSync(join(site, ".nojekyll"), "");
writeFileSync(
  join(site, "404.html"),
  `<!DOCTYPE html><meta charset="utf-8"><meta http-equiv="refresh" content="0; url=${pagesBase}"><title>Campos Minados</title>`,
);

for (const project of PROJECTS) {
  const route = routeOf(project);
  const outDir = join(site, ...route.split("/"));
  const srcDir = join(root, project.dir);
  mkdirSync(outDir, { recursive: true });

  if (project.kind === "static") {
    for (const file of project.files) {
      cpSync(join(srcDir, file), join(outDir, file));
    }
  } else {
    ensureNpm(srcDir);
    const base = `${pagesBase}${route}/`;
    run(npx, ["vite", "build", "--base", base, "--outDir", outDir, "--emptyOutDir"], srcDir);
    console.log(`vite ${route} base=${base}`);
  }

  const homeOut = join(root, "home", ...route.split("/"));
  mkdirSync(dirname(homeOut), { recursive: true });
  rmSync(homeOut, { recursive: true, force: true });
  cpSync(outDir, homeOut, { recursive: true });
  console.log(`hub ${route}`);
}

console.log(`\nSite gerado em ${site}`);
console.log(`Hub: ${pagesBase}`);
for (const project of PROJECTS) {
  console.log(`  ${pagesBase}${routeOf(project)}/`);
}
