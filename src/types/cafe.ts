// ─── Theme ───────────────────────────────────────────────────────────────────

export type CafeTheme = {
  /** Main brand color hex e.g. "#F59E0B" */
  primary: string;
  /** Space-separated RGB for opacity usage e.g. "245 158 11" */
  primaryRgb: string;
};

// ─── Menu ────────────────────────────────────────────────────────────────────

export type Badge = "bestseller" | "spicy" | "new" | "must-try";

export type CustomOption = {
  id: string;
  label: string;
  /** Extra cost in INR. 0 = free */
  price: number;
};

export type CustomGroup = {
  id: string;
  label: string;
  /** If true, customer must pick at least one option */
  required: boolean;
  /** If true, customer can pick more than one option */
  multiple: boolean;
  options: CustomOption[];
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  /** Must match a category id defined in Cafe.categories */
  category: string;
  isVeg: boolean;
  emoji: string;
  badges?: Badge[];
  soldOut?: boolean;
  customisations?: CustomGroup[];
};

export type MenuCategory = {
  id: string;
  label: string;
  emoji: string;
};

// ─── Features ────────────────────────────────────────────────────────────────

export type CafeFeatures = {
  /** Show the Games tab */
  games: boolean;
  /** Show the AI Buddy floating button */
  aiAssistant: boolean;
  /** Allow per-item customisation drawers */
  customisations: boolean;
};

// ─── Loyalty ─────────────────────────────────────────────────────────────────

export type LoyaltyConfig = {
  /** How many orders to earn the reward */
  stampsRequired: number;
  /** What the customer gets e.g. "1 Free Cold Coffee" */
  reward: string;
};

// ─── Cafe (top-level config) ─────────────────────────────────────────────────

export type Cafe = {
  /** URL slug — becomes /[slug] on the platform */
  slug: string;
  name: string;
  tagline: string;
  address: string;
  /** Display phone number */
  phone: string;
  /** WhatsApp number with country code, no + e.g. "919876543210" */
  whatsapp: string;
  /** Human-readable hours e.g. "11 AM – 11 PM" */
  openHours: string;
  theme: CafeTheme;
  categories: MenuCategory[];
  menu: MenuItem[];
  features: CafeFeatures;
  /** Custom name shown in the AI chat header */
  aiName?: string;
  /** Menu item ID to highlight as today's special */
  todaySpecial?: string;
  /** Loyalty stamp card config — omit to disable */
  loyalty?: LoyaltyConfig;
};
