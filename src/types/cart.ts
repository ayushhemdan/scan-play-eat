export type CartSelection = {
  groupId: string;
  groupLabel: string;
  optionId: string;
  optionLabel: string;
  extraPrice: number;
};

export type CartItem = {
  itemId: string;
  name: string;
  emoji: string;
  basePrice: number;
  qty: number;
  /** Chosen customisation options for this entry */
  selections: CartSelection[];
  /** basePrice + sum of extraPrices (per unit, before qty) */
  unitTotal: number;
};
