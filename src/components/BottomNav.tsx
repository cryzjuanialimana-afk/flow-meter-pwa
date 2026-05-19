import { Link, useLocation } from "@tanstack/react-router";
import { Home, LayoutGrid, Camera } from "lucide-react";

export function BottomNav() {
  const { pathname } = useLocation();
  const tabs = [
    { to: "/", label: "Inicio", icon: Home },
    { to: "/camara", label: "Lectura", icon: Camera },
    { to: "/admin", label: "Admin", icon: LayoutGrid },
  ] as const;

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-40">
      <div className="bento flex justify-around items-center px-2 py-2">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-2xl transition-all ${
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 2} />
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
