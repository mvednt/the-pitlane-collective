import Link from "next/link";
import { footerColumns, siteConfig } from "@/lib/config/site";
import { CookiePreferencesLink } from "@/components/consent/CookiePreferencesLink";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { Logo } from "./Logo";

const paymentMethods = ["UPI", "Visa", "Mastercard", "RuPay", "Net Banking", "COD"];

export function Footer() {
  return (
    <footer className="section-dark">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo variant="onDark" className="mb-4" />
            <p className="max-w-xs text-sm text-tpc-cream/60">
              {siteConfig.description}
            </p>
            <div className="mt-6">
              <NewsletterForm variant="onDark" />
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.heading}>
              <p className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-tpc-cream/50">
                {column.heading}
              </p>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-tpc-cream/75 transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-tpc-cream/15 pt-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <a href={siteConfig.social.instagram} className="hover:text-accent" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href={siteConfig.social.youtube} className="hover:text-accent" target="_blank" rel="noopener noreferrer">YouTube</a>
              <a href={siteConfig.social.x} className="hover:text-accent" target="_blank" rel="noopener noreferrer">X</a>
              <a href={siteConfig.social.whatsapp} className="hover:text-accent" target="_blank" rel="noopener noreferrer">WhatsApp</a>
              <CookiePreferencesLink />
            </div>
            <div className="flex flex-wrap gap-2 md:ml-auto">
              {paymentMethods.map((method) => (
                <span
                  key={method}
                  className="rounded border border-tpc-cream/20 px-2 py-1 text-[0.65rem] uppercase tracking-wide text-tpc-cream/60"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1 text-[0.7rem] text-tpc-cream/40">
            <p>
              {siteConfig.name} · A motorsport-inspired fashion label · Made in
              India
            </p>
            <p>GST / business information to be added · Prices inclusive of taxes</p>
            <p>&copy; {new Date().getFullYear()} {siteConfig.shortName}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
