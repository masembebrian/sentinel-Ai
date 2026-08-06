import { useUI } from "../../store/ui";
import { Modal } from "../ui/Modal";
import { Kbd } from "../ui/Kbd";

const SHORTCUTS = [
  { keys: ["⌘K"], description: "Open command palette" },
  { keys: ["?"], description: "Show keyboard shortcuts" },
  { keys: ["D"], description: "Go to SOC Dashboard" },
  { keys: ["G"], description: "Go to Threat Intelligence" },
  { keys: ["A"], description: "Go to AI Analyst" },
  { keys: ["1–9"], description: "Navigate modules 1–9 by order" },
  { keys: ["M"], description: "Toggle sound effects" },
];

export function ShortcutsHelp() {
  const { shortcutsHelpOpen, setShortcutsHelpOpen } = useUI();

  return (
    <Modal open={shortcutsHelpOpen} onClose={() => setShortcutsHelpOpen(false)} title="Keyboard Shortcuts" size="sm">
      <div className="space-y-3">
        {SHORTCUTS.map((s, i) => (
          <div key={i} className="flex items-center justify-between">
            <span className="text-sm text-foreground">{s.description}</span>
            <div className="flex items-center gap-1">
              {s.keys.map((k, j) => (
                <span key={j} className="flex items-center gap-1">
                  {j > 0 && <span className="text-muted">+</span>}
                  <Kbd>{k}</Kbd>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}