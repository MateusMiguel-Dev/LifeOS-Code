"use client";

import { useEffect,useState } from "react";
import { Plus,Target } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
type Goal={id:string;title:string;description:string|null;target_date:string|null;progress:number;status:string};
export function Goals(){
 const [goals,setGoals]=useState<Goal[]>([]);const [title,setTitle]=useState("");const [date,setDate]=useState("");const [loading,setLoading]=useState(true);const [message,setMessage]=useState("");
 const db=createClient();
 async function load(){if(!db){setLoading(false);setMessage("Configure o Supabase para salvar suas metas.");return;}const {data,error}=await db.from("goals").select("*").order("created_at",{ascending:false});if(error)setMessage(error.message);else setGoals((data||[]) as Goal[]);setLoading(false);}
 useEffect(()=>{void load();},[]);
 async function add(e:React.FormEvent){e.preventDefault();if(!db||!title.trim())return;const {error}=await db.from("goals").insert({title:title.trim(),target_date:date||null});if(error)setMessage(error.message);else{setTitle("");setDate("");await load();}}
 async function progress(goal:Goal){if(!db)return;const value=Math.min(100,goal.progress+10);const {error}=await db.from("goals").update({progress:value,status:value===100?"completed":"active"}).eq("id",goal.id);if(error)setMessage(error.message);else await load();}
 return <div className="page"><div className="eyebrow">LIFE OS · DIREÇÃO</div><h1 className="page-title">Metas</h1><p className="page-subtitle">Transforme intenções em objetivos acompanháveis.</p>
 <div className="panel" style={{padding:16,marginTop:18}}><form onSubmit={add} style={{display:"grid",gap:9}}><input className="task-input" placeholder="Qual objetivo você quer alcançar?" value={title} onChange={e=>setTitle(e.target.value)}/><input className="task-input" type="date" value={date} onChange={e=>setDate(e.target.value)}/><div><button className="primary-btn"><Plus size={14}/> Criar meta</button></div></form></div>
 <div className="panel" style={{marginTop:14}}><div className="panel-head"><div className="panel-title">Objetivos em andamento</div><Target size={16}/></div>
 {loading?<div className="empty">Carregando metas...</div>:goals.length?goals.map(g=><div key={g.id} style={{padding:"14px 16px",borderTop:"1px solid #30353d"}}><div style={{display:"flex",justifyContent:"space-between",gap:12}}><strong style={{fontSize:12}}>{g.title}</strong><span style={{fontSize:10,color:"#83c9b9"}}>{g.progress}%</span></div><div className="progress-track" style={{marginTop:9}}><div className="progress-fill" style={{width:`${g.progress}%`}}/></div><div style={{display:"flex",justifyContent:"space-between",marginTop:8}}><span className="panel-hint">{g.target_date?new Date(g.target_date+"T12:00:00").toLocaleDateString("pt-BR"):"Sem prazo"} · {g.status==="completed"?"Concluída":"Em andamento"}</span><button className="ghost-btn" onClick={()=>progress(g)} disabled={g.progress>=100}>+10%</button></div></div>):<div className="empty">Nenhuma meta cadastrada. Crie a primeira acima.</div>}
 {message&&<p style={{padding:12,fontSize:10,color:"#e6a66b"}}>{message}</p>}</div></div>;
}
