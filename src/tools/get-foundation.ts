import { loadFoundation, listFoundations } from "../utils/loader.js";

/**
 * Get a foundation markdown document by name (e.g. "color", "typography", "accessibility").
 * Returns null if not found.
 * If name is omitted, returns a list of available foundations.
 */
export function getFoundation(name?: string): string | string[] | null {
  if (!name) {
    return listFoundations();
  }
  return loadFoundation(name);
}
