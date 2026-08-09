"use client";

import Link from "next/link";
import { useEffect } from "react";
import { mainMenu } from "@/lib/config/site";
import { CloseIcon } from "@/components/ui/icons";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { Logo } from "./Logo";

export function MobileNav({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useFocusTrap<HTMLElement>(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-tpc-black/70"
      />
      <nav
        ref={panelRef}
        aria-label="Mobile"
        className="absolute left-0 top-0 flex h-full w-full max-w-xs flex-col bg-surface text-foreground"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <Logo />
          <button type="button" onClick={onClose} aria-label="Close menu">
            <CloseIcon />
          </button>
        </div>
        <ul className="flex flex-col px-5 py-4">
          {mainMenu.map((item) => (
            <li key={item.href} className="border-b border-border/60">
              <Link
                href={item.href}
                onClick={onClose}
                className="mono block py-3 text-sm font-bold uppercase tracking-[0.18em] transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-auto border-t border-border px-5 py-4 text-sm">
          <Link href="/wishlist" onClick={onClose} className="mono block py-1.5 text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-accent">
            Wishlist
          </Link>
          <Link href="/search" onClick={onClose} className="mono block py-1.5 text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-accent">
            Search
          </Link>
        </div>
      </nav>
    </div>
  );
}
