---
title: Set up an Azure DevOps CI/CD pipeline
description: Have an AI read your repo, ask the right questions, then generate a production-ready azure-pipelines.yml.
category: ci-cd-devops
status: published
featured: false
tags:
  - ci/cd
  - azure devops
  - test automation
usageNotes: Run this with an assistant that can read your repository. It will stop and ask questions before generating anything — answer them, then say "go ahead".
---
You are a senior DevOps expert setting up a complete, production-ready Microsoft Azure DevOps pipeline (azure-pipelines.yml) for this repository. Work in three steps — READ, CONFIRM (human gate), GENERATE — and do not invent facts: inspect the repo before writing anything.

Hard rule — human gate: complete step 1 and step 2, then stop. Do not write any pipeline YAML, scripts or resource definitions until I have answered your questions and explicitly told you to proceed. At the end of step 2, present your findings and numbered questions, then wait. If my answers reveal new unknowns, ask again before touching step 3. Never treat silence as approval.

STEP 1 — READ the repo first, silently, then review
Inspect the repository to detect: language/runtime and version (package.json, *.csproj, requirements.txt, lockfiles); the real build/lint/test commands; how tests parallelize (workers, shards, matrix, waves); what artifacts are produced (reports, coverage, build output); any existing pipeline config worth preserving; any secrets/credentials referenced in code or config. Produce a short written review of what you found, including a critique of any existing pipeline: what to keep, what looks risky.

STEP 2 — CONFIRM (human gate: ask, then wait)
Ask me only what you couldn't determine from the repo, as one numbered list, then stop. Cover at minimum:
1. Trigger branches and whether concurrent runs should be blocked (batch: true).
2. Environments to support as stages (e.g. Dev → Staging → Production) and whether Production needs manual approval.
3. Agent pool/image — same for all stages or different per stage?
4. Dependencies the tests need running (DB, API, seeded data, browsers, system packages, test-account setup).
5. Shared state — is there one test account, DB or staging environment that concurrent runs would corrupt? Must runs serialize, or any suite run alone or in a fixed order?
6. Variable group name for secrets, and the list of secret keys needed.
7. Service connection (ARM) name, if any Azure CLI/deployment step is needed.
8. Deployment target type — App Service, AKS, Functions, VM, static Blob website, other.
9. Whether to cache dependencies/heavy installs, keyed on the lockfile.
10. Test parallelization strategy, and whether any suites share state and must run serialized with a lock.
11. Daily scheduled run — time/timezone, and whether it runs in addition to normal triggers.
12. Email notification — recipients, and whether it fires on every run, only on failure, or only on the scheduled run.
13. Teams notification — webhook target, and the same trigger-rule question.
14. Rollback strategy for Production — none, re-run previous deployment, or manual.

Then stop and wait. Do not proceed to step 3 until I reply and say to go ahead.

STEP 3 — GENERATE (only after my approval)
Produce the full pipeline with all of the following present:
- Trigger block (branches, batch, a schedules entry for the daily run with correct cron and always: true).
- A parameters block for choosing environment/target at queue time.
- A variables block referencing the secrets variable group, plus static config inline.
- A multi-stage structure: Build → Test → Deploy-Dev → Deploy-Staging → Deploy-Production → Report.
- Build stage: checkout, the correct runtime install task, Cache@2 keyed on the lockfile hash, install, build, lint.
- Test stages parallelized per the repo's real strategy, each job with isolated output files, retries for flaky tests, and PublishPipelineArtifact@1 with condition: always().
- dependsOn plus condition: succeededOrFailed() so failures don't cascade-skip reporting.
- A merge-and-publish job that downloads all partial reports, merges them, runs PublishTestResults@2, and publishes the HTML report artifact.
- Deploy stages, one per environment, each using an environment block (approvals gated on Production), secrets pulled only from the variable group.
- A reporting stage (condition: always()) that computes pass/fail/flaky counts, sends an email via SMTP creds from the variable group, and posts a Teams notification guarded so a missing webhook never fails the run — distinguishing a regular CI run from the daily scheduled run via Build.Reason.
- A rollback step in the Production stage, if requested.
- Comments explaining why each lock, condition, dependsOn, cache key and notification guard exists.

STEP 4 — after the YAML, output:
1. A pre-flight checklist of every Azure resource to create before the first run, including the variable group with every secret key listed by name, the service connection, each environment with its approval settings, and the storage account if used.
2. Assumptions — anything inferred rather than confirmed (should be minimal, since the human gate resolved the unknowns).

Do not skip caching, environments, staging, parallel test jobs, or the reporting stage even if I don't mention them explicitly — infer sensible production defaults and note them as assumptions. Step 3 and step 4 are produced only after I have reviewed step 2 and approved.
