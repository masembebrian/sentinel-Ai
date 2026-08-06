import { useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface TooltipProps {
  label: string;
  children: ReactNode;
  side?: "top" | "right" | "bottom";
  className?: string;
}

/** Lightweight hover/focus tooltip. Trigger must itself be keyboard-focusable. */
export function Tooltip({ label, children, side = "top", className }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-40 whitespace-nowrap rounded-md border border-border bg-surface-2 px-2 py-1 text-[11px] font-medium text-foreground shadow-panel",
          "transition-all duration-150 ease-out",
          side === "top" && "bottom-full left-1/2 mb-1.5 -translate-x-1/2",
          side === "right" && "left-full top-1/2 ml-1.5 -translate-y-1/2",
          side === "bottom" && "top-full left-1/2 mt-1.5 -translate-x-1/2",
          visible ? "opacity-100" : "opacity-0",
        )}
      >
        {label}
      </span>
    </span>
  );
}
