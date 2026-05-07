import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const PROMPT = `You are a menu digitizer. Extract every item from this menu image.

Return ONLY a valid JSON array — no markdown, no explanation, just the array.

Schema for each item:
{
  "name": "string — item name exactly as written",
  "price": number — price as a number, 0 if unclear,
  "description": "string — description if shown, empty string if not",
  "category": "string — one of: burgers, cafe-bites, sides, hot-drinks, cold-drinks, desserts, beverages, other",
  "isVeg": boolean — true if vegetarian, false if non-veg, true if unclear
}

Rules:
- Extract every single item visible
- price must be a plain number (no ₹ symbol, no text)
- Category mappings: burgers/sandwiches → burgers, wraps/rolls/toast/nachos → cafe-bites, fries/rings/snacks → sides, tea/coffee/hot → hot-drinks, shakes/cold coffee/smoothies/lemonade/lassi → cold-drinks, cake/brownie/waffle/ice cream/dessert → desserts
- If the menu has a category label, use it as a hint
- Return ONLY the JSON array`;

export async function POST(request: Request) {
  const { image, mediaType } = await request.json();

  if (!image || !mediaType) {
    return new Response(JSON.stringify({ error: "Missing image or mediaType" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
              data: image,
            },
          },
          { type: "text", text: PROMPT },
        ],
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text.trim() : "";

  // Extract JSON array from the response
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) {
    return new Response(
      JSON.stringify({ error: "Could not parse menu from image. Try a clearer photo." }),
      { status: 422, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const items = JSON.parse(match[0]);
    return new Response(JSON.stringify({ items, count: items.length }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON from extraction. Try again." }),
      { status: 422, headers: { "Content-Type": "application/json" } }
    );
  }
}
