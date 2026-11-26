"use client";

import { useEffect, useState } from "react";
import { Check, Plus, Repeat2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Habit={id:string;name:string;frequency:string;color:string};
type Entry={id:string;habit_id:string;completed_on:string};
function todayKey(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;}

export function Habits(){
 const [habits,setHabits]=useState<Habit[]>([]);
 const [entries,setEntries]=useState<Entry[]>([]);
 const [name,setName]=useState("");
 const [loading,setLoading]=useState(true);
 const [message,setMessage]=useState("");
 const db=createClient();
 async function load(){
  if(!db){setLoading(false);setMessage("Configure o Supabase para salvar seus hábitos.");return;}
  const [h,e]=await Promise.all([
   db.from("habits").select("id,name,frequency,color").eq("archived",false).order("created_at",{ascending:true}),
   db.from("habit_entries").select("id,habit_id,completed_on").eq("completed_on",todayKey())
  ]);
  if(h.error||e.error)setMessage(h.error?.message||e.error?.message||"Não foi possível carregar.");
  else{setHabits((h.data||[]) as Habit[]);setEntries((e.data||[]) as Entry[]);}
  setLoading(false);
 }
 useEffect(()=>{void load();},[]);
 async function add(event:React.FormEvent){event.preventDefault();if(!db||!name.trim())return;const {error}=await db.from("habits").insert({name:name.trim()});if(error)setMessage(error.message);else{setName("");await load();}}
 async function toggle(habit:Habit){
  if(!db)return;
  const entry=entries.find(e=>e.habit_id===habit.id);
  if(entry){const {error}=await db.from("habit_entries").delete().eq("id",entry.id);if(error)setMessage(error.message);}
  else{const {error}=await db.from("habit_entries").insert({habit_id:habit.id,completed_on:todayKey()});if(error)setMessage(error.message);}
  await load();
 }
 async function archive(habit:Habit){if(!db)return;const {error}=await db.from("habits").update({archived:true}).eq("id",habit.id);if(error)setMessage(error.message);else await load();}
 return <div className="page"><div className="eyebrow">LIFE OS · CONSISTÊNCIA</div><h1 className="page-title">Hábitos</h1><p className="page-subtitle">Pequenas ações, repetidas com intenção, constroem mudanças reais.</p>
  <div className="panel" style={{padding:16,marginTop:18}}><form onSubmit={add} style={{display:"flex",gap:9}}><input className="task-input" placeholder="Novo hábito (ex.: leitura, caminhada...)" value={name} onChange={e=>setName(e.target.value)}/><button className="primary-btn"><Plus size={14}/> Adicionar</button></form></div>
  <div className="panel" style={{marginTop:14}}><div className="panel-head"><div><div className="panel-title">Seu ritual de hoje</div><div className="panel-hint">{entries.length} de {habits.length} hábitos concluídos</div></div><Repeat2 size={16}/></div>
  {loading?<div className="empty">Carregando hábitos...</div>:habits.length?habits.map(h=><div className="task-row" key={h.id}><button className={entries.some(e=>e.habit_id===h.id)?"task-check done":"task-check"} onClick={()=>toggle(h)}>{entries.some(e=>e.habit_id===h.id)&&<Check size={12}/>}</button><div style={{flex:1}}><div className="task-name">{h.name}</div><div className="panel-hint">{h.frequency==="daily"?"Todos os dias":h.frequency==="weekdays"?"Dias úteis":"Semanal"}</div></div><button className="ghost-btn" onClick={()=>archive(h)}>Arquivar</button></div>):<div className="empty">Adicione seu primeiro hábito para começar a acompanhar a consistência.</div>}
  {message&&<p style={{padding:12,fontSize:10,color:"#e6a66b"}}>{message}</p>}
 </div>;
}
