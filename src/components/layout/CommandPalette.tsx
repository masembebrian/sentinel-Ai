import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useUI } from "../../store/ui";
import { MODULES, type ModuleMeta } from "../../modules/registry";
import { cn } from "../../lib/cn";
import { Modal } from "../ui/Modal";
import { Kbd } from "../ui/Kbd";
import { playSound } from "../../lib/sound";

interface Command {
  id: string;
  label: string;
  description: string;
  action: () => void;
  keywords: string[];
  shortcut?: string;
}

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, toggleBackground, toggleSound, setShortcutsHelpOpen } = useUI();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const commands: Command[] = [
    ...MODULES.map((m: ModuleMeta) => ({
      id: `nav-${m.id}`,
      label: `Go to ${m.label}`,
      description: m.description,
      keywords: [m.label, ...m.keywords, m.route],
      shortcut: m.shortcut?.toUpperCase(),
      action: () => {
        navigate(m.route);
        setCommandPaletteOpen(false);
        playSound("select");
      },
    })),
    {
      id: "toggle-bg",
      label: "Toggle animated background",
      description: "Enable or disable the matrix rain and particle background",
      keywords: ["background", "matrix", "particles", "toggle", "cyber"],
      action: () => {
        toggleBackground();
        playSound("select");
      },
    },
    {
      id: "toggle-sound",
      label: "Toggle sounds",
      description: "Enable or disable UI sound effects",
      keywords: ["sound", "audio", "mute", "volume", "toggle"],
      shortcut: "M",
      action: () => {
        toggleSound();
        playSound("select");
      },
    },
    {
      id: "shortcuts-help",
      label: "Keyboard shortcuts",
      description: "View all available keyboard shortcuts",
      keywords: ["shortcuts", "keys", "hotkeys", "help"],
      shortcut: "?",
      action: () => {
        setShortcutsHelpOpen(true);
        setCommandPaletteOpen(false);
      },
    },
  ];

  const results = query.trim()
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.keywords.some((k) => k.toLowerCase().includes(query.toLowerCase())),
      )
    : commands;

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const execute = useCallback(
    (index: number) => {
      if (results[index]) {
        results[index].action();
      }
    },
    [results],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      execute(activeIndex);
    }
  };

  return (
    <Modal
      open={commandPaletteOpen}
      onClose={() => setCommandPaletteOpen(false)}
      title="Command Palette"
      size="md"
      initialFocusRef={inputRef}
    >
      <div>
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            aria-activedescendant={`cmd-${activeIndex}`}
            placeholder="Search modules and actions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            className="h-10 w-full rounded-lg border border-border bg-background/60 pl-9 pr-3.5 text-sm text-foreground placeholder:text-muted/70 outline-none transition-colors duration-150 focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {results.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">No results for &ldquo;{query}&rdquo;</p>
        ) : (
          <ul role="listbox" aria-label="Commands" className="max-h-72 space-y-0.5 overflow-y-auto">
            {results.map((cmd, i) => (
              <li
                key={cmd.id}
                id={`cmd-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                onClick={() => execute(i)}
                onMouseEnter={() => setActiveIndex(i)}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors duration-100",
                  i === activeIndex
                    ? "bg-primary/15 text-primary"
                    : "text-foreground hover:bg-surface-2",
                )}
              >
                <div>
                  <p className="font-medium">{cmd.label}</p>
                  <p className="mt-0.5 text-xs text-muted">{cmd.description}</p>
                </div>
                {cmd.shortcut && <Kbd>{cmd.shortcut}</Kbd>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}