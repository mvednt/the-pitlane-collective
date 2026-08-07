import Link from "next/link";
import { getCart } from "@/app/actions/cart";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CheckoutButton } from "@/components/cart/CheckoutButton";
import { formatMoney } from "@/lib/utils";

export const metadata = {
  title: "Your Cart",
};

export default async function CartPage() {
  const cart = await getCart();
  const lines = cart?.lines ?? [];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-8 font-display text-4xl tracking-tight">Your Cart</h1>

      {lines.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center ">
          <p className="mb-4 text-muted">Your cart is empty.</p>
          <Link
            href="/"
            className="text-sm font-medium underline underline-offset-4"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border border-border px-5 ">
          <ul className="divide-y divide-border">
            {lines.map((line) => (
              <CartLineItem key={line.id} line={line} />
            ))}
          </ul>
        </div>
      )}

      {cart && lines.length > 0 ? (
        <div className="mt-6 flex flex-col items-end gap-4">
          <div className="flex w-full max-w-xs items-center justify-between text-sm">
            <span className="text-muted">Subtotal</span>
            <span className="font-semibold">
              {formatMoney(cart.cost.subtotalAmount)}
            </span>
          </div>
          <CheckoutButton
            checkoutUrl={cart.checkoutUrl}
            value={Number(cart.cost.subtotalAmount.amount)}
            currency={cart.cost.subtotalAmount.currencyCode}
            items={cart.totalQuantity}
            className="w-full max-w-xs rounded-md bg-tpc-black py-3 text-center text-sm font-semibold uppercase tracking-wide text-tpc-cream hover:opacity-90"
          >
            Checkout
          </CheckoutButton>
        </div>
      ) : null}
    </div>
  );
}
