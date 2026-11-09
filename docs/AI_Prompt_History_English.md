# AI Prompt History: Portfolio Website

**Course:** SCU ISBA 2438

**Assignment:** Assignment 2 - Portfolio Website

**Student:** Mutian He

**AI assistant:** Viber

## Project Goal

Rebuild my existing personal website as an independent Next.js project while preserving its appearance, content, animations, and interactions. The original website, GitHub repository, and domain had to remain unchanged.

## Main Prompts and AI Actions

The prompts below are concise English summaries of the original Chinese messages, rather than verbatim quotations.

### 1. Analyze the Existing Website

**Prompt:** Review my original website and repository. Propose an independent Next.js project with at least four pages, dynamic project routes, and a Contact form with server-side validation. Complete the analysis first and wait for approval before making changes.

**AI actions:** Reviewed the website and source code, identified the existing pages and interactions, and proposed a project structure and implementation plan.

### 2. Build, Test, and Deploy

**Prompt:** Proceed with the approved plan. Match the original website as closely as possible, meet the assignment requirements, and record the development process. Complete testing, create a new GitHub repository, and deploy the new website to Vercel.

**AI actions:** Built the Next.js website, preserved the original content and design, added eight dynamic project detail pages and server-side Contact validation, tested the application, and published it independently.

### 3. Approve Contact Delivery

**User approval:** Allow the new website to reuse the existing Formspree contact destination.

**AI actions:** Configured delivery for the new project without changing the original website or form settings. Test submissions were accepted by Formspree.

## Real Problems and Improvements

These examples were recorded during actual draft review and testing.

| Problem | Improvement and Result |
| --- | --- |
| **Font integration:** Draft review found that the copied Poppins font setting was not connected to Next.js's font system. | Connected the font correctly and verified the rendered typography in the browser. |
| **Mobile navigation:** The expanded menu appeared behind the homepage content, preventing links from being clicked. | Adjusted the header's layering. Retesting confirmed that the menu displayed correctly and opened the selected page. |
| **Scrolling compatibility:** The copied smooth-scrolling styles triggered a Next.js warning during navigation. | Added the recommended scrolling setting. Later browser checks showed that the warning was resolved. |

## Verification and Final Result

- Four main pages and eight dynamic project detail pages were completed.
- The Contact form validates input on the server and supports real delivery.
- The production build, type checks, and eight automated tests passed.
- Sixty live HTTP checks and 24 responsive page checks passed.
- Four Git commits and supporting development records were retained.
- The original website, repository, and domain remained unchanged.

**Website:** https://portfolio-nextjs-mu-black.vercel.app

**Repository:** https://github.com/austin10231/portfolio-nextjs

---

# Part 2: Contact Me API Page and Admin Dashboard

**Course:** SCU ISBA 2438 - Assignment 2 Part 2

**Student:** Mutian He

**AI assistant for Part 2:** Viber (viber-1 model), the same assistant credited above.

## Part 2 Goal

Add a new Contact Me page at `/contact-me` that submits through an API call to `/api/contact` and saves every submission to the same private JSON storage used by the Part 1 server form. Add an `/admin` page that lists all submissions from both parts behind secure authentication. Keep every Part 1 page and feature working, reuse the existing private Vercel Blob store, and do not change the original `my-profile` repository or domain.

## Main Prompts and AI Actions (Part 2)

The prompts are short English summaries of the real request.

### 1. Start Part 2

**Prompt:** Complete Assignment 2 Part 2 on my existing portfolio repository. Create `/contact-me` with an API-based form that saves to the same JSON storage as Part 1. Create `/admin` to show all submissions with secure authentication. Keep all Part 1 features, storage, and design. Test everything, commit and push, redeploy to Vercel, and update the AI documentation with real issues only.

**AI actions:** Cloned the repository, read the Part 1 contact API, private blob storage adapter, server form and docs, then proposed `/contact-me` (reusing the shared validated form), a server-only blob reader, and a password-protected admin dashboard.

### 2. Implement, Test, and Publish

**Prompt:** Proceed with the plan.

**AI actions:**
- Added `/contact-me` that renders the shared Contact form and posts to `/api/contact`, so submissions land in the same private blob store as the Part 1 server form.
- Added `/admin` with a password sign-in (Server Actions), an HMAC-signed HttpOnly session cookie, timing-safe password and token checks, and a failed-attempt lockout. Signed-in admins see name, email, message and date for every submission, newest first.
- Kept the dashboard off the public navigation and set `noindex` metadata on it.
- Added 7 new automated tests (19 total), an 11-step admin flow check (`npm run check:admin`), and expanded the HTTP checks from 75 to 82.
- Committed and pushed the changes, then redeployed to the existing Vercel project.

## Real Problems and Improvements (Part 2)

All three examples happened during this Part 2 session and were fixed the same day. Full details are in [AI_Issues_and_Fixes_English.md](AI_Issues_and_Fixes_English.md).

| Problem | Improvement and Result |
| --- | --- |
| **TypeScript narrowing error:** The first draft of the blob reader validated record fields inside a loop, but TypeScript could not narrow indexed access and the strict type check failed (TS2322). | Rewrote the check to validate each field by name. The strict type check then passed. |
| **Admin sign-in did not run without JavaScript:** A plain urlencoded replay of the login form only re-rendered the page; the Server Action never ran, so no error or cookie appeared. | The rendered form uses `multipart/form-data`. Replaying the same multipart body (like a browser does) ran the action. The admin flow check then passed end to end, including wrong-password, sign-in, sign-out and tampered-cookie steps. |
| **AI-written tests had logic bugs:** The first test fakes used a blob pathname as a pagination cursor (broke when a path appeared twice), and two expected values were miscounted, so three new tests failed. | Corrected the fakes to use opaque cursors and fixed the expected values. All 19 tests passed, and they now really exercise pagination, sorting and unreadable-record handling. |

Environment note: a stale Node process was still serving an old build on the test port, so the first local check run saw an out-of-date page and failed. After stopping that process and restarting, all 82 HTTP checks passed.

## Verification and Final Result (Part 2)

- `/contact-me` and `/admin` were completed; all Part 1 pages, dynamic project routes and compatibility redirects still work.
- Both contact pages save to the same private Vercel Blob JSON storage; the admin reader uses the same server-only SDK path with private access.
- Strict type check, 19 automated tests, the production build, 82 local HTTP checks and 11 admin flow checks passed.
- After deployment, all 82 HTTP checks and 11 admin flow checks passed again against the live site, and a labeled QA submission was saved, read back privately, denied to anonymous users (HTTP 403), and visible in the `/admin` table.
- Changes were committed and pushed to the existing repository and redeployed to Vercel.

**Website:** https://portfolio-nextjs-mu-black.vercel.app

**Repository:** https://github.com/austin10231/portfolio-nextjs
