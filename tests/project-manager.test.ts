import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_PM_PROJECTS, PM_STORAGE_KEY, loadProjects, parseStack, pmFormSchema, pmProjectSchema, saveProjects } from "../src/lib/project-manager.ts";
import type { PMProject } from "../src/lib/project-manager.ts";

const storage = (initial: Record<string, string> = {}) => {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => data.set(key, value),
  };
};

const valid = { title: "  Demo project  ", description: "A small demo project used by the tests.", stack: ["Python"], status: "Planned" } as const;

test("form schema trims and rejects missing, short or invalid fields", () => {
  const parsed = pmFormSchema.parse({ ...valid, stack: parseStack("  Python , AWS,Python,,") });
  assert.equal(parsed.title, "Demo project");
  assert.deepEqual(parsed.stack, ["Python", "AWS"]);
  for (const bad of [{ ...valid, title: "a" }, { ...valid, description: "short" }, { ...valid, stack: ["  ", ""] }, { ...valid, status: "Finished" }]) {
    assert.equal(pmFormSchema.safeParse(bad).success, false);
  }
  assert.equal(pmFormSchema.safeParse({ ...valid, status: "Completed" }).success, true);
});

test("parseStack splits commas, trims entries, removes empties and duplicates", () => {
  assert.deepEqual(parseStack(" Python, AWS ,  Python,,Kafka "), ["Python", "AWS", "Kafka"]);
  assert.deepEqual(parseStack("   "), []);
});

test("loadProjects reads saved data, seeds defaults when empty and recovers from bad data", () => {
  const saved: PMProject[] = [{ id: "abc", ...pmFormSchema.parse(valid) }];
  assert.deepEqual(loadProjects(storage({ [PM_STORAGE_KEY]: JSON.stringify(saved) })).projects, saved);
  assert.deepEqual(loadProjects(storage()).projects, DEFAULT_PM_PROJECTS);
  const corrupt = loadProjects(storage({ [PM_STORAGE_KEY]: "{not json" }));
  assert.deepEqual(corrupt.projects, DEFAULT_PM_PROJECTS);
  assert.equal(corrupt.error, "data");
  const mixed = loadProjects(storage({ [PM_STORAGE_KEY]: JSON.stringify([saved[0], { nope: true }]) }));
  assert.deepEqual(mixed.projects, saved);
  assert.equal(mixed.error, "data");
});

test("loadProjects falls back to defaults when storage itself is unavailable", () => {
  const blocked = { getItem: () => { throw new Error("blocked"); } };
  const result = loadProjects(blocked);
  assert.deepEqual(result.projects, DEFAULT_PM_PROJECTS);
  assert.equal(result.error, "storage");
});

test("saveProjects round-trips through storage and reports failures instead of throwing", () => {
  const store = storage();
  const saved: PMProject[] = [{ id: "abc", ...pmFormSchema.parse(valid) }];
  assert.equal(saveProjects(store, saved), true);
  assert.deepEqual(loadProjects(store).projects, saved);
  assert.equal(saveProjects({ setItem: () => { throw new Error("full"); } }, saved), false);
  assert.ok(pmProjectSchema.safeParse(saved[0]).success);
});
