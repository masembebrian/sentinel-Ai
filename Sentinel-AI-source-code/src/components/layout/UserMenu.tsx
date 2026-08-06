import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, UserRound, Loader2 } from "lucide-react";
import { useAuthContext } from "../auth/AuthContext";
import { useUI } from "../../store/ui";
import { cn } from "../../lib/cn";
import { Kbd } from "../ui/Kbd";

/**
 * User menu (role=menu) driven by real Supabase auth session.
 */
export function UserMenu() {
  const { user, signOut } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const setShortcutsHelpOpen = useUI((s) => s.setShortcutsHelpOpen);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        rootRef.current?.querySelector("button")?.focus();
      }
    };
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  const displayName = user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "Operator";
  const initials = displayName
    .split(/\s+/)
    .map((s: string) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    // Navigation to /login happens automatically via ProtectedRoute
  };

  if (!user) return null;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex cursor-pointer items-center gap-2 rounded-lg p-1.5 transition-colors duration-150 hover:bg-surface-2"
      >
        <span className="flex size-7 items-center justify-center rounded-full bg-linear-to-br from-secondary to-accent font-mono text-[11px] font-bold text-white">
          {initials}
        </span>
        <ChevronDown
          className={cn("size-3.5 text-muted transition-transform duration-150", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account"
          className="glass-strong absolute right-0 top-11 z-40 w-60 overflow-hidden rounded-xl p-1.5 shadow-panel"
        >
          <div className="border-b border-border/60 px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
            <p className="truncate font-mono text-[11px] text-muted">{user.email}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-primary">
              Session: Authenticated
            </p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              setShortcutsHelpOpen(true);
            }}
            className="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-foreground transition-colors duration-150 hover:bg-surface-2"
          >
            <span className="flex items-center gap-2">
              <UserRound className="size-4 text-muted" aria-hidden="true" /> Keyboard shortcuts
            </span>
            <Kbd>?</Kbd>
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-error transition-colors duration-150 hover:bg-error/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {signingOut ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <LogOut className="size-4" aria-hidden="true" />
            )}
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}