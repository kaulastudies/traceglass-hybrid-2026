# Project boundary

This new repository is the only allowed write target for this project. Do not write to any existing repository, including ai-evaluation-lab, ProofPay or TIP work. Do not create a PR against another repository. Do not reuse their hosting projects, domains, credentials, settings or service quotas.

Use original synthetic data only. Never claim a live model result from reference controls or simulated tests. Record failures and unknowns. New service projects are required before deployment.

Verify with `npm run build && npm test`. UI tests use JSDOM and do not establish physical browser rendering or model availability. Keep live execution and submission gates explicit in VALIDATION.md.
