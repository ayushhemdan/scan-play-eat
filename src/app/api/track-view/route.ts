import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const { slug } = await request.json();
  if (!slug) return Response.json({ error: "Missing slug" }, { status: 400 });
  await supabase.from("page_views").insert({ cafe_slug: slug });
  return Response.json({ ok: true });
}

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) return Response.json({ error: "Missing slug" }, { status: 400 });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);

  const [{ count: today }, { count: week }] = await Promise.all([
    supabase
      .from("page_views")
      .select("*", { count: "exact", head: true })
      .eq("cafe_slug", slug)
      .gte("viewed_at", todayStart.toISOString()),
    supabase
      .from("page_views")
      .select("*", { count: "exact", head: true })
      .eq("cafe_slug", slug)
      .gte("viewed_at", weekStart.toISOString()),
  ]);

  return Response.json({ today: today ?? 0, week: week ?? 0 });
}
