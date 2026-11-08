import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { ProjectCard } from "@/components/project-card";
import { Text } from "@/components/preferences";
import { SiteShell } from "@/components/site-shell";
import { projects } from "@/lib/projects";

export const metadata: Metadata = { title: "Projects" };
export default function ProjectsPage() {
  return <SiteShell><PageHero kind="projects" />
    <section className="section"><Link className="feature-strip" href="/experience"><Text id="projects_page_strip" /></Link></section>
    <section id="projects" className="section projects"><h2 className="section__title"><Text id="projects_archive_title" /></h2>
      <div className="projects__grid">{projects.map(project => <ProjectCard project={project} key={project.slug} />)}</div>
    </section>
  </SiteShell>;
}
