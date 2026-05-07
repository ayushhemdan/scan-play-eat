import Anthropic from "@anthropic-ai/sdk";
import { getCafe } from "@/lib/cafes";
import type { MenuItem } from "@/types/cafe";

const client = new Anthropic();

function buildMenuText(menu: MenuItem[]): string {
  return menu
    .map(
      (i) =>
        `• ${i.name} (${i.isVeg ? "Veg" : "Non-Veg"}) — ₹${i.price}\n  ${i.description}${i.badges?.length ? ` [${i.badges.join(", ")}]` : ""}`
    )
    .join("\n");
}

export async function POST(request: Request) {
  const { messages, cafeSlug } = await request.json();

  const cafe = getCafe(cafeSlug);
  if (!cafe) return new Response("Cafe not found", { status: 404 });

  const system = `You are ${cafe.aiName ?? "Cafe Buddy"}, the friendly AI guide for ${cafe.name} in Dehradun.

You know every item on the menu. Help customers find their perfect order based on mood, budget, dietary preference, or craving.

FULL MENU:
${buildMenuText(cafe.menu)}

Guidelines:
- Keep replies short (2-4 sentences max)
- Always name specific items with their prices
- Be warm, fun, and enthusiastic about the food
- Use 1-2 emojis per reply max
- If you recommend a combo, calculate the total price`;

  // Stream the response
  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 512,
    system,
    messages,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
