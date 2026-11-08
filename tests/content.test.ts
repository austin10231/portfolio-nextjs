import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const root = new URL("../", import.meta.url);
const json = (path: string) => JSON.parse(readFileSync(new URL(path, root), "utf8"));
const projects = json("src/data/projects.json");
const translations = json("src/data/translations.json");

test("all eight original projects have unique routes and both language descriptions", () => {
  assert.equal(projects.length, 8);
  assert.equal(new Set(projects.map((project: { slug: string }) => project.slug)).size, 8);
  for (const project of projects) for (const language of ["en", "zh"]) for (const suffix of ["title", "tag", "desc"]) assert.ok(translations[language][`${project.translationPrefix}_${suffix}`]);
  assert.deepEqual(Object.keys(translations.en).sort(), Object.keys(translations.zh).sort());
  assert.equal(json("src/data/skills.json").length, 24);
});

test("every copied original image and PDF retains its exact source hash", () => {
  const inventory = json("docs/source-inventory.json");
  const assets = inventory.files.filter((file: { path: string }) => /\.(pdf|png|svg|jpg|webp)$/.test(file.path));
  assert.equal(assets.length, 14);
  for (const asset of assets) {
    const bytes = readFileSync(new URL(`public/${asset.path}`, root));
    const sha = createHash("sha1").update(`blob ${bytes.byteLength}\0`).update(bytes).digest("hex");
    assert.equal(sha, asset.sha, asset.path);
  }
});
