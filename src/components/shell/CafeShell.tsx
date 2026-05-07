"use client";

import type { Cafe } from "@/types/cafe";

interface Props {
  cafe: Cafe;
  children: React.ReactNode;
}

/**
 * Injects the cafe's brand color as CSS custom properties so every
 * child component can use var(--brand) and var(--brand-rgb) without
 * prop-drilling the theme.
 */
export default function CafeShell({ cafe, children }: Props) {
  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-white"
      style={
        {
          "--brand": cafe.theme.primary,
          "--brand-rgb": cafe.theme.primaryRgb,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
