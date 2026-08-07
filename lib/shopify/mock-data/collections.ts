import type { Collection } from "../types";

function img(handle: string, alt: string) {
  return {
    url: `/mock/collections/${handle}.svg`,
    altText: alt,
    width: 1400,
    height: 1000,
  };
}

const updatedAt = "2026-07-01T00:00:00.000Z";

export const mockCollections: Collection[] = [
  {
    id: "gid://mock/Collection/new-drop",
    handle: "new-drop",
    title: "New Drop",
    description:
      "The first release. Limited runs, no restocks guaranteed — the paddock was only the beginning.",
    image: img("new-drop", "New Drop collection"),
    seo: {
      title: "New Drop",
      description: "The first TPC release — limited motorsport-inspired apparel.",
    },
    updatedAt,
  },
  {
    id: "gid://mock/Collection/bestsellers",
    handle: "bestsellers",
    title: "Bestsellers",
    description: "The most-wanted pieces from the rotation.",
    image: img("bestsellers", "Bestsellers collection"),
    seo: {
      title: "Bestsellers",
      description: "TPC's most popular motorsport-inspired apparel.",
    },
    updatedAt,
  },
  {
    id: "gid://mock/Collection/oversized",
    handle: "oversized",
    title: "Oversized",
    description: "Boxy, heavyweight, everyday. Built for race weekends and every other day.",
    image: img("oversized", "Oversized collection"),
    seo: {
      title: "Oversized Tees",
      description: "Heavyweight oversized motorsport-inspired tees.",
    },
    updatedAt,
  },
  {
    id: "gid://mock/Collection/baby-tees",
    handle: "baby-tees",
    title: "Baby Tees",
    description: "Fitted, cropped, sharp. Track energy in an everyday form.",
    image: img("baby-tees", "Baby Tees collection"),
    seo: {
      title: "Baby Tees",
      description: "Fitted, cropped motorsport-inspired baby tees.",
    },
    updatedAt,
  },
  {
    id: "gid://mock/Collection/jerseys",
    handle: "jerseys",
    title: "Jerseys",
    description: "Paddock-issue, off the circuit. Made for the ones watching every lap.",
    image: img("jerseys", "Jerseys collection"),
    seo: {
      title: "Jerseys",
      description: "Motorsport-inspired jerseys for everyday rotation.",
    },
    updatedAt,
  },
  {
    id: "gid://mock/Collection/men",
    handle: "men",
    title: "Men",
    description: "Oversized tees and jerseys, built for the everyday rotation.",
    image: img("men", "Men's collection"),
    seo: { title: "Men", description: "Men's motorsport-inspired apparel." },
    updatedAt,
  },
  {
    id: "gid://mock/Collection/women",
    handle: "women",
    title: "Women",
    description: "Baby tees, oversized fits and jerseys for the everyday rotation.",
    image: img("women", "Women's collection"),
    seo: { title: "Women", description: "Women's motorsport-inspired apparel." },
    updatedAt,
  },
];
