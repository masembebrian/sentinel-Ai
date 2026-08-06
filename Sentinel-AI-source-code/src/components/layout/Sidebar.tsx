import { NavLink } from "react-router-dom";
import { ChevronsLeft, Shield } from "lucide-react";
import { MODULES, MODULE_GROUPS, type ModuleMeta } from "../../modules/registry";
import { useUI } from "../../store/ui";
import { cn } from "../../lib/cn";
import { Tooltip } from "../ui/Tooltip";
import { Kbd } from "../ui/Kbd";

function NavItem({
  module,
  collapsed,
  onNavigate,
}: {
  module: ModuleMeta;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const Icon = module.icon;
  const link = (
    <NavLink
      to={module.route}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "group flex items-center gap-3 rounded-lg text-sm font-medium transition-colors duration-150",
          "hover:bg-surface-2 hover:text-foreground",
          isActive
            ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px] shadow-primary/20"
            : "text-muted",
          collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2",
        )
      }
    >
      <Icon className="size-[18px] shrink-0" aria-hidden="true" />
      {!collapsed && <span className="min-w-0 flex-1 truncate">{module.label}</span>}
      {!collapsed && module.shortcut && (
        <Kbd className="opacity-0 transition-opacity duration-150 group-hover:opacity-100">
          {module.shortcut.toUpperCase()}
        </Kbd>
      )}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip
        side="right"
        label={`${module.label}${module.shortcut ? ` (${module.shortcut.toUpperCase()})` : ""}`}
      >
        {link}
      </Tooltip>
    );
  }
  return link;
}

export function SidebarContent({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className={cn("flex items-center gap-3 px-4 pb-4 pt-5", collapsed && "justify-center px-2")}>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary to-accent text-on-primary shadow-glow-cyan">
          <Shield className="size-5" aria-hidden="true" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-heading text-sm font-bold tracking-[0.18em] text-foreground">
              SENTINEL<span className="text-primary">AI</span>
            </p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
              Cyber Defense Command
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav aria-label="Modules" className="flex-1 space-y-5 overflow-y-auto px-2 pb-4">
        {MODULE_GROUPS.map((group) => (
          <div key={group}>
            {!collapsed && (
              <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted/70">
                {group}
              </p>
            )}
            <ul className="space-y-0.5">
              {MODULES.filter((m) => m.group === group).map((m) => (
                <li key={m.id}>
                  <NavItem module={m} collapsed={collapsed} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className={cn("border-t border-border/60 px-4 py-3", collapsed && "px-2 text-center")}>
        {collapsed ? (
          <Tooltip side="right" label="System nominal">
            <div className="mx-auto size-2 rounded-full bg-success shadow-glow-cyan" aria-hidden="true" />
          </Tooltip>
        ) : (
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-success" aria-hidden="true" />
            System nominal · v0.1
          </div>
        )}
      </div>
    </div>
  );
}

export function Sidebar() {
  const collapsed = useUI((s) => s.sidebarCollapsed);
  const toggleSidebar = useUI((s) => s.toggleSidebar);

  return (
    <aside
      aria-label="Primary navigation"
      className={cn(
        "glass sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border/60 transition-[width] duration-200 ease-out lg:flex",
        collapsed ? "w-[72px]" : "w-64",
      )}
    >
      <SidebarContent collapsed={collapsed} />
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-16 z-10 flex size-6 cursor-pointer items-center justify-center rounded-full border border-border bg-surface-2 text-muted shadow-panel transition-colors duration-150 hover:text-foreground"
      >
        <ChevronsLeft
          className={cn("size-3.5 transition-transform duration-200", collapsed && "rotate-180")}
          aria-hidden="true"
        />
      </button>
    </aside>
  );
}
