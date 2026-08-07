import type { Money } from "@/lib/shopify/types";

export function formatMoney(money: Money): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: money.currencyCode,
    maximumFractionDigits: 0,
  }).format(Number(money.amount));
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
