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

  // Fetch live menu + settings from DB
  const [{ data: dbItems }, { data: settings }] = await Promise.all([
    supabase
      .from("menu_items")
      .select("*")
      .eq("cafe_slug", slug)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
    supabase
      .from("cafe_settings")
      .select("today_special_id, is_open")
      .eq("cafe_slug", slug)
      .single(),
  ]);

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
          imageUrl: row.image_url ?? undefined,
          badges: (row.badges ?? []) as Badge[],
          soldOut: row.is_available === false,
        }))
      : cafe.menu;

  const todaySpecial = settings?.today_special_id ?? cafe.todaySpecial;
  const forceOpen = settings?.is_open ?? null;

  return <CafePageClient cafe={{ ...cafe, menu, todaySpecial }} forceOpen={forceOpen} />;
}
