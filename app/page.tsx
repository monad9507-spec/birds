"use client";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import MintPanel from "./mint-panel";
import SiteHeader from "./site-header";

export default function Home() {
  return <div className="site-shell">
    <SiteHeader/>
    <main><section className="intro"><div><p className="eyebrow">PIXEL BY PIXEL. BIRD BY BIRD.</p><h1>Meet your next<br/><span>little obsession.</span></h1></div><div className="intro-aside"><span className="chain-tag">ON INK</span><p>A flock of pixel personalities.<br/>Find a home for yours.</p></div></section>
    <section className="mint-layout" aria-label="Mint Inkbirds"><div className="art-column"><figure className="art-frame"><img src="/inkbirds.jpeg" alt="25 colorful pixel-art Inkbirds, wearing crowns, sunglasses, hats and hoodies" width="1254" height="1244"/><figcaption><span>THE INKBIRDS COLLECTION</span><span>BUILT DIFFERENT. TOGETHER.</span></figcaption></figure></div><MintPanel/></section>
    <div className="under-grid"><p>Different feathers. Same flock.</p><a href="https://opensea.io/collection/inkbirdsnft" target="_blank" rel="noopener noreferrer">Explore on OpenSea <ArrowUpRight size={18}/></a></div></main>
    <footer><span>INKBIRDS <span className="footer-year">© 2026</span></span><a href="https://explorer.inkonchain.com/address/0x41715938926CDd0D822F4727Db8F6a2a18E1A605" target="_blank" rel="noopener noreferrer">Contract: 0x4171…1A605 <ExternalLink size={14}/></a><span className="footer-chain">MADE OF PIXELS. HOME ON INK.</span></footer>
  </div>;
}
