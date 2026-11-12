import { z } from "zod";

export const PM_STATUSES = ["Planned", "In Progress", "Completed"] as const;
export type PMStatus = (typeof PM_STATUSES)[number];

export const pmProjectSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(2, "title").max(80, "title"),
  description: z.string().trim().min(10, "description").max(2000, "description"),
  stack: z.array(z.string().trim().min(1)).min(1, "stack").max(12, "stack"),
  status: z.enum(PM_STATUSES, "status"),
});
export type PMProject = z.infer<typeof pmProjectSchema>;

export const pmFormSchema = pmProjectSchema.omit({ id: true });

export const PM_STORAGE_KEY = "portfolio-projects";

export const DEFAULT_PM_PROJECTS: PMProject[] = [
  {
    id: "seed-portfolio-website",
    title: "Portfolio Website",
    description: "This bilingual Next.js portfolio with theme persistence, dynamic project pages and a server-validated contact form.",
    stack: ["Next.js", "React", "TypeScript", "Vercel"],
    status: "Completed",
  },
  {
    id: "seed-stock-pipeline",
    title: "Cloud Real-Time Stock Data Pipeline",
    description: "Streams simulated market data with Kafka on AWS EC2 into S3, with Glue and Athena for serverless analytics.",
    stack: ["Kafka", "AWS EC2", "S3", "Athena"],
    status: "In Progress",
  },
  {
    id: "seed-bank-marketing",
    title: "Bank Marketing Subscription Predictor",
    description: "Predicts term-deposit subscriptions with SMOTE class balancing, threshold tuning and SHAP explanations.",
    stack: ["Python", "scikit-learn", "SMOTE", "SHAP"],
    status: "Planned",
  },
];

/** Splits a comma-separated input into a clean technology list. */
export function parseStack(input: string): string[] {
  const seen = new Set<string>();
  for (const part of input.split(",")) {
    const item = part.trim();
    if (item) seen.add(item);
  }
  return [...seen];
}

export type PMLoadResult = { projects: PMProject[]; error?: "storage" | "data" };

/** Reads saved projects; falls back to the starter list when storage is empty or unreadable. */
export function loadProjects(store: Pick<Storage, "getItem">): PMLoadResult {
  let raw: string | null;
  try {
    raw = store.getItem(PM_STORAGE_KEY);
  } catch {
    return { projects: DEFAULT_PM_PROJECTS, error: "storage" };
  }
  if (raw === null) return { projects: DEFAULT_PM_PROJECTS };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return { projects: DEFAULT_PM_PROJECTS, error: "data" };
    const projects = parsed.filter((item): item is PMProject => pmProjectSchema.safeParse(item).success);
    return { projects, error: parsed.length === projects.length ? undefined : "data" };
  } catch {
    return { projects: DEFAULT_PM_PROJECTS, error: "data" };
  }
}

/** Saves projects; returns false instead of throwing when storage is unavailable. */
export function saveProjects(store: Pick<Storage, "setItem">, projects: PMProject[]): boolean {
  try {
    store.setItem(PM_STORAGE_KEY, JSON.stringify(projects));
    return true;
  } catch {
    return false;
  }
}
