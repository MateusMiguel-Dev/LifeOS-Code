"use client";

import { useEffect, useState } from "react";
import { Bell, BellRing, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const notifiedKey = "lifeos-notified-reminders-v1";

function decodeVapidKey(value:string){const padding="=".repeat((4-value.length%4)%4);const raw=atob((value+padding).replace(/-/g,"+").replace(/_/g,"/"));return Uint8Array.from(raw,(char)=>char.charCodeAt(0));}

export function Topbar() {
  const [date,setDate]=useState("");
  const [permission,setPermission]=useState<NotificationPermission|"unsupported">("unsupported");
  const [pending,setPending]=useState(0);
  const [notice,setNotice]=useState("");

  useEffect(()=>{
    setDate(new Intl.DateTimeFormat("pt-BR",{weekday:"long",day:"2-digit",month:"long"}).format(new Date()));
    if("Notification" in window) setPermission(Notification.permission);
    if("serviceWorker" in navigator) void navigator.serviceWorker.register(`${process.env.NEXT_PUBLIC_BASE_PATH||""}/sw.js`).catch(()=>{});
    const check=async()=>{
      const db=createClient();
      if(!db)return;
      const {data,error}=await db.from("reminders").select("id,title,remind_at").eq("completed",false).lte("remind_at",new Date().toISOString()).limit(20);
      if(error||!data)return;
      setPending(data.length);
      if(!("Notification" in window)||Notification.permission!=="granted")return;
      let sent:string[]=[];
      try{sent=JSON.parse(localStorage.getItem(notifiedKey)||"[]") as string[];}catch{}
      const fresh=data.filter(item=>!sent.includes(item.id));
      for(const item of fresh){
        new Notification("LIFE OS · Lembrete",{body:item.title,icon:"/LifeOS-Code/icon-192.png",tag:item.id});
        sent.push(item.id);
      }
      if(fresh.length) localStorage.setItem(notifiedKey,JSON.stringify(sent.slice(-200)));
    };
    void check();
    const timer=window.setInterval(()=>void check(),60_000);
    return ()=>window.clearInterval(timer);
  },[]);

  async function enableNotifications(){
    if(!("Notification" in window)){setNotice("Este navegador não oferece notificações.");return;}
    const result=await Notification.requestPermission();
    setPermission(result);
    if(result!=="granted"){setNotice(result==="denied"?"Permissão bloqueada nas configurações do navegador.":"Permissão não concedida.");return;}
    if("serviceWorker" in navigator){
      try{
        const registration=await navigator.serviceWorker.register(`${process.env.NEXT_PUBLIC_BASE_PATH||""}/sw.js`);
        const vapid=process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        const db=createClient();
        if(vapid&&db){
          const {data:userData}=await db.auth.getUser();
          if(userData.user){
            const subscription=await registration.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:decodeVapidKey(vapid)});
            const json=subscription.toJSON();
            const {error}=await db.from("push_subscriptions").upsert({user_id:userData.user.id,endpoint:json.endpoint,p256dh:json.keys?.p256dh,auth:json.keys?.auth},{onConflict:"endpoint"});
            if(error)throw error;
            setNotice("Notificações push configuradas neste dispositivo.");
            return;
          }
        }
        setNotice("Notificações ativadas enquanto o LIFE OS estiver aberto. Push com o site fechado depende da configuração VAPID e do serviço Supabase.");
      }catch(error){setNotice(error instanceof Error?error.message:"Não foi possível configurar push neste navegador.");}
    }else setNotice("Notificações ativadas enquanto o LIFE OS estiver aberto.");
  }

  return <header className="topbar">
    <div className="topbar-date">{date?date.charAt(0).toUpperCase()+date.slice(1):""}</div>
    <div style={{display:"flex",alignItems:"center",gap:18}}>
      <button aria-label="Buscar" title="Busca (em breve)" style={{background:"transparent",border:0,color:"#88889a"}}><Search size={17}/></button>
      <button aria-label="Ativar notificações" title={permission==="granted"?"Notificações ativadas":"Ativar notificações"} onClick={enableNotifications} style={{position:"relative",background:"transparent",border:0,color:permission==="granted"?"#72cbbb":"#aeb5bf",cursor:"pointer"}}>
        {permission==="granted"?<BellRing size={17}/>:<Bell size={17}/>}
        {pending>0&&<span style={{position:"absolute",right:-7,top:-7,minWidth:15,height:15,borderRadius:99,background:"#e6a66b",color:"#171b1c",fontSize:9,fontWeight:800,display:"grid",placeItems:"center"}}>{pending>9?"9+":pending}</span>}
      </button>
      <div className="avatar">U</div>
    </div>
    {notice&&<div role="status" onClick={()=>setNotice("")} style={{position:"absolute",right:18,top:52,zIndex:20,padding:"9px 12px",border:"1px solid #34514e",borderRadius:8,background:"#152321",color:"#d7e9e3",fontSize:10,cursor:"pointer"}}>{notice}</div>}
  </header>;
}
