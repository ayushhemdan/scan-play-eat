import type { Cafe } from "@/types/cafe";
import suriyansh from "./suriyansh";

// ─── Registry ─────────────────────────────────────────────────────────────────
// To add a new client: import their config and add one line here.

const registry: Record<string, Cafe> = {
  [suriyansh.slug]: suriyansh,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getCafe(slug: string): Cafe | null {
  return registry[slug] ?? null;
}

export function getAllCafes(): Cafe[] {
  return Object.values(registry);
}

export function getAllSlugs(): string[] {
  return Object.keys(registry);
}
