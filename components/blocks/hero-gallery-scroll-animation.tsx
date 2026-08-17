"use client";

/* eslint-disable @next/next/no-img-element */

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

type ScrollContextValue = { scrollYProgress: MotionValue<number> };
const ScrollContext = React.createContext<ScrollContextValue | null>(null);

function useScrollContext() {
  const context = React.useContext(ScrollContext);
  if (!context) throw new Error("Bento cells must be rendered inside ContainerScroll.");
  return context;
}

export function ContainerScroll({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start start", "end end"] });
  return <ScrollContext.Provider value={{ scrollYProgress }}><div ref={scrollRef} className={className} {...props}>{children}</div></ScrollContext.Provider>;
}

export function BentoCell({ children, className = "", index = 0 }: { children: React.ReactNode; className?: string; index?: number }) {
  const { scrollYProgress } = useScrollContext();
  const reducedMotion = useReducedMotion();
  const x = useTransform(scrollYProgress, [0.06, 0.82], [`${index % 2 === 0 ? -18 : 18}%`, "0%"]);
  const scale = useTransform(scrollYProgress, [0, 0.82], [0.86, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.22], [0.45, 1]);
  return <motion.div className={className} style={reducedMotion ? { x: 0, scale: 1, opacity: 1 } : { x, scale, opacity }}>{children}</motion.div>;
}

type GallerySlide = { id: string; label: string; note: string; image: string };

export function HeroGalleryScrollAnimation({ slides }: { slides: GallerySlide[] }) {
  return <ContainerScroll className="shots-scroll-shell"><div className="shots-scroll-sticky"><div className="shots-bento-grid">{slides.map((slide, index) => <BentoCell key={slide.id} index={index} className="shots-bento-cell"><img src={slide.image.replace(/^\/+/, "")} alt={`${slide.label} by Dev Kamera`} loading={index < 3 ? "eager" : "lazy"} /><span className="shots-bento-caption"><strong>{slide.label}</strong><small>{slide.note}</small></span></BentoCell>)}</div></div></ContainerScroll>;
}
