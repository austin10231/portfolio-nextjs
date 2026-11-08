import type { Metadata } from "next";
import { ExperienceTabs } from "@/components/experience-tabs";
import { PageHero } from "@/components/page-hero";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = { title: "Experience" };
export default function ExperiencePage() {
  return <SiteShell><PageHero kind="experience" /><ExperienceTabs /></SiteShell>;
}
