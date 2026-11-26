"use client";

import { useEffect, useState } from "react";
import { Sparkles, RotateCcw, CalendarDays, Eye } from "lucide-react";

type DailyCard = {
  id: string; numeral: string; name: string; symbol: string; color: string; glow: string;
  title: string; message: string; meaning: string; prompt: string; action: string;
};

const deck: DailyCard[] = [
  { id: "moon", numeral: "I", name: "A LUA", symbol: "☾", color: "#aab3b5", glow: "rgba(170,179,181,.14)", title: "Escute o que está em silêncio.", message: "Nem tudo precisa ser resolvido sob a luz do dia. Algumas respostas aparecem quando você desacelera e presta atenção ao que sente.", meaning: "Intuição, pausa e autoconhecimento. Hoje, observe antes de reagir e não confunda pressa com clareza.", prompt: "O que venho sentindo, mas ainda não parei para escutar?", action: "Reserve cinco minutos sem distrações e escreva o que está ocupando sua mente." },
  { id: "sky", numeral: "II", name: "O CÉU", symbol: "✧", color: "#65a9b6", glow: "rgba(71,151,166,.17)", title: "Permita-se enxergar mais longe.", message: "O caminho pode ser maior do que o cenário diante de você. Amplie a perspectiva: existe mais de uma maneira de chegar onde deseja.", meaning: "Possibilidades, visão e criatividade. Uma ideia merece espaço antes de ser descartada.", prompt: "Qual possibilidade eu ainda não considerei?", action: "Anote uma alternativa diferente para um desafio atual." },
  { id: "sun", numeral: "III", name: "O SOL", symbol: "✺", color: "#e8ca58", glow: "rgba(232,202,88,.16)", title: "Não diminua a própria luz.", message: "Há momentos de agir com confiança e deixar seu esforço aparecer. Reconheça o que já construiu, mesmo que ainda não tenha chegado ao destino.", meaning: "Vitalidade, coragem e expressão. Hoje favorece iniciativa e conversas honestas.", prompt: "Em que parte da minha vida preciso confiar mais no meu potencial?", action: "Dê o primeiro passo em algo que você vem adiando por insegurança." },
  { id: "earth", numeral: "IV", name: "A TERRA", symbol: "⌁", color: "#8da96b", glow: "rgba(141,169,107,.16)", title: "Volte ao que é essencial.", message: "Grandes mudanças também nascem de gestos pequenos. Cuide da base, organize o que está ao seu alcance e respeite seu próprio ritmo.", meaning: "Estabilidade, presença e construção. Consistência vale mais do que intensidade passageira.", prompt: "Qual pequeno hábito sustentaria melhor a vida que quero construir?", action: "Organize um espaço ou conclua uma tarefa simples que está pendente." },
  { id: "ocean", numeral: "V", name: "O OCEANO", symbol: "≋", color: "#7298bd", glow: "rgba(114,152,189,.16)", title: "Flua sem abandonar sua direção.", message: "Você pode mudar a rota sem perder seu propósito. Nem toda resistência precisa ser vencida; algumas pedem adaptação.", meaning: "Emoções, flexibilidade e renovação. Acolha o que sente sem deixar que um momento defina tudo.", prompt: "Onde estou insistindo em controlar algo que pede adaptação?", action: "Escolha uma coisa fora do seu controle e direcione sua energia para o que depende de você." },
  { id: "stars", numeral: "VI", name: "AS ESTRELAS", symbol: "✧", color: "#b49bbd", glow: "rgba(180,155,189,.16)", title: "Continue, mesmo sem ver tudo.", message: "Você não precisa conhecer o caminho inteiro para dar o próximo passo. Confie no processo que está construindo, um movimento de cada vez.", meaning: "Esperança, propósito e orientação. Relembre por que começou antes de medir o quanto falta.", prompt: "Que sonho merece continuar recebendo minha atenção?", action: "Faça hoje uma ação de dez minutos em direção a uma meta importante." },
];

const storageKey = "lifeos-oraculo-v1";
function localDateKey() {
  const d = new Date();
  return [d.getFullYear(), String(d.getMonth()+1).padStart(2,"0"), String(d.getDate()).padStart(2,"0")].join("-");
}
type SavedDraw = { date: string; id: string };

export function DailyOracle() {
  const [today, setToday] = useState("");
  const [drawn, setDrawn] = useState<DailyCard | null>(null);
  const [history, setHistory] = useState<SavedDraw[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const date = localDateKey();
    setToday(date);
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]") as SavedDraw[];
      setHistory(saved);
      const current = saved.find((item) => item.date === date);
      if (current) setDrawn(deck.find((card) => card.id === current.id) || null);
    } catch { setHistory([]); }
  }, []);

  function drawCard() {
    if (!today || drawn) return;
    const card = deck[Math.floor(Math.random() * deck.length)];
    const next = [{ date: today, id: card.id }, ...history.filter((item) => item.date !== today)].slice(0, 90);
    setDrawn(card);
    setHistory(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* storage may be unavailable */ }
  }

  const historyCards = history.filter((item) => item.date !== today).slice(0, 7);
  return (
    <section className="oracle-panel">
      <div className="oracle-heading">
        <div>
          <div className="oracle-kicker"><Sparkles size={13}/> RITUAL DIÁRIO</div>
          <h2>Oráculo do dia</h2>
          <p>Uma carta. Uma pausa. Uma nova perspectiva.</p>
        </div>
        <button className="oracle-history-toggle" onClick={() => setShowHistory((v) => !v)}><CalendarDays size={14}/> Histórico</button>
      </div>
      <div className="oracle-stage">
        {!drawn ? (
          <div className="oracle-undrawn">
            <div className="oracle-card-back" aria-hidden="true">
              <div className="oracle-card-frame"><span className="oracle-back-number">✧</span><span className="oracle-back-symbol">☼</span><span className="oracle-back-caption">LIFE OS · ORÁCULO</span></div>
            </div>
            <div className="oracle-invitation">
              <span className="oracle-date">{today ? new Intl.DateTimeFormat("pt-BR",{day:"numeric",month:"long",year:"numeric"}).format(new Date(today + "T12:00:00")) : "Seu momento de hoje"}</span>
              <h3>O que o dia tem a revelar?</h3>
              <p>Respire fundo, escolha estar presente e revele sua carta.</p>
              <button className="oracle-draw-button" onClick={drawCard} disabled={!today}><Sparkles size={15}/> Tirar minha carta</button>
              <span className="oracle-once"><Eye size={12}/> Uma tiragem por dia</span>
            </div>
          </div>
        ) : (
          <div className="oracle-revealed" style={{["--oracle-color" as string]:drawn.color,["--oracle-glow" as string]:drawn.glow}}>
            <div className="oracle-card-face">
              <div className="oracle-card-inner">
                <div className="oracle-card-top"><span>{drawn.numeral}</span><span>✧</span></div>
                <div className="oracle-art"><div className="oracle-art-orbit"/><span>{drawn.symbol}</span><div className="oracle-art-line"/></div>
                <div className="oracle-card-bottom">{drawn.name}</div>
              </div>
            </div>
            <div className="oracle-reading">
              <span className="oracle-reveal-label">SUA CARTA DE HOJE</span>
              <h3>{drawn.title}</h3>
              <p className="oracle-message">“{drawn.message}”</p>
              <div className="oracle-meaning"><strong>Significado</strong><p>{drawn.meaning}</p></div>
              <div className="oracle-meaning"><strong>Para refletir</strong><p>{drawn.prompt}</p></div>
              <div className="oracle-action"><strong>Pequeno ritual de hoje</strong><p>{drawn.action}</p></div>
              <span className="oracle-locked"><RotateCcw size={12}/> Carta registrada · Volte amanhã para uma nova tiragem</span>
            </div>
          </div>
        )}
      </div>
      {showHistory && <div className="oracle-history"><strong>Cartas anteriores</strong>{historyCards.length ? historyCards.map((item) => { const card=deck.find((entry)=>entry.id===item.id); return card ? <div className="oracle-history-row" key={item.date}><span style={{color:card.color}}>{card.symbol}</span><span>{card.name}</span><time>{new Intl.DateTimeFormat("pt-BR",{day:"2-digit",month:"short"}).format(new Date(item.date + "T12:00:00"))}</time></div> : null; }) : <p>Suas cartas anteriores aparecerão aqui depois da primeira tiragem.</p>}</div>}
      <div className="oracle-footnote">As cartas são convites à reflexão e ao autoconhecimento — não previsões do futuro.</div>
    </section>
  );
}
