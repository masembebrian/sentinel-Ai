import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useToasts, type ToastVariant } from "../../store/toast";
import { cn } from "../../lib/cn";

const ICONS: Record<ToastVariant, typeof Info> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};

const COLORS: Record<ToastVariant, string> = {
  info: "text-secondary",
  success: "text-success",
  warning: "text-warning",
  error: "text-destructive",
};

export function Toaster() {
  const { toasts, dismiss } = useToasts();

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[60] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.variant];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 24, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.96 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="glass-strong flex items-start gap-3 rounded-xl p-3.5 shadow-panel"
            >
              <Icon className={cn("mt-0.5 size-4 shrink-0", COLORS[t.variant])} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{t.title}</p>
                {t.message && <p className="mt-0.5 text-xs text-muted">{t.message}</p>}
              </div>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="cursor-pointer rounded p-0.5 text-muted transition-colors duration-150 hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
