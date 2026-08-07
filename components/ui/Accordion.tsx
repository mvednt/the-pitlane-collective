"use client";

import { useId, useState } from "react";

export function Accordion({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className="border-b border-border">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold"
        >
          {title}
          <span
            aria-hidden="true"
            className={`ml-4 text-lg leading-none transition-transform ${open ? "rotate-45" : ""}`}
          >
            +
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!open}
        className="pb-4 text-sm leading-relaxed text-foreground/70"
      >
        {children}
      </div>
    </div>
  );
}
