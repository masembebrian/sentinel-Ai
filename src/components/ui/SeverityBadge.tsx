import { cn } from "../../lib/cn";

export type Severity = "info" | "low" | "medium" | "high" | "critical";

const LABELS: Record<Severity, string> = {
  info: "Info",
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const CHIP: Record<Severity, string> = {
  info: "border-border bg-surface-2 text-muted",
  low: "border-success/30 bg-success/10 text-success",
  medium: "border-warning/30 bg-warning/10 text-warning",
  high: "border-danger/30 bg-danger/10 text-danger",
  critical: "border-destructive/30 bg-destructive/10 text-destructive",
};

const DOT: Record<Severity, string> = {
  info: "bg-muted",
  low: "bg-success",
  medium: "bg-warning",
  high: "bg-danger",
  critical: "bg-destructive",
};

export interface SeverityBadgeProps {
  severity: Severity;
  withDot?: boolean;
  className?: string;
}

export function SeverityBadge({ severity, withDot = true, className }: SeverityBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        CHIP[severity],
        className,
      )}
    >
      {withDot && (
        <span
          aria-hidden="true"
          className={cn(
            "size-1.5 rounded-full",
            DOT[severity],
            severity === "critical" && "animate-pulse-dot",
          )}
        />
      )}
      {LABELS[severity]}
    </span>
  );
}
