import assert from "node:assert/strict";

const base = new URL(process.argv[2] || "http://localhost:3100");
const password = process.argv[3] || "local-test-password-123";
let passed = 0;
const check = (condition, label) => { assert.ok(condition, label); passed++; console.log(`PASS ${label}`); };

const loginForm = async () => await (await fetch(new URL("/admin", base))).text();
const decode = value => value?.replaceAll("&quot;", '"').replaceAll("&amp;", "&").replaceAll("&#x27;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">") ?? "";
const hidden = html => [...html.matchAll(/<input[^>]*type="hidden"[^>]*>/g)].map(tag => ({
  name: decode(tag[0].match(/name="([^"]*)"/)?.[1]),
  value: decode(tag[0].match(/value="([^"]*)"/)?.[1]),
}));

const postLogin = async (bodyPassword, html) => {
  const fields = hidden(html);
  const form = new FormData();
  for (const { name, value } of fields) form.set(name, value);
  form.set("password", bodyPassword);
  return fetch(new URL("/admin", base), { method: "POST", body: form, redirect: "manual" });
};

const page = await loginForm();
check(page.includes('type="password"'), "login form renders without JavaScript");

const wrong = await postLogin("definitely-wrong-password", page);
const wrongHtml = await wrong.text();
check(wrongHtml.includes("Incorrect password") || wrongHtml.includes("admin_wrong_password") || wrongHtml.includes("密码不正确"), "wrong password gets a visible error");
check(!wrongHtml.includes("contact-submissions"), "failed login never shows submissions");

const right = await postLogin(password, page);
const setCookie = right.headers.getSetCookie().find(cookie => cookie.startsWith("admin_session="));
check(Boolean(setCookie), "correct password sets the admin session cookie");
check(/HttpOnly/i.test(setCookie ?? "") && /Secure/i.test(setCookie ?? ""), "session cookie is HttpOnly and Secure");

const session = setCookie.split(";")[0];
const authed = await fetch(new URL("/admin", base), { headers: { cookie: session } });
const authedHtml = await authed.text();
check(authed.status === 200, "authenticated /admin returns 200");
check(!authedHtml.includes('type="password"'), "authenticated /admin no longer shows the login form");
check(authedHtml.includes("Submissions could not be loaded") || authedHtml.includes("admin-table") || authedHtml.includes("No contact submissions yet."), "authenticated /admin reaches the submissions view (storage message expected without a local blob token)");

const signOutForm = authedHtml.match(/<form[^>]*>(?:(?!<\/form>)[\s\S])*?Sign out(?:(?!<\/form>)[\s\S])*?<\/form>/)?.[0];
check(Boolean(signOutForm), "sign out form is available to signed-in admins");
if (signOutForm) {
  const fields = hidden(signOutForm);
  const form = new FormData();
  for (const { name, value } of fields) form.set(name, value);
  const out = await fetch(new URL("/admin", base), { method: "POST", headers: { cookie: session }, body: form, redirect: "manual" });
  const cleared = out.headers.getSetCookie().join(" ");
  check(/admin_session=;/.test(cleared), "sign out clears the session cookie");
}

const tampered = await fetch(new URL("/admin", base), { headers: { cookie: `${session.slice(0, -4)}AAAA` } });
check((await tampered.text()).includes('type="password"'), "tampered session cookie is rejected");

console.log(`\n${passed} admin flow checks passed against ${base.origin}.`);
