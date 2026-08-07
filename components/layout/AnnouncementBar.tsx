"use client";

import { useEffect, useState } from "react";
import { announcements } from "@/lib/config/site";

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % announcements.length),
      4000,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="section-dark text-center">
      <p
        className="mx-auto max-w-6xl px-4 py-2 text-[0.7rem] font-medium uppercase tracking-[0.2em]"
        aria-live="polite"
      >
        {announcements[index]}
      </p>
    </div>
  );
}
