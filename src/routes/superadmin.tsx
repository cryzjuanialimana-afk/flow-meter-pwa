import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Shield,
  Users,
  Activity,
  Server,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  TrendingUp,
  AlertCircle,
  Database,
  Wifi,
} from "lucide-react";

export const Route = createFileRoute("/superadmin")({
  head: () => ({
    meta: [
      { title: "SuperAdmin — GasVecino" },
      { name: "description", content: "Gestión global de usuarios, roles, datos y estado del sistema." },
    ],
  }),
  component: SuperAdminPanel,
});

type Role = "superadmin" | "encargado" | "vecino";
type User = {
  id: string;
  name: string;
  email: string;
  apt: string;
  role: Role;
  active: boolean;
  lastSeen: string;
};

const seed: User[] = [
  { id: "u1", name: "Ana Pérez", email: "ana@acacias.com", apt: "—", role: "superadmin", active: true, lastSeen: "ahora" },
  { id: "u2", name: "Luis Romero", email: "luis@acacias.com", apt: "PB", role: "encargado", active: true, lastSeen: "hace 5m" },
  { id: "u3", name: "María González", email: "maria@mail.com", apt: "1-A", role: "vecino", active: true, lastSeen: "hace 1h" },
  { id: "u4", name: "Carlos Díaz", email: "carlos@mail.com", apt: "2-B", role: "vecino", active: true, lastSeen: "hace 3h" },
  { id: "u5", name: "Sofía Mendoza", email: "sofia@mail.com", apt: "4-A", role: "vecino", active: false, lastSeen: "hace 2d" },
  { id: "u6", name: "Pedro Salas", email: "pedro@mail.com", apt: "5-B", role: "vecino", active: true, lastSeen: "ayer" },
  { id: "u7", name: "Lucía Vargas", email: "lucia@mail.com", apt: "6-A", role: "vecino", active: true, lastSeen: "hace 30m" },
];

const roleStyle: Record<Role, string> = {
  superadmin: "bg-foreground text-background",
  encargado: "bg-primary text-primary-foreground",
  vecino: "bg-secondary text-foreground",
};

function SuperAdminPanel() {
  const [users, setUsers] = useState<User[]>(seed);
  const [tab, setTab] = useState<"usuarios" | "stats" | "sistema">("usuarios");
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [editing, setEditing] = useState<User | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          (roleFilter === "all" || u.role === roleFilter) &&
          (u.name.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase()) ||
            u.apt.toLowerCase().includes(query.toLowerCase())),
      ),
    [users, query, roleFilter],
  );

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.active).length;
    const byRole = (r: Role) => users.filter((u) => u.role === r).length;
    return { total, active, sa: byRole("superadmin"), enc: byRole("encargado"), vec: byRole("vecino") };
  }, [users]);

  const removeUser = (id: string) => setUsers((p) => p.filter((u) => u.id !== id));
  const upsertUser = (u: User) =>
    setUsers((p) => (p.some((x) => x.id === u.id) ? p.map((x) => (x.id === u.id ? u : x)) : [...p, u]));

  return (
    <div className="px-4 pt-5 max-w-3xl mx-auto">
      <header className="mb-5 flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Shield size={12} /> SuperAdmin
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight">Control Global</h1>
        </div>
        <span className="pill bg-status-verified text-status-verified-fg">
          <span className="w-1.5 h-1.5 rounded-full bg-status-verified-fg animate-pulse" />
          Sistema OK
        </span>
      </header>

      <div className="grid grid-cols-4 gap-2 mb-4">
        <StatCard label="Usuarios" value={stats.total} icon={<Users size={14} />} />
        <StatCard label="Activos" value={stats.active} icon={<Activity size={14} />} accent />
        <StatCard label="Encargados" value={stats.enc} icon={<Shield size={14} />} />
        <StatCard label="Vecinos" value={stats.vec} icon={<Users size={14} />} />
      </div>

      <div className="flex gap-2 mb-4">
        {(["usuarios", "stats", "sistema"] as const).map((t) => (
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

      {tab === "usuarios" && (
        <section className="space-y-3">
          <div className="bento p-3 flex items-center gap-2">
            <Search size={16} className="text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar nombre, email o apto"
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <button
              onClick={() => setCreating(true)}
              className="bg-foreground text-background rounded-xl px-3 py-1.5 text-xs font-bold flex items-center gap-1"
            >
              <Plus size={14} /> Nuevo
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {(["all", "superadmin", "encargado", "vecino"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider whitespace-nowrap ${
                  roleFilter === r ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"
                }`}
              >
                {r === "all" ? "Todos" : r}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.map((u) => (
              <div key={u.id} className="bento p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center font-bold text-sm">
                  {u.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm truncate">{u.name}</p>
                    {!u.active && (
                      <span className="pill bg-status-suspended text-status-suspended-fg">Inactivo</span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {u.email} · Apto {u.apt} · {u.lastSeen}
                  </p>
                </div>
                <span className={`pill ${roleStyle[u.role]}`}>{u.role}</span>
                <button
                  onClick={() => setEditing(u)}
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
                  aria-label="Editar"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => removeUser(u.id)}
                  className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center"
                  aria-label="Eliminar"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">Sin resultados.</p>
            )}
          </div>
        </section>
      )}

      {tab === "stats" && (
        <section className="space-y-3">
          <div className="bento p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <TrendingUp size={14} /> Consumo · últimos 7 días
              </h3>
              <span className="text-xs text-muted-foreground">m³</span>
            </div>
            <div className="flex items-end gap-2 h-32">
              {[42, 55, 48, 61, 52, 70, 58].map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-xl bg-gradient-to-t from-primary to-primary/40"
                    style={{ height: `${v}%` }}
                  />
                  <span className="text-[9px] text-muted-foreground font-semibold">
                    {["L", "M", "X", "J", "V", "S", "D"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bento p-4">
              <p className="text-[10px] uppercase font-semibold text-muted-foreground">Ingresos mes</p>
              <p className="num-display text-2xl mt-1">$312<span className="text-sm text-muted-foreground">.40</span></p>
              <p className="text-[11px] text-status-verified-fg font-semibold mt-1">+12% vs. anterior</p>
            </div>
            <div className="bento p-4">
              <p className="text-[10px] uppercase font-semibold text-muted-foreground">Morosidad</p>
              <p className="num-display text-2xl mt-1">11<span className="text-sm text-muted-foreground">%</span></p>
              <p className="text-[11px] text-destructive font-semibold mt-1">2 aptos vencidos</p>
            </div>
            <div className="bento p-4">
              <p className="text-[10px] uppercase font-semibold text-muted-foreground">Lecturas/mes</p>
              <p className="num-display text-2xl mt-1">17<span className="text-sm text-muted-foreground">/17</span></p>
            </div>
            <div className="bento p-4">
              <p className="text-[10px] uppercase font-semibold text-muted-foreground">Sesiones hoy</p>
              <p className="num-display text-2xl mt-1">{stats.active * 3}</p>
            </div>
          </div>
        </section>
      )}

      {tab === "sistema" && (
        <section className="space-y-2">
          <SysRow icon={<Server size={14} />} label="API GasVecino" value="Operativa" ok />
          <SysRow icon={<Database size={14} />} label="Base de datos" value="120ms · OK" ok />
          <SysRow icon={<Wifi size={14} />} label="Sincronización offline" value="3 pendientes" />
          <SysRow icon={<Activity size={14} />} label="Versión PWA" value="v1.4.0" ok />
          <SysRow icon={<AlertCircle size={14} />} label="Errores 24h" value="0" ok />
          <div className="bento p-4 mt-3">
            <h3 className="text-sm font-bold mb-2">Acciones críticas</h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-secondary text-foreground rounded-2xl py-2.5 text-xs font-bold">
                Forzar sync
              </button>
              <button className="bg-secondary text-foreground rounded-2xl py-2.5 text-xs font-bold">
                Exportar datos
              </button>
              <button className="bg-secondary text-foreground rounded-2xl py-2.5 text-xs font-bold">
                Limpiar caché
              </button>
              <button className="bg-destructive/10 text-destructive rounded-2xl py-2.5 text-xs font-bold">
                Modo mantenimiento
              </button>
            </div>
          </div>
        </section>
      )}

      {(editing || creating) && (
        <UserSheet
          initial={
            editing ??
            {
              id: `u${Date.now()}`,
              name: "",
              email: "",
              apt: "",
              role: "vecino",
              active: true,
              lastSeen: "nunca",
            }
          }
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={(u) => {
            upsertUser(u);
            setEditing(null);
            setCreating(false);
          }}
        />
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="bento p-3">
      <div className="flex items-center gap-1 text-muted-foreground">
        {icon}
        <p className="text-[9px] uppercase font-semibold tracking-wider truncate">{label}</p>
      </div>
      <p className={`num-display text-2xl mt-1 ${accent ? "text-primary" : ""}`}>{value}</p>
    </div>
  );
}

function SysRow({
  icon,
  label,
  value,
  ok,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  ok?: boolean;
}) {
  return (
    <div className="bento p-3 flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-bold">{label}</p>
        <p className="text-[11px] text-muted-foreground">{value}</p>
      </div>
      <span
        className={`pill ${
          ok ? "bg-status-verified text-status-verified-fg" : "bg-status-pending text-status-pending-fg"
        }`}
      >
        {ok ? <Check size={11} /> : <AlertCircle size={11} />}
        {ok ? "OK" : "Aviso"}
      </span>
    </div>
  );
}

function UserSheet({
  initial,
  onClose,
  onSave,
}: {
  initial: User;
  onClose: () => void;
  onSave: (u: User) => void;
}) {
  const [u, setU] = useState<User>(initial);
  return (
    <div className="fixed inset-0 z-50 bg-foreground/30 flex items-end sm:items-center justify-center p-3" onClick={onClose}>
      <div
        className="bg-card rounded-3xl w-full max-w-md p-5 shadow-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-extrabold">{initial.name ? "Editar usuario" : "Nuevo usuario"}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <X size={14} />
          </button>
        </div>
        <div className="space-y-3">
          <Field label="Nombre" value={u.name} onChange={(v) => setU({ ...u, name: v })} />
          <Field label="Email" value={u.email} onChange={(v) => setU({ ...u, email: v })} />
          <Field label="Apartamento" value={u.apt} onChange={(v) => setU({ ...u, apt: v })} />
          <div>
            <label className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Rol</label>
            <div className="flex gap-2 mt-1.5">
              {(["superadmin", "encargado", "vecino"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setU({ ...u, role: r })}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold ${
                    u.role === r ? roleStyle[r] : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center justify-between bg-secondary rounded-2xl px-4 py-3">
            <span className="text-sm font-semibold">Cuenta activa</span>
            <input
              type="checkbox"
              checked={u.active}
              onChange={(e) => setU({ ...u, active: e.target.checked })}
              className="w-5 h-5 accent-primary"
            />
          </label>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 bg-secondary text-foreground py-3 rounded-2xl text-sm font-bold">
            Cancelar
          </button>
          <button
            onClick={() => onSave(u)}
            disabled={!u.name || !u.email}
            className="flex-1 bg-foreground text-background py-3 rounded-2xl text-sm font-bold disabled:opacity-40"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-secondary rounded-2xl px-4 py-3 text-sm mt-1.5 outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}
