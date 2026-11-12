import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const base = new URL(process.argv[2] || "http://localhost:3000");
const data = async path => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
const projects = await data("../src/data/projects.json");
const translations = await data("../src/data/translations.json");
const inventory = await data("../docs/source-inventory.json");
let passed = 0;
const check = (condition, label) => { assert.ok(condition, label); passed++; console.log(`PASS ${label}`); };

for (const path of ["/", "/about-me", "/projects", "/contact-me-server-form", "/contact-me", "/project-manager", "/experience", "/contact", "/ui-design"]) {
  const response = await fetch(new URL(path, base));
  check(response.status === 200, `${path} HTTP 200`);
  const html = await response.text();
  check(html.includes("<title>") && html.includes("<main") || path === "/ui-design" && html.includes("ui-grid"), `${path} page content`);
  if (path === "/projects") for (const project of projects) check(html.includes(`/projects/${project.slug}`), `project link ${project.slug}`);
  if (["/", "/about-me", "/projects", "/contact-me-server-form", "/contact-me", "/project-manager"].includes(path)) check(!response.redirected, `${path} is a real page`);
  if (path === "/") check(html.includes('href="/about-me"') && html.includes('href="/contact-me"') && html.includes('href="/project-manager"'), "required routes linked from navigation");
  if (path === "/about-me") check(html.includes("Santa Clara University") && html.includes("University of Glasgow"), "About Me preserves original biography");
  if (path === "/contact-me-server-form" || path === "/contact-me") check(["name", "email", "message"].every(field => html.includes(`name="${field}"`)), `${path} has all three form fields`);
  if (path === "/project-manager") check(["title", "description", "stack", "status"].every(field => html.includes(`name="${field}"`)), "project manager form has all four fields");
}
const adminPage = await fetch(new URL("/admin", base));
const adminHtml = await adminPage.text();
check(adminPage.status === 200, "/admin HTTP 200");
check(/type="password"/.test(adminHtml), "anonymous /admin shows the sign-in form");
check(!adminHtml.includes("contact-submissions") && !adminHtml.includes("test@example.com"), "anonymous /admin reveals no submissions or storage paths");
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
for (const path of ["/submissions.json", "/data/submissions.json", "/contact-submissions", "/api/submissions"]) check((await fetch(new URL(path, base))).status === 404, `no public submission endpoint ${path}`);
console.log(`\n${passed} HTTP checks passed against ${base.origin}. No valid messages were sent.`);
