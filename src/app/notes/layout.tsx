import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes",
  description: "Server-side JSON notes with a full CRUD API.",
};

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
