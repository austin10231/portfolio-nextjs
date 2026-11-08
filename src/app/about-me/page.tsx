import type { Metadata } from "next";
import { ProfileOverview, SkillsSection } from "@/components/profile-overview";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = { title: "About Me" };
export default function AboutMePage() {
  return <SiteShell><ProfileOverview /><SkillsSection /></SiteShell>;
}
