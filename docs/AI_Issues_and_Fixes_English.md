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
