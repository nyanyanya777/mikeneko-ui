#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createInterface } from "readline";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES = resolve(__dirname, "../templates");
const CWD = process.cwd();

// ── Colors ──
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;

function log(icon: string, msg: string) {
  console.log(`  ${icon} ${msg}`);
}

// ── Prompt ──
function ask(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// ── Framework detection ──
type Framework = "nextjs" | "react";

function detectFramework(): Framework | null {
  const pkgPath = resolve(CWD, "package.json");
  if (!existsSync(pkgPath)) return null;
  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  if (deps["next"]) return "nextjs";
  if (deps["react"]) return "react";
  return null;
}

function detectShadcn(): boolean {
  return existsSync(resolve(CWD, "components.json"));
}

// ── CSS file location ──
function findCssFile(framework: Framework): string | null {
  const candidates =
    framework === "nextjs"
      ? [
          "src/app/globals.css",
          "app/globals.css",
          "src/globals.css",
          "styles/globals.css",
        ]
      : [
          "src/index.css",
          "src/globals.css",
          "src/app.css",
          "index.css",
        ];

  for (const c of candidates) {
    if (existsSync(resolve(CWD, c))) return c;
  }
  return null;
}

// ── Theme injection ──
function injectTheme(cssPath: string): boolean {
  const fullPath = resolve(CWD, cssPath);
  const original = readFileSync(fullPath, "utf-8");
  const themeBlock = readFileSync(resolve(TEMPLATES, "theme.css"), "utf-8");

  // Check if already injected
  if (original.includes("mikeneko UI Theme")) {
    log(yellow("●"), `Theme already exists in ${cssPath}`);
    return false;
  }

  // Find :root block and replace, or append
  if (original.includes(":root {")) {
    // Replace existing :root and .dark blocks with melta theme
    const cleaned = original
      .replace(/:root\s*\{[^}]*\}/s, "/* :root replaced by mikeneko-ui */")
      .replace(/\.dark\s*\{[^}]*\}/s, "/* .dark replaced by mikeneko-ui */");
    writeFileSync(fullPath, cleaned + "\n" + themeBlock);
  } else {
    writeFileSync(fullPath, original + "\n" + themeBlock);
  }
  return true;
}

// ── File writers ──
function writeIfNotExists(relativePath: string, content: string): boolean {
  const fullPath = resolve(CWD, relativePath);
  if (existsSync(fullPath)) {
    log(yellow("●"), `${relativePath} already exists, skipping`);
    return false;
  }
  const dir = dirname(fullPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(fullPath, content);
  return true;
}

function copyTemplate(templateName: string, destPath: string): boolean {
  const content = readFileSync(resolve(TEMPLATES, templateName), "utf-8");
  return writeIfNotExists(destPath, content);
}

function writeMcpJson(): boolean {
  const mcpPath = resolve(CWD, ".mcp.json");
  const mcpConfig = {
    mcpServers: {
      "mikeneko-ui": {
        command: "npx",
        args: ["-y", "mikeneko-ui", "mcp"],
      },
    },
  };

  if (existsSync(mcpPath)) {
    // Merge into existing
    const existing = JSON.parse(readFileSync(mcpPath, "utf-8"));
    if (existing.mcpServers?.["mikeneko-ui"]) {
      log(yellow("●"), ".mcp.json already has mikeneko-ui entry");
      return false;
    }
    existing.mcpServers = existing.mcpServers || {};
    existing.mcpServers["mikeneko-ui"] = mcpConfig.mcpServers["mikeneko-ui"];
    writeFileSync(mcpPath, JSON.stringify(existing, null, 2) + "\n");
    return true;
  }

  writeFileSync(mcpPath, JSON.stringify(mcpConfig, null, 2) + "\n");
  return true;
}

// ── Main ──
async function main() {
  const args = process.argv.slice(2);

  // Sub-command: mcp server mode
  if (args[0] === "mcp") {
    const { startMcp } = await import("./mcp.js");
    await startMcp();
    return;
  }

  console.log();
  console.log(bold("  mikeneko UI") + dim(" — AI-ready design system"));
  console.log();

  // Step 1: Detect or ask framework
  let framework = detectFramework();

  if (framework) {
    log(green("✔"), `Detected: ${bold(framework === "nextjs" ? "Next.js" : "React (Vite)")}`);
  } else {
    console.log("  Which framework?");
    console.log(`    ${bold("1")} React (Vite)`);
    console.log(`    ${bold("2")} Next.js`);
    console.log();
    const choice = await ask("  Enter (1/2): ");
    framework = choice === "2" ? "nextjs" : "react";
  }

  // Step 2: Check shadcn/ui
  if (!detectShadcn()) {
    console.log();
    log(red("✖"), "shadcn/ui not found (no components.json)");
    console.log();
    console.log(`  Run this first:`);
    console.log(cyan(`    npx shadcn@latest init`));
    console.log();
    process.exit(1);
  }

  log(green("✔"), "shadcn/ui detected");

  // Step 3: Find CSS file
  const cssFile = findCssFile(framework);
  if (!cssFile) {
    log(red("✖"), "Could not find globals.css / index.css");
    process.exit(1);
  }

  console.log();

  // Step 4: Inject theme
  if (injectTheme(cssFile)) {
    log(green("✔"), `Injected mikeneko-ui theme into ${bold(cssFile)}`);
  }

  // Step 5: Copy CLAUDE.md
  if (copyTemplate("CLAUDE.md", "CLAUDE.md")) {
    log(green("✔"), `Created ${bold("CLAUDE.md")}`);
  }

  // Step 6: Copy prohibited.md
  if (copyTemplate("prohibited.md", "foundations/prohibited.md")) {
    log(green("✔"), `Created ${bold("foundations/prohibited.md")}`);
  }

  // Step 7: Write .mcp.json
  if (writeMcpJson()) {
    log(green("✔"), `Added mikeneko-ui to ${bold(".mcp.json")}`);
  }

  console.log();
  log("🎨", bold("Done!") + " Your project now uses mikeneko-ui design tokens.");
  console.log();
  console.log(dim("  AI tools will read CLAUDE.md and use MCP for design rules."));
  console.log(dim("  Run `npx shadcn@latest add button` to add components."));
  console.log();
}

main().catch((err) => {
  console.error(red("Error:"), err.message);
  process.exit(1);
});
