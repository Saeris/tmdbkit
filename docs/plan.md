# tmdbkit: plan

Goal: a publishable, type-safe client for the **whole TMDB v3 API** that holds the same quality bar as `@discordkit/*` and `valimock`. Its first consumer is mediameta (`../mediameta`, design in its `docs/03-tmdb-api.md`).

## Decisions (2026-10-28)

| Decision                 | Choice                                                                                                                                                                 | Why                                                                                                                                                                                                                                              |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Reference implementation | **discordkit's conventions win** where they apply: one operation per file, `Fetcher` type, `schema<T>()`, `tmdb` session singleton, MockUtils specs                    | It's the most scrutinised of the owner's libraries. Where mediameta's doc 03 disagrees, this table records the call.                                                                                                                             |
| Runtime validation       | **Opt-in** via `toValidated(fetcher, input, output)`, exactly as in discordkit. Schemas are exported for consumers.                                                    | Same contract as discordkit. Supersedes doc 03 §2.2's "validated on every call". mediameta wraps the calls it makes from untrusted input.                                                                                                        |
| Schema style             | Schemas describe the **wire** (camelCased) with **no transforms**. Dates stay `string`; TMDB's `""` for unknown dates is allowed.                                      | `toValidated` returns the fetched value, not the parse output (discordkit semantics), so a transform would make types lie. Supersedes doc 03 §2.3's `tmdbDate` transform.                                                                        |
| Nullability source       | **Recorded live responses**, not the OpenAPI spec                                                                                                                      | The vendored spec has zero `nullable`/`required` markers. It is right about field names and wrong about nulls (e.g. `belongs_to_collection`).                                                                                                    |
| Rate limiting            | Client-side limiter, default **20 req/s**, configurable; requests run **concurrently** within it. Backoff on `429` (honours `Retry-After`), `5xx`, and network errors. | TMDB: the legacy 40/10 s limit is gone since 2019-12-16; the current ceiling is "~40 req/s", no headers ([docs](https://developer.themoviedb.org/docs/rate-limiting), verified 2026-10-28). Unlike Discord there are no buckets to serialise on. |
| Cancellation             | `RequestOptions.signal` (`AbortSignal`), the fetcher's second argument as in discordkit's options                                                                      | mediameta's scrape tasks are cancellable.                                                                                                                                                                                                        |
| Query arrays             | Arrays are **comma-joined**. OR-logic (`a\|b`) is passed as a string.                                                                                                  | TMDB never uses repeated keys. `append_to_response` is "comma separated, 20 items max" (spec).                                                                                                                                                   |
| Test utilities           | Private workspace package `@saeris/tmdbkit-test-utils`, imported by specs through `#mocks`                                                                             | Mirrors `@discordkit/test-utils`; keeps msw/valimock out of the published package.                                                                                                                                                               |
| Scope                    | All 152 operations. Phase 3 covers the ~125 read endpoints first (mediameta needs them); Phase 4 adds the session-scoped ones.                                         | "Complete" per the owner. discordkit covers its whole API.                                                                                                                                                                                       |

## Phases

Each phase ends with `vp check` + `vp test` green and a commit.

0. **Hygiene.** Repo docs (`AGENTS.md`, this plan), LICENSE, CI + release workflows and `.bumpy` config copied from valimock, test-utils moved into its own private package.
1. **Request layer.** Session (auth resolution, env fallback, limiter, retries, signal), `request` (`TmdbApiError`), `addParams` (comma arrays), `buildURL`, `toValidated` (option forwarding). Specs at discordkit's depth (`DiscordSession.spec.ts`, `request.spec.ts`) using fake timers. MockUtils also records each outgoing request, so op specs can assert path, query and auth instead of only echoing a mock.
2. **Fixtures.** `scripts/record-fixtures.ts` (needs `TMDB_API_TOKEN`) records one real response per read endpoint into `fixtures/`, from a curated id list (movies/shows with and without collections, missing dates, adult flags, etc.). Re-runnable to detect drift.
3. **Read endpoints.** For every read endpoint: an input schema, an output schema (field names from the spec, nullability from fixtures, JSDoc), the op file, and a spec that (a) asserts the outgoing request and (b) parses the recorded fixture with the output schema. Appended payloads are typed as optional keys. Discover inputs encode the filter knowledge from `../tmdb-api/src/sources/tmdb/build*.ts`.
4. **Session-scoped endpoints.** Request token → session flow, account, lists, ratings, guest sessions.
5. **Helpers.** `imageUrl(path, size)` over the documented size picklists. Configuration caching stays in the app.
6. **Publish.** `vp pack` → `dist/`, exports checked from a consumer (mediameta, without the source condition), README in valimock's format with an API coverage table, `npm pack --dry-run`, first bumpy changeset.

## Status (2026-10-28)

- Done before this plan (Qwen): scaffold; request layer port; 13 entities; 10 ops (search ×4, movie, tv/season/episode, person, configuration); echo-style specs.
- Audit of that state: `../mediameta/docs/03-tmdb-api.md` §6.
- Qwen's formatting-only working-tree churn is stashed (`stash@{0}`), not discarded.
- **Phase 0 done** (`7f0789d`): plan, AGENTS.md, release setup, private test-utils package, `vp run build` works.
- **Phase 1 done:** session rebuilt (concurrent limiter, 429/5xx/network retries, `AbortSignal` throughout, api key never in the caller's URL or error messages), arrays comma-joined, `toValidated` forwards options, `base` URL override dropped (unused, not in discordkit). 72 specs, all network mocking through msw; mutation-checked (4/5 caught, the 5th is an equivalent mutation). MockUtils records each received request, and the `getMovie` spec shows the pattern.
- The 9 other op specs still only echo; Phase 3 rewrites every op and its spec.
- **Next:** Phase 2 needs a TMDB token (`TMDB_API_TOKEN` in a git-ignored `.env`).

## Risks and open questions

- **No token yet.** Phase 2–3 nullability depends on recorded responses. Without them, schemas would be guessed, which D-015 in mediameta forbids.
- **The spec lags the API.** Fixtures are the arbiter; spec-vs-fixture differences get noted in the op's JSDoc.
- **Adult content in fixtures.** Pick ids so committed fixtures stay SFW.
