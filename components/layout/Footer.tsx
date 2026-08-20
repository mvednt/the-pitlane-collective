import Link from "next/link";
import { footerColumns, siteConfig } from "@/lib/config/site";
import { CookiePreferencesLink } from "@/components/consent/CookiePreferencesLink";
import { Logo } from "./Logo";

const paymentMethods = ["UPI", "Visa", "Mastercard", "RuPay", "Net Banking", "COD"];

const social: Array<{ label: string; href: string }> = [
  { label: "Instagram", href: siteConfig.social.instagram },
  { label: "WhatsApp", href: siteConfig.social.whatsapp },
];

const COLUMN_HEADING =
  "mono text-[0.75rem] uppercase tracking-[0.24em] text-tpc-dim";
const COLUMN_LINK =
  "text-base text-[#c8cbcd] transition-colors hover:text-accent";
const LEGAL_LINK = "text-tpc-dim transition-colors hover:text-tpc-white";

export function Footer() {
  return (
    <footer className="gutter border-t border-border bg-tpc-black pt-[clamp(3rem,5vw,5.5rem)]">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(13.125rem,1fr))] gap-x-10 gap-y-11">
        <div className="min-w-0">
          <Logo />
          <p className="mt-5 max-w-[30ch] text-base leading-[1.55] text-muted">
            {siteConfig.description}
          </p>
        </div>

        {footerColumns.map((column) => (
          <div key={column.heading} className="min-w-0">
            <p className={COLUMN_HEADING}>{column.heading}</p>
            <ul className="mt-5 flex flex-col gap-4">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={COLUMN_LINK}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="min-w-0">
          <p className={COLUMN_HEADING}>Follow</p>
          <ul className="mt-5 flex flex-col gap-4">
            {social.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={COLUMN_LINK}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mono mt-[clamp(2.5rem,5vw,5rem)] flex flex-wrap justify-between gap-x-8 gap-y-4 border-t border-border py-6 text-[0.75rem] uppercase tracking-[0.16em] text-tpc-dim">
        <div className="flex flex-col gap-2">
          <span>
            &copy; {new Date().getFullYear()} {siteConfig.name} · All rights
            reserved
          </span>
          <span>{paymentMethods.join(" · ")}</span>
          <span>
            Made in India · Prices inclusive of taxes · GST / business
            information to be added
          </span>
        </div>

        <div className="flex flex-wrap gap-x-7 gap-y-3">
          <Link href="/pages/privacy" className={LEGAL_LINK}>
            Privacy policy
          </Link>
          <Link href="/pages/terms" className={LEGAL_LINK}>
            Terms of service
          </Link>
          <CookiePreferencesLink />
        </div>
      </div>
    </footer>
  );
}
