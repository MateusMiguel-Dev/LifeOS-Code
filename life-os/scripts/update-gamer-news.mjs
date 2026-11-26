import { writeFile } from "node:fs/promises";

const feeds = [
  { source: "IGN", url: "https://www.ign.com/rss/v2/articles/feed" },
  { source: "PC Gamer", url: "https://www.pcgamer.com/rss/" },
  { source: "Eurogamer", url: "https://www.eurogamer.net/feed" },
  { source: "GameSpot", url: "https://www.gamespot.com/feeds/news/" },
];

function decode(value = "") {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">")
    .replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'")
    .replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n)))
    .replace(/&#x([\da-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16)));
}
function tag(block,name) {
  const match=block.match(new RegExp("<"+name+"(?:\\s[^>]*)?>([\\s\\S]*?)</"+name+">","i"));
  return match?decode(match[1]).replace(/<[^>]+>/g," ").replace(/\\s+/g," ").trim():"";
}
async function readFeed(feed) {
  const response=await fetch(feed.url,{headers:{"user-agent":"LIFE-OS-GamerRadar/1.0"},signal:AbortSignal.timeout(15000)});
  if(!response.ok) throw new Error(feed.source+" RSS: HTTP "+response.status);
  const xml=await response.text();
  const entries=[...xml.matchAll(/<(item|entry)(?:\\s[^>]*)?>[\\s\\S]*?<\\/\\1>/gi)].map(m=>m[0]);
  return entries.map(block=>{
    const title=tag(block,"title");
    const linkTag=block.match(/<link(?:\\s+href=["']([^"']+)["'][^>]*\\s*\/?>|>([^<]+)<\\/link>)/i);
    const url=decode(linkTag?.[1]||linkTag?.[2]||tag(block,"guid"));
    const published=tag(block,"pubDate")||tag(block,"published")||tag(block,"updated")||tag(block,"dc:date");
    const summary=tag(block,"description")||tag(block,"summary")||tag(block,"content:encoded");
    const date=new Date(published);
    return {title,url,source:feed.source,publishedAt:Number.isNaN(date.getTime())?null:date.toISOString(),summary:summary.slice(0,240)};
  }).filter(item=>item.title&&/^https?:\\/\\//.test(item.url));
}
const results=await Promise.allSettled(feeds.map(readFeed));
const items=results.flatMap(result=>result.status==="fulfilled"?result.value:[]);
const unique=[...new Map(items.map(item=>[item.url,item])).values()]
 .sort((a,b)=>(Date.parse(b.publishedAt||"")||0)-(Date.parse(a.publishedAt||"")||0)).slice(0,24);
if(!unique.length) throw new Error("Nenhum feed RSS respondeu; mantendo o último arquivo.");
await writeFile(new URL("../src/data/gamer-news.json",import.meta.url),JSON.stringify({updatedAt:new Date().toISOString(),items:unique},null,2)+"\\n");
console.log("Radar Gamer atualizado:",unique.length,"matérias");
