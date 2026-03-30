import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Map,
  Building2,
  Users,
  MapPin,
  Settings,
  ChevronLeft,
  ChevronRight,
  Network,
} from "lucide-react";
import { cn } from "@/lib/utils";

const strategicLinks = [
  { to: "/", icon: LayoutDashboard, label: "Cockpit Executivo" },
  { to: "/ranking", icon: BarChart3, label: "Ranking" },
  { to: "/mapa", icon: Map, label: "Mapa Estratégico" },
];

const unitLinks = [
  { to: "/unidade/1", icon: Building2, label: "Cockpit 360°" },
  { to: "/unidade/1/atendimento", icon: Users, label: "Atendimento e Produção" },
  { to: "/unidade/1/territorial", icon: MapPin, label: "Territorial" },
  { to: "/unidade/1/estrutura", icon: Settings, label: "Estrutura" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        "relative flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-primary">
          <Network className="w-4 h-4 text-sidebar-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wide text-sidebar-primary-foreground">GECAN</span>
            <span className="text-[10px] text-sidebar-foreground/60">Gerenciamento Estratégico</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-6 overflow-y-auto scrollbar-thin">
        <div>
          {!collapsed && (
            <p className="px-4 mb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
              Visão Estratégica
            </p>
          )}
          {strategicLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 mx-2 rounded-md text-sm transition-colors",
                isActive(link.to)
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <link.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </div>

        <div>
          {!collapsed && (
            <p className="px-4 mb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
              Visão Individual
            </p>
          )}
          {unitLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 mx-2 rounded-md text-sm transition-colors",
                isActive(link.to) && location.pathname === link.to
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <link.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </div>
      </nav>

      {/* Collapse btn */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex items-center justify-center w-6 h-6 rounded-full bg-sidebar-accent border border-sidebar-border text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}
