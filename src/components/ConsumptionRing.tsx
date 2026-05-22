import { useEffect, useState } from "react";

type Props = { value: number; max: number; unit?: string };

export function ConsumptionRing({ value, max, unit = "m³" }: Props) {
  const pct = Math.min(1, value / max);
  const dots = 60;
  const filled = Math.round(dots * pct);
  const radius = 110;

  const [animatedValue, setAnimatedValue] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!show) return;
    let raf: number;
    const duration = 1200;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(value * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [show, value]);

  return (
    <div
      className={`relative w-[260px] h-[260px] mx-auto transition-all duration-700 ${
        show ? "opacity-100 scale-100" : "opacity-0 scale-90"
      }`}
    >
      <svg viewBox="0 0 260 260" className="w-full h-full -rotate-90">
        {Array.from({ length: dots }).map((_, i) => {
          const angle = (i / dots) * Math.PI * 2;
          const x = 130 + Math.cos(angle) * radius;
          const y = 130 + Math.sin(angle) * radius;
          const on = i < filled;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={on ? 4 : 2.5}
              className={on ? "fill-primary" : "fill-border"}
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transitionDelay: show ? `${i * 12}ms` : "0ms",
                opacity: show ? (on ? 1 : 0.35) : 0,
                transform: show ? `scale(${on ? 1 : 0.6})` : "scale(0)",
              }}
            />
          );
        })}
      </svg>
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ${
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
        style={{ transitionDelay: "300ms" }}
      >
        <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
          Consumo actual
        </span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="num-display text-6xl text-foreground">
            {animatedValue.toFixed(1)}
          </span>
          <span className="text-lg font-semibold text-muted-foreground">
            {unit}
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground mt-1">
          desde el último cierre
        </span>
      </div>
    </div>
  );
}
