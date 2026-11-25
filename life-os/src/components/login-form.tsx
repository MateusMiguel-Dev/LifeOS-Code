"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sparkles } from "lucide-react";

export function LoginForm() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [mode,setMode]=useState<"login"|"signup">("login");
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);
  const router=useRouter();
  async function submit(e:React.FormEvent){
    e.preventDefault();setMessage("");
    const sb=createClient();
    if(!sb){setMessage("Configure as variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY nas Variables do GitHub Actions.");return;}
    setBusy(true);
    const result=mode==="login"
      ? await sb.auth.signInWithPassword({email,password})
      : await sb.auth.signUp({email,password});
    setBusy(false);
    if(result.error){setMessage(result.error.message);return;}
    if(mode==="signup"&&!result.data.session){setMessage("Cadastro iniciado. Verifique seu e-mail para confirmar a conta.");return;}
    router.push("/dashboard");router.refresh();
  }
  return <main style={{minHeight:"100vh",display:"grid",placeItems:"center",padding:20,background:"radial-gradient(ellipse at 50% 0%,#211a36 0%,#0b0b10 55%)"}}>
    <div className="panel" style={{width:"100%",maxWidth:410,padding:30}}>
      <div style={{display:"flex",alignItems:"center",gap:10,justifyContent:"center",marginBottom:30}}>
        <div className="brand-mark">L</div><strong style={{letterSpacing:".14em"}}>LIFE OS</strong>
      </div>
      <div className="eyebrow" style={{textAlign:"center"}}>PERSONAL COMMAND CENTER</div>
      <h1 style={{fontSize:25,textAlign:"center",margin:"10px 0 7px"}}>{mode==="login"?"Bom ter você de volta.":"Comece sua jornada."}</h1>
      <p className="page-subtitle" style={{textAlign:"center",marginBottom:24}}>{mode==="login"?"Entre para organizar seu próximo capítulo.":"Crie sua conta para começar a organizar sua rotina."}</p>
      <form onSubmit={submit} style={{display:"grid",gap:12}}>
        <label style={{fontSize:11,color:"#aaa"}}>E-mail<input className="task-input" style={{marginTop:7}} type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@email.com"/></label>
        <label style={{fontSize:11,color:"#aaa"}}>Senha<input className="task-input" style={{marginTop:7}} type="password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mínimo de 6 caracteres"/></label>
        {message&&<p style={{fontSize:11,color:"#c6b4ff",lineHeight:1.5}}>{message}</p>}
        <button className="primary-btn" disabled={busy} style={{justifyContent:"center",padding:12,marginTop:5}}>{busy?"Aguarde...":mode==="login"?"Entrar":"Criar conta"} <Sparkles size={14}/></button>
      </form>
      <p style={{fontSize:11,color:"#858596",textAlign:"center",marginTop:20}}>{mode==="login"?"Ainda não tem uma conta?":"Já possui uma conta?"} <button onClick={()=>{setMode(mode==="login"?"signup":"login");setMessage("");}} style={{border:0,background:"none",color:"#b8a5ff",fontWeight:700}}>{mode==="login"?"Criar conta":"Fazer login"}</button></p>
    </div>
  </main>;
}