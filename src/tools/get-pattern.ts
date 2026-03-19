import { loadPattern, listPatterns } from "../utils/loader.js";

/**
 * Get a pattern markdown document by name (e.g. "form", "layout", "navigation").
 * Returns null if not found.
 * If name is omitted, returns a list of available patterns.
 */
export function getPattern(name?: string): string | string[] | null {
  if (!name) {
    return listPatterns();
  }
  return loadPattern(name);
}
