import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const { name, description, category } = await request.json();

  if (!name) return Response.json({ error: "Missing item name" }, { status: 400 });

  const prompt = `professional food photography of ${name}, ${description || ""}, ${category} dish, restaurant menu photo, appetizing, high quality, dark moody background, bokeh, studio lighting`;

  const encoded = encodeURIComponent(prompt);
  const seed = Date.now();
  const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=600&height=600&nologo=true&seed=${seed}`;

  try {
    // Fetch the generated image server-side (avoids CORS)
    const imgRes = await fetch(imageUrl, { signal: AbortSignal.timeout(30000) });
    if (!imgRes.ok) throw new Error("Image generation failed");

    const buffer = await imgRes.arrayBuffer();
    const path = `generated/${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from("menu-images")
      .upload(path, buffer, { contentType: "image/jpeg", upsert: true });

    if (uploadError) throw new Error(uploadError.message);

    const { data: { publicUrl } } = supabase.storage
      .from("menu-images")
      .getPublicUrl(path);

    return Response.json({ url: publicUrl });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
