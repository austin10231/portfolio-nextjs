# AI Reflection — Assignment 2 Part 2

**Course:** SCU ISBA 2438

**Student:** Mutian He

**AI assistant (Part 2):** Viber (viber-1 model)

**Date:** November 8, 2026

## How I used AI in this part

I gave Viber one detailed prompt listing the five Part 2 requirements and my constraints: keep every Part 1 feature, reuse the private JSON storage, keep the design, and never touch my original website, repository or domain. Viber read the existing code first, then implemented, tested, committed, pushed and redeployed. After the work was verified, I asked it to prepare the submission documents from the real session records.

## What the AI did well

- **It reused before it built.** `/contact-me` reuses the shared validated form and the existing `/api/contact` handler, so both forms save to the same private JSON storage with one set of validation rules.
- **It treated privacy as a requirement, not an extra.** `/admin` renders submissions only after checking a signed HttpOnly session cookie; the data is read on the server from private storage; there is no public endpoint; the page is not linked publicly and is marked `noindex`.
- **It proved its work.** Instead of just saying "it works", it added 7 automated tests and two check scripts, then ran them locally and again against the deployed site (82/82 HTTP checks, 11/11 admin flow checks, storage privacy verified 200 vs 403).

## The three real issues and what they taught me

1. **TypeScript cannot narrow indexed access through a loop.** The first admin data reader validated fields inside a loop, and the strict typecheck failed (TS2322). The fix was to validate each field by name. Lesson: run the strict typecheck right after writing code; "it looks right" is not the same as "it compiles strict".
2. **A Server Action can silently do nothing.** When the login form was replayed without JavaScript using the wrong encoding, the action never ran — no error, no cookie, nothing. Only the integration check's explicit assertions caught it. Lesson: assert real side effects (an error message, a Set-Cookie header), not just "the page loaded".
3. **AI-written tests can be wrong too.** Three new tests failed on first run because the AI's test helpers had logic bugs (a cursor fake that used pathnames, and miscounted expectations). Lesson: review AI-generated tests as carefully as production code, and run everything before believing it.

## How the AI's work was checked

No claim was accepted without a real run:

- The typecheck, test suite, production build and all check scripts were run locally and against the live site.
- The admin page was confirmed to show a login form when signed out, an error for a wrong password, and the submissions table (including the labeled QA record) after signing in.
- Storage privacy was confirmed against production: anonymous blob reads returned 403, there were no public copies, and no secrets appeared in the served JavaScript.
- Every Part 1 page was re-tested to confirm nothing broke.

## Where the AI needed oversight

The AI worked well, but three of its first drafts were wrong in ways that only appeared when the code actually ran (the three issues above). Each failure was silent or looked successful on the surface. That is why the final verification was done against the real deployed site with numbered check results, not against the AI's own claims.

## Outcome

- `/contact-me` and `/admin` are live: https://portfolio-nextjs-mu-black.vercel.app
- All Part 1 pages and features still work; both forms share the same private JSON storage.
- The GitHub repository, the Vercel deployment, and the original website and domain were not modified.
