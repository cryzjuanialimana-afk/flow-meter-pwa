import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Clock, AlertTriangle, Filter, Search } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel del encargado — GasVecino" },
      { name: "description", content: "Gestión de lecturas y pagos del edificio." },
    ],
  }),
  component: AdminPanel,
});

type Apt = { id: string; status: "done" | "late" | "overdue" };

const apts: Apt[] = Array.from({ length: 17 }).map((_, i) => {
  const n = i + 1;
  const floor = Math.ceil(n / 2);
  const letter = n % 2 === 1 ? "A" : "B";
  const s: Apt["status"] = i < 11 ? "done" : i < 15 ? "late" : "overdue";
  return { id: `${floor}-${letter}`, status: s };
});

const pendingPayments = [
  { apt: "3-A", amount: 18.4, ref: "00123456", time: "hace 2h" },
  { apt: "5-B", amount: 22.1, ref: "00123457", time: "hace 4h" },
  { apt: "7-A", amount: 15.7, ref: "00123458", time: "ayer" },
];

function AdminPanel() {
  const [tab, setTab] = useState<"lecturas" | "pagos">("lecturas");
  const done = apts.filter((a) => a.status === "done").length;

  return (
    <div className="px-4 pt-5">
      <header className="mb-5">
        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Panel del encargado</p>
        <h1 className="text-2xl font-extrabold tracking-tight">Edificio Las Acacias</h1>
      </header>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bento p-3">
          <p className="text-[10px] uppercase font-semibold text-muted-foreground">Leídos</p>
          <p className="num-display text-2xl mt-1">{done}<span className="text-sm text-muted-foreground">/17</span></p>
        </div>
        <div className="bento p-3">
          <p className="text-[10px] uppercase font-semibold text-muted-foreground">Pendientes</p>
          <p className="num-display text-2xl mt-1 text-primary">{pendingPayments.length}</p>
        </div>
        <div className="bento p-3">
          <p className="text-[10px] uppercase font-semibold text-muted-foreground">Tanque</p>
          <p className="num-display text-2xl mt-1">42<span className="text-sm text-muted-foreground">%</span></p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {(["lecturas", "pagos"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-colors ${
              tab === t ? "bg-foreground text-background" : "bg-card text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "lecturas" ? (
        <section className="bento p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold">Apartamentos · Septiembre</h3>
            <button className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <Filter size={14} />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {apts.map((a) => {
              const cls =
                a.status === "done"
                  ? "bg-status-verified text-status-verified-fg"
                  : a.status === "late"
                  ? "bg-status-pending text-status-pending-fg pulse-soft"
                  : "bg-status-suspended text-status-suspended-fg pulse-soft";
              return (
                <button
                  key={a.id}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center font-bold ${cls}`}
                >
                  <span className="text-base">{a.id}</span>
                  {a.status === "done" ? <Check size={12} /> : a.status === "late" ? <Clock size={12} /> : <AlertTriangle size={12} />}
                </button>
              );
            })}
          </div>
          <div className="flex gap-3 mt-4 text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-verified-fg" />Listo</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-pending-fg" />Prórroga</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-status-suspended-fg" />Vencido</span>
          </div>
        </section>
      ) : (
        <section className="space-y-2">
          <div className="bento p-3 flex items-center gap-2">
            <Search size={16} className="text-muted-foreground" />
            <input
              placeholder="Buscar referencia"
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
          {pendingPayments.map((p) => (
            <div key={p.ref} className="bento p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-semibold">Apto {p.apt} · {p.time}</p>
                  <p className="num-display text-2xl mt-1">${p.amount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Ref. {p.ref}</p>
                </div>
                <span className="pill bg-status-pending text-status-pending-fg">
                  <Clock size={11} />
                  Pendiente
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 bg-foreground text-background py-2.5 rounded-2xl text-xs font-bold">
                  Aprobar
                </button>
                <button className="flex-1 bg-secondary text-foreground py-2.5 rounded-2xl text-xs font-bold">
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
