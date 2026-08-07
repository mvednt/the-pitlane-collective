import assert from "node:assert/strict";
import { test } from "node:test";
import {
  productMatchesQuery,
  rankBySearchRelevance,
  tokenize,
} from "../lib/search/match.ts";
import { makeProduct } from "./fixtures.ts";

test("tokenize splits and lowercases", () => {
  assert.deepEqual(tokenize("  Black  Oversized "), ["black", "oversized"]);
  assert.deepEqual(tokenize(""), []);
});

test("matches on title, type, colour and gender (AND across tokens)", () => {
  const p = makeProduct({
    title: "Silver Arrows Oversized Tee",
    productType: "Oversized T-Shirt",
    gender: ["men"],
    tags: ["new"],
    options: [
      { id: "o1", name: "Size", values: ["S", "M"] },
      { id: "o2", name: "Colour", values: ["Black", "Silver"] },
    ],
  });

  assert.equal(productMatchesQuery(p, "silver"), true);
  assert.equal(productMatchesQuery(p, "black oversized"), true); // colour + type
  assert.equal(productMatchesQuery(p, "oversized men"), true); // type + gender
  assert.equal(productMatchesQuery(p, "jersey"), false); // no match
  assert.equal(productMatchesQuery(p, "black jersey"), false); // one token fails
});

test("empty query never matches", () => {
  assert.equal(productMatchesQuery(makeProduct(), "   "), false);
});

test("ranking surfaces exact/prefix title and available items first", () => {
  const exact = makeProduct({ handle: "a", title: "Jersey" });
  const prefix = makeProduct({ handle: "b", title: "Jersey Away" });
  const soldOut = makeProduct({
    handle: "c",
    title: "Retro Jersey",
    availableForSale: false,
  });

  const ranked = rankBySearchRelevance([soldOut, prefix, exact], "jersey");
  assert.deepEqual(
    ranked.map((p) => p.handle),
    ["a", "b", "c"],
  );
});
