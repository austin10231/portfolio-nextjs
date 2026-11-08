import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectLinks, ProjectStack } from "@/components/project-card";
import { Text } from "@/components/preferences";
import { SiteShell } from "@/components/site-shell";
import { findProject, projects } from "@/lib/projects";
import translations from "@/data/translations.json";

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = findProject((await params).slug);
  const en: Record<string, string> = translations.en;
  return project ? { title: en[`${project.translationPrefix}_title`], description: en[`${project.translationPrefix}_desc`] } : { title: "Project not found" };
}
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = findProject((await params).slug);
  if (!project) notFound();
  return <SiteShell><section className="section page-hero project-detail">
    <Link href="/projects" className="link project-detail__back">← <Text id="nav_projects" /></Link>
    <div className="hero-band">
      <p className="hero-band__kicker"><Text id={`${project.translationPrefix}_tag`} /></p>
      <h1 className="hero-band__title project-detail__title"><Text id={`${project.translationPrefix}_title`} /></h1>
      <p className="hero-band__desc"><Text id={`${project.translationPrefix}_desc`} /></p>
      <div className="project-detail__resources"><ProjectStack project={project} /><ProjectLinks project={project} /></div>
    </div>
  </section></SiteShell>;
}
