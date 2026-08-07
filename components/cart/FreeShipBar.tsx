import { formatMoney } from "@/lib/utils";

export function FreeShipBar({
  subtotal,
  threshold,
}: {
  subtotal: number;
  threshold: number;
}) {
  const remaining = Math.max(0, threshold - subtotal);
  const pct = Math.min(100, (subtotal / threshold) * 100);
  const qualified = remaining <= 0;

  return (
    <div>
      <p className="mb-2 text-xs text-muted">
        {qualified ? (
          <span className="font-medium text-foreground">
            You&apos;ve unlocked free shipping.
          </span>
        ) : (
          <>
            Add{" "}
            <span className="font-medium text-foreground tabular">
              {formatMoney({ amount: String(remaining), currencyCode: "INR" })}
            </span>{" "}
            more for free shipping.
          </>
        )}
      </p>
      <div className="h-1.5 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
