---
title: Generate test scenarios from requirements
description: Turn a requirement or user story into structured, risk-ranked test scenarios.
category: test-case-generation
status: published
featured: true
tags:
  - requirements
  - test design
  - scenarios
usageNotes: "Paste the full requirement including acceptance criteria. Review every scenario: the model cannot know undocumented business rules."
---
You are a senior QA engineer. Analyse the requirement below and produce test scenarios.

REQUIREMENT:
"""
{{paste requirement / user story / acceptance criteria here}}
"""

Instructions:
1. First list any ambiguities, missing information or assumptions you are making. Do not invent business rules.
2. Then generate test scenarios grouped by:
   - Positive / happy path
   - Negative / invalid input
   - Boundary and edge cases
   - Permissions and roles (if relevant)
   - Integration or dependency points
3. For each scenario provide: ID, title, preconditions, steps (short), expected result, and priority (High / Medium / Low) based on business risk.
4. Finish with a short list of questions I should ask the product owner.

Output as a Markdown table per group.
