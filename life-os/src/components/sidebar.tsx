"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, CalendarDays, CheckSquare, CircleHelp, LayoutDashboard, Settings2, Target, Wallet, Repeat2, BookOpen } from "lucide-react";

const primary = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tarefas", icon: CheckSquare },
  { href: "/habits", label: "Hábitos", icon: Repeat2 },
  { href: "/calendar", label: "Agenda", icon: CalendarDays },
  { href: "/goals", label: "Metas", icon: Target },
];
const more = [
  { href: "/finance", label: "Financeiro", icon: Wallet },
  { href: "/notes", label: "Anotações", icon: BookOpen },
  { href: "/insights", label: "Insights", icon: Activity },
];
export function Sidebar() {
  const pathname = usePathname();
  return <aside className="sidebar">
    <div className="brand"><div className="brand-mark">L</div><span>LIFE OS</span></div>
    <div className="nav-label">WORKSPACE</div>
    <nav>{primary.map(item => <Link key={item.href} href={item.href} className={`nav-link ${pathname === item.href ? "active" : ""}`}><item.icon size={16}/>{item.label}</Link>)}</nav>
    <div className="nav-label">PERSONAL</div>
    <nav>{more.map(item => <Link key={item.href} href={item.href} className={`nav-link ${pathname === item.href ? "active" : ""}`}><item.icon size={16}/>{item.label}</Link>)}</nav>
    <div className="sidebar-bottom">
      <Link href="/settings" className="nav-link"><Settings2 size={16}/>Configurações</Link>
      <div className="nav-link"><CircleHelp size={16}/>Central de ajuda</div>
    </div>
  </aside>;
}