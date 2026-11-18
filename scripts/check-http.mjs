import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const base = new URL(process.argv[2] || "http://localhost:3000");
const data = async path => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
const projects = await data("../src/data/projects.json");
const translations = await data("../src/data/translations.json");
const inventory = await data("../docs/source-inventory.json");
let passed = 0;
const check = (condition, label) => { assert.ok(condition, label); passed++; console.log(`PASS ${label}`); };

for (const path of ["/", "/about-me", "/projects", "/contact-me-server-form", "/contact-me", "/project-manager", "/task-tracker", "/notes", "/experience", "/contact", "/ui-design"]) {
  const response = await fetch(new URL(path, base));
  check(response.status === 200, `${path} HTTP 200`);
  const html = await response.text();
  check(html.includes("<title>") && html.includes("<main") || path === "/ui-design" && html.includes("ui-grid"), `${path} page content`);
  if (path === "/projects") for (const project of projects) check(html.includes(`/projects/${project.slug}`), `project link ${project.slug}`);
  if (["/", "/about-me", "/projects", "/contact-me-server-form", "/contact-me", "/project-manager", "/task-tracker", "/notes"].includes(path)) check(!response.redirected, `${path} is a real page`);
  if (path === "/") check(html.includes('href="/about-me"') && html.includes('href="/contact-me"') && html.includes('href="/project-manager"') && html.includes('href="/task-tracker"') && html.includes('href="/notes"'), "required routes linked from navigation");
  if (path === "/about-me") check(html.includes("Santa Clara University") && html.includes("University of Glasgow"), "About Me preserves original biography");
  if (path === "/contact-me-server-form" || path === "/contact-me") check(["name", "email", "message"].every(field => html.includes(`name="${field}"`)), `${path} has all three form fields`);
  if (path === "/project-manager") check(["title", "description", "stack", "status"].every(field => html.includes(`name="${field}"`)), "project manager form has all four fields");
  if (path === "/task-tracker") check(html.includes('name="title"'), "task tracker form has its title field");
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

// Notes API: full CRUD lifecycle with proper status codes. The QA note is always cleaned up.
const jfetch = (path, method, body) => fetch(new URL(path, base), { method, headers: body === undefined ? undefined : { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
const notesList = await jfetch("/api/notes", "GET");
check(notesList.status === 200, "GET /api/notes returns 200");
check(notesList.headers.get("cache-control") === "no-store", "notes list is not cached");
const notesShape = await notesList.json();
check(notesShape.ok === true && Array.isArray(notesShape.notes), "notes list returns ok:true and a notes array");
check((await jfetch("/api/notes", "POST", "{bad json")).status === 400, "notes POST rejects malformed JSON with 400");
check((await jfetch("/api/notes", "POST", { text: "   " })).status === 400, "notes POST rejects blank text with 400");
check((await jfetch("/api/notes", "POST", { text: "x".repeat(501) })).status === 400, "notes POST rejects oversized text with 400");
let qaNoteId = null;
try {
  const created = await jfetch("/api/notes", "POST", { text: "QA check note - deleted by the check script" });
  check(created.status === 201, "notes POST returns 201 Created");
  check(created.headers.get("location")?.startsWith("/api/notes/"), "notes POST returns a Location header");
  const createdBody = await created.json();
  qaNoteId = createdBody.note?.id ?? null;
  check(typeof qaNoteId === "string" && qaNoteId.length > 0 && typeof createdBody.note.createdAt === "string", "created note has an id and createdAt");
  check((await jfetch(`/api/notes/${qaNoteId}`, "GET")).status === 200, "GET /api/notes/:id returns 200");
  const updated = await jfetch(`/api/notes/${qaNoteId}`, "PUT", { text: "QA check note (updated)" });
  check(updated.status === 200 && (await updated.json()).note.text === "QA check note (updated)", "PUT /api/notes/:id updates with 200");
  check((await jfetch(`/api/notes/${qaNoteId}`, "PATCH", { text: "QA check note (patched)" })).status === 200, "PATCH /api/notes/:id updates with 200");
  check((await jfetch("/api/notes/does-not-exist", "PUT", { text: "x" })).status === 404, "PUT on a missing note returns 404");
  check((await jfetch("/api/notes/does-not-exist", "GET")).status === 404, "GET on a missing note returns 404");
  check((await jfetch("/api/notes", "PATCH", { text: "x" })).status === 405, "PATCH on the collection returns 405");
  const deleted = await jfetch(`/api/notes/${qaNoteId}`, "DELETE");
  check(deleted.status === 200 && (await deleted.json()).deleted === true, "DELETE /api/notes/:id returns 200");
  qaNoteId = null;
  check((await jfetch("/api/notes/does-not-exist", "DELETE")).status === 404, "DELETE on a missing note returns 404");
} finally {
  if (qaNoteId) await jfetch(`/api/notes/${qaNoteId}`, "DELETE").catch(() => {});
}
console.log(`\n${passed} HTTP checks passed against ${base.origin}. No valid messages were sent.`);
