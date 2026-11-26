"use client";

import { useMemo } from "react";
import news from "@/data/gamer-news.json";
import { ArrowUpRight, Gamepad2, RefreshCw } from "lucide-react";

type NewsItem={title:string;url:string;source:string;publishedAt:string;summary:string};
export function GamerRadar(){
 const items=(news.items as NewsItem[]).slice(0,5);
 const updated=news.updatedAt?new Intl.DateTimeFormat("pt-BR",{dateStyle:"medium",timeStyle:"short"}).format(new Date(news.updatedAt)):"Aguardando primeira atualização";
 return <section className="panel section-gap" id="radar-gamer">
  <div className="panel-head"><div><div className="panel-title" style={{display:"flex",alignItems:"center",gap:8}}><Gamepad2 size={15}/> Radar Gamer</div><div className="panel-hint">Notícias recentes de fontes especializadas</div></div><span style={{fontSize:9,color:"#82928f",display:"flex",alignItems:"center",gap:5}}><RefreshCw size={11}/> {updated}</span></div>
  {items.length?items.map((item,i)=><article key={item.url} style={{padding:"11px 16px",borderTop:"1px solid #293638"}}>
   <div style={{fontSize:9,color:"#79cfc1",fontWeight:700,letterSpacing:".08em"}}>{item.source} · {item.publishedAt?new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"short"}).format(new Date(item.publishedAt)):""}</div>
   <a href={item.url} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"start",justifyContent:"space-between",gap:12,color:"#e0e9e5",fontSize:12,fontWeight:650,textDecoration:"none",marginTop:5}}>{item.title}<ArrowUpRight size={14} style={{flex:"none",color:"#82b9ae"}}/></a>
   {item.summary&&<p style={{fontSize:10,color:"#91a29d",lineHeight:1.55,margin:"5px 0 0"}}>{item.summary}</p>}
  </article>):<div className="empty">O Radar Gamer está preparado. A primeira atualização automática será feita pelo GitHub Actions; depois disso, as notícias aparecem aqui.</div>}
  <div style={{padding:"9px 16px",fontSize:9,color:"#6f8580"}}>Fontes: IGN, PC Gamer, Eurogamer e GameSpot. Links abrem as matérias originais.</div>
 </section>;
}
