import { Bell, Search } from "lucide-react";
export function Topbar() {
  const date = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long" }).format(new Date());
  return <header className="topbar">
    <div className="topbar-date">{date.charAt(0).toUpperCase() + date.slice(1)}</div>
    <div style={{display:"flex",alignItems:"center",gap:18}}>
      <button aria-label="Buscar" style={{background:"transparent",border:0,color:"#88889a"}}><Search size={17}/></button>
      <button aria-label="Notificações" style={{background:"transparent",border:0,color:"#88889a"}}><Bell size={17}/></button>
      <div className="avatar">U</div>
    </div>
  </header>;
}