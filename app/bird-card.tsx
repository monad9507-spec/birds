"use client";
import {useEffect,useState} from "react";
import {ArrowUpRight,RefreshCw} from "lucide-react";
import {readBird,openSeaBirdUrl,type Bird} from "@/lib/birds";
export default function BirdCard({id,compact=false}:{id:string;compact?:boolean}){
  const [bird,setBird]=useState<Bird|null>(null),[failed,setFailed]=useState(false),[attempt,setAttempt]=useState(0);
  useEffect(()=>{let active=true;setBird(null);setFailed(false);readBird(id).then(b=>{if(active)setBird(b);}).catch(()=>{if(active)setFailed(true);});return()=>{active=false;};},[id,attempt]);
  return <article className={`bird-card ${compact?'compact':''}`}><div className="bird-art">{bird?.image&&!failed?<img src={bird.image} alt={bird.name} loading="lazy" width="400" height="400" referrerPolicy="no-referrer" onError={()=>setFailed(true)}/>:<div className="bird-placeholder"><span>#{id}</span><p>{failed?'Artwork is not available yet.':'Loading your bird…'}</p>{failed&&<button onClick={()=>{setFailed(false);setAttempt(v=>v+1);}}><RefreshCw size={14}/> Retry artwork</button>}</div>}</div><div className="bird-card-body"><div className="bird-card-title"><h3>{bird?.name||`InkBirds #${id}`}</h3><a href={openSeaBirdUrl(id)} target="_blank" rel="noopener noreferrer" aria-label={`View InkBirds ${id} on OpenSea`}><ArrowUpRight size={19}/></a></div>{!compact&&bird?.traits.length? <div className="bird-traits">{bird.traits.slice(0,3).map((t,i)=><span key={`${t.label}-${i}`} title={`${t.label}: ${t.value}`}>{t.value}</span>)}</div>:null}</div></article>;
}
