import { useEffect, useState } from "react";

/** Tracks the OS-level `prefers-reduced-motion` setting, live. */
export function usePrefersReducedMotion(): boolean {
  const [prefers, setPrefers] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefers(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return prefers;
}
