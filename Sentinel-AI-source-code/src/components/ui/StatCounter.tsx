import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { cn } from "../../lib/cn";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

export interface StatCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/** Animated number ticker. Jumps instantly when the user prefers reduced motion. */
export function StatCounter({
  value,
  duration = 0.9,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: StatCounterProps) {
  const reduce = usePrefersReducedMotion();
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      prev.current = value;
      return;
    }
    const controls = animate(prev.current, value, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, duration, reduce]);

  const formatted = display.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={cn("tabular-nums", className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
