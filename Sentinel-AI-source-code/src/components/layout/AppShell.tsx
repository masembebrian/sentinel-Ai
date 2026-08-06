import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useUI } from "../../store/ui";
import { MODULES } from "../../modules/registry";
import { setSoundEnabled } from "../../lib/sound";
import { SkipLink } from "../ui/SkipLink";
import { Toaster } from "../ui/Toaster";
import { CyberBackground } from "../background/CyberBackground";
import { Sidebar, SidebarContent } from "./Sidebar";
import { TopBar } from "./TopBar";
import { CommandPalette } from "./CommandPalette";
import { ShortcutsHelp } from "./ShortcutsHelp";

export function AppShell() {
  const navigate = useNavigate();
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    setShortcutsHelpOpen,
    toggleSound,
    soundEnabled,
    mobileNavOpen,
    setMobileNavOpen,
  } = useUI();

  // Keep the sound module in sync with the UI store
  useEffect(() => {
    setSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  // Global keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      // ⌘K / Ctrl+K — toggle palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
        return;
      }

      if (isTyping || e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key) {
        case "?":
          setShortcutsHelpOpen(true);
          break;
        case "m":
        case "M":
          toggleSound();
          break;
        default: {
          const mod = MODULES.find((m) => m.shortcut === e.key.toLowerCase());
          if (mod) {
            e.preventDefault();
            navigate(mod.route);
          }
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navigate, commandPaletteOpen, setCommandPaletteOpen, setShortcutsHelpOpen, toggleSound]);

  return (
    <div className="relative min-h-screen">
      <CyberBackground />
      <SkipLink />

      <div className="flex min-h-screen">
        <Sidebar />

        {/* Main content area */}
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 outline-none sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile navigation drawer + scrim */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              key="scrim"
              aria-hidden="true"
              className="fixed inset-0 z-40 bg-black/70 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.aside
              key="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
              className="glass-strong fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border/60 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
            >
              <div className="flex justify-end px-3 pt-3">
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Close navigation"
                  className="cursor-pointer rounded-lg p-2 text-muted transition-colors duration-150 hover:bg-surface-2 hover:text-foreground"
                >
                  <X className="size-5" />
                </button>
              </div>
              <SidebarContent collapsed={false} onNavigate={() => setMobileNavOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <CommandPalette />
      <ShortcutsHelp />
      <Toaster />
    </div>
  );
}