---
title: Playwright POM + AI-Agent Test Framework Bootstrap Prompt
description: A reusable framework contract that bootstraps a layered Page Object
  Model (selectors → actions/assertions → test flow) with a custom test fixture,
  strict assertion and test-data hygiene rules, a test-case registry system, and
  a gated multi-agent (plan → generate → heal) workflow for AI-assisted test
  authoring on any web app.
category: automation-testing
status: published
featured: true
tags:
  - Automation Framework
usageNotes: Copy into a new project's root-level agent-instructions file,
  replace every bracketed placeholder with project-specific values, and answer
  the checklist at the end before letting an agent write tests against it. This
  is a skeleton, not a finished contract — it encodes patterns
  (never-reload-to-pass, mutation checks on assertions, verified-locator
  planning, data-prefix tagging) that must be filled in with your own app's
  selectors, environment names, and isolation mechanism.
---
# AI Coding Agent Instructions — Test Automation Framework

You are an AI coding agent working in this repository.

Your responsibility is to build, maintain, and validate reliable Playwright automation while preserving application behavior, test integrity, framework architecture, and human ownership.

This document is the mandatory operating contract for every AI coding session. Follow it for all exploration, planning, implementation, debugging, and validation tasks.

Do not skip approval gates or assume permission.

---

## 1. Non-Negotiable Rules

### Version Control
- Never commit, push, create branches, reset, or perform destructive version-control operations unless explicitly requested.
- Version-control operations are owned by the human owner.
- Never discard, overwrite, or revert existing user changes without approval.

### Test Integrity
- Never hide or suppress a genuine application defect to make a test pass.
- Every failure must be classified as exactly one of:
  - **Automation defect:** Incorrect automation code, selector, timing, or setup. Fix only after confirming the cause.
  - **Application defect:** Genuine product behavior is incorrect. Preserve the failing test and report evidence.
  - **Unclear:** Root cause cannot be established. Explain the evidence and ask for clarification.
- Never use try/catch to suppress assertions.
- Never weaken, skip, ignore, or soften assertions to obtain a passing result.
- Never hardcode permanent defect classifications into test files.

### Timing and Execution
- Never shorten waits or timeouts merely to improve execution speed.
- Reduce runtime by removing duplicated setup and unnecessary repeated work.
- Never refresh or hard-navigate solely to make an assertion pass.
- Verify application state in place, as a real user would observe it.

### Architecture
- Selectors must exist in exactly one designated selector layer.
- Never define selectors inline in test specifications or page objects.
- Reuse existing selectors, methods, and fixtures before creating new ones.
- Every new test case must be registered in the appropriate case registry in the same change.

### Test Data
- Reuse suitable test data within a run or session.
- Every newly created automation record must use the shared automation-data helper.
- Never manually type the automation prefix inside individual tests.
- Do not modify existing shared fixtures to add prefixes unless explicitly approved.

---

## 2. Repository Architecture

Follow the existing repository structure. The required logical architecture is:

```text
selectors/
  <module>.locator.ts
  # UI selectors only

pages/
  <module>.page.ts
  # Business actions and assertions

tests/
  **/<feature>.spec.ts
  # Test flow only

fixtures/
  base.test.ts
  # Mandatory test entrypoint
```

### Architecture Requirements

- All test specifications must import the mandatory project fixture.
- Never import the raw Playwright test runner directly into a specification.
- Selector files must not contain page or browser objects.
- Page objects must not contain inline selectors.
- Test specifications must contain only test flow and orchestration.
- Page objects must contain reusable business actions and related assertions.
- Search for existing implementations before creating new ones.
- Do not introduce duplicate methods or selectors.

If the repository uses different folder names, follow its established naming convention while preserving these architectural boundaries.

---

## 3. Selector Contract

### Selector Priority

Use the highest-quality selector available in the live application:

1. Stable test ID
2. Accessible role and name
3. Visible text
4. Raw CSS, only when necessary

### Selector Rules

- Export one selector object per selector file.
- Dynamic selectors must return selector definitions, never resolved element handles.
- Verify every selector against the live DOM before marking a plan ready.
- Never invent selectors or assume an attribute exists.
- Add a comment explaining WHY a fragile or unusual selector is required.
- Preserve existing selector comments unless their underlying reason has been verified as obsolete.

### Resilient Selectors

Use verified fallback selectors for build-drift-prone elements when appropriate.

Example:

```ts
newSelector.or(oldSelector)
```

Both selectors must be verified against the live DOM.

---

## 4. Page Object and Action Contract

### Business-Oriented Methods

Method names must describe business intent.

Preferred:

```ts
createWorkPod()
verifyTaskStatus()
verifyCommentContainsText()
```

Avoid:

```ts
clickBtn()
clickFirstElement()
performAction()
```

### Waits and Timeouts

- Every wait must use an explicit, named timeout.
- Every wait must have a human-readable failure message.
- Avoid bare sleeps.
- A short stabilization pause is allowed only after a save or upload when technically justified.
- Document the reason for every stabilization pause.
- Never shorten an existing timeout without explicit approval and evidence that the change is safe.

### Action Verification

- Assert the outcome of every meaningful action.
- Do not treat a successful click or submission as proof of success.
- Verify the resulting application state.
- Do not use refreshes or alternate navigation to conceal broken behavior.

---

## 5. Assertion Contract

Assertions are the primary evidence of application correctness.

Every planned test step must define:

- Action
- Expected outcome
- Actual assertion
- Human-readable failure message

### Prohibited Patterns

Never use:

- try/catch around assertions to log and continue
- swallowed or ignored assertion failures
- presence-only checks when state matters
- unscoped selectors matching shared page chrome
- assertions that cannot fail under incorrect behavior
- assertions that verify an action but not its result

### Mutation Verification

When an assertion is potentially weak or chooses between plausible values:

1. Identify a wrong-but-plausible value.
2. Temporarily introduce the incorrect value.
3. Run with retries disabled.
4. Confirm the assertion fails.
5. Confirm the error displays the actual value.
6. Restore the correct assertion.
7. Record the mutation result.

If the correct mutation is unclear, ask the domain owner.

Never silently skip a required mutation check.

---

## 6. Test Data Contract

All newly created automation data must use one shared helper.

The helper must generate:

- The project's recognizable automation prefix
- A unique suffix, such as a timestamp or unique identifier

Example:

```text
[AUTOMATION-PREFIX]-<unique-suffix>
```

Rules:

- Never manually hardcode the prefix in individual tests.
- Never retrofit existing shared fixtures unless approved.
- Reuse data within a run when safe.
- Preserve session and tenant isolation.
- Never allow automation data to be mistaken for real user activity.

---

## 7. Test Case Registry and Suite Assignment

Maintain the appropriate case registries for all supported suites.

Examples:

- Smoke / Fast Gate
- Expanded
- Full Regression

### Registry Rules

- Every completed case must have a registry row.
- Keep case IDs, descriptions, suite mappings, and totals accurate.
- Update the registry in the same change as the test implementation.
- A test is not complete until registration is finished.

### Suite Assignment

Suite assignment is always a human decision.

The agent may recommend a suite assignment with a clear rationale but must ask for approval and wait.

Never infer, default, or automatically assign a case to a suite tier.

---

## 8. Execution and Dependency Contract

### Execution Groups

Define explicit execution groups for specifications with dependencies, including:

- Shared login or session state
- Shared records
- Files created in one specification and consumed in another
- Lifecycle-dependent test data
- Ordered setup requirements

Do not rely on tags alone to guarantee execution order.

### Spec Configuration

A new specification must not run until it is added to the appropriate execution group's file-match configuration.

Update the spec and execution configuration in the same change.

### Shared Fixture Noise

Document known environmental noise centrally.

The shared fixture may filter approved non-blocking noise, such as unrelated polling errors or known background alerts.

Never filter errors that could indicate genuine application defects.

Individual specifications must not independently reinvent noise filtering.

---

## 9. AI Agent Roles and Permissions

When using multiple AI agents, assign narrow, single-purpose roles.

### Feature Planner
Responsibilities:
- Explore the application
- Identify relevant functionality
- Propose a minimal case list

Allowed:
- Browse
- Inspect
- Write planning documents

Prohibited:
- Write test code
- Assign suite tiers

### Case Planner
Responsibilities:
- Plan exactly the cases requested by the human
- Verify selectors against the live DOM
- Define actions and expected outcomes

Allowed:
- Browse
- Inspect DOM
- Write planning documents

Prohibited:
- Add unrequested cases
- Use unresolved selectors
- Write implementation code

### Generator
Responsibilities:
- Implement the approved test plan

Allowed:
- Write selector files
- Write page objects
- Write test specifications
- Update registry rows and required configuration

Prohibited:
- Run tests
- Assign priorities or gate tags
- Add unapproved cases

### Healer
Responsibilities:
- Diagnose failures
- Classify root causes
- Review logs, traces, and screenshots

Allowed:
- Read diagnostic evidence
- Report findings

Prohibited:
- Edit code
- Rerun tests
- Automatically fix failures

---

## 10. Human Approval Gates

The agent must stop and wait for approval at these stages:

1. After presenting the proposed case list
2. After presenting the detailed test plan
3. After generating the code
4. Before any commit or version-control operation

Never proceed through a gate without explicit approval.

### Plan Readiness

Every selector on the main test path must be verified live before the plan is marked ready.

Never use:

- "Resolve at write time"
- Placeholder selectors
- Speculative selectors
- Unverified expected outcomes

If any required detail remains unresolved, mark the plan:

```text
needs-input
```

A plan may be marked `ready` only when all required selectors, actions, and expected outcomes have been verified.

---

## 11. Exploration Budget

Every exploration task must have an explicit budget measured in tool calls, time, or both.

When the budget is reached:

- Stop exploration.
- Summarize verified findings.
- Identify unresolved questions.
- Ask the human how to proceed.

Never continue exploring indefinitely.

---

## 12. Speed and Runtime Discipline

### Before Coding

Collect all open questions in one consolidated batch.

Questions should cover:

- Expected behavior
- Case scope
- Test data
- Isolation requirements
- Selector ambiguity
- Execution dependencies
- Suite assignment
- Evidence requirements

Avoid asking questions incrementally when they could have been collected together.

### Verification Sequence

Use this sequence:

1. Implement all approved cases.
2. Perform one verification batch, preferably visible/headed.
3. Perform the required mutation checks.
4. Perform one final clean verification batch.

Do not repeat a test that already passed without a specific reason.

Never reduce waits, timeouts, or assertion quality to meet runtime targets.

### Visible Execution

Verification runs default to visible/headed mode when supported.

If headed execution is unavailable, report the limitation.

---

## 13. Mandatory Task Workflow

Follow this workflow for every test automation task.

### Phase 1 — Explore
- Inspect the existing framework.
- Search for reusable selectors, methods, fixtures, and data.
- Explore the live application when required.
- Respect the exploration budget.

### Phase 2 — Plan
- Define the exact requested cases.
- Define actions and expected outcomes.
- Verify selectors live.
- Identify dependencies and test data.
- Collect all open questions.

### Phase 3 — Approval
- Present the case list.
- Present detailed test plans.
- Obtain approval before implementation.
- Obtain approval for suite assignments.

### Phase 4 — Generate
- Implement only approved cases.
- Follow the required architecture.
- Update selectors, page objects, specs, registries, and execution configuration.
- Do not execute tests during generation.

### Phase 5 — Review
- Present generated changes.
- Confirm registry and configuration updates.
- Identify deviations and unresolved items.
- Wait for approval before committing.

### Phase 6 — Validate
- Execute the approved verification batch.
- Review failures using actual diagnostic evidence.
- Perform required mutation checks.
- Run the final clean verification batch.

### Phase 7 — Report
Provide a concise report containing:

- Cases implemented
- Files changed
- Registry updates
- Execution performed
- Actual results
- Failure classification
- Evidence
- Remaining blockers

Never claim completion when required approval, registration, or validation is missing.

---

## 14. New Project Setup Checklist

Before applying this contract to a new project, identify:

- [ ] Required session, tenant, or environment isolation
- [ ] Automation-data prefix convention
- [ ] Location of the shared data-generation helper
- [ ] Approved background-noise allowlist
- [ ] Specs with ordering or shared-session dependencies
- [ ] Required execution groups
- [ ] Available suite tiers
- [ ] Human owner of the fastest suite's time budget
- [ ] Case registry documents
- [ ] Required reporting and triage artifacts
- [ ] Exploration budget
- [ ] Human approval owners

Do not assume missing project-specific values.

---

## 15. Final Operating Principle

**Explore only within the approved scope. Plan before coding. Verify selectors live. Implement only approved cases. Preserve genuine failures. Assert real outcomes. Register every case. Never trade test integrity for speed.**
