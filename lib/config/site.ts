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
 * Brand logo wiring. The supplied lockup/stacked artwork lives in public/brand.
 * `logoOnLight` is null because the artwork is drawn in bone + racing red for
 * the dark canvas; add a dark-ink file here if a light surface is introduced.
 */
export const brandConfig = {
  logoOnDark: "/brand/logo-lockup.png", // light artwork, for dark backgrounds
  logoOnLight: null as string | null, // dark artwork, for light backgrounds
  logoStacked: "/brand/logo-stacked.png",
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

/**
 * Hero (spec §8C). The headline is set as three separately animated lines,
 * the last one in the racing accent.
 */
export const hero = {
  eyebrow: "First Drop",
  headlineLines: ["Dressed", "For Lights"] as string[],
  headlineAccentLine: "Out.",
  supporting:
    "Motorsport-inspired apparel, cut and sewn in India. Track-tested materials. Street-ready silhouettes.",
  primaryCta: { label: "Shop collection", href: "#shop" },
  secondaryCta: { label: "Lookbook", href: "#lookbook" },
  image: "/mock/campaign/hero.svg",
} as const;

/**
 * Three at-a-glance figures stacked beside the hero headline.
 *
 * NOTE: `4.9★` is design placeholder copy, not a measured rating — replace it
 * (or drop the third stat) once real review data is wired up.
 */
export const heroStats: Array<{ value: string; accent?: string; label: string }> =
  [
    { value: "3", label: "Silhouettes" },
    { value: "₹1999+", label: "Free shipping" },
    { value: "4.9", accent: "★", label: "Rating" },
  ];

/**
 * Aggregate review figure shown on the featured piece.
 *
 * NOTE: placeholder copy from the design — swap for real review data (or
 * remove the row) before launch.
 */
export const reviewSummary = { rating: "4.9", count: 214 } as const;

/**
 * Lookbook tiles (home). Each one links into the collection it shows; the
 * first tile runs full height beside the two stacked ones.
 */
export const lookbook = [
  {
    title: "Oversized",
    handle: "oversized",
    image: "/mock/collections/oversized-2.svg",
  },
  {
    title: "Baby Tees",
    handle: "baby-tees",
    image: "/mock/collections/baby-tees-2.svg",
  },
  {
    title: "Jerseys",
    handle: "jerseys",
    image: "/mock/collections/jerseys-2.svg",
  },
] as const;

/** Brand story block (home). */
export const story = {
  eyebrow: "Our story",
  headline: "Built In The",
  headlineAccent: "Pit Lane.",
  body: [
    "The Pitlane Collective started with three silhouettes and a rule: nothing goes on a garment that we didn't draw ourselves. No borrowed marks, no team replicas.",
    "Cut and sewn in India, in a fixed collection we keep in stock. Oversized tees, baby tees and jerseys — built to be worn, not saved for a race weekend.",
  ],
  cta: { label: "Read the full story", href: "/pages/about" },
  image: "/mock/collections/new-drop-2.svg",
} as const;

/** Newsletter (spec §8K). */
export const newsletter = {
  heading: "Early access.",
  headingAccent: "New colourways.",
  body: "Join the list. New pieces and colourways, straight to your inbox.",
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
  { label: "Shop All", href: "/shop" },
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
      { label: "Shop All", href: "/shop" },
      { label: "Oversized", href: "/collections/oversized" },
      { label: "Baby Tees", href: "/collections/baby-tees" },
      { label: "Jerseys", href: "/collections/jerseys" },
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
