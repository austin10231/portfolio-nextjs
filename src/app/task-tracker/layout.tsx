import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Task Tracker",
  description: "Simple task tracker stored in the browser with LocalStorage.",
};

export default function TaskTrackerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
