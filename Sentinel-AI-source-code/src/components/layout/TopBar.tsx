import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Activity, Cpu, Menu, MonitorPlay, Radio, Search, Volume2, VolumeX } from "lucide-react";
import { useUI } from "../../store/ui";
import { MODULES } from "../../modules/registry";
import { cn } from "../../lib/cn";
import { Tooltip } from "../ui/Tooltip";
import { UserMenu } from "./UserMenu";
import { Kbd } from "../ui/Kbd";

interface Metric {
  label: string;
  value: number;
  icon: typeof Cpu;
}

/**
 * Placeholder system metrics — gently fluctuating demo values.
 * The simulation engine task (P2) replaces these with live derived selectors.
 */
function SystemMetrics({ paused }: { paused: boolean }) {
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: "CPU", value: 24, icon: Cpu },
    { label: "MEM", value: 41, icon: Activity },
    { label: "NET", value: 18, icon: Radio },
  ]);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setMetrics((prev) =>
        prev.map((m) => ({
          ...m,
          value: Math.min(97, Math.max(4, m.value + (Math.random() - 0.5) * 14)),
        })),
      );
    }, 2200);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <div className="hidden items-center gap-4 md:flex" aria-hidden="true">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div key={m.label} className="flex items-center gap-1.5">
            <Icon className="size-3.5 text-muted" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
              {m.label}{" "}
              <span className="tabular-nums text-foreground">{Math.round(m.value)}%</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ThreatStatus() {
  return (
    <div
      className="flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1"
      aria-label="Threat level nominal"
    >
      <span className="size-1.5 animate-pulse-dot rounded-full bg-success" aria-hidden="true" />
      <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-success">
        Threat Level: Nominal
      </span>
    </div>
  );
}

export function TopBar() {
  const location = useLocation();
  const { setCommandPaletteOpen, setMobileNavOpen, toggleSound, toggleBackground, soundEnabled, backgroundEnabled } =
    useUI();

  const current = MODULES.find((m) => m.route === location.pathname);

  return (
    <header className="glass sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 px-3 sm:px-5">
      {/* Mobile nav trigger */}
      <button
        type="button"
        onClick={() => setMobileNavOpen(true)}
        aria-label="Open navigation menu"
        className="cursor-pointer rounded-lg p-2 text-muted transition-colors duration-150 hover:bg-surface-2 hover:text-foreground lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      {/* Page title / breadcrumb */}
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
          Command Center <span className="text-border">/</span>{" "}
          <span className="text-foreground">{current?.label ?? "Overview"}</span>
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <ThreatStatus />
        <SystemMetrics paused={false} />

        {/* Search / palette trigger */}
        <Tooltip side="bottom" label="Command palette">
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            aria-label="Open command palette"
            className="hidden h-9 cursor-pointer items-center gap-2 rounded-lg border border-border bg-background/50 px-3 text-muted transition-colors duration-150 hover:border-primary/40 hover:text-foreground sm:flex"
          >
            <Search className="size-4" aria-hidden="true" />
            <span className="text-xs">Search…</span>
            <Kbd>⌘K</Kbd>
          </button>
        </Tooltip>
        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          aria-label="Open command palette"
          className="cursor-pointer rounded-lg p-2 text-muted transition-colors duration-150 hover:bg-surface-2 hover:text-foreground sm:hidden"
        >
          <Search className="size-5" aria-hidden="true" />
        </button>

        {/* Background toggle */}
        <Tooltip side="bottom" label={backgroundEnabled ? "Disable animated background" : "Enable animated background"}>
          <button
            type="button"
            onClick={toggleBackground}
            aria-pressed={backgroundEnabled}
            aria-label="Toggle animated background"
            className={cn(
              "cursor-pointer rounded-lg p-2 transition-colors duration-150 hover:bg-surface-2",
              backgroundEnabled ? "text-primary" : "text-muted",
            )}
          >
            <MonitorPlay className="size-[18px]" aria-hidden="true" />
          </button>
        </Tooltip>

        {/* Sound toggle */}
        <Tooltip side="bottom" label={soundEnabled ? "Mute sounds (M)" : "Enable sounds (M)"}>
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={soundEnabled}
            aria-label="Toggle sounds"
            className={cn(
              "cursor-pointer rounded-lg p-2 transition-colors duration-150 hover:bg-surface-2",
              soundEnabled ? "text-primary" : "text-muted",
            )}
          >
            {soundEnabled ? (
              <Volume2 className="size-[18px]" aria-hidden="true" />
            ) : (
              <VolumeX className="size-[18px]" aria-hidden="true" />
            )}
          </button>
        </Tooltip>

        <div className="h-6 w-px bg-border/70" aria-hidden="true" />
        <UserMenu />
      </div>
    </header>
  );
}
