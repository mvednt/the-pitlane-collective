import Image from "next/image";
import { brandConfig } from "@/lib/config/site";

/**
 * TPC lockup: the accent tick followed by the supplied wordmark artwork
 * (public/brand/logo-lockup.png), exactly as the design file composes it.
 *
 * The artwork is bone + racing red, drawn for the dark canvas the whole
 * storefront now sits on, so there is a single variant. `variant` is kept on
 * the props for callers that still pass it; swap `brandConfig.logoOnLight` in
 * if a light surface is ever introduced.
 */

type Variant = "onDark" | "onLight";

export function Logo({
  variant = "onDark",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  const src =
    variant === "onLight" && brandConfig.logoOnLight
      ? brandConfig.logoOnLight
      : brandConfig.logoOnDark;

  return (
    <span className={`inline-flex items-center gap-3 sm:gap-4 ${className}`}>
      <span
        aria-hidden="true"
        className="block h-[22px] w-[5px] bg-accent sm:h-[26px]"
      />
      <Image
        src={src}
        alt="The Pitlane Collective"
        width={2216}
        height={289}
        priority
        className="block h-[13px] w-auto sm:h-[17px]"
      />
    </span>
  );
}
