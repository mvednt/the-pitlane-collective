import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import type { Product } from "@/lib/shopify/types";

/**
 * PDP information accordions, sourced from product.details (Shopify metafields
 * in live mode). Groups that have no data are omitted. Shipping & returns copy
 * is editable placeholder pending final policy.
 */
export function ProductAccordions({ product }: { product: Product }) {
  const { details } = product;

  return (
    <div className="mt-8">
      <Accordion title="Product details" defaultOpen>
        <p>{product.description}</p>
        {details.story ? <p className="mt-3">{details.story}</p> : null}
        {details.limitedEdition ? (
          <p className="mt-3 font-medium text-foreground">
            Limited run. No restocks guaranteed.
          </p>
        ) : null}
      </Accordion>

      {details.fabric || details.care ? (
        <Accordion title="Fabric &amp; care">
          {details.fabric ? <p>{details.fabric}</p> : null}
          {details.care ? <p className="mt-2">{details.care}</p> : null}
        </Accordion>
      ) : null}

      {details.fit || details.modelInfo ? (
        <Accordion title="Fit &amp; model">
          {details.fit ? <p>{details.fit}</p> : null}
          {details.modelInfo ? (
            <p className="mt-2 text-muted">{details.modelInfo}</p>
          ) : null}
        </Accordion>
      ) : null}

      <Accordion title="Shipping &amp; returns">
        <p>
          Shipped across India. Free shipping on orders above ₹1,999. Prepaid and
          COD available at checkout.
        </p>
        <p className="mt-2">
          Easy size exchanges — see our{" "}
          <Link href="/pages/returns" className="underline underline-offset-2">
            returns &amp; exchanges
          </Link>{" "}
          policy. Timelines are indicative and pending final logistics
          confirmation.
        </p>
      </Accordion>
    </div>
  );
}
