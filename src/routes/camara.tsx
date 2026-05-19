import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Zap, ZapOff, Trash2, Upload, WifiOff, Check } from "lucide-react";

export const Route = createFileRoute("/camara")({
  head: () => ({
    meta: [
      { title: "Capturar lectura — GasVecino" },
      { name: "description", content: "Toma una foto del medidor para registrar la lectura." },
    ],
  }),
  component: CameraView,
});

type Captured = { id: string; src: string; synced: boolean };

const STORAGE_KEY = "gasvecino_pending_captures";

function CameraView() {
  const [flash, setFlash] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [pending, setPending] = useState<Captured[]>([]);
  const [online, setOnline] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const tapTimer = useRef<number | null>(null);

  useEffect(() => {
    if (typeof navigator !== "undefined") setOnline(navigator.onLine);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setPending(JSON.parse(stored));
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const showToast = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 2000);
  };

  const onDoubleTap = () => {
    if (tapTimer.current) {
      window.clearTimeout(tapTimer.current);
      tapTimer.current = null;
      setFlash((f) => !f);
      showToast(flash ? "Flash apagado" : "Flash encendido");
    } else {
      tapTimer.current = window.setTimeout(() => {
        tapTimer.current = null;
      }, 280);
    }
  };

  const submit = (src: string) => {
    const cap: Captured = { id: String(Date.now()), src, synced: online };
    if (!online) {
      const next = [...pending, cap];
      setPending(next);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      showToast("Guardado sin conexión");
    } else {
      showToast("Lectura enviada");
    }
    setPhoto(null);
  };

  const sync = () => {
    setPending([]);
    localStorage.removeItem(STORAGE_KEY);
    showToast("Sincronizado");
  };

  const onTouchStart = (e: React.TouchEvent) => {
    swipeStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!swipeStart.current || !photo) return;
    const dx = e.changedTouches[0].clientX - swipeStart.current.x;
    const dy = e.changedTouches[0].clientY - swipeStart.current.y;
    if (Math.abs(dy) > Math.abs(dx) && dy < -60) submit(photo);
    else if (Math.abs(dx) > 60) setPhoto(null);
    swipeStart.current = null;
  };

  return (
    <div className="px-4 pt-5">
      <header className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Cámara</p>
          <h1 className="text-2xl font-extrabold tracking-tight">Capturar medidor</h1>
        </div>
        <span className={`pill ${online ? "bg-status-verified text-status-verified-fg" : "bg-status-suspended text-status-suspended-fg"}`}>
          {online ? <Check size={11} /> : <WifiOff size={11} />}
          {online ? "Online" : "Sin red"}
        </span>
      </header>

      <div
        onClick={onDoubleTap}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="bento overflow-hidden relative aspect-[3/4] flex items-center justify-center"
        style={{
          background: photo
            ? `url(${photo}) center/cover`
            : flash
            ? "radial-gradient(circle at center, oklch(0.4 0.04 280), oklch(0.18 0.02 280))"
            : "linear-gradient(180deg, oklch(0.22 0.01 280), oklch(0.12 0.01 280))",
        }}
      >
        {!photo && (
          <>
            <div className="absolute inset-x-12 inset-y-20 border-2 border-dashed border-primary/60 rounded-3xl" />
            <p className="absolute top-6 left-0 right-0 text-center text-xs text-background/70 font-medium">
              Doble toque para flash · Apunta al medidor
            </p>
          </>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setFlash((f) => !f);
          }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/20 backdrop-blur flex items-center justify-center text-background"
        >
          {flash ? <Zap size={18} fill="currentColor" /> : <ZapOff size={18} />}
        </button>

        {photo && (
          <div className="absolute inset-0 flex items-end justify-between p-4 bg-gradient-to-t from-foreground/70 to-transparent">
            <span className="text-xs text-background font-semibold">↑ Subir · ← Borrar</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        {photo ? (
          <>
            <button onClick={() => setPhoto(null)} className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
              <Trash2 size={20} />
            </button>
            <button onClick={() => submit(photo)} className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-pop">
              <Upload size={26} />
            </button>
          </>
        ) : (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setPhoto(URL.createObjectURL(f));
              }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center shadow-pop"
            >
              <div className="w-16 h-16 rounded-full border-4 border-background" />
            </button>
          </>
        )}
      </div>

      {pending.length > 0 && (
        <button
          onClick={sync}
          className="fixed bottom-24 right-4 z-30 bento px-4 py-3 flex items-center gap-2 bg-primary text-primary-foreground shadow-pop"
        >
          <Upload size={16} />
          <span className="text-xs font-bold">Sincronizar ({pending.length})</span>
        </button>
      )}

      {toast && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-4 py-2.5 rounded-full text-xs font-semibold shadow-pop">
          {toast}
        </div>
      )}
    </div>
  );
}
