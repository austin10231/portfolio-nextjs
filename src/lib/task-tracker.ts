import { z } from "zod";

export const taskSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, "title").max(120, "title"),
  done: z.boolean("done"),
});
export type Task = z.infer<typeof taskSchema>;

export const taskFormSchema = taskSchema.pick({ title: true });

export const TASKS_STORAGE_KEY = "portfolio-tasks";

export const DEFAULT_TASKS: Task[] = [
  { id: "seed-task-plan", title: "Draft this week's study plan", done: true },
  { id: "seed-task-review", title: "Review the lecture notes and slides", done: false },
  { id: "seed-task-office-hours", title: "Prepare questions for office hours", done: false },
];

export type TaskLoadResult = { tasks: Task[]; error?: "storage" | "data" };

/** Reads saved tasks; falls back to the starter list when storage is empty or unreadable. */
export function loadTasks(store: Pick<Storage, "getItem">): TaskLoadResult {
  let raw: string | null;
  try {
    raw = store.getItem(TASKS_STORAGE_KEY);
  } catch {
    return { tasks: DEFAULT_TASKS, error: "storage" };
  }
  if (raw === null) return { tasks: DEFAULT_TASKS };
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return { tasks: DEFAULT_TASKS, error: "data" };
    const tasks = parsed.filter((item): item is Task => taskSchema.safeParse(item).success);
    return { tasks, error: parsed.length === tasks.length ? undefined : "data" };
  } catch {
    return { tasks: DEFAULT_TASKS, error: "data" };
  }
}

/** Saves tasks; returns false instead of throwing when storage is unavailable. */
export function saveTasks(store: Pick<Storage, "setItem">, tasks: Task[]): boolean {
  try {
    store.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    return false;
  }
}
