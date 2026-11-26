"use client";
import { useEffect,useState } from "react";
import { createClient } from "@/lib/supabase/client";
type Mode="calendar"|"reminders"|"finance"|"notes";
type Item={id:string;title:string;details?:string;starts_at?:string;remind_at?:string;due_date?:string;amount?:number;completed?:boolean;paid_at?:string;content?:string};
const config={calendar:{title:"Calendário",subtitle:"Seus compromissos em um só lugar.",table:"calendar_events",date:"starts_at",placeholder:"Nome do compromisso",button:"Adicionar evento"},reminders:{title:"Lembretes",subtitle:"Tire as pendências da cabeça e coloque no radar.",table:"reminders",date:"remind_at",placeholder:"O que você não pode esquecer?",button:"Criar lembrete"},finance:{title:"Pagamentos",subtitle:"Acompanhe vencimentos e evite surpresas.",table:"payments",date:"due_date",placeholder:"Nome da conta ou pagamento",button:"Adicionar pagamento"},notes:{title:"Anotações",subtitle:"Guarde ideias, decisões e informações importantes.",table:"notes",date:"updated_at",placeholder:"Título da anotação",button:"Criar anotação"}} as const;
export function DailyModule({mode}:{mode:Mode}){
 const c=config[mode];const [items,setItems]=useState<Item[]>([]);const [title,setTitle]=useState("");const [date,setDate]=useState("");const [amount,setAmount]=useState("");const [details,setDetails]=useState("");const [busy,setBusy]=useState(true);const [message,setMessage]=useState("");
 const db=createClient();
 async function load(){if(!db){setBusy(false);setMessage("Configure o Supabase para salvar e sincronizar seus dados.");return;}const {data,error}=await db.from(c.table).select("*").order(c.date,{ascending:true}).limit(100);if(error)setMessage(error.message);else setItems((data||[]) as Item[]);setBusy(false);}
 useEffect(()=>{void load();},[]);
 async function add(){if(!db||!title.trim()||!date)return;setMessage("");const payload:any={title:title.trim(),details};payload[c.date]=mode==="finance"?date:new Date(date).toISOString();if(mode==="finance")payload.amount=Number(amount||0);if(mode==="notes")payload.content=details;const {error}=await db.from(c.table).insert(payload);if(error){setMessage(error.message);return;}setTitle("");setDetails("");setDate("");setAmount("");await load();}
 async function finish(item:Item){if(!db)return;const patch=mode==="reminders"?{completed:!item.completed}:mode==="finance"?{paid_at:item.paid_at?null:new Date().toISOString()}:null;if(!patch)return;const {error}=await db.from(c.table).update(patch).eq("id",item.id);if(error)setMessage(error.message);else await load();}
 async function remove(id:string){if(!db)return;const {error}=await db.from(c.table).delete().eq("id",id);if(error)setMessage(error.message);else await load();}
 return <div className="page"><div className="eyebrow">LIFE OS · ORGANIZAÇÃO PESSOAL</div><h1 className="page-title">{c.title}</h1><p className="page-subtitle">{c.subtitle}</p>
 <div className="panel" style={{padding:16,marginTop:18,display:"grid",gap:9}}>
 <strong style={{fontSize:12}}>{c.button}</strong><input className="task-input" value={title} onChange={e=>setTitle(e.target.value)} placeholder={c.placeholder}/>
 <input className="task-input" type={mode==="finance"?"date":"datetime-local"} value={date} onChange={e=>setDate(e.target.value)}/>
 {mode==="finance"&&<input className="task-input" type="number" min="0" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Valor em R$"/>}
 <textarea className="task-input" value={details} onChange={e=>setDetails(e.target.value)} placeholder={mode==="notes"?"Escreva sua anotação...":"Detalhes (opcional)"} rows={3}/>
 <div><button className="primary-btn" onClick={add}>{c.button}</button></div>{message&&<p style={{fontSize:11,color:"#e6a66b"}}>{message}</p>}</div>
 <div className="panel" style={{marginTop:12}}><div className="panel-head"><strong className="panel-title">Seus registros</strong><span className="panel-hint">{items.length} itens</span></div>
 {busy?<div className="empty">Carregando...</div>:items.length===0?<div className="empty">Ainda não há registros. Adicione o primeiro acima.</div>:items.map(item=><div className="task-row" key={item.id}>
 {(mode==="reminders"||mode==="finance")&&<button className={((mode==="reminders"&&item.completed)||(mode==="finance"&&item.paid_at))?"task-check done":"task-check"} onClick={()=>finish(item)}>{((mode==="reminders"&&item.completed)||(mode==="finance"&&item.paid_at))?"✓":""}</button>}
 <div style={{minWidth:0,flex:1}}><div className={item.completed||item.paid_at?"task-name done":"task-name"}>{item.title}</div><div className="panel-hint">{item[c.date as keyof Item]?new Date(String(item[c.date as keyof Item])).toLocaleString("pt-BR",{dateStyle:"short",...(mode==="finance"?{}:{timeStyle:"short" as const})}):""}{item.amount!==undefined?" · "+Number(item.amount).toLocaleString("pt-BR",{style:"currency",currency:"BRL"}):""}</div></div>
 <button className="ghost-btn" onClick={()=>remove(item.id)}>Excluir</button></div>)}</div></div>
}
