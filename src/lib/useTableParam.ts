"use client";

import { useSearchParams } from "next/navigation";

/** Returns the ?table= URL param as a string, or "1" as default. */
export function useTableParam(): string {
  const params = useSearchParams();
  const t = params.get("table");
  if (!t) return "1";
  const n = parseInt(t, 10);
  return isNaN(n) || n < 1 ? "1" : String(n);
}
