"use client";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Check, CheckCircle2, Clock3, Flame, ListTodo, Plus, Sparkles, Target } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Task } from "@/types/database";
import { DailyOracle } from "@/components/daily-oracle";
import { GamerRadar } from "@/components/gamer-radar";

export function Dashboard() {
  const [tasks,setTasks] = useState<Task[]>([]);
  const [connected,setConnected] = useState(false);
  const [loading,setLoading] = useState(true);
  const completed = tasks.filter(t=>t.completed).length;
  const pending = tasks.length-completed;
  const dateLabel = useMemo(()=>new Intl.DateTimeFormat("pt-BR",{day:"numeric",month:"long"}).format(new Date()),[]);
  useEffect(()=>{
    const supabase=createClient();
    if(!supabase){setLoading(false);return;}
    setConnected(true);
    supabase.from("tasks").select("*").order("created_at",{ascending:false}).limit(8)
      .then(({data,error})=>{if(!error && data)setTasks(data as Task[]);else if(!error)setTasks([]);setLoading(false);});
  },[]);
  async function toggleTask(task:Task) {
    const next=!task.completed;
    setTasks(current=>current.map(t=>t.id===task.id?{...t,completed:next}:t));
    if(connected && !task.id.startsWith("demo-")){
      const supabase=createClient();
      await supabase?.from("tasks").update({completed:next}).eq("id",task.id);
    }
  }
  return <div className="page">
    <section className="welcome-banner">
      <div className="welcome-copy">
        <div className="eyebrow">SEU ESPAÇO · {dateLabel.toUpperCase()}</div>
        <h1 className="page-title">Vamos construir um dia extraordinário.</h1>
        <p className="page-subtitle">Clareza para escolher. Foco para executar. Consistência para evoluir.</p>
      </div>
      <div className="welcome-art" aria-hidden="true"><div className="orb orb-one"/><div className="orb orb-two"/><div className="orb-core"/></div>
    </section>
    <DailyOracle />
    <section className="stat-grid">
      <Stat icon={<ListTodo size={16}/>} label="Tarefas pendentes" value={String(pending).padStart(2,"0")} note="No seu radar hoje"/>
      <Stat icon={<CheckCircle2 size={16}/>} label="Concluídas" value={String(completed).padStart(2,"0")} note="Pequenos avanços contam"/>
      <Stat icon={<Flame size={16}/>} label="Consistência" value="—" note="Acompanhe seus hábitos"/>
      <Stat icon={<Target size={16}/>} label="Metas ativas" value="—" note="Cadastre seus objetivos"/>
    </section>
    <section className="content-grid">
      <div>
        <div className="panel">
          <div className="panel-head"><div><div className="panel-title">Prioridades de hoje</div><div className="panel-hint">Mantenha o foco no que realmente importa</div></div><Link href="/tasks" className="nav-link" style={{padding:5,fontSize:11}}>Ver todas <ArrowUpRight size={13}/></Link></div>
          {loading ? <div className="empty">Carregando suas tarefas...</div> : tasks.length ? tasks.slice(0,5).map(task=><div className="task-row" key={task.id}><button className={`task-check ${task.completed?"done":""}`} onClick={()=>toggleTask(task)} aria-label="Alternar tarefa">{task.completed&&<Check size={12}/>}</button><span className={`task-name ${task.completed?"done":""}`}>{task.title}</span><span className="priority">{task.priority==="high"?"Alta":task.priority==="medium"?"Média":"Baixa"}</span></div>) : <div className="empty">Nenhuma tarefa por aqui. Aproveite o espaço ou adicione uma nova.</div>}
          <div style={{padding:15,borderTop:"1px solid #30353d"}}><Link href="/tasks" className="ghost-btn" style={{display:"inline-flex",alignItems:"center",gap:7,textDecoration:"none"}}><Plus size={13}/> Adicionar tarefa</Link></div>
        </div>
        <div className="panel section-gap">
          <div className="panel-head"><div><div className="panel-title">Ritmo da semana</div><div className="panel-hint">Sua consistência, um dia de cada vez</div></div><span style={{fontSize:10,color:"#c7ccd4"}}>ÚLTIMOS 7 DIAS</span></div>
          <div style={{display:"flex",alignItems:"end",gap:12,height:120,padding:"12px 22px 18px"}}>
            {[42,68,54,88,62,76,35].map((v,i)=><div key={i} style={{flex:1,display:"flex",height:"100%",flexDirection:"column",justifyContent:"end",alignItems:"center",gap:8}}><div style={{height:`${v}%`,width:"100%",maxWidth:38,borderRadius:"6px 6px 2px 2px",background:i===3?"linear-gradient(180deg,#eef1f5,#858e9a)":"#363c45"}}/><span style={{fontSize:9,color:"#858d98"}}>{["S","T","Q","Q","S","S","D"][i]}</span></div>)}
          </div>
        </div>
      </div>
      <div>
        <div className="panel focus-card">
          <div style={{display:"flex",alignItems:"center",gap:8,color:"#e0e4e9",fontSize:11}}><Sparkles size={15}/> DAILY FOCUS</div>
          <div className="focus-number">03<span style={{fontSize:15,color:"#aeb5bf",fontWeight:500}}> / 03</span></div>
          <div style={{fontSize:12,color:"#d4d9e0"}}>Escolha suas três prioridades e proteja seu foco.</div>
          <div style={{marginTop:18}}><div className="progress-track"><div className="progress-fill" style={{width:`${Math.min(100,completed/Math.max(1,tasks.length)*100)}%`}}/></div></div>
          <div style={{fontSize:10,color:"#9ba2ac",marginTop:8}}>{completed} de {tasks.length} tarefas concluídas</div>
        </div>
        <div className="panel section-gap" style={{padding:16}}>
          <div className="panel-title">Construa sua consistência</div>
          <div className="panel-hint" style={{marginTop:5}}>Registre seus hábitos e acompanhe cada dia concluído.</div>
          <Link href="/habits" className="ghost-btn" style={{display:"inline-flex",marginTop:13,textDecoration:"none"}}>Abrir hábitos <ArrowUpRight size={13}/></Link>
        </div>
      </div>
    </section>
    <GamerRadar />
    {!connected&&<p style={{fontSize:10,color:"#858d98",marginTop:18}}>Modo de demonstração · Configure o Supabase para sincronizar seus dados.</p>}
  </div>;
}
function Stat({icon,label,value,note}:{icon:React.ReactNode,label:string,value:string,note:string}) {
  return <div className="panel stat-card"><div className="stat-top"><span>{label}</span><span style={{color:"#d5dae1"}}>{icon}</span></div><div className="stat-value">{value}</div><div className="stat-note">{note}</div></div>;
}