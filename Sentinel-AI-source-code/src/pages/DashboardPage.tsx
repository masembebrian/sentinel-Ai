import { Activity, Bolt, Shield, ShieldAlert } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { GlassPanel } from "../components/ui/GlassPanel";
import { StatCounter } from "../components/ui/StatCounter";
import { SeverityBadge } from "../components/ui/SeverityBadge";
import { Badge } from "../components/ui/Badge";

/**
 * SOC Dashboard stub — demonstrates the design system with placeholder metrics.
 * The live simulation engine (P2) replaces all values with derived engine selectors.
 */
export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="SOC Dashboard"
        subtitle="Command overview — all values will stream from the simulation engine in P2."
        icon={<Activity className="size-6" aria-hidden="true" />}
        actions={
          <Badge variant="neutral" className="text-[10px]">
            Engine: Pending
          </Badge>
        }
      />

      {/* KPI stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {([
          { label: "Total Events", value: 2847, icon: Activity, color: "text-secondary", glow: "cyan" as const },
          { label: "Critical Alerts", value: 3, icon: ShieldAlert, color: "text-destructive", glow: "red" as const },
          { label: "Threats Neutralized", value: 127, icon: Shield, color: "text-success", glow: "cyan" as const },
          { label: "Security Score", value: 86, icon: Bolt, color: "text-primary", glow: "cyan" as const, suffix: "%" },
        ] as Array<{ label: string; value: number; icon: typeof Activity; color: string; glow: "cyan" | "red"; suffix?: string }>).map((kpi) => (
          <GlassPanel key={kpi.label} glow={kpi.glow} className="flex items-center gap-4 p-5">
            <div className={`${kpi.color} rounded-xl bg-background/40 p-2.5`}>
              <kpi.icon className="size-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted">{kpi.label}</p>
              <p className={`text-2xl font-bold tracking-tight ${kpi.color}`}>
                <StatCounter value={kpi.value} suffix={kpi.suffix ?? ""} duration={0.8} />
              </p>
            </div>
          </GlassPanel>
        ))}
      </div>

      {/* Severity legend */}
      <GlassPanel className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-xs font-medium uppercase tracking-widest text-muted">Severity</span>
          <SeverityBadge severity="info" />
          <SeverityBadge severity="low" />
          <SeverityBadge severity="medium" />
          <SeverityBadge severity="high" />
          <SeverityBadge severity="critical" />
        </div>
      </GlassPanel>

      {/* Engine status + placeholder content */}
      <GlassPanel strong glow="purple" className="p-8 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-surface-2">
          <Activity className="size-7 text-muted" aria-hidden="true" />
        </div>
        <h2 className="font-heading text-lg font-bold text-foreground">Simulation Engine Offline</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
          The live simulation engine — a single shared event stream consumed by every module —
          initializes in the next build phase. All telemetry in this console is powered by that
          central engine. Every alert, packet, graph, and score flows from the same source.
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <Badge variant="warning">Engine: P1</Badge>
          <Badge variant="neutral">Dashboard: P2</Badge>
        </div>
      </GlassPanel>

      {/* Placeholder grid showing UI kit */}
      <div className="grid gap-4 sm:grid-cols-2">
        <GlassPanel className="p-5">
          <p className="mb-3 font-heading text-sm font-bold uppercase tracking-widest text-muted">
            Activity Timeline
          </p>
          <p className="text-xs text-muted">
            A streaming timeline of security events will render here, sourced from the engine.
          </p>
        </GlassPanel>
        <GlassPanel className="p-5">
          <p className="mb-3 font-heading text-sm font-bold uppercase tracking-widest text-muted">
            Alert Feed
          </p>
          <p className="text-xs text-muted">
            Real-time alert feed with severity indicators, live updates and pulse animations.
          </p>
        </GlassPanel>
      </div>
    </div>
  );
}