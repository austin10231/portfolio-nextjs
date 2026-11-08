import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const base = new URL(process.argv[2] || "http://localhost:3000");
const data = async path => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
const projects = await data("../src/data/projects.json");
const translations = await data("../src/data/translations.json");
const inventory = await data("../docs/source-inventory.json");
let passed = 0;
const check = (condition, label) => { assert.ok(condition, label); passed++; console.log(`PASS ${label}`); };

for (const path of ["/", "/experience", "/projects", "/contact", "/ui-design"]) {
  const response = await fetch(new URL(path, base));
  check(response.status === 200, `${path} HTTP 200`);
  const html = await response.text();
  check(html.includes("<title>") && html.includes("<main") || path === "/ui-design" && html.includes("ui-grid"), `${path} page content`);
  if (path === "/projects") for (const project of projects) check(html.includes(`/projects/${project.slug}`), `project link ${project.slug}`);
}
for (const project of projects) {
  const response = await fetch(new URL(`/projects/${project.slug}`, base));
  check(response.status === 200, `dynamic route ${project.slug}`);
  const html = await response.text();
  const heading = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]*>/g, "");
  check(heading === translations.en[`${project.translationPrefix}_title`], `correct detail content ${project.slug}`);
}
for (const path of ["/projects/not-a-real-project", "/not-a-real-page"]) check((await fetch(new URL(path, base))).status === 404, `404 ${path}`);
for (const [from, to] of [["/index.html", "/"], ["/experience.html", "/experience"], ["/projects.html", "/projects"], ["/contact.html", "/contact"], ["/UI-design/ui.html", "/ui-design"]]) {
  const response = await fetch(new URL(from, base), { redirect: "manual" });
  check(response.status === 308 && new URL(response.headers.get("location"), base).pathname === to, `legacy redirect ${from}`);
}
for (const file of inventory.files.filter(file => file.path.endsWith(".pdf") || file.path.endsWith(".png") || file.path.endsWith(".svg") || file.path.endsWith(".jpg") || file.path.endsWith(".webp"))) {
  const response = await fetch(new URL(`/${encodeURI(file.path)}`, base), { method: "HEAD" });
  check(response.status === 200, `asset ${file.path}`);
}
const post = body => fetch(new URL("/api/contact", base), { method: "POST", headers: { "Content-Type": "application/json" }, body });
const invalid = await post(JSON.stringify({ name: "  ", email: "invalid", message: "short" }));
check(invalid.status === 400, "server rejects invalid form without browser validation");
check(Object.keys((await invalid.json()).errors).length === 3, "server returns three field errors");
check((await post("{")).status === 400, "server rejects malformed JSON");
check((await post(JSON.stringify({ message: "a".repeat(25_000) }))).status === 413, "server rejects oversized body");
check((await fetch(new URL("/api/contact", base))).status === 405, "contact endpoint rejects GET");
console.log(`\n${passed} HTTP checks passed against ${base.origin}. No valid messages were sent.`);
