import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn = className utility
 * Safely merges Tailwind classes + conditional classes
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
