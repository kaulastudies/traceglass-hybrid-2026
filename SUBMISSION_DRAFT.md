# TraceGlass — BuildHybridAI draft

Status: preparation only. Not submitted. Replace pending evidence with observed results before publishing this description as a completed project.

## Tagline

Compare device and cloud AI using the same tasks, inspectable evidence, and explicit consent.

## Problem and intended audience

Developers adopting hybrid inference need to know more than whether an answer sounds plausible. A model can report success from a plan, overlook a reopened ticket, or obey an instruction embedded inside a support record. Switching inference location can change those answers.

TraceGlass gives small engineering teams a controlled way to inspect those differences before putting real data into an application.

## What is built

A browser application with eight original fictional support cases. It asks a model to classify the current outcome and cite supporting records, then uses deterministic checks against a frozen reference answer. It preserves each response, actual inference source, timing, hashes and verdict in an exportable evidence record. Unknown outcomes and infrastructure errors remain visible.

## Firebase use

The runtime adapter uses Firebase AI Logic for on-device-only, cloud-only and device-preferred inference. Cloud-capable modes require explicit permission for the displayed synthetic records. The user initializes the device model through the Run button. App Check is required in a new, dedicated Firebase project. Live execution still needs verification; do not claim working hybrid runs until evidence is captured.

## Current evidence

See VALIDATION.md. Local checks and the production build pass. Actual on-device/cloud inference, a published app and a demo video are pending.

## Three-minute demo shot list

0:00–0:20: Explain the user decision: whether a hybrid model can correctly report evidence-grounded outcomes.

0:20–0:45: Open a missing-acknowledgement case and the reopened-ticket case. Show that the records are synthetic.

0:45–1:20: Run the controls on device and show actual source metadata. Record a real run; do not substitute scorer controls.

1:20–1:55: Explicitly allow cloud inference, run the same cases, inspect any disagreement. If both agree, say so.

1:55–2:30: Open the raw response and evidence export. Explain the infrastructure-error denominator and the difference between unknown and failure.

2:30–2:55: Show setup/source/license and explain the limitation: eight controls are not a general model ranking.

## Required finish work

- Complete registration and accept the event terms personally or with explicit action-time confirmation.
- New Firebase service project, App Check configuration, device and cloud runs.
- Physical Chrome verification and real demo recording under three minutes.
- Public new-repository source URL, license, working demo URL if deployed, English description and video URL.
- Check all entry fields and submit only when the demonstrated behavior matches the claims.
