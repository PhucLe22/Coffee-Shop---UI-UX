import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatToVND(amount: number | string | undefined | null) {
  if (amount === undefined || amount === null) return "0 ₫";

  const numericAmount = typeof amount === "string" ? parseFloat(amount) : Number(amount);
  
  if (isNaN(numericAmount)) return "0 ₫";

  const rounded = Math.round(numericAmount);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
}
