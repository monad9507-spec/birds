"use client";
import type { AppKit } from "@reown/appkit";
import { useEffect,useState } from "react";
import type { Eip1193Provider } from "ethers";
// Public Reown project ID, preserved from the user's StonkRaccoons ARC source.
export const REOWN_PROJECT_ID="4f71172824a0ea69b0270161482356fe";
type WalletState={address:string|null;chainId:number|null;ready:boolean};
let snapshot:WalletState={address:null,chainId:null,ready:false};
let appPromise:Promise<AppKit>|null=null;
function notify(){window.dispatchEvent(new Event("inkbirds-wallet"));}
export function walletError(error:unknown){const message=error instanceof Error?error.message:"Could not open wallet connection. Please try again.";window.dispatchEvent(new CustomEvent("inkbirds-wallet-error",{detail:message}));}
export function getAppKit(){
  if(!appPromise)appPromise=(async()=>{
    const [{createAppKit},{EthersAdapter},{ink}]=await Promise.all([import("@reown/appkit"),import("@reown/appkit-adapter-ethers"),import("@reown/appkit/networks")]);
    const origin=window.location.origin;
    const app=createAppKit({adapters:[new EthersAdapter()],networks:[ink],defaultNetwork:ink,projectId:REOWN_PROJECT_ID,metadata:{name:"INKBIRDS",description:"Inkbirds NFT mint on Ink",url:origin,icons:[`${origin}/favicon.svg`]},themeMode:"dark",themeVariables:{"--w3m-accent":"#7863e5","--w3m-border-radius-master":"3px"},features:{analytics:false,email:false,socials:[],swaps:false,onramp:false}});
    app.subscribeAccount(account=>{snapshot={...snapshot,address:account.isConnected&&account.address?account.address:null,ready:true};notify();},"eip155");
    app.subscribeNetwork(network=>{snapshot={...snapshot,chainId:network.chainId?Number(network.chainId):null};notify();});
    snapshot={...snapshot,ready:true};notify();return app;
  })().catch(e=>{appPromise=null;throw e;});
  return appPromise;
}
export async function openWallet(){try{const app=await getAppKit();await app.open({view:app.getAddress()?"Account":"Connect"});}catch(e){walletError(e);}}
export async function getConnectedProvider(){const app=await getAppKit();return app.getWalletProvider() as Eip1193Provider|undefined;}
export async function switchToInk(){const app=await getAppKit();const {ink}=await import("@reown/appkit/networks");await app.switchNetwork(ink,{throwOnFailure:true});}
export function useWallet(){const [state,setState]=useState<WalletState>({address:null,chainId:null,ready:false});useEffect(()=>{const update=()=>setState({...snapshot});window.addEventListener("inkbirds-wallet",update);update();getAppKit().catch(walletError);return()=>window.removeEventListener("inkbirds-wallet",update);},[]);return state;}
