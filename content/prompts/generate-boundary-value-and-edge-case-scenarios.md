---
title: Generate boundary-value and edge-case scenarios
description: Apply boundary value analysis and equivalence partitioning to an input or feature.
category: manual-testing
status: published
featured: false
tags:
  - boundary value analysis
  - edge cases
  - test design
usageNotes: Give the exact validation rules if you know them; otherwise ask the model to list the rules it assumes.
---
You are a test design specialist. Apply boundary value analysis and equivalence partitioning to the feature below.

FEATURE / FIELD RULES:
"""
{{e.g. "Age field: integer, 18–65 inclusive, required" or a feature description}}
"""

Produce:
1. Equivalence partitions (valid and invalid) for each input.
2. Boundary values: min-1, min, min+1, max-1, max, max+1, plus empty/null.
3. Edge cases: whitespace, leading zeros, decimals, very long input, special characters, unicode/emoji, copy-paste, locale formats, concurrency or double-submit where relevant.
4. A test table with: ID, input value, partition, expected result.

If a rule is not specified, state the assumption instead of guessing silently.
