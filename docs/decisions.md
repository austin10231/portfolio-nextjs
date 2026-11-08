# Technical and design decisions

1. **Isolation:** Use the existing empty `Portfolio-Nextjs` checkout, a new `austin10231/portfolio-nextjs` remote and a new Vercel project. Do not copy `CNAME` or connect the original domain.
2. **Fidelity:** Preserve the original CSS variables, layouts, breakpoints, Poppins typography, photos, documents, bilingual text and animation timings. React replaces imperative page initialization; visual redesign is outside scope.
3. **Content:** Use final translation values after the original `Object.assign` overrides. Preserve original claims and dates; do not update or invent personal facts.
4. **Routes:** Keep four original main pages. Add data-driven `/projects/[slug]` pages and retain the separate UI gallery. Keep old `.html` paths as local redirects in the new deployment.
5. **Server boundary:** Implement `POST /api/contact` with Zod. Validate again on the server even when browser validation passes. Keep delivery configuration in the new project's environment; never report a sent message without delivery acceptance. The owner subsequently authorized reuse of the original Formspree endpoint as the delivery destination. Its existing configuration is not modified.
6. **Rendering:** Use Server Components for page structure and small Client Components for persistent preferences, tabs, effects and the form. Clean up listeners/observers on route changes.
7. **Deployment:** Use Vercel's full Next.js runtime, not a static export, so server validation remains available.
8. **Evidence:** Record real prompts, code changes, test failures/fixes and commits as they happen. Keep secrets and submitted personal messages out of documentation.
9. **Part 1 routes:** Add real `/about-me` and `/contact-me-server-form` pages. Share the original biography and form components, link required pages in navigation, and retain existing routes for compatibility.
10. **Private JSON persistence:** Store one JSON object per validated submission in a private Vercel Blob store connected only to this project. Do not rely on the function filesystem or publish submissions through the website. Save before sending email; only acknowledge messages whose storage write succeeded.
11. **Dependency compatibility:** The Blob SDK's configuration helper pinned an older Zod 4 release flagged by npm audit. A scoped override reuses the already-patched root Zod 4.6.7. Installation and audit then reported zero vulnerabilities; build, tests and real storage requests were verified.
