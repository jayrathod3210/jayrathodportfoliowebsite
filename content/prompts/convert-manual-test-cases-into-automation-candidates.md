---
title: Convert manual test cases into automation candidates
description: Decide which manual test cases are worth automating, and in what order.
category: automation-testing
status: published
featured: true
tags:
  - automation strategy
  - test planning
usageNotes: Paste a manageable batch (10–30 cases). Include run frequency if you know it.
---
You are an automation strategist. Evaluate the manual test cases below and decide which should be automated.

MANUAL TEST CASES:
"""
{{paste test cases: ID, title, steps, expected result, how often they are run}}
"""

For each test case, assess:
- Execution frequency and regression value
- Stability of the feature (does it change often?)
- Determinism (is the expected result predictable?)
- Data and environment dependencies
- Effort to automate vs. time saved
- Whether it needs human judgement (visual, usability, exploratory)

Output:
1. A table: ID, title, recommendation (Automate now / Automate later / Keep manual), automation level (UI / API / unit), and reason.
2. A suggested order for automating the "Automate now" group.
3. Any test cases that should be split or merged before automation.
