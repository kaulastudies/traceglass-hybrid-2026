# TraceGlass Hybrid

Compare how on-device and cloud AI handle the same evidence-grounded support tasks. TraceGlass asks whether a fictional support ticket is resolved, unresolved, or unknown, then independently checks both the answer and its supporting record IDs.

This is an independent new project with its own repository, Firebase project and GitHub Pages deployment. It does not connect to existing project runtimes or credentials.

## Current status

Implemented: eight original synthetic controls, strict output grading, Firebase AI Logic runtime adapter, device-only and cloud-capable modes, explicit cloud consent, per-attempt evidence export, and a responsive browser interface. `npm run build` passes. Local verification is documented in `VALIDATION.md`.

The [deployed scorer demo](https://kaulastudies.github.io/traceglass-hybrid-2026/) was checked in Chrome: eight reference answers accepted, eight unsupported answers rejected, and cloud mode blocked without consent. Firebase project `traceglass-hybrid-2026` and the TraceGlass Web app are created; Gemini Developer API setup is complete on the free Spark plan. BuildHybridAI registration and the Devpost draft are saved.

Still pending: App Check provider registration, live on-device/cloud inference, the demo video and final submission. The hosted build currently runs scorer controls only. No model performance results or prize claims are made.

## Run

Node.js 24 was used for validation.

```sh
npm ci
npm run build
npm test
npm run dev
```

Open http://127.0.0.1:8793. The scorer-control check works without credentials. It is explicitly labelled as a reference check, not an AI model run.

## Enable live inference in a NEW service project

1. Create a new Firebase project dedicated to TraceGlass. Never select an existing Lab, ProofPay or other service project.
2. Enable Firebase AI Logic with the Gemini Developer API and keep App Check enforced.
3. Register a web app and configure the reCAPTCHA Enterprise App Check provider. Create a score-based Web key in the same new project and allow only the app's hosting domain; do not allow localhost on the production key. Keep the default risk threshold and token lifetime.
4. Copy `.env.example` to `.env.local`; enter only the new app's web configuration and site key. No service-account or Gemini secret belongs in this client application.
5. For localhost development, set `VITE_APPCHECK_DEBUG=true` and register the generated debug token in the new project's App Check settings. Do not publish the token or a debug build. Production ignores this flag.
6. Follow the official [hybrid web setup](https://firebase.google.com/docs/ai-logic/hybrid/web/get-started) for the Chrome model. Browser flags, downloads and restarts are user-controlled.
7. Restart the development server after configuration changes. Use the Run button to initialize the device model and execute the controls.

The adapter imports and calls `getAI`, `getGenerativeModel`, `initializeDeviceModel` and `generateContent` from Firebase AI Logic. Firebase is pinned to 13.3.0 with a lockfile. Cloud alias: `gemini-3.5-flash-lite`; aliases can change. The installed SDK uses lowercase inference-source enum values, normalized in the evidence record.

## Evidence contract

- Each model call is a distinct attempt with a UUID, batch ID, case ID, mode, explicit cloud-consent state, prompt digest, dataset digest, grader version, timestamp, raw output and actual source metadata.
- The prompt contains only original fictional records and the grading instruction. Reference answers remain outside the model prompt.
- `PASS` requires exact outcome, action and minimal evidence-set agreement. `FAIL` means valid structured output disagrees. `INVALID_OUTPUT` means the response violates the output contract. `INFRA_ERROR` is not scored as a model failure.
- No automatic retries. Infrastructure failure stops a batch. “Stop after current” prevents further calls; it does not claim to cancel a request already sent.
- Exports preserve attempts. They are unsigned client-side records. Hashes bind bytes and do not establish origin, honesty, completeness or independent execution.
- Eight selected controls are not a representative benchmark. No global ranking, significance claim, cost estimate or superiority claim is warranted.

## Privacy and operation

Device-only inference is the default. Cloud-capable modes are blocked until the user explicitly allows transmission of the displayed synthetic records for that batch. Consent clears after the batch. Firebase initialization/App Check can contact Google even for device-only inference; this is not a claim of total network isolation. Fonts are loaded from Google Fonts.

There are no production tools, uploads, user-ticket imports, payment operations, server-side data storage or background scheduled runs. Results remain in browser memory until exported. Start with a free-tier dedicated project; do not attach billing or use another project's quota as a shortcut. Model availability and quota can still block runs.

## BuildHybridAI submission gate

The intended event is [BuildHybridAI 2026](https://firebasehybridaihackathon.devpost.com/). Before submitting: complete registration; create the dedicated Firebase project; demonstrate real on-device and cloud behavior; retain unedited exports; review the actual Chrome layout; publish source and license; record a video under three minutes showing the app working; and complete the Devpost entry. See `SUBMISSION_DRAFT.md`.

This code is not an entry for Homingo or Agentware: their coding windows have not started. Do not claim Kiro usage for code written without Kiro.

## Sources and license

Original code and synthetic data are MIT licensed. Third-party packages retain their own licenses. API design was checked against Firebase's [hybrid setup](https://firebase.google.com/docs/ai-logic/hybrid/web/get-started), [configuration guide](https://firebase.google.com/docs/ai-logic/hybrid/web/configuration-options), and the installed Firebase 13.3.0 type declarations on November 15, 2026 IST. No sponsor endorsement is implied.
