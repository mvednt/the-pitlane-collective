import Image from "next/image";
import { brandConfig } from "@/lib/config/site";

/**
 * TPC wordmark.
 *
 * By default this renders a typographic placeholder that matches the supplied
 * wordmark composition. When you have your own logo files:
 *   1. Drop them at public/brand/logo-dark.svg and public/brand/logo-light.svg
 *      (.png also fine — update the paths in lib/config/site.ts › brandConfig).
 *   2. Set brandConfig.useLogoFiles = true in lib/config/site.ts.
 * (Client-safe: no filesystem access, so it works inside the client Header.)
 */

type Variant = "onDark" | "onLight";

export function Logo({
  variant = "onLight",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  if (brandConfig.useLogoFiles) {
    const src =
      variant === "onDark"
        ? brandConfig.logoOnDark
        : brandConfig.logoOnLight;
    return (
      <span className={`inline-flex items-center ${className}`}>
        <Image
          src={src}
          alt="The Pitlane Collective"
          width={220}
          height={36}
          priority
          className="h-6 w-auto"
        />
      </span>
    );
  }

  const wordmarkColor = variant === "onDark" ? "text-tpc-cream" : "text-tpc-black";
  const divider = variant === "onDark" ? "bg-tpc-cream/40" : "bg-tpc-black/25";

  return (
    <span
      className={`inline-flex items-center gap-2 ${className}`}
      aria-label="The Pitlane Collective"
    >
      <span className={`text-[0.6rem] font-medium tracking-[0.35em] ${wordmarkColor}`}>
        THE
      </span>
      <span className={`h-4 w-px ${divider}`} aria-hidden="true" />
      <span className={`font-display text-lg leading-none tracking-tight ${wordmarkColor}`}>
        PITLANE
      </span>
      <span className={`h-4 w-px ${divider}`} aria-hidden="true" />
      <span className="text-[0.6rem] font-semibold tracking-[0.3em] text-accent">
        COLLECTIVE
      </span>
    </span>
  );
}
