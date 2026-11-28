---
title: Audit a live page for UI/UX bugs (Gemini page scan)
description: Have an AI with page/screenshot access scan a live screen top to bottom for visual and UX defects.
category: ui-ux-testing
status: published
featured: false
tags:
  - ui/ux testing
  - accessibility
  - visual bugs
usageNotes: Built for an AI assistant that can see the live page (e.g. Gemini in Chrome, or any tool with screenshot/DOM access). Run it per screen, not per whole site.
---
Act as a senior QA engineer and thoroughly audit the entire current webpage for UI/UX bugs. Scan every visible section, from top to bottom, including text, buttons, forms, tables, images, logos, icons and interactive elements.

Check for:

Visuals & accessibility — text color that matches or is too close to the background, making it unreadable; low-contrast icons and controls; incorrect colors; missing focus indicators; states communicated through color alone.

Images & rendering — missing, broken, intermittently unloaded, blank, distorted, stretched or cropped images, logos and icons. Recheck suspected intermittent failures where safely possible.

Content & typography — spelling, grammar, inconsistent capitalization (Title Case vs. Sentence case), punctuation, inconsistent terminology, font sizes and weights, line-height issues, truncated text, orphaned words, placeholder or broken dynamic content.

Consistency & alignment — compare equivalent elements across the page and, where accessible, across the product: colors, typography, sizes, spacing, alignment, borders, corner radii, shadows. Identify misaligned elements, inconsistent spacing, overlapping components, and deviations from established patterns.

Layout & responsiveness — clipping, overflow, broken grids, inaccessible navigation, layout issues at available screen sizes.

Interactions & forms — broken links, unresponsive controls, unclear clickability, hover/focus/active/selected/disabled states, input labels, placeholders, validation, modals, loading indicators, empty states, success/error feedback.

Tables & data — misaligned columns, misplaced or missing values, inconsistent formatting, status indicators.

Applied filters (frontend) — when visually testable, apply available filters and verify results update, active filters display correctly, and clearing filters restores the right results. Test combinations where supported. Report only observable frontend defects.

Browser health — accessible console errors and failed network requests relevant to visible UI or rendering issues.

Consistency validation: report a consistency bug only when a clear, observable, unjustified difference exists between equivalent elements or established patterns. Check product-wide consistency only where other relevant pages or components are accessible. Do not flag intentional differences, subjective preferences, or unverified assumptions.

Thoroughness: inspect components individually, compare equivalent elements, and verify suspected issues before reporting. Recheck images, logos, icons and other potentially intermittent failures where possible. Report every distinct, verified bug without duplication. Do not invent defects or claim unperformed checks were completed.

Do not modify data, submit forms, navigate away from the target flow, or perform destructive actions.

Output only:
1. Bug list — a table with Bug ID, Location, Category, Priority (High/Medium/Low), Severity (High/Medium/Low), Actual Result, Expected Result, Evidence/Screenshot.
2. Audit summary — bug counts by severity, highest-priority fixes, inspected areas, and checks that could not be performed.

Quote incorrect text exactly. Report only observable or verifiable defects. If no bugs are found, state so clearly. Do not ask questions or include a Questions/Gaps section.
