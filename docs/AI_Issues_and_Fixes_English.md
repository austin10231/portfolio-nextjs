# AI Issues and Fixes

**Course:** SCU ISBA 2438 - Assignment 2

**AI assistant:** OpenAI Codex

## 1. Font Integration

- **Identified:** Draft review found that the original Poppins font setting was not connected to Next.js's font system.
- **Fix:** Connected the font correctly while retaining the original appearance.
- **Result:** Browser checks confirmed that Poppins was used on desktop and mobile.
- **Evidence:** Section 1 of the [development log](https://github.com/austin10231/portfolio-nextjs/blob/e7e1651/docs/ai-development-log.md). Feature commit [5014f3d](https://github.com/austin10231/portfolio-nextjs/commit/5014f3d) contains the corrected font setup. This issue was found before that feature commit, not by a failed unit test.

## 2. Mobile Menu Hidden Behind Page Content

- **Identified:** At a 390px browser width, the heading and photo covered the expanded menu. Clicking EXPERIENCE did not navigate.
- **Fix:** Adjusted the header's layering so the menu appeared above the page.
- **Result:** Retesting confirmed that menu links worked and the menu closed after navigation.
- **Evidence:** Fix commit [e7e1651](https://github.com/austin10231/portfolio-nextjs/commit/e7e1651), the development log, and the saved mobile-menu screenshot.

## 3. Scrolling Compatibility Warning

- **Identified:** Browser testing showed a Next.js warning about the copied smooth-scrolling styles during page navigation.
- **Fix:** Added the scrolling setting recommended by the installed Next.js documentation.
- **Result:** Later browser navigation and reload checks no longer produced the warning.
- **Evidence:** Fix commit [e7e1651](https://github.com/austin10231/portfolio-nextjs/commit/e7e1651) and the [verification report](https://github.com/austin10231/portfolio-nextjs/blob/06a7e85/docs/verification.md).

These examples come from recorded draft reviews and browser tests. Automated checks and later Part 1 corrections are documented separately in the final submission checklist.

---

# Part 2 Issues and Fixes

These three issues happened during the real Part 2 session (adding `/contact-me` and `/admin`). Evidence is the failing command/output before the fix and the passing command after it.

## 1. TypeScript could not validate blob record fields written as a loop

- **Identified:** The first draft of `src/lib/contact-admin.ts` checked `typeof record[field] !== "string"` inside a `for` loop over field names. The strict type check (`npm run typecheck`) failed with three TS2322 errors ("Type 'unknown' is not assignable to type 'string'") because TypeScript cannot narrow indexed access through a loop.
- **Fix:** Replaced the loop with named destructuring and one explicit `typeof` check per field (`name`, `email`, `message`) before building the typed record.
- **Result:** `npm run typecheck` passes; the reader still rejects malformed records (covered by `tests/contact-admin.test.ts`).
- **Evidence:** Test "malformed, foreign-schema and unreadable records are skipped and counted" in `npm test`.

## 2. Admin sign-in action silently did nothing when replayed without JavaScript

- **Identified:** While building the no-JS check for the admin flow, POSTing the login form back as `application/x-www-form-urlencoded` returned a normal page: no error message, no session cookie, and the Server Action never ran. The failure was silent, which made it easy to miss.
- **Cause:** The rendered form declares `enctype="multipart/form-data"`; Next.js runs the encrypted Server Action from the hidden fields only when the body uses that same multipart format. A second related trap: the hidden action fields contain HTML-escaped JSON (`&quot;`), which must be decoded before replay.
- **Fix:** `scripts/check-admin.mjs` now replays the form as `FormData` (multipart, like a real browser) with decoded field values.
- **Result:** The full flow passes: wrong password shows a clear error and never reveals submissions; the correct password sets an HttpOnly, Secure `admin_session` cookie; sign-in, sign-out and tampered-cookie rejection all work. `npm run check:admin` reports 11 passed checks.

## 3. AI-written test fakes contained logic bugs that failed their own suite

- **Identified:** The first run of the new tests failed three times. The pagination fake used a blob pathname as the pagination cursor, which broke when the same path appeared twice in the fake order list; the unreadable-record test expected 2 unreadable records when the scenario produced 3; and the sort test expected a record to use a different default name than the code assigns.
- **Fix:** Corrected the fakes to use opaque numeric cursors (matching how real blob cursors behave) and fixed the expected values to match the specified behavior.
- **Result:** All 19 automated tests pass (`npm test`), including cursor pagination across three pages, newest-first sorting, and unreadable-record counting.

Environment note (not counted as an AI issue): a stale Node process was still serving an old build on the local test port, so one early check run saw an out-of-date page (missing `/contact-me` navigation) and a restart failed with EADDRINUSE. Stopping the stale process and restarting `next start` resolved it; all 82 HTTP checks then passed.

---

# Midterm Issues and Fixes

These issues happened during the Midterm session (adding the LocalStorage Project Manager). Evidence is the failing command/output before the fix and the passing command after it.

## 1. The validation test used an invalid "too short" example

- **Identified:** The first new test expected a two-character title ("ab") to be rejected, but the schema allows 2–80 characters, so the test failed with "true !== false": the boundary value was actually valid.
- **Fix:** The test now uses a one-character title as the too-short case, matching the real 2–80 boundary.
- **Result:** The test passes and documents the inclusive boundary correctly. Lesson: `min()` is inclusive, so boundary examples must respect the exact limit.
- **Evidence:** `npm test` fails before, 24/24 passes after.

## 2. A test fed raw form input to the schema instead of the parsed stack

- **Identified:** The first draft of the schema test passed a technology list that still contained an empty string (as a user might type "Python,,AWS") directly into the schema, so `.parse()` threw. The application never sends that shape: the page first runs `parseStack()`, which splits commas, trims entries and drops empties and duplicates.
- **Fix:** The test now mirrors the real flow (`parseStack` first, then the schema) and separately checks that the schema still rejects blank entries for stored data.
- **Result:** The test passes and matches the app's actual boundary. Lesson: validate at the same boundary the application uses, or the test tests an input that cannot occur.
- **Evidence:** `npm test` fails before, 24/24 passes after.

## 3. A shared style edit would have changed the existing Contact pages

- **Identified:** While styling the Project Manager's status dropdown, the first CSS edit added a white background to the shared `.form-row input, .form-row select, .form-row textarea` rule. Because that rule is shared with the existing Contact and Admin forms, the change would have altered their appearance.
- **Fix:** The background was removed before building so the new page reuses the form styles without changing any existing page. The status select inherits the same transparent background and border treatment as the other fields.
- **Result:** The Project Manager matches the site design and the Contact/Admin pages render exactly as before. Lesson: shared CSS selectors are part of existing functionality; styling additions must be checked against every page that uses them.

---

# Midterm Rubric Closure: Issues and Fixes

These issues happened while adding the Task Tracker (LocalStorage) and the Notes backend JSON API. Evidence is the failing command/output before the fix and the passing command after it.

## 1. The new tests used extensionless imports and Node could not resolve them

- **Identified:** The first draft of `tests/task-tracker.test.ts` imported `"../src/lib/task-tracker"` without a file extension, so the test runner (Node's TypeScript stripping) failed to load the file with `ERR_MODULE_NOT_FOUND`. The project's test setup compiles nothing; it runs the TypeScript sources directly, which requires real file paths.
- **Fix:** The imports use the explicit `.ts` extension, matching the existing test files.
- **Result:** All tests load and pass. Lesson: follow the project's existing test conventions before writing new tests.
- **Evidence:** `npm test` fails to load the file before; 39/39 tests pass after.

## 2. An updatedAt assertion failed because two writes happened in the same millisecond

- **Identified:** The PUT test asserted `updatedAt` differs from `createdAt`, but ISO timestamps only have millisecond resolution and the test's POST and PUT ran within the same millisecond, so the strings were equal and the test failed intermittently-by-design.
- **Fix:** The test waits 5ms before updating (realistic: updates happen after creation), keeping the production timestamp logic unchanged.
- **Result:** The test passes reliably and still proves the server re-stamps `updatedAt` on updates.
- **Evidence:** `npm test` fails before; 39/39 passes after.

## 3. The Blob read adapter assumed `get()` always returns a stream

- **Identified:** The strict type check rejected the Notes storage adapter: `@vercel/blob`'s `get()` can also return `null` and a 304-style result whose `stream` is `null`, which did not match the adapter's assumed shape.
- **Fix:** The adapter treats `null`, unexpected statuses and missing streams as "empty store" and relies on the SDK's `BlobNotFoundError` for a first-run empty store; only genuine errors surface as HTTP 503.
- **Result:** Type check passes and the API returns an empty list on first use instead of erroring.
- **Evidence:** `npm run typecheck` fails before; passes after, and the first production GET returns 200 with an empty list.

## 4. A browser check asserted a server response before it arrived

- **Identified:** The end-to-end check clicked "Add note" on an empty form and immediately counted the validation errors. The assertion ran before the fetch round-trip finished, so it failed even though the UI worked.
- **Fix:** The check waits for the error element to appear before counting, like the network-dependent checks already do.
- **Result:** All 26 end-to-end checks pass.
- **Evidence:** `midterm-e2e.mjs` fails before; 26/26 passes after.
