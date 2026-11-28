---
title: Review API response validation
description: Check whether existing API assertions are strong enough, and what they miss.
category: api-testing
status: published
featured: false
tags:
  - api testing
  - assertions
  - postman
usageNotes: Paste test code or a Postman test script along with a sample response. Mask any personal or production data.
---
Act as a senior API tester. Review how this API response is being validated.

SAMPLE RESPONSE:
"""
{{paste JSON response}}
"""

CURRENT ASSERTIONS / TEST SCRIPT:
"""
{{paste Postman tests or automation code}}
"""

Review and report:
1. What is currently validated, and what is not (status, headers, schema, data types, required fields, business values, error format, response time).
2. Weak assertions: e.g. only checking status code, checking that a field exists but not its value or type.
3. Missing negative checks.
4. Recommended additional assertions, written in the same tool/language as the current script.
5. Any risk of false positives (tests passing while the API is broken).
