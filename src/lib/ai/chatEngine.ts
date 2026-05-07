import type { MenuItem } from "@/types/cafe";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(item: MenuItem): string {
  return `**${item.emoji} ${item.name}** — ₹${item.price}`;
}

function list(items: MenuItem[], max = 3): string {
  return items
    .slice(0, max)
    .map((i) => `• ${fmt(i)}`)
    .join("\n");
}

function pick(items: MenuItem[]): MenuItem | undefined {
  return items[Math.floor(Math.random() * items.length)];
}

function byCategory(menu: MenuItem[], cat: string) {
  return menu.filter((i) => i.category === cat && !i.soldOut);
}

function bestsellers(menu: MenuItem[]) {
  return menu.filter((i) => i.badges?.includes("bestseller") && !i.soldOut);
}

function parseBudget(msg: string): number | null {
  const m = msg.match(/(?:under|below|less than|within|upto|up to|₹?)\s*(\d+)/i);
  return m ? parseInt(m[1], 10) : null;
}

// ─── Intent detection ─────────────────────────────────────────────────────────

type Intent =
  | "greeting"
  | "bestseller"
  | "veg"
  | "non-veg"
  | "spicy"
  | "dessert"
  | "hot-drink"
  | "cold-drink"
  | "combo"
  | "budget"
  | "date"
  | "hungry"
  | "light"
  | "cafe-bites"
  | "thanks"
  | "generic";

function detectIntent(msg: string): Intent {
  const q = msg.toLowerCase();

  if (/\b(hi|hello|hey|hola|namaste|sup|what'?s up)\b/.test(q)) return "greeting";
  if (/thank|thanks|thx|shukriya/.test(q)) return "thanks";
  if (/spic|hot sauce|chilli|jalap|fire|jhal/.test(q)) return "spicy";
  if (/\bveg(etarian)?\b|no meat|plant|paneer|meatless/.test(q)) return "veg";
  if (/non.?veg|chicken|meat|mutton|egg|non veg/.test(q)) return "non-veg";
  if (/dessert|sweet|cake|waffle|brownie|ice cream|gulab|mithai/.test(q)) return "dessert";
  if (/chai|tea|cappuccino|espresso|americano|hot (coffee|drink|choco)|ginger/.test(q)) return "hot-drink";
  if (/cold (coffee|drink)|shake|smoothie|lassi|lemonade|mojito|cold brew/.test(q)) return "cold-drink";
  if (/combo|meal deal|package|bundle|full meal/.test(q)) return "combo";
  if (/date|couple|girlfriend|boyfriend|romantic|anniversary|bae/.test(q)) return "date";
  if (/starving|very hungry|famished|ravenous|so hungry/.test(q)) return "hungry";
  if (/light|small|snack|not (very |too )?hungry|just a little/.test(q)) return "light";
  if (/sandwich|wrap|roll|toast|nachos|bite/.test(q)) return "cafe-bites";
  if (/budget|cheap|afford|under|below|less than|₹/.test(q)) return "budget";
  if (/best|popular|famous|top|must (try|order)|recommend|what('?s| is) good/.test(q)) return "bestseller";

  return "generic";
}

// ─── Response builder ─────────────────────────────────────────────────────────

export function getResponse(
  message: string,
  menu: MenuItem[],
  cafeName: string,
  aiName: string
): string {
  const intent = detectIntent(message);
  const available = menu.filter((i) => !i.soldOut);

  switch (intent) {
    case "greeting":
      return `Hey there! 👋 I'm **${aiName}**, your personal guide to **${cafeName}**.\n\nI know every item on the menu — from our juiciest burgers to the coziest hot drinks. Ask me:\n• "What's the bestseller?"\n• "I'm in a spicy mood 🌶️"\n• "Build me a date night combo"\n• "Something under ₹200"\n\nWhat are you feeling today?`;

    case "thanks":
      return `You're welcome! 😊 Enjoy your meal at **${cafeName}**. If you need anything else — more recommendations, combos, or just want to chat — I'm right here. 🍔`;

    case "bestseller": {
      const stars = bestsellers(available);
      if (!stars.length) return `Everything here is great — but if I had to pick, start with our burgers! 🍔 Check the menu for today's picks.`;
      return `⭐ **Our crowd favourites at ${cafeName}:**\n\n${list(stars, 4)}\n\nThe **${stars[0]?.name}** is what most people order first — and they almost always come back for seconds. 😄`;
    }

    case "veg": {
      const vegs = available.filter((i) => i.isVeg);
      if (!vegs.length) return `Hmm, we're a bit meat-heavy today! But do check back — our veg options rotate. 🥬`;
      const top = [...vegs].sort((a, b) => (b.badges?.length ?? 0) - (a.badges?.length ?? 0));
      return `🥬 **Great veg picks for you:**\n\n${list(top, 4)}\n\nAll 100% vegetarian and honestly delicious. The **${top[0]?.name}** is a personal favourite. Try it!`;
    }

    case "non-veg": {
      const nveg = available.filter((i) => !i.isVeg);
      if (!nveg.length) return `Hmm, our non-veg options might be sold out right now. Try refreshing the menu!`;
      return `🍗 **Our non-veg lineup:**\n\n${list(nveg, 4)}\n\nIf you're serious about flavour, the **${nveg[0]?.name}** is where it's at. 🔥`;
    }

    case "spicy": {
      const spicy = available.filter((i) => i.badges?.includes("spicy"));
      if (!spicy.length) return `Feeling bold? Our burgers have customisable spice levels — ask us to make it extra hot! 🌶️`;
      return `🌶️ **For the spice lovers:**\n\n${list(spicy)}\n\nWarning: the **${spicy[0]?.name}** is not for the faint-hearted. Pair it with a **Cold Coffee** to cool down after. 😅`;
    }

    case "dessert": {
      const desserts = byCategory(available, "desserts");
      if (!desserts.length) return `Our desserts might be sold out right now — but trust me, the **Nutella Waffle** is worth coming back for! 🧇`;
      return `🍰 **Sweet endings at ${cafeName}:**\n\n${list(desserts)}\n\nThe **${desserts[0]?.name}** is our most-photographed dessert. It's almost too pretty to eat. Almost. 📸`;
    }

    case "hot-drink": {
      const hot = byCategory(available, "hot-drinks");
      if (!hot.length) return `Our hot drinks section might be loading — check the Hot Drinks category in the menu! ☕`;
      return `☕ **Hot drinks to warm you up:**\n\n${list(hot)}\n\nOur **Masala Chai** (₹49) is the soul of this place — locals swear by it. If you want something stronger, the **Cappuccino** won't disappoint.`;
    }

    case "cold-drink": {
      const cold = byCategory(available, "cold-drinks");
      if (!cold.length) return `Check our Cold Drinks section in the menu — we've got some great options! 🥤`;
      const oreo = cold.find((i) => i.name.toLowerCase().includes("oreo"));
      return `🥤 **Cold drinks to cool down:**\n\n${list(cold)}\n\n${oreo ? `The **${oreo.name}** is our most Instagrammable drink — thick, creamy, and dangerously good. 📸` : `The **${cold[0]?.name}** is a table favourite.`}`;
    }

    case "combo": {
      const burgers = available.filter((i) => i.category === "burgers");
      const sides = byCategory(available, "sides");
      const drinks = [...byCategory(available, "cold-drinks"), ...byCategory(available, "hot-drinks")];
      const b = pick(bestsellers(burgers).length ? bestsellers(burgers) : burgers);
      const s = pick(sides);
      const d = pick(drinks);
      if (!b) return `Check the burgers section for our signature combos! 🍔`;
      const total = (b?.price ?? 0) + (s?.price ?? 0) + (d?.price ?? 0);
      return `🔥 **I built you the perfect meal:**\n\n• ${fmt(b!)}\n${s ? `• ${fmt(s)}\n` : ""}${d ? `• ${fmt(d)}\n` : ""}\n**Total: ₹${total}**\n\nThat's a full, satisfying meal. Swap anything you don't like — I'll rebuild it! 😄`;
    }

    case "date": {
      const mustTry = available.filter((i) => i.badges?.includes("must-try") || i.badges?.includes("bestseller"));
      const desserts = byCategory(available, "desserts");
      const drinks = byCategory(available, "cold-drinks");
      const main = pick(mustTry) ?? pick(available.filter((i) => i.category === "burgers"));
      const dessert = pick(desserts);
      const drink = pick(drinks);
      return `💑 **Date night sorted at ${cafeName}:**\n\n${main ? `• ${fmt(main)} — for sharing\n` : ""}${drink ? `• ${fmt(drink)} — order two, one each\n` : ""}${dessert ? `• ${fmt(dessert)} — split at the end 🍰\n` : ""}\nAnd while you wait for your order — try the **Compatibility Quiz** in the Games tab. You might discover something new about each other. 😉`;
    }

    case "hungry": {
      const filling = [...available].sort((a, b) => b.price - a.price).slice(0, 4);
      return `😤 **Serious hunger? We've got you:**\n\n${list(filling)}\n\nStart with the **${filling[0]?.name}** — it's the most filling thing on the menu. Don't say I didn't warn you. 💪`;
    }

    case "light": {
      const light = available.filter((i) =>
        ["cafe-bites", "sides"].includes(i.category) && i.price < 160
      );
      if (!light.length) return `For something light, try our **Cheese Toast** (₹99) or **Coleslaw** (₹59) — quick, easy, and tasty. 🍞`;
      return `😌 **Something light:**\n\n${list(light)}\n\nThe **${light[0]?.name}** is perfect when you're not super hungry but still want something tasty.`;
    }

    case "cafe-bites": {
      const bites = byCategory(available, "cafe-bites");
      if (!bites.length) return `Our cafe bites are in the menu — check the "Cafe Bites" category! 🥪`;
      return `🥪 **Cafe bites worth trying:**\n\n${list(bites)}\n\nThe **${bites.find((i) => i.badges?.includes("bestseller"))?.name ?? bites[0]?.name}** is the crowd favourite. Great for a quick bite between classes. 🎓`;
    }

    case "budget": {
      const limit = parseBudget(message);
      if (!limit) return `Tell me your budget (e.g. "under ₹150") and I'll find the best options for you! 💰`;
      const affordable = available.filter((i) => i.price <= limit).sort((a, b) => b.price - a.price);
      if (!affordable.length) return `Hmm, nothing under ₹${limit} right now — but our **Masala Chai** (₹49) and **Coleslaw** (₹59) are close! Try bumping up to ₹100?`;
      return `💰 **Best picks under ₹${limit}:**\n\n${list(affordable, 5)}\n\nYou can eat really well within that budget. The **${affordable[0]?.name}** at ₹${affordable[0]?.price} is your best value pick.`;
    }

    default: {
      const random = pick(bestsellers(available)) ?? pick(available);
      return `Great question! Honestly, you can't go wrong with anything here. But if I had to pick one thing right now — try the **${random?.emoji} ${random?.name}** (₹${random?.price}). It's ${random?.badges?.includes("bestseller") ? "our bestseller for a reason" : "something special"}. 😄\n\nOr tell me more — spicy? veg? light? I'll find exactly what you need.`;
    }
  }
}
