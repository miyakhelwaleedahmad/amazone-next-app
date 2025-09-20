// Small utility helpers used across the app
// Provides a `cn` wrapper for className merging (uses clsx)
import clsx from "clsx";

export function cn(...inputs: Parameters<typeof clsx>) {
  return clsx(...inputs);
}
