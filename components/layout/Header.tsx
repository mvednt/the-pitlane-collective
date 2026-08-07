"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { mainMenu } from "@/lib/config/site";
import { cn } from "@/lib/utils";
import { BagIcon, HeartIcon, MenuIcon, SearchIcon } from "@/components/ui/icons";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { AnnouncementBar } from "./AnnouncementBar";
import { Logo } from "./Logo";
import { MegaMenuPanel } from "./MegaMenu";
import { MobileNav } from "./MobileNav";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { cart, openDrawer } = useCart();
  const { count: wishlistCount, hydrated: wishlistHydrated } = useWishlist();
  const itemCount = cart?.totalQuantity ?? 0;

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Solid (cream) header everywhere except at the top of the dark homepage hero.
  const solid = !isHome || scrolled || openMenu !== null;

  return (
    <>
      <AnnouncementBar />
      <header
        className={cn(
          "sticky top-0 z-40 transition-colors duration-200",
          solid
            ? "border-b border-border bg-surface text-foreground"
            : "bg-transparent text-tpc-cream",
        )}
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
          {/* Left: mobile menu + desktop nav */}
          <div className="flex flex-1 items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="md:hidden"
            >
              <MenuIcon />
            </button>

            <nav className="hidden items-center gap-6 md:flex">
              {mainMenu.map((item) => (
                <div
                  key={item.href}
                  onMouseEnter={() => setOpenMenu(item.columns ? item.label : null)}
                >
                  <Link
                    href={item.href}
                    className="whitespace-nowrap text-[0.75rem] font-medium uppercase tracking-[0.06em] transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* Center: logo */}
          <Link href="/" aria-label="The Pitlane Collective home">
            <Logo variant={solid ? "onLight" : "onDark"} />
          </Link>

          {/* Right: utilities */}
          <div className="flex flex-1 items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="hover:text-accent"
            >
              <SearchIcon />
            </button>
            <Link
              href="/wishlist"
              aria-label={`Wishlist${wishlistHydrated && wishlistCount ? `, ${wishlistCount} items` : ""}`}
              className="relative hidden hover:text-accent sm:block"
            >
              <HeartIcon />
              {wishlistHydrated && wishlistCount > 0 ? (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[0.6rem] font-semibold tabular text-accent-contrast">
                  {wishlistCount}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              onClick={openDrawer}
              aria-label={`Cart, ${itemCount} items`}
              className="relative hover:text-accent"
            >
              <BagIcon />
              {itemCount > 0 ? (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[0.6rem] font-semibold tabular text-accent-contrast">
                  {itemCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>

        {openMenu ? (
          <MegaMenuPanel
            menu={mainMenu.find((m) => m.label === openMenu)!}
            onNavigate={() => setOpenMenu(null)}
          />
        ) : null}
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
