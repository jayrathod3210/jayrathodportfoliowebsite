---
title: Set up a GitHub Actions CI/CD workflow
description: Have an AI read your repo, ask the right questions, then generate a production-grade GitHub Actions workflow with reporting and notifications.
category: ci-cd-devops
status: published
featured: false
tags:
  - ci/cd
  - github actions
  - test automation
usageNotes: Run this with an assistant that can read your repository. It will stop and ask questions before generating anything — answer them, then say "go ahead".
---
You are a senior CI/CD engineer. Set up a complete, production-grade GitHub Actions workflow (.github/workflows/ci.yml) for this repository, plus its notification helper scripts. Work in three phases — DISCOVER, CONFIRM (human gate), GENERATE — and do not invent facts: read the repo before writing anything.

Hard rule — human gate: complete phase 1 and phase 2, then stop. Do not write any workflow YAML or helper scripts until I have answered your questions and explicitly told you to proceed. At the end of phase 2, present your findings and questions, then wait. If my answers reveal more unknowns, ask again before touching phase 3. Never assume "proceed" from silence.

PHASE 1 — DISCOVER (read the repo, report what you find)
Runtime and version with lockfile; package manager and frozen install command; the real scripts for install, lint, typecheck, build, unit tests, integration/e2e tests; test framework specifics (config, reporters, workers, projects, whether tests need serial execution); test parallelization (worker counts, sharding, matrix, ordered suites, browsers) and any suite that must run alone; artifacts produced (reports, coverage, build output) and where; any notification assets already in the repo (email templates, logos, helper scripts) to reuse; any existing workflow files, reviewed for what already works and what looks risky; secrets the workflow needs, listed by name; shared/mutable external state that breaks if two runs overlap.

PHASE 2 — CONFIRM (human gate: report, then ask, then wait)
Produce a short written review of what you found in phase 1, including a critique of any existing workflow. Then ask me every question whose wrong answer would break or degrade the run, at minimum:
- Which environment(s) does the suite run against? Do separate GitHub Environments with required reviewers or env-scoped secrets make sense?
- What services the tests need running (DB, API, seeded data, browsers, system packages), and any auth/test-account setup.
- Is there one shared test account, DB or staging environment that concurrent runs would corrupt? Must runs serialize, or must any suite run alone or in order?
- Trigger branches for push/PR, and whether a nightly schedule is wanted and at what time.
- Report hosting and retention — GitHub Pages on gh-pages, and how many dated reports to keep.
- Notification recipients/from-address for email, and whether a Discord webhook is wanted and what fields it should show.
- The exact secret names and where they live (repo, org, or environment).
- Anything else left ambiguous by the repo.

Format as a numbered list, then stop and wait. Do not proceed to phase 3 until I reply and say to go ahead.

PHASE 3 — GENERATE (only after my approval)
Produce a workflow with: triggers for push/pull_request/workflow_dispatch plus a nightly schedule; least-privilege permissions at the top; a concurrency block that serializes any shared/report-hosting jobs (non-cancelable) and cancels stale PR runs; secrets referenced only via ${{ secrets.NAME }}, never hardcoded; checkout plus the stack's setup action with its built-in dependency cache, plus actions/cache for heavyweight extras (e.g. browser binaries) keyed on the lockfile hash; a quality-gates job (lint, typecheck, build, unit tests) that fails fast before long e2e jobs; parallel tests via a matrix with fail-fast: false, each job with its own isolated state and report directory; a step that parses the JSON results file into pass/fail/skip counts, guarded for a missing file; needs-based ordering with if: always() on downstream report/notify jobs so a test failure never skips reporting; per-job partial-report uploads; a report-and-hosting job that merges all partial reports, publishes a summary, deploys to GitHub Pages preserving history, and prunes old dated report folders down to the agreed retention window; a notification job (if: always()) using two helper scripts — an HTML email via nodemailer with an embedded logo and a color-coded summary table, and a Discord webhook post with the same summary — both reading every address and credential from environment variables only, and both failing silently (never failing the build) if their secret is empty; comments explaining why each concurrency, needs, if and prune step exists.

Output, in this order:
1. The complete .github/workflows/ci.yml.
2. The sendreport.js and notify_discord.js helper scripts (env-driven, no hardcoded secrets).
3. A pre-flight checklist: every secret to create by name, the logo file path to add, Pages settings, and any GitHub Environment to create with reviewers.
4. A short list of assumptions made (should be minimal, since the human gate resolved the unknowns).

Phase 3 output is produced only after I have reviewed phase 2 and approved. If that approval hasn't been given, stop at the end of phase 2.
