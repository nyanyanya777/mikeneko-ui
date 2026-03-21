import { readFileSync, readdirSync, existsSync, watch } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type {
  Tokens,
  ComponentsData,
  ScreensData,
  RulesData,
  ProhibitionRule,
  ProhibitionRuleV2,
} from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "../..");

// --- Cache ---
let tokensCache: Tokens | null = null;
let componentsCache: ComponentsData | null = null;
let screensCache: ScreensData | null = null;
let rulesCache: RulesData | null = null;
let flatRulesCache: ProhibitionRule[] | null = null;

// --- File paths ---
const TOKENS_PATH = resolve(root, "tokens/tokens.json");
const COMPONENTS_PATH = resolve(root, "metadata/components.json");
const SCREENS_PATH = resolve(root, "metadata/screens.json");
const RULES_PATH = resolve(root, "metadata/rules.json");
const FOUNDATIONS_DIR = resolve(root, "foundations");
const PATTERNS_DIR = resolve(root, "patterns");

// --- Loaders ---

export function loadTokens(): Tokens {
  if (!tokensCache) {
    tokensCache = JSON.parse(readFileSync(TOKENS_PATH, "utf-8"));
  }
  return tokensCache!;
}

export function loadComponents(): ComponentsData {
  if (!componentsCache) {
    componentsCache = JSON.parse(readFileSync(COMPONENTS_PATH, "utf-8"));
  }
  return componentsCache!;
}

export function loadScreens(): ScreensData {
  if (!screensCache) {
    screensCache = JSON.parse(readFileSync(SCREENS_PATH, "utf-8"));
  }
  return screensCache!;
}

export function loadRules(): RulesData {
  if (!rulesCache) {
    if (!existsSync(RULES_PATH)) {
      throw new Error(
        `rules.json not found at ${RULES_PATH}. ` +
        "Run 'npm run generate' or create metadata/rules.json manually."
      );
    }
    rulesCache = JSON.parse(readFileSync(RULES_PATH, "utf-8"));
  }
  return rulesCache!;
}

/**
 * Load prohibition rules from rules.json (SSoT) and flatten
 * multi-pattern rules into individual ProhibitionRule entries.
 */
export function getProhibitionRules(): ProhibitionRule[] {
  if (flatRulesCache) return flatRulesCache;

  const data = loadRules();
  const flat: ProhibitionRule[] = [];

  for (const rule of data.rules) {
    const patterns = rule.patterns ?? (rule.pattern ? [rule.pattern] : []);
    for (const p of patterns) {
      flat.push({
        pattern: p,
        reason: rule.reason,
        alternative: rule.alternative,
      });
    }
  }

  flatRulesCache = flat;
  return flat;
}

/**
 * Get enhanced rules with full metadata (severity, category, contextual flag).
 */
export function getProhibitionRulesV2(): ProhibitionRuleV2[] {
  return loadRules().rules;
}

/**
 * Load a foundation markdown file by name (e.g. "color", "typography").
 */
export function loadFoundation(name: string): string | null {
  const filePath = resolve(FOUNDATIONS_DIR, `${name}.md`);
  if (!existsSync(filePath)) return null;
  return readFileSync(filePath, "utf-8");
}

/**
 * List all available foundation names.
 */
export function listFoundations(): string[] {
  return readdirSync(FOUNDATIONS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(".md", ""));
}

/**
 * Load a pattern markdown file by name (e.g. "form", "layout").
 */
export function loadPattern(name: string): string | null {
  const filePath = resolve(PATTERNS_DIR, `${name}.md`);
  if (!existsSync(filePath)) return null;
  return readFileSync(filePath, "utf-8");
}

/**
 * List all available pattern names.
 */
export function listPatterns(): string[] {
  return readdirSync(PATTERNS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(".md", ""));
}

// --- Cache invalidation ---

export function clearCache(): void {
  tokensCache = null;
  componentsCache = null;
  screensCache = null;
  rulesCache = null;
  flatRulesCache = null;
}

/**
 * Watch SSoT files and clear cache on change.
 * Returns a cleanup function to stop watching.
 */
export function watchFiles(onInvalidate?: () => void): () => void {
  const watchers: ReturnType<typeof watch>[] = [];

  for (const filePath of [TOKENS_PATH, COMPONENTS_PATH, SCREENS_PATH, RULES_PATH]) {
    if (existsSync(filePath)) {
      const watcher = watch(filePath, () => {
        clearCache();
        onInvalidate?.();
      });
      watchers.push(watcher);
    }
  }

  return () => {
    for (const w of watchers) w.close();
  };
}
