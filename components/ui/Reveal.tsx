"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Scroll-reveal wrapper from the design file: the section starts displaced
 * (see `[data-reveal]` in globals.css) and is released once it reaches the
 * viewport.
 *
 * The check is a plain rect test on mount + scroll rather than an
 * IntersectionObserver: it runs synchronously on the first frame, so a section
 * that is already on screen — or one in a tab where observer callbacks are
 * throttled — is never left hidden. Under prefers-reduced-motion the CSS
 * neutralises both states.
 */
export function Reveal({
  as: Tag = "div",
  className,
  id,
  children,
}: {
  as?: ElementType;
  className?: string;
  id?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let done = false;
    const check = () => {
      if (done) return;
      const rect = el.getBoundingClientRect();
      const trigger = window.innerHeight * 0.88; // the design's -12% margin
      if (rect.top < trigger && rect.bottom > 0) {
        done = true;
        el.setAttribute("data-revealed", "");
        window.removeEventListener("scroll", check);
        window.removeEventListener("resize", check);
      }
    };

    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <Tag ref={ref} id={id} data-reveal="" className={className}>
      {children}
    </Tag>
  );
}
