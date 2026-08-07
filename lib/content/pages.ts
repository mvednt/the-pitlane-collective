/**
 * Content for policy & support pages (spec §28 / P5.5).
 *
 * This is editable placeholder content — realistic in tone but NOT legally
 * reviewed. Anywhere a real operational or legal value is required, a
 * `[CONFIG: …]` marker is used instead of an invented value (delivery windows,
 * refund timelines, jurisdiction, business registration, GST, support hours).
 * `reviewRequired: true` surfaces a visible "pending review" banner on the page.
 *
 * In production these can move to Shopify pages/metaobjects behind the same
 * shape. `contentPageSlugs` also feeds the sitemap.
 */

export interface PageTable {
  caption?: string;
  columns: string[];
  rows: string[][];
}

export interface PageSection {
  heading?: string;
  body?: string[];
  list?: string[];
  note?: string;
}

export interface ContentPage {
  slug: string;
  title: string;
  description: string;
  intro?: string;
  sections: PageSection[];
  tables?: PageTable[];
  reviewRequired?: boolean;
  custom?: "contact";
}

export const contentPages: ContentPage[] = [
  {
    slug: "about",
    title: "About TPC",
    description:
      "The Pitlane Collective — premium motorsport-inspired apparel, designed for everyday rotation.",
    intro:
      "The Pitlane Collective sits between overpriced imported official merchandise and low-quality local knock-offs. We make premium, motorsport-inspired pieces that feel considered, wearable and culturally relevant — designed around the culture, not just the logo.",
    sections: [
      {
        heading: "What we make",
        body: [
          "Oversized tees, baby tees and jerseys built for race weekends and every other day. Limited runs, no restocks guaranteed.",
        ],
      },
      {
        heading: "Why we started",
        body: [
          "Official merchandise is expensive and hard to get in India, and the cheap alternatives cut corners on fabric, fit and design. We wanted pieces that hold up — in quality and in how they look off the circuit.",
        ],
      },
    ],
  },
  {
    slug: "contact",
    title: "Contact",
    description: "Get in touch with The Pitlane Collective.",
    intro:
      "Questions about an order, sizing or a drop? Reach us on WhatsApp or email and we'll get back as soon as we can.",
    custom: "contact",
    sections: [
      {
        heading: "Support hours",
        body: ["[CONFIG: customer-service hours — e.g. Mon–Sat, 10am–6pm IST]"],
      },
      {
        heading: "Business details",
        body: [
          "[CONFIG: registered business name, address and GST details to be added before launch]",
        ],
      },
    ],
  },
  {
    slug: "faqs",
    title: "FAQs",
    description: "Common questions about sizing, shipping, exchanges and drops.",
    sections: [
      {
        heading: "How do I choose my size?",
        body: [
          "Check the Size Guide for measurements by category. Our oversized tees run boxy — size down for a closer fit.",
        ],
      },
      {
        heading: "When do new drops go live?",
        body: [
          "Drops are limited and announced to our newsletter and social channels first. No restocks are guaranteed.",
        ],
      },
      {
        heading: "Do you ship across India?",
        body: [
          "Yes — we ship pan-India. Prepaid and COD options are shown at checkout where available. [CONFIG: serviceable pincodes / courier partners]",
        ],
      },
      {
        heading: "Can I exchange for a different size?",
        body: [
          "Size exchanges are supported subject to stock. See Returns & Exchanges for the process. [CONFIG: exchange window]",
        ],
      },
    ],
  },
  {
    slug: "size-guide",
    title: "Size Guide",
    description:
      "Measurements for oversized tees, baby tees and jerseys (approximate).",
    intro:
      "Measurements are approximate, in inches, and provided as a guide. Final production measurements are pending confirmation.",
    tables: [
      {
        caption: "Oversized T-Shirt",
        columns: ["Size", "Chest", "Length"],
        rows: [
          ["S", "42", "27"],
          ["M", "44", "28"],
          ["L", "46", "29"],
          ["XL", "48", "30"],
          ["XXL", "50", "31"],
        ],
      },
      {
        caption: "Baby Tee",
        columns: ["Size", "Chest", "Length"],
        rows: [
          ["XS", "30", "16"],
          ["S", "32", "16.5"],
          ["M", "34", "17"],
          ["L", "36", "17.5"],
        ],
      },
      {
        caption: "Jersey",
        columns: ["Size", "Chest", "Length"],
        rows: [
          ["S", "40", "27"],
          ["M", "42", "28"],
          ["L", "44", "29"],
          ["XL", "46", "30"],
          ["XXL", "48", "31"],
        ],
      },
    ],
    sections: [
      {
        heading: "How to measure",
        list: [
          "Chest — measure across the fullest part, from armpit to armpit, and double it.",
          "Length — measure from the highest point of the shoulder straight down to the hem.",
        ],
      },
    ],
  },
  {
    slug: "care-guide",
    title: "Care Guide",
    description: "Keep your pieces looking their best, wash after wash.",
    intro:
      "A few habits go a long way with heavyweight cotton and printed graphics.",
    sections: [
      {
        heading: "Washing",
        list: [
          "Machine wash cold, inside out, with like colours.",
          "Use a mild detergent. Avoid bleach and fabric softener.",
        ],
      },
      {
        heading: "Drying & prints",
        list: [
          "Tumble dry low or line dry in shade.",
          "Do not iron directly over prints — turn inside out or use a cloth.",
        ],
      },
    ],
  },
  {
    slug: "shipping-policy",
    title: "Shipping Policy",
    description: "How and where we ship.",
    reviewRequired: true,
    sections: [
      {
        heading: "Coverage",
        body: [
          "We ship across India. Serviceability is confirmed by pincode at checkout. [CONFIG: courier partners and serviceable regions]",
        ],
      },
      {
        heading: "Charges & timelines",
        body: [
          "Free shipping applies above the threshold shown in the announcement bar; otherwise standard charges apply at checkout. [CONFIG: exact shipping charges and estimated delivery windows — do not treat as guaranteed until confirmed]",
        ],
      },
      {
        heading: "Prepaid & COD",
        body: [
          "Prepaid and Cash on Delivery are offered where available. COD may require order confirmation. [CONFIG: COD eligibility and any charges]",
        ],
      },
    ],
  },
  {
    slug: "returns",
    title: "Returns & Exchanges",
    description: "Our returns and size-exchange process.",
    reviewRequired: true,
    sections: [
      {
        heading: "Eligibility",
        body: [
          "Items must be unworn, unwashed and with original tags. Certain items may be final sale. [CONFIG: return window and any exclusions]",
        ],
      },
      {
        heading: "Size exchanges",
        body: [
          "We support size exchanges subject to stock. Start a request by contacting us. [CONFIG: exchange window and process]",
        ],
      },
      {
        heading: "How to start",
        body: [
          "Contact us with your order number and the item you'd like to return or exchange. [CONFIG: return address and reverse-pickup availability]",
        ],
      },
    ],
  },
  {
    slug: "refund",
    title: "Refund Policy",
    description: "How and when refunds are processed.",
    reviewRequired: true,
    sections: [
      {
        heading: "Approved refunds",
        body: [
          "Once a return is received and inspected, an approved refund is issued to the original payment method (or as store credit where applicable). [CONFIG: refund processing time — do not state a guaranteed number of days until confirmed]",
        ],
      },
      {
        heading: "COD orders",
        body: [
          "For COD orders, refunds are issued via bank transfer or UPI to details you provide. [CONFIG: COD refund method and verification]",
        ],
      },
    ],
  },
  {
    slug: "cancellation",
    title: "Cancellation Policy",
    description: "How to cancel an order before dispatch.",
    reviewRequired: true,
    sections: [
      {
        heading: "Before dispatch",
        body: [
          "Orders can be cancelled before they are dispatched. Contact us as soon as possible with your order number. [CONFIG: cancellation cut-off window]",
        ],
      },
      {
        heading: "After dispatch",
        body: [
          "Once dispatched, an order can't be cancelled but may be eligible for return per our Returns policy.",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    description: "How we handle your data.",
    reviewRequired: true,
    sections: [
      {
        heading: "What we collect",
        body: [
          "Order and contact details you provide, and — only with your consent — analytics data about how the store is used. We never sell your personal data.",
        ],
      },
      {
        heading: "Analytics & cookies",
        body: [
          "Optional analytics and marketing cookies load only after you consent, and can be changed anytime from Cookie preferences in the footer. We do not send your email, phone or address to analytics providers.",
        ],
      },
      {
        heading: "Your rights & contact",
        body: [
          "You can request access to or deletion of your data. [CONFIG: data-protection contact, grievance officer and jurisdiction to be confirmed with legal review]",
        ],
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    description: "The terms governing use of this store.",
    reviewRequired: true,
    sections: [
      {
        heading: "Use of the store",
        body: [
          "By placing an order you agree to these terms. Product colours may vary slightly by screen. Prices and availability can change without notice.",
        ],
      },
      {
        heading: "Orders & pricing",
        body: [
          "We may cancel orders in cases of pricing errors, suspected fraud or stock issues. Prices are inclusive of applicable taxes as shown at checkout.",
        ],
      },
      {
        heading: "Governing law",
        body: [
          "[CONFIG: governing law and jurisdiction to be set with legal review — not stated here to avoid inventing binding terms.]",
        ],
      },
    ],
  },
];

export function getContentPage(slug: string): ContentPage | undefined {
  return contentPages.find((p) => p.slug === slug);
}

export const contentPageSlugs = contentPages.map((p) => p.slug);
