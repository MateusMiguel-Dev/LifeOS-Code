"use client";
import { useEffect, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Task } from "@/types/database";

const examples:Task[]=[
 {id:"demo-a",title:"Definir as prioridades do dia",priority:"high",completed:false},
 {id:"demo-b",title:"Separar 30 minutos para leitura",priority:"medium",completed:false},
 {id:"demo-c",title:"Organizar pendências pessoais",priority:"low",completed:true}
];
export function Tasks(){
 const [tasks,setTasks]=useState<Task[]>(examples);
 const [title,setTitle]=useState("");
 const [ready,setReady]=useState(false);
 const [supabaseEnabled,setSupabaseEnabled]=useState(false);
 useEffect(()=>{const sb=createClient();if(!sb){setReady(true);return;}setSupabaseEnabled(true);sb.from("tasks").select("*").order("created_at",{ascending:false}).then(({data,error})=>{if(!error&&data)setTasks(data as Task[]);setReady(true);});},[]);
 async function addTask(e:React.FormEvent){e.preventDefault();if(!title.trim())return;const sb=createClient();if(sb){const {data,error}=await sb.from("tasks").insert({title:title.trim(),priority:"medium"}).select().single();if(!error&&data)setTasks(t=>[data as Task,...t]);}else setTasks(t=>[{id:`demo-${Date.now()}`,title:title.trim(),priority:"medium",completed:false},...t]);setTitle("");}
 async function toggle(t:Task){const completed=!t.completed;setTasks(old=>old.map(x=>x.id===t.id?{...x,completed}:x));if(supabaseEnabled&&!t.id.startsWith("demo-"))await createClient()?.from("tasks").update({completed}).eq("id",t.id);}
 async function remove(t:Task){setTasks(old=>old.filter(x=>x.id!==t.id));if(supabaseEnabled&&!t.id.startsWith("demo-"))await createClient()?.from("tasks").delete().eq("id",t.id);}
 return <div className="page"><div className="eyebrow">WORKSPACE · ORGANIZAÇÃO</div><h1 className="page-title">Tarefas</h1><p className="page-subtitle">Tire as ideias da cabeça e transforme em próximos passos.</p>
 <div className="panel" style={{padding:18,marginTop:25}}><form onSubmit={addTask} style={{display:"flex",gap:9}}><input className="task-input" placeholder="Qual é a próxima coisa que você precisa fazer?" value={title} onChange={e=>setTitle(e.target.value)}/><button className="primary-btn" type="submit"><Plus size={15}/> Adicionar</button></form></div>
 <div className="panel" style={{marginTop:16}}><div className="panel-head"><div><div className="panel-title">Sua lista</div><div className="panel-hint">{tasks.filter(t=>!t.completed).length} pendentes · {tasks.filter(t=>t.completed).length} concluídas</div></div></div>
 {!ready?<div className="empty">Carregando...</div>:tasks.length?tasks.map(t=><div className="task-row" key={t.id}><button className={`task-check ${t.completed?"done":""}`} onClick={()=>toggle(t)}>{t.completed&&<Check size={12}/>}</button><span className={`task-name ${t.completed?"done":""}`}>{t.title}</span><button aria-label="Excluir tarefa" onClick={()=>remove(t)} style={{marginLeft:"auto",background:"transparent",border:0,color:"#777789"}}><Trash2 size={14}/></button></div>):<div className="empty">Sua lista está vazia. Adicione a primeira tarefa acima.</div>}
 </div>{!supabaseEnabled&&<p style={{fontSize:10,color:"#666678",marginTop:15}}>Dados temporários neste navegador de demonstração. Configure o Supabase para persistência.</p>}</div>;
}