"use client";

import Link from "next/link";
import { track } from "@/lib/analytics/client";

/** Checkout link that fires begin_checkout. Used on the full cart page. */
export function CheckoutButton({
  checkoutUrl,
  value,
  currency,
  items,
  className,
  children,
}: {
  checkoutUrl: string;
  value: number;
  currency: string;
  items: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={checkoutUrl}
      onClick={() => track("begin_checkout", { value, currency, items })}
      className={className}
    >
      {children}
    </Link>
  );
}
