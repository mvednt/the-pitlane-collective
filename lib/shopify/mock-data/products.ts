import type {
  Image,
  Money,
  Product,
  ProductBadge,
  ProductDetails,
  ProductVariant,
} from "../types";

/** Mock-only shape: carries collection membership so the mock adapter can filter by it. */
export type MockProduct = Product & { collectionHandles: string[] };

const CURRENCY = "INR";

function money(amount: number): Money {
  return { amount: amount.toFixed(2), currencyCode: CURRENCY };
}

function img(handle: string, alt: string): Image {
  return { url: `/mock/products/${handle}.svg`, altText: alt, width: 1000, height: 1250 };
}

interface BuildInput {
  handle: string;
  title: string;
  productType: "Oversized T-Shirt" | "Baby Tee" | "Jersey";
  gender: Array<"men" | "women">;
  price: number;
  compareAt?: number;
  badge?: ProductBadge;
  colours: string[];
  sizes: string[];
  /** {size,colour} combos that are sold out. */
  soldOut?: Array<{ size: string; colour: string }>;
  lowStock?: Array<{ size: string; colour: string }>;
  description: string;
  details: Partial<ProductDetails>;
  images: Array<[string, string]>;
  collectionHandles: string[];
  tags: string[];
}

function build(input: BuildInput): MockProduct {
  // Every product carries Size + Colour options (even single-colour ones) so
  // colour faceting and cart display work uniformly. This maps directly to
  // Shopify product options; the PDP selector hides single-value groups.
  const variants: ProductVariant[] = [];

  for (const size of input.sizes) {
    for (const colour of input.colours) {
      const sold = input.soldOut?.some(
        (s) => s.size === size && s.colour === colour,
      );
      const low = input.lowStock?.some(
        (s) => s.size === size && s.colour === colour,
      );
      variants.push({
        id: `gid://mock/ProductVariant/${input.handle}-${size}-${colour}`
          .toLowerCase()
          .replace(/\s+/g, "-"),
        title: `${size} / ${colour}`,
        availableForSale: !sold,
        quantityAvailable: sold ? 0 : low ? 3 : 25,
        sku: `TPC-${input.handle}-${size}-${colour}`
          .toUpperCase()
          .replace(/\s+/g, ""),
        selectedOptions: [
          { name: "Size", value: size },
          { name: "Colour", value: colour },
        ],
        price: money(input.price),
        compareAtPrice: input.compareAt ? money(input.compareAt) : null,
        image: null,
      });
    }
  }

  const amounts = variants.map((v) => Number(v.price.amount));
  const options = [
    { id: "opt-size", name: "Size", values: input.sizes },
    { id: "opt-colour", name: "Colour", values: input.colours },
  ];

  const details: ProductDetails = {
    fit: input.details.fit ?? null,
    fabric: input.details.fabric ?? null,
    care: input.details.care ?? null,
    story: input.details.story ?? null,
    modelInfo: input.details.modelInfo ?? null,
    sizeGuideHref: input.details.sizeGuideHref ?? "/pages/size-guide",
    launchDate: input.details.launchDate ?? null,
    limitedEdition: input.details.limitedEdition ?? false,
  };

  return {
    id: `gid://mock/Product/${input.handle}`,
    handle: input.handle,
    title: input.title,
    description: input.description,
    descriptionHtml: `<p>${input.description}</p>`,
    productType: input.productType,
    vendor: "The Pitlane Collective",
    tags: input.tags,
    gender: input.gender,
    badge: input.badge ?? null,
    availableForSale: variants.some((v) => v.availableForSale),
    featuredImage: img(input.images[0][0], input.images[0][1]),
    images: input.images.map(([h, alt]) => img(h, alt)),
    options,
    variants,
    priceRange: {
      minVariantPrice: money(Math.min(...amounts)),
      maxVariantPrice: money(Math.max(...amounts)),
    },
    details,
    seo: {
      title: input.title,
      description: input.description.slice(0, 155),
    },
    updatedAt: "2026-07-01T00:00:00.000Z",
    collectionHandles: input.collectionHandles,
  };
}

const TEE_SIZES = ["S", "M", "L", "XL", "XXL"];
const BABY_SIZES = ["XS", "S", "M", "L"];

const commonTeeDetails: Partial<ProductDetails> = {
  fit: "Oversized, boxy. Size down for a regular fit.",
  fabric: "240 GSM combed cotton.",
  care: "Machine wash cold, inside out. Do not tumble dry. Warm iron on reverse.",
  modelInfo: "Model is 6'0\" / 183cm, wearing size M.",
  limitedEdition: true,
};

const babyTeeDetails: Partial<ProductDetails> = {
  fit: "Fitted, cropped baby-tee cut. Size up for a relaxed fit.",
  fabric: "200 GSM stretch cotton rib.",
  care: "Machine wash cold. Reshape and dry flat. Do not tumble dry.",
  modelInfo: "Model is 5'6\" / 168cm, wearing size S.",
  limitedEdition: true,
};

const jerseyDetails: Partial<ProductDetails> = {
  fit: "Relaxed race-jersey cut. True to size.",
  fabric: "Breathable recycled poly mesh with a soft hand.",
  care: "Machine wash cold. Do not iron print. Hang to dry.",
  modelInfo: "Model is 5'11\" / 180cm, wearing size L.",
  limitedEdition: true,
};

export const mockProducts: MockProduct[] = [
  build({
    handle: "silver-arrows-oversized-tee",
    title: "Silver Arrows Oversized Tee",
    productType: "Oversized T-Shirt",
    gender: ["men", "women"],
    price: 1499,
    badge: "New",
    colours: ["Silver", "Black"],
    sizes: TEE_SIZES,
    soldOut: [{ size: "S", colour: "Silver" }],
    lowStock: [{ size: "XXL", colour: "Black" }],
    description:
      "A heavyweight oversized tee in brushed silver, built around a clean grid-livery graphic. Boxy through the body with a structured drop shoulder.",
    details: { ...commonTeeDetails, story: "Named for the silver era — stripped back to bare metal and reworked for the everyday rotation.", launchDate: "2026-07-01" },
    images: [
      ["silver-arrows-oversized-tee", "Silver Arrows Oversized Tee front"],
      ["silver-arrows-oversized-tee-back", "Silver Arrows Oversized Tee back"],
    ],
    collectionHandles: ["new-drop", "bestsellers", "oversized", "men", "women"],
    tags: ["oversized", "tee", "men", "women", "new"],
  }),
  build({
    handle: "rosso-racing-baby-tee",
    title: "Rosso Racing Baby Tee",
    productType: "Baby Tee",
    gender: ["women"],
    price: 999,
    badge: "Bestseller",
    colours: ["Rosso Red", "Cream"],
    sizes: BABY_SIZES,
    lowStock: [{ size: "XS", colour: "Rosso Red" }],
    description:
      "A fitted baby tee in deep rosso red with a compact chest crest. Cropped hem, ribbed neck, made to layer or stand alone.",
    details: { ...babyTeeDetails, story: "Rosso, but reworked — the red every tifosi knows, cut for the culture." },
    images: [
      ["rosso-racing-baby-tee", "Rosso Racing Baby Tee front"],
      ["rosso-racing-baby-tee-back", "Rosso Racing Baby Tee back"],
    ],
    collectionHandles: ["new-drop", "bestsellers", "baby-tees", "women"],
    tags: ["baby-tee", "women", "new", "bestseller"],
  }),
  build({
    handle: "papaya-grid-jersey",
    title: "Papaya Grid Jersey",
    productType: "Jersey",
    gender: ["men", "women"],
    price: 1999,
    badge: "Limited",
    colours: ["Papaya"],
    sizes: TEE_SIZES,
    description:
      "A breathable race jersey in unmistakable papaya, with a full-body grid pattern and a woven number tab at the hem.",
    details: { ...jerseyDetails, story: "Loud on purpose. The one colour on the grid you can spot from the back row." },
    images: [
      ["papaya-grid-jersey", "Papaya Grid Jersey front"],
      ["papaya-grid-jersey-back", "Papaya Grid Jersey back"],
    ],
    collectionHandles: ["new-drop", "jerseys", "men", "women"],
    tags: ["jersey", "men", "women", "new", "limited"],
  }),
  build({
    handle: "british-racing-green-oversized-tee",
    title: "British Racing Green Oversized Tee",
    productType: "Oversized T-Shirt",
    gender: ["men", "women"],
    price: 1499,
    colours: ["Racing Green"],
    sizes: TEE_SIZES,
    description:
      "Heritage British Racing Green on a heavyweight oversized body, with a subtle tonal wordmark. Understated, all season.",
    details: { ...commonTeeDetails, story: "The oldest colour in the sport, kept quiet on a modern oversized block." },
    images: [
      ["british-racing-green-oversized-tee", "British Racing Green Oversized Tee front"],
      ["british-racing-green-oversized-tee-back", "British Racing Green Oversized Tee back"],
    ],
    collectionHandles: ["oversized", "men", "women"],
    tags: ["oversized", "tee", "men", "women"],
  }),
  build({
    handle: "midnight-paddock-jersey",
    title: "Midnight Paddock Jersey",
    productType: "Jersey",
    gender: ["men", "women"],
    price: 1799,
    colours: ["Midnight"],
    sizes: TEE_SIZES,
    description:
      "A near-black race jersey with tonal navy panelling and a reflective hem detail — paddock energy after the lights go out.",
    details: jerseyDetails,
    images: [["midnight-paddock-jersey", "Midnight Paddock Jersey"]],
    collectionHandles: ["jerseys", "men", "women"],
    tags: ["jersey", "men", "women"],
  }),
  build({
    handle: "number-44-heritage-tee",
    title: "Number 44 Heritage Tee",
    productType: "Oversized T-Shirt",
    gender: ["men", "women"],
    price: 1299,
    badge: "Bestseller",
    colours: ["Black", "Cream"],
    sizes: TEE_SIZES,
    description:
      "An oversized heritage tee built around a bold number 44, screen-printed front and back. Clean, graphic, everyday.",
    details: { ...commonTeeDetails, story: "A number that means something. Set big, set once." },
    images: [
      ["number-44-heritage-tee", "Number 44 Heritage Tee front"],
      ["number-44-heritage-tee-back", "Number 44 Heritage Tee back"],
    ],
    collectionHandles: ["bestsellers", "oversized", "men", "women"],
    tags: ["oversized", "tee", "men", "women", "bestseller"],
  }),
  build({
    handle: "monza-tifosi-baby-tee",
    title: "Monza Tifosi Baby Tee",
    productType: "Baby Tee",
    gender: ["women"],
    price: 999,
    colours: ["Maroon"],
    sizes: BABY_SIZES,
    description:
      "A fitted baby tee in deep Monza maroon with a small temple-of-speed graphic. Cropped, ribbed, sharp.",
    details: babyTeeDetails,
    images: [["monza-tifosi-baby-tee", "Monza Tifosi Baby Tee"]],
    collectionHandles: ["baby-tees", "women"],
    tags: ["baby-tee", "women"],
  }),
  build({
    handle: "prancing-horse-oversized-tee",
    title: "Prancing Horse Oversized Tee",
    productType: "Oversized T-Shirt",
    gender: ["men", "women"],
    price: 1499,
    compareAt: 1799,
    badge: "Low Stock",
    colours: ["Racing Red"],
    sizes: TEE_SIZES,
    soldOut: [{ size: "S", colour: "Racing Red" }, { size: "M", colour: "Racing Red" }],
    lowStock: [{ size: "L", colour: "Racing Red" }],
    description:
      "A racing-red oversized tee with a tonal crest graphic. Heavyweight, boxy, and cut for the everyday.",
    details: { ...commonTeeDetails, story: "Reduced to a silhouette. You already know the horse." },
    images: [["prancing-horse-oversized-tee", "Prancing Horse Oversized Tee"]],
    collectionHandles: ["oversized", "men", "women"],
    tags: ["oversized", "tee", "men", "women", "sale"],
  }),
  build({
    handle: "grid-walk-jersey",
    title: "Grid Walk Jersey",
    productType: "Jersey",
    gender: ["men", "women"],
    price: 1799,
    colours: ["Steel Blue"],
    sizes: TEE_SIZES,
    description:
      "A steel-blue race jersey with a full grid-walk graphic down the side seam and a soft mesh hand.",
    details: jerseyDetails,
    images: [["grid-walk-jersey", "Grid Walk Jersey"]],
    collectionHandles: ["jerseys", "men", "women"],
    tags: ["jersey", "men", "women"],
  }),
  build({
    handle: "pole-position-baby-tee",
    title: "Pole Position Baby Tee",
    productType: "Baby Tee",
    gender: ["women"],
    price: 999,
    badge: "New",
    colours: ["Cream", "Black"],
    sizes: BABY_SIZES,
    description:
      "A cream baby tee with a minimal P1 marker at the chest. Fitted, cropped, and made to layer.",
    details: babyTeeDetails,
    images: [["pole-position-baby-tee", "Pole Position Baby Tee"]],
    collectionHandles: ["new-drop", "baby-tees", "women"],
    tags: ["baby-tee", "women", "new"],
  }),
  build({
    handle: "podium-oversized-tee",
    title: "Podium Oversized Tee",
    productType: "Oversized T-Shirt",
    gender: ["men", "women"],
    price: 1299,
    colours: ["Graphite"],
    sizes: TEE_SIZES,
    description:
      "A graphite oversized tee with a tonal podium-steps graphic across the back. Quiet, heavy, everyday.",
    details: commonTeeDetails,
    images: [["podium-oversized-tee", "Podium Oversized Tee"]],
    collectionHandles: ["oversized", "men", "women"],
    tags: ["oversized", "tee", "men", "women"],
  }),
  build({
    handle: "chequered-flag-jersey",
    title: "Chequered Flag Jersey",
    productType: "Jersey",
    gender: ["men", "women"],
    price: 1999,
    badge: "Limited",
    colours: ["Black/White"],
    sizes: TEE_SIZES,
    description:
      "A monochrome race jersey with a broken chequered-flag treatment and a woven finish tab. The one everybody's chasing.",
    details: { ...jerseyDetails, story: "The finish, reworked. Worn before the race is even run." },
    images: [["chequered-flag-jersey", "Chequered Flag Jersey"]],
    collectionHandles: ["new-drop", "jerseys", "men", "women"],
    tags: ["jersey", "men", "women", "new", "limited"],
  }),
];
