import projects from "../data/projects.json";

export type Project = (typeof projects)[number];
export { projects };
export function findProject(slug: string) {
  return projects.find(project => project.slug === slug);
}
