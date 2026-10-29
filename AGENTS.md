# General Rules of Contribution

These rules apply to every task in this project unless explicitly overridden. Bias: caution over speed on non-trivial work. Use judgment on trivial tasks.

## Rule 1 — Think Before Coding

State assumptions explicitly. If uncertain, ask rather than guess. Present multiple interpretations when ambiguity exists. Push back when a simpler approach exists. Stop when confused. Name what's unclear.

## Rule 2 — Simplicity First

Minimum code that solves the problem. Nothing speculative. No features beyond what was asked. No abstractions for single-use code. Test: would a senior engineer say this is overcomplicated? If yes, simplify.

## Rule 3 — Surgical Changes

Touch only what you must. Clean up only your own mess. Don't "improve" adjacent code, comments, or formatting. Don't refactor what isn't broken. Match existing style.

## Rule 4 — Goal-Driven Execution

Define success criteria. Loop until verified. Don't follow steps. Define success and iterate. Strong success criteria let you loop independently.

## Rule 5 — Use the model only for judgment calls

Use me for: classification, drafting, summarization, extraction. Do NOT use me for: routing, retries, deterministic transforms. If code can answer, code answers.

## Rule 6 — Surface conflicts, don't average them

If two patterns contradict, pick one (more recent / more tested). Explain why. Flag the other for cleanup. Don't blend conflicting patterns.

## Rule 7 — Read before you write

Before adding code, read exports, immediate callers, shared utilities. "Looks orthogonal" is dangerous. If unsure why code is structured a way, ask.

## Rule 8 — Tests verify intent, not just behavior

Tests must encode WHY behavior matters, not just WHAT it does. A test that can't fail when business logic changes is wrong.

## Rule 9 — Checkpoint after every significant step

Summarize what was done, what's verified, what's left. Don't continue from a state you can't describe back. If you lose track, stop and restate.

## Rule 10 — Match the codebase's conventions, even if you disagree

Conformance > taste inside the codebase. If you genuinely think a convention is harmful, surface it. Don't fork silently.

## Rule 11 — Fail loud

"Completed" is wrong if anything was skipped silently. "Tests pass" is wrong if any were skipped. Default to surfacing uncertainty, not hiding it.

## Rule 12 — Soft-wrap markdown-format prose

Do not hard-wrap lines in markdown-format text: markdown files, code comments, and commit/PR messages. Write each paragraph as a single soft-wrapped line and let the editor wrap it. Hard line breaks belong only where they are semantic (list items, headings, code blocks).

# Project: tmdbkit

A type-safe TMDB v3 client (`packages/tmdbkit`, published as `@saeris/tmdbkit`). Its first consumer is mediameta (`../mediameta`).

- **Plan, decisions and status: `docs/plan.md`.** Read it before non-trivial work; update its _Status_ in the same commit as the work.
- **Reference implementation: `../discordkit`** (`packages/core/src/requests/`, `packages/client/src/`, `packages/test-utils/`). New code follows its patterns unless `docs/plan.md` records a deliberate difference. `../valimock` is the reference for packaging, README and release setup.
- **TMDB facts come from TMDB, not memory.** Field names: `docs/openapi/tmdb-api-v3.json`. Nullability: recorded responses in `fixtures/`. Limits/auth: developer.themoviedb.org, linked with a `verified YYYY-MM-DD` date. If you can't verify something, say so in the JSDoc.
- Never commit API tokens. `TMDB_API_TOKEN` lives in a git-ignored `.env`.

## Commits

Conventional Commit subject, `type(scope): plain-language outcome` (scopes: `session`, `request`, `movie`, `tv`, `search`, … or `repo`/`docs`), with a soft-wrapped prose body that explains what changed and why, plus an "Also:" list for secondary changes (see `../markdown` and `../syrp-genie` history). End the body with:

```
Verified: <commands that ran and their result>
Next: <what's left open, if anything>
```

# Toolchain

Yarn 4 workspaces + Vite+ (`vp`). Run `vp check` (format, lint, type-check) and `vp test` before committing. Docs: `node_modules/vite-plus/docs` or https://viteplus.dev/guide/. Wallaby, when running, gives the same results faster (see mediameta's `AGENTS.md` for the workflow).
