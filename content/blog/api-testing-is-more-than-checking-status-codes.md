---
title: API Testing Is More Than Checking Status Codes
excerpt: A 200 OK can still hide a broken response. What thorough API testing covers beyond the status code.
status: draft
featured: false
category: api-testing
tags:
  - api testing
  - postman
  - swagger
coverImage: ""
coverAlt: ""
---
> Draft outline. Not yet published.

## Why a 200 is not enough
- Correct status, wrong body.

## What to validate
- Response schema and data types.
- Business rules in the data.
- Headers, auth and permissions.

## Negative testing
- Invalid input, missing fields, boundary values.
- Error messages that help, and ones that leak.

## Tools I use
- Postman and Swagger in day-to-day work.

## Takeaway
- Test the contract and the behaviour, not just the code.
