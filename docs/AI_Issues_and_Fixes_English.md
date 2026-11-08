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
