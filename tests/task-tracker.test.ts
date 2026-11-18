import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_TASKS, TASKS_STORAGE_KEY, loadTasks, saveTasks, taskFormSchema } from "../src/lib/task-tracker.ts";

function memoryStore(initial: Record<string, string> = {}, { failSet = false, failGet = false } = {}): Storage {
  const map = new Map(Object.entries(initial));
  return {
    get length() { return map.size; },
    clear: () => map.clear(),
    key: () => null,
    getItem: key => { if (failGet) throw new Error("blocked"); return map.get(key) ?? null; },
    setItem: (key, value) => { if (failSet) throw new Error("blocked"); map.set(key, value); },
    removeItem: key => { map.delete(key); },
  };
}

describe("task tracker", () => {
  it("accepts a normal title and rejects empty or oversized titles", () => {
    assert.equal(taskFormSchema.safeParse({ title: " Review lecture notes " }).success, true);
    assert.equal(taskFormSchema.safeParse({ title: "   " }).success, false);
    assert.equal(taskFormSchema.safeParse({ title: "x".repeat(121) }).success, false);
    assert.equal(taskFormSchema.safeParse({ title: "x".repeat(120) }).success, true);
  });

  it("returns the starter list on first visit without writing to storage", () => {
    const store = memoryStore();
    const result = loadTasks(store);
    assert.deepEqual(result, { tasks: DEFAULT_TASKS });
    assert.equal(store.getItem(TASKS_STORAGE_KEY), null);
  });

  it("filters invalid saved tasks and reports corrupted data", () => {
    const saved = JSON.stringify([
      { id: "1", title: "Valid task", done: false },
      { id: "2", title: "", done: false },
      { id: "3", title: "Not a boolean", done: "yes" },
    ]);
    const result = loadTasks(memoryStore({ [TASKS_STORAGE_KEY]: saved }));
    assert.equal(result.tasks.length, 1);
    assert.equal(result.tasks[0].title, "Valid task");
    assert.equal(result.error, "data");
  });

  it("falls back to the starter list with a storage error when storage is blocked", () => {
    const result = loadTasks(memoryStore({}, { failGet: true }));
    assert.deepEqual(result, { tasks: DEFAULT_TASKS, error: "storage" });
  });

  it("round-trips tasks through storage and reports save failures", () => {
    const store = memoryStore();
    const tasks = [{ id: "a", title: "Record the demo", done: true }];
    assert.equal(saveTasks(store, tasks), true);
    assert.deepEqual(loadTasks(store).tasks, tasks);
    assert.equal(saveTasks(memoryStore({}, { failSet: true }), tasks), false);
  });
});
