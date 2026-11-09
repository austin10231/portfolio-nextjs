# AI Prompt History — Assignment 2 Part 2

**Course:** SCU ISBA 2438

**Student:** Mutian He

**AI assistant (Part 2):** Viber (viber-1 model)

**Date of Part 2 work:** November 8, 2026 (America/Los_Angeles)

**Project:** portfolio-nextjs — [github.com/austin10231/portfolio-nextjs](https://github.com/austin10231/portfolio-nextjs) — [portfolio-nextjs-mu-black.vercel.app](https://portfolio-nextjs-mu-black.vercel.app)

This document records only the real Part 2 session with Viber. Part 1 is documented separately in the repository. The two prompts are quoted in full in Appendix A; everything here comes from the saved commands, test results and commits of that session.

## Summary of Part 2

I asked Viber to add two features to my existing Next.js portfolio: a new Contact Me page (`/contact-me`) that submits through the `/api/contact` API into the same private JSON storage as Part 1, and a protected admin page (`/admin`) that lists every submission. Viber implemented both, tested them locally and in production, pushed the commits, and redeployed the site to Vercel.

## Prompt 1 — Build Part 2 (implementation, testing, deployment)

**When:** November 8, 2026

**My prompt (summary):** Complete Assignment 2 Part 2 on my existing portfolio repository: (1) create `/contact-me` — a new Contact Me page that submits with an API call to `/api/contact` and saves to the same JSON storage as the Part 1 server form, with server-side validation and clear success/error messages; (2) create `/admin` — show all submissions from Part 1 and Part 2 (names, emails, messages, dates) behind secure authentication; (3) preserve all Part 1 pages and features, reuse the private Vercel Blob JSON storage, keep the original design, and do not touch my original `my-profile` repository or domain; (4) test everything, commit and push, and redeploy to Vercel; (5) update the AI documentation with real records only — no fabricated prompts or issues. (Full text in Appendix A.)

**What Viber did after this prompt:**

1. Cloned the repository and read the Part 1 code first: the `/api/contact` handler, the private blob storage adapter, the shared contact form, and the existing tests and docs.
2. Added `/contact-me`. It reuses the shared, server-validated contact form, which posts JSON to `/api/contact` with `fetch`, so every submission lands in the same private Vercel Blob JSON store used by the Part 1 server form. The navigation CONTACT link now opens `/contact-me`; the Part 1 pages still work.
3. Added `/admin`, a server-rendered dashboard protected by a password: sign-in through a Next.js Server Action, an HMAC-SHA256-signed HttpOnly and Secure session cookie (8 hours), timing-safe password and token checks, and a lockout after 5 failed attempts. Signed-in admins see name, email, message and date for every submission, newest first. The page is not linked in the public menu and is marked `noindex`.
4. Read submissions only on the server: the page lists the private blobs and reads each JSON file with the Vercel Blob SDK using private access. There is no public listing or download endpoint.
5. Added tests and checks: 7 new automated tests (19 total), an 11-step admin sign-in/out flow check (`check:admin`), and expanded the HTTP checks from 75 to 82, now covering `/contact-me` and the anonymous `/admin` privacy rules.
6. Fixed the real issues found while testing (see the next section).
7. Committed and pushed (`af453d5`), completed a Vercel device login that I approved in my browser, stored `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` as server-only secrets for Production and Preview, and redeployed production (READY).
8. Verified the live site: 82/82 HTTP checks and 11/11 admin flow checks passed against the production URL, and a clearly labeled QA submission was saved as private JSON (owner read 200, anonymous read 403, no public copies, no secrets in 9 served client bundles) and then appeared in the `/admin` table.

## Prompt 2 — Prepare the final submission documents

**When:** November 8, 2026

**My prompt (summary):** Prepare the final AI Prompt History and Reflection for the Part 2 submission: export the actual Viber prompts in chronological order, summarize what the AI did after each prompt, include 2–3 real issues (what went wrong, how identified, how fixed, what was learned), explain the key decisions for `/contact-me`, `/admin`, API integration and JSON storage, use simple English, use only real Part 2 records, and save the two files (with PDF copies) to the Desktop without touching the website, repository or deployment. (Full text in Appendix A.)

**What Viber did after this prompt:**

- Re-read the saved Part 2 session records (commands, test output, commits) and wrote the two submission documents from them.
- Saved `Part2_AI_Prompt_History.md` and `Part2_AI_Reflection.md` to the Desktop and exported PDF copies.
- Made no changes to the website code, the GitHub repository, or the Vercel deployment.

## Real Development Issues and Fixes (Part 2)

### Issue 1 — TypeScript error in the admin data reader

- **What went wrong:** The first version of the blob reader (`src/lib/contact-admin.ts`) checked the record fields inside a `for` loop over field names. The strict type check failed with three TS2322 errors: "Type 'unknown' is not assignable to type 'string'".
- **How it was identified:** Running `npm run typecheck`, the project's standard gate.
- **How it was fixed:** The loop was replaced with named destructuring and one explicit `typeof` check per field (`name`, `email`, `message`) before building the typed record.
- **What was learned:** TypeScript cannot narrow indexed access through a loop. Checking each field by name is clearer and type-safe, and running the typecheck immediately catches this class of bug.
- **Result:** The typecheck passes, and malformed records are still rejected (covered by automated tests).

### Issue 2 — Admin sign-in silently did nothing without JavaScript

- **What went wrong:** While building the no-JavaScript check for the admin flow, POSTing the login form as `application/x-www-form-urlencoded` returned a normal page: no error message and no session cookie. The Server Action never ran, and nothing pointed at the cause.
- **How it was identified:** The new integration check (`scripts/check-admin.mjs`) asserts a visible error for a wrong password and a session cookie for the correct one; both assertions failed even though the unit tests had passed.
- **How it was fixed:** The rendered form declares `enctype="multipart/form-data"`, and Next.js runs the encrypted Server Action only when the body matches that format. The check now replays the form as `FormData` (multipart, exactly like a browser) and decodes the HTML-escaped hidden values (`&quot;`) before sending.
- **What was learned:** "Nothing failed" is not proof that something ran. Integration checks must assert real side effects (error text, cookies), and a replayed request must match the browser's exact encoding.
- **Result:** The full flow passes: wrong password shows a visible error and no data; the correct password sets the signed cookie and shows the submissions table; sign-out clears the cookie; a tampered cookie is rejected (11/11 checks).

### Issue 3 — The AI's own test helpers had logic bugs

- **What went wrong:** The first run of the new tests failed three of them. The pagination fake used a blob pathname as the pagination cursor, which broke when the same path appeared twice in the fake order (one record was read twice). Another scenario expected 2 unreadable records when the data produced 3. A third expected a different default name than the code assigns.
- **How it was identified:** Running `npm test` and reading the assertion diffs.
- **How it was fixed:** The fakes now use opaque numeric cursors (matching how real blob cursors behave) and the expected values were corrected to match the specified behavior.
- **What was learned:** Test doubles must mirror the real contract — cursors are opaque tokens, not pathnames — and AI-written tests need the same review and a real run, exactly like production code.
- **Result:** All 19 automated tests pass, including pagination across three pages, newest-first sorting and unreadable-record counting.

**Environment note (not an AI issue):** A stale Node process was still serving an old build on the local test port, so one early check run saw an out-of-date page and a restart failed with `EADDRINUSE`. Stopping the stale process and restarting the server fixed it; all 82 HTTP checks then passed.

## Key Development Decisions

### `/contact-me`

- **Decision:** Reuse the shared contact page and form component instead of writing a second form.
- **Why:** The assignment asks this page to submit with an API call to `/api/contact` — exactly what the shared form already does — so the design stays identical, validation has one source of truth, and no code is duplicated. All Part 1 pages keep working.

### `/admin`

- **Decision:** A server-rendered page that checks the session before rendering anything, with password sign-in through Server Actions.
- **Why:** The submissions are private, so the page must never leak them. The session is an HMAC-SHA256-signed, HttpOnly, Secure cookie with 8-hour expiry; the password and token comparisons are timing-safe; failed attempts trigger a lockout (5 failures / 15 minutes per server instance). The page is `noindex` and not in the public navigation. Every failure state is honest: a wrong password shows only the sign-in form, and a storage problem shows an error message instead of fake data.

### API integration

- **Decision:** Reuse the existing `/api/contact` route handler unchanged; the Part 2 form calls it with `fetch` (JSON).
- **Why:** Both forms then share one validated path: name 2–80 characters, valid email, message 10–5,000 characters, plus honeypot, body-size, origin and content-type checks. Persistence must succeed before any success message is returned, and a notification failure never loses a saved message.

### JSON storage

- **Decision:** Reuse the same private Vercel Blob store as Part 1 — one JSON file per submission (`contact-submissions/<uuid>.json`), written with private access, no overwrite, no random suffix.
- **Why:** Part 1 and Part 2 submissions live in one place, which is exactly what `/admin` reads. Privacy was re-verified in production: owner read 200, anonymous read 403, no public copies, and no secrets in the served JavaScript.

## Verification Summary (local and production)

- `npm run typecheck` — passed
- `npm test` — 19/19 passed
- `npm run build` — passed
- `npm run check:http` — 82/82 passed (local) and 82/82 (production)
- `npm run check:admin` — 11/11 passed (local) and 11/11 (production)
- `npm run check:storage` (production) — JSON saved in private storage; authenticated read 200; anonymous read 403; no public copies; 9 client bundles checked with no leaks
- Commits: `af453d5` (implementation), `7e0aa2e` and `e204a89` (documentation/evidence)

## Appendix A — The two prompts, quoted in full

### Prompt 1 (verbatim)

> Please complete SCU ISBA 2438 – Assignment 2 Part 2 based on my existing Next.js portfolio.
>
> GitHub: https://github.com/austin10231/portfolio-nextjs
> Website: https://portfolio-nextjs-mu-black.vercel.app/
>
> Part 2 Requirements
> 1. Create /contact-me
>    - Add a new Contact Me page.
>    - Submit form data using an API call to /api/contact.
>    - Save all submissions in the same JSON storage used by the Part 1 server form.
>    - Include server-side validation and clear success/error messages.
> 2. Create /admin
>    - Display all Contact Me submissions from both Part 1 and Part 2.
>    - Show names, emails, messages, and submission dates.
>    - Use secure authentication to prevent public access to private submissions.
> 3. Preserve Existing Functionality
>    - Keep all Part 1 pages and features working.
>    - Reuse the existing private Vercel Blob JSON storage.
>    - Preserve the original website's appearance and design.
>    - Do not modify my original my-profile repository or domain.
> 4. Testing and Deployment
>    - Test both new pages, API calls, JSON storage, and admin access.
>    - Ensure the application works correctly on Vercel.
>    - Commit and push all changes to the existing GitHub repository.
>    - Redeploy the updated website to Vercel.
> 5. Assignment Documentation
>    - Update the AI Prompt History in simple English.
>    - Record 2–3 real AI development issues and their fixes.
>    - Save the Part 2 documentation in the existing docs folder.
>    - Prepare a short Part 2 demonstration checklist.
>
> Please complete the implementation, testing, GitHub updates, and Vercel deployment. Provide the updated website links and a final checklist.
>
> Do not modify my existing documentation unnecessarily, and do not fabricate AI development records.

### Prompt 2 (verbatim)

> Please prepare the final **AI Prompt History and Reflection** for my SCU ISBA 2438 Assignment 2 – Part 2 submission.
>
> Requirements:
>
> 1. Export the actual prompts I used with Viber during Part 2 development, in chronological order.
> 2. Include a brief summary of what the AI did after each major prompt.
> 3. Include 2–3 real development issues, explaining: What went wrong. How the issue was identified. How it was fixed. What was learned.
> 4. Briefly explain the key development decisions for /contact-me, /admin, API integration, and JSON storage.
> 5. Use simple, clear English. Keep everything concise and easy for the professor to understand.
> 6. Only include actual Viber development records from Part 2. Do not mix in Codex's Part 1 work or invent prompts and issues.
>
> Output:
>
> - Create `Part2_AI_Prompt_History.md`
> - Create `Part2_AI_Reflection.md`
> - Save both files to my **Mac Desktop**.
> - If possible, also export PDF copies for easy submission.
> - Do not modify the website, GitHub repository, or deployment.
>
> Please make sure both documents are ready to submit for Assignment 2 Part 2.
