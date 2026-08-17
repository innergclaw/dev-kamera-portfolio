"use client";

/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-tabindex */

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CoverflowSlide = { src: string; alt: string; title?: string; subtitle?: string };
type CoverflowCarouselProps = { slides: CoverflowSlide[]; cardWidth?: string; gap?: number; rotate?: number; depth?: number; perspective?: number; fade?: number; loop?: boolean; showCaption?: boolean };
const useIsoLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export function CoverflowCarousel({ slides, cardWidth = "clamp(190px, 30vw, 340px)", gap = 0.08, rotate = 42, depth = 0.62, perspective = 3.2, fade = 0.16, loop = true, showCaption = true }: CoverflowCarouselProps) {
  const count = slides.length;
  const frameRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const positionRef = React.useRef(0);
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const dragRef = React.useRef<{ id: number; x: number; position: number; velocity: number; time: number } | null>(null);
  const [selected, setSelected] = React.useState(0);

  const indexAt = React.useCallback((position: number) => ((Math.round(position) % count) + count) % count, [count]);
  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width || !count) return;
    const pitch = width * (1 + gap);
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      let offset = index - positionRef.current;
      if (loop) { offset = ((offset % count) + count) % count; if (offset > count / 2) offset -= count; }
      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, 0.58);
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);
      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.transform = `translateX(calc(-50% + ${offset * pitch}px)) translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));
      card.dataset.active = distance < 0.5 ? "true" : "false";
    });
  }, [count, depth, fade, gap, loop, rotate]);

  const settle = React.useCallback((target: number) => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    targetRef.current = target;
    setSelected(indexAt(target));
    const step = () => {
      const remaining = target - positionRef.current;
      if (Math.abs(remaining) < 0.0004) { positionRef.current = target; paint(); rafRef.current = null; return; }
      positionRef.current += remaining * 0.16;
      paint();
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [indexAt, paint]);

  const clamp = React.useCallback((position: number) => loop ? position : Math.max(0, Math.min(count - 1, position)), [count, loop]);
  const nudge = React.useCallback((by: number) => settle(clamp(Math.round(targetRef.current) + by)), [clamp, settle]);
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = positionRef.current;
    dragRef.current = { id: event.pointerId, x: event.clientX, position: positionRef.current, velocity: 0, time: performance.now() };
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const pitch = widthRef.current * (1 + gap);
    if (!drag || drag.id !== event.pointerId || !pitch) return;
    const now = performance.now();
    const previous = positionRef.current;
    positionRef.current = clamp(drag.position - (event.clientX - drag.x) / pitch);
    drag.velocity = ((positionRef.current - previous) / Math.max(now - drag.time, 1)) * 1000;
    drag.time = now;
    setSelected(indexAt(positionRef.current));
    paint();
  };
  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    settle(clamp(Math.round(positionRef.current + Math.max(-2, Math.min(2, drag.velocity * 0.18)))));
  };

  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const measure = () => { const card = cardRefs.current[0]; if (!card) return; widthRef.current = card.offsetWidth; paint(); };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);
  React.useEffect(() => () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); }, []);

  const active = slides[selected];
  return <div className="coverflow-carousel" style={{ ["--cf-card" as string]: cardWidth, ["--cf-perspective" as string]: perspective }} role="region" aria-roledescription="carousel" aria-label="Dev Kamera shots carousel">
    <div className="coverflow-frame-wrap">
      <button className="coverflow-nav coverflow-nav-left" type="button" aria-label="Previous shot" onClick={() => nudge(-1)}><ChevronLeft aria-hidden="true" /></button>
      <div ref={frameRef} className="coverflow-frame" tabIndex={0} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerCancel={endDrag} onKeyDown={(event) => { if (event.key === "ArrowLeft") { event.preventDefault(); nudge(-1); } if (event.key === "ArrowRight") { event.preventDefault(); nudge(1); } }}>
        <div className="coverflow-track">{slides.map((slide, index) => <div key={slide.src} ref={(node) => { cardRefs.current[index] = node; }} className="coverflow-card" role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${count}`} style={{ width: "var(--cf-card)" }}><img src={slide.src.replace(/^\/+/, "")} alt={slide.alt} draggable={false} /><span className="coverflow-card-sheen" /></div>)}</div>
      </div>
      <button className="coverflow-nav coverflow-nav-right" type="button" aria-label="Next shot" onClick={() => nudge(1)}><ChevronRight aria-hidden="true" /></button>
    </div>
    {showCaption && active && <div className="coverflow-caption" key={selected}><strong>{active.title}</strong><span>{active.subtitle}</span><small>{String(selected + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</small></div>}
    <div className="coverflow-pagination" aria-label="Choose a shot">{slides.map((slide, index) => <button key={slide.src} type="button" aria-label={`Go to ${slide.title || `shot ${index + 1}`}`} aria-current={index === selected} onClick={() => settle(index)}><span /></button>)}</div>
  </div>;
}

type GallerySlide = { id: string; label: string; note: string; image: string };
export function HeroGalleryScrollAnimation({ slides }: { slides: GallerySlide[] }) {
  return <CoverflowCarousel slides={slides.map((slide) => ({ src: slide.image, alt: `${slide.label} by Dev Kamera`, title: slide.label, subtitle: slide.note }))} />;
}
