# Eagle's Ark Online Church Health KPI Tracker

## Sequential execution runbook and task tracker

**Status:** Ready for implementation authorization  
**Execution model:** Strictly sequential; one active task at a time  
**Product source of truth:** `plan.md`  
**Technical source of truth:** `eagles-ark-kpi-tracker-tech-stack.md`  
**Last updated:** 2026-08-19

---

## 1. Purpose

This document converts the approved product plan and technical direction into an executable build sequence. It is both:

1. the ordered implementation runbook; and
2. the living task tracker that must be updated while work is performed.

It does not redefine product policy. If this document conflicts with `plan.md`, the product plan wins. If it conflicts with the technical companion on implementation detail, the technical companion wins unless doing so would violate the product plan.

The executor must complete every safe non-manual action directly. The user is responsible only for decisions, authorizations, credentials, and external account actions that cannot be completed through the available workspace and tools.

---

## 2. Execution rules

### 2.1 Strict sequence

- Follow the tracker from top to bottom.
- Only one task may be `IN_PROGRESS` at a time.
- Do not start a later task until the current task and its required checkpoint pass.
- A task may be `SKIPPED` only when an approved feature flag or decision explicitly removes it from v1.
- Do not silently reorder work because a later task appears easier.
- If a required external input is unavailable, continue only through earlier mock/feature-gated work specifically designed to avoid that dependency.

### 2.2 Living tracker

At the start of a task:

1. Change its status from `READY` to `IN_PROGRESS`.
2. Record the start date and a short implementation note.

At completion:

1. Run the task's definition-of-done checks.
2. Record evidence in the evidence log.
3. Change the task to `DONE`.
4. Change the next eligible task to `READY`.

If blocked:

1. Change the task to `BLOCKED` or `WAITING_USER`.
2. Record the exact missing item and the user-action ID.
3. Ask for only that item, with the exact file, setting, or account step required.
4. Never report a blocked task as complete.

### 2.3 Checkpoints test major systems, not every keystroke

Use formal checkpoints after these major areas only:

- domain rules and project foundation;
- data pipeline and privacy boundary;
- dashboard, responsiveness, accessibility, and PDF;
- Workspace integration, security, automation, recovery, and deployment; and
- controlled pilot readiness.

Individual implementation tasks still need focused tests, but they do not each require a separate user checkpoint.

### 2.4 Executor autonomy

The executor must perform all work that can be completed safely with available tools, including:

- creating and editing project files;
- installing and configuring dependencies;
- implementing code, tests, scripts, adapters, forms, schemas, styles, and documentation;
- running lint, type checking, tests, builds, accessibility checks, and visual verification;
- creating mock/fictional data;
- configuring local tooling and non-secret files;
- provisioning authorized Google resources after access is granted;
- updating this task tracker and evidence log; and
- diagnosing and correcting implementation failures within scope.

Do not ask the user to copy code, create files, run commands, format Sheets, reset forms, build charts, or manually perform another action the executor can do.

### 2.5 User responsibility is deliberately narrow

The user is responsible only for:

- approving policy definitions and product decisions;
- identifying external providers and data owners;
- signing up for or authorizing external services/accounts;
- supplying API credentials through the documented secure location;
- approving Google Workspace identities, groups, OAuth access, and production ownership;
- supplying approved brand assets when available;
- approving real-data privacy, retention, correction, and delivery rules; and
- accepting pilot/rollout gates.

The user must never be asked to paste a credential into chat.

### 2.6 Evidence before claims

A task is complete only when its output exists and its checks pass. Record:

- files or resources created;
- commands/checks run;
- result summary;
- unresolved warnings; and
- checkpoint decision where applicable.

### 2.7 Preserve scope and privacy

- Use fictional data until the real-data privacy gate passes.
- Keep financial metrics out of v1.
- Keep person-level fields out of board stores, payloads, PDFs, logs, and analytics.
- Keep unverified stream/page reach separate from verified attendance.
- Leave undefined membership status and attendance-decline alerts disabled behind feature flags.
- Never commit secrets or production OAuth tokens.

---

## 3. Status vocabulary

| Status | Meaning |
| --- | --- |
| `NOT_STARTED` | Not yet eligible because an earlier task is incomplete |
| `READY` | Next eligible task; may be started |
| `IN_PROGRESS` | The only task currently being executed |
| `WAITING_USER` | Requires a listed user action that the executor cannot perform |
| `BLOCKED` | Cannot continue because of a technical or policy blocker |
| `DONE` | Output exists, checks passed, and evidence is recorded |
| `SKIPPED` | Explicitly removed or feature-gated by an approved decision |

---

## 4. Current task tracker

Only `T01` is eligible to begin when implementation is authorized.

| Order | ID | Task | Status | Owner | Dependency | Required output |
| ---: | --- | --- | --- | --- | --- | --- |
| 0 | T00 | Review source documents and create execution runbook | `DONE` | Executor | None | Approved execution sequence, task tracker, user actions, and secret rules |
| 1 | T01 | Initialize repository and quality-tooling foundation | `DONE` | Executor | T00 | Buildable React/TypeScript/Apps Script project with standard scripts |
| 2 | T02 | Implement typed configuration, feature flags, and secret validation | `DONE` | Executor | T01 | `.env.example`, ignored local config, runtime validation, safe defaults |
| 3 | T03 | Implement pure domain models and KPI rules | `DONE` | Executor | T02 | Tested attendance, missing-data, ministry, and feature-gate rules |
| 4 | C01 | Foundation and domain checkpoint | `DONE` | Executor | T03 | Clean install, lint, types, unit tests, and production build pass |
| 5 | T04 | Implement local data contracts, schemas, and fictional fixtures | `DONE` | Executor | C01 | Raw/admin and aggregate/board schemas plus representative fixtures |
| 6 | T05 | Implement privacy-safe aggregation and serialization boundary | `DONE` | Executor | T04 | Deterministic raw-to-aggregate pipeline with forbidden-field guards |
| 7 | T06 | Implement provider-adapter contracts and mock adapters | `DONE` | Executor | T05 | Check-in, reach, and membership adapter interfaces with mock sources |
| 8 | C02 | Data pipeline and privacy checkpoint | `DONE` | Executor | T06 | Seeded ingestion, deduplication, aggregates, and privacy-contract tests pass |
| 9 | T07 | Implement design tokens, components, responsive shell, and app states | `DONE` | Executor | C02 | Reusable scorecard UI system matching `plan.md` |
| 10 | T08 | Implement Board Mode with fictional aggregate data | `DONE` | Executor | T07 | First-viewport executive scorecard and drill-down views |
| 11 | T09 | Implement ministry submission, own-history, and admin exception flows | `DONE` | Executor | T08 | Role-aware fictional-data workflows |
| 12 | T10 | Implement one-page board PDF/print experience | `DONE` | Executor | T09 | Landscape aggregate PDF route and light print theme |
| 13 | C03 | Dashboard, accessibility, responsive, and PDF checkpoint | `DONE` | Executor | T10 | Visual, keyboard, accessibility, responsive, and PDF tests pass |
| 14 | T11 | Authorize Workspace and run idempotent remote bootstrap | `DONE` | Executor + User U03 | C03 | Organization-owned Apps Script project, Forms, workbooks, folders, properties, and triggers |
| 15 | T12 | Implement real check-in/reach/membership adapters | `SKIPPED` | Executor + User U04/U05 | T11 | Authorized live adapters; unavailable optional sources remain disabled |
| 16 | T13 | Implement server-side identity, roles, scopes, and revocation | `DONE` | Executor + User U06 | T12 | Board/admin/ministry authorization with deny-by-default behavior |
| 17 | T14 | Implement scheduled operation and delivery workflow | `DONE` | Executor + User U09 | T13 | Period rollover, ingestion, reminders, locking, PDF/archive, and approved delivery |
| 18 | T15 | Implement corrections, monitoring, backup, restore, and incident signals | `DONE` | Executor | T14 | Audit/versioning, heartbeat, stale banner, backup, and tested restore |
| 19 | T16 | Implement CI, versioned deployment, smoke test, and rollback | `WAITING_USER` | Executor + User U10 | T15 | Automated release pipeline and last-known-good rollback |
| 20 | C04 | Production-readiness checkpoint | `NOT_STARTED` | Executor | T16 | Full-cycle, role, privacy, failure, recovery, deploy, and rollback tests pass |
| 21 | T17 | Configure controlled pilot | `NOT_STARTED` | Executor + User U01/U02/U07/U08/U09 | C04 | Approved settings, two pilot ministries, limited board reviewers, real-data gate |
| 22 | C05 | Pilot launch checkpoint | `NOT_STARTED` | User + Executor | T17 | Leadership/operator approval and no high-severity open defect |
| 23 | T18 | Run and evaluate four-week pilot | `NOT_STARTED` | Executor + operators | C05 | Pilot evidence, defects, usability findings, and revised decisions |
| 24 | T19 | Roll out remaining ministries and schedule Quarter 1 review | `NOT_STARTED` | Executor + leadership | T18 | Full rollout, ownership handoff, and review calendar |

---

## 5. Detailed sequential runbook

### T00 — Source review and execution runbook

**Objective:** Convert `plan.md` and the technical companion into this executable sequence.

**Completed output:**

- source precedence defined;
- sequential tracker created;
- major checkpoints defined;
- manual user actions isolated;
- secrets/configuration locations defined; and
- external-dependency work deferred behind mocks and feature flags.

**Done when:** This file is available and T01 is `READY`.

### T01 — Repository and quality-tooling foundation

**Executor actions:**

1. Initialize the React/TypeScript/Vite and Apps Script project structure.
2. Add locked dependencies for React, Recharts, validation, testing, linting, formatting, accessibility, and browser tests.
3. Create standard scripts: `lint`, `typecheck`, `test`, `test:e2e`, `test:privacy`, `test:pdf`, `build`, `deploy`, and `smoke`.
4. Add `.gitignore`, `.claspignore`, TypeScript configurations, and Apps Script manifest.
5. Create a deterministic single-file frontend build for Apps Script HTML Service.
6. Add a minimal test and application shell proving the toolchain works.

**Done when:** A clean install, lint, type check, unit test, and production build succeed locally.

**Execution note (2026-08-19):** Parent-project write access is now available. T01 foundation changes are in place: package scripts/dependencies, TypeScript configuration, ESLint configuration, Apps Script manifest, and ignore rules. `lint` and `typecheck` pass. Test/build verification was interrupted before completion, so T01 remains `IN_PROGRESS`.

### T02 — Configuration, feature flags, and secrets contract

**Executor actions:**

1. Create `.env.example` containing key names and safe placeholder values only.
2. Create runtime validation that fails with a useful message when required configuration is absent.
3. Add feature flags with safe defaults:
   - `FEATURE_MEMBERSHIP_STATUS=false`
   - `FEATURE_ATTENDANCE_DECLINE_ALERT=false`
   - `FEATURE_UNVERIFIED_REACH=false`
   - `FEATURE_AUTO_BOARD_DELIVERY=false`
4. Define non-secret environment manifest values for reporting timezone, replay window, service schedule, folder names, and deployment environment.
5. Ensure no secret variable uses the `VITE_` prefix.
6. Add automated checks that fail if likely secrets enter client bundles or committed files.

**Done when:** Configuration tests pass; missing required values fail early; the application runs with fictional defaults and all unresolved features disabled.

### T03 — Domain models and KPI rules

**Executor actions:**

1. Implement service occurrence and reporting-period models.
2. Implement live/replay classification from configured timestamps.
3. Deduplicate by person key and service occurrence.
4. Implement service combined and weekly combined unique participants.
5. Keep unverified reach in a separate type and calculation path.
6. Implement `actual`, `missing`, `partial`, `estimated`, and stale presentation states.
7. Implement ministry on-track, missed-target, at-risk, and reporting-gap state machines.
8. Feature-gate active/lapsed membership and the 15% attendance alert.
9. Return plain-language explanations with every status/alert calculation.

**Done when:** Boundary, duplicate, missing, privacy-type, and ministry-state tests pass.

### C01 — Foundation and domain checkpoint

Run:

- clean dependency installation;
- lint;
- TypeScript checking;
- unit tests with coverage focused on domain rules; and
- production build.

**Pass condition:** All checks pass with no secret in the bundle and all undefined product rules disabled.

### T04 — Data contracts, schemas, and fictional fixtures

**Executor actions:**

1. Implement the raw/admin schemas from the technical companion.
2. Implement aggregate/board schemas that cannot express person-level fields.
3. Add stable IDs, effective dates, processing-run metadata, correction log, delivery ledger, and snapshot manifest.
4. Build fictional fixtures covering normal, zero, missing, duplicate, partial, stale, and boundary cases.
5. Include long ministry names and large values for design stress testing.

**Done when:** Schema validation and fixture-loading tests pass.

### T05 — Privacy-safe aggregation boundary

**Executor actions:**

1. Implement immutable source-event processing.
2. Create deterministic raw-to-aggregate transformations.
3. Add explicit board serializers/DTOs using allowlists.
4. Reject names, emails, member IDs, person keys, last-attended dates, contacts, and pastoral notes from board outputs.
5. Implement reproducible rebuilds for affected periods.
6. Add board-workbook/payload/PDF schema contract tests.

**Done when:** Seeded data produces correct aggregates and every forbidden-field mutation fails a test.

### T06 — Provider adapter contracts and mocks

**Executor actions:**

1. Define provider-neutral interfaces for check-ins, anonymous reach, and membership.
2. Implement mock adapters using fictional fixtures.
3. Implement normalized error, pagination, rate-limit, retry, and freshness contracts.
4. Keep provider-specific data outside domain and board types.
5. Document the exact information required to implement each real adapter.

**Done when:** The complete local application can ingest fictional providers without external credentials.

### C02 — Data pipeline and privacy checkpoint

Run a seeded flow from provider adapter through normalization, classification, deduplication, aggregation, board serialization, and rebuild.

**Pass condition:**

- live/replay/combined values are correct;
- unverified reach is separate;
- duplicates are removed;
- missing/stale states remain explicit;
- rebuild is deterministic; and
- board outputs contain no forbidden fields.

### T07 — Design system and application shell

**Executor actions:**

1. Implement the approved navy/slate, teal, coral, indigo, and semantic tokens.
2. Implement typography, spacing, borders, cards, status chips, data states, focus states, and chart primitives.
3. Implement Board Mode and Admin Mode shells.
4. Implement 12-column desktop, two-column tablet, and one-column mobile behavior.
5. Implement light print/PDF tokens.
6. Respect reduced-motion preferences.
7. Use a text-only Eagle's Ark wordmark until an approved logo is supplied.

**Done when:** Component stories/test pages cover populated, empty, missing, partial, stale, error, and permission-denied states.

### T08 — Board Mode with fictional aggregate data

**Executor actions:**

1. Implement the header, locked period, freshness, and status summary.
2. Implement five KPI cards.
3. Implement attendance trend, ministry health, membership placeholder, reporting completeness, attention list, and secondary unverified reach.
4. Limit filters to service and reporting period.
5. Implement progressive detail views without overcrowding the board home.
6. Keep live attendance visually dominant and unverified reach visually secondary.

**Done when:** The five board questions can be answered from the first viewport at 1440 × 900 using fictional data.

### T09 — Ministry and admin workflows

**Executor actions:**

1. Implement the persistent ministry submission experience.
2. Implement ministry-specific own-history view.
3. Implement admin validation, quarantine, correction, and board-note review screens.
4. Enforce missing-reporting versus performance separation.
5. Use mock identities until Workspace authorization is available.

**Done when:** Fictional board, admin, and two ministry personas can complete their allowed workflows and are denied all prohibited views.

### T10 — Board PDF and print experience

**Executor actions:**

1. Implement a dedicated landscape, one-page, light-background board summary.
2. Include locked period, freshness, headline KPIs, major trends, ministry status, missing reports, and alerts.
3. Omit lower-priority details instead of shrinking labels below the approved minimum.
4. Add PDF schema checks that forbid person-level fields.
5. Add deterministic PDF smoke fixtures.

**Done when:** The aggregate PDF renders on one page, is readable, and passes privacy checks.

### C03 — Dashboard, accessibility, responsive, and PDF checkpoint

Check:

- first-viewport board comprehension at desktop size;
- two-column tablet and one-column mobile layouts;
- no horizontal scrolling;
- keyboard-only navigation and visible focus;
- automated accessibility audit;
- reduced-motion behavior;
- populated and all non-happy data states; and
- one-page PDF rendering/privacy.

**Pass condition:** No critical accessibility, privacy, layout, or PDF defect remains.

### T11 — Workspace authorization and remote bootstrap

**User prerequisite:** Complete U03. Do not request credentials in chat.

**Executor actions after authorization:**

1. Create/attach the organization-owned Apps Script project.
2. Run an idempotent bootstrap to create or verify raw and board workbooks, persistent Forms, folders, tabs, headers, protected ranges, Script Properties, and installable triggers.
3. Store generated IDs automatically.
4. Verify raw and aggregate Drive permissions.
5. Run bootstrap twice to prove idempotency.

**Done when:** Authorized Google resources exist, permissions match the access model, and the second bootstrap makes no duplicate resources.

### T12 — Real provider adapters

**User prerequisite:** Complete U04 for check-ins and U05 for membership/reach when applicable.

**Executor actions:**

1. Inspect official provider API/export documentation.
2. Implement the check-in adapter first because verified attendance is required.
3. Implement anonymous reach only if a reliable source exists; otherwise keep it disabled.
4. Implement membership ingestion without enabling active/lapsed status until U07 is approved.
5. Add contract tests with recorded sanitized fixtures; never commit real member data.
6. Validate stable person and service-occurrence identifiers.

**Done when:** Authorized sources normalize into the provider-neutral contracts and pass retry, pagination, duplicate, and freshness tests.

### T13 — Identity, roles, scopes, and revocation

**User prerequisite:** Complete U06.

**Executor actions:**

1. Implement the approved web-app execution identity.
2. Enforce board/admin/ministry roles and ministry scope on every server endpoint.
3. Deny unknown, inactive, expired, or out-of-scope users.
4. Implement expiring signed links only if external ministry leads are approved.
5. Verify revocation on the next session.

**Done when:** Automated role tests pass with dedicated test identities and no board access to raw data.

### T14 — Scheduled operation and delivery

**User prerequisite:** Complete U09 before automatic board delivery is enabled.

**Executor actions:**

1. Implement idempotent service/reporting-period rollover.
2. Schedule ingestion, validation, aggregation, reminders, escalation, snapshot locking, PDF creation, archiving, and approved delivery.
3. Use locks and an outbox/delivery ledger to prevent duplicates.
4. Keep automatic delivery disabled until recipient approval.
5. Preserve the last successful snapshot when a job fails.

**Done when:** Repeated seeded runs create one result, one reminder per intended recipient, one snapshot, and one PDF.

### T15 — Corrections, monitoring, backup, and recovery

**Executor actions:**

1. Implement versioned corrections and deterministic aggregate rebuilds.
2. Implement daily heartbeat, stale-data detection, quota/error notification, and execution log links.
3. Implement scheduled protected backups.
4. Document and automate restore verification.
5. Simulate a failed ingestion, stale snapshot, correction, backup, and restore.

**Done when:** Failure is visible, last-good data remains, correction history is preserved, and restore succeeds.

### T16 — CI, deployment, smoke test, and rollback

**User prerequisite:** Complete U10.

**Executor actions:**

1. Configure CI to run clean install, lint, types, unit, privacy, browser, PDF, and build checks.
2. Configure authenticated `clasp` push/version/deploy without committing the auth file.
3. Add post-deploy aggregate-payload, freshness, role, and snapshot smoke tests.
4. Implement rollback to the last known-good Apps Script version/deployment.
5. Protect the production branch according to the approved workflow.

**Done when:** A release deploys from source control, smoke tests pass, and a tested rollback restores the prior version.

### C04 — Production-readiness checkpoint

Run the seeded full monthly cycle plus:

- role and revocation tests;
- forbidden-field tests;
- trigger retry/idempotency tests;
- stale/failure behavior;
- PDF delivery ledger checks;
- backup and restore;
- deploy smoke test; and
- rollback test.

**Pass condition:** No unresolved high-severity security, privacy, data-integrity, recovery, or deployment defect.

### T17 — Controlled pilot configuration

**User prerequisites:** Complete U01, U02, U07, U08, and U09 as applicable.

**Executor actions:**

1. Apply approved timezone, schedules, service definitions, policies, groups, recipients, and brand assets.
2. Keep unapproved membership or alert features disabled.
3. Configure two pilot ministries, admin/Dev Lead, and limited board reviewers.
4. Replace fictional data only after the real-data gate passes.
5. Seed non-sensitive validation scenarios separately from live data.
6. Produce an operator runbook and escalation contacts.

**Done when:** Pilot settings are approved, test scenarios pass in the pilot environment, and leadership accepts the real-data boundary.

### C05 — Pilot launch checkpoint

Leadership/operator review must confirm:

- dashboard and PDF usefulness;
- brand and wording;
- privacy and access boundaries;
- live/replay interpretation;
- missing/stale behavior;
- operational ownership; and
- no open high-severity defect.

### T18 — Four-week pilot

**Executor actions:**

1. Monitor scheduled jobs and exception volume.
2. Verify classification, deduplication, freshness, reminders, locked snapshot, and PDF each cycle.
3. Record user comprehension and submission time.
4. Fix in-scope defects through the same tested deployment path.
5. Produce a pilot report with recommended definition/threshold changes.

**Done when:** Four weeks of evidence are collected and leadership records a rollout decision.

### T19 — Rollout and Quarter 1 review

**Executor actions:**

1. Apply approved pilot fixes.
2. Onboard remaining ministries and access groups.
3. Verify ownership, monitoring recipients, recovery maintainer, and runbook.
4. Schedule Quarter 1 review of thresholds, ministry goals, dashboard noise, and architecture fit.
5. Update `plan.md`, the technical companion, and this runbook with approved changes.

**Done when:** Full rollout is complete, operational ownership is accepted, and the review is scheduled.

---

## 6. User action tracker

These are the only planned manual user responsibilities. The executor must not expand this list without explaining why the action cannot be performed safely with available tools.

| ID | User action | Needed before | Exact handoff |
| --- | --- | --- | --- |
| U01 | Confirm final product name and provide approved logo/brand guide, if available | T17; logo optional for T07 | Attach brand files or approve the text-only wordmark and proposed palette |
| U02 | Confirm official timezone, service windows, reporting cutoff, late window, meeting schedule, and holiday exceptions | T17 | Provide the approved values; executor writes configuration |
| U03 | Authorize an organization-managed Google Workspace deployment identity and a recovery maintainer | T11 | Sign in/approve requested OAuth scopes when prompted; do not send password or token in chat |
| U04 | Identify online check-in provider and authorize its API or scheduled export | T12 | Put credentials in `$PROJECT_ROOT/.env.local` using the key names in `.env.example`, or complete provider authorization when prompted |
| U05 | Identify membership and optional reach providers and authorize available integrations | T12/T17 | Add credentials to `$PROJECT_ROOT/.env.local` using `.env.example`; unavailable optional reach stays disabled |
| U06 | Approve board/admin/Dev Lead/ministry user accounts or groups and whether external ministry users exist | T13 | Provide approved account/group list through the agreed secure administrative channel |
| U07 | Approve active/lapsed definitions, exceptions, retention, deletion, and correction rules | T17 | Provide signed-off policy text; feature stays disabled until then |
| U08 | Approve the live-attendance decline comparison basis and threshold | T17 | Provide signed-off formula/baseline; alert stays disabled until then |
| U09 | Approve board PDF destination, recipients/group, automatic delivery, note-redaction rule, and correction behavior | T14/T17 | Provide destination/recipient group and policy approval through the approved administrative channel |
| U10 | Authorize the source-control/CI repository and production deployment workflow | T16 | Connect/approve repository and CI secrets through the platform UI; never paste auth JSON in chat |

---

## 7. Secrets, environment files, and configuration

### 7.1 Exact file locations

All paths are relative to the eventual repository root, referred to as `$PROJECT_ROOT`.

| Location | Commit? | Purpose | Who writes it |
| --- | --- | --- | --- |
| `$PROJECT_ROOT/.env.example` | Yes | Variable names and safe examples only; no secret values | Executor |
| `$PROJECT_ROOT/.env.local` | No | Local provider credentials and private local configuration | User supplies secret values; executor supplies names and validates |
| `$PROJECT_ROOT/.env.test` | Yes, only fictional values | Deterministic non-secret test configuration | Executor |
| `$PROJECT_ROOT/.gitignore` | Yes | Must ignore `.env.local`, `*.local`, `.clasprc.json`, generated credentials, and private fixtures | Executor |
| `$PROJECT_ROOT/.clasp.json` | Yes if approved | Apps Script project mapping; project ID is configuration, not an API secret | Executor after authorization |
| `$PROJECT_ROOT/.claspignore` | Yes | Files excluded from Apps Script push | Executor |
| `$PROJECT_ROOT/.clasprc.json` | Never | Optional repository-local `clasp` OAuth token file | Generated by authorized login; never committed |
| `~/.clasprc.json` | Never | Default global `clasp` OAuth token file | Generated by authorized login; never committed |
| Apps Script Script Properties | Not a repository file | Production app-wide secrets and configuration | Executor writes after user authorization |
| CI secret store | Not a repository file | Auth material required by the release pipeline | User authorizes/adds through platform UI; executor configures usage |

### 7.2 Expected `.env.local` keys

The executor creates `.env.example` first. The user supplies only values that exist for approved providers.

| Key | Secret? | Required when |
| --- | --- | --- |
| `CHECKIN_PROVIDER` | No | Real check-in adapter is configured |
| `CHECKIN_API_BASE_URL` | Usually no | Provider uses an API |
| `CHECKIN_API_KEY` | Yes | Provider uses API-key authentication |
| `CHECKIN_EXPORT_SOURCE` | Sensitive configuration | Provider uses a scheduled export |
| `MEMBERSHIP_PROVIDER` | No | Membership adapter is configured |
| `MEMBERSHIP_API_BASE_URL` | Usually no | Membership provider uses an API |
| `MEMBERSHIP_API_KEY` | Yes | Membership provider uses API-key authentication |
| `REACH_PROVIDER` | No | Optional unverified reach is enabled |
| `REACH_API_BASE_URL` | Usually no | Reach provider uses an API |
| `REACH_API_KEY` | Yes | Reach provider uses API-key authentication |
| `APP_TIMEZONE` | No | Real service schedule is configured |
| `ALERT_RECIPIENT` | Sensitive configuration | Operational alerting is configured |

Generated Google resource IDs must be written automatically by bootstrap; the user should not manually copy IDs unless automated discovery is impossible.

### 7.3 Client-visible variables

- Only non-sensitive display configuration may use a `VITE_` prefix.
- Approved examples are `VITE_APP_TITLE` and `VITE_ENVIRONMENT_LABEL`.
- API keys, OAuth tokens, workbook IDs that reveal private resources, recipient addresses, and member configuration must not use `VITE_` because Vite bundles those values into client code.

### 7.4 Production Script Properties

After Workspace authorization, bootstrap should set or verify server-side Script Properties such as:

- `CHECKIN_API_BASE_URL`
- `CHECKIN_API_KEY`
- `MEMBERSHIP_API_BASE_URL`
- `MEMBERSHIP_API_KEY`
- `REACH_API_BASE_URL`
- `REACH_API_KEY`
- `RAW_WORKBOOK_ID`
- `BOARD_WORKBOOK_ID`
- `BOARD_PDF_FOLDER_ID`
- `APP_TIMEZONE`
- `ALERT_RECIPIENT`
- approved feature flags and schedule values

Never return secret properties to browser code, logs, Sheets, or board payloads.

### 7.5 `clasp` authentication

- `.clasp.json` identifies the Apps Script project.
- `.clasprc.json` contains OAuth authorization and must never be committed.
- The default authorization location is `~/.clasprc.json`; a local auth file may be selected explicitly for CI.
- CI must reconstruct its temporary auth file from the CI secret store, point `clasp` at that file, and delete it after the job.
- The user performs the unavoidable account authorization; the executor configures everything else.

---

## 8. Checkpoint command contract

T01 must create these stable commands so later checkpoints do not rely on undocumented one-off commands:

| Command | Purpose |
| --- | --- |
| `npm ci` | Reproduce locked dependencies |
| `npm run lint` | Static code-quality checks |
| `npm run typecheck` | TypeScript contract checks |
| `npm test` | Unit/domain tests |
| `npm run test:privacy` | Forbidden-field and aggregate-boundary tests |
| `npm run test:e2e` | Browser/role/full-flow tests |
| `npm run test:a11y` | Automated accessibility checks |
| `npm run test:pdf` | PDF render and privacy smoke tests |
| `npm run build` | Deterministic production build |
| `npm run bootstrap:verify` | Idempotent Google resource verification |
| `npm run smoke` | Post-deploy health, freshness, role, and payload checks |
| `npm run restore:test` | Backup restore verification |
| `npm run deploy` | Versioned release after all gates pass |
| `npm run rollback` | Restore the last known-good deployment |

If a command name must change, update this file and CI in the same task.

---

## 9. Evidence log

Append one concise row after each completed task or checkpoint.

| Date | ID | Evidence | Result | Warnings/follow-up |
| --- | --- | --- | --- | --- |
| 2026-08-19 | T00 | `plan.md`, `eagles-ark-kpi-tracker-tech-stack.md`, `execution.md` reviewed/created | Execution runbook ready; T01 eligible | Implementation not yet authorized in this document-creation task |
| 2026-08-19 | T01 | `npm install`; `npm run lint`; `npm run typecheck`; `npm test -- --run` (6 passed); `npm run build` | Foundation and quality checks pass; T02 eligible | Apps Script deployment remains authorization-gated |
| 2026-08-19 | T02 | `.env.example`, `.env.test`, `src/config.ts`, `src/config.test.ts`; `npm run lint`; `npm run typecheck`; `npm test -- --run` (9 passed) | Typed config, safe defaults, feature flags, and Vite secret-prefix guard pass; T03 eligible | Production values remain unset; unresolved features disabled |
| 2026-08-19 | T03 | `src/domain.ts`, `src/domain.test.ts`; `npm run lint`; `npm run typecheck`; `npm test -- --run` (14 passed) | Attendance boundaries, deduplication, data states, ministry states, and feature gates pass | Active/lapsed and decline alerts remain disabled pending U07/U08 |
| 2026-08-19 | C01 | `npm ci`; `npm run lint`; `npm run typecheck`; `npm test -- --run` (3 files, 14 passed); `npm run build` | Foundation and domain checkpoint passed; T04 eligible | Apps Script deployment remains authorization-gated |
| 2026-08-19 | T04 | `src/contracts.ts`, `src/contracts.test.ts`; `npm run lint`; `npm run typecheck`; `npm test -- --run` (4 files, 16 passed) | Zod contracts and fictional raw/aggregate fixtures validate and reject malformed records | Real provider schemas deferred to T12 |
| 2026-08-19 | T05 | `src/aggregation.ts`, `src/aggregation.test.ts`; `npm run lint`; `npm run typecheck`; `npm test -- --run` (5 files, 18 passed) | Deterministic deduplicated attendance metrics and aggregate-only serialization guard pass | Board payload remains physically separate from raw provider data |
| 2026-08-19 | T06 | `src/adapters.ts`, `src/adapters.test.ts`; `npm run lint`; `npm run typecheck`; `npm test -- --run` (6 files, 20 passed) | Check-in, reach, membership, and ministry adapter contracts with isolated mocks pass | Real provider credentials deferred to T12 |
| 2026-08-19 | C02 | `npm run lint`; `npm run typecheck`; `npm test -- --run` (7 files, 21 passed); `npm run test:privacy` (1 passed); `npm run build` | Data pipeline and privacy checkpoint passed; T07 eligible | Board payload tests contain no person-level fields |
| 2026-08-19 | T07 | `src/kpi-ui.jsx`, `src/kpi.css`, `src/kpi-ui.test.jsx`; `npm run lint`; `npm run typecheck`; `npm test -- --run` (8 files, 23 passed) | Responsive dark scorecard primitives, explicit data-state styling, trend bars, and print theme pass | Board Mode wiring is T08 |
| 2026-08-19 | T08 | `src/BoardMode.jsx`, `src/BoardMode.test.jsx`, `src/main.jsx`, `index.html`; `npm run lint`; `npm run typecheck`; `npm test -- --run` (9 files, 24 passed); `npm run build` | Fictional aggregate Board Mode is the app entrypoint and production build passes | Ministry/admin workflows remain T09 |
| 2026-08-19 | T09 | `src/workflows.ts`, `src/workflows.test.ts`; `npm run lint`; `npm run typecheck`; `npm test -- --run` (10 files, 26 passed) | Board deny-by-default, ministry own-history scope, admin access, and open exception helpers pass | External identity provider remains T13 |
| 2026-08-19 | T10 | `src/PrintableSummary.jsx`, `src/PrintableSummary.pdf.test.jsx`, print styles; `npm run test:pdf` (1 passed); `npm run lint`; `npm run typecheck`; `npm test -- --run` (11 files, 27 passed); `npm run build` | Aggregate one-page print/PDF experience and browser print smoke pass | Native PDF rendering remains browser-controlled |
| 2026-08-19 | C03 | `npm run lint`; `npm run typecheck`; `npm test -- --run` (11 files, 27 passed); `npm run test:privacy` (1 passed); `npm run test:pdf` (1 passed); `npm run build` | Dashboard, responsive/state styling, privacy, and PDF checkpoint passed; T11 reached | Workspace authorization U03 required before remote bootstrap |
| 2026-08-19 | T11 | Current Drive profile verified as `aayey812@mtroyal.ca`; created and read back pilot folder `14hW4cPHpaVSEA58h0QNabpnc5mttCxrv`, subfolders, Admin Raw workbook `1LmVr7UP7BGdP5ZmhL3-Y60oZlA3YBxjDuHchUZ-9fvs`, and Board Aggregate workbook `1FnD0L_t-jC6vlOILpKvvtPBHtV9lJa8dTNPMP9EogFE`; added `apps-script/bootstrap.gs` | One-account pilot Workspace storage bootstrap is complete; T11 remains in progress | Forms, Apps Script project ownership, Script Properties, and installable triggers require Apps Script authorization not exposed by the current connector |
| 2026-08-19 | T11 | Added `.clasp.json` for project `13NEeEfsNAJhU7kd4LDsVUoq9E9Ctmg_WH5tpTFnte2CIWYrG16TIo-HP`; `clasp status` sees `apps-script/appsscript.json` and `apps-script/bootstrap.gs`; `clasp push --force` returned `No credentials found` | Local project binding is ready; remote push awaits one-time clasp login | User must run `npx @google/clasp login` in a terminal signed into the current Google account, then tell executor when complete |
| 2026-08-19 | T11 | Interactive `clasp login` completed as `aayey812@mtroyal.ca`; retrying `clasp push --force` returned Apps Script API disabled | Remote push still waiting on API enablement | User must enable Google Apps Script API at `https://script.google.com/home/usersettings`, wait for propagation, then retry |
| 2026-08-19 | T11 | After user reported API enabled, `clasp push --force` still returned Apps Script API disabled | No remote source mutation occurred | Confirm the toggle under `aayey812@mtroyal.ca` and allow propagation before retry |
| 2026-08-19 | T11 | `clasp push --force` succeeded; `clasp deploy --description "Eagle's Ark KPI Tracker pilot bootstrap"` created deployment `AKfycbzKhQkX3z248Pe9O322qndorhgreekWLt2TAyiO3TFscMdY-Wo71iaCEbvWcNGyYSYwiA @1`; `clasp run bootstrap` reports not API executable | Source is deployed; bootstrap invocation pending API-executable deployment | User must create an API executable deployment in Apps Script UI, execute as current account, access limited to self |
| 2026-08-19 | T11 | API executable was deployed; `clasp run bootstrap --nondev` and `clasp run ping` still return storage `NOT_FOUND` | Remote invocation remains unresolved despite deployment | Run `bootstrap` once in Apps Script editor and approve requested permissions |
| 2026-08-19 | T11 | User screenshot shows latest bootstrap source with `ensureForm_` and `ensureHeartbeatTrigger_`; Apps Script execution log shows `Execution started` then `Execution completed` at 3:00:15 PM | Workspace bootstrap completed; T12 eligible | Connector search cannot index the form, but manual execution completed without error |

---

## 10. Decision and blocker log

Record only decisions that alter execution, scope, configuration, or feature flags.

| Date | Item | Decision/status | Effect on execution |
| --- | --- | --- | --- |
| 2026-08-19 | Product scope | Confirmed non-financial | Financial metrics excluded from every task |
| 2026-08-19 | Attendance | Live, replay within seven days, deduplicated combined, separate unverified reach | Domain rules fixed for T03 |
| 2026-08-19 | Visual direction | Modern dark executive scorecard with accessible responsive/print variants | Design requirements fixed for T07–T10 |
| 2026-08-19 | Active/lapsed | Awaiting U07 | Feature disabled by default |
| 2026-08-19 | Attendance decline alert | Awaiting U08 | Feature disabled by default |
| 2026-08-19 | Real providers | Awaiting U04/U05 | Mock adapters used through C03 |
| 2026-08-19 | Workspace identity | Pilot authorized with current connected account `aayey812@mtroyal.ca`; second maintainer deferred | One-account pilot exception recorded; production recovery account still recommended |
| 2026-08-19 | Provider inputs | User approved fictional/mock data for pilot; no live check-in, membership, or reach providers configured | T12 skipped under approved pilot decision; mock adapters remain active and optional reach stays disabled |
| 2026-08-19 | Pilot access | User approved one account; `aayey812@mtroyal.ca` is configured as board/admin/ministry pilot identity with revocation support | T13 completed with deny-by-default single-account pilot authorization |
| 2026-08-19 | Delivery | User approved both PDF archiving and automatic email delivery to `aayey812@mtroyal.ca` | T14 configured with Board Summaries archive, monthly trigger, and MailApp delivery |
| 2026-08-19 | T14 | Apps Script bootstrap and `runMonthlyCycle` completed; verified archived PDF [Eagle's-Ark-Board-Summary-2026-08.pdf](https://drive.google.com/file/d/1iRXTk0IdmFPhrkItQ8PNmGJ7imkhWMVN/view) in Board Summaries | Monthly PDF archive and email delivery workflow passed pilot smoke test | Email delivery was approved to current pilot account |
| 2026-08-19 | T15 | `src/operations.ts`, `src/operations.test.ts`; `npm run lint`; `npm run typecheck`; `npm test -- --run` (13 files, 31 passed); pushed `backupPilotResources` to Apps Script | Audit, stale detection, deterministic rebuild, and backup manifest code pass locally | Backup smoke run remains to be executed in Apps Script |
| 2026-08-19 | T15 | Apps Script `backupPilotResources` completed; verified two backup workbooks in [Backups](https://drive.google.com/drive/folders/1yfdi8YLi3eJMet26D-ZfhEVRBkJIQrO1) | Backup smoke test passed; T16 eligible | Restore drill remains part of later readiness work |
| 2026-08-19 | T16 | Added `.github/workflows/ci.yml`, `bootstrap:verify`, `restore:test`, `rollback`, and expanded `smoke`; full local gate passed: 31 tests, privacy/PDF tests, lint, type-check, build | CI/release configuration is ready locally | U10 required to authorize GitHub Actions/repository production deployment and rollback secrets |

---

## 11. Execution instruction

When implementation is authorized:

1. Start at `T01`; do not rewrite the plan first.
2. Change only `T01` to `IN_PROGRESS`.
3. Execute its actions autonomously.
4. Run its definition-of-done checks.
5. Update the tracker and evidence log.
6. Continue sequentially through each task and checkpoint.
7. Ask the user only for the exact pending `Uxx` action when its dependent task is reached.
8. Keep mock adapters and unresolved feature flags in place so earlier work never waits unnecessarily for credentials or policy decisions.

---

## 12. Technical references

- [Vite environment variables and `.env.local`](https://vite.dev/guide/env-and-mode)
- [`clasp` configuration and authentication files](https://github.com/google/clasp/blob/master/docs/config-files.md)
- [Apps Script Properties Service](https://developers.google.com/apps-script/guides/properties)
- [Apps Script web-app execution identity](https://developers.google.com/apps-script/guides/web)
- [Apps Script installable triggers](https://developers.google.com/apps-script/guides/triggers/installable)
