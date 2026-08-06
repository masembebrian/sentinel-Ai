import { create } from "zustand";

const PREFS_KEY = "sentinel:ui-preferences";

export interface UIPreferences {
  sidebarCollapsed: boolean;
  backgroundEnabled: boolean;
  soundEnabled: boolean;
  reduceMotion: boolean;
}

const DEFAULTS: UIPreferences = {
  sidebarCollapsed: false,
  backgroundEnabled: true,
  soundEnabled: false, // sounds muted by default (PRD)
  reduceMotion: false,
};

function loadPrefs(): UIPreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<UIPreferences>;
      return { ...DEFAULTS, ...parsed };
    }
  } catch {
    /* corrupted prefs — fall back to defaults */
  }
  return DEFAULTS;
}

function persist(prefs: UIPreferences) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    /* storage unavailable (private mode) — ignore */
  }
}

interface UIState extends UIPreferences {
  mobileNavOpen: boolean;
  commandPaletteOpen: boolean;
  shortcutsHelpOpen: boolean;
  toggleSidebar: () => void;
  setMobileNavOpen: (open: boolean) => void;
  toggleBackground: () => void;
  toggleSound: () => void;
  setReduceMotion: (value: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setShortcutsHelpOpen: (open: boolean) => void;
}

export const useUI = create<UIState>()((set) => ({
  ...loadPrefs(),
  mobileNavOpen: false,
  commandPaletteOpen: false,
  shortcutsHelpOpen: false,

  toggleSidebar: () =>
    set((s) => {
      const sidebarCollapsed = !s.sidebarCollapsed;
      persist({ ...s, sidebarCollapsed });
      return { sidebarCollapsed };
    }),

  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),

  toggleBackground: () =>
    set((s) => {
      const backgroundEnabled = !s.backgroundEnabled;
      persist({ ...s, backgroundEnabled });
      return { backgroundEnabled };
    }),

  toggleSound: () =>
    set((s) => {
      const soundEnabled = !s.soundEnabled;
      persist({ ...s, soundEnabled });
      return { soundEnabled };
    }),

  setReduceMotion: (reduceMotion) =>
    set((s) => {
      persist({ ...s, reduceMotion });
      return { reduceMotion };
    }),

  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
  setShortcutsHelpOpen: (shortcutsHelpOpen) => set({ shortcutsHelpOpen }),
}));
