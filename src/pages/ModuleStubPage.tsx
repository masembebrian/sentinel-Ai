import type { LucideIcon } from "lucide-react";
import { Clock } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { GlassPanel } from "../components/ui/GlassPanel";
import { Badge } from "../components/ui/Badge";
import type { ModuleMeta } from "../modules/registry";

export interface ModuleStubPageProps {
  module: ModuleMeta;
}

export function ModuleStubPage({ module }: ModuleStubPageProps) {
  const Icon = module.icon;

  return (
    <div className="space-y-6">
      <PageHeader
        title={module.label}
        subtitle={module.description}
        icon={<Icon className="size-6" aria-hidden="true" />}
      />

      <GlassPanel strong className="flex flex-col items-center p-12 text-center">
        <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-surface-2">
          <Icon className="size-8 text-muted/60" aria-hidden="true" />
        </div>
        <h2 className="font-heading text-lg font-bold text-foreground">Module Offline</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted">
          <strong className="text-foreground">{module.label}</strong> is planned for build phase{" "}
          <Badge variant="primary">{module.phase}</Badge>.
          Once the shared simulation engine is online, this module will stream live data from the
          same event source that powers every other screen.
        </p>
      </GlassPanel>

      <GlassPanel className="p-5">
        <div className="flex items-center gap-2 text-muted">
          <Clock className="size-4" aria-hidden="true" />
          <p className="font-mono text-[11px]">
            This module will initialise when the shared simulation engine and its specific feature
            implementation tasks are completed.
          </p>
        </div>
      </GlassPanel>
    </div>
  );
}

/**
 * Standalone page for a module that also renders from route params.
 * Used by the * (catch-all) route to provide a fallback.
 */
export function GenericModuleStub({ id, label, Icon }: { id: string; label: string; Icon: LucideIcon }) {
  return (
    <div className="space-y-6">
      <PageHeader title={label} icon={<Icon className="size-6" aria-hidden="true" />} />

      <GlassPanel strong className="flex flex-col items-center py-16 text-center">
        <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-surface-2">
          <Icon className="size-8 text-muted/60" aria-hidden="true" />
        </div>
        <h2 className="font-heading text-lg font-bold text-foreground">{label}</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
          Module <span className="font-mono">{id}</span> is not yet implemented. It will be built in a
          future phase.
        </p>
      </GlassPanel>
    </div>
  );
}