import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronRight, Droplets, Calendar, Flame, RefreshCw } from "lucide-react";
import { ConsumptionRing } from "@/components/ConsumptionRing";
import { PaymentSheet } from "@/components/PaymentSheet";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mi consumo — GasVecino" },
      { name: "description", content: "Tu consumo de gas comunal en tiempo real." },
    ],
  }),
  component: Dashboard,
});

const monthly = [3.1, 4.2, 2.8, 5.1, 4.6, 3.9, 5.8, 4.4];

function Dashboard() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pulled, setPulled] = useState(0);
  const startY = useRef<number | null>(null);

  const consumption = 4.4;
  const max = 8;
  const amount = 18.4;
  const days = 12;
  const tank = 0.42;

  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      if (window.scrollY === 0) startY.current = e.touches[0].clientY;
    };
    const onMove = (e: TouchEvent) => {
      if (startY.current === null) return;
      const d = e.touches[0].clientY - startY.current;
      if (d > 0) setPulled(Math.min(80, d));
    };
    const onEnd = () => {
      if (pulled > 60) {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1200);
      }
      setPulled(0);
      startY.current = null;
    };
    window.addEventListener("touchstart", onStart);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [pulled]);

  return (
    <div className="px-4 pt-5" style={{ transform: `translateY(${pulled * 0.5}px)`, transition: pulled === 0 ? "transform 0.3s" : "none" }}>
      {/* Pull-to-refresh indicator */}
      <div className={`flex justify-center -mt-2 mb-1 transition-opacity ${pulled > 0 || refreshing ? "opacity-100" : "opacity-0"}`}>
        <RefreshCw size={18} className={`text-primary ${refreshing ? "animate-spin" : ""}`} style={{ transform: `rotate(${pulled * 4}deg)` }} />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Apto 7-B</p>
          <h1 className="text-2xl font-extrabold tracking-tight">Hola, Carla</h1>
        </div>
        <div className="w-11 h-11 rounded-full bg-foreground text-background flex items-center justify-center font-bold">
          C
        </div>
      </header>

      {/* Hero ring */}
      <section className="bento p-5 mb-3">
        <ConsumptionRing value={consumption} max={max} />
        <div className="flex justify-center gap-2 mt-2">
          <span className="pill bg-status-verified text-status-verified-fg">● Medidor activo</span>
        </div>
      </section>

      {/* Bento grid */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setSheetOpen(true)}
          className="bento p-4 text-left active:scale-[0.98] transition-transform col-span-2"
          style={{ background: "var(--color-foreground)" }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-background/60">Monto estimado</p>
              <p className="num-display text-4xl text-background mt-1">${amount.toFixed(2)}</p>
              <p className="text-xs text-background/60 mt-1">Hasta hoy · USD</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center">
              <ChevronRight size={18} className="text-background" />
            </div>
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 bg-background/10 px-3 py-1.5 rounded-full">
            <span className="text-[11px] font-semibold text-background">Reportar pago</span>
          </div>
        </button>

        <div className="bento p-4">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar size={14} />
            <p className="text-[11px] uppercase tracking-wider font-semibold">Autonomía</p>
          </div>
          <p className="num-display text-3xl mt-2">{days}<span className="text-base font-bold text-muted-foreground ml-1">días</span></p>
          <p className="text-[11px] text-muted-foreground mt-0.5">de gas comunal</p>
        </div>

        <div className="bento p-4">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Flame size={14} />
            <p className="text-[11px] uppercase tracking-wider font-semibold">Histórico</p>
          </div>
          <div className="flex items-end gap-1 h-10 mt-2">
            {monthly.map((m, i) => (
              <div
                key={i}
                className={`flex-1 rounded-md ${i === monthly.length - 1 ? "bg-primary" : "bg-border"}`}
                style={{ height: `${(m / 6) * 100}%` }}
              />
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1.5">Últimos 8 meses</p>
        </div>

        <div className="bento p-4 col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Droplets size={14} />
              <p className="text-[11px] uppercase tracking-wider font-semibold">Tanque principal</p>
            </div>
            <p className="text-xs font-bold">{Math.round(tank * 100)}%</p>
          </div>
          <div className="h-3 rounded-full bg-border overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${tank * 100}%` }} />
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">Lectura del manómetro · hace 3 h</p>
        </div>
      </div>

      <PaymentSheet open={sheetOpen} onClose={() => setSheetOpen(false)} amount={amount} />
    </div>
  );
}
