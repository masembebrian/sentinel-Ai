import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  strong?: boolean;
  glow?: "cyan" | "purple" | "red" | "none";
}

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(function GlassPanel(
  { strong = false, glow = "none", className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        strong ? "glass-strong" : "glass",
        "rounded-xl",
        glow === "cyan" && "shadow-glow-cyan",
        glow === "purple" && "shadow-glow-purple",
        glow === "red" && "shadow-glow-red",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
