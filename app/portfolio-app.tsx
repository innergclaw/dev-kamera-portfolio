"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { hero, library, type LibraryItem } from "../data/library";
import { HeroGalleryScrollAnimation } from "../components/blocks/hero-gallery-scroll-animation";

const shotSlides = [
  { id: "shot-01", label: "Shot 01", note: "Editorial detail", image: "/shots/shot-01.jpg", tone: "linear-gradient(135deg, #4b4b4b, #161616)" },
  { id: "shot-02", label: "Shot 02", note: "Nightlife", image: "/shots/shot-02.jpg", tone: "linear-gradient(135deg, #6a625c, #1b1b1b)" },
  { id: "shot-03", label: "Shot 03", note: "Still life", image: "/shots/shot-03.jpg", tone: "linear-gradient(135deg, #3f4b4e, #121212)" },
  { id: "shot-04", label: "Shot 04", note: "Portrait", image: "/shots/shot-04.jpg", tone: "linear-gradient(135deg, #5b515e, #151515)" },
  { id: "shot-05", label: "Shot 05", note: "Portrait", image: "/shots/shot-05.jpg", tone: "linear-gradient(135deg, #33404a, #111)" },
  { id: "shot-06", label: "Shot 06", note: "Event coverage", image: "/shots/shot-06.jpg", tone: "linear-gradient(135deg, #713125, #161616)" },
  { id: "shot-07", label: "Shot 07", note: "Editorial portrait", image: "/shots/shot-07.jpg", tone: "linear-gradient(135deg, #6d7273, #171717)" },
  { id: "shot-08", label: "Shot 08", note: "Food and lifestyle", image: "/shots/shot-08.jpg", tone: "linear-gradient(135deg, #63462d, #171717)" },
];

function assetPath(path: string) {
  return path.replace(/^\/+/, "");
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 24); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  return <header className={`site-nav ${scrolled ? "site-nav-scrolled" : ""}`}><a className="wordmark" href="#top">Dev Kamera</a><nav aria-label="Primary navigation"><a href="#library">Library</a><a href="#about">About</a><a href="#work-with-me">Work With Me</a></nav></header>;
}

function Hero({ onPlay }: { onPlay: () => void }) {
  const [muted, setMuted] = useState(true); const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => { if (videoRef.current) videoRef.current.muted = muted; }, [muted]);
  return <section id="top" className="hero" aria-labelledby="hero-title"><video ref={videoRef} className="hero-video" autoPlay loop muted={muted} playsInline preload="metadata" poster={assetPath("/thumbnails/hero.jpg")}><source src={assetPath(hero.video)} type="video/mp4" /><track kind="captions" src={assetPath("/captions/empty.vtt")} srcLang="en" label="Captions" /></video><div className="hero-placeholder" aria-hidden="true" /><div className="hero-overlay" /><div className="hero-copy"><p className="eyebrow">Dev Kamera presents</p><h1 id="hero-title">{hero.title}</h1><p className="hero-meta">{hero.meta}</p><p className="hero-synopsis">{hero.synopsis}</p><div className="hero-actions"><button className="button button-primary" onClick={onPlay}>Play</button><a className="button button-secondary" href="#about">More Info</a></div></div><button className="mute-button" aria-label={muted ? "Unmute hero video" : "Mute hero video"} onClick={() => setMuted((value) => !value)}>{muted ? "Sound off" : "Sound on"}</button></section>;
}

function Tile({ item, variant, onSelect }: { item: LibraryItem; variant?: string; onSelect: (item: LibraryItem) => void }) {
  const [preview, setPreview] = useState(false);
  return <button className={`tile ${variant === "rank" ? "tile-ranked" : ""}`} onClick={() => onSelect(item)} onMouseEnter={() => setPreview(true)} onMouseLeave={() => setPreview(false)} aria-label={`Play ${item.title}`}><span className="tile-art" style={{ backgroundImage: `linear-gradient(135deg, ${variant === "rank" ? "#262626, #111" : "#313131, #171717"})` }}><img src={assetPath(item.thumbnail)} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} />{preview && <video className="tile-preview" src={assetPath(item.video)} autoPlay muted loop playsInline preload="metadata" aria-hidden="true"><track kind="captions" src={assetPath("/captions/empty.vtt")} srcLang="en" label="Captions" /></video>}{item.badge && variant !== "progress" && variant !== "rank" && <span className="tile-badge">{item.badge}</span>}{variant === "rank" && item.rank && <span className="rank-number">{item.rank}</span>}<span className="play-mark" aria-hidden="true">▶</span>{variant === "progress" && <span className="progress-track"><span style={{ width: `${item.progress ?? 0}%` }} /></span>}</span><span className="tile-info"><strong>{item.title}</strong><small>{item.meta}</small></span></button>;
}

function Row({ label, items, variant, onSelect }: { label: string; items: LibraryItem[]; variant?: string; onSelect: (item: LibraryItem) => void }) {
  const scroller = useRef<HTMLDivElement>(null); const shift = (direction: number) => scroller.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
  return <section className="content-row" aria-labelledby={`${label.replaceAll(" ", "-")}-title`}><div className="row-heading"><h2 id={`${label.replaceAll(" ", "-")}-title`}>{label}</h2><div className="row-controls"><button onClick={() => shift(-1)} aria-label={`Previous ${label}`}>‹</button><button onClick={() => shift(1)} aria-label={`Next ${label}`}>›</button></div></div><div className="tile-scroller" ref={scroller}>{items.map((item, index) => <Tile key={`${item.id}-${index}`} item={item} variant={variant} onSelect={onSelect} />)}</div></section>;
}

function ShotsSlideshow() {
  return <section id="shots" className="shots-section" aria-labelledby="shots-title"><div className="shots-heading"><div><a className="eyebrow shots-link" href="https://www.instagram.com/devkamera?igsh=MXBhOG94bXptenY1cg==" target="_blank" rel="noreferrer">View More Work On Instagram</a><h2 id="shots-title">Dev Kamera Shots</h2></div></div><HeroGalleryScrollAnimation slides={shotSlides} /><p className="shots-note">Eight selected frames from the Dev Kamera archive.</p></section>;
}

function VideoModal({ item, onClose }: { item: LibraryItem; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { closeRef.current?.focus(); const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); }; document.addEventListener("keydown", onKey); return () => document.removeEventListener("keydown", onKey); }, [onClose]);
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Close video">×</button><video className="modal-video" controls autoPlay preload="metadata" poster={assetPath(item.thumbnail)}><source src={assetPath(item.video)} type="video/mp4" /><track kind="captions" src={assetPath("/captions/empty.vtt")} srcLang="en" label="Captions" /></video><div className="modal-copy"><p className="eyebrow">{item.meta}</p><h2 id="modal-title">{item.title}</h2><p>{item.synopsis}</p></div></div></div>;
}

export function PortfolioApp() {
  const [selected, setSelected] = useState<LibraryItem | null>(null);
  const [contactSent, setContactSent] = useState(false);
  const [splashState, setSplashState] = useState<"visible" | "leaving" | "done">("visible");
  useEffect(() => {
    const leaveTimer = window.setTimeout(() => setSplashState("leaving"), 650);
    const doneTimer = window.setTimeout(() => setSplashState("done"), 1_180);
    return () => { window.clearTimeout(leaveTimer); window.clearTimeout(doneTimer); };
  }, []);
  useEffect(() => {
    const section = document.querySelector<HTMLElement>(".about-section");
    const workSection = document.querySelector<HTMLElement>(".work-section");
    const observers: IntersectionObserver[] = [];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (section) {
      section.classList.add("about-motion-ready");
      if (reducedMotion) {
        section.classList.add("about-visible");
      } else {
        const observer = new IntersectionObserver(([entry]) => {
          section.classList.toggle("about-visible", entry.isIntersecting);
        }, { threshold: 0.18 });
        observer.observe(section);
        observers.push(observer);
      }
    }
    if (workSection) {
      workSection.classList.add("work-motion-ready");
      if (reducedMotion) {
        workSection.classList.add("work-visible");
      } else {
        const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            workSection.classList.add("work-visible");
            observer.disconnect();
          }
        }, { threshold: 0.14 });
        observer.observe(workSection);
        observers.push(observer);
      }
    }
    return () => observers.forEach((observer) => observer.disconnect());
  }, []);
  return <main className={`portfolio-shell ${splashState === "done" ? "is-ready" : ""}`}>{splashState !== "done" && <div className={`splash-screen ${splashState === "leaving" ? "splash-screen-leaving" : ""}`} aria-hidden="true"><div className="splash-mark"><strong>Dev Kamera</strong><span>Originals</span></div><span className="splash-line" /></div>}<Nav /><Hero onPlay={() => setSelected({ id: "hero", title: hero.title, synopsis: hero.synopsis, meta: hero.meta, thumbnail: "thumbnails/hero.jpg", video: hero.video })} /><section id="library" className="library-shell originals-feature" aria-label="Dev Kamera Originals"><Row label="Dev Kamera Originals" items={library.originals} variant="original" onSelect={setSelected} /></section><ShotsSlideshow /><section id="about" className="about-section"><h2 aria-label="ABOUT DEV KAMERA">{Array.from("ABOUT DEV KAMERA").map((character, index) => <span key={`${character}-${index}`} aria-hidden="true" style={{ animationDelay: `${index * 42}ms` }}>{character === " " ? "\u00a0" : character}</span>)}</h2><p>DevKamera is a Philadelphia-based photographer and visual storyteller specializing in cinematic imagery that brings culture, creativity, and artistry to life. With a distinct eye for detail and composition, we transform everyday moments into striking visual experiences.</p></section><section id="work-with-me" className="work-section"><div className="work-intro"><p className="eyebrow">Work With Me</p><h2>Have a story worth shaping?</h2></div>{contactSent ? <div className="form-success" role="status"><strong>Message received.</strong><span>Thanks for reaching out. I’ll follow up with next steps.</span></div> : <form className="contact-form" onSubmit={(event) => { event.preventDefault(); setContactSent(true); }}><div className="form-grid"><label>Name<input name="name" required placeholder="Your name" /></label><label>Email<input type="email" name="email" required placeholder="you@example.com" /></label></div><div className="form-grid"><label>Project type<select name="project"><option>Portrait session</option><option>Brand story</option><option>Event coverage</option><option>Music / editorial</option><option>Other</option></select></label><label>Budget range<select name="budget"><option>Let’s discuss</option><option>$500–$1,500</option><option>$1,500–$3,000</option><option>$3,000+</option></select></label></div><label>Tell me about the project<textarea name="message" required rows={4} placeholder="What are you making, and when do you need it?" /></label><button className="button button-primary" type="submit">Send inquiry</button><small className="form-note">This demo form is ready to connect to your preferred email or form endpoint.</small></form>}</section><footer><span>© Dev Kamera</span><span>Not affiliated with any streaming service. Just built like one.</span><div><a className="social-link" href="https://www.instagram.com/devkamera?igsh=MXBhOG94bXptenY1cg==" aria-label="Dev Kamera on Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.7" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.7" /><circle cx="17.4" cy="6.7" r="1" fill="currentColor" /></svg><span>Instagram</span></a></div></footer>{selected && <VideoModal item={selected} onClose={() => setSelected(null)} />}</main>;
}
