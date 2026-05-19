type Props = { value: number; max: number; unit?: string };

export function ConsumptionRing({ value, max, unit = "m³" }: Props) {
  const pct = Math.min(1, value / max);
  const dots = 60;
  const filled = Math.round(dots * pct);
  const radius = 110;

  return (
    <div className="relative w-[260px] h-[260px] mx-auto">
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
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
          Consumo actual
        </span>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="num-display text-6xl text-foreground">{value.toFixed(1)}</span>
          <span className="text-lg font-semibold text-muted-foreground">{unit}</span>
        </div>
        <span className="text-[11px] text-muted-foreground mt-1">
          desde el último cierre
        </span>
      </div>
    </div>
  );
}
