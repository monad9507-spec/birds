"use client";

import { useState } from "react";
import { ArrowUpRight, Blocks, Coins, Layers3, ShieldCheck, Sparkles } from "lucide-react";
import SiteHeader from "../site-header";

type LaunchType = "nft" | "tokens";

const launchContent = {
  nft: {
    label: "NFT LAUNCHES",
    title: "New collections\nwill hatch here.",
    description: "A home for the next generation of NFT collections built on Ink.",
    icon: Layers3,
    points: ["Creator-first collection launches", "Mint pages built for the community", "Clear on-chain project information"],
    note: "The NFT side of BIRDSPAD is under development. First curated launches will be announced here.",
  },
  tokens: {
    label: "TOKEN LAUNCHES",
    title: "New tokens\nwill take flight here.",
    description: "A dedicated place for token launches from the InkBirds ecosystem and selected builders on Ink.",
    icon: Coins,
    points: ["Launch details in one clear place", "Official contracts and project links", "Transparent launch status and updates"],
    note: "The token side of BIRDSPAD is under development. No token launches are active yet.",
  },
};

export default function LaunchpadPage() {
  const [type, setType] = useState<LaunchType>("nft");
  const current = launchContent[type];
  const Icon = current.icon;

  return <div className="site-shell launchpad-page">
    <SiteHeader current="launchpad" />
    <main>
      <section className="launchpad-hero">
        <div>
          <p className="eyebrow">INKBIRDS ECOSYSTEM · ON INK</p>
          <h1>BIRDS<span>PAD</span></h1>
          <p className="launchpad-lead">The future launchpad for collections and tokens built on Ink.</p>
        </div>
        <div className="launchpad-status"><span className="status-dot" />UNDER DEVELOPMENT</div>
      </section>

      <section className="launchpad-switch" aria-label="Birdspad type">
        <button type="button" onClick={() => setType("nft")} aria-pressed={type === "nft"}><Blocks size={18}/> NFT Launches</button>
        <button type="button" onClick={() => setType("tokens")} aria-pressed={type === "tokens"}><Coins size={18}/> Token Launches</button>
      </section>

      <section className="launchpad-feature" key={type}>
        <div className="launchpad-copy">
          <div className="launch-icon"><Icon size={29}/></div>
          <p className="eyebrow">{current.label}</p>
          <h2>{current.title.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h2>
          <p>{current.description}</p>
          <ul>{current.points.map((point) => <li key={point}><Sparkles size={15}/>{point}</li>)}</ul>
        </div>
        <div className="launchpad-coming">
          <span>COMING SOON</span>
          <div className="launchpad-orbit"><Icon size={58}/></div>
          <strong>{type === "nft" ? "CURATED NFT LAUNCHES" : "CURATED TOKEN LAUNCHES"}</strong>
          <p>{current.note}</p>
        </div>
      </section>

      <section className="holder-note">
        <div className="holder-note-icon"><ShieldCheck size={24}/></div>
        <div><p className="eyebrow">BUILT WITH THE FLOCK IN MIND</p><h2>Platform fees will support transparent InkBirds holder mechanics.</h2></div>
        <p>Rules, allocation and activation details will be published clearly before any mechanism goes live. Nothing on this page is a promise of returns.</p>
      </section>

      <section className="launchpad-footer-note"><span>MORE IS BEING BUILT.</span><p>Follow <a href="https://x.com/inkbirdsnft?s=11" target="_blank" rel="noopener noreferrer">@inkbirdsnft <ArrowUpRight size={14}/></a> for BIRDSPAD updates.</p></section>
    </main>
  </div>;
}
