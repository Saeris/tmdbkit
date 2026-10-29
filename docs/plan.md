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
- **Phase 2 done:** `yarn fixtures:record` stores 233 real responses (114 operations, re-recorded 2026-10-28 with a v3 key) in `packages/tmdbkit/fixtures/`, with `manifest.json` and `shapes.json`, the per-field evidence (kinds seen, how often absent). Arrays are capped at 20 items. Subjects mix rich titles with sparse ones found by ascending popularity.
- **Phase 3 done:** all 116 read operations (Qwen's 10 rebuilt among them), 410 specs. Every spec checks the request sent and that every recorded fixture passes the response schema; a full re-record changed no outcome. Where evidence and the obvious shape disagreed, the schema follows the evidence and its JSDoc says so with the date (list `posterPath` a number, episode details without `showId`, season `_id` arriving as `Id`, …).
- **Next:** Phase 4, the 27 session-scoped operations (auth, account, lists, ratings, guest sessions, account states).

## Phase 3 conventions

The checklist is `scripts/codegen/operations.ts` (116 read operations, checked against the spec and the fixtures). Per operation:

- **Files** follow discordkit: `src/<domain>/<name>.ts` (input schema `<name>Schema` + `Fetcher`), `src/<domain>/__tests__/<name>.spec.ts`. Response schemas live where `outputFrom` says: `src/types/` for entities shared across domains, `src/<domain>/types/` otherwise. Each exports `xEntries` (when other schemas extend it), the interface, and `xSchema = schema<X>(…)`.
- **Inputs.** Path params are top-level camelCase (`movieId`, `seriesId`, `seasonNumber`); query params go under `params`, typed from the spec (enums → `v.picklist`, int32 → integer). Dotted range params are nested objects that `addParams` flattens: `voteAverage: { gte: 7 }` → `vote_average.gte=7`. Comma lists are arrays; OR-lists are a `|`-joined string. `appendToResponse` is a picklist array of at most 20.
- **Outputs** come from `node scripts/codegen/draft.ts <fixture> [path]`, then a person names the shared entities and documents only what isn't obvious from the name (`""` meaning unknown, record keys being ISO codes). Appended keys are `v.exactOptional(omitFields(standaloneSchema, ["id"]))` on the details schema. Mixed-media lists (`search/multi`, `trending/all`, `known_for`) are a `v.variant(`mediaType`, …)`.
- **Specs** (scaffolded by `scripts/codegen/scaffold.ts`, which never overwrites a file) check two things: the request that was sent (path, plus each given param in the query), and that **every recorded fixture** for the operation passes the output schema. The second is what catches a wrong nullability.

## What the fixtures established (2026-10-28)

Schema authors: read `fixtures/shapes.json` for the operation, and also check the field name across operations, since four samples can't show every `null`.

- **Appended payloads equal the standalone response minus its `id`**, byte for byte (`movie-details/starWars-appended` vs `movie-credits/starWars`). So the type of an appended key is `Omit<StandaloneResponse, "id">`, exact-optional on the details schema. The watch-providers key is literally `"watch/providers"`, and camel-casing leaves it as is.
- **TMDB uses `""` and `null` per field, not by rule.** `""` for unknown `release_date`, `first_air_date`, `overview`, `tagline`, `biography`; `null` for `air_date`, `birthday`, `deathday`, `imdb_id` and most external ids, `runtime`; both for `homepage`, `tiktok_id`, `youtube_id` and ISO codes. Image `*_path` fields are nullable (`file_path` inside image lists is not).
- **The spec misses fields** (`softcore` on movies) and **mislabels operation ids** (`details-copy`, `lists-copy`, `translations`), so op names come from the path, not the `operationId`.
- `episode_run_time` was always `[]`, and `origin_country` is an array on most entities but a string on some.

## Risks and open questions

- **Evidence is samples, not proof.** A field never seen `null` may still be nullable; when the field name is nullable elsewhere (e.g. `logo_path`), treat it as nullable. Re-record before a release to catch drift.
- **The spec lags the API.** Fixtures are the arbiter; spec-vs-fixture differences get noted in the op's JSDoc.
- **Adult content in fixtures.** Subjects are hand-picked and SFW; `latest` endpoints aren't recorded for that reason.
