"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { hero, library, type LibraryItem } from "../data/library";

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 24); onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, []);
  return <header className={`site-nav ${scrolled ? "site-nav-scrolled" : ""}`}><a className="wordmark" href="#top">Dev Kamera</a><nav aria-label="Primary navigation"><a href="#library">Library</a><a href="#about">About</a><a href="#work-with-me">Work With Me</a></nav></header>;
}

function Hero({ onPlay }: { onPlay: () => void }) {
  const [muted, setMuted] = useState(true); const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => { if (videoRef.current) videoRef.current.muted = muted; }, [muted]);
  return <section id="top" className="hero" aria-labelledby="hero-title"><video ref={videoRef} className="hero-video" autoPlay loop muted={muted} playsInline preload="metadata" poster="/thumbnails/hero.jpg"><source src={hero.video} type="video/mp4" /><track kind="captions" src="/captions/empty.vtt" srcLang="en" label="Captions" /></video><div className="hero-placeholder" aria-hidden="true" /><div className="hero-overlay" /><div className="hero-copy"><p className="eyebrow">Dev Kamera presents</p><h1 id="hero-title">{hero.title}</h1><p className="hero-meta">{hero.meta}</p><p className="hero-synopsis">{hero.synopsis}</p><div className="hero-actions"><button className="button button-primary" onClick={onPlay}>Play</button><a className="button button-secondary" href="#about">More Info</a></div></div><button className="mute-button" aria-label={muted ? "Unmute hero video" : "Mute hero video"} onClick={() => setMuted((value) => !value)}>{muted ? "Sound off" : "Sound on"}</button></section>;
}

function Tile({ item, variant, onSelect }: { item: LibraryItem; variant?: string; onSelect: (item: LibraryItem) => void }) {
  const [preview, setPreview] = useState(false);
  return <button className={`tile ${variant === "rank" ? "tile-ranked" : ""}`} onClick={() => onSelect(item)} onMouseEnter={() => setPreview(true)} onMouseLeave={() => setPreview(false)} aria-label={`Play ${item.title}`}><span className="tile-art" style={{ backgroundImage: `linear-gradient(135deg, ${variant === "rank" ? "#262626, #111" : "#313131, #171717"})` }}><img src={item.thumbnail} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} />{preview && <video className="tile-preview" src={item.video} autoPlay muted loop playsInline preload="metadata" aria-hidden="true"><track kind="captions" src="/captions/empty.vtt" srcLang="en" label="Captions" /></video>}{item.badge && variant !== "progress" && variant !== "rank" && <span className="tile-badge">{item.badge}</span>}{variant === "rank" && item.rank && <span className="rank-number">{item.rank}</span>}<span className="play-mark" aria-hidden="true">▶</span>{variant === "progress" && <span className="progress-track"><span style={{ width: `${item.progress ?? 0}%` }} /></span>}</span><span className="tile-info"><strong>{item.title}</strong><small>{item.meta}</small></span></button>;
}

function Row({ label, items, variant, onSelect }: { label: string; items: LibraryItem[]; variant?: string; onSelect: (item: LibraryItem) => void }) {
  const scroller = useRef<HTMLDivElement>(null); const shift = (direction: number) => scroller.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
  return <section className="content-row" aria-labelledby={`${label.replaceAll(" ", "-")}-title`}><div className="row-heading"><h2 id={`${label.replaceAll(" ", "-")}-title`}>{label}</h2><div className="row-controls"><button onClick={() => shift(-1)} aria-label={`Previous ${label}`}>‹</button><button onClick={() => shift(1)} aria-label={`Next ${label}`}>›</button></div></div><div className="tile-scroller" ref={scroller}>{items.map((item, index) => <Tile key={`${item.id}-${index}`} item={item} variant={variant} onSelect={onSelect} />)}</div></section>;
}

function VideoModal({ item, onClose }: { item: LibraryItem; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { closeRef.current?.focus(); const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); }; document.addEventListener("keydown", onKey); return () => document.removeEventListener("keydown", onKey); }, [onClose]);
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Close video">×</button><video className="modal-video" controls autoPlay preload="metadata" poster={item.thumbnail}><source src={item.video} type="video/mp4" /><track kind="captions" src="/captions/empty.vtt" srcLang="en" label="Captions" /></video><div className="modal-copy"><p className="eyebrow">{item.meta}</p><h2 id="modal-title">{item.title}</h2><p>{item.synopsis}</p></div></div></div>;
}

export function PortfolioApp() {
  const [selected, setSelected] = useState<LibraryItem | null>(null);
  const [contactSent, setContactSent] = useState(false);
  useEffect(() => {
    const section = document.querySelector<HTMLElement>(".about-section");
    if (!section) return;
    section.classList.add("about-motion-ready");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.classList.add("about-visible");
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add("about-visible");
        observer.disconnect();
      }
    }, { threshold: 0.18 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);
  return <main><Nav /><Hero onPlay={() => setSelected({ id: "hero", title: hero.title, synopsis: hero.synopsis, meta: hero.meta, thumbnail: "/thumbnails/hero.jpg", video: hero.video })} /><section id="library" className="library-shell originals-feature" aria-label="Dev Kamera Originals"><Row label="Dev Kamera Originals" items={library.originals} variant="original" onSelect={setSelected} /></section><section id="about" className="about-section"><h2>ABOUT DEV KAMERA</h2><p>DevKamera is a Philadelphia-based photographer and visual storyteller specializing in cinematic imagery that brings culture, creativity, and artistry to life. With a distinct eye for detail and composition, we transform everyday moments into striking visual experiences.</p></section><section id="work-with-me" className="work-section"><div className="work-intro"><p className="eyebrow">Work With Me</p><h2>Have a story worth shaping?</h2></div>{contactSent ? <div className="form-success" role="status"><strong>Message received.</strong><span>Thanks for reaching out. I’ll follow up with next steps.</span></div> : <form className="contact-form" onSubmit={(event) => { event.preventDefault(); setContactSent(true); }}><div className="form-grid"><label>Name<input name="name" required placeholder="Your name" /></label><label>Email<input type="email" name="email" required placeholder="you@example.com" /></label></div><div className="form-grid"><label>Project type<select name="project"><option>Portrait session</option><option>Brand story</option><option>Event coverage</option><option>Music / editorial</option><option>Other</option></select></label><label>Budget range<select name="budget"><option>Let’s discuss</option><option>$500–$1,500</option><option>$1,500–$3,000</option><option>$3,000+</option></select></label></div><label>Tell me about the project<textarea name="message" required rows={4} placeholder="What are you making, and when do you need it?" /></label><button className="button button-primary" type="submit">Send inquiry</button><small className="form-note">This demo form is ready to connect to your preferred email or form endpoint.</small></form>}</section><footer><span>© Dev Kamera</span><span>Not affiliated with any streaming service. Just built like one.</span><div><a href="https://instagram.com/">Instagram</a><a href="https://vimeo.com/">Vimeo</a><a href="https://youtube.com/">YouTube</a></div></footer>{selected && <VideoModal item={selected} onClose={() => setSelected(null)} />}</main>;
}
