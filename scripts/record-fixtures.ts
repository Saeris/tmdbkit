/**
 * Records real TMDB responses into `packages/tmdbkit/fixtures/`, one file per (operation, subject), plus a `manifest.json` describing exactly what was requested. The fixtures are the evidence tmdbkit's schemas are written against: the vendored OpenAPI spec names every field but never says which ones can be `null`.
 *
 * Run: `yarn fixtures:record` (reads `TMDB_API_TOKEN` or `TMDB_API_KEY` from a git-ignored `.env`). Re-running overwrites the fixtures, so a `git diff` afterwards shows how TMDB's responses have drifted.
 *
 * Subjects are picked to cover both shapes a field takes: rich, well-known titles, and sparse, barely-catalogued ones (found 2026-10-28 by querying `discover` by ascending popularity), where TMDB returns its `null`s and empty strings. Ids that only exist at runtime (a credit, a review, a list) are taken from earlier responses and written to the manifest.
 *
 * Not recorded: session-scoped endpoints (account, ratings, guest sessions, which come in Phase 4), and the `latest` endpoints, whose subject is whatever was created last and may be adult content; their responses share the details shape.
 */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(
  dirname(fileURLToPath(import.meta.url)),
  `..`,
  `packages`,
  `tmdbkit`,
  `fixtures`
);

const token = process.env.TMDB_API_TOKEN;
const apiKey = process.env.TMDB_API_KEY;
if (!token && !apiKey) {
  throw new Error(
    `Set TMDB_API_TOKEN (read access token) or TMDB_API_KEY (v3 key) in .env`
  );
}

/** Arrays longer than this are cut down: shape, not volume, is what the fixtures are for. */
const maxArrayLength = 20;
/** Dispatch spacing, well under TMDB's ~40 req/s. */
const spacingMs = 120;

type Query = Record<string, string | number | boolean>;
type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

interface ManifestEntry {
  operation: string;
  label: string;
  path: string;
  query: Query;
  status: number;
  file: string;
  truncated: string[];
}

const manifest: ManifestEntry[] = [];
const sleep = async (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

/** Cut long arrays, recording the JSON path of each one that was cut. */
const truncate = (value: Json, path: string, cut: string[]): Json => {
  if (Array.isArray(value)) {
    if (value.length > maxArrayLength) cut.push(`${path} (${value.length})`);
    return value
      .slice(0, maxArrayLength)
      .map((item, i) => truncate(item, `${path}[${i}]`, cut));
  }
  if (value !== null && typeof value === `object`) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [
        k,
        truncate(v, path ? `${path}.${k}` : k, cut)
      ])
    );
  }
  return value;
};

/** Fetch `path` and store the response under `operation/label`. Returns the full (untruncated) body so later requests can take ids from it. */
const record = async (
  operation: string,
  label: string,
  path: string,
  query: Query = {}
): Promise<Json> => {
  await sleep(spacingMs);
  const url = new URL(`https://api.themoviedb.org/3/${path}`);
  for (const [k, v] of Object.entries(query))
    url.searchParams.set(k, String(v));
  const headers: Record<string, string> = { Accept: `application/json` };
  if (token) headers.Authorization = `Bearer ${token}`;
  else if (apiKey) url.searchParams.set(`api_key`, apiKey);

  const response = await fetch(url, { headers });
  const body = (await response.json()) as Json;
  const truncated: string[] = [];
  const file = join(operation, `${label}.json`);
  mkdirSync(join(root, operation), { recursive: true });
  writeFileSync(
    join(root, file),
    `${JSON.stringify(truncate(body, ``, truncated), null, 2)}\n`
  );
  manifest.push({
    operation,
    label,
    path,
    query,
    status: response.status,
    file: file.replaceAll(`\\`, `/`),
    truncated
  });
  console.log(`${response.status} ${operation}/${label}`);
  return body;
};

/** Read a nested field from a recorded body, failing loudly if TMDB's shape changed under us. */
const pick = (body: Json, ...keys: Array<string | number>): Json => {
  let value: Json = body;
  for (const key of keys) {
    if (value === null || typeof value !== `object`) {
      throw new Error(`Expected an object/array at ${keys.join(`.`)}`);
    }
    value = Array.isArray(value)
      ? (value[Number(key)] ?? null)
      : (value[String(key)] ?? null);
  }
  if (value === null) throw new Error(`Missing ${keys.join(`.`)}`);
  return value;
};

/** An id taken from a recorded body, for the next request path. Fails loudly unless it is a string or number. */
const idAt = (body: Json, ...keys: Array<string | number>): string => {
  const value = pick(body, ...keys);
  if (typeof value !== `string` && typeof value !== `number`) {
    throw new Error(
      `Expected an id at ${keys.join(`.`)}, got ${JSON.stringify(value)}`
    );
  }
  return String(value);
};

const subjects = {
  movies: { starWars: 11, pulpFiction: 680, sparse: 1811074 },
  tv: { gameOfThrones: 1399, sparse: 340258 },
  people: { bradPitt: 287, brando: 3084, sparse: 2345735 },
  collection: 10,
  company: 1,
  network: 49
} as const;

rmSync(root, { recursive: true, force: true });

// ── Configuration, certifications, genres, watch providers ──────────────
await record(`configuration-details`, `default`, `configuration`);
for (const part of [
  `countries`,
  `jobs`,
  `languages`,
  `primary_translations`,
  `timezones`
]) {
  await record(
    `configuration-${part.replaceAll(`_`, `-`)}`,
    `default`,
    `configuration/${part}`
  );
}
await record(`certification-movie-list`, `default`, `certification/movie/list`);
await record(`certification-tv-list`, `default`, `certification/tv/list`);
await record(`genre-movie-list`, `default`, `genre/movie/list`);
await record(`genre-tv-list`, `default`, `genre/tv/list`);
await record(`watch-providers-regions`, `default`, `watch/providers/regions`);
await record(`watch-providers-movie`, `default`, `watch/providers/movie`);
await record(`watch-providers-tv`, `default`, `watch/providers/tv`);

// ── Movies ──────────────────────────────────────────────────────────────
const movieParts = [
  `alternative_titles`,
  `changes`,
  `credits`,
  `external_ids`,
  `images`,
  `keywords`,
  `lists`,
  `recommendations`,
  `release_dates`,
  `reviews`,
  `similar`,
  `translations`,
  `videos`,
  `watch/providers`
];
for (const [label, id] of Object.entries(subjects.movies)) {
  await record(`movie-details`, label, `movie/${id}`);
  for (const part of movieParts) {
    await record(
      `movie-${part.replaceAll(/[_/]/g, `-`)}`,
      label,
      `movie/${id}/${part}`
    );
  }
}
await record(
  `movie-details`,
  `starWars-appended`,
  `movie/${subjects.movies.starWars}`,
  {
    append_to_response: movieParts.join(`,`)
  }
);
for (const list of [`now_playing`, `popular`, `top_rated`, `upcoming`]) {
  await record(`movie-${list.replaceAll(`_`, `-`)}`, `page-1`, `movie/${list}`);
}
const movieChanges = await record(
  `movie-changes-list`,
  `default`,
  `movie/changes`
);
await record(
  `movie-changes`,
  `recently-changed`,
  `movie/${idAt(movieChanges, `results`, 0, `id`)}/changes`
);

// ── TV series, seasons, episodes ────────────────────────────────────────
const tvParts = [
  `aggregate_credits`,
  `alternative_titles`,
  `changes`,
  `content_ratings`,
  `credits`,
  `episode_groups`,
  `external_ids`,
  `images`,
  `keywords`,
  `lists`,
  `recommendations`,
  `reviews`,
  `screened_theatrically`,
  `similar`,
  `translations`,
  `videos`,
  `watch/providers`
];
const onTheAir = await record(`tv-on-the-air`, `page-1`, `tv/on_the_air`);
const tvSubjects = {
  ...subjects.tv,
  airing: Number(pick(onTheAir, `results`, 0, `id`))
};
for (const [label, id] of Object.entries(tvSubjects)) {
  await record(`tv-details`, label, `tv/${id}`);
  for (const part of tvParts) {
    await record(
      `tv-${part.replaceAll(/[_/]/g, `-`)}`,
      label,
      `tv/${id}/${part}`
    );
  }
}
await record(
  `tv-details`,
  `gameOfThrones-appended`,
  `tv/${subjects.tv.gameOfThrones}`,
  {
    append_to_response: tvParts.join(`,`)
  }
);
for (const list of [`airing_today`, `popular`, `top_rated`]) {
  await record(`tv-${list.replaceAll(`_`, `-`)}`, `page-1`, `tv/${list}`);
}
const tvChanges = await record(`tv-changes-list`, `default`, `tv/changes`);
await record(
  `tv-changes`,
  `recently-changed`,
  `tv/${idAt(tvChanges, `results`, 0, `id`)}/changes`
);

const episodeGroups = await record(
  `tv-episode-groups`,
  `breakingBad`,
  `tv/1396/episode_groups`
);
await record(
  `tv-episode-group-details`,
  `breakingBad`,
  `tv/episode_group/${idAt(episodeGroups, `results`, 0, `id`)}`
);

const seasonParts = [
  `aggregate_credits`,
  `credits`,
  `external_ids`,
  `images`,
  `translations`,
  `videos`,
  `watch/providers`
];
const seasons = {
  gameOfThrones1: [1399, 1],
  gameOfThronesSpecials: [1399, 0],
  sparse: [340258, 1]
} as const;
let seasonId = 0;
for (const [label, [series, season]] of Object.entries(seasons)) {
  const details = await record(
    `tv-season-details`,
    label,
    `tv/${series}/season/${season}`
  );
  if (label === `gameOfThrones1`) seasonId = Number(pick(details, `id`));
  for (const part of seasonParts) {
    await record(
      `tv-season-${part.replaceAll(/[_/]/g, `-`)}`,
      label,
      `tv/${series}/season/${season}/${part}`
    );
  }
}
await record(
  `tv-season-details`,
  `gameOfThrones1-appended`,
  `tv/1399/season/1`,
  {
    append_to_response: seasonParts.join(`,`)
  }
);
await record(
  `tv-season-changes`,
  `gameOfThrones1`,
  `tv/season/${seasonId}/changes`
);

const episodeParts = [
  `credits`,
  `external_ids`,
  `images`,
  `translations`,
  `videos`
];
const episode = await record(
  `tv-episode-details`,
  `gameOfThrones1x1`,
  `tv/1399/season/1/episode/1`
);
for (const part of episodeParts) {
  await record(
    `tv-episode-${part.replaceAll(`_`, `-`)}`,
    `gameOfThrones1x1`,
    `tv/1399/season/1/episode/1/${part}`
  );
}
await record(`tv-episode-details`, `sparse1x1`, `tv/340258/season/1/episode/1`);
await record(
  `tv-episode-details`,
  `gameOfThrones1x1-appended`,
  `tv/1399/season/1/episode/1`,
  {
    append_to_response: episodeParts.join(`,`)
  }
);
await record(
  `tv-episode-changes`,
  `gameOfThrones1x1`,
  `tv/episode/${idAt(episode, `id`)}/changes`
);

// ── People ──────────────────────────────────────────────────────────────
const personParts = [
  `changes`,
  `combined_credits`,
  `external_ids`,
  `images`,
  `movie_credits`,
  `tagged_images`,
  `translations`,
  `tv_credits`
];
for (const [label, id] of Object.entries(subjects.people)) {
  await record(`person-details`, label, `person/${id}`);
  for (const part of personParts) {
    await record(
      `person-${part.replaceAll(`_`, `-`)}`,
      label,
      `person/${id}/${part}`
    );
  }
}
await record(
  `person-details`,
  `bradPitt-appended`,
  `person/${subjects.people.bradPitt}`,
  {
    append_to_response: personParts.join(`,`)
  }
);
await record(`person-popular`, `page-1`, `person/popular`);
const personChanges = await record(
  `person-changes-list`,
  `default`,
  `person/changes`
);
await record(
  `person-changes`,
  `recently-changed`,
  `person/${idAt(personChanges, `results`, 0, `id`)}/changes`
);

// ── Ids only known at runtime ───────────────────────────────────────────
const credits = await record(
  `movie-credits`,
  `starWars-for-credit`,
  `movie/11/credits`
);
await record(
  `credit-details`,
  `starWars-cast-0`,
  `credit/${idAt(credits, `cast`, 0, `credit_id`)}`
);
const reviews = await record(
  `movie-reviews`,
  `pulpFiction-for-review`,
  `movie/680/reviews`
);
await record(
  `review-details`,
  `pulpFiction-0`,
  `review/${idAt(reviews, `results`, 0, `id`)}`
);
const lists = await record(
  `movie-lists`,
  `starWars-for-list`,
  `movie/11/lists`
);
const listId = idAt(lists, `results`, 0, `id`);
await record(`list-details`, `starWars-0`, `list/${listId}`);
await record(`list-item-status`, `starWars-0`, `list/${listId}/item_status`, {
  movie_id: 11
});
const keywords = await record(
  `movie-keywords`,
  `starWars-for-keyword`,
  `movie/11/keywords`
);
const keywordId = idAt(keywords, `keywords`, 0, `id`);
await record(`keyword-details`, `starWars-0`, `keyword/${keywordId}`);
await record(`keyword-movies`, `starWars-0`, `keyword/${keywordId}/movies`);

// ── Collections, companies, networks ────────────────────────────────────
await record(
  `collection-details`,
  `starWars`,
  `collection/${subjects.collection}`
);
await record(
  `collection-images`,
  `starWars`,
  `collection/${subjects.collection}/images`
);
await record(
  `collection-translations`,
  `starWars`,
  `collection/${subjects.collection}/translations`
);
await record(`company-details`, `lucasfilm`, `company/${subjects.company}`);
await record(
  `company-alternative-names`,
  `lucasfilm`,
  `company/${subjects.company}/alternative_names`
);
await record(
  `company-images`,
  `lucasfilm`,
  `company/${subjects.company}/images`
);
await record(`network-details`, `hbo`, `network/${subjects.network}`);
await record(
  `network-alternative-names`,
  `hbo`,
  `network/${subjects.network}/alternative_names`
);
await record(`network-images`, `hbo`, `network/${subjects.network}/images`);

// ── Search, discover, find, trending ────────────────────────────────────
const searches = {
  collection: `star wars`,
  company: `lucasfilm`,
  keyword: `space`,
  movie: `star wars`,
  multi: `star wars`,
  person: `brad pitt`,
  tv: `game of thrones`
};
for (const [kind, query] of Object.entries(searches)) {
  await record(`search-${kind}`, query.replaceAll(` `, `-`), `search/${kind}`, {
    query
  });
}
await record(`search-movie`, `no-results`, `search/movie`, {
  query: `zzqxv-no-such-title`
});
await record(`discover-movie`, `default`, `discover/movie`);
await record(`discover-tv`, `default`, `discover/tv`);
await record(`find`, `imdb-starWars`, `find/tt0076759`, {
  external_source: `imdb_id`
});
await record(`find`, `tvdb-gameOfThrones`, `find/121361`, {
  external_source: `tvdb_id`
});
// So `person_results` and `tv_season_results` are evidence too, not only ever `[]`.
await record(`find`, `imdb-bradPitt`, `find/nm0000093`, {
  external_source: `imdb_id`
});
await record(`find`, `tvdb-gameOfThrones1`, `find/364731`, {
  external_source: `tvdb_id`
});
for (const kind of [`all`, `movie`, `tv`, `person`]) {
  await record(`trending-${kind}`, `day`, `trending/${kind}/day`);
}
await record(`trending-all`, `week`, `trending/all/week`);

// ── Errors (so error shapes are evidence too) ───────────────────────────
await record(`error`, `not-found`, `movie/999999999`);

writeFileSync(
  join(root, `manifest.json`),
  `${JSON.stringify({ recordedAt: new Date().toISOString(), language: `en-US (TMDB default)`, entries: manifest }, null, 2)}\n`
);
console.log(`\nRecorded ${manifest.length} responses into ${root}`);
