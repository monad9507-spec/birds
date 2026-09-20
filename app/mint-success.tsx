"use client";
import {useState} from "react";
import Link from "next/link";
import {ArrowUpRight,Check,ChevronDown} from "lucide-react";
import {Dialog,DialogContent,DialogDescription,DialogTitle} from "@/components/ui/dialog";
import {EXPLORER} from "@/lib/ink-contract";
import BirdCard from "./bird-card";
export type MintResult={ids:string[];hash:string;recipient:string};
export default function MintSuccess({result,onClose}:{result:MintResult|null;onClose:()=>void}){
  const [shown,setShown]=useState(12);const count=result?.ids.length??0;
  const share=`https://x.com/intent/post?${new URLSearchParams({text:`I just minted ${count} ${count===1?'Inkbird':'Inkbirds'} on Ink! 🦉\n@inkbirdsnft`,url:result?`${EXPLORER}/tx/${result.hash}`:''})}`;
  return <Dialog open={!!result} onOpenChange={open=>{if(!open){setShown(12);onClose();}}}><DialogContent className="mint-success-dialog"><div className="success-check"><Check size={24}/></div><p className="eyebrow">WELCOME TO THE FLOCK</p><DialogTitle className="success-title">{count===1?'Your bird has landed.':'Your birds have landed.'}</DialogTitle><DialogDescription className="success-description">{count} {count===1?'Inkbird was':'Inkbirds were'} minted to {result?.recipient.slice(0,6)}…{result?.recipient.slice(-4)}. Confirmed on Ink.</DialogDescription><div className="success-grid">{result?.ids.slice(0,shown).map(id=><BirdCard id={id} compact key={id}/>)}</div>{count>shown&&<button className="secondary-link" onClick={()=>setShown(x=>x+12)}>Show more birds ({count-shown}) <ChevronDown size={16}/></button>}<div className="success-actions"><Link href="/my-birds" className="mint-button" onClick={onClose}>View My Birds <ArrowUpRight size={18}/></Link><a href={share} className="share-button" target="_blank" rel="noopener noreferrer">Share on X <ArrowUpRight size={16}/></a></div><a className="success-transaction" href={result?`${EXPLORER}/tx/${result.hash}`:undefined} target="_blank" rel="noopener noreferrer">View confirmed transaction <ArrowUpRight size={14}/></a></DialogContent></Dialog>;
}
