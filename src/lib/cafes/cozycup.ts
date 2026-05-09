import type { Cafe } from "@/types/cafe";

const cozycup: Cafe = {
  slug: "cozy-cup",
  name: "The Cozy Cup",
  tagline: "Freshly baked, freshly brewed — your neighbourhood bakery cafe",
  address: "Rajpur Road, Dehradun",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  openHours: "8 AM – 10 PM",

  theme: {
    primary: "#10B981",
    primaryRgb: "16 185 129",
  },

  todaySpecial: "bc1",

  loyalty: {
    stampsRequired: 6,
    reward: "1 Free Croissant 🥐",
  },

  features: {
    games: true,
    aiAssistant: true,
    customisations: true,
  },

  aiName: "Bakery Buddy",

  categories: [
    { id: "breads", label: "Breads & Bakes", emoji: "🥐" },
    { id: "cakes", label: "Cakes & Pastries", emoji: "🎂" },
    { id: "hot-drinks", label: "Hot Drinks", emoji: "☕" },
    { id: "cold-drinks", label: "Cold Drinks", emoji: "🧋" },
    { id: "sandwiches", label: "Sandwiches", emoji: "🥪" },
  ],

  menu: [
    // Breads & Bakes
    { id: "bc1", name: "Butter Croissant", description: "Flaky, buttery layers baked fresh every morning", price: 69, category: "breads", isVeg: true, emoji: "🥐", badges: ["bestseller"] },
    { id: "bc2", name: "Cinnamon Roll", description: "Soft dough, cinnamon sugar swirl, cream cheese glaze", price: 89, category: "breads", isVeg: true, emoji: "🌀", badges: ["must-try"] },
    { id: "bc3", name: "Garlic Focaccia", description: "Herb-infused Italian flatbread with roasted garlic", price: 99, category: "breads", isVeg: true, emoji: "🍞", badges: ["new"] },
    { id: "bc4", name: "Banana Muffin", description: "Dense, moist banana muffin with chocolate chips", price: 59, category: "breads", isVeg: true, emoji: "🧁" },

    // Cakes & Pastries
    { id: "ck1", name: "Dark Chocolate Truffle", description: "Rich Belgian chocolate cake with ganache frosting", price: 149, category: "cakes", isVeg: true, emoji: "🍫", badges: ["bestseller"] },
    { id: "ck2", name: "Strawberry Cheesecake", description: "New York-style cheesecake with fresh strawberry compote", price: 169, category: "cakes", isVeg: true, emoji: "🍓", badges: ["must-try"] },
    { id: "ck3", name: "Lemon Tart", description: "Buttery shortcrust pastry with tangy lemon curd", price: 129, category: "cakes", isVeg: true, emoji: "🍋" },
    { id: "ck4", name: "Éclair", description: "Choux pastry filled with custard, dipped in dark chocolate", price: 79, category: "cakes", isVeg: true, emoji: "🍮", badges: ["new"] },

    // Hot Drinks
    { id: "hd1", name: "Filter Coffee", description: "South Indian filter coffee with frothy milk", price: 55, category: "hot-drinks", isVeg: true, emoji: "☕", badges: ["bestseller"] },
    { id: "hd2", name: "Masala Chai", description: "Spiced tea with ginger, cardamom and tulsi", price: 45, category: "hot-drinks", isVeg: true, emoji: "🍵" },
    { id: "hd3", name: "Café au Lait", description: "Strong espresso with warm steamed milk, French style", price: 89, category: "hot-drinks", isVeg: true, emoji: "☕" },
    { id: "hd4", name: "Hot Chocolate", description: "Belgian cocoa, steamed milk, marshmallows on top", price: 109, category: "hot-drinks", isVeg: true, emoji: "🍫", badges: ["must-try"] },

    // Cold Drinks
    { id: "cd1", name: "Cold Brew Coffee", description: "12-hour cold steeped, served over ice", price: 99, category: "cold-drinks", isVeg: true, emoji: "🧋", badges: ["bestseller"] },
    { id: "cd2", name: "Iced Matcha Latte", description: "Japanese matcha with oat milk and ice", price: 119, category: "cold-drinks", isVeg: true, emoji: "🍵", badges: ["new"] },
    { id: "cd3", name: "Fresh Lemonade", description: "Squeezed to order with mint and soda", price: 69, category: "cold-drinks", isVeg: true, emoji: "🍋" },

    // Sandwiches
    { id: "sw1", name: "Avocado Toast", description: "Sourdough, smashed avocado, cherry tomatoes, chilli flakes", price: 129, category: "sandwiches", isVeg: true, emoji: "🥑", badges: ["bestseller"] },
    { id: "sw2", name: "Grilled Veggie Panini", description: "Zucchini, bell peppers, mozzarella on pressed ciabatta", price: 139, category: "sandwiches", isVeg: true, emoji: "🥪", badges: ["must-try"] },
    { id: "sw3", name: "Chicken Club", description: "Grilled chicken, lettuce, tomato, mayo on multigrain", price: 159, category: "sandwiches", isVeg: false, emoji: "🍗" },
  ],
};

export default cozycup;
