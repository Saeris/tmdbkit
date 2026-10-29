import { sleep } from "../utils/sleep.js";
import type { RequestMethod } from "./request.js";

/** Base URL for the TMDB v3 REST API. */
export const endpoint = "https://api.themoviedb.org/3/" as const;

/**
 * Environment variable read for the **API Read Access Token** when no token has been set explicitly. The token is sent as `Authorization: Bearer <token>` and works against both the v3 and v4 endpoints.
 */
export const TOKEN_ENV_VAR = "TMDB_API_TOKEN" as const;

/**
 * Environment variable read for the legacy **v3 API key** when no bearer token is available. Sent as the `?api_key=<key>` query parameter.
 */
export const API_KEY_ENV_VAR = "TMDB_API_KEY" as const;

/**
 * The API Read Access Token from the environment, or `null` when unavailable. `process` is absent on some runtimes (browsers, bare Cloudflare Workers), so the lookup is guarded rather than read directly.
 */
export const tokenFromEnv = (): string | null => {
  if (typeof process === `undefined`) return null;
  const token = process.env[TOKEN_ENV_VAR];
  return token === undefined || token === `` ? null : token;
};

/** The legacy v3 API key from the environment, or `null` when unavailable. */
export const apiKeyFromEnv = (): string | null => {
  if (typeof process === `undefined`) return null;
  const key = process.env[API_KEY_ENV_VAR];
  return key === undefined || key === `` ? null : key;
};

/**
 * The resolved credentials for a single request. A bearer token is preferred (sent as the `Authorization` header); when only a v3 API key is available it is appended to the query string instead.
 */
interface ResolvedAuth {
  authorization?: string;
  apiKey?: string;
}

/** A client-side rate limit: at most `requests` dispatches in any `perMs` window. */
export interface RateLimit {
  requests: number;
  perMs: number;
}

/** What {@link TmdbSession.fetch} needs to send one request. */
export interface SessionRequest {
  method: RequestMethod;
  body?: string | null;
  signal?: AbortSignal;
}

/**
 * The default client-side limit. TMDB retired its 40-requests-per-10-seconds limit on 2019-12-16; its docs now put the ceiling "somewhere in the 40 requests per second range" and warn it "could change at any time" (https://developer.themoviedb.org/docs/rate-limiting, verified 2026-10-28). Half of that leaves headroom for other clients on the same IP.
 */
export const defaultRateLimit: RateLimit = { requests: 20, perMs: 1000 };

/**
 * Responses worth retrying: rate limited, or a transient failure on TMDB's side. Everything else (`401` bad credentials, `404` unknown id, `422` bad params) fails the same way every time.
 */
const retryableStatuses = new Set([429, 500, 502, 503, 504]);

/**
 * How long a `429`'s `Retry-After` asks us to wait, in ms, or `null` when absent or unparsable. TMDB doesn't document the header, so both of its HTTP forms are accepted: delta-seconds and an HTTP date.
 */
const retryAfterMs = (response: Response): number | null => {
  const header = response.headers.get(`Retry-After`);
  if (header === null || header.trim() === ``) return null;
  const seconds = Number(header);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
  const date = Date.parse(header);
  return Number.isNaN(date) ? null : Math.max(0, date - Date.now());
};

/**
 * A session against the TMDB API. It holds the credentials (an API Read Access Token and/or a legacy v3 API key), keeps dispatches under a client-side {@link RateLimit}, and retries rate-limited and transient failures with backoff.
 *
 * Unlike discordkit's `DiscordSession`, requests are not serialised through a queue: TMDB has no per-route buckets to track, so requests run concurrently and only their _dispatch_ is spaced out. There is also no token exchange or refresh, because the API Read Access Token is used directly.
 */
export class TmdbSession {
  readonly endpoint: string = endpoint;
  /** Retries after the first attempt, for `429`, `5xx` and network failures. */
  maxRetries: number = 3;
  /** Base delay in ms for exponential backoff (`retryDelay * 2^attempt`), used when TMDB gives no `Retry-After`. */
  retryDelay: number = 500;

  #bearerToken: string | null = null;
  #apiKey: string | null = null;

  #rateLimit: RateLimit = defaultRateLimit;
  #dispatches: number[] = [];
  // Callers take turns claiming a dispatch slot, so two concurrent callers can't both see the same free slot. Only the claiming is sequential; the fetches overlap.
  #turn: Promise<void> = Promise.resolve();
  #waiting = 0;

  constructor(options?: {
    token?: string;
    apiKey?: string;
    rateLimit?: RateLimit;
  }) {
    if (options?.token) this.setToken(options.token);
    if (options?.apiKey) this.setApiKey(options.apiKey);
    if (options?.rateLimit) this.setRateLimit(options.rateLimit);
  }

  /**
   * Set the **API Read Access Token** (the bare token, without a `Bearer ` prefix; it is added for you). This is the preferred credential and works against both the v3 and v4 endpoints.
   */
  setToken = (token: string): this => {
    if (token.length === 0) {
      throw new Error(`Must provide a non-empty string to set the API token`);
    }
    this.#bearerToken = token;
    return this;
  };

  /**
   * Set the legacy **v3 API key**. Used only when no bearer token is present, sent as the `?api_key=` query parameter.
   */
  setApiKey = (key: string): this => {
    if (key.length === 0) {
      throw new Error(`Must provide a non-empty string to set the API key`);
    }
    this.#apiKey = key;
    return this;
  };

  /** Replace the client-side rate limit, e.g. to go slower when sharing an IP with other TMDB clients. */
  setRateLimit = (rateLimit: RateLimit): this => {
    const { requests, perMs } = rateLimit;
    if (!Number.isInteger(requests) || requests < 1 || !(perMs > 0)) {
      throw new Error(
        `A rate limit needs a whole number of requests (>= 1) per a positive number of ms, received ${requests} per ${perMs}ms`
      );
    }
    this.#rateLimit = { requests, perMs };
    return this;
  };

  /** Clear all credentials and rate-limit state, and restore the default rate limit. */
  clearSession = (): this => {
    this.#bearerToken = null;
    this.#apiKey = null;
    this.#rateLimit = defaultRateLimit;
    this.#dispatches = [];
    return this;
  };

  /**
   * Whether a request can authenticate right now: either a bearer token or a v3 API key is set (explicitly or via the environment).
   */
  get hasAuth(): boolean {
    return (
      this.#bearerToken !== null ||
      tokenFromEnv() !== null ||
      this.#apiKey !== null ||
      apiKeyFromEnv() !== null
    );
  }

  /**
   * Resolve the credentials to use for a request. An explicit credential wins over the environment, and a bearer token (explicit or from the environment) wins over a v3 API key.
   *
   * @throws When no credential is available at all.
   */
  resolveAuth = (): ResolvedAuth => {
    const bearer = this.#bearerToken ?? tokenFromEnv();
    if (bearer) return { authorization: `Bearer ${bearer}` };

    const key = this.#apiKey ?? apiKeyFromEnv();
    if (key) return { apiKey: key };

    throw new Error(
      `No TMDB credentials are set, so the request cannot be authorized. Call tmdb.setToken("<API Read Access Token>"), or set ${TOKEN_ENV_VAR} (preferred) / ${API_KEY_ENV_VAR} in the environment.`
    );
  };

  /**
   * Send a request: wait for a dispatch slot, attach credentials, and retry `429`, `5xx` and network failures up to {@link maxRetries} times. The final response is returned whatever its status; turning a failed response into an error is the caller's job (see `request`).
   *
   * Aborting `signal` rejects with its reason, whether the request is waiting for a slot, in flight, or backing off.
   */
  fetch = async (resource: URL, init: SessionRequest): Promise<Response> => {
    for (let attempt = 0; ; attempt++) {
      await this.#acquire(init.signal);

      const auth = this.resolveAuth();
      const url = new URL(resource);
      const headers: Record<string, string> = { Accept: `application/json` };
      if (auth.authorization) headers.Authorization = auth.authorization;
      if (auth.apiKey) url.searchParams.set(`api_key`, auth.apiKey);
      if (init.body) headers[`Content-Type`] = `application/json`;

      let response: Response;
      try {
        response = await fetch(url, {
          method: init.method,
          body: init.body,
          headers,
          signal: init.signal
        });
      } catch (error) {
        // An abort is the caller's decision, not a transient failure.
        if (init.signal?.aborted || attempt >= this.maxRetries) throw error;
        await sleep(this.retryDelay * 2 ** attempt, init.signal);
        continue;
      }

      if (
        !retryableStatuses.has(response.status) ||
        attempt >= this.maxRetries
      ) {
        return response;
      }

      const wait = retryAfterMs(response) ?? this.retryDelay * 2 ** attempt;
      // Release the connection held by the unread body before waiting.
      await response.body?.cancel();
      await sleep(wait, init.signal);
    }
  };

  /** Requests currently waiting for a dispatch slot (useful for monitoring). */
  getQueueSize = (): number => this.#waiting;

  /**
   * Claim one dispatch slot under the rate limit. A caller whose signal aborts while waiting gives up its turn without using a slot; a later caller then moves straight on.
   */
  #acquire = async (signal?: AbortSignal): Promise<void> => {
    this.#waiting++;
    const previous = this.#turn;
    const turn = (async (): Promise<void> => {
      await previous;
      await this.#claimSlot(signal);
    })();
    // The next caller waits on this turn settling, never on it succeeding: an aborted turn must not stall the callers behind it. The abort itself reaches this caller through `await turn` below.
    this.#turn = (async (): Promise<void> => {
      try {
        await turn;
      } catch {
        // handled by the caller that owns the turn
      }
    })();
    try {
      await turn;
    } finally {
      this.#waiting--;
    }
  };

  #claimSlot = async (signal?: AbortSignal): Promise<void> => {
    for (;;) {
      signal?.throwIfAborted();
      const now = Date.now();
      const { requests, perMs } = this.#rateLimit;
      this.#dispatches = this.#dispatches.filter((at) => now - at < perMs);
      if (this.#dispatches.length < requests) {
        this.#dispatches.push(now);
        return;
      }
      await sleep(perMs - (now - this.#dispatches[0]), signal);
    }
  };
}

/** Shared session singleton, configured once (`tmdb.setToken(…)`) and used by every operation. */
export const tmdb: TmdbSession = new TmdbSession();
