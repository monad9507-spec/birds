import Link from "next/link";
import { ArrowUpRight, Bird, ExternalLink, GalleryHorizontal, Grid2X2, Layers3, Sparkles } from "lucide-react";
import SiteHeader from "./site-header";

const destinations = [
  { href: "/my-birds", icon: Bird, title: "My Birds", text: "Connect your wallet and see every InkBird in your flock.", cta: "View my Birds" },
  { href: "/gallery", icon: GalleryHorizontal, title: "Gallery", text: "Explore the entire 10,000-piece InkBirds collection.", cta: "Explore Gallery" },
  { href: "/grid-builder", icon: Grid2X2, title: "Grid Builder", text: "Create a personal collage from the Birds in your wallet.", cta: "Build a grid" },
  { href: "/launchpad", icon: Layers3, title: "BIRDSPAD", text: "The future launchpad for collections and tokens built on Ink.", cta: "Enter BIRDSPAD", featured: true },
];

export default function Home() {
  return <div className="site-shell home-page">
    <SiteHeader current="home" />
    <main>
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="eyebrow">THE FLOCK IS COMPLETE · ON INK</p>
          <h1>10,000 BIRDS.<br/><span>SOLD OUT.</span></h1>
          <p className="home-lead">The collection is complete. Now we build what comes next for the flock.</p>
          <div className="hero-actions">
            <a className="primary-action" href="https://opensea.io/collection/inkbirdsnft" target="_blank" rel="noopener noreferrer">Explore on OpenSea <ArrowUpRight size={17}/></a>
            <Link className="secondary-action" href="/gallery">View Gallery</Link>
          </div>
          <div className="home-stats" aria-label="Collection status"><div><strong>10,000 / 10,000</strong><span>Minted</span></div><div><strong>SOLD OUT</strong><span>Collection status</span></div><div><strong>INK</strong><span>Home chain</span></div></div>
        </div>
        <figure className="home-hero-art"><img src="/inkbirds-sold-out.png" alt="InkBirds pixel-art flock celebrating a sold-out collection" width="1680" height="940"/></figure>
      </section>

      <section className="home-destinations">
        <div className="section-heading"><div><p className="eyebrow">KEEP EXPLORING</p><h2>Built for the flock<span>.</span></h2></div><p>Everything around InkBirds now lives in one place.</p></div>
        <div className="destination-grid">{destinations.map(({href,icon:Icon,title,text,cta,featured}) => <Link href={href} className={`destination-card ${featured ? "destination-featured" : ""}`} key={title}><span className="destination-icon"><Icon size={25}/></span><h3>{title}</h3><p>{text}</p><span className="destination-cta">{cta} <ArrowUpRight size={16}/></span></Link>)}</div>
      </section>

      <section className="utility-panel"><div className="utility-mark"><Sparkles size={27}/></div><div><p className="eyebrow">BUILT WITH THE FLOCK IN MIND</p><h2>Real utility for InkBirds holders has been part of the collection’s vision from day one.</h2></div><p>New tools and transparent holder mechanics are being prepared. Rules, allocation and activation details will be published clearly before anything goes live.</p></section>

      <section className="next-section"><div className="section-heading"><div><p className="eyebrow">WHAT’S NEXT</p><h2>The next chapter<span>.</span></h2></div><span className="development-tag">IN DEVELOPMENT</span></div><div className="next-grid"><article><span>01</span><h3>BIRDSPAD</h3><p>A launchpad for curated NFT collections and tokens built on Ink.</p></article><article><span>02</span><h3>Holder mechanics</h3><p>Clear rules and tools designed around the complete InkBirds collection.</p></article><article><span>03</span><h3>Community tools</h3><p>More ways for the flock to create, collect and connect.</p></article></div></section>
    </main>
    <footer><span>INKBIRDS <span className="footer-year">© 2026</span></span><a href="https://explorer.inkonchain.com/address/0x41715938926CDd0D822F4727Db8F6a2a18E1A605" target="_blank" rel="noopener noreferrer">Contract: 0x4171…1A605 <ExternalLink size={14}/></a><span className="footer-chain">MADE OF PIXELS. HOME ON INK.</span></footer>
  </div>;
}
