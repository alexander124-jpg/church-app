# Eagle's Ark Online Church Health KPI Tracker

## Product and delivery plan

**Status:** v1 plan for decision approval, implementation, and pilot  
**Working product name:** Eagle's Ark Online Church Health KPI Tracker  
**Product type:** Non-financial board accountability system  
**Primary audience:** Governing board  
**Operational owners:** Dev Lead, admin/pastoral staff, and ministry leads  
**Last updated:** 2026-08-19  
**Technical companion:** `eagles-ark-kpi-tracker-tech-stack.md`
**Design reference:** Executive scorecard screenshot supplied 2026-08-19

---

## 1. Executive summary

Eagle's Ark needs one trustworthy place where its governing board can understand church health beyond finances. The tracker will combine verified online attendance, membership movement, ministry outcomes, reporting completeness, and trend alerts into an aggregate dashboard and a one-page monthly board summary.

The system is definitively **non-financial**. Giving, budgets, expenses, and other financial measures remain in the existing finance system and are excluded from v1.

Because the church operates online, attendance is based on verified digital check-ins:

- **Live attendance** is the headline KPI: a unique person checks in during the scheduled service window.
- **Replay attendance** is a secondary KPI: a unique person checks in after the live service and within seven days.
- **Combined weekly online participants** is the deduplicated union of live and replay participants; a person appearing in both counts once.
- **Unverified reach** consists of anonymous stream views and page visits. It is displayed separately and never added to attendance.

The production target is **zero recurring technical work during normal operation**. Period rollover, ingestion, validation, deduplication, aggregation, reminders, alerts, snapshot locking, PDF creation, delivery, archiving, backups, monitoring, testing, and deployment must be automated. Human judgment remains required for policy decisions, ministry submissions, access changes, data exceptions, and incident response.

---

## 2. Problem statement

The governing board currently lacks a consistent view of non-financial church health. Attendance, membership movement, and ministry outcomes are fragmented across online platforms, spreadsheets, forms, and people's memory. This creates five problems:

1. Decline may be noticed late.
2. Board discussions rely on anecdotes instead of shared definitions.
3. Ministries are difficult to evaluate fairly because their missions and targets differ.
4. Missing reports can be confused with poor performance.
5. Preparing a board-ready summary requires unnecessary manual work.

The tracker should replace that fragmented reporting process with a reliable, privacy-conscious, and explainable monthly view.

---

## 3. Product outcome

The board should be able to answer these questions in under 30 seconds:

1. Is verified live attendance rising, stable, or falling?
2. How much additional participation happens through replay?
3. Is membership growing, and what are the approved active/lapsed aggregates?
4. Which ministries are meeting their own approved goals?
5. Which results need attention, and which conclusions are unreliable because data is missing or stale?

### Primary goals

- Establish one source of truth for non-financial board KPIs.
- Make live online attendance the clear headline measure.
- Show replay participation without inflating the live-attendance number.
- Keep anonymous reach separate from verified attendance.
- Compare each ministry with its own approved goal.
- Distinguish missing reporting from poor performance.
- Keep all board-facing outputs aggregate-only.
- Remove recurring technical preparation before board meetings.

### Non-goals for v1

- Financial or giving analytics
- Accounting or budget management
- A public or congregation-facing dashboard
- A mobile application
- A full church-management system
- Streaming, video hosting, or check-in hardware
- Public ministry rankings
- Automated pastoral decisions
- Long-range historical migration beyond reliable available data
- Volunteer retention, event NPS, or giving-per-member correlation

---

## 4. Confirmed product decisions

| Decision | Approved v1 position |
| --- | --- |
| Scope | Non-financial church health and accountability only |
| Delivery model | Online church participation |
| Headline attendance KPI | Unique live check-ins per scheduled service |
| Live attendee | Unique person checking in during the scheduled service window |
| Replay attendee | Unique person checking in after the service and within seven days |
| Combined weekly participation | Unique people across live and replay during the reporting week; deduplicated across both |
| Duplicate rule | Repeated check-ins by the same person for the same service count once |
| Unverified reach | Anonymous stream views/page visits; displayed separately and never counted as attendance |
| Board privacy | Aggregate-only dashboard, payloads, exports, logs, and PDFs |
| Missing data | Explicitly display “No data submitted”; never convert missing to zero |
| Ministry evaluation | Against each ministry's own leadership-approved target |
| At-risk ministry | Misses its approved target in two consecutive submitted reporting months |
| Reporting gap | Missing submission; separate from ministry performance |
| Normal operation | Zero recurring technical implementation when inputs and integrations are valid |
| Visual direction | Modern executive scorecard: dark navy/slate canvas, white typography, teal/coral/indigo accents, modular bordered panels, and one-screen board summary |

---

## 5. Users, responsibilities, and access

| Role | Responsibilities | Access | Prohibited access |
| --- | --- | --- | --- |
| Board | Review aggregate health, trends, exceptions, and reporting gaps | Aggregate dashboard, locked board summaries, aggregate workbook | Member identities, personal attendance history, contact details, lapsed-member lists |
| Admin/pastoral staff | Maintain authorized member information, review exceptions, correct source data, approve board-safe notes | Protected raw/admin data, correction workflow, aggregate outputs | Deployment credentials unless separately authorized |
| Dev Lead | Maintain system, integrations, configuration, deployments, monitoring, and recovery | Code, configuration, raw and aggregate workbooks as authorized | Pastoral information outside approved operational need |
| Ministry lead | Set goals with leadership and submit monthly outcomes | Submission form and own ministry's approved history | Other ministry reports and all member-level data |
| Managed deployment identity | Own production deployment, triggers, and automated messages | Only services and files required for operation | Interactive pastoral or board use |

Access must use managed identities and approved groups wherever possible. Editable prefilled form values and shared codes are not authentication. Any external passwordless submission must use an expiring, scoped, server-validated link.

---

## 6. KPI definitions and calculation rules

### 6.1 Service occurrence

Every online service must have:

- a stable `service_occurrence_id`;
- a service name;
- a configured timezone;
- a scheduled start timestamp;
- a scheduled end timestamp; and
- a replay window ending exactly seven days after the scheduled service ends.

The configured service window—not an implementer's local clock—determines live versus replay classification.

### 6.2 Attendance and reach

Let `P_live(s)` be the set of unique valid person keys checking in during service occurrence `s`. Let `P_replay(s)` be the set checking in after the service ends and no later than the replay-window end.

| Metric | Rule | Dashboard treatment |
| --- | --- | --- |
| Live attendance | `|P_live(s)|` | Headline attendance KPI |
| Replay attendance | `|P_replay(s)|` | Secondary participation KPI |
| Combined participants for a service | `|P_live(s) ∪ P_replay(s)|` | Never calculate by simply adding live and replay |
| Combined weekly online participants | Unique person keys across live and replay for all included services in the reporting week | Weekly reach of verified participants |
| Unverified reach | Platform-reported anonymous views or page visits | Separate card/section; never stacked into attendance |

Additional rules:

- A person checking in multiple times for the same service counts once.
- A person appearing in live and replay counts in both category views but once in the combined total.
- A check-in after the seven-day replay window is not attendance for that service.
- If a stable person key is unavailable, the record cannot be used in a deduplicated verified-attendance KPI.
- Anonymous stream or page analytics must never be used to infer a verified person.
- Attendance charts must identify whether they show live, replay, combined participants, or unverified reach.

### 6.3 Attendance trends and alerts

- Show a four-week live-attendance trend when four comparable reporting periods are available.
- Show year-over-year live attendance only when a comparable prior-year service exists.
- The proposed 15% decline alert applies to the live-attendance headline KPI only.
- Do not activate the 15% alert until leadership approves its exact comparison basis.
- Suppress a decline alert and display `partial` when missing data could materially change the result.
- Every alert must include a plain-language explanation and its comparison period.

### 6.4 Membership

| Metric | Rule |
| --- | --- |
| New members | Approved member records with a join date in the reporting month |
| Active members | Feature-gated until leadership approves the activity window and exemptions |
| Lapsed members | Feature-gated until leadership approves the inactivity window, pastoral exceptions, and effective-date rules |

The board may see aggregate counts only. Individual identities, last-attended dates, and follow-up lists remain restricted to authorized admin/pastoral users.

### 6.5 Ministry outcomes

Each ministry goal must have a defined period, description, type, direction, unit, target, approver, and approval date.

| State | Rule |
| --- | --- |
| On track | Submitted result meets the ministry's approved target |
| Missed target | Submitted result does not meet the target for one reporting month |
| At risk | Submitted result misses the target for two consecutive reporting months |
| Reporting gap | Required submission is missing |
| Stalled | Not implemented until leadership approves a definition distinct from at risk and reporting gap |

A reporting gap must never automatically become a failed target. Text notes intended for the board require the approved redaction/review rule before publication.

### 6.6 Data states

Every displayed metric must use one of these states:

- `actual`
- `missing`
- `partial`
- `estimated`

The pilot should not estimate missing values. If estimation is approved later, estimated chart segments must be visually distinct and clearly labelled.

---

## 7. v1 functional requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-01 | Ingest online check-ins through an authorized API or scheduled export | Must |
| FR-02 | Classify valid check-ins as live or replay from configured service timestamps | Must |
| FR-03 | Deduplicate by stable person key and service occurrence | Must |
| FR-04 | Calculate live, replay, combined service, and combined weekly participation | Must |
| FR-05 | Keep unverified platform reach separate from verified attendance | Must |
| FR-06 | Collect monthly ministry results through one persistent verified form or submission page | Must |
| FR-07 | Calculate ministry health and reporting-gap states independently | Must |
| FR-08 | Calculate approved membership aggregates without exposing identities to the board | Must |
| FR-09 | Show aggregate dashboard cards, trends, filters, explanations, and freshness | Must |
| FR-10 | Generate, archive, and deliver a one-page aggregate board PDF | Must |
| FR-11 | Send reminders and escalation messages only when required | Must |
| FR-12 | Quarantine invalid or ambiguous records instead of guessing | Must |
| FR-13 | Allow authorized corrections with an audit trail and deterministic rebuild | Must |
| FR-14 | Preserve locked historical snapshots when definitions change | Must |
| FR-15 | Let ministry leads see only their own approved submission history | Should |
| FR-16 | Show unverified reach by platform | Should; omit if no reliable source integration exists |
| FR-17 | Provide a desktop “Board Mode” that presents the essential scorecard in the first viewport | Must |
| FR-18 | Provide responsive tablet/mobile detail views and a dedicated one-page print/PDF layout | Must |
| FR-19 | Apply consistent design tokens, accessible contrast, keyboard behavior, and explicit data-state styling | Must |
| FR-20 | Support reporting-period/service filters and progressive drill-down without overwhelming the board home | Should |

---

## 8. Dashboard and board-summary requirements

### Board home

- Current locked reporting period and last successful refresh
- Unique live attendance and four-week trend
- Replay attendance
- Deduplicated combined weekly online participants
- Unverified reach in a visibly separate non-attendance section
- New-member count and approved active/lapsed aggregates
- Ministries on track, at risk, and missing reports
- Active alerts with explanations
- Data-completeness and freshness indicators

### Detail views

- Live, replay, and combined participation by service and date range
- Unverified reach by platform, never mixed into attendance charts
- Membership aggregate trend
- Ministry result versus approved target
- Reporting completeness by ministry and month

### Presentation rules

- Do not rely on colour alone; use text and icons with colour.
- Do not connect chart lines across missing values.
- Show the comparison period and denominator for every rate or percentage.
- Label preliminary/open periods clearly.
- Default to the latest locked period.
- Keep sensitive content out of browser storage, URLs, tooltips, logs, and analytics.
- Ensure the board summary fits one page and contains aggregate information only.

### Visual direction from the reference

The dashboard should evoke the supplied executive scorecard without reproducing its brand or dated chart treatments. Retain these qualities:

- a confident dark navy/slate presentation;
- a prominent Eagle's Ark wordmark or logo at the upper left;
- a large centered title and reporting period;
- a compact upper-right status summary with freshness and exception indicators;
- strong white typography and large tabular numerals;
- teal, coral, and indigo data accents;
- a disciplined grid of bordered dashboard modules; and
- enough information to understand the current position without scrolling on a standard board-room display.

Modernize the reference in these ways:

- use flat two-dimensional charts; no bevelled or faux-3D bars;
- increase label size and reduce legend density;
- show fewer series per chart;
- replace decorative charts with decision-relevant summaries;
- use whitespace, alignment, and hierarchy instead of heavy effects;
- use text and icons in addition to status colour; and
- omit a geographic map in v1 unless reliable aggregate location data later supports a real board decision.

### Recommended board-mode layout

Use a 12-column responsive grid. At desktop widths of 1280 px and above, the essential board scorecard should fit within the first viewport.

| Area | Grid | Content | Design treatment |
| --- | --- | --- | --- |
| Header | 12 columns | Eagle's Ark identity, “Online Church Health Scorecard,” locked reporting period, last refresh, data state | Large white title, compact metadata, no decorative navigation |
| KPI strip | Five equal cards | Live attendance, replay attendance, combined weekly participants, new members, data completeness | Large value, short label, trend/context line, state icon |
| Attendance panel | 7 columns | Live and replay trend with four-week comparison | Primary chart; live teal, replay coral, comparison line muted |
| Ministry-health panel | 5 columns | On track, at risk, and reporting gap composition | Three-state donut or 100% stacked bar with direct labels |
| Membership panel | 4 columns | New-member and approved active/lapsed aggregate trend | Simple line or grouped bars; feature-gate undefined states |
| Reporting panel | 4 columns | Submission completeness by ministry | Ranked horizontal bars; missing shown explicitly |
| Attention panel | 4 columns | Alerts, stale data, exceptions, and concise recommended follow-up | Text-first list with severity icon and explanation |
| Reach panel | Secondary/detail | Unverified stream/page reach | Muted styling and clear “not attendance” label |

The attendance trend is visually dominant because live attendance is the headline KPI. Unverified reach must never receive stronger visual emphasis than verified attendance.

### Recommended design tokens

These are v1 defaults and may be adjusted to match an approved Eagle's Ark brand guide while preserving contrast and semantic meaning.

| Token | Default | Use |
| --- | --- | --- |
| Canvas | `#1B2735` | Main dark background |
| Surface | `#26384B` | Cards and chart panels |
| Border | `#526579` | Panel separation and dividers |
| Primary text | `#F7FAFC` | Titles, values, body text |
| Muted text | `#C3CEDA` | Metadata and secondary labels |
| Live/primary | `#19B5C5` | Verified live attendance and primary actions |
| Replay/secondary | `#FF7A59` | Replay attendance |
| Combined/accent | `#7C8CF8` | Combined verified participation |
| Success | `#35C99A` | On track; always paired with text/icon |
| Warning | `#F2B84B` | Partial, attention, or approaching threshold |
| Critical | `#F05D6C` | At risk, failure, or privacy block |
| Unverified | `#91A0B3` | Anonymous reach and deliberately de-emphasized data |

All text/background combinations and meaningful chart marks must meet WCAG AA contrast. Do not reuse a semantic status colour for an unrelated data series in the same view.

### Typography, spacing, and components

- Use **Inter** or **Source Sans 3**, with system sans-serif fallbacks.
- Use tabular numerals for KPI values and percentages.
- KPI values should be 40–56 px on desktop; card labels at least 14 px; chart-axis labels at least 12 px.
- Use an 8 px spacing system, approximately 16 px grid gaps, and 20–24 px card padding.
- Use 8–12 px corner radii, 1 px borders, and little or no drop shadow.
- Each KPI card should contain label, value, comparison, period, data state, and optional trend—never a value without context.
- Status chips must contain an icon and words such as “On track,” “At risk,” “Missing,” “Partial,” or “Stale.”

### Chart choices

| Need | Preferred chart | Avoid |
| --- | --- | --- |
| Live versus replay over time | Grouped bars or two-line trend with direct labels | Stacked areas that imply the measures can always be added |
| Four-week comparison | Muted reference line/band with plain-language delta | Decorative arrows without comparison context |
| Ministry health composition | Direct-labelled donut or 100% stacked bar with no more than three states | Pie charts with many slices |
| Submission completeness | Horizontal bars or compact table | Scatterplots |
| Membership movement | Line or grouped bars | Gauge charts |
| Alerts and exceptions | Text-first ordered list | A chart when exact wording is more useful |
| Geographic reach | Deferred from v1 | Decorative world map or person-level location plotting |

### Interaction, responsiveness, and print

- Board Mode defaults to the latest locked period and minimizes controls during meetings.
- Filters are limited to reporting period and service; additional analysis belongs in detail views.
- Hover/focus tooltips explain values, comparison basis, data state, and last refresh without sensitive data.
- Every interactive element is keyboard reachable and has a visible focus state.
- Tablet layouts use two columns; narrow mobile layouts use one column with KPI cards first.
- The dashboard never relies on horizontal scrolling.
- Use loading, empty, missing, partial, stale, error, and permission-denied states designed as intentionally as populated charts.
- Use a dedicated light-background print/PDF theme with the same hierarchy and accent colors; this improves legibility and avoids printing a full dark canvas.
- PDF export is landscape, aggregate-only, and restricted to one page; lower-priority detail panels are omitted rather than shrunk to unreadable sizes.

### Additional design choices recommended for v1

1. **Design for a board-room screen first.** Optimize the primary view for a 16:9 display and a two-to-three metre viewing distance.
2. **Use progressive disclosure.** The board home answers the five core questions; click/focus opens supporting detail instead of adding more charts to the scorecard.
3. **Freeze locked snapshots.** A board meeting should not visibly change because a background refresh occurred; new information appears in the next approved snapshot or an explicitly versioned correction.
4. **Make uncertainty visible.** Missing, partial, stale, and estimated data use patterned marks, labels, and explanations—not just faded colour.
5. **Keep alerts actionable.** Every alert states what changed, compared with what, why it matters, and who owns follow-up.
6. **Limit animation.** Use subtle transitions under 200 ms and respect reduced-motion preferences; never animate KPI values during a meeting.
7. **Provide presentation and admin modes.** Board Mode is calm and read-only; Admin Mode exposes validation, corrections, freshness, and operational status without changing the board layout.
8. **Use real content in design testing.** Test long ministry names, large values, zero, missing, partial, stale, and multi-alert states before approving the visual system.

---

## 9. Operating workflows

### 9.1 Attendance workflow

1. System creates or verifies the scheduled service occurrence.
2. Authorized source integration retrieves check-in events.
3. System validates event ID, person key, service occurrence, and timestamp.
4. System rejects duplicates and quarantines invalid events.
5. System classifies valid events as live or replay.
6. System refreshes aggregate attendance and freshness metadata.
7. System updates the dashboard without exposing person-level records.

### 9.2 Monthly ministry workflow

1. **Day 1 — automated:** Open the reporting period and distribute scoped submission links.
2. **Day 5 — automated:** Remind only ministries lacking a valid submission.
3. **Day 6 — automated with exception review:** Validate identity, target, values, duplicates, and board-safe notes. Admin acts only on quarantined exceptions.
4. **Day 7 — automated:** If privacy and validation checks pass, lock the aggregate snapshot, create the PDF, archive it, and deliver it to the approved destination.
5. **After the meeting — policy action only:** Record approved definition changes with future effective dates.

### 9.3 Correction workflow

1. Authorized admin selects the source record and provides a correction reason.
2. System records actor, timestamp, changed fields, and affected periods.
3. System recomputes affected aggregates from source records.
4. A corrected locked period creates a new version; it never silently overwrites history.
5. The approved correction policy determines whether a corrected PDF replaces or supplements the earlier board packet.

---

## 10. Automation contract

The system is not complete if anyone must repeatedly edit code, reset forms, copy rows, rebuild charts, run calculations, send reminders, assemble PDFs, or redeploy the app.

### Required automated behavior

- Idempotent creation/verification of workbooks, forms, schemas, protections, configuration, folders, and triggers
- Service/reporting-period rollover
- Check-in and platform-data ingestion
- Validation, deduplication, classification, and aggregation
- Missing-data and stale-data detection
- Reminder and escalation delivery with duplicate-send prevention
- Snapshot locking, PDF creation, archiving, and approved delivery
- Audit logging and aggregate rebuild after corrections
- Nightly backup and daily health checks
- Error notification and safe retries
- Automated business-rule, privacy-contract, role, and PDF smoke tests
- Versioned build, deployment, post-deploy smoke test, and rollback

### Acceptable human involvement

- Approving KPI definitions and policy changes
- Creating and authorizing managed identities and access groups
- Submitting ministry outcomes
- Resolving quarantined records and pastoral exceptions
- Changing user access when roles change
- Approving pilot readiness and responding to incidents
- Supplying a validated import only if the existing source has no supported integration

### Failure behavior

- Fail closed when privacy or validation checks fail.
- Preserve the last successful snapshot.
- Display a stale-data banner when refresh is overdue.
- Retry transient failures without duplicating records, messages, or files.
- Notify the accountable owner after the final retry.
- Never turn an integration failure into a zero attendance value.

---

## 11. Privacy, security, and governance

### Non-negotiable privacy boundary

Use two separate data stores:

1. **Protected raw/admin store:** check-in person keys, member records, contacts, submissions, corrections, and processing history.
2. **Aggregate board store:** counts, rates, trends, alerts, explanations, freshness, and approved board notes only.

The board dashboard must read only from the aggregate store. Do not publish either store to the public web.

### Required safeguards

- Least-privilege managed accounts and groups
- Organization-owned production deployment identity
- Second authorized recovery maintainer
- Server-side authorization on every endpoint
- Expiring scoped links only when external passwordless submission is approved
- No secrets in Sheets, client bundles, or source control
- Automated forbidden-field tests for board payloads and PDFs
- Effective-dated access roster and immediate revocation behavior
- Audit trail for corrections and policy changes
- Approved retention, deletion, backup, and recovery policy before rollout

---

## 12. Technical direction

The v1 implementation should follow the companion technical-stack document. The recommended pilot stack is:

- React and TypeScript dashboard
- Vite deterministic single-file build for Apps Script HTML Service
- Recharts
- Persistent Google Form or signed-link Apps Script submission page
- Two separate Google Sheets workbooks for raw/admin and aggregate/board data
- Google Apps Script for ingestion, validation, aggregation, reminders, PDF generation, and the web application
- Git, locked dependencies, CI, `clasp`, and versioned deployments
- Vitest and Playwright
- Scheduled backups, heartbeat monitoring, and error notification

Do not migrate to a database merely because it is conventional. Reassess after the pilot if permissions, volume, reliability, audit requirements, integrations, or concurrency exceed what the Workspace-first design can safely support.

---

## 13. Non-functional requirements

| Area | Requirement |
| --- | --- |
| Privacy | Zero person-level fields in board stores, responses, PDFs, logs, or analytics |
| Reliability | Every failed scheduled job raises an alert; no silent failures |
| Idempotency | Retrying a job cannot duplicate source records, reminders, snapshots, or PDFs |
| Freshness | Dashboard shows last successful refresh and stale state |
| Explainability | Every flag includes its rule and comparison context |
| Accessibility | Keyboard usable, readable contrast, and no colour-only status meaning |
| Visual consistency | Approved tokens, typography, spacing, components, and chart semantics are reused across dashboard and PDF |
| Responsive behavior | No horizontal scrolling; board, tablet, mobile, and print layouts preserve information hierarchy |
| Board-room legibility | Primary KPIs and statuses remain readable on a 16:9 display from typical meeting distance |
| Performance | Board home becomes usable quickly enough to answer core questions within 30 seconds |
| Auditability | Definitions, targets, corrections, access, and snapshots have effective dates/history |
| Recoverability | Backup and restore are tested before full rollout |
| Maintainability | Production changes originate from source control and automated deployment |

---

## 14. Delivery plan and release gates

Timelines are indicative. Advancement depends on gates, not calendar pressure.

### Phase 0 — decisions and access

Deliverables:

- Resolve blocking definitions and source-system details.
- Approve the privacy/retention boundary.
- Create the organization-managed deployment identity and access groups.
- Confirm repository, CI, backup, monitoring, and recovery owners.

**Exit gate:** No implementation-blocking policy, identity, or source-access question remains.

### Phase 1 — prototype

Deliverables:

- Executive scorecard design system, desktop Board Mode, responsive layouts, and one-page print treatment
- Dashboard shell using fictional data
- Live/replay/combined/unverified-reach rule engine and unit tests
- Missing/partial/stale states
- Ministry goal and reporting-gap logic
- One-page board-summary layout

**Exit gate:** Leadership confirms the visual direction, information hierarchy, and wording. Board-room, keyboard, responsive, and print reviews pass with fictional data; no real member data is used.

### Phase 2 — production-ready pilot build

Deliverables:

- Idempotent environment bootstrap/verification
- Authorized attendance and reach integrations
- Protected raw and aggregate stores
- Role enforcement and automated privacy tests
- Monthly workflow automation
- Corrections, snapshot versioning, PDF delivery, monitoring, and backup
- Deployment pipeline and rollback

**Exit gate:** Automated full-cycle, privacy, role, failure, backup, restore, and post-deploy tests pass.

### Phase 3 — four-week controlled pilot

Scope:

- Verified attendance/reach
- Membership aggregates only after active/lapsed approval
- Two ministries
- Admin, Dev Lead, and limited board reviewers

Validation:

- Check-in classification accuracy
- Duplicate handling
- Form completion time
- Dashboard comprehension
- Missing-data behavior
- Alert usefulness
- Exception volume
- End-to-end automation

**Exit gate:** No unresolved high-severity privacy/reliability defect; board and operators approve rollout.

### Phase 4 — rollout and first-quarter review

- Onboard remaining ministries.
- Publish the first full locked board snapshot.
- Review thresholds, definitions, goal quality, and dashboard noise after the first quarter.
- Decide whether to keep the Workspace-first architecture or migrate based on observed evidence.

---

## 15. Definition of done and acceptance criteria

### Product acceptance

- A board member can answer the five core questions in under 30 seconds.
- A ministry lead can submit a report in under five minutes.
- Live, replay, combined, and unverified-reach values are unmistakably different.
- Missing input displays “No data submitted.”
- An at-risk ministry is correctly produced only after two consecutive submitted misses.
- A reporting gap never becomes a failed performance result.

### Design acceptance

- At 1440 × 900 or larger, the five core board questions can be answered from the first viewport.
- Live attendance is visually dominant; replay and combined participation are distinct; unverified reach is clearly secondary.
- No chart uses faux-3D styling, more than three status categories, or an unexplained legend.
- KPI cards show value, period, comparison, and data state.
- Every status combines colour with text and an icon.
- Automated accessibility checks and a keyboard-only review pass.
- The tablet layout uses no more than two columns, the mobile layout uses one column, and neither requires horizontal scrolling.
- The one-page landscape PDF remains readable and contains no person-level data.
- Missing, partial, stale, error, and permission-denied states have approved visual treatments.

### Attendance acceptance

- Check-ins at service-window boundaries classify correctly.
- Check-ins at the seven-day replay boundary classify correctly.
- Duplicate check-ins do not increase a service count.
- A live participant who later checks in for replay appears once in the combined total.
- Anonymous views never enter verified-attendance calculations.
- Missing integration data produces a missing/partial state, not zero.

### Privacy and access acceptance

- Board users cannot access the raw store.
- Ministry leads cannot view other ministries.
- Revoked users lose access on their next session.
- Board network responses and PDFs contain no names, email addresses, member IDs, person keys, or last-attended dates.
- Automated schema tests fail the build if a forbidden field is introduced.

### Automation acceptance

- One seeded full-cycle test opens a period, accepts valid input, rejects invalid identity, classifies attendance, sends exactly one reminder, locks one snapshot, creates one aggregate PDF, archives it, and completes a backup.
- No recurring technical step is required during a green monthly cycle.
- Failed jobs preserve the last successful output and alert the accountable owner.
- A restore test succeeds before rollout.

---

## 16. Success measures

| Outcome | Pilot measure |
| --- | --- |
| Board comprehension | Core status understood in under 30 seconds during observed test |
| Board-room legibility | Headline KPIs and statuses readable on the approved 16:9 meeting display |
| Submission usability | Pilot ministry report completed in under five minutes |
| Attendance integrity | All seeded live/replay/deduplication cases pass |
| Privacy | Zero person-level fields in board outputs |
| Automation | Zero recurring technical preparation in a successful monthly cycle |
| Transparency | 100% of missing/stale inputs visibly labelled |
| Alert quality | Every alert includes rule, value, comparison period, and data state |
| Reporting accountability | Missing submissions create reporting-gap status and correct reminders |
| Recovery | Backup and restore test completed successfully |

---

## 17. Ownership

| Area | Accountable owner | Supporting roles |
| --- | --- | --- |
| Product scope and board usefulness | Church leadership/board | Dev Lead |
| KPI definitions and thresholds | Board plus pastoral/admin leadership | Dev Lead |
| Attendance source quality | Check-in system owner/admin | Dev Lead |
| Membership data and pastoral exceptions | Authorized pastoral/admin leadership | Dev Lead for implementation only |
| Ministry goals and submissions | Ministry leads plus approving leadership | Admin |
| System, integrations, deployment, and monitoring | Dev Lead | Recovery maintainer |
| Access groups and managed identity | Workspace admin | Dev Lead |
| Privacy, retention, and correction policy | Leadership-designated privacy/data owner | Admin and Dev Lead |

No production deployment or trigger should depend on an individual's personal account.

---

## 18. Risk register

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Check-in source lacks stable person/service identifiers | Duplicate attendance cannot be removed reliably | Treat source compatibility as a pilot blocker; do not fake deduplication |
| Source lacks API or scheduled export | Recurring attendance import remains manual | Build a validated import only as an explicit temporary exception; pursue supported integration |
| Active/lapsed rule remains undefined | Misleading membership classification | Feature-gate these counts until approved |
| Anonymous reach is mistaken for attendance | Inflated participation claims | Separate storage, labels, charts, and automated contract tests |
| Ministry targets are set artificially low | Weak accountability | Require leadership approval and review goal quality after Quarter 1 |
| Missing report is treated as failed performance | Unfair ministry classification | Separate reporting and performance state machines |
| Member data leaks into board output | Privacy and trust failure | Separate aggregate store, deny-by-default schemas, automated forbidden-field tests |
| Deployment/trigger owner leaves | Automation stops | Organization-managed identity, second maintainer, recovery procedure |
| Quota or trigger failure is silent | Stale board decisions | Heartbeat, stale banner, last-good snapshot, alerting, and safe retry |
| Prototype is mistaken for production | Privacy and reliability gaps | Separate prototype and production-ready release gates |

---

## 19. Remaining decisions

### Blocking implementation or fully automated ingestion

1. What exact online check-in and membership systems are used?
2. Do they provide an authorized API or scheduled export, stable person/service identifiers, and change history?
3. What exact rule defines active and lapsed members, including pastoral exemptions?
4. What baseline and comparison period should trigger the proposed 15% live-attendance decline alert?
5. Which managed accounts/groups belong to board, admin, Dev Lead, and ministry leads?
6. Are any ministry leads outside the managed Workspace domain?
7. Which member fields may be digitized, retained, corrected, exported, and deleted?

### Required before pilot

1. What final product name should be used?
2. What is the official service/reporting timezone?
3. What are the exact service windows, monthly cutoff, late-submission window, meeting date, and holiday exceptions?
4. How will children, guests, or people without managed accounts receive a stable person key?
5. May ministry notes be published automatically, or do they require admin approval/redaction?
6. Will the web app execute as the accessing user or the managed deployer?
7. What repository, CI platform, production branch, deployment approval, backup location, retention period, and recovery owner are approved?
8. What Eagle's Ark logo/wordmark and brand guidance are approved? If none is supplied, may the v1 use a text-only wordmark and the proposed palette?

### Required before full rollout

1. Should the board see open preliminary periods or locked periods only?
2. What is the correction policy for an already distributed board summary?
3. Where should board PDFs be delivered, and is automatic delivery permitted after validation passes?
4. Is a separate “stalled” ministry state needed?

---

## 20. Change-control rule

This plan is the product source of truth. A confirmed decision should move from Section 19 into Section 4 or the applicable KPI section with an effective date. Changes to definitions must not silently rewrite historical snapshots. The technical companion may explain implementation, but it must not override product rules in this plan.
