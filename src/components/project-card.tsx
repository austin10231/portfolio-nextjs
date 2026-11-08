import Link from "next/link";
import type { Project } from "@/lib/projects";
import { Text } from "./preferences";
import { Icon } from "./site-shell";

export function ProjectLinks({ project }: { project: Project }) {
  return <div className="project__links">{project.links.map(link => <a key={link.href} href={link.href} aria-label={link.label} className="link link--icon" target="_blank" rel="noreferrer" title={link.label === "source code" ? "GitHub" : link.label === "live demo" ? "Live Demo" : "Project Document"}>
    <Icon name={link.label === "source code" ? "fab fa-github" : "fas fa-external-link-alt"} />
  </a>)}</div>;
}

export function ProjectStack({ project }: { project: Project }) {
  return <ul className="project__stack">{project.stack.map(skill => <li className="project__stack-item" key={skill}>{skill}</li>)}</ul>;
}

export function ProjectCard({ project }: { project: Project }) {
  const prefix = project.translationPrefix;
  return <article className="project">
    <div className="project__header">
      <h3 className="project__title"><Link href={`/projects/${project.slug}`} className="project__detail-link"><Text id={`${prefix}_title`} /></Link></h3>
      <span className="project__tag"><Text id={`${prefix}_tag`} /></span>
    </div>
    <p className="project__description"><Text id={`${prefix}_desc`} /></p>
    <div className="project__footer"><ProjectStack project={project} /><ProjectLinks project={project} /></div>
  </article>;
}
