## Inspiration

Hybrid inference changes where a model runs, but developers still need to check whether its answers are supported by evidence. A plan to fix an issue is not proof of a fix. A timeout is not proof of success. A later record can reopen a case that looked resolved.

TraceGlass Hybrid applies that question to eight original, fictional support cases.

## What it does

The browser workbench lets a developer choose device-only, device-preferred or cloud-only inference through Firebase AI Logic. Cloud-capable modes require explicit consent for the displayed synthetic records. A deterministic scorer checks each structured answer against a frozen reference: the reported outcome, the next action and the cited evidence.

The implementation preserves raw responses, actual inference-source metadata, timing and verdicts in an exportable JSON record. Infrastructure errors are counted separately from scored outputs. A separate scorer check is clearly labeled and never counted as an AI run.

## How it is built

JavaScript, Vite and the Firebase JavaScript SDK, with Firebase AI Logic and App Check integration. The eight cases cover confirmed resolution, plans without completion, missing acknowledgement, conflicting evidence, an instruction embedded in a record, reopening after success, absent outcome evidence and independent confirmation.

The source is in a new MIT-licensed repository. The Firebase project and deployment were created specifically for this entry. No production records are used.

## Verified so far

The production build and 22 automated checks pass. The deployed browser interface accepted all eight reference answers and rejected all eight unsupported answers. A cloud-mode attempt without consent was blocked, with zero live attempts recorded.

The dedicated Firebase project and web app have been created. Live device/cloud execution, App Check setup and the required demo video are still being completed. This entry remains a draft; the scorer results above are not model performance results.

## What we learned and what comes next

A useful comparison must record which inference source actually answered and distinguish invalid output from infrastructure failure. Eight controls are enough to inspect specific behaviors, but they do not establish a general model ranking.

Next: complete live inference verification, capture reproducible evidence from both modes and record the working demo.