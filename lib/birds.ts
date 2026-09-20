import {isAddress,ZeroAddress} from "ethers";
import {CONTRACT,EXPLORER,contractInterface,readContractSnapshot} from "./ink-contract";

export type Bird = {id:string;name:string;image:string|null;traits:{label:string;value:string}[]};
export type MintReceipt = {status:number|null;hash?:string;logs:readonly {address:string;topics:readonly string[];data:string}[]};
export function mintedBirdIds(receipt:MintReceipt,recipient:string):string[]{
  if(receipt.status!==1||!isAddress(recipient))return[];
  const ids=new Set<string>();
  for(const log of receipt.logs){
    if(log.address.toLowerCase()!==CONTRACT.toLowerCase())continue;
    try{const event=contractInterface.parseLog({topics:[...log.topics],data:log.data});
      if(event?.name==="Transfer"&&event.args.from===ZeroAddress&&event.args.to.toLowerCase()===recipient.toLowerCase())ids.add(event.args.tokenId.toString());
    }catch{/* Other contract events are not minted birds. */}
  }
  return [...ids];
}
export async function readOwnedBirds(address:string){
  if(!isAddress(address))throw new Error("Connect a valid Ethereum wallet.");
  const {results,block}=await readContractSnapshot([["tokensOfOwner",[address]]]);
  return {ids:(results[0][0] as bigint[]).map(String).sort((a,b)=>Number(b)-Number(a)),block};
}
export function safeImageUrl(value:unknown):string|null{
  if(typeof value!=="string")return null;
  const normalized=value.startsWith("ipfs://")?`https://ipfs.io/ipfs/${value.slice(7).replace(/^ipfs\//,"")}`:value;
  try{const url=new URL(normalized);if(url.protocol!=="https:"||url.username||url.password)return null;return url.href;}catch{return null;}
}
export function openSeaBirdUrl(id:string){return `https://opensea.io/assets/ink/${CONTRACT}/${encodeURIComponent(id)}`;}
const metadataCache=new Map<string,{until:number;bird:Bird}>();
const pending=new Map<string,Promise<Bird>>();
// Limit metadata concurrency even when a wallet owns hundreds of NFTs.
let running=0;const queue:(()=>void)[]=[];
async function scheduled<T>(task:()=>Promise<T>):Promise<T>{if(running>=4)await new Promise<void>(resolve=>queue.push(resolve));running++;try{return await task();}finally{running--;queue.shift()?.();}}
export async function readBird(id:string):Promise<Bird>{
  if(!/^\d{1,10}$/.test(id)||BigInt(id)<1n)throw new Error("Invalid bird number.");
  const cached=metadataCache.get(id);if(cached&&cached.until>Date.now())return cached.bird;
  if(pending.has(id))return pending.get(id)!;
  const job=scheduled(async()=>{
    const response=await fetch(`${EXPLORER}/api/v2/tokens/${CONTRACT}/instances/${id}`,{signal:AbortSignal.timeout(12000)});
    if(!response.ok)throw new Error("Artwork is not available yet.");
    const data=await response.json() as {metadata?:{name?:unknown;image?:unknown;attributes?:{trait_type?:unknown;value?:unknown}[]};image_url?:unknown};
    const m=data.metadata;
    const bird:Bird={id,name:typeof m?.name==="string"?m.name.slice(0,100):`InkBirds #${id}`,image:safeImageUrl(m?.image)||safeImageUrl(data.image_url),traits:Array.isArray(m?.attributes)?m.attributes.slice(0,12).filter(t=>typeof t.trait_type==="string"&&(typeof t.value==="string"||typeof t.value==="number")).map(t=>({label:String(t.trait_type).slice(0,50),value:String(t.value).slice(0,100)})):[]};
    if(!bird.image)throw new Error("Artwork is still being indexed.");
    if(metadataCache.size>500)metadataCache.clear();metadataCache.set(id,{until:Date.now()+60000,bird});return bird;
  });pending.set(id,job);try{return await job;}finally{pending.delete(id);}
}
