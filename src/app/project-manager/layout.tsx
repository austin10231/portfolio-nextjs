import type { Metadata } from "next";

export const metadata: Metadata = { title: "Project Manager" };

export default function ProjectManagerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
