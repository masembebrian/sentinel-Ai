import { useNavigate } from "react-router-dom";
import { ArrowLeft, Terminal } from "lucide-react";
import { Button } from "../components/ui/Button";
import { GlassPanel } from "../components/ui/GlassPanel";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6">
      <GlassPanel strong className="w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-xl bg-surface-2">
          <Terminal className="size-7 text-destructive" aria-hidden="true" />
        </div>

        <pre className="font-mono text-sm leading-relaxed">
          <span className="text-destructive">$</span>{" "}
          <span className="text-muted">route --resolve</span>
          <br />
          <span className="text-destructive">&gt;</span>{" "}
          <span className="text-warning">ERROR</span>:{" "}
          <span className="text-foreground">ROUTE_NOT_FOUND</span>
          <br />
          <span className="text-destructive">&gt;</span>{" "}
          <span className="text-muted">The requested command center module does not exist.</span>
        </pre>

        <Button
          variant="primary"
          className="mt-6"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> Return to Command Center
        </Button>
      </GlassPanel>
    </div>
  );
}