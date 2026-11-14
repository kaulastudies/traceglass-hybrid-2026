# Validation — 15 November 2026 IST

| Gate | Status | Evidence |
| --- | --- | --- |
| Separate project | PASS | Newly created `kaulastudies/traceglass-hybrid-2026`; no shared git history or deployment configuration |
| Production bundle | PASS | `npm run build`; Vite 8.3.8; Firebase 13.3.0; Node 24.22.1 |
| Local checks | PASS | `npm test`: 22 passed, 0 failed |
| Eight known-good controls | PASS | Each reference response accepted; fabricated evidence rejected |
| Outcome failures | PASS | Lost acknowledgement, conflicting sources and later reopening reject false completion |
| Consent boundary | PASS | Cloud-capable modes blocked without boolean consent; device-only allowed |
| Source metadata | PASS (unit) | Installed SDK lowercase values normalized; unknown metadata stays UNKNOWN |
| Error denominator | PASS | Infrastructure errors reported separately from judged outputs |
| UI behavior | PASS (JSDOM) | Production bundle renders 8 cases; scorer controls do not inflate run counts; missing configuration blocks calls |
| Physical browser/rendering | NOT RUN | JSDOM is not a screenshot or actual Chrome validation |
| New Firebase project/App Check | BLOCKED | Dedicated service project and configuration not provisioned |
| On-device model | NOT RUN | Real device-model availability and generation unverified |
| Cloud model | NOT RUN | No live inference requests or charges initiated |
| Source authenticity | UNVERIFIED | Exports are unsigned client-side records; not independent attestations |
| Deployment | NOT RUN | No hosting integration or production deployment configured |
| Hackathon registration | INCOMPLETE | Form prepared; account-status answer and terms acceptance still needed |
| Hackathon submission | NOT SUBMITTED | Live evidence, demo video and complete entry remain required |

Commands: `npm run build && npm test`. UI tests require the current build. Tests use original controls and a DOM simulator; they do not demonstrate runtime use of a model. API compatibility was checked against the installed package declarations and Firebase's current documentation.
