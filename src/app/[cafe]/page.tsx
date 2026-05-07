import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCafe, getAllSlugs } from "@/lib/cafes";
import { supabase } from "@/lib/supabase";
import type { MenuItem, Badge } from "@/types/cafe";
import CafePageClient from "./CafePageClient";

export const revalidate = 30;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ cafe: slug }));
}

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

export default async function CafePage(
  { params }: { params: Promise<{ cafe: string }> }
) {
  const { cafe: slug } = await params;
  const cafe = getCafe(slug);

  if (!cafe) notFound();

  // Fetch live menu from DB; fall back to static config if DB is empty
  const { data: dbItems } = await supabase
    .from("menu_items")
    .select("*")
    .eq("cafe_slug", slug)
    .eq("is_available", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const menu: MenuItem[] =
    dbItems && dbItems.length > 0
      ? dbItems.map((row) => ({
          id: row.id,
          name: row.name,
          description: row.description ?? "",
          price: row.price,
          category: row.category,
          isVeg: row.is_veg,
          emoji: row.emoji ?? "🍽️",
          badges: (row.badges ?? []) as Badge[],
          soldOut: row.is_available === false,
        }))
      : cafe.menu;

  return <CafePageClient cafe={{ ...cafe, menu }} />;
}
