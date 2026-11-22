---
title: Create Playwright TypeScript automation tests
description: Convert a test scenario into a maintainable Playwright test using the Page Object Model.
category: playwright
status: published
featured: true
tags:
  - playwright
  - typescript
  - page object model
usageNotes: "Provide real selectors or a DOM snippet if possible. Always run and review the generated code: never commit it unread."
---
You are an expert in Playwright with TypeScript. Write an automated test for the scenario below.

SCENARIO:
"""
{{paste test scenario with steps and expected results}}
"""

APP CONTEXT (optional):
"""
{{base URL, relevant HTML snippet, existing page objects, test data rules}}
"""

Requirements:
- Use @playwright/test with TypeScript.
- Use the Page Object Model: create a page class with clear methods; keep assertions in the test file.
- Prefer user-facing locators: getByRole, getByLabel, getByText, getByTestId. Avoid brittle CSS/XPath.
- Use web-first assertions (expect(locator).toBeVisible(), toHaveText(), etc.). No fixed waits (no waitForTimeout).
- Keep test data in a separate object or fixture.
- Add test.describe and meaningful test titles.
- If information is missing (selectors, URLs), use clearly named placeholders and list them at the end.

Output: page object file, test file, and a short explanation of design choices.
