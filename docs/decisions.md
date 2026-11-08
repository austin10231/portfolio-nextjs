# Technical and design decisions

1. **Isolation:** Use the existing empty `Portfolio-Nextjs` checkout, a new `austin10231/portfolio-nextjs` remote and a new Vercel project. Do not copy `CNAME` or connect the original domain.
2. **Fidelity:** Preserve the original CSS variables, layouts, breakpoints, Poppins typography, photos, documents, bilingual text and animation timings. React replaces imperative page initialization; visual redesign is outside scope.
3. **Content:** Use final translation values after the original `Object.assign` overrides. Preserve original claims and dates; do not update or invent personal facts.
4. **Routes:** Keep four original main pages. Add data-driven `/projects/[slug]` pages and retain the separate UI gallery. Keep old `.html` paths as local redirects in the new deployment.
5. **Server boundary:** Implement `POST /api/contact` with Zod. Validate again on the server even when browser validation passes. Use a separate delivery configuration; never report a sent message without delivery acceptance.
6. **Rendering:** Use Server Components for page structure and small Client Components for persistent preferences, tabs, effects and the form. Clean up listeners/observers on route changes.
7. **Deployment:** Use Vercel's full Next.js runtime, not a static export, so server validation remains available.
8. **Evidence:** Record real prompts, code changes, test failures/fixes and commits as they happen. Keep secrets and submitted personal messages out of documentation.
