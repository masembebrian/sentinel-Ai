import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Loader2, Shield, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuthContext } from "../components/auth/AuthContext";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { CyberBackground } from "../components/background/CyberBackground";
import { GlassPanel } from "../components/ui/GlassPanel";

type Mode = "sign-in" | "sign-up";
type Status = "idle" | "loading" | "confirm-email" | "error";

/**
 * Cinematic landing / login page with sign-in and sign-up modes.
 */
export function LoginPage() {
  const { signIn, signUp } = useAuthContext();

  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const isValid =
    email.trim().length > 0 &&
    password.length >= 6;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setStatus("loading");
    setMessage("");

    const action = mode === "sign-in" ? signIn : signUp;
    const { error } = await action(email.trim().toLowerCase(), password);

    if (error) {
      setStatus("error");
      setMessage(friendlyError(error));
      return;
    }

    if (mode === "sign-up") {
      setStatus("confirm-email");
      setMessage("Verification link sent. Check your inbox.");
    } else {
      // sign-in — route guard will redirect to /dashboard automatically
    }
  };

  const switchMode = () => {
    setMode((m) => (m === "sign-in" ? "sign-up" : "sign-in"));
    setStatus("idle");
    setMessage("");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <CyberBackground />

      <div className="relative z-10 w-full max-w-md">
        <GlassPanel strong className="p-8 text-center sm:p-10">
          {/* Logo */}
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-accent text-on-primary shadow-glow-cyan">
            <Shield className="size-7" aria-hidden="true" />
          </div>

          <h1 className="font-heading text-2xl font-bold tracking-widest text-foreground">
            SENTINEL<span className="text-primary">AI</span>
          </h1>
          <p className="mb-1 mt-1 text-sm text-muted">Autonomous Cyber Defense Command</p>

          <div className="mb-6 flex items-center justify-center gap-2">
            <Badge variant="secondary" className="text-[10px]">
              v0.1 — Classified Access
            </Badge>
          </div>

          {/* Status banner */}
          {status === "confirm-email" && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2.5 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-left"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
              <p className="text-sm text-success">{message}</p>
            </div>
          )}
          {status === "error" && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2.5 rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-left"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-error" aria-hidden="true" />
              <p className="text-sm text-error">{message}</p>
            </div>
          )}

          {/* Auth form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted">
                Email
              </span>
              <Input
                type="email"
                placeholder="operator@defense.local"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete={mode === "sign-up" ? "email" : "username"}
                required
                disabled={status === "loading"}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted">
                Password
              </span>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
                  minLength={6}
                  required
                  disabled={status === "loading"}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-muted transition-colors hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                </button>
              </div>
              <p className="mt-1 text-[11px] text-muted">Minimum 6 characters</p>
            </label>

            <Button variant="primary" size="lg" className="mt-2 w-full" disabled={!isValid || status === "loading"} type="submit">
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
                  Authenticating&hellip;
                </>
              ) : mode === "sign-in" ? (
                "Initialize Session"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Mode toggle */}
          <p className="mt-5 text-sm text-muted">
            {mode === "sign-in" ? "No access credentials?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={switchMode}
              disabled={status === "loading"}
              className="cursor-pointer font-semibold text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
            >
              {mode === "sign-in" ? "Request access" : "Sign in"}
            </button>
          </p>
        </GlassPanel>

        <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-muted/50">
          Sentinel AI v0.1 — Autonomous Cyber Defense
        </p>
      </div>
    </div>
  );
}

/** Map raw Supabase error messages to human-readable strings. */
function friendlyError(msg: string): string {
  if (msg.includes("Invalid login credentials")) return "The email or password you entered is incorrect.";
  if (msg.includes("Email not confirmed")) return "Please confirm your email address before signing in. Check your inbox.";
  if (msg.includes("User already registered")) return "An account with this email already exists. Try signing in.";
  if (msg.includes("Password should be at least")) return "Password must be at least 6 characters long.";
  if (msg.includes("rate_limit")) return "Too many attempts. Please wait a moment and try again.";
  if (msg.includes("network") || msg.includes("fetch")) return "Connection error. Check your network and try again.";
  return msg;
}