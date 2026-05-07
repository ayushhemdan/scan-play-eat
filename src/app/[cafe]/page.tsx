import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCafe, getAllSlugs } from "@/lib/cafes";
import CafePageClient from "./CafePageClient";

// ─── Static params (pre-render all known cafe slugs) ─────────────────────────

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ cafe: slug }));
}

// ─── Per-cafe metadata ────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: Promise<{ cafe: string }> }
): Promise<Metadata> {
  const { cafe: slug } = await params;
  const cafe = getCafe(slug);
  if (!cafe) return { title: "Not Found" };
  return {
    title: `${cafe.name} — Scan. Play. Eat.`,
    description: cafe.tagline,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CafePage(
  { params }: { params: Promise<{ cafe: string }> }
) {
  const { cafe: slug } = await params;
  const cafe = getCafe(slug);

  if (!cafe) notFound();

  return <CafePageClient cafe={cafe} />;
}
