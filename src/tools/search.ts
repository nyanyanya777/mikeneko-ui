import { loadTokens, loadComponents, loadScreens, loadRules } from "../utils/loader.js";

interface SearchResult {
  type: "token" | "component" | "screen" | "rule";
  path?: string;
  id?: string;
  name?: string;
  data: unknown;
}

/**
 * Search tokens, components, screens, and rules by query string.
 * Matches against keys, names, descriptions, and tailwind values.
 */
export function search(query: string): SearchResult[] {
  const results: SearchResult[] = [];
  const q = query.toLowerCase();

  // Search tokens
  const tokens = loadTokens();
  searchTokenObject(tokens, "", q, results);

  // Search components
  const components = loadComponents();
  for (const comp of components.components) {
    const searchable = [
      comp.id,
      comp.name,
      comp.description,
      comp.category,
      ...comp.variants.map((v) => `${v.name} ${v.tailwind}`),
    ]
      .join(" ")
      .toLowerCase();

    if (searchable.includes(q)) {
      results.push({
        type: "component",
        id: comp.id,
        name: comp.name,
        data: comp,
      });
    }
  }

  // Search screens
  const screens = loadScreens();
  for (const screen of screens.screens) {
    const searchable = [
      screen.id,
      screen.label,
      screen.category ?? "",
      ...screen.components,
      ...screen.states.map((s) => s.label),
      ...screen.variants.map((v) => v.label),
    ]
      .join(" ")
      .toLowerCase();

    if (searchable.includes(q)) {
      results.push({
        type: "screen",
        id: screen.id,
        name: screen.label,
        data: screen,
      });
    }
  }

  // Search rules
  const rules = loadRules();
  for (const rule of rules.rules) {
    const patterns = rule.patterns ?? (rule.pattern ? [rule.pattern] : []);
    const searchable = [
      rule.id,
      rule.category,
      rule.reason,
      rule.alternative,
      ...patterns,
    ]
      .join(" ")
      .toLowerCase();

    if (searchable.includes(q)) {
      results.push({
        type: "rule",
        id: rule.id,
        name: patterns.join(", "),
        data: rule,
      });
    }
  }

  return results;
}

function searchTokenObject(
  obj: unknown,
  path: string,
  query: string,
  results: SearchResult[]
): void {
  if (obj === null || obj === undefined) return;
  if (typeof obj !== "object") return;

  // Skip version field
  if (path === "" && "version" in (obj as Record<string, unknown>)) {
    const { version: _, ...rest } = obj as Record<string, unknown>;
    obj = rest;
  }

  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const currentPath = path ? `${path}.${key}` : key;

    // Check if this is a leaf token (has "value" or "tailwind")
    if (
      value &&
      typeof value === "object" &&
      ("value" in value || "tailwind" in value)
    ) {
      const searchable = [
        currentPath,
        String((value as Record<string, unknown>).value ?? ""),
        String((value as Record<string, unknown>).tailwind ?? ""),
      ]
        .join(" ")
        .toLowerCase();

      if (searchable.includes(query)) {
        results.push({
          type: "token",
          path: currentPath,
          data: value,
        });
      }
    } else if (typeof value === "object") {
      // Recurse into nested objects
      searchTokenObject(value, currentPath, query, results);
    }
  }
}
