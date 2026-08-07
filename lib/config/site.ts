/**
 * Editable brand + homepage content.
 *
 * This is the local "CMS" for the first version (spec §26). Every string here
 * can change without touching component code. In production these sections can
 * be migrated to Shopify metaobjects/metafields behind the same shape.
 */
import { publicEnv } from "@/lib/env.public";

export interface NavChild {
  label: string;
  href: string;
}

export interface NavColumn {
  heading: string;
  links: NavChild[];
}

export interface MegaMenu {
  label: string;
  href: string;
  columns?: NavColumn[];
  feature?: { title: string; href: string; image: string };
}

/**
 * Brand logo wiring. Drop your files in public/brand and set useLogoFiles=true
 * to switch from the typographic placeholder to your artwork (spec: user is
 * supplying PNG/SVG files).
 */
export const brandConfig = {
  useLogoFiles: false,
  logoOnDark: "/brand/logo-dark.svg", // light artwork, for dark backgrounds
  logoOnLight: "/brand/logo-light.svg", // dark artwork, for light backgrounds
} as const;

export const siteConfig = {
  name: "The Pitlane Collective",
  shortName: "TPC",
  tagline: "Motorsport, off the circuit.",
  description:
    "Premium motorsport-inspired apparel, designed for everyday rotation. Oversized tees, baby tees, and jerseys — built for race weekends, made for every other day.",
  url: publicEnv.NEXT_PUBLIC_SITE_URL,

  /** Free-shipping threshold in the store currency's major unit (₹). */
  freeShippingThreshold: 1999,
  currency: "INR",

  social: {
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    x: "https://x.com",
    whatsapp: "https://wa.me/910000000000",
  },
} as const;

/** Rotating announcement-bar messages (spec §8A). */
export const announcements: string[] = [
  "Free shipping on orders above ₹1,999",
  "Limited first drop now live — no restocks guaranteed",
  "Easy size exchanges across India",
  "Prepaid & COD available",
];

/** Hero (spec §8C). */
export const hero = {
  eyebrow: "First Drop",
  spec: "Race-week drops · Limited runs · Shipped across India",
  headline: "The grid looks different from here.",
  supporting:
    "Premium motorsport-inspired apparel, designed for everyday rotation.",
  primaryCta: { label: "Shop the drop", href: "/collections/new-drop" },
  secondaryCta: { label: "Explore TPC", href: "/pages/about" },
  image: "/mock/campaign/hero.svg",
} as const;

/**
 * Scrolling ticker selling points (timing-screen aesthetic). `◆` separators are
 * added by the component. Kept honest — no invented delivery windows.
 */
export const ticker: string[] = [
  "Free shipping over ₹1,999",
  "Heavyweight cotton",
  "Screen-print detailing",
  "Limited runs · No restocks guaranteed",
  "New drop every race week",
  "Prepaid & COD",
];

/** Honest at-a-glance stats for the home stat band (no fabricated metrics). */
export const stats: Array<{ value: string; label: string }> = [
  { value: "03", label: "Core categories" },
  { value: "₹1,999", label: "Free shipping over" },
  { value: "PAN-INDIA", label: "Shipping" },
  { value: "LIMITED", label: "Runs · no restocks" },
];

/** Shop-by-category editorial blocks (spec §8D). */
export const categoryBlocks = [
  {
    title: "Oversized",
    descriptor: "Boxy, heavyweight, everyday.",
    href: "/collections/oversized",
    image: "/mock/collections/oversized.svg",
  },
  {
    title: "Baby Tees",
    descriptor: "Fitted, cropped, sharp.",
    href: "/collections/baby-tees",
    image: "/mock/collections/baby-tees.svg",
  },
  {
    title: "Jerseys",
    descriptor: "Paddock-issue, off the circuit.",
    href: "/collections/jerseys",
    image: "/mock/collections/jerseys.svg",
  },
] as const;

/** Brand manifesto (spec §8H). */
export const brandStatement = {
  heading: "Designed around the culture, not just the logo.",
  body: "Official merchandise is expensive and hard to get in India. The cheap alternatives cut corners on fabric, fit and design. TPC sits in between — considered, wearable, culturally aware pieces made for the ones watching every lap.",
} as const;

/** Craftsmanship claims — editable placeholders until final specs land (spec §8I). */
export const craftsmanship = [
  {
    title: "Heavyweight cotton",
    body: "240–260 GSM combed cotton with a structured, boxy drape.",
  },
  {
    title: "Screen-print detailing",
    body: "High-density and puff prints finished to hold up wash after wash.",
  },
  {
    title: "Considered fit",
    body: "Blocks tuned for an oversized silhouette that still sits clean.",
  },
  {
    title: "Limited runs",
    body: "Small production batches. No restocks guaranteed.",
  },
] as const;

/** Newsletter (spec §8K). */
export const newsletter = {
  heading: "Get on the grid",
  body: "Be first to know about new drops, restocks and limited releases.",
} as const;

/**
 * Suggested searches shown when the search overlay is empty. Deliberately
 * generic (categories, fits, colours) — no team, brand, or driver names are
 * hard-coded into search.
 */
export const popularSearches: string[] = [
  "Oversized",
  "Jersey",
  "Baby tee",
  "New drop",
  "Black",
  "Racing red",
];

/** Primary navigation with mega-menu content (spec §8B). */
export const mainMenu: MegaMenu[] = [
  { label: "New Drop", href: "/collections/new-drop" },
  {
    label: "Men",
    href: "/men",
    columns: [
      {
        heading: "Shop Men",
        links: [
          { label: "All Men", href: "/men" },
          { label: "Oversized Tees", href: "/collections/oversized?gender=men" },
          { label: "Jerseys", href: "/collections/jerseys?gender=men" },
        ],
      },
      {
        heading: "Collections",
        links: [
          { label: "New Drop", href: "/collections/new-drop" },
          { label: "Bestsellers", href: "/collections/bestsellers" },
        ],
      },
    ],
    feature: {
      title: "The First Drop",
      href: "/collections/new-drop",
      image: "/mock/collections/oversized.svg",
    },
  },
  {
    label: "Women",
    href: "/women",
    columns: [
      {
        heading: "Shop Women",
        links: [
          { label: "All Women", href: "/women" },
          { label: "Baby Tees", href: "/collections/baby-tees" },
          {
            label: "Oversized Tees",
            href: "/collections/oversized?gender=women",
          },
          { label: "Jerseys", href: "/collections/jerseys?gender=women" },
        ],
      },
      {
        heading: "Collections",
        links: [
          { label: "New Drop", href: "/collections/new-drop" },
          { label: "Bestsellers", href: "/collections/bestsellers" },
        ],
      },
    ],
    feature: {
      title: "Baby Tees",
      href: "/collections/baby-tees",
      image: "/mock/collections/baby-tees.svg",
    },
  },
  { label: "Oversized", href: "/collections/oversized" },
  { label: "Baby Tees", href: "/collections/baby-tees" },
  { label: "Jerseys", href: "/collections/jerseys" },
  { label: "About", href: "/pages/about" },
];

/** Footer columns (spec §8L). */
export const footerColumns: NavColumn[] = [
  {
    heading: "Shop",
    links: [
      { label: "New Drop", href: "/collections/new-drop" },
      { label: "Oversized", href: "/collections/oversized" },
      { label: "Baby Tees", href: "/collections/baby-tees" },
      { label: "Jerseys", href: "/collections/jerseys" },
      { label: "Men", href: "/men" },
      { label: "Women", href: "/women" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "Contact", href: "/pages/contact" },
      { label: "Size Guide", href: "/pages/size-guide" },
      { label: "Shipping", href: "/pages/shipping-policy" },
      { label: "Returns & Exchanges", href: "/pages/returns" },
      { label: "FAQs", href: "/pages/faqs" },
    ],
  },
  {
    heading: "Information",
    links: [
      { label: "About TPC", href: "/pages/about" },
      { label: "Privacy Policy", href: "/pages/privacy" },
      { label: "Terms", href: "/pages/terms" },
      { label: "Refund Policy", href: "/pages/refund" },
      { label: "Shipping Policy", href: "/pages/shipping-policy" },
    ],
  },
];
