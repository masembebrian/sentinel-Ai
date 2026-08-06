import { useEffect, useRef } from "react";
import { useUI } from "../../store/ui";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

/**
 * Animated cyber background: matrix rain + floating particles + subtle grids.
 * - Toggleable from the UI store (persisted).
 * - Disabled entirely under reduced motion (OS or manual override).
 * - Performance: capped DPR, bounded particle count, paused when tab hidden.
 */

const GLYPHS = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF$#@%&*+=<>{}[]";
const CYAN = "0, 214, 244";
const PURPLE = "168, 108, 255";
const GREEN = "0, 255, 178";

export function CyberBackground() {
  const enabled = useUI((s) => s.backgroundEnabled);
  const overrideReduced = useUI((s) => s.reduceMotion);
  const osReduced = usePrefersReducedMotion();
  const reduced = osReduced || overrideReduced;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!enabled || reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    let raf = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Matrix rain columns
    const fontSize = 15;
    const columns = Math.max(1, Math.floor(width / fontSize));
    const drops = Array.from({ length: columns }, () => Math.random() * -height);

    // Floating particles (bounded count)
    const particleCount = Math.min(70, Math.floor((width * height) / 22000));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.22,
      vy: -Math.random() * 0.3 - 0.06,
      color: Math.random() < 0.72 ? CYAN : Math.random() < 0.5 ? PURPLE : GREEN,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const drawRain = () => {
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      for (let i = 0; i < columns; i++) {
        const x = i * fontSize;
        const y = drops[i];
        const color = Math.random() < 0.85 ? CYAN : PURPLE;
        const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        // head glyph + two fading tail glyphs (cheap fake trail, no full-canvas fade)
        ctx.fillStyle = `rgba(${color}, 0.5)`;
        ctx.fillText(glyph, x, y);
        ctx.fillStyle = `rgba(${color}, 0.2)`;
        ctx.fillText(glyph, x, y - fontSize);
        ctx.fillStyle = `rgba(${color}, 0.07)`;
        ctx.fillText(glyph, x, y - fontSize * 2);
        if (y > height && Math.random() > 0.975) drops[i] = Math.random() * -60;
        drops[i] += fontSize * 0.6;
      }
    };

    const drawParticles = (dt: number) => {
      for (const p of particles) {
        p.x += p.vx * dt * 60;
        p.y += p.vy * dt * 60;
        if (p.y < -6) {
          p.y = height + 6;
          p.x = Math.random() * width;
        }
        if (p.x < -6) p.x = width + 6;
        if (p.x > width + 6) p.x = -6;
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha * 0.2})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.8, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    let last = performance.now();
    let rainAccum = 0;
    const loop = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, width, height);
      rainAccum += dt;
      if (rainAccum > 0.045) {
        rainAccum = 0;
        drawRain();
      }
      drawParticles(dt);
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && running) raf = requestAnimationFrame(loop);
    };

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled, reduced]);

  if (!enabled || reduced) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-grid absolute inset-0" />
      <div className="bg-grid-lines absolute inset-0 opacity-60" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="animate-drift-slow absolute -left-40 -top-40 size-[34rem] rounded-full bg-primary/10 blur-[110px]" />
      <div
        className="animate-drift-slow absolute -bottom-48 -right-40 size-[38rem] rounded-full bg-accent/10 blur-[120px]"
        style={{ animationDelay: "-9s" }}
      />
      <div className="scanlines absolute inset-0 opacity-40" />
      <div className="vignette absolute inset-0" />
    </div>
  );
}
