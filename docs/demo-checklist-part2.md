# Part 2 Demonstration Checklist

Short demo plan for Assignment 2 Part 2. Run through it in order; each step lists what to show.

## 1. New Contact Me page (`/contact-me`)

- Open `/contact-me` from the navigation (CONTACT). Point out the design is the same as the original contact page.
- Submit an invalid form (two spaces in name, short message) to show server-side field errors in red.
- Open DevTools → Network, submit a valid message, and show the `POST /api/contact` call returning 200.
- Show the success message ("Thank you! Your message has been saved/sent.").

## 2. Same private JSON storage as Part 1

- Explain that `/api/contact` saves every valid submission as one JSON file (`contact-submissions/<uuid>.json`) in the same private Vercel Blob store used by the Part 1 server form at `/contact-me-server-form`.
- Optionally run `npm run check:storage <site-url>` to show a real record saved and read back with owner credentials while anonymous access is denied.

## 3. Admin dashboard (`/admin`)

- Open `/admin`. Show that it is not linked in the public navigation and shows a sign-in form instead of data.
- Enter a wrong password: show the "Incorrect password" error and that no submissions appear.
- Sign in with the admin password: the table lists submissions from BOTH the Part 1 server form and the Part 2 API form, with name, email, message and date, newest first.
- Show the count line, then click "Sign out" to return to the login form.
- Mention the protections: HttpOnly + Secure signed session cookie, timing-safe checks, lockout after repeated failures, `noindex` metadata.

## 4. Part 1 still works

- Visit `/`, `/about-me`, `/experience`, `/projects`, a project detail page, and `/contact-me-server-form`.
- Toggle dark mode and 中文 to show preferences and translations still work.

## 5. Tests and evidence

- Run `npm run typecheck`, `npm test` (19 tests), `npm run check:http` (82 checks), and `npm run check:admin` (11 checks) against the site.
- Open `docs/AI_Prompt_History_English.md` and `docs/AI_Issues_and_Fixes_English.md` for the Part 2 prompts and the three real issues and fixes.

## Links

- Website: https://portfolio-nextjs-mu-black.vercel.app
- Repository: https://github.com/austin10231/portfolio-nextjs
