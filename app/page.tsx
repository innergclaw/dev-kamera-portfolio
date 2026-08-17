import type { Metadata } from "next";
import { PortfolioApp } from "./portfolio-app";

export const metadata: Metadata = {
  title: "Dev Kamera | Exclusive Shots",
  description: "A cinematic portfolio of work, process, and client projects by Dev Kamera.",
};

export default function Home() { return <PortfolioApp />; }
