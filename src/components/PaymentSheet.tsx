import { useEffect, useState } from "react";
import { X, Upload, Check, Clock } from "lucide-react";

type Charge = { id: string; date: string; amount: number; status: "verified" | "pending" };

const history: Charge[] = [
  { id: "1", date: "Sep 2026", amount: 18.4, status: "verified" },
  { id: "2", date: "Ago 2026", amount: 22.1, status: "verified" },
  { id: "3", date: "Jul 2026", amount: 15.7, status: "verified" },
];

export function PaymentSheet({ open, onClose, amount }: { open: boolean; onClose: () => void; amount: number }) {
  const [ref, setRef] = useState("");
  const [file, setFile] = useState<string | null>(null);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-foreground/40 animate-in fade-in" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 bg-card rounded-t-[28px] p-5 pb-8 animate-in slide-in-from-bottom max-h-[88vh] overflow-y-auto">
        <div className="flex justify-center mb-2">
          <div className="w-10 h-1.5 bg-border rounded-full" />
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold">Reportar pago</h3>
            <p className="text-xs text-muted-foreground">Adjunta tu comprobante</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
            <X size={16} />
          </button>
        </div>

        <div className="bento p-4 mb-4" style={{ background: "var(--color-primary)" }}>
          <p className="text-xs text-primary-foreground/80 font-semibold uppercase tracking-wide">A pagar</p>
          <p className="num-display text-4xl text-primary-foreground mt-1">${amount.toFixed(2)}</p>
        </div>

        <label className="block">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Referencia</span>
          <input
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            placeholder="00012345"
            className="mt-1.5 w-full bg-secondary rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary"
          />
        </label>

        <label className="block mt-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Comprobante</span>
          <div className="mt-1.5 bg-secondary rounded-2xl p-4 flex items-center gap-3 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setFile(URL.createObjectURL(f));
              }}
            />
            {file ? (
              <img src={file} alt="" className="w-14 h-14 rounded-xl object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-background flex items-center justify-center">
                <Upload size={18} className="text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-semibold">{file ? "Captura lista" : "Subir captura"}</p>
              <p className="text-xs text-muted-foreground">Pago móvil / transferencia</p>
            </div>
          </div>
        </label>

        <button className="w-full mt-4 bg-foreground text-background py-4 rounded-2xl font-semibold text-sm">
          Enviar reporte
        </button>

        <div className="mt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Historial</h4>
          <div className="space-y-2">
            {history.map((h) => (
              <div key={h.id} className="flex items-center justify-between bg-secondary rounded-2xl px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">{h.date}</p>
                  <p className="text-xs text-muted-foreground">Pago de gas</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="num-display text-base">${h.amount.toFixed(2)}</span>
                  <span className={`pill ${h.status === "verified" ? "bg-status-verified text-status-verified-fg" : "bg-status-pending text-status-pending-fg"}`}>
                    {h.status === "verified" ? <Check size={11} /> : <Clock size={11} />}
                    {h.status === "verified" ? "Verificado" : "Pendiente"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
