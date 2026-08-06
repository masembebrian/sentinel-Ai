import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export type BadgeVariant =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "destructive";

const styles: Record<BadgeVariant, string> = {
  neutral: "border-border bg-surface-2 text-muted",
  primary: "border-primary/30 bg-primary/15 text-primary",
  secondary: "border-secondary/30 bg-secondary/15 text-secondary",
  accent: "border-accent/30 bg-accent/15 text-accent",
  success: "border-success/30 bg-success/15 text-success",
  warning: "border-warning/30 bg-warning/15 text-warning",
  destructive: "border-destructive/30 bg-destructive/15 text-destructive",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ variant = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}
