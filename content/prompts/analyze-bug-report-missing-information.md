---
title: Analyze a bug report and identify missing information
description: Review a bug report for clarity and completeness before it reaches developers.
category: bug-analysis
status: published
featured: false
tags:
  - bug report
  - defect triage
usageNotes: Useful for reviewing your own reports or mentoring junior testers.
---
Act as a QA lead reviewing a bug report. Evaluate the report below.

BUG REPORT:
"""
{{paste bug report}}
"""

Please:
1. Identify missing or unclear information. Check for: title clarity, environment (build, browser/device, OS), preconditions, exact steps to reproduce, test data, expected vs actual result, frequency, severity/priority, evidence (screenshots, logs, network calls).
2. Point out anything ambiguous that a developer could misread.
3. Suggest a likely area of the system to investigate, labelled clearly as a hypothesis.
4. Rewrite the report in a clean, complete format, using placeholders like [MISSING: browser version] for anything that is not provided. Do not invent details.
