import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const { name, description, category } = await request.json();

  if (!name) return Response.json({ error: "Missing item name" }, { status: 400 });

  const prompt = `professional food photography of ${name}${description ? `, ${description}` : ""}, delicious restaurant dish, high quality, dark background, bokeh, studio lighting`;

  const seed = Math.floor(Math.random() * 999999);
  const encoded = encodeURIComponent(prompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=600&height=600&nologo=true&seed=${seed}`;

  // Manual timeout using Promise.race
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("Timed out — try again")), 45000)
  );

  try {
    const imgRes = await Promise.race([
      fetch(imageUrl),
      timeout,
    ]);

    if (!imgRes.ok) {
      return Response.json({ error: `Image service returned ${imgRes.status} — try again` }, { status: 502 });
    }

    const contentType = imgRes.headers.get("content-type") ?? "image/jpeg";
    const buffer = await imgRes.arrayBuffer();

    if (buffer.byteLength < 1000) {
      return Response.json({ error: "Generated image too small — try again" }, { status: 502 });
    }

    const ext = contentType.includes("png") ? "png" : "jpg";
    const path = `generated/${Date.now()}-${seed}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("menu-images")
      .upload(path, buffer, { contentType, upsert: true });

    if (uploadError) {
      return Response.json({ error: `Storage error: ${uploadError.message}` }, { status: 500 });
    }

    const { data: { publicUrl } } = supabase.storage
      .from("menu-images")
      .getPublicUrl(path);

    return Response.json({ url: publicUrl });

  } catch (err) {
    const msg = err instanceof Error ? err.message : "Generation failed";
    return Response.json({ error: msg }, { status: 500 });
  }
}
