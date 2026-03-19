import { loadScreens } from "../utils/loader.js";
import type { ScreenMeta } from "../utils/types.js";

/**
 * Get a screen by ID (e.g. "kintsugi-dashboard").
 * Returns null if not found, or the full list if id is omitted.
 */
export function getScreen(id?: string): ScreenMeta | ScreenMeta[] | null {
  const data = loadScreens();

  if (!id) {
    return data.screens;
  }

  return data.screens.find((s) => s.id === id) ?? null;
}

/**
 * List screens with summary info.
 */
export function listScreens(): { id: string; label: string; category?: string; componentCount: number }[] {
  const data = loadScreens();
  return data.screens.map((s) => ({
    id: s.id,
    label: s.label,
    category: s.category,
    componentCount: s.components.length,
  }));
}
