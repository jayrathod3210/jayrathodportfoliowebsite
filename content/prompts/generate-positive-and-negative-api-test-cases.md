---
title: Generate positive and negative API test cases
description: Create a complete positive and negative test set for an API endpoint from its spec.
category: api-testing
status: published
featured: true
tags:
  - api testing
  - negative testing
  - postman
usageNotes: Works best with a Swagger/OpenAPI snippet. Remove secrets and real tokens before pasting.
---
Act as an API test engineer. Using the endpoint definition below, generate API test cases.

ENDPOINT DEFINITION (OpenAPI / Swagger / description):
"""
{{paste method, URL, headers, request schema, response schema, auth rules}}
"""

Generate:
1. Positive cases: valid requests, optional fields present/absent, different valid roles.
2. Negative cases: missing required fields, wrong data types, invalid formats, out-of-range values, unsupported methods, malformed JSON.
3. Auth & security cases: missing token, expired token, insufficient permissions, accessing another user's resource.
4. Boundary cases: min/max lengths, empty arrays, large payloads, special characters and unicode.

For each case include: ID, description, request (method, headers, body), expected status code, and expected response body checks (schema, key fields, error message).

Do not assume behaviour that is not in the definition. Mark any assumption with "ASSUMPTION:".
