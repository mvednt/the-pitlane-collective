import { WishlistView } from "@/components/wishlist/WishlistView";

export const metadata = {
  title: "Wishlist",
  description: "Your saved pieces from The Pitlane Collective.",
};

export default function WishlistPage() {
  return (
    <div>
      <h1 className="mb-2 font-display text-3xl tracking-tight sm:text-4xl">
        Wishlist
      </h1>
      <p className="mb-8 text-sm text-muted">
        Saved pieces, kept on this device. Sign in later to sync across devices.
      </p>
      <WishlistView />
    </div>
  );
}
