/**
 * Format number into currency (Amazon style)
 */
export function formatPrice(amount: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Format date into readable string
 */
export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Shorten long product titles (like Amazon does)
 */
export function truncateText(text: string, maxLength: number = 50) {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}
