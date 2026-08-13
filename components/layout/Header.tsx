"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";
import { mainMenu } from "@/lib/config/site";
import { BagIcon, HeartIcon, MenuIcon, SearchIcon } from "@/components/ui/icons";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { AnnouncementBar } from "./AnnouncementBar";
import { Logo } from "./Logo";
import { MegaMenuPanel } from "./MegaMenu";
import { MobileNav } from "./MobileNav";

/** Mono utility voice used across the nav (design file). */
const NAV_LABEL =
  "mono text-[0.8rem] font-bold uppercase tracking-[0.18em] whitespace-nowrap";

export function Header() {
  const pathname = usePathname();
  const { cart, openDrawer } = useCart();
  const { count: wishlistCount, hydrated: wishlistHydrated } = useWishlist();
  const itemCount = cart?.totalQuantity ?? 0;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <>
      <AnnouncementBar />
      <header
        className="sticky top-0 z-40 bg-tpc-black text-tpc-white"
        onMouseLeave={() => setOpenMenu(null)}
      >
        <div className="gutter flex flex-wrap items-center justify-between gap-x-7 gap-y-3.5 py-5">
          {/* Left: mobile menu trigger + lockup */}
          <div className="flex flex-none items-center gap-4 [animation:tpc-slide_.6s_cubic-bezier(.2,.9,.3,1)_both]">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="-ml-1 p-1 hover:text-accent lg:hidden"
            >
              <MenuIcon />
            </button>
            <Link href="/" aria-label="The Pitlane Collective home">
              <Logo />
            </Link>
          </div>

          {/* Centre: primary navigation */}
          <nav
            aria-label="Primary"
            className="hidden min-w-0 flex-1 flex-nowrap items-center justify-center gap-x-8 gap-y-2.5 lg:flex xl:gap-x-10"
          >
            {mainMenu.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <div
                  key={item.href}
                  onMouseEnter={() =>
                    setOpenMenu(item.columns ? item.label : null)
                  }
                >
                  <Link
                    href={item.href}
                    className={`${NAV_LABEL} transition-colors ${
                      active
                        ? "text-tpc-white"
                        : "text-[#9c9fa2] hover:text-tpc-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Right: utilities */}
          <div className="ml-auto flex flex-none items-center gap-5 text-[#9c9fa2]">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className={`${NAV_LABEL} transition-colors hover:text-tpc-white`}
            >
              <SearchIcon className="h-5 w-5 sm:hidden" />
              <span className="hidden sm:inline">Search</span>
            </button>
            <Link
              href="/wishlist"
              aria-label={`Wishlist${wishlistHydrated && wishlistCount ? `, ${wishlistCount} items` : ""}`}
              className="relative hidden transition-colors hover:text-tpc-white sm:block"
            >
              <HeartIcon />
              {wishlistHydrated && wishlistCount > 0 ? (
                <span className="mono absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center bg-accent px-1 text-[0.6rem] font-bold tabular text-accent-contrast">
                  {wishlistCount}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              onClick={openDrawer}
              aria-label={`Cart, ${itemCount} items`}
              className={`${NAV_LABEL} flex items-center gap-2 text-tpc-white transition-colors hover:text-accent`}
            >
              <BagIcon />
              <span className="tabular">({itemCount})</span>
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
