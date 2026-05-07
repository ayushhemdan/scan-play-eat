/**
 * Parse an openHours string like "10 AM – 11 PM" and return whether
 * the cafe is currently open based on the device's local time.
 * Returns true if the string can't be parsed (fail open).
 */
export function isOpen(openHours: string): boolean {
  const match = openHours.match(
    /(\d+)\s*(AM|PM)\s*[–\-]\s*(\d+)\s*(AM|PM)/i
  );
  if (!match) return true;

  let open = parseInt(match[1]);
  const openPeriod = match[2].toUpperCase();
  let close = parseInt(match[3]);
  const closePeriod = match[4].toUpperCase();

  if (openPeriod === "PM" && open !== 12) open += 12;
  if (openPeriod === "AM" && open === 12) open = 0;
  if (closePeriod === "PM" && close !== 12) close += 12;
  if (closePeriod === "AM" && close === 12) close = 0;

  const hour = new Date().getHours();
  return hour >= open && hour < close;
}

/** Format a price in INR */
export function formatPrice(amount: number): string {
  return `₹${amount}`;
}
