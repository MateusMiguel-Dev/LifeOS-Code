"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, CheckSquare, LayoutDashboard, Target, Wallet, Repeat2, BookOpen, Bell, Gamepad2 } from "lucide-react";

const primary = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tarefas", icon: CheckSquare },
  { href: "/habits", label: "Hábitos", icon: Repeat2 },
  { href: "/calendar", label: "Calendário", icon: CalendarDays },
  { href: "/reminders", label: "Lembretes", icon: Bell },
  { href: "/goals", label: "Metas", icon: Target },
];
const more = [
  { href: "/finance", label: "Financeiro", icon: Wallet },
  { href: "/notes", label: "Anotações", icon: BookOpen },
  { href: "/dashboard#radar-gamer", label: "Radar Gamer", icon: Gamepad2 },
];
export function Sidebar() {
  const pathname = usePathname();
  return <aside className="sidebar">
    <div className="brand"><div className="brand-mark">L</div><span>LIFE OS</span></div>
    <div className="nav-label">WORKSPACE</div>
    <nav>{primary.map(item => <Link key={item.href} href={item.href} className={`nav-link ${pathname === item.href ? "active" : ""}`}><item.icon size={16}/>{item.label}</Link>)}</nav>
    <div className="nav-label">PERSONAL</div>
    <nav>{more.map(item => <Link key={item.href} href={item.href} className={`nav-link ${pathname === item.href ? "active" : ""}`}><item.icon size={16}/>{item.label}</Link>)}</nav>

  </aside>;
}